# AGENTS.md

## For AI Coding Agents

This file helps AI agents understand how to contribute to BiModal Design, a
framework for building interfaces that work across the full AI agent capability
spectrum.

---

## Project Overview

**BiModal Design v3.0** addresses a critical gap: interfaces today face a
spectrum of AI consumers, not a single one. The framework provides a Defense in
Depth strategy with five architectural layers ensuring every agent type is
served.

**Core Concepts:**

- **Agent Capability Spectrum**: Six levels of agent capability (Level 0: HTTP
  Retrievers → Level 5: Protocol-Native Agents)
- **Defense in Depth**: Five layers (Content Accessibility → Semantic Structure →
  Structured Data → API Surface → Agent Protocols)
- **FR-1 (Initial Payload Accessibility)**: Content must exist in the server's
  initial HTML response — this is Layer 1, the foundation

**Key Standards (v3.0):**

- schema.org (`itemscope`, `itemprop`, `itemtype`) for structured data
- WAI-ARIA (`aria-label`, `aria-current`, `aria-required`) for semantics
- OpenAPI for API documentation
- MCP, A2A, NLWeb for agent protocols

**Important**: v3.0 replaces custom `data-agent-*` attributes with established
web standards. Do not add new `data-agent-*` attributes.

---

## Repository Structure

```
BiModalDesign/
├── README.md                          # Main documentation
├── AGENTS.md                          # This file
├── docs/
│   ├── whitepaper.md                  # Framework specification v3.0
│   ├── implementation-guide.md        # How to implement layers 1-5
│   ├── compliance-checklist.md        # Layer-by-layer compliance criteria
│   ├── getting-started.md             # Quick start guide
│   ├── troubleshooting.md             # Common issues and solutions
│   ├── api-reference.md               # Technical reference
│   └── case-studies.md                # Real-world examples
├── examples/
│   ├── csr-fail-example.html          # CSR that fails FR-1
│   ├── ssr-pass-example.html          # SSR that passes FR-1
│   ├── astro-ssg-example.md           # Astro static generation
│   ├── nextjs-ssr-example.md          # Next.js server rendering
│   ├── nuxt-ssr-example.md            # Nuxt/Vue SSR
│   ├── react-spa-example.md           # React SPA mitigation
│   └── csr-mitigation.md             # CSR fallback strategies
└── tools/
    └── validators/
        ├── fr1-validator.js           # FR-1 validation tool
        ├── fr1-checker.js             # Advanced FR-1 checker
        └── compliance-auditor.js      # Full compliance audit
```

---

## How to Contribute

### 1. Testing Changes

Before submitting any changes:

```bash
cd tools/validators
npm install
npm test

# Test that CSR example fails FR-1
node fr1-validator.js ../../examples/csr-fail-example.html
# Expected: FAIL

# Test that SSR example passes FR-1
node fr1-validator.js ../../examples/ssr-pass-example.html
# Expected: PASS
```

### 2. Adding New Examples

When adding examples:

- Use semantic HTML5 elements (`<article>`, `<section>`, `<nav>`, `<main>`)
- Use schema.org structured data (`itemscope`, `itemprop`)
- Use ARIA attributes (`aria-label`, `aria-required`)
- Do NOT use `data-agent-*` attributes (deprecated in v3.0)
- Include JSON-LD structured data blocks
- Add clear comments explaining which layers are demonstrated
- Test with the FR-1 validator before committing

Template for new examples:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content="..." />
    <meta property="og:title" content="..." />
    <!-- Layer 3: JSON-LD structured data -->
    <script type="application/ld+json">
      { "@context": "https://schema.org", "@type": "WebPage", "name": "..." }
    </script>
  </head>
  <body>
    <!-- Layer 1: Content in initial HTML (FR-1) -->
    <!-- Layer 2: Semantic structure with ARIA -->
    <main aria-label="Page content">
      <article itemscope itemtype="https://schema.org/Article">
        <h1 itemprop="name">Article Title</h1>
        <p itemprop="description">Article description</p>
      </article>
    </main>

    <script>
      // JavaScript is OPTIONAL — progressive enhancement only
    </script>
  </body>
</html>
```

### 3. Improving the Validator

The FR-1 validator checks:

- Content exists in initial payload (text length > 200 chars)
- Not a blank SPA shell (no empty `<div id="root">`)
- Uses semantic HTML5 elements
- No JavaScript required for core content
- Includes structured metadata
- Contains navigable links

### 4. Documentation Updates

When updating docs:

- Reference the Agent Capability Spectrum (Levels 0-5) where relevant
- Reference the Defense in Depth layers (Layers 1-5)
- Use schema.org and ARIA in code examples, not `data-agent-*`
- Specify which agent levels benefit from each pattern

### 5. Key Principles

1. **Content First**: Initial HTML payload must contain all critical content
   (Layer 1)
2. **Semantic Markup**: Use HTML5 elements, ARIA labels, heading hierarchy
   (Layer 2)
3. **Structured Data**: Include schema.org microdata and JSON-LD (Layer 3)
4. **Standards Over Custom**: Use established standards, not custom attributes
5. **Progressive Enhancement**: JavaScript should enhance, not enable
6. **Testable**: Changes should be validatable with the FR-1 tool

---

## Common Agent Tasks

### Task: Validate a URL for FR-1 compliance

```bash
node tools/validators/fr1-validator.js https://example.com
```

### Task: Run full compliance audit

```bash
node tools/validators/compliance-auditor.js https://example.com --verbose
```

### Task: Create a new example

1. Copy `examples/ssr-pass-example.html` as a starting point
2. Modify for your use case using v3.0 patterns
3. Add schema.org structured data and ARIA labels
4. Test with validator
5. Update README to reference the new example

### Task: Generate documentation

When generating docs:

- Focus on actionable guidance organized by Defense in Depth layer
- Include code examples using schema.org and ARIA
- Show before/after comparisons (v2.x `data-agent-*` → v3.0 standards)
- Specify which agent levels (0-5) benefit from each pattern
- Link to working examples

---

## Testing Your Contributions

### Manual Testing Checklist

- [ ] Validator runs without errors
- [ ] CSR example still fails FR-1
- [ ] SSR example still passes FR-1
- [ ] New examples use schema.org/ARIA (not `data-agent-*`)
- [ ] Documentation references v3.0 concepts
- [ ] Links in README work
- [ ] Code follows existing patterns

### Validation Commands

```bash
# Test validator tool
node tools/validators/fr1-validator.js https://example.com

# Test local files
node tools/validators/fr1-validator.js examples/ssr-pass-example.html

# Run test suite
cd tools/validators && npm test
```

---

## Questions or Issues?

- Check the [White Paper v3.0](docs/whitepaper.md) for framework specification
- Review the [Implementation Guide](docs/implementation-guide.md) for practical
  steps
- Open an issue with the label `question` for clarification
- Reference existing examples for patterns

---

## License

This project is licensed under Apache-2.0. All contributions will be under the
same license.

---

**Note for AI Agents:** This project is meta — it's about making interfaces
accessible to agents across the full capability spectrum. When contributing,
consider: "Does this work for a Level 0 HTTP retriever? Does it also provide
richer data for a Level 5 protocol-native agent?" If content is invisible to
Level 0 agents, it likely violates FR-1 (Layer 1).
