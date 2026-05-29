# Documentation drift report [2026-05-29]

## README.md vs docs/whitepaper.md

- **[VARIATION]** Foundational Requirements (FR-1): `README.md` (line 178) defines FR-1 as `"The foundational requirement: critical content must exist in the initial HTTP response."` `docs/whitepaper.md` (line 1937) defines it similarly as `"FR-1 (Foundational Requirement 1): Initial Payload Accessibility — the core content must exist in the server's initial HTML response."` Both definitions match conceptually.

- **[DRIFT]** Design Principles (WCAG 2.2 AA in Layer 2): `README.md` (line 101) lists `"Layer 2: Semantic Structure (HTML5, ARIA, headings, WCAG 2.2 AA) → Level 1-3"`. However, `docs/whitepaper.md` (line 246) does not include WCAG 2.2 AA: `"Layer 2: Semantic Structure (HTML5, ARIA, headings) → Level 1-3 agents"`.

- **[DRIFT]** Key Research Findings: `README.md` (line 116) states `"72% baseline success for Browser Automation agents on conventional UI"`. However, `docs/whitepaper.md` (line 486) lists `"35-50%"` for baseline success for Level 2 (Browser Automation) on Conventional UI. The `"72%"` figure in the whitepaper corresponds to the upper bound of success when using Semantic Structure, not the baseline.

- **[DRIFT]** Citations (Paper versions): Both `README.md` (line 280) and `docs/whitepaper.md` (line 1879) cite `"WebAgents Survey 2025"` with `"arXiv:2503.23350v1"`. However, the arXiv API shows a newer version is available (`v4`). Similarly, both cite `"ST-WebAgentBench"` with `"arXiv:2410.06703v2"` (`README.md` line 284, `docs/whitepaper.md` line 1881), but the API shows `v6` is available.

## README.md vs tools/validators/fr1-checker.js

- **[VARIATION]** Foundational Requirements (FR-1 Checker checks): `README.md` (line 179) claims `"Our validator verifies not only text length, but also checks for semantic structure and the absence of an empty SPA shell (<div id="root">)."` The implementation in `tools/validators/fr1-checker.js` (line 120-134) performs these checks but also explicitly validates navigation accessibility (`checkNavigation`), form accessibility (`checkForms`), content meaningfulness (`checkContentMeaning`), and agent-specific features (`checkAgentFeatures`), which are not mentioned in the README.

## README.md vs examples/

- **[DRIFT]** Examples (Usage of deprecated custom attributes): `README.md` (line 186) states `"v3.0 migrates from custom data-agent-* attributes to established standards"`. However, multiple examples heavily use the deprecated `data-agent-*` attributes instead of migrating to `schema.org` and ARIA. For instance, `examples/astro-ssg-example.md` (lines 1040-1051) uses attributes like `data-agent-content="fieldset-label"` and `data-agent-field="customer-name"`.

## README.md vs tools/validators/fr1-validator.js

- **[QUESTION]** Quick Start commands: `README.md` (line 132) provides the command `"node fr1-validator.js https://your-site.com"` in the `tools/validators` directory. While the script runs successfully, it emits warnings such as `"No semantic HTML5 elements detected"` and `"Missing structured metadata"` for simple payloads. Is this the intended primary user-facing validation tool, or should users be directed to the more comprehensive `fr1-checker.js`?
