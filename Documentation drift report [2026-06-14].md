# Documentation drift report [2026-06-14]

## README vs docs/whitepaper.md

**Foundational Requirements (FR-1)** [VARIATION] Both artifacts describe FR-1 as
Initial Payload Accessibility.

- `README.md` (line 186): "The foundational requirement: critical content must
  exist in the initial HTTP response."
- `docs/whitepaper.md` (line 400): "FR-1 remains the foundational requirement of
  BiModal Design. In the..."

**Framework Maturity Levels** [VARIATION] Both artifacts contain a 5-level table
(0-4) with consistent names and agent coverage, but slightly different phrasing
in column headers.

- `README.md` (line 285):
  `| Level | Name | Layers | Agent Coverage | Success Rate |`
- `docs/whitepaper.md` (line 1539):
  `| **Level** | **Name** | **Layers Implemented** | **Agent Coverage** | **Typical Success Rate** |`

**Design Principles** [VARIATION] Both artifacts list semantic HTML5 landmarks,
WCAG, ARIA roles, and JSON-LD as primary standards with the same priority.

**Key Research Findings** [DRIFT] The README claims specific numbers that differ
slightly from the whitepaper in some areas, but the "72% baseline success" is
consistent.

- `README.md` (line 119): "35-50% baseline success for Browser Automation agents
  on conventional UI, improving to 55-72%"
- `docs/whitepaper.md` (line 525):
  `| Level 2 (Browser Automation) | 35-50% | 55-72% | 75-88% |` However, the
  "12% baseline agent" (mentioned in the prompt) does not strictly appear in
  either file; instead both cite 12-20% for HTTP Retrievers.

**Citations** [VARIATION] Both list similar citations (WorkArena++, OSWorld),
but README includes more direct arXiv IDs in its list compared to whitepaper.

- `README.md` (line 309): "- **OSWorld** — \"Benchmarking Multimodal Agents for
  Open-Ended Tasks in Real Computer Environments\" (arXiv:2404.07972)"
- `docs/whitepaper.md` (line 2049): "5. **OSWorld**: \"Benchmarking Multimodal
  Agents for Open-Ended Tasks in Real Computer Environments\" —
  arXiv:2404.07972"

## AGENTS.md vs README

**Design Principles (data-agent-\* attributes)** [VARIATION] Both `AGENTS.md`
and `README.md` state `data-agent-*` attributes are supplementary.

- `AGENTS.md` (line 35): "`data-agent-*` attributes are retained as a
  supplementary layer"
- `README.md` (line 213): "`data-agent-*` attributes as a **supplementary**
  layer"

## Examples vs README / White paper

**Example Code Implementation** [DRIFT] Example files heavily use `data-agent-*`
attributes despite the framework's pivot toward standard semantic HTML and
structured data in v3.0.

- `examples/astro-ssg-example.md` (lines 1154-1197): "<form
  class=\"contact-form\" data-agent-component=\"contact-form\">" (and numerous
  other instances).
- The examples do not reference Maturity Levels explicitly.

## tools/validators/ vs README

**Quick Start Commands** [DRIFT] The quick start commands shown in the README
mismatch what is available in the package.json and Whitepaper.

- `README.md` (line 144): Recommends running
  `node tools/validators/fr1-validator.js https://your-site.com`
- `docs/whitepaper.md` (line 2175): Recommends running
  `npx @bimodal-design/framework validate https://yoursite.com`

**FR-1 Checker Implementation** [VARIATION] The
`tools/validators/fr1-checker.js` validates exactly what the README describes.
It checks for initial payload accessibility without JS, which aligns with FR-1.

- `tools/validators/fr1-checker.js` (line 108): "Analyze HTML content for FR-1
  compliance"

## package.json vs README

**Version and Description** [VARIATION] The `package.json` version is `0.1.0`,
while the `README.md` and `docs/whitepaper.md` refer to the framework version as
v3.0.

- `package.json` (line 3): `"version": "0.1.0"`
- `README.md` (line 198): "v3.0 uses established standards as the primary
  semantic layer"
