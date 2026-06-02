# Documentation drift report [2026-06-02]

## README.md vs docs/whitepaper.md

**[DRIFT] Key Research Findings**
- **README.md (lines 116-121)**: Lists baseline successes: "12-20% baseline success for HTTP Retrievers... improving to 42-65% with Layer 1 compliance and 60-75% with full Layer 1-3 implementation", and "35-50% baseline success for Browser Automation agents... improving to 55-72% with semantic structure and up to 75-88% with structured data."
- **docs/whitepaper.md (lines 498-508)**: Lists specific numbers in a table format:
  `| Level 0 (HTTP Retrievers) | 12-20% | 42-65% | 60-75% |` and
  `| Level 2 (Browser Automation) | 35-50% | 55-72% | 75-88% |`.
  Also, in lines 103-104:
  `| HTTP Retriever Success | 12% | 42-70% | 42-70% |` and `| Browser Automation Success | 25-40% | 50-65% | 70-85% |`
- **Note**: The README matches the whitepaper's numbers from the table in section 5.2, but the whitepaper contains conflicting numbers in the executive summary (section 1).

**[VARIATION] Design Principles**
- **README.md (lines 149-164)**: Highlights standard patterns under core patterns: "Layer 1: Content in initial HTML (SSR/SSG)", "Layer 2: Semantic structure with ARIA", "Layer 3: Structured data with schema.org". Does not explicitly mention WCAG 2.2 AA.
- **docs/whitepaper.md (lines 1360, 2014)**: Explicitly builds upon and lists WCAG 2.2: `- **WCAG 2.2**: BiModal Design's Layer 2 directly builds on and extends WCAG`.

**[DRIFT] Framework Maturity Levels**
- **README.md (lines 267-273)**: Shows the Maturity Levels table matching the whitepaper's updated table (Level 0: 40-65% success rate, up to Level 4: 90-98% success rate). However, the README mentions 5 levels (0-4), whereas the whitepaper describes a six-level taxonomy replacing the binary (Level 0-5).
- **docs/whitepaper.md (lines 136-210)**: Discusses Level 0 to Level 5. The maturity levels table in the whitepaper (lines 1474-1480) covers Level 0-4, but Agent Capability Spectrum covers Levels 0-5.

## README.md vs tools/validators/

**[QUESTION] Quick Start commands**
- **README.md (lines 140-145)**: Recommends `node tools/validators/fr1-validator.js https://your-site.com` for a quick pass/fail check, and `node tools/validators/fr1-checker.js https://your-site.com --verbose` for a comprehensive audit.
- **tools/validators/fr1-validator.js (line 7)**: States `Usage: node fr1-validator.js <url>`.
- **tools/validators/fr1-checker.js (line 638)**: States `Usage: fr1-checker <url> [options]`.
- **package.json (lines 9, 21)**: Defines `bmd-validate` as `node tools/validators/fr1-validator.js`. It's ambiguous which script is intended as the primary CLI entrypoint or how users should run them (via path vs npm script).

**[VARIATION] Foundational Requirements (FR-1)**
- **README.md (lines 183-186)**: Defines FR-1: `The foundational requirement: critical content must exist in the initial HTTP response. This is Layer 1 of defense in depth — the floor, not the ceiling.`
- **tools/validators/fr1-validator.js (lines 79-84)**: Implementation includes specific checks for HTML text length `> 200`, semantic tags `/<(article|section|nav|main|header|footer)/`, lack of SPA shells, and missing JS requirements.
- **tools/validators/fr1-checker.js (lines 11-12)**: Describes FR-1: `Tests whether a page provides meaningful content without JavaScript execution. This is the foundational requirement (FR-1) for BiModal Design compliance.`

## README.md vs examples/

**[DRIFT] Examples and Custom Attributes**
- **README.md (lines 199-211)**: Specifies standard patterns: `v3.0 uses established standards as the primary semantic layer, with data-agent-* attributes as a supplementary layer for intent and action metadata that standards don't cover`. It says schema.org and ARIA replace custom attributes.
- **examples/astro-ssg-example.md (lines 806, 978-1197)**: Heavily relies on `data-agent-*` attributes despite the v3 migration note. E.g., `data-agent-page="contact"`, `data-agent-content-type="support-form"`.
- **examples/nuxt-ssr-example.md (lines 158-952)**: Heavily relies on `data-agent-*` attributes: `data-agent-page="home"`, `data-agent-intent="browse-products"`.
- **examples/react-spa-example.md (lines 1733, 1874, 2085)**: Still uses `data-agent-rendered="ssr"` and `data-agent-detected={isAgent}`.
- **examples/csr-mitigation.md**: Uses `data-agent-*` attributes.
