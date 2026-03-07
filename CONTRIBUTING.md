# Contributing to BiModal Design

Thank you for your interest in contributing to BiModal Design! This framework
aims to make the web more accessible to both humans and AI agents, and we
welcome contributions from developers, designers, researchers, and accessibility
experts.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Types of Contributions](#types-of-contributions)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Documentation Guidelines](#documentation-guidelines)
- [Testing Requirements](#testing-requirements)
- [Community and Support](#community-and-support)

## Code of Conduct

This project adheres to our [Code of Conduct](CODE_OF_CONDUCT.md). By
participating, you are expected to uphold this code. Please report unacceptable
behavior to [joel@goldfoot.com](mailto:joel@goldfoot.com).

## Getting Started

### Prerequisites

- **Node.js 16+** for running validation tools
- **Git** for version control
- **Basic understanding** of HTML, accessibility, or AI agents
- **Optional**: Experience with React, Vue, or other web frameworks

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/BiModal Design.git
   cd BiModal Design
   ```
3. **Set up the original repo as upstream**:
   ```bash
   git remote add upstream https://github.com/jgoldfoot/BiModalDesign.git
   ```
4. **Install tool dependencies**:
   ```bash
   cd tools/validators
   npm install
   ```
5. **Run tests** to ensure everything works:
   ```bash
   npm test
   ```

## Types of Contributions

We welcome many types of contributions:

### 🐛 **Bug Reports**

- Found issues with validation tools
- Incorrect documentation or examples
- Broken links or formatting

### 💡 **Feature Requests**

- New validation checks for FR1 or compliance
- Additional implementation examples
- Framework integrations (webpack plugins, etc.)

### 📝 **Documentation**

- Improve existing documentation
- Add new implementation guides
- Create tutorials or blog posts
- Fix typos and clarity issues

### 🔧 **Code Contributions**

- Bug fixes for validation tools
- New features for FR1 checker
- Additional compliance checks
- Performance improvements

### 🧪 **Research & Testing**

- Test BiModal Design on real websites
- Validate framework claims with data
- Contribute case studies
- User experience research

### 🌐 **Examples & Integrations**

- Framework-specific examples (Svelte, Angular, etc.)
- CMS integrations (WordPress, Drupal)
- Build tool plugins
- CI/CD workflow examples

## Development Workflow

### Before You Start

1. **Check existing issues** to avoid duplication
2. **Create an issue** to discuss major changes
3. **Get feedback** before spending significant time

### Making Changes

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our guidelines:
   - Write clear, self-documenting code
   - Follow existing code style and patterns
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**:

   ```bash
   # Run validation tool tests
   cd tools/validators
   npm test

   # Test on real websites
   node fr1-checker.js https://example.com --verbose
   ```

4. **Commit with clear messages**:

   ```bash
   git commit -m "Add: New validation check for ARIA landmarks

   - Implement comprehensive ARIA landmark detection
   - Add scoring based on semantic completeness
   - Include detailed error messages for missing landmarks
   - Update tests to cover edge cases

   Fixes #123"
   ```

## Pull Request Process

### Before Submitting

- [ ] **Rebase** on latest main branch
- [ ] **Run all tests** and ensure they pass
- [ ] **Update documentation** if needed
- [ ] **Add/update examples** if applicable
- [ ] **Check for breaking changes**

### Pull Request Checklist

- [ ] **Clear title** describing the change
- [ ] **Detailed description** with context and rationale
- [ ] **Link to related issues** using "Fixes #123"
- [ ] **Screenshots** for UI changes (if applicable)
- [ ] **Breaking changes** clearly marked
- [ ] **Tests pass** and new tests added where appropriate

### Review Process

1. **Automated checks** must pass (tests, linting)
2. **Maintainer review** for code quality and alignment
3. **Community feedback** for significant changes
4. **Documentation review** for accuracy and clarity
5. **Final approval** and merge by maintainers

## Documentation Guidelines

### Writing Style

- **Clear and concise** - Avoid unnecessary jargon
- **Actionable** - Provide specific steps and examples
- **Inclusive** - Consider different skill levels and backgrounds
- **Examples** - Show don't just tell
- **Up-to-date** - Ensure accuracy with current tools and practices

### Documentation Structure

- **Purpose** - What problem does this solve?
- **Audience** - Who is this for?
- **Prerequisites** - What do they need to know first?
- **Step-by-step** - Clear, numbered instructions
- **Examples** - Working code samples
- **Troubleshooting** - Common issues and solutions

### Code Examples

```javascript
// ✅ Good: Clear, commented, complete example
// Detect if visitor is an AI agent
function detectAgent() {
  const userAgent = navigator.userAgent.toLowerCase();
  const agentPatterns = /bot|crawler|spider|agent/;
  return agentPatterns.test(userAgent);
}

// Apply agent-specific optimizations
if (detectAgent()) {
  document.body.setAttribute('data-agent-visitor', 'true');
}
```

## Testing Requirements

### Validation Tools

All changes to validation tools must include tests:

```bash
# Run existing tests
npm test

# Add new tests in test/ directory
# Follow existing patterns for consistency
```

### Documentation Testing

- **Link checking** - Ensure all links work
- **Code examples** - Verify all examples are functional
- **Cross-platform** - Test on different operating systems
- **Accessibility** - Ensure documentation itself is accessible

### Real-world Testing

For significant changes, test on real websites:

- Choose diverse site architectures (SSR, SSG, CSR)
- Document results and any edge cases found
- Include testing methodology in PR description

## Community and Support

### Getting Help

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and community chat
- **Email** - [joel@goldfoot.com](mailto:joel@goldfoot.com) for private matters

### Recognition

Contributors will be:

- **Listed** in repository contributors
- **Mentioned** in release notes for significant contributions
- **Credited** in research publications (if applicable)
- **Invited** to present at conferences (for major contributions)

### License Agreement

By contributing, you agree that your contributions will be licensed under the
Apache License 2.0, the same license as the project.

## Questions?

Don't hesitate to ask! We're here to help make your contribution successful.
Whether you're fixing a typo or proposing a major feature, every contribution
makes BiModal Design better for everyone.

**Welcome to the BiModal Design community!** 🎉
