# Documentation drift report [2026-06-01]

## README.md vs docs/whitepaper.md

### Key Research Findings (Baseline Success Rates) [DRIFT]
- **README.md (lines 115-121)**: States baseline success rates as ranges:
  > "- **12-20% baseline success** for HTTP Retrievers on conventional CSR sites, improving to **42-65%** with Layer 1 compliance and **60-75%** with full Layer 1-3 implementation."
  > "- **35-50% baseline success** for Browser Automation agents on conventional UI, improving to **55-72%** with semantic structure and up to **75-88%** with structured data."
- **docs/whitepaper.md (lines 102-104)**: The "Quantified Impact" table lists single percentage values that contradict the README ranges and even another table later in the whitepaper itself (line 500):
  > `| HTTP Retriever Success | 12% | 42-70% | 42-70% |`
  > `| Browser Automation Success | 25-40% | 50-65% | 70-85% |`

### Framework Maturity Levels & Capability Spectrum [QUESTION]
- **README.md (lines 79-84) & docs/whitepaper.md**: The "Agent Capability Spectrum" is presented as a 6-level taxonomy (Levels 0 through 5).
- **README.md (line 267) & docs/whitepaper.md (line 1471)**: The "Maturity Levels" table only maps 5 levels (Level 0 through 4), with Level 4 covering "All levels" and Layers 1-5. It is unclear if Level 5 from the spectrum is intentionally folded into Maturity Level 4, causing a misalignment between the 6 capability levels and 5 maturity levels.

### Usage of Custom Data Attributes (`data-agent-*`) [DRIFT]
- **README.md (lines 191-197)**: States that custom `data-agent-*` attributes are still used as a supplementary layer:
  > "v3.0 uses established standards as the **primary** semantic layer, with `data-agent-*` attributes as a **supplementary** layer for intent and action metadata that standards don't cover... Agent attributes describe **what agents can do with it**"
- **docs/whitepaper.md (lines 813-827)**: Explicitly states that v3.0 moves away from these custom attributes entirely:
  > "BiModal Design v2.x recommended custom `data-agent-*` attributes... In v3.0, we recommend migrating to established standards... Why We're Moving Away from `data-agent-*`... No browser or agent framework recognizes them"

### Quick Start Commands [VARIATION]
- **README.md (lines 133-138)**: Instructs users to run the validation scripts using `node`:
  > `node tools/validators/fr1-validator.js https://your-site.com`
  > `node tools/validators/fr1-checker.js https://your-site.com --verbose`
- **docs/whitepaper.md (line 2133)**: Recommends using the `npx` framework package approach:
  > `npx @bimodal-design/framework validate https://yoursite.com`

### Design Principles (WCAG 2.2) [VARIATION]
- **README.md**: Does not explicitly reference WCAG 2.2 AA in its "Quick Start" or "Key Concepts" sections.
- **docs/whitepaper.md (lines 1359-1360)**: Explicitly notes WCAG 2.2 as a design principle foundation:
  > "- **WCAG 2.2**: BiModal Design's Layer 2 directly builds on and extends WCAG compliance"

## README.md vs examples/

### Examples and Custom Attributes [DRIFT]
- **README.md (line 187) / docs/whitepaper.md**: Assert that v3.0 standardizes on HTML5 and ARIA.
- **examples/astro-ssg-example.md (line 158)**, **examples/react-spa-example.md (line 1733)**, **examples/csr-mitigation.md (line 21)**, **examples/nuxt-ssr-example.md (line 158)**: Code examples extensively use the deprecated `data-agent-*` attributes throughout the examples, despite the whitepaper stating they are deprecated and the README stating they are only supplementary. Examples include:
  > `<body data-agent-ready="true">`
  > `<main role="main" id="main-content" data-agent-component="main-content">`

## README.md vs tools/validators/

### Foundational Requirements (FR-1) [VARIATION]
- **README.md (lines 173-174)**: Defines FR-1 simply:
  > "The foundational requirement: critical content must exist in the initial HTTP response. This is Layer 1 of defense in depth — the floor, not the ceiling."
- **tools/validators/fr1-validator.js (lines 89-98)**: The implementation performs specific checks (e.g. `body.length > 1000`, `body.replace(/<[^>]*>/g, '').trim().length > 200`, no `<div id="root">`) to validate FR-1. These checks enforce rules that are not explicitly documented in the README definition.

## README.md vs package.json

### Package Script Commands [VARIATION]
- **README.md (lines 133-138)**: Instructs direct script execution:
  > `node tools/validators/fr1-validator.js https://your-site.com`
- **package.json (lines 8-11)**: Configures binary aliases like `"bmd-validate": "./tools/validators/fr1-validator.js"` and exposes `npm run validate` which differs from the README's explicit `node` usage.

## docs/whitepaper.md vs docs/implementation-guide.md

### OSWorld Citations [VARIATION]
- **README.md (line 313) / docs/whitepaper.md**: Reference OSWorld without an arXiv ID:
  > "OSWorld — Benchmarking Multimodal Agents for Open-Ended Tasks in Real Computer Environments"
- **docs/implementation-guide.md (line 558)**: Adds the arXiv reference for the OSWorld paper:
  > "Benchmarks like OSWorld-Human (arXiv:2506.16042)"
