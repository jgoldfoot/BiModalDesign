# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-03-07

### Added
- **Agent Capability Spectrum**: Six-level taxonomy replacing binary human/agent model
  - Level 0: HTTP Retrievers
  - Level 1: LLM Browsers
  - Level 2: Browser Automation
  - Level 3: Vision Agents
  - Level 4: Tool-Use Agents
  - Level 5: Protocol-Native Agents
- **Defense in Depth**: Five-layer architectural model
  - Layer 1: Content Accessibility (FR-1)
  - Layer 2: Semantic Structure (HTML5, ARIA)
  - Layer 3: Structured Data (schema.org, JSON-LD)
  - Layer 4: API Surface (REST, GraphQL, OpenAPI)
  - Layer 5: Agent Protocols (MCP, A2A, NLWeb)
- **FR-2: Semantic Discoverability** — New foundational requirement
- Agent Protocols section covering MCP, A2A, and NLWeb
- Vision Agents section addressing Claude Computer Use, GPT-4V, etc.
- GEO (Generative Engine Optimization) section
- Expanded security coverage for prompt injection and agent manipulation

### Changed
- Whitepaper rewritten from v2.1 to v3.0 (~1660 lines)
- README modernized with Agent Capability Spectrum and Defense in Depth framing
- Compliance checklist restructured around five Defense in Depth layers
- Implementation guide reorganized by layer
- Getting started guide updated with v3.0 concepts
- Troubleshooting guide restructured by layer with v3.0 patterns
- AGENTS.md updated for v3.0 framework concepts
- All code examples migrated from `data-agent-*` to schema.org/ARIA standards

### Deprecated
- Custom `data-agent-*` attributes — replaced by schema.org (`itemscope`,
  `itemprop`), WAI-ARIA (`aria-label`, `aria-current`), and OpenAPI
- Binary "human vs. agent" framing — replaced by Agent Capability Spectrum

### Removed
- `data-agent-context`, `data-agent-action`, `data-agent-field`,
  `data-agent-component`, `data-agent-intent` from recommended patterns
  (retained only in migration guidance)

## [Unreleased]

### Added
- Repository infrastructure for public launch
- Comprehensive test suite with Jest
- GitHub issue and pull request templates
- CI/CD pipeline with GitHub Actions
- Code quality tools (ESLint, Prettier)
- Security policy (SECURITY.md)
- Development configuration files

## [0.1.0] - 2025-10-23

### Added
- Initial public release of BiModal Design framework
- Core documentation:
  - README.md with quick start guide
  - White paper v2.1 with comprehensive framework specification
  - Implementation guide for developers
  - Case studies with real-world examples
  - API reference documentation
  - Troubleshooting guide
  - Compliance checklist
- Community files:
  - CODE_OF_CONDUCT.md
  - CONTRIBUTING.md with detailed guidelines
  - AGENTS.md for AI agent contributors
  - Apache 2.0 LICENSE

### Tools
- FR1 Validator - Test initial payload accessibility
- FR1 Checker - Advanced compliance checking with batch processing
- Compliance Auditor - Comprehensive BiModal Design assessment
- Agent Simulator - Simulate different AI agent profiles and capabilities
- BiModal Design CLI - Unified command-line interface for all tools

### Examples
- Client-side rendering failure example (CSR)
- Server-side rendering pass example (SSR)
- Framework-specific implementation guides:
  - Astro static site generation
  - Next.js server-side rendering
  - Nuxt/Vue SSR patterns
  - React SPA mitigation techniques
  - CSR mitigation strategies

---

## Version History

| Version | Date       | Status  | Notes                                  |
| ------- | ---------- | ------- | -------------------------------------- |
| 3.0.0   | 2026-03-07 | Current | Agent Capability Spectrum, Defense in Depth |
| 0.1.0   | 2025-10-23 | Beta    | Initial public release                 |

---

## How to Read This Changelog

- **Added** - New features or capabilities
- **Changed** - Changes to existing functionality
- **Deprecated** - Features that will be removed in future versions
- **Removed** - Features that have been removed
- **Fixed** - Bug fixes
- **Security** - Security vulnerability fixes

---

[3.0.0]: https://github.com/jgoldfoot/BiModalDesign/compare/v0.1.0...v3.0.0
[Unreleased]: https://github.com/jgoldfoot/BiModalDesign/compare/v3.0.0...HEAD
[0.1.0]: https://github.com/jgoldfoot/BiModalDesign/releases/tag/v0.1.0
