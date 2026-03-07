# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

The BiModal Design team takes security vulnerabilities seriously. We appreciate
your efforts to responsibly disclose your findings.

### How to Report a Security Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to:

**Email:** [joel@goldfoot.com](mailto:joel@goldfoot.com)

**Subject Line:** `[SECURITY] Brief description of issue`

### What to Include in Your Report

To help us better understand and resolve the issue, please include:

1. **Type of vulnerability** (e.g., XSS, injection, authentication bypass)
2. **Full paths of source file(s)** related to the vulnerability
3. **Location of the affected source code** (tag/branch/commit or direct URL)
4. **Step-by-step instructions** to reproduce the issue
5. **Proof-of-concept or exploit code** (if possible)
6. **Impact assessment** - how an attacker might exploit this
7. **Any potential mitigations** you've identified

### What to Expect

When you report a vulnerability, you can expect:

- **Acknowledgment** within 48 hours of your report
- **Regular updates** on our progress (at least every 5 business days)
- **Credit for the discovery** (unless you prefer to remain anonymous)
- **Coordinated disclosure** timeline discussion

### Our Commitment

- We will work with you to understand and validate the vulnerability
- We will keep you informed of our progress
- We will credit you for the discovery (if desired) once the issue is resolved
- We will not take legal action against researchers who:
  - Report vulnerabilities in good faith
  - Avoid privacy violations and data destruction
  - Give us reasonable time to address issues before public disclosure

### Security Best Practices for Users

When using BiModal Design tools:

1. **Keep dependencies updated** - Run `npm audit` regularly
2. **Validate user input** - Even when using validation tools
3. **Run tools in controlled environments** - Especially when testing untrusted
   URLs
4. **Review generated code** - Don't blindly trust automated suggestions
5. **Use HTTPS** - Always validate sites over secure connections

### Known Security Considerations

#### Validation Tools

- **FR1 Validator** makes HTTP requests to URLs you provide - only test URLs you
  trust
- **Agent Simulator** uses Puppeteer to load pages - be cautious with untrusted
  sites
- **Compliance Auditor** can take screenshots - ensure compliance with privacy
  policies

#### Safe Usage

```bash
# ✅ Good: Testing your own site
bmd-validate https://your-own-site.com

# ⚠️ Caution: Testing third-party sites
# Ensure you have permission and understand the site's terms of service
bmd-validate https://third-party-site.com
```

### Disclosure Policy

- **Vulnerabilities** are disclosed publicly after a fix is available
- **Timeline**: We aim to release fixes within 90 days of initial report
- **Advance notice**: Reporters receive 48-hour advance notice before public
  disclosure
- **CVE assignment**: We will request CVEs for qualifying vulnerabilities

### Security Updates

Security updates will be:

- Released as patch versions (e.g., 0.1.1)
- Announced in CHANGELOG.md
- Tagged as security releases in GitHub
- Communicated via GitHub Security Advisories

### Contact

For security concerns or questions about this policy:

**Email:** [joel@goldfoot.com](mailto:joel@goldfoot.com) **PGP Key:** Available
upon request

---

Thank you for helping keep BiModal Design and its users safe!
