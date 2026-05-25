## 2026-05-25 - HTML escaping of JSON for Text Nodes
**Vulnerability:** XSS vulnerability where unescaped JSON output was directly embedded into a `<pre>` HTML node.
**Learning:** To prevent XSS vulnerabilities without mangling JSON data visually, encode standard HTML characters (`<`, `>`, `&`, `'`, `"`) as HTML entities (e.g., `&lt;`) using an inline `.replace` regex directly *after* `JSON.stringify()`. Attempting to use JavaScript unicode escapes (e.g., `<`) inside standard text nodes visually mangles the text because the browser renders the escape string literally rather than as the intended character.
**Prevention:** Apply a robust string replacement `tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag])` across all matched instances of `/[&<>'"]/g` directly on the output of `JSON.stringify` before interpolating into HTML contexts.

## 2026-05-25 - Insecure Puppeteer Sandbox Configuration

**Vulnerability:** Insecure Puppeteer Sandbox Configuration using `--no-sandbox` and `--disable-setuid-sandbox`
**Learning:** Hardcoding insecure arguments disables critical security features, exposing the host machine to potentially malicious code from audited sites.
**Prevention:** Avoid bypassing browser security sandboxes in scripts meant to execute against untrusted inputs.
