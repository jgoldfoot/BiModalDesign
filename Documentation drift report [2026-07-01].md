# Documentation Drift Report [2026-07-01]

## README vs white paper

### [VARIATION] Design Principles and Priority Order

- **README.md** lists structured data schemas (`schema.org`, `JSON-LD`), `ARIA`
  roles, and semantic HTML5 landmarks under "Key Concepts", but does not
  explicitly group them as "Design Principles". It omits mentioning
  `WCAG 2.2 AA`.
- **docs/whitepaper.md** (line 1450) explicitly lists `WCAG 2.2 AA`: "BiModal
  Design's Layer 2 directly builds on and extends WCAG compliance".
- _Assessment:_ The README provides a summarized technical stack, while the
  whitepaper expands on specific standards like WCAG.

### [DRIFT] Citation Title Mismatch

- **README.md** (line 343) cites:
  > `"A Survey of WebAgents: Towards Next-Generation AI Agents for Web Automation"`
- **docs/whitepaper.md** (line 2068) cites:
  > `"A Survey of WebAgents: Towards Next-Generation AI Agents for Web Automation with Large Foundation Models"`
- _Assessment:_ The title is truncated in the README. They both link to the same
  arXiv ID (`2503.23350v4`), but the text differs.

### [VARIATION] Key Research Findings

- The prompt asks to check for specific numbers ("72% human baseline, 12%
  baseline agent, 42-70% improved"). However, neither the **README.md** nor the
  **docs/whitepaper.md** contain "72% human baseline".
- Instead, both files use consistent success metrics across layers.
  **README.md** (lines 135-141) and **docs/whitepaper.md** (lines 405-408)
  consistently cite:
  > "12-20% baseline success for HTTP Retrievers... improving to 42-65% with
  > Layer 1 compliance and 60-75% with full Layer 1-3 implementation." "35-50%
  > baseline success for Browser Automation agents... improving to 55-72%... up
  > to 75-88%."
- _Assessment:_ The metrics are perfectly synchronized between both artifacts;
  the assumption in the prompt's instructions contained hallucinated stats.

## README vs FR-1 Checker implementation

### [DRIFT] FR-1 Definition and Naming Misalignment

- **README.md** (line 192) defines FR-1 purely as Layer 1:
  > `The foundational requirement: critical content must exist in the initial HTTP response. This is Layer 1 of defense in depth...`
- **README.md** (lines 197-201) also states that `fr1-checker.js` covers:
  > `semantic content, navigation accessibility, form labels, heading hierarchy, ARIA landmarks, image alt text, and agent-specific features.`
- **tools/validators/fr1-checker.js** implements scoring for Structure,
  Semantics, Navigation, Forms, and Content (Layer 2 concepts).
- _Assessment:_ The `fr1-checker.js` tool validates both Layer 1 (Initial
  Payload) AND Layer 2 (Semantic Structure), yet it is named as if it only
  validates Layer 1. The definition of FR-1 is strictly Layer 1, making the
  checker's name misleading.

## README vs Examples

### [VARIATION] Redundant ARIA roles in examples

- **README.md** (lines 164-166) code snippet uses explicit ARIA roles on
  semantic tags:
  > `<main role="main" aria-label="Product catalog">`
  > `<nav role="navigation" aria-label="Main navigation">`
- **examples/ssr-pass-example.html** (lines 114, 122) omits these redundant
  roles:
  > `<nav aria-label="Main navigation">` `<main aria-label="Product catalog">`
- _Assessment:_ Both are technically correct. `ssr-pass-example.html` relies on
  native HTML5 landmark semantics, which is an acceptable variation.

## Quick Start vs Implementations

### [VARIATION] Tool execution commands

- **README.md** (lines 154-157) suggests running:
  > `node tools/validators/fr1-validator.js https://your-site.com`
  > `node tools/validators/fr1-checker.js https://your-site.com --verbose`
- Both commands successfully execute against the current implementations (e.g.,
  `https://example.com`) when dependencies are installed in the
  `tools/validators/` directory.
- _Assessment:_ The commands still work properly, though package.json bin
  aliases (e.g., `npx bmd-validate`) are also available for installed users.

## Framework Maturity Levels

### [VARIATION] Table Consistency

- **README.md** (lines 280-287) and **docs/whitepaper.md** (lines 1735-1743)
  both contain the exact same 5-level maturity model (Levels 0-4).
- The naming ("Infrastructure Ready" to "Agent-Native"), implemented layers,
  agent coverage, and typical success rates are perfectly consistent across both
  artifacts, as well as with `__tests__/setup.test.js`.
- _Assessment:_ No drift found. The tables and test files accurately represent
  the maturity levels.

## Other Artifacts

### [VARIATION] package.json description

- **package.json**'s description accurately reflects the updated v3.0 capability
  spectrum ("across the full AI agent capability spectrum — from HTTP retrievers
  to protocol-native agents"), having been resolved in a previous run.
- _Assessment:_ Consistent with the current documentation state.
