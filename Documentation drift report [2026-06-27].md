# Documentation drift report [2026-06-27]

This report compares how the BiModal Design framework is described across all
major artifacts, identifying substantive inconsistencies per the drift agent
objective.

## README.md vs docs/whitepaper.md

### 1. Foundational Requirements

**[VARIATION] FR-1 definition vs thresholds**

- **README.md (Lines 87-88):** "The foundational requirement: critical content
  must exist in the initial HTTP response."
- **docs/whitepaper.md (Lines 419-420):** "All content intended for agent
  consumption MUST be present in the initial HTTP response from the server."
- **Note:** The conceptual definition across both artifacts is consistent.

### 2. Framework Maturity Levels

**[VARIATION] Agent capability spectrum and maturity levels**

- **README.md (Lines 159-166):** Lists Maturity Levels 0-4 and their Agent
  Coverage.
- **docs/whitepaper.md (Lines 1559-1568):** Shows the exact same table with
  identical levels, layers, and success rate bounds.
- **Note:** Framework maturity levels are perfectly consistent between the
  README and the whitepaper.

### 3. Design Principles

**[DRIFT] WCAG 2.2 AA omitted from README**

- **README.md:** Summarizes principles including semantic structure, ARIA, and
  JSON-LD, but omits WCAG 2.2 AA.
- **docs/whitepaper.md (Lines 1065-1066):** Explicitly states: "- **WCAG 2.2**:
  BiModal Design's Layer 2 directly builds on and extends WCAG compliance"
- **Note:** The README completely omits WCAG 2.2 AA from its list of principles
  and framework standards.

### 4. Key Research Findings

**[QUESTION] Unverifiable research statistics**

- **Target Query:** "README shows specific numbers (72% human baseline, 12%
  baseline agent, 42–70% improved)."
- **README.md (Lines 125-129):** States "- **12-20% baseline success** for HTTP
  Retrievers... improving to **42-65%**... - **35-50% baseline success** for
  Browser Automation agents on conventional UI, improving to **55-72%**...".
- **Note:** The specific numbers (72% human baseline, 12% baseline agent, 42–70%
  improved) do not appear anywhere in the repository artifacts. The actual
  numbers in the README exactly match the whitepaper.

### 6. Citations

**[VARIATION] Consistent arXiv IDs**

- **README.md & docs/whitepaper.md:** Both list identical papers and arXiv IDs
  (e.g., arXiv:2503.23350v4, arXiv:2410.06703v6, arXiv:2406.12045,
  arXiv:2404.07972, arXiv:2604.24964, arXiv:2602.13559).
- **Note:** There is no cross-artifact citation drift.

## README.md vs \_\_tests\_\_/

### 2. Framework Maturity Levels

**[DRIFT] Outdated Maturity Levels in tests**

- **README.md:** Defines levels 1-3 as "Semantically Accessible", "Data-Rich",
  and "API-Enabled".
- **\_\_tests\_\_/setup.test.js (Lines 34-40):** Tests assert that levels 1-3
  are named "Basic Accessibility", "Semantic Stability", and "Agent-Tested".
- **Note:** The test assertions represent a completely different, older maturity
  level naming scheme.

### 1. Foundational Requirements

**[DRIFT] Undocumented FRs in tests**

- **README.md / docs/whitepaper.md:** Define FR-1 (Initial Payload
  Accessibility) and FR-2 (Semantic Discoverability).
- **\_\_tests\_\_/setup.test.js (Lines 24-32):** Tests assert the existence of
  FR-1 through FR-7 (e.g., FR-5: Form Accessibility, FR-7: Performance
  Optimization).
- **Note:** The test framework asserts requirements that do not exist in the
  v3.0 documentation.

## README.md vs package.json

### Description

**[VARIATION] Framework target description**

- **README.md (Line 5):** "BiModal Design is a framework for building interfaces
  that work natively across the full AI agent capability spectrum."
- **package.json:**
  `"description": "A design framework for building dual-mode interfaces that work optimally for both humans and AI agents"`
- **Note:** The README reflects a v3.0 focus entirely on the agent capability
  spectrum, while package.json retains the legacy "humans and AI agents"
  language.

## README.md vs AGENTS.md

### 1. Foundational Requirements

**[VARIATION] FR-1 definition and scope**

- **README.md (Lines 87-88):** "The foundational requirement: critical content
  must exist in the initial HTTP response."
- **AGENTS.md (Lines 18-19):** "**FR-1 (Initial Payload Accessibility)**:
  Content must exist in the server's initial HTML response — this is Layer 1,
  the foundation"
- **Note:** The definition of FR-1 is perfectly consistent across both
  artifacts.

## README.md vs tools/validators/fr1-checker.js

### 1. Foundational Requirements (Implementation)

**[VARIATION] Scope of FR-1 Checker**

- **README.md (Lines 94-96):** "FR-1 Checker (`fr1-checker.js`) — comprehensive
  Layer 1-2 audit with detailed scoring across structure, semantics, navigation,
  forms, content meaning, and agent features."
- **tools/validators/fr1-checker.js:** Validates basic structure, semantic
  content, navigation, and agent features.
- **Note:** The checker actually implements Layer 1 and Layer 2 validation as
  properly documented in the README. No drift exists.

## README.md vs examples/

### 5. Examples

**[VARIATION] Native semantic vs explicit roles**

- **README.md (Line 69):** Snippet uses
  `<main role="main" aria-label="Product catalog">`
- **examples/ssr-pass-example.html (Line 16):** Snippet uses
  `<main aria-label="Product catalog">`
- **Note:** The example omits `role="main"` because it relies on native HTML5
  landmark semantics, which is an acceptable contextual variation.

## README.md vs tools/validators/

### 7. Quick Start commands

**[VARIATION] Command accuracy**

- **README.md (Lines 57-61):** Lists Quick Start commands
  `node tools/validators/fr1-validator.js https://your-site.com` and
  `node tools/validators/fr1-checker.js https://your-site.com --verbose`.
- **tools/validators/:** Both commands are correctly implemented and functional
  as documented.
