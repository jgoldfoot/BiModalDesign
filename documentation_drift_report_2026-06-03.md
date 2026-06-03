# Documentation drift report [2026-06-03]

## README.md vs docs/whitepaper.md

### Foundational Requirements

- [DRIFT] FR-1 definition detail variation:
  - `README.md` (line 183):
    `FR-1: Initial Payload Accessibility. The foundational requirement: critical content must exist in the initial HTTP response.`
  - `docs/whitepaper.md` (line 2037):
    `FR-1 (Foundational Requirement 1): Initial Payload Accessibility — the HTML response to the initial GET request MUST contain the primary content and core navigational structures of the page before any client-side JavaScript execution.`

### Framework Maturity Levels

- [VARIATION] Agent Coverage terminology in Maturity Levels table:
  - `README.md` (line 273): Level 4 Agent Coverage is listed as `All levels`
  - `docs/whitepaper.md` (line 1480): Level 4 Agent Coverage is listed as
    `All agent levels`

### Design Principles

- [DRIFT] Missing WCAG 2.2 AA in README:
  - `README.md`: Doesn't explicitly list "WCAG 2.2 AA" in its main text or Key
    Concepts section.
  - `docs/whitepaper.md` (line 1360):
    `WCAG 2.2: BiModal Design's Layer 2 directly builds on and extends WCAG`

### Key Research Findings

- [DRIFT] Baseline success statistics formatting:
  - `README.md` (line 117):
    `12-20% baseline success for HTTP Retrievers on conventional CSR sites, improving to 42-65% with Layer 1 compliance and 60-75% with full Layer 1-3 implementation.`
  - `docs/whitepaper.md` (line 500):
    `| Level 0 (HTTP Retrievers) | 12-20% | 42-65% | 60-75% |` and (line 166)
    `| HTTP Retriever Success | 12% | 42-70% | 42-70% |` (Inconsistent 42-70% vs
    42-65%).

### Citations

- [DRIFT] Missing arXiv ID for WebVoyager:
  - `README.md` (line 331):
    `WebVoyager — Benchmarking end-to-end browser agents on live real-world websites`
  - `docs/whitepaper.md` (line 2004):
    `WebVoyager: "Benchmarking End-to-End Web Agents on Live Real-World Websites"`

## README.md vs tools/validators/fr1-validator.js

### Quick Start commands

- [DRIFT] Local file testing mismatch:
  - `README.md` (line 140) shows
    `node tools/validators/fr1-validator.js https://your-site.com`. However, the
    CSR fail example in `examples/csr-fail-example.html` (line 51) tells users
    to run
    `node tools/validators/fr1-validator.js file:///path/to/this/file.html`.
  - `tools/validators/fr1-validator.js` does not support the `file://` protocol
    (throws an error), leading to drift between the documented example and
    validator capability.

## docs/whitepaper.md vs examples/csr-fail-example.html

### FR-1 Validation Instructions

- [DRIFT] File protocol validation failure:
  - `examples/csr-fail-example.html` (line 51) instructs:
    `Test it: node tools/validators/fr1-validator.js file:///path/to/this/file.html`
    which isn't supported by the validator tool.
