/**
 * Consistency guards (deterministic replacements for the Rudder/Custodian agents).
 *
 * These run in the normal `npm test` / CI gate on every PR, so brand and
 * cross-artifact drift is caught at merge time — no autonomous agent, no PR
 * noise, no hallucination.
 */

const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const ROOT = path.join(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const readIfExists = (rel) => {
  const abs = path.join(ROOT, rel);
  return fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
};

describe('Brand terminology (replaces the Custodian agent)', () => {
  // Content surfaces that must use canonical branding.
  const files = [
    'README.md',
    'AGENTS.md',
    'DRIFT.md',
    'docs/whitepaper.md',
    'docs/implementation-guide.md',
    'docs/compliance-checklist.md',
    'docs/api-reference.md',
    'docs/troubleshooting.md',
  ];

  // Canonical: "BiModal Design" (one word BiModal), "bimodal.design".
  const forbidden = [
    { pattern: /\bagent[\s-]?ux\b/i, name: 'AgentUX — the pre-rebrand name; use "BiModal Design"' },
    { pattern: /\bbi-modal\b/i, name: '"Bi-Modal" — hyphenated; use "BiModal"' },
    { pattern: /\bBimodal Design\b/, name: '"Bimodal Design" — lowercase m; use "BiModal Design"' },
  ];

  files.forEach((file) => {
    test(`${file} uses canonical brand terms`, () => {
      const content = readIfExists(file);
      if (content === null) return; // file optional
      const problems = [];
      content.split('\n').forEach((line, i) => {
        forbidden.forEach(({ pattern, name }) => {
          if (pattern.test(line)) {
            problems.push(`  line ${i + 1} [${name}]: ${line.trim()}`);
          }
        });
      });
      if (problems.length) {
        throw new Error(`${file} has non-canonical brand terms:\n${problems.join('\n')}`);
      }
    });
  });
});

describe('package.json ↔ docs consistency (replaces mechanical drift checks)', () => {
  test('description uses the v3.0 capability-spectrum framing (not the old binary framing)', () => {
    expect(pkg.description).not.toMatch(/dual-mode/i);
    expect(pkg.description.toLowerCase()).toContain('agent capability spectrum');
  });

  test('canonical maturity-level names are consistent across README and whitepaper', () => {
    const names = [
      'Infrastructure Ready',
      'Semantically Accessible',
      'Data-Rich',
      'API-Enabled',
      'Agent-Native',
    ];
    const readme = read('README.md');
    const whitepaper = read('docs/whitepaper.md');
    names.forEach((name) => {
      expect(readme).toContain(name);
      expect(whitepaper).toContain(name);
    });
  });

  test('package version major.minor is referenced in README and whitepaper', () => {
    const [major, minor] = pkg.version.split('.');
    const mm = `${major}.${minor}`; // e.g. "3.0"
    expect(read('README.md')).toContain(mm);
    expect(read('docs/whitepaper.md')).toContain(mm);
  });
});
