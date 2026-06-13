# Documentation drift report [2026-06-13]

## README.md vs docs/whitepaper.md

**[DRIFT] Framework Maturity Levels Table Headers**

- `README.md` (Line 285):
  `| Level | Name                    | Layers     | Agent Coverage | Success Rate |`
- `docs/whitepaper.md` (Line 1521):
  `| **Level** | **Name**                    | **Layers Implemented** | **Agent Coverage** | **Typical Success Rate** |`
  > The column headers for the Maturity Levels table are inconsistent between
  > the README and the white paper.

**[DRIFT] Design Principles (WCAG Citation)**

- `README.md` (Line 104): Does not explicitly mention WCAG 2.2 AA.
- `docs/whitepaper.md` (Line 1407):
  `- **WCAG 2.2**: BiModal Design's Layer 2 directly builds on and extends WCAG compliance`
  > The README omits WCAG 2.2 AA as a core principle.

**[VARIATION] Foundational Requirement 1 Definition**

- `README.md` (Line 186): `### FR-1: Initial Payload Accessibility` /
  `The foundational requirement: critical content must exist in the initial HTTP response.`
- `docs/whitepaper.md` (Line 2091):
  `**FR-1 (Foundational Requirement 1)**: Initial Payload Accessibility — the requirement that critical content exists in the initial HTTP response from the server.`
  > The wording of FR-1 definitions varies slightly, though the meaning is
  > consistent.

## README.md vs tools/validators/fr1-checker.js

**[VARIATION] Validation Tools Scope**

- `README.md` (Line 196):
  `comprehensive audit covering semantic content, navigation accessibility, form labels, heading hierarchy, ARIA landmarks, image alt text, and agent-specific features`
- `tools/validators/fr1-checker.js` (Line 384): Implements checking logic for
  all mentioned features with components: `structure`, `semantic`, `navigation`,
  `forms`, `content`.
  > The checker implementation matches the README description, presenting no
  > substantive drift.
