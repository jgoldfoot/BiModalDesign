# Documentation Drift

Living record of **genuine, unresolved** cross-artifact inconsistencies. Per
[AGENTS.md](AGENTS.md#documentation-drift-reports), this file is overwritten
each run and lists only real contradictions — not acceptable contextual
variations.

_Last reviewed: 2026-06-29_

## Open

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
