# Documentation drift report [2026-05-28]

## README vs whitepaper

- **[DRIFT]** Research Findings (Baseline Success for Level 2/Browser Automation): `README.md` (line 116) claims **"72% baseline success for Browser Automation agents on conventional UI"**, while `docs/whitepaper.md` (line 486, Section 5.2 table) claims **"35-50%"** baseline success for Level 2 (Browser Automation) on Conventional UI.
- **[DRIFT]** Design Principles (WCAG 2.2 AA in Layer 2): `README.md` (line 101) lists **"WCAG 2.2 AA"** as a part of Layer 2: Semantic Structure. However, `docs/whitepaper.md` Section 3.3 (Layer 2) does not mention WCAG 2.2 AA in its requirements, though it is mentioned elsewhere in the whitepaper (Section 11.5).

## README vs FR-1 Checker implementation

- **[VARIATION]** FR-1 Definition: `README.md` (lines 173-176) states that the validator checks text length, semantic structure, and absence of an empty SPA shell (`<div id="root">`). The `tools/validators/fr1-checker.js` implementation explicitly validates all these properties in `checkBasicStructure`, `checkSemanticContent`, and `checkContentMeaning`. However, it goes beyond the README by also validating form accessibility, navigation links, minimum semantic element counts, images with alt text, and ARIA landmarks.

## README vs docs/compliance-checklist.md

- **[VARIATION]** Design Principles (WCAG 2.2 AA in Layer 2): `README.md` includes **"WCAG 2.2 AA"** in its Layer 2 design principles, but `docs/compliance-checklist.md` does not list WCAG 2.2 AA under its Layer 2 checklist.

## README vs examples/

- **[VARIATION]** Examples using `data-agent-*` vs `schema.org`/`aria`: `README.md` (line 186) states that v3.0 migrates from custom `data-agent-*` attributes to standard attributes like `schema.org` and `aria`. However, `examples/astro-ssg-example.md` (lines 352-378) still contains significant use of `data-agent-context`, `data-agent-action`, `data-agent-component`, etc. within the `agent-detection.js` script, indicating legacy pattern drift.
