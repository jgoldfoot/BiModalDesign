# Documentation drift report [2025-05-24]

## README.md vs docs/whitepaper.md

**[DRIFT] Key Research Findings**

- **README.md (Missing)**: The README does not mention the specific baseline
  numbers.
- **docs/whitepaper.md (lines 99, 479-482)**: The whitepaper lists explicit
  numbers such as `| HTTP Retriever Success | 12% | 42-70% | 42-70% |` and
  `| Level 2 (Browser Automation) | 35-50% | 55-72% | 75-88% |`.
- **Note**: The README should ideally reflect the top-level research findings
  (like the 72% and 12% figures) mentioned in the whitepaper for consistency.

**[VARIATION] Design Principles**

- **README.md (Missing)**: The README does not explicitly list WCAG 2.2 AA in
  its "Quick Start" or "Key Concepts" sections.
- **docs/whitepaper.md (lines 1316, 1874)**: The whitepaper explicitly includes
  WCAG 2.2:
  `- **WCAG 2.2**: BiModal Design's Layer 2 directly builds on and extends WCAG`.

## README.md vs tools/validators/

**[QUESTION] Quick Start commands**

- **README.md (line 125)**: Lists the quick start command as
  `node fr1-checker.js https://your-site.com --verbose`.
- **tools/validators/fr1-validator.js (line 7)**: The usage instructions state
  `Usage: node fr1-validator.js <url>`. The `package.json` also defines
  `bmd-validate` pointing to `fr1-validator.js`. Is `fr1-checker.js` intended as
  the primary user-facing tool, or `fr1-validator.js`?

**[VARIATION] Foundational Requirements (FR-1)**

- **README.md (line 167)**: Defines FR-1 simply:
  `The foundational requirement: critical content must exist in the initial HTTP response. This is Layer 1 of defense in depth — the floor, not the ceiling.`
- **tools/validators/fr1-validator.js (line 89)**: The implementation awards
  specific scores for things like semantic HTML (`hasSemanticHTML`), text length
  (`> 200`), and lack of SPA shell (`notSPA`). This aligns with the overall
  definition but includes specific criteria not strictly defined in the README.

## README.md vs examples/

**[DRIFT] Examples and Custom Attributes**

- **README.md (line 172)**: States
  `v3.0 migrates from custom data-agent-* attributes to established standards`.
- **examples/react-spa-example.md (line 1762)**: The example still heavily uses
  the deprecated custom attributes:
  `<main role="main" id="main-content" data-agent-component="main-content">` and
  `<h1 data-agent-content="page-title">Welcome to BiModal Design Store</h1>`.
- **examples/csr-mitigation.md (line 122)**: Similar usage of deprecated
  attributes:
  `<main role="main" id="main-content" data-agent-component="main-content">`.
