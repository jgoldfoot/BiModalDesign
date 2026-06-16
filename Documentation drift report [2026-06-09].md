# Documentation drift report [2026-06-09]

## README vs docs/whitepaper.md

**FR-1 Definitions** [VARIATION] Both artifacts describe FR-1 identically as
"Initial Payload Accessibility" where critical content must exist in the initial
HTTP response, serving Level 0-1 agents.

- `README.md` (line 186):
  `The foundational requirement: critical content must exist in the initial HTTP...`
- `docs/whitepaper.md` (line 400):
  `FR-1 remains the foundational requirement of BiModal Design. In the...`

**Framework Maturity Levels** [VARIATION] The README and white paper both
describe 5 maturity levels with identical numerical levels, names, and agent
coverage. The only difference is minor formatting (bolding in the table).

- `README.md` (lines 276-280):
  `| 0 | Infrastructure Ready | Layer 1 | Level 0-1 | 40-65% |`
- `docs/whitepaper.md` (lines 1509-1514):
  `| 0 | **Infrastructure Ready** | Layer 1 | Level 0-1 agents | 40-65% |`

**Design Principles** [DRIFT] The README and white paper disagree on the role of
`data-agent-*` attributes. The README does not list WCAG 2.2 AA in its semantic
layer, while the whitepaper does.

- `README.md` (lines 201-216): Describes `data-agent-*` attributes as a
  **supplementary** layer for intent and action metadata that standards don't
  cover.
- `docs/whitepaper.md` (lines 1975-1977): "Standards over custom attributes:
  Schema.org, WAI-ARIA, and OpenAPI replace custom `data-agent-*` attributes —
  achieving the same goals with ecosystem-wide support". However, earlier in the
  whitepaper (lines 834-874), it matches the README's supplementary stance.
- `README.md` (line 152): Lists `<!-- Layer 2: Semantic structure with ARIA -->`
  without WCAG 2.2 AA.
- `docs/whitepaper.md` (line 1874):
  `**WCAG 2.2**: BiModal Design's Layer 2 directly builds on and extends WCAG`

**Key Research Findings** [VARIATION] Both the README and whitepaper contain
consistent baseline and improvement numbers.

- `README.md` (line 128): Lists `12-20% baseline success` improving to `60-75%`
  and `35-50% baseline success` improving up to `75-88%`.
- `docs/whitepaper.md` (lines 479-482): Contains matching table numbers.

**Citations** [VARIATION] The white paper and README share the same core
citations, but the README includes explicit arXiv IDs for some that the
whitepaper does not in its main section, and vice versa.

## AGENTS.md vs README

**Design Principles (data-agent-\* attributes)** [DRIFT] `AGENTS.md`
specifically states to not use `data-agent-*` attributes over standards, but
still maintains they are supplementary, however it does conflict in places.

- `AGENTS.md` (lines 34-35): "**Important**: v3.0 uses established standards
  (schema.org, WAI-ARIA, OpenAPI) as the primary semantic layer. `data-agent-*`
  attributes are retained as a supplementary layer..."

## Examples vs README / White paper

**Example Code Implementation** [DRIFT] Example files heavily use `data-agent-*`
attributes despite the framework's pivot toward standard semantic HTML and
structured data in v3.0.

- `examples/react-spa-example.md` heavily uses `data-agent-component` and
  `data-agent-content`.

## tools/validators/ vs README

**Quick Start commands** [DRIFT] The quick start commands shown in the artifacts
mismatch what is available or recommended.

- `README.md` (lines 142-147): Recommends running
  `node tools/validators/fr1-validator.js https://your-site.com` directly, or
  `fr1-checker.js`.
- `docs/whitepaper.md` (line 2175): Recommends running
  `npx @bimodal-design/framework validate https://yoursite.com`. The package
  name matches `package.json`, but `validate` script runs `fr1-validator.js`.
  However, `package.json`'s `bin` maps `bmd-validate` to
  `./tools/validators/fr1-validator.js`.

**FR-1 Checker Implementation** [VARIATION] The tools actually validate what the
README describes. `fr1-validator.js` and `fr1-checker.js` both check for initial
payload accessibility without JS, which aligns perfectly with FR-1.
