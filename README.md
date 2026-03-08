# **BiModal Design**

> **A design framework for building interfaces that work across the full AI
> agent capability spectrum — from HTTP retrievers to protocol-native agents.**

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Status: Research Framework](https://img.shields.io/badge/Status-Research%20Framework-yellow.svg)]()
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.11.0-brightgreen.svg)]()
[![Version: 3.0](https://img.shields.io/badge/version-3.0-blue.svg)]()
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## Table of Contents

1. [Overview](#overview)
2. [The Problem](#the-problem)
3. [The Agent Capability Spectrum](#the-agent-capability-spectrum)
4. [Defense in Depth](#defense-in-depth)
5. [Quick Start](#quick-start)
6. [Key Concepts](#key-concepts)
7. [Documentation](#documentation)
8. [Tools & Examples](#tools--examples)
9. [Maturity Levels](#maturity-levels)
10. [Contributing](#contributing)
11. [Development Setup](#development-setup)
12. [Research & Citations](#research--citations)
13. [License](#license)
14. [Author](#author)

---

## Overview

**BiModal Design** is a design framework for building interfaces that remain
functional and discoverable across the full spectrum of AI agent capabilities —
from simple HTTP crawlers to vision agents to protocol-native AI systems.

The framework centers on two concepts:

- **Agent Capability Spectrum**: A six-level taxonomy of agent types, replacing
  the outdated binary "human vs. agent" model
- **Defense in Depth**: Five architectural layers ensuring graceful degradation
  across every agent type

As AI agents become primary users of web interfaces — for search, automation,
commerce, and discovery — designing for agent accessibility is no longer
optional. BiModal Design provides the principles, patterns, and tools to get
there.

---

## The Problem

Interfaces today face a spectrum of AI consumers, not a single one:

| Agent Level                  | Example                    | What They See      |
| ---------------------------- | -------------------------- | ------------------ |
| Level 0 — HTTP Retrievers    | curl, web scrapers         | Raw HTML only      |
| Level 1 — LLM Browsers       | ChatGPT Browse, Perplexity | Parsed HTML, no JS |
| Level 2 — Browser Automation | Playwright agents          | Full rendered DOM  |
| Level 3 — Vision Agents      | Claude Computer Use        | Screenshots        |
| Level 4 — Tool-Use Agents    | OpenAI function calling    | API responses      |
| Level 5 — Protocol-Native    | MCP-connected agents       | Protocol data      |

A CSR-only app with `<div id="root"></div>` is invisible to Levels 0-1, fragile
for Levels 2-3, and unreachable for Levels 4-5 without an API. Most interfaces
fail at multiple levels simultaneously.

---

## The Agent Capability Spectrum

BiModal Design v3.0 replaces the binary "human vs. agent" model with a graduated
spectrum:

```
Level 0: HTTP Retrievers      → See only raw HTML (FR-1 critical)
Level 1: LLM Browsers         → Parse HTML, understand semantics
Level 2: Browser Automation   → Execute JS, interact with DOM
Level 3: Vision Agents        → See rendered pages, click UI elements
Level 4: Tool-Use Agents      → Call APIs directly via function calling
Level 5: Protocol-Native      → MCP, A2A, NLWeb — rich agent protocols
```

A single product page might be crawled by an HTTP retriever (Level 0), read by
Perplexity (Level 1), automated by Playwright (Level 2), viewed by Claude
Computer Use (Level 3), queried via API (Level 4), and accessed through MCP
(Level 5) — all simultaneously.

---

## Defense in Depth

Five architectural layers ensure every agent type is served:

```
Layer 5: Agent Protocols      (MCP, A2A, NLWeb)           → Level 5
Layer 4: API Surface           (REST, GraphQL, OpenAPI)    → Level 4-5
Layer 3: Structured Data       (schema.org, JSON-LD)      → Level 1-3
Layer 2: Semantic Structure    (HTML5, ARIA, headings)     → Level 1-3
Layer 1: Content Accessibility (FR-1: SSR/SSG)             → Level 0-1
```

Each layer serves a different segment of the spectrum. Together, they ensure
graceful degradation — if an agent can't use Layer 5, it falls back to Layer 4,
then Layer 3, and so on.

---

## Quick Start

### 1. Test FR-1 Compliance (Layer 1)

```bash
# Check if your site exposes content in the initial HTML response
curl -s https://your-site.com | grep -E '<(main|nav|h1|article)'
```

If this returns semantic HTML with content — you pass Layer 1. If it returns
`<div id="root"></div>` — content is invisible to Level 0-1 agents.

### 2. Run BiModal Design Validation

```bash
cd tools/validators
node fr1-checker.js https://your-site.com --verbose
```

### 3. Implement Core Patterns

```html
<!-- Layer 1: Content in initial HTML (SSR/SSG) -->
<!-- Layer 2: Semantic structure with ARIA -->
<main role="main" aria-label="Product catalog">
  <h1>Wireless Headphones</h1>
  <nav role="navigation" aria-label="Main navigation">
    <a href="/products" aria-label="Browse all products">Products</a>
  </nav>
</main>

<!-- Layer 3: Structured data with schema.org -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Wireless Headphones",
    "offers": {
      "@type": "Offer",
      "price": "99.99",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  }
</script>

<!-- Layer 4: API documented via OpenAPI -->
<!-- Layer 5: MCP server for protocol-native agents -->
```

---

## Key Concepts

### FR-1: Initial Payload Accessibility

The foundational requirement: critical content must exist in the initial HTTP
response. This is Layer 1 of defense in depth — the floor, not the ceiling.

### Standards Over Custom Attributes

v3.0 migrates from custom `data-agent-*` attributes to established standards:

| v2.x                           | v3.0                                      |
| ------------------------------ | ----------------------------------------- |
| `data-agent-context="product"` | `itemscope itemtype="schema.org/Product"` |
| `data-agent-action="buy"`      | `aria-label="Add to cart"`                |
| `data-agent-field="price"`     | `itemprop="price"`                        |

### Agent Protocols

BiModal Design v3.0 integrates emerging agent protocols:

- **MCP**: Expose tools, resources, and prompts for AI agents
- **A2A**: Enable agent-to-agent interoperability
- **NLWeb**: Support natural language queries against your data

### GEO (Generative Engine Optimization)

As users discover content through AI assistants rather than search engines,
BiModal Design compliance drives GEO performance. Layers 1-3 are essential for
AI-assisted discoverability.

---

## Documentation

| Document                                             | Description                          |
| ---------------------------------------------------- | ------------------------------------ |
| [White Paper](docs/whitepaper.md)                    | Framework specification v3.0         |
| [Implementation Guide](docs/implementation-guide.md) | Development & deployment practices   |
| [Compliance Checklist](docs/compliance-checklist.md) | Layer-by-layer compliance criteria   |
| [API Reference](docs/api-reference.md)               | Tool and validator API documentation |
| [Troubleshooting](docs/troubleshooting.md)           | Common errors and corrections        |

---

## Tools & Examples

### Validation Tools

- **FR-1 Checker** — test server payload accessibility (Layer 1)
- **Compliance Auditor** — full BiModal Design compliance suite (Layers 1-3)

### Implementation Examples

- **[Astro SSG Example](examples/astro-ssg-example.md)** — static rendering
  pattern (Layer 1)
- **[Next.js SSR Example](examples/nextjs-ssr-example.md)** — server rendering
  pattern (Layer 1)
- **[CSR Mitigation](examples/csr-mitigation.md)** — client-rendered fallback
  strategies

---

## Maturity Levels

| Level | Name                    | Layers     | Agent Coverage | Success Rate |
| ----- | ----------------------- | ---------- | -------------- | ------------ |
| 0     | Infrastructure Ready    | Layer 1    | Level 0-1      | 40-65%       |
| 1     | Semantically Accessible | Layers 1-2 | Level 0-2      | 55-75%       |
| 2     | Data-Rich               | Layers 1-3 | Level 0-3      | 65-85%       |
| 3     | API-Enabled             | Layers 1-4 | Level 0-4      | 80-92%       |
| 4     | Agent-Native            | Layers 1-5 | All levels     | 90-98%       |

---

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit with a Conventional Commit message
4. Submit a Pull Request

Refer to the [Contributing Guidelines](CONTRIBUTING.md) for review standards and
code style.

---

## Development Setup

```bash
# Clone the repository
git clone https://github.com/jgoldfoot/BiModalDesign.git
cd BiModalDesign

# Install dependencies
cd tools/validators
npm install

# Run tests
npm test
```

---

## Research & Citations

- **WebAgents Survey 2025** — "A Survey of WebAgents: Towards Next-Generation AI
  Agents for Web Automation" (arXiv:2503.23350v1)
- **ST-WebAgentBench** — "A Benchmark for Evaluating Safety and Trustworthiness
  in Web Agents" (arXiv:2410.06703v2)
- **MCP** — Model Context Protocol (modelcontextprotocol.io)
- **A2A** — Agent-to-Agent Protocol (Google, 2025)
- **NLWeb** — Natural Language Web Protocol (Microsoft, 2025)
- **τ-bench** — "A Benchmark for Tool-Agent-User Interaction in Real-World
  Domains" (arXiv:2406.12045)

---

## License

Licensed under the Apache License 2.0. See [LICENSE](LICENSE) for full details.

---

## Author

**Joel Goldfoot** Design Leader | AI + Human-Agent Interaction Researcher

[joel@goldfoot.com](mailto:joel@goldfoot.com)
[linkedin.com/in/joelgoldfoot](https://linkedin.com/in/joelgoldfoot)
[ai-plus.design](https://ai-plus.design)

---

**BiModal Design** — Designing for the full agent capability spectrum.
