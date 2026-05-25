## 2024-05-24 - Cross-Site Scripting (XSS) in HTML Reports
**Vulnerability:** Found unescaped user-controlled inputs (derived from parsed web pages) injected directly into HTML reports across multiple tool scripts (`tools/bimodal-design-cli.js`, `tools/agent-simulator.js`, `accessibility/compliance-audit.js`).
**Learning:** Even internal tooling generating HTML reports needs strict output sanitization because it interacts with untrusted external sources (the internet).
**Prevention:** Always use HTML entity escaping routines before injecting potentially malicious data into generated HTML structures.
