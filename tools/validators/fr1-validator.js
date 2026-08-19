#!/usr/bin/env node

/**
 * BiModal Design FR-1 Validator
 * Tests if a URL meets the FR-1: Initial Payload Accessibility requirement
 *
 * Usage: node fr1-validator.js <url>
 * Or: npx bmd-validate <url>
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  gray: '\x1b[90m',
};

function log(color, symbol, message) {
  console.log(`${color}${symbol}${COLORS.reset} ${message}`);
}

function fetchInitialPayload(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const options = {
      headers: {
        'User-Agent': 'BiModal Design-Validator/1.0 (Simple HTTP; No JS)',
      },
    };

    const req = client.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Element ids the major client-side frameworks mount into. A page whose primary
 * content only exists inside one of these after hydration is invisible to the
 * ~80% of agents that fetch over plain HTTP and never execute JavaScript.
 */
const SPA_MOUNT_IDS = ['root', 'app', '__next', '___gatsby', '__nuxt', 'svelte', 'q-app'];

/** Minimum visible characters before a region counts as carrying real content. */
const CONTENT_TEXT_MIN = 200;

/** Elements whose children are raw text rather than markup. */
const RAW_TEXT_ELEMENTS = ['script', 'style'];

/**
 * Patterns applied to one tag at a time. Anchored or short, so they cannot
 * backtrack across the document the way `<meta[^>]*property=` does.
 */
