# Documentation drift report [2026-06-29]

## README.md vs docs/whitepaper.md

[VARIATION] - Foundational Requirement 1 (FR-1) definitions are phrased slightly differently, but represent the same core concept.
* `README.md` (line 197): "The foundational requirement: critical content must exist in the initial HTTP response."
* `docs/whitepaper.md` (line 405): "**Requirement**: All content intended for agent consumption MUST be present in the initial HTTP response from the server."

[DRIFT] - Design Principles drift. The README does not mention WCAG 2.2 AA. The white paper lists WCAG 2.2 explicitly as Layer 2.
* `README.md`: Does not contain the string "WCAG"
* `docs/whitepaper.md` (line 1450): "- **WCAG 2.2**: BiModal Design's Layer 2 directly builds on and extends WCAG"

[DRIFT] - Key Research Findings numbers differ from expectations. The README and white paper both state the same numbers, which are different from 72% human baseline and 12% baseline agent. Actually, neither document mentions "72% human baseline" or "12% baseline agent".
* `README.md` (line 125): "12-20% baseline success for HTTP Retrievers on conventional CSR sites... improving to 42-65% with Layer 1 compliance and 60-75% with full Layer 1-3 implementation."
* `docs/whitepaper.md` (line 524): States exactly the same numbers.

[DRIFT] - Citations phrasing variation. The title of the WebAgents Survey paper has drifted.
* `README.md` (line 341): "A Survey of WebAgents: Towards Next-Generation AI Agents for Web Automation" (arXiv:2503.23350v4)
* `docs/whitepaper.md` (line 2068): "A Survey of WebAgents: Towards Next-Generation AI Agents for Web Automation with Large Foundation Models" — arXiv:2503.23350v4

## README.md vs examples/

[VARIATION] - Code snippets in examples/ use slightly different comments than the README for Layer 1.
* `README.md` (line 162): "<!-- Layer 1: Content in initial HTML (SSR/SSG) -->"
* `examples/ssr-pass-example.html` (line 145): "<!-- Layer 1: All content present in initial HTML (FR-1 compliant) -->"

## README.md vs tools/validators/fr1-checker.js

[QUESTION] - The README says `fr1-checker.js` does a "comprehensive audit covering... image alt text". However, in the `calculateScore` function it focuses on 5 categories (structure, semantic, navigation, forms, content) and agent features. We need to verify if image alt text is truly checked in the semantics or content sections (it is checked in line 214 of `fr1-checker.js`).
* `README.md` (line 206): "comprehensive audit covering semantic content, navigation accessibility, form labels, heading hierarchy, ARIA landmarks, image alt text, and agent-specific features."
* `tools/validators/fr1-checker.js` (line 115): Mentions 5 categories but not explicitly alt text in the score breakdown comment.

[DRIFT] - Quick Start Commands. `README.md` describes tools and options which don't map clearly to all validators if we look at `fr1-validator.js` directly. Although `--verbose` is used, the score is not explicitly outputting the 5 categories (structure, semantics, navigation, forms, content) separately to the console.
* `README.md` (line 208): "Use `--verbose` for detailed scoring across five component categories (structure, semantics, navigation, forms, content), plus agent-feature checks."

## README.md vs __tests__/setup.test.js

[DRIFT] - Maturity levels names are defined differently in the tests vs the README/Whitepaper. The README lists: Infrastructure Ready, Semantically Accessible, Data-Rich, API-Enabled, Agent-Native. The tests check for different names.
* `README.md` (line 296): "0 | Infrastructure Ready", "1 | Semantically Accessible", "2 | Data-Rich", "3 | API-Enabled", "4 | Agent-Native"
* `__tests__/setup.test.js` (line 42): Tests check for "1: 'Basic Accessibility'", "2: 'Semantic Stability'", "3: 'Agent-Tested'".

## README.md vs package.json

[DRIFT] - The description of the project in package.json uses older "human vs. agent" binary model terminology which the README explicitly says it replaces.
* `README.md` (line 78): "BiModal Design v3.0 replaces the binary 'human vs. agent' model with a graduated spectrum:"
* `package.json` (line 4): "description": "A design framework for building dual-mode interfaces that work optimally for both humans and AI agents"

## README.md vs AGENTS.md

[VARIATION] - No direct contradictions found between README and AGENTS.md regarding the 7 check categories, but AGENTS.md reinforces the documentation drift process itself.
