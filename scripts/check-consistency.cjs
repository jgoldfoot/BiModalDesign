#!/usr/bin/env node
/**
 * Cross-document consistency gate.
 *
 * Why this exists: on 2026-11-22 an agent auditing a consumer site found this
 * repo contradicting itself — CHANGELOG and the compliance checklist said
 * data-agent-* was removed while the whitepaper, API reference and AGENTS.md
 * said it was retained; four docs still pointed at /.well-known/agent.json
 * eight months after A2A 1.0 moved the Agent Card. The weekly research scan
 * ADDS findings; nothing RECONCILED the docs with each other or with the
 * standards they cite. This does, and fails closed.
 *
 * Rules live here, with the source that settles each one. Add a rule whenever a
 * contradiction is found — the gate should grow from real failures, not guesses.
 *
 * Usage: npm run check:consistency        (exit 1 on any FAIL; WARN is advisory)
 *
 * CommonJS on purpose: this repo lints .mjs as sourceType "script", so ESM
 * syntax fails `eslint . --max-warnings=0` without a config change.
 */
const { readFileSync, readdirSync, statSync } = require('node:fs');
const { join } = require('node:path');
const { execSync } = require('node:child_process');

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

// ── Canonical facts (single source of truth; the docs must agree with these) ──
const FACTS = {
  version: pkg.version,
  mcpCurrentRevision: '2026-07-28', // MCP spec; 2025-11-25 is superseded (SEP-2663)
  a2aAgentCardPath: '/.well-known/agent-card.json', // A2A 1.0.0, docs/specification.md
  dataAgentStatus: 'retained as a supplementary layer', // whitepaper §7.2, AGENTS.md, 5bcce8c
};

// Files the namespace-level data-agent-* rules apply to. CHANGELOG is exempt
// on purpose: its released entries are dated history and must not be rewritten
// to pass a gate; the 2026-06-07 clarification lives there as a dated addendum.
const walk = (d) =>
  readdirSync(d).flatMap((n) => {
    const p = join(d, n);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : [];
  });
const SPEC_DOCS = ['README.md', 'AGENTS.md', ...walk('docs')];
const ALL_DOCS = ['CHANGELOG.md', ...SPEC_DOCS];

// ── Forbidden stale statements ───────────────────────────────────────────────
const RULES = [
  {
    files: ALL_DOCS,
    re: /well-known\/agent\.json\b/,
    why: `A2A 1.0.0 (2026-03-12) places the Agent Card at ${FACTS.a2aAgentCardPath} (a2aproject/A2A docs/specification.md).`,
  },
  {
    files: SPEC_DOCS,
    // namespace-level claims only (literal "data-agent-*"); per-attribute
    // migrations such as "data-agent-field -> itemprop" are legitimate.
    re: /data-agent-\*[^.\n]{0,60}\b(?<!not )(?<!never )(deprecated|removed|dropped|no longer (?:supported|recommended|used))\b/i,
    why: `data-agent-* is ${FACTS.dataAgentStatus} (whitepaper §7.2, docs/api-reference.md, AGENTS.md; commit 5bcce8c, 2026-06-07).`,
  },
  {
    files: SPEC_DOCS,
    re: /\b(?<!not )(?<!never )(deprecated|removed)\b[^.\n]{0,40}data-agent-\*/i,
    why: `data-agent-* is ${FACTS.dataAgentStatus}.`,
  },
  {
    files: SPEC_DOCS,
    re: /use schema\.org instead of data-agent/i,
    why: 'Standards first, but data-agent-* is retained where no standard covers the need — not "instead of".',
  },
  {
    files: ALL_DOCS,
    re: /2025-11-25[^.\n]{0,40}\b(?:is )?(?:the )?(current|latest)\b/i,
    why: `2025-11-25 is superseded; the current MCP revision is ${FACTS.mcpCurrentRevision}.`,
  },
];

let fails = 0,
  warns = 0;
const fail = (f, i, line, why) => {
  fails++;
  console.error(`  FAIL ${f}:${i + 1}\n       ${line.trim().slice(0, 140)}\n       → ${why}`);
};
const warn = (msg) => {
  warns++;
  console.error(`  WARN ${msg}`);
};

for (const rule of RULES) {
  for (const f of rule.files) {
    const lines = readFileSync(f, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (rule.re.test(line)) fail(f, i, line, rule.why);
    });
  }
}

// ── Cross-document facts ─────────────────────────────────────────────────────
const changelog = readFileSync('CHANGELOG.md', 'utf8');
const top = changelog.match(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})/m);
if (!top)
  fail(
    'CHANGELOG.md',
    0,
    '(no "## [x.y.z] - YYYY-MM-DD" entry)',
    'CHANGELOG top entry must be parseable.'
  );
else {
  if (top[1] !== FACTS.version)
    fail(
      'CHANGELOG.md',
      0,
      top[0],
      `top CHANGELOG entry ${top[1]} ≠ package.json version ${FACTS.version}.`
    );
  // Date is advisory: a released entry's date is a record, and correcting it is a
  // human decision. Compare against the GitHub release when gh is available.
  try {
    const rel = execSync(`gh release view v${top[1]} --json publishedAt --jq .publishedAt`, {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim()
      .slice(0, 10);
    if (rel && rel !== top[2])
      warn(
        `CHANGELOG dates ${top[1]} as ${top[2]}, but the GitHub release was published ${rel}. Decide which is canonical and align them.`
      );
  } catch {
    /* gh unavailable in this environment; skip the advisory check */
  }
}

const checked = ALL_DOCS.length;
if (fails === 0) {
  console.log(
    `✓ consistency: ${checked} docs, 0 contradictions${warns ? ` (${warns} advisory warning${warns > 1 ? 's' : ''} above)` : ''}`
  );
  process.exit(0);
}
console.error(
  `\n✗ consistency: ${fails} contradiction(s) across ${checked} docs. Fix the text or, if the fact changed, update FACTS in scripts/check-consistency.mjs with its source.`
);
process.exit(1);
