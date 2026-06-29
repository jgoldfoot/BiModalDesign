# Documentation Drift

Living record of **genuine, unresolved** cross-artifact inconsistencies. Per
[AGENTS.md](AGENTS.md#documentation-drift-reports), this file is overwritten
each run and lists only real contradictions — not acceptable contextual
variations.

_Last reviewed: 2026-06-29_

## Open

### [QUESTION] Maturity Levels vs. Certification Tiers

Two compliance models coexist without a cross-reference:

- **README.md** — Maturity Levels 0–4, defined by which Defense-in-Depth layers
  are implemented (Infrastructure Ready → Agent-Native).
- **docs/whitepaper.md** — Certification Tiers, defined by audit score (90%+
  Certified, 75–89% Advanced, 60–74% Foundational, <60% At Risk).

These measure different things (architecture implemented vs. score achieved) and
can legitimately coexist, but neither doc references the other. **Decision
needed:** add a sentence linking the two models, or leave them independent.

### [QUESTION] FR-1 Checker scoring details

- **README.md** (line 206) says `fr1-checker.js` does a "comprehensive audit
  covering... image alt text".
- **tools/validators/fr1-checker.js** (line 115) mentions 5 categories in
  `calculateScore` but not explicitly alt text in the score breakdown comment,
  although it does check it later. Is the README phrasing misleading?

### [DRIFT] Quick Start Commands verbose output

- **README.md** (line 208) states: "Use `--verbose` for detailed scoring across
  five component categories (structure, semantics, navigation, forms, content),
  plus agent-feature checks."
- **tools/validators/fr1-checker.js** does not explicitly output the 5
  categories separately to the console when run with `--verbose`.

### [DRIFT] Maturity level definitions

- **README.md** (line 296) and **docs/whitepaper.md** (line 1564) define the
  levels as: Infrastructure Ready, Semantically Accessible, Data-Rich,
  API-Enabled, Agent-Native.
- \***\*tests**/setup.test.js\*\* (line 42) checks for different names: "Basic
  Accessibility", "Semantic Stability", "Agent-Tested".

### [DRIFT] package.json vs README terminology

- **README.md** (line 78) states: "BiModal Design v3.0 replaces the binary
  'human vs. agent' model with a graduated spectrum".
- **package.json** (line 4) still uses the old terminology: "description": "A
  design framework for building dual-mode interfaces that work optimally for
  both humans and AI agents".

### [DRIFT] Design Principles WCAG 2.2 explicitly mentioned

- **docs/whitepaper.md** (line 1450) explicitly mentions: "- **WCAG 2.2**:
  BiModal Design's Layer 2 directly builds on and extends WCAG".
- **README.md** does not explicitly mention WCAG 2.2 anywhere.

### [DRIFT] Citation titles

- **README.md** (line 341): "A Survey of WebAgents: Towards Next-Generation AI
  Agents for Web Automation" (arXiv:2503.23350v4)
- **docs/whitepaper.md** (line 2068): "A Survey of WebAgents: Towards
  Next-Generation AI Agents for Web Automation with Large Foundation Models" —
  arXiv:2503.23350v4

## Resolved this cycle

- **[DRIFT] Citation years** — README cited Operator and Project Mariner as
  2026; whitepaper cited 2025. Operator launched Jan 2025 and Mariner was
  announced Dec 2024, so 2025 is correct. Fixed in README.

## Reviewed — acceptable variation (no action)

- **Quick Start uses `node tools/validators/...` vs. the `bmd-validate` bin
  alias** — intentional: the README targets repo cloners; the bin aliases serve
  installed-package users. Both are valid.
- **`role="main"` / `role="navigation"` in the README snippet vs. omitted in
  `examples/ssr-pass-example.html`** — both correct; the example relies on
  native HTML5 landmark semantics, which is acceptable.
- **`data-agent-*` prominence** — the README's three-layer table and the
  whitepaper's Layer 2/3 principles are consistent; emphasis differs by document
  purpose.
- **Foundational Requirement 1 (FR-1) definitions** — phrased slightly
  differently in `README.md` and `docs/whitepaper.md` but represent the same
  core concept.
- **Framework Maturity Levels table** — identically defined in both documents
  containing the 5-level table.
- **Code snippets Layer 1 comments** — slightly different comments in
  `examples/ssr-pass-example.html` vs the `README.md`.
