# Documentation drift report [2026-05-31]

## README.md vs docs/whitepaper.md

### Baseline Success Rates [DRIFT]

- **README.md (lines 116-121)**: States baseline success rates as ranges:
  > "- **12-20% baseline success** for HTTP Retrievers on conventional CSR
  > sites..." "- **35-50% baseline success** for Browser Automation agents on
  > conventional UI..."
- **docs/whitepaper.md (lines 103-104)**: States baseline success rates as
  static single numbers (or different ranges):
  > "| HTTP Retriever Success | 12% | 42-70% | 42-70% |" "| Browser Automation
  > Success | 25-40% | 50-65% | 70-85% |" _(Note: A later table in
  > `docs/whitepaper.md` agrees with the README's ranges, creating an internal
  > contradiction in the whitepaper itself)._

### Maturity Levels [QUESTION]

- **README.md (line 80 and line 231)**: The "Agent Capability Spectrum" is
  presented as a 6-level taxonomy (Levels 0 through 5). However, the "Maturity
  Levels" table only maps 5 levels (Level 0 through 4), with Level 4 covering
  "All levels".
  > README.md line 80: "Level 5: Protocol-Native → MCP, A2A, NLWeb — rich agent
  > protocols" README.md line 231 (Maturity Levels Table): "| 4 | Agent-Native |
  > Layers 1-5 | All levels | 90-98% |"
- **docs/whitepaper.md (lines 1468-1474)**: Uses the exact same 5-level
  "Maturity Levels" table that contradicts the 6-level taxonomy. It's unclear if
  Level 5 from the spectrum is intentionally folded into Maturity Level 4.

### Quick Start Commands [VARIATION]

- **README.md (lines 134-135)**: Suggests running the validator script directly
  using `node`:
  > "```bash node tools/validators/fr1-validator.js https://your-site.com
  >
  > ```"
  >
  > ```
- **docs/whitepaper.md (line 2130)**: Recommends using `npx` with the framework
  package:
  > "`npx @bimodal-design/framework validate https://yoursite.com`"

## README.md vs examples/astro-ssg-example.md

### Usage of Custom Data Attributes [DRIFT]

- **README.md (lines 201-209)**: Frames `data-agent-*` attributes as a
  "supplementary layer":
  > "v3.0 uses established standards as the **primary** semantic layer, with
  > `data-agent-*` attributes as a **supplementary** layer for intent and action
  > metadata that standards don't cover"
- **docs/whitepaper.md (lines 812-837)**: Directly contradicts the README by
  stating a complete migration away from these attributes:
  > "BiModal Design v2.x recommended custom `data-agent-*` attributes... In
  > v3.0, we recommend migrating to established standards... Why We're Moving
  > Away from `data-agent-*`... No browser or agent framework recognizes
  > them..."
- **examples/astro-ssg-example.md**: Uses `data-agent-*` attributes extensively
  throughout the file (e.g., line 158: `<body data-agent-ready="true">`),
  directly conflicting with the whitepaper's assertion that v3.0 migrates away
  from them.

## README.md vs package.json

### Package Script Commands [VARIATION]

- **README.md (lines 134-135)**: Suggests direct node execution:
  > "`node tools/validators/fr1-validator.js https://your-site.com`"
- **package.json (lines 8-13)**: Exposes `bmd-validate` as a binary, suggesting
  a different expected usage pattern than what the README documents.
