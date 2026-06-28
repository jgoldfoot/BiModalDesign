# Documentation drift report [2026-06-28]

## README.md vs docs/whitepaper.md

### [QUESTION] Design Principles Discrepancy

The prompt suggests that `README.md` lists "WCAG 2.2 AA" and "semantic HTML5
landmarks" as core design principles. However, a review of the files shows these
are completely absent from the README, though they appear in the white paper.

- **`README.md` (lines 106-107)**:
  > `Layer 3: Structured Data       (schema.org, JSON-LD)      → Level 1-3`
  > `Layer 2: Semantic Structure    (HTML5, ARIA, headings)     → Level 1-3`
- **`docs/whitepaper.md` (line 1450)**:
  > `- **WCAG 2.2**: BiModal Design's Layer 2 directly builds on and extends WCAG`
- **`docs/whitepaper.md` (line 771)**:
  > `Use HTML5 landmarks and ARIA to communicate content structure:` This raises
  > a question of whether the README should be updated to explicitly include
  > WCAG 2.2 AA.

### [VARIATION] Framework Maturity Levels

The tables defining the Maturity Levels match identically in structure,
coverage, and success thresholds. No drift found.

- **`README.md` (lines 296-302)**: Table lists Levels 0-4 (Infrastructure Ready
  to Agent-Native).
- **`docs/whitepaper.md` (lines 1564-1570)**: Table is identical.

### [VARIATION] Foundational Requirements (FR-1)

The definition of FR-1 is consistent between the entry-point summary and the
white paper.

- **`README.md` (line 197)**:
  > `The foundational requirement: critical content must exist in the initial HTTP response. This is Layer 1 of defense in depth — the floor, not the ceiling.`
- **`docs/whitepaper.md` (lines 403, 448)**:
  > `FR-1 remains the foundational requirement of BiModal Design.`
  > `FR-1 is the floor, not the ceiling.`

### [VARIATION] Key Research Findings

The baseline numbers and improvement statistics match perfectly between the
documents. No drift.

- **`README.md` (line 128)**:
  > `- **35-50% baseline success** for Browser Automation agents on conventional UI, improving to **55-72%** with semantic structure and up to **75-88%** with structured data.`
- **`docs/whitepaper.md` (line 105)**:
  > `| Browser Automation Success            | 35-50%          | 55-72%              | 75-88%                          |`

### [VARIATION] Citations

The arXiv IDs and cited papers match exactly across both documents.

- **`README.md` (lines 340-368)**: Cites identical arXiv IDs (e.g.,
  2503.23350v4).
- **`docs/whitepaper.md` (lines 2068-2082)**: Mirrors the README citations.

## README.md vs tools/validators/fr1-checker.js

### [VARIATION] FR-1 Checker Implementation

The `fr1-checker.js` implementation explicitly validates all the aspects
described in the README. No drift found.

- **`README.md` (line 204)**:
  > `- **fr1-checker.js** — comprehensive audit covering semantic content, navigation accessibility, form labels, heading hierarchy, ARIA landmarks, image alt text, and agent-specific features.`
- **`tools/validators/fr1-checker.js` (lines 155, 191, 213, 237, 245, 254)**:
  Functions check headings, navigation, forms, images, landmarks, and agent
  features respectively.

## README.md vs examples/

### [VARIATION] Core Pattern Snippets vs Real Examples

The examples in the `examples/` directory use slightly different patterns than
the inline snippet in the README, though both are valid.

- **`README.md` (lines 166-168)**:
  > `<main role="main" aria-label="Product catalog">`
  > `  <h1>Wireless Headphones</h1>`
  > `  <nav role="navigation" aria-label="Main navigation">`
- **`examples/ssr-pass-example.html` (lines 50-51)**:
  > `<main aria-label="Product catalog">` `  <h1>Premium Tech Accessories</h1>`
  > The omission of `role="main"` in the example file is an acceptable
  > variation, as it relies on native HTML5 landmark semantics.
