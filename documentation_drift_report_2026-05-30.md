# Documentation drift report [2026-05-30]

## README.md vs docs/whitepaper.md

### 1. Browser Automation Baseline Success Rates [DRIFT]

- **README.md (Line 118):** States the baseline success is 72%:
  > `- **72% baseline success** for Browser Automation agents on conventional UI,`
- **docs/whitepaper.md (Line 488):** Lists the baseline success as 35-50%:
  > `| Level 2 (Browser Automation)           | 35-50%              | 55-72%                 | 75-88%                  |`
  > _(Note: A related table on line 100 also conflicts, citing 25-40%
  > baseline)._

### 2. Quick Start Validation Command [VARIATION]

- **README.md (Lines 134-135):** Demonstrates local script execution:
  > ```bash
  > node fr1-validator.js https://your-site.com
  > ```
- **docs/whitepaper.md (Line 2120):** Recommends an `npx` framework execution:
  > `npx @bimodal-design/framework validate https://yoursite.com`

## README.md vs examples/astro-ssg-example.md

### 3. Usage of Custom Data Attributes [DRIFT]

- **README.md (Lines 185-186):** Explicitly deprecates custom data attributes
  for v3.0:
  > `### Standards Over Custom Attributes`
  > `v3.0 migrates from custom data-agent-* attributes to established standards:`
- **examples/astro-ssg-example.md (Line 158):** Example heavily utilizes
  deprecated `data-agent-*` attributes, contradicting the README's core
  patterns:
  > `<body data-agent-ready="true">`
