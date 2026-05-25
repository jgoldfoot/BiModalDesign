## 2024-05-24 - Cross-Site Scripting (XSS) in HTML Reports

**Vulnerability:** Found unescaped user-controlled inputs (derived from parsed
web pages) injected directly into HTML reports across multiple tool scripts
(`tools/bimodal-design-cli.js`, `tools/agent-simulator.js`,
`accessibility/compliance-audit.js`). **Learning:** Even internal tooling
generating HTML reports needs strict output sanitization because it interacts
with untrusted external sources (the internet). **Prevention:** Always use HTML
entity escaping routines before injecting potentially malicious data into
generated HTML structures.

## 2026-05-25 - Insecure Puppeteer Sandbox Configuration

**Vulnerability:** Puppeteer was launched unconditionally with `--no-sandbox` and `--disable-setuid-sandbox` in the Agent Simulator tool.
**Learning:** Disabling the browser sandbox allows malicious pages to escape the browser and execute code on the host system. It should not be the default configuration.
**Prevention:** Avoid disabling the sandbox by default. If it must be disabled (e.g., for certain Docker environments), it should be strictly opt-in and produce a clear warning about the associated security risks.
