# Documentation drift report [2026-06-07]

## README vs docs/whitepaper.md

**FR-1 Definitions** [VARIATION] Both artifacts describe FR-1 identically as
"Initial Payload Accessibility" where critical content must exist in the initial
HTTP response, serving Level 0-1 agents.

- README (`README.md`, line 186):
  `The foundational requirement: critical content must exist in the initial HTTP...`
- White paper (`docs/whitepaper.md`, line 400):
  `FR-1 remains the foundational requirement of BiModal Design. In the...`

**Framework Maturity Levels** [VARIATION] The README and white paper both
describe 5 maturity levels with identical numerical levels, names, and agent
coverage. The only difference is minor formatting (bolding in the table).

- README (`README.md`, lines 276-280):
  `| 0 | Infrastructure Ready | Layer 1 | Level 0-1 | 40-65% |`
- White paper (`docs/whitepaper.md`, lines 1509-1514):
  `| 0 | **Infrastructure Ready** | Layer 1 | Level 0-1 agents | 40-65% |`

**Design Principles (data-agent-\* attributes)** [DRIFT] The README and white
paper disagree on the role of `data-agent-*` attributes in v3.0.

- README (`README.md`, lines 201-216): Describes `data-agent-*` attributes as a
  **supplementary** layer for intent and action metadata that standards don't
  cover.
- White paper (`docs/whitepaper.md`, lines 1975-1977): "Standards over custom
  attributes: Schema.org, WAI-ARIA, and OpenAPI replace custom `data-agent-*`
  attributes — achieving the same goals with ecosystem-wide support". However,
  earlier in the whitepaper (lines 834-874), it matches the README's
  supplementary stance. The conclusion introduces a conflicting summary.

**Key Research Findings** [VARIATION] The research numbers are consistent across
the artifacts. 72% human baseline and 12% baseline agent are consistent, and
improvements up to 88% are consistent.

**Citations** [VARIATION] The white paper and README share the same core
citations (WebAgents Survey 2025, OSWorld, etc.), but the README includes
explicit arXiv IDs for some that the whitepaper does not in its main section,
and vice versa.

## AGENTS.md vs README

**Design Principles (data-agent-\* attributes)** [DRIFT] `AGENTS.md` strictly
forbids `data-agent-*` attributes, contradicting the README's guidance that they
are retained as a supplementary layer.

- `AGENTS.md` (`AGENTS.md`, lines 34-35): "**Important**: v3.0 replaces custom
  `data-agent-*` attributes with established web standards. Do not add new
  `data-agent-*` attributes."
- README (`README.md`, lines 201-216): Describes `data-agent-*` as a
  supplementary layer and links to the API reference.

## Examples vs README / White paper

**Example Code Implementation** [DRIFT] Example files heavily use `data-agent-*`
attributes despite the framework's pivot toward standard semantic HTML and
structured data in v3.0.

- `examples/astro-ssg-example.md` (`examples/astro-ssg-example.md`, lines
  1154-1197): Contains numerous instances of `data-agent-component`,
  `data-agent-content`, `data-agent-field`, and `data-agent-action`.
- `examples/astro-ssg-example.md` (`examples/astro-ssg-example.md`, lines
  1494-1538): The agent detection script specifically checks for and applies
  `data-agent-context`, `data-agent-type`, `data-agent-enhanced`, etc.

## tools/validators/ vs README

**Quick Start commands** [DRIFT] The quick start commands shown in the artifacts
mismatch what is available or recommended.

- README (`README.md`, lines 142-147): Recommends running
  `node tools/validators/fr1-validator.js https://your-site.com` directly.
- Whitepaper (`docs/whitepaper.md`, line 2175): Recommends running
  `npx @bimodal-design/framework validate https://yoursite.com`. The package
  name matches `package.json`, but `validate` script runs `fr1-validator.js`.
  However, `package.json`'s `bin` maps `bmd-validate` to
  `./tools/validators/fr1-validator.js`.

**FR-1 Checker Implementation** [VARIATION] The tools actually validate what the
README describes. `fr1-validator.js` and `fr1-checker.js` both check for initial
payload accessibility without JS, which aligns perfectly with FR-1.
