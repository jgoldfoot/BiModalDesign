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

function analyzePayload(response) {
  const results = {
    passed: [],
    failed: [],
    warnings: [],
    score: 0,
  };

  const body = response.body;
  const bodyLower = body.toLowerCase();

  // Critical checks
  const hasContent = body.length > 1000;
  const hasSemanticHTML = /<(article|section|nav|main|header|footer)/.test(bodyLower);
  const hasText = body.replace(/<[^>]*>/g, '').trim().length > 200;
  const notSPA = !/<div[^>]*id=["']root["']/.test(bodyLower) || hasText;
  const noJSRequired = !/loading|spinner|please enable javascript/i.test(
    body.replace(/<script[^>]*>.*?<\/script>/gs, '')
  );

  // FR-1: Initial payload must contain meaningful content
  if (hasText && hasContent) {
    results.passed.push('Initial payload contains text content');
    results.score += 30;
  } else {
    results.failed.push('Initial payload lacks meaningful text content');
  }

  if (notSPA) {
    results.passed.push('Content rendered server-side (not blank SPA shell)');
    results.score += 40;
  } else {
    results.failed.push('Appears to be client-side only (empty #root div)');
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
  const hasMetadata = /<meta[^>]*property=["']og:/.test(bodyLower);
  if (hasMetadata) {
    results.passed.push('Includes structured metadata (Open Graph)');
  } else {
    results.warnings.push('Missing structured metadata');
  }

  const hasLinks = (body.match(/<a[^>]*href=/g) || []).length > 5;
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

main();
