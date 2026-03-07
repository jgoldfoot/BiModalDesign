# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- Compliance Auditor - Comprehensive BiModal Design assessment across 7 foundational requirements
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

### Foundational Requirements
- FR-1: Initial Payload Accessibility
- FR-2: Semantic HTML Structure
- FR-3: ARIA Implementation
- FR-4: Agent-Friendly Navigation
- FR-5: Form Accessibility
- FR-6: Content Discovery
- FR-7: Performance Optimization

### Framework Features
- Maturity model (Levels 0-4)
- Dual-mode interface design principles
- Progressive enhancement patterns
- Agent capability profiles
- Weighted scoring system for compliance

### Research Foundation
- Empirical validation from 2024-2025 studies
- WebAgents Survey 2025 integration
- ST-WebAgentBench benchmarking
- τ-bench tool-agent-user interaction data
- Real-world performance metrics

---

## Release Notes

### Version 0.1.0 - Initial Public Release

This is the first public release of BiModal Design, a comprehensive framework for building interfaces that work for both humans and AI agents. The framework addresses a critical gap: approximately 80% of AI agents use simple HTTP requests without JavaScript execution, making client-side rendered applications completely invisible to them.

**Key Highlights:**
- Complete framework specification based on peer-reviewed research
- Practical validation tools ready for immediate use
- Implementation examples for popular frameworks
- Comprehensive documentation for developers and researchers

**What's Working:**
- All validation tools are functional
- Documentation is comprehensive and reviewed
- Examples demonstrate both passing and failing scenarios
- Framework maturity model provides clear adoption path

**Known Limitations:**
- NPM packages not yet published (coming soon)
- CI/CD workflows need real-world testing
- Limited framework integrations (more coming)
- Performance testing needed at scale

**Next Steps:**
- Publish tools to npm registry
- Expand framework examples (Svelte, Angular, etc.)
- Build community case studies
- Develop browser extensions and IDE plugins
- Create video tutorials and workshops

**For Contributors:**
See [CONTRIBUTING.md](CONTRIBUTING.md) for how to get involved. We're especially interested in:
- Real-world case studies and implementations
- Framework-specific plugins and integrations
- Performance benchmarking data
- Accessibility audits and improvements

---

## Version History

| Version | Date | Status | Notes |
|---------|------|--------|-------|
| 0.1.0 | 2025-10-23 | Beta | Initial public release |
| Unreleased | - | Development | Active development |

---

## How to Read This Changelog

- **Added** - New features or capabilities
- **Changed** - Changes to existing functionality
- **Deprecated** - Features that will be removed in future versions
- **Removed** - Features that have been removed
- **Fixed** - Bug fixes
- **Security** - Security vulnerability fixes

---

[Unreleased]: https://github.com/jgoldfoot/BiModalDesign/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/jgoldfoot/BiModalDesign/releases/tag/v0.1.0