const IS_META = /^<meta\b/i;
const OG_PROPERTY = /\sproperty\s*=\s*["']og:/i;
const IS_ANCHOR = /^<a\b/i;
const HAS_HREF = /\shref\s*=/i;

/** Cap on content regions inspected, so a hostile payload cannot go quadratic. */
const MAX_CONTENT_REGIONS = 25;

/**
 * Index just past the comment opened at `start`. Browsers close a comment on
 * `-->` and also on `--!>`, and treat `<!-->` as an empty one.
 */
function endOfComment(html, start) {
  const plain = html.indexOf('-->', start + 2);
  const bang = html.indexOf('--!>', start + 2);

  if (plain === -1 && bang === -1) {
    return html.length;
  }
  if (bang === -1 || (plain !== -1 && plain < bang)) {
    return plain + 3;
  }
  return bang + 4;
}

/** Whether a tag for `name` starts at `index` (rather than a longer name). */
function tagNameMatchesAt(lower, index, name) {
  if (!lower.startsWith(name, index)) {
    return false;
  }
  const next = lower[index + name.length];
  return next === undefined || next === '>' || next === '/' || /\s/.test(next);
}

/**
 * Index just past the closing tag of the raw-text element whose content starts
 * at `from`. Accepts every closing spelling browsers accept, `</script >` and
 * `</script foo="bar">` included.
 */
function endOfRawTextElement(html, lower, from, name) {
  const needle = `</${name}`;
  let at = lower.indexOf(needle, from);

  while (at !== -1) {
    if (tagNameMatchesAt(lower, at + 2, name)) {
      const close = html.indexOf('>', at);
      return close === -1 ? html.length : close + 1;
    }
    at = lower.indexOf(needle, at + needle.length);
  }

  return html.length;
}

/**
 * Remove everything an HTTP-only agent cannot read as content: comments, and the
 * source of <script> and <style> elements.
 *
 * Stripping tags alone (`replace(/<[^>]*>/g, '')`) removes the tags but leaves
 * inline CSS and JS behind, so a bare SPA shell with a stylesheet and a data
 * blob measures as thousands of characters of "text".
 *
 * This scans left to right with indexOf rather than matching elements with
 * regexes, because both obvious regexes are wrong for a validator pointed at
 * arbitrary remote URLs:
 *
 * - `<!--[\s\S]*?-->` backtracks quadratically over a payload carrying many
 *   unterminated `<!--`. 16k of them cost ~300ms, and the curve is O(n^2).
 * - `<script\b[^>]*>[\s\S]*?<\/script>` misses `</script >`, a spelling
 *   browsers honour, which leaks script source back into the visible-text
 *   measurement and reopens the false pass this check exists to close.
 */
function stripNonRenderable(html) {
  const lower = html.toLowerCase();
  let out = '';
  let cursor = 0;

  while (cursor < html.length) {
    const start = html.indexOf('<', cursor);

    if (start === -1) {
      break;
    }

    if (lower.startsWith('<!--', start)) {
      out += html.slice(cursor, start) + ' ';
      cursor = endOfComment(html, start);
      continue;
    }

    const rawText = RAW_TEXT_ELEMENTS.find((name) => tagNameMatchesAt(lower, start + 1, name));

    if (rawText) {
      const openEnd = html.indexOf('>', start);
      out += html.slice(cursor, start) + ' ';
      cursor =
        openEnd === -1 ? html.length : endOfRawTextElement(html, lower, openEnd + 1, rawText);
      continue;
    }

    out += html.slice(cursor, start + 1);
    cursor = start + 1;
  }

  return out + html.slice(cursor);
}

/**
 * Visit every tag in `html` from `from` onward, in linear time.
 *
 * Every regex of the shape `<tag[^>]*>` degrades to O(n^2) on a payload of
 * unterminated `<tag`: each start position rescans to the end of the document
 * before failing. Measured against `<meta` repeated 32,000 times, the Open
 * Graph check alone took 5 seconds. A tool that fetches arbitrary URLs cannot
 * carry that, so tags are located by scanning rather than by matching.
 *
 * `visit` receives the raw tag text and its bounds, and returns false to stop.
 */
function scanTags(html, visit, from) {
  let cursor = from || 0;

  while (cursor < html.length) {
    const start = html.indexOf('<', cursor);

    if (start === -1) {
      return;
    }

    const close = html.indexOf('>', start + 1);

    if (close === -1) {
      return;
    }
    if (visit(html.slice(start, close + 1), start, close + 1) === false) {
      return;
    }

    cursor = close + 1;
  }
}

/** Lowercased element name of a raw tag, or '' if it does not name an element. */
function tagName(raw) {
  const match = /^<\/?([a-z][\w-]*)/i.exec(raw);
  return match ? match[1].toLowerCase() : '';
}

const isClosingTag = (raw) => raw.startsWith('</');
const isSelfClosing = (raw) => raw.endsWith('/>');

/** Remove tags, leaving a space so adjacent elements do not run their text together. */
function stripTags(html) {
  let out = '';
  let cursor = 0;

  scanTags(html, (raw, start, end) => {
    out += html.slice(cursor, start) + ' ';
    cursor = end;
  });

  return out + html.slice(cursor);
}

/** Text a no-JS agent would actually read from the initial payload. */
function extractVisibleText(html) {
  return stripTags(stripNonRenderable(html)).replace(/\s+/g, ' ').trim();
}

/**
 * Inner HTML of the element whose open tag ends at `innerStart`, located by
 * counting matching open and close tags of `name`, so that nested elements of
 * the same name resolve to the correct closing tag.
 */
function sliceElementContent(html, name, innerStart) {
  let depth = 1;
  let contentEnd = html.length;

  scanTags(
    html,
    (raw, start) => {
      if (isSelfClosing(raw) || tagName(raw) !== name) {
        return true;
      }

      depth += isClosingTag(raw) ? -1 : 1;

      if (depth === 0) {
        contentEnd = start;
        return false;
      }
      return true;
    },
    innerStart
  );

  // An unclosed element owns the rest of the document.
  return html.slice(innerStart, contentEnd);
}

/**
 * Inner HTML of the first element carrying `id`, or null if there is none.
 */
function extractElementById(html, id) {
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const idPattern = new RegExp(`\\sid\\s*=\\s*["']${escapedId}["']`, 'i');
  let inner = null;

  scanTags(html, (raw, start, end) => {
    if (isClosingTag(raw) || !idPattern.test(raw)) {
      return true;
    }

    inner = isSelfClosing(raw) ? '' : sliceElementContent(html, tagName(raw), end);
    return false;
  });

  return inner;
}

/** The framework mount point this page uses, or null if it has none. */
function findMountPoint(html) {
  for (const id of SPA_MOUNT_IDS) {
    const inner = extractElementById(html, id);
    if (inner !== null) {
      return { id, inner };
    }
  }
  return null;
}

/** Number of tags satisfying `matches`. */
function countTags(html, matches) {
  let count = 0;

  scanTags(html, (raw) => {
    if (matches(raw)) {
      count += 1;
    }
  });

  return count;
}

/**
 * Visible text the page server-renders inside <main> or <article> elements.
 * Bounded by MAX_CONTENT_REGIONS so the work stays linear in the payload.
 */
function serverRenderedContentText(html) {
  const collected = [];

  scanTags(html, (raw, start, end) => {
    if (collected.length >= MAX_CONTENT_REGIONS) {
      return false;
    }

    const name = tagName(raw);

    if (isClosingTag(raw) || isSelfClosing(raw) || (name !== 'main' && name !== 'article')) {
      return true;
    }

    collected.push(extractVisibleText(sliceElementContent(html, name, end)));
    return true;
  });

  return collected.join(' ').trim();
}

/**
 * The unhydrated mount point of a client-rendered shell, or null if the payload
 * is not one.
 *
 * The mount point has to be inspected, not merely detected: a server-rendered
 * React page also ships <div id="root">, but with its markup already inside.
 * An empty mount point is only excused when the page server-renders its content
 * somewhere else, in a <main> or <article>.
 *
 * Prose found anywhere else on the page deliberately does not count. Banners,
 * navigation, footers and marketing copy wrapped around an empty mount point are
 * exactly the pattern FR-1 exists to catch, and treating them as content is what
 * let real CSR pages score as compliant.
 */
function detectClientRenderedShell(rawHtml) {
  const html = stripNonRenderable(rawHtml);
  const mount = findMountPoint(html);

  if (!mount) {
    return null;
  }
  if (extractVisibleText(mount.inner).length >= CONTENT_TEXT_MIN) {
    return null;
  }

  const outsideMount = mount.inner ? html.replace(mount.inner, ' ') : html;

  return serverRenderedContentText(outsideMount).length >= CONTENT_TEXT_MIN ? null : mount;
}

function analyzePayload(response) {
  const results = {
    passed: [],
    failed: [],
    warnings: [],
    score: 0,
  };

  const body = response.body;
  // Structural checks run against markup only; script and style source is not
  // content, and matching against it produces both false passes and false fails.
  const markup = stripNonRenderable(body);
  const markupLower = markup.toLowerCase();
  const visibleText = extractVisibleText(body);

  // Critical checks
  const hasContent = body.length > 1000;
  const hasSemanticHTML = /<(article|section|nav|main|header|footer)/.test(markupLower);
  const hasText = visibleText.length > CONTENT_TEXT_MIN;
  const shellMount = detectClientRenderedShell(body);
  const noJSRequired = !/\b(loading|spinner)\b|please enable javascript/i.test(visibleText);

  // FR-1: Initial payload must contain meaningful content
  if (hasText && hasContent) {
    results.passed.push('Initial payload contains text content');
    results.score += 30;
  } else {
    results.failed.push('Initial payload lacks meaningful text content');
  }

  if (!shellMount) {
    results.passed.push('Content rendered server-side (not blank SPA shell)');
    results.score += 40;
  } else {
    results.failed.push(`Appears to be client-side only (empty #${shellMount.id} mount point)`);
  }

  if (hasSemanticHTML) {
    results.passed.push('Uses semantic HTML5 elements');
    results.score += 15;
  } else {
    results.warnings.push('No semantic HTML5 elements detected');
  }

  if (noJSRequired) {
    results.passed.push('Core content accessible without JavaScript');
    results.score += 15;
  } else {
    results.failed.push('Page shows loading states or requires JavaScript');
  }

  // Additional checks
  const hasMetadata = countTags(markup, (raw) => IS_META.test(raw) && OG_PROPERTY.test(raw)) > 0;
  if (hasMetadata) {
    results.passed.push('Includes structured metadata (Open Graph)');
  } else {
    results.warnings.push('Missing structured metadata');
  }

  const hasLinks = countTags(markup, (raw) => IS_ANCHOR.test(raw) && HAS_HREF.test(raw)) > 5;
  if (hasLinks) {
    results.passed.push('Contains navigable links');
  } else {
    results.warnings.push('Few or no links found in initial payload');
  }

  return results;
}

function printResults(url, results) {
  console.log('\n' + COLORS.blue + '═'.repeat(60) + COLORS.reset);
  console.log(COLORS.blue + '  BiModal Design FR-1 Validator Results' + COLORS.reset);
  console.log(COLORS.blue + '═'.repeat(60) + COLORS.reset + '\n');

  console.log(COLORS.gray + 'URL: ' + COLORS.reset + url + '\n');

  const fr1Pass = results.score >= 70;
  const grade =
    results.score >= 90
      ? 'A'
      : results.score >= 80
        ? 'B'
        : results.score >= 70
          ? 'C'
          : results.score >= 50
            ? 'D'
            : 'F';

  const statusColor = fr1Pass ? COLORS.green : COLORS.red;
  const statusText = fr1Pass ? 'PASS' : 'FAIL';

  console.log(`${statusColor}╔════════════════════════════════════╗${COLORS.reset}`);
  console.log(
    `${statusColor}║  FR-1 Status: ${statusText}  Score: ${results.score}/100  ║${COLORS.reset}`
  );
  console.log(`${statusColor}║  Grade: ${grade}                            ║${COLORS.reset}`);
  console.log(`${statusColor}╚════════════════════════════════════╝${COLORS.reset}\n`);

  if (results.passed.length > 0) {
    console.log(COLORS.green + '✓ Passed Checks:' + COLORS.reset);
    results.passed.forEach((msg) => log(COLORS.green, '  ✓', msg));
    console.log();
  }

  if (results.failed.length > 0) {
    console.log(COLORS.red + '✗ Failed Checks:' + COLORS.reset);
    results.failed.forEach((msg) => log(COLORS.red, '  ✗', msg));
    console.log();
  }

  if (results.warnings.length > 0) {
    console.log(COLORS.yellow + '⚠ Warnings:' + COLORS.reset);
    results.warnings.forEach((msg) => log(COLORS.yellow, '  ⚠', msg));
    console.log();
  }

  console.log(COLORS.gray + '─'.repeat(60) + COLORS.reset);
  console.log(COLORS.gray + 'What is FR-1?' + COLORS.reset);
  console.log('FR-1 (Initial Payload Accessibility) ensures that ~80% of AI');
  console.log('agents can access your content via simple HTTP requests.');
  console.log('\nLearn more: https://github.com/jgoldfoot/BiModalDesign');
  console.log(COLORS.gray + '─'.repeat(60) + COLORS.reset + '\n');
}

async function main() {
  const url = process.argv[2];

  if (!url) {
    console.error('Usage: node fr1-validator.js <url>');
    console.error('Example: node fr1-validator.js https://example.com');
    process.exit(1);
  }

  try {
    console.log(`\n${COLORS.blue}Fetching initial payload...${COLORS.reset}`);
    const response = await fetchInitialPayload(url);

    if (response.statusCode !== 200) {
      console.error(
        `${COLORS.red}Error: Received status code ${response.statusCode}${COLORS.reset}`
      );
      process.exit(1);
    }

    console.log(`${COLORS.green}Received ${response.body.length} bytes${COLORS.reset}`);

    const results = analyzePayload(response);
    printResults(url, results);

    process.exit(results.score >= 70 ? 0 : 1);
  } catch (error) {
    console.error(`${COLORS.red}Error: ${error.message}${COLORS.reset}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  log,
  COLORS,
  analyzePayload,
  fetchInitialPayload,
  extractVisibleText,
  extractElementById,
  findMountPoint,
  detectClientRenderedShell,
  SPA_MOUNT_IDS,
  CONTENT_TEXT_MIN,
};
