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

/**
 * Remove everything an HTTP-only agent cannot read as content: comments, and the
 * source of <script> and <style> elements.
 *
 * Stripping tags alone (`replace(/<[^>]*>/g, '')`) removes the tags but leaves
 * inline CSS and JS behind, so a bare SPA shell with a stylesheet and a data
 * blob measures as thousands of characters of "text".
 */
function stripNonRenderable(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ');
}

/** Text a no-JS agent would actually read from the initial payload. */
function extractVisibleText(html) {
  return stripNonRenderable(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Inner HTML of the first element carrying `id`, or null if there is none.
 *
 * Walks matching open/close tags so nested elements of the same name resolve
 * correctly; a single regex cannot identify the right closing tag.
 */
function extractElementById(html, id) {
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const openTag = new RegExp(
    `<([a-z][\\w-]*)\\b[^>]*\\sid\\s*=\\s*["']${escapedId}["'][^>]*>`,
    'i'
  );
  const open = openTag.exec(html);

  if (!open) {
    return null;
  }
  if (open[0].endsWith('/>')) {
    return '';
  }

  const innerStart = open.index + open[0].length;
  const tagPattern = new RegExp(`<(/?)${open[1]}\\b[^>]*>`, 'gi');
  tagPattern.lastIndex = innerStart;

  let depth = 1;
  let token = tagPattern.exec(html);

  while (token !== null) {
    if (!token[0].endsWith('/>')) {
      depth += token[1] === '/' ? -1 : 1;
      if (depth === 0) {
        return html.slice(innerStart, token.index);
      }
    }
    token = tagPattern.exec(html);
  }

  // Unclosed mount point: treat the rest of the document as its content.
  return html.slice(innerStart);
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
  const contentRegions = outsideMount.match(/<(main|article)\b[\s\S]*?<\/\1>/gi) || [];
  const contentText = contentRegions.map(extractVisibleText).join(' ').trim();

  return contentText.length >= CONTENT_TEXT_MIN ? null : mount;
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
  const hasMetadata = /<meta[^>]*property=["']og:/.test(markupLower);
  if (hasMetadata) {
    results.passed.push('Includes structured metadata (Open Graph)');
  } else {
    results.warnings.push('Missing structured metadata');
  }

  const hasLinks = (markup.match(/<a[^>]*href=/g) || []).length > 5;
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
