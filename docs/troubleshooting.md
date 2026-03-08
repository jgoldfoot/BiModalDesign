# BiModal Design v3.0 Troubleshooting Guide

Common issues, solutions, and debugging techniques for BiModal Design
implementations across the Agent Capability Spectrum.

## Table of Contents

1. [Quick Diagnostics](#quick-diagnostics)
2. [Layer 1: Content Accessibility Issues](#layer-1-content-accessibility-issues)
3. [Layer 2: Semantic Structure Issues](#layer-2-semantic-structure-issues)
4. [Layer 3: Structured Data Issues](#layer-3-structured-data-issues)
5. [Layer 4: API Surface Issues](#layer-4-api-surface-issues)
6. [Layer 5: Agent Protocol Issues](#layer-5-agent-protocol-issues)
7. [Performance Issues](#performance-issues)
8. [Framework-Specific Problems](#framework-specific-problems)
9. [SEO and GEO Issues](#seo-and-geo-issues)
10. [Debugging Tools and Techniques](#debugging-tools-and-techniques)

## Quick Diagnostics

### 5-Minute Health Check

Test each Defense in Depth layer:

```bash
# Layer 1: Content in initial HTML?
curl -s "https://your-site.com/" | grep -E '<(main|nav|h1)'
# Expected: semantic HTML elements with content

# Layer 2: Semantic structure?
curl -s "https://your-site.com/" | grep -E 'aria-label|role='
# Expected: ARIA attributes present

# Layer 3: Structured data?
curl -s "https://your-site.com/" | grep "application/ld+json"
# Expected: JSON-LD scripts found

# Layer 4: API available?
curl -s "https://your-site.com/api/openapi.json" | head -5
# Expected: OpenAPI spec or API response

# Layer 5: Agent protocols?
curl -s "https://your-site.com/.well-known/agent.json"
# Expected: Agent Card (if implemented)
```

### Diagnostic Script

```javascript
// Run in browser console
function runDiagnostic() {
  const results = { passed: [], issues: [], warnings: [] };

  // Layer 1: Content accessibility
  const main = document.querySelector('main');
  if (main && main.textContent.trim().length > 100) {
    results.passed.push('Layer 1: Content present in HTML');
  } else {
    results.issues.push('Layer 1: Missing or empty main content');
  }

  // Layer 2: Semantic structure
  const landmarks = ['main', 'nav', 'header', 'footer'].filter((tag) =>
    document.querySelector(tag)
  );
  if (landmarks.length >= 3) {
    results.passed.push(
      'Layer 2: Semantic landmarks present (' + landmarks.join(', ') + ')'
    );
  } else {
    results.issues.push(
      'Layer 2: Missing landmarks. Found: ' + landmarks.join(', ')
    );
  }

  const ariaLabels = document.querySelectorAll('[aria-label]');
  if (ariaLabels.length > 0) {
    results.passed.push(
      'Layer 2: ARIA labels present (' + ariaLabels.length + ')'
    );
  } else {
    results.warnings.push('Layer 2: No aria-label attributes found');
  }

  // Layer 3: Structured data
  const jsonLd = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );
  const microdata = document.querySelectorAll('[itemscope]');
  if (jsonLd.length > 0 || microdata.length > 0) {
    results.passed.push('Layer 3: Structured data present');
  } else {
    results.warnings.push('Layer 3: No structured data found');
  }

  // Forms check
  const forms = document.querySelectorAll('form');
  if (forms.length > 0) {
    const labelsOk = document.querySelectorAll('label[for]').length > 0;
    if (labelsOk) {
      results.passed.push('Forms: Labels properly associated');
    } else {
      results.issues.push('Forms: Missing label associations');
    }
  }

  console.table(results);
  return results;
}

runDiagnostic();
```

## Layer 1: Content Accessibility Issues

### Problem: Empty Content for Agents (FR-1 Failure)

**Symptoms:**

- `curl` returns empty `<div id="root"></div>`
- Level 0-1 agents see no content
- Search engines not indexing content

**Cause:** Client-side only rendering.

**Solution:** Implement SSR or SSG:

```javascript
// Next.js: Use server components (default in App Router)
export default async function Page() {
  const data = await fetchData();
  return (
    <main aria-label="Products">
      <h1>Product Catalog</h1>
      {data.map((item) => (
        <article key={item.id} itemScope itemType="https://schema.org/Product">
          <h2 itemProp="name">{item.name}</h2>
        </article>
      ))}
    </main>
  );
}
```

### Problem: Navigation Requires JavaScript

**Symptoms:**

- Menu items invisible with JS disabled
- Level 0 agents can't discover pages

**Solution:** Server-render navigation HTML:

```html
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/products">Products</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

## Layer 2: Semantic Structure Issues

### Problem: Missing Landmarks

**Symptoms:**

- Screen readers and LLM browsers can't parse page structure
- Level 1-2 agents struggle to find content

**Solution:** Replace `<div>` with semantic elements:

```html
<!-- Before -->
<div class="header">
  <div class="nav">...</div>
</div>
<div class="content">...</div>

<!-- After -->
<header>
  <nav aria-label="Main navigation">...</nav>
</header>
<main aria-label="Page content">...</main>
```

### Problem: Broken Heading Hierarchy

**Symptoms:**

- Agents misinterpret content structure
- Accessibility tools report errors

**Solution:**

```html
<!-- Wrong: Skipped level -->
<h1>Main Title</h1>
<h3>Subsection</h3>

<!-- Correct: Sequential hierarchy -->
<h1>Main Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>
```

### Problem: Missing Form Labels

**Symptoms:**

- Level 2 agents can't fill forms
- Accessibility failures

**Solution:**

```html
<!-- Wrong -->
<input type="email" placeholder="Email" />

<!-- Correct -->
<label for="email">Email Address *</label>
<input type="email" id="email" name="email" required aria-required="true" />
```

### Problem: Dynamic IDs Breaking Selectors

**Symptoms:**

- Level 2 automation breaks between page loads
- IDs like `btn-xyz123` change every render

**Solution:** Use stable, semantic selectors:

```html
<!-- Wrong: Dynamic ID -->
<button id="btn-a7x9k2">Submit</button>

<!-- Correct: Stable selector -->
<button type="submit" aria-label="Submit contact form">Submit</button>
```

## Layer 3: Structured Data Issues

### Problem: No Structured Data

**Symptoms:**

- No rich results in search
- AI assistants can't extract product/business data

**Solution:** Add JSON-LD:

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Wireless Headphones",
    "description": "High-quality wireless audio",
    "offers": {
      "@type": "Offer",
      "price": "99.99",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  }
</script>
```

### Problem: Invalid Structured Data

**Symptoms:**

- Google Rich Results Test shows errors
- Required fields missing

**Solution:** Validate with Google Rich Results Test and fix missing fields.
Common missing fields: `@context`, `price`, `availability`, `image`.

## Layer 4: API Surface Issues

### Problem: No API Documentation

**Symptoms:**

- Level 4 agents can't discover endpoints
- Integration requires manual documentation

**Solution:** Publish an OpenAPI specification:

```html
<link rel="api" type="application/openapi+json" href="/api/openapi.json" />
```

### Problem: Inconsistent API Responses

**Symptoms:**

- Different endpoints return different formats
- Error responses lack structure

**Solution:** Standardize response format:

```javascript
// Consistent success response
{ "data": [...], "meta": { "total": 42, "page": 1 } }

// Consistent error response
{ "error": { "code": "NOT_FOUND", "message": "Product not found" } }
```

## Layer 5: Agent Protocol Issues

### Problem: MCP Server Not Responding

**Symptoms:**

- Protocol-native agents can't connect
- Tools fail to execute

**Debugging:**

```bash
# Test MCP server directly
npx @modelcontextprotocol/inspector your-mcp-server

# Check server logs for errors
```

### Problem: Agent Card Not Discoverable

**Symptoms:**

- A2A agents can't find your service

**Solution:** Ensure `/.well-known/agent.json` is accessible:

```bash
curl -s https://your-site.com/.well-known/agent.json
# Should return valid JSON with capabilities
```

## Performance Issues

### Problem: Slow Loading for Agents

**Symptoms:**

- High Time to First Byte (TTFB)
- Agents timing out
- Poor Core Web Vitals

**Solutions:**

1. **Inline critical CSS** — Reduce render-blocking resources
2. **Defer non-critical JS** — `<script src="app.js" defer>`
3. **Use CDN** — Serve static assets from edge locations
4. **Compress responses** — Enable gzip/brotli

### Problem: Large HTML Payloads

**Symptoms:**

- Level 0 agents slow to parse
- Bandwidth-constrained agents fail

**Solution:** Keep initial HTML focused on content, lazy-load non-critical
elements.

## Framework-Specific Problems

### React / Next.js: Hydration Mismatches

**Symptoms:**

- Console warnings about hydration
- Content flickers on load

**Solution:** Ensure server and client render the same content:

```javascript
// Use server components for static content (Next.js App Router)
// Only use 'use client' for truly interactive elements
```

### Vue / Nuxt: Client-Side Navigation Issues

**Symptoms:**

- Page transitions break agent experience
- Direct URL access works but navigation doesn't

**Solution:** Ensure all routes are server-renderable in Nuxt:

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // Ensure SSR is enabled
});
```

### Astro: Missing Interactivity

**Symptoms:**

- Static pages lack interactive features

**Solution:** Use Astro's component islands for selective hydration:

```astro
---
import InteractiveWidget from './InteractiveWidget.jsx';
---
<!-- Static content (no JS) -->
<main>
  <h1>Product Page</h1>
  <!-- Island: only this component loads JS -->
  <InteractiveWidget client:visible />
</main>
```

## SEO and GEO Issues

### Problem: Content Not Indexed

**Symptoms:**

- Pages missing from search results
- AI assistants can't find your content

**Solutions:**

1. **Verify robots.txt** allows crawling
2. **Submit sitemap** to Google Search Console
3. **Ensure FR-1 compliance** — content in initial HTML
4. **Add structured data** — helps AI understand content

### Problem: Poor GEO Performance

**Symptoms:**

- AI assistants don't cite your content
- Low visibility in AI-generated answers

**Solutions:**

1. **Clear, factual content** — AI prefers authoritative sources
2. **Structured data** — Helps AI extract and attribute information
3. **Unique perspectives** — Original insights get cited more
4. **FAQ schema** — Increases chances of appearing in AI answers

## Debugging Tools and Techniques

### Command Line Testing

```bash
#!/bin/bash
# test-agent-levels.sh — Test across agent levels

URL="https://your-site.com"

echo "=== Level 0: HTTP Retriever ==="
curl -s "$URL" | grep -c '<main'

echo "=== Level 1: Content Parsing ==="
curl -s "$URL" | grep -c 'application/ld+json'

echo "=== Level 2: Semantic Structure ==="
curl -s "$URL" | grep -c 'aria-label'

echo "=== Layer 4: API Surface ==="
curl -s -o /dev/null -w "%{http_code}" "$URL/api/products"
```

### Playwright Testing

```javascript
const { test, expect } = require('@playwright/test');

test('Level 0: Content accessible without JS', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');

  const main = await page.textContent('main');
  expect(main.length).toBeGreaterThan(100);
  await context.close();
});

test('Level 2: Semantic structure present', async ({ page }) => {
  await page.goto('/');
  const landmarks = await page.$$('main, nav, header, footer');
  expect(landmarks.length).toBeGreaterThanOrEqual(3);

  const ariaLabels = await page.$$('[aria-label]');
  expect(ariaLabels.length).toBeGreaterThan(0);
});

test('Level 3: Structured data valid', async ({ page }) => {
  await page.goto('/');
  const jsonLd = await page.$eval('script[type="application/ld+json"]', (el) =>
    JSON.parse(el.textContent)
  );
  expect(jsonLd['@context']).toBe('https://schema.org');
});
```

### Browser DevTools

1. **Elements tab**: Inspect semantic structure, ARIA attributes
2. **Network tab**: Check response sizes, TTFB
3. **Lighthouse**: Run accessibility and performance audits
4. **Console**: Run the diagnostic script from
   [Quick Diagnostics](#quick-diagnostics)

### External Tools

- **Google Rich Results Test** — Validate structured data
- **axe DevTools** — Accessibility testing
- **Lighthouse CI** — Automated performance monitoring
- **Wave** — Manual accessibility testing
- **Schema.org Validator** — Verify microdata

## Quick Fixes for Common Issues

| Issue                          | Fix                                             |
| ------------------------------ | ----------------------------------------------- |
| Content invisible to agents    | Implement SSR/SSG (Layer 1)                     |
| Missing semantic structure     | Replace `<div>` with HTML5 landmarks (Layer 2)  |
| Forms fail for agents          | Add `<label>`, `<fieldset>`, `aria-*` (Layer 2) |
| No structured data             | Add JSON-LD with schema.org types (Layer 3)     |
| APIs undiscoverable            | Publish OpenAPI spec (Layer 4)                  |
| Dynamic selectors break agents | Use stable classes, `aria-label`, `data-testid` |
| Slow agent performance         | Inline critical CSS, defer JS                   |

## Migration from v2.x

If your codebase uses `data-agent-*` attributes from v2.x, migrate to
established standards:

| v2.x                           | v3.0                                      |
| ------------------------------ | ----------------------------------------- |
| `data-agent-component="nav"`   | `<nav aria-label="...">`                  |
| `data-agent-action="buy"`      | `aria-label="Add to cart"`                |
| `data-agent-field="price"`     | `itemprop="price"`                        |
| `data-agent-context="product"` | `itemscope itemtype="schema.org/Product"` |
| `data-agent-state="loading"`   | `aria-busy="true"`                        |
| `data-agent-intent="checkout"` | `<form aria-label="Checkout">`            |

## Getting Help

- **Documentation**: [BiModal Design v3.0 Whitepaper](./whitepaper.md)
- **Compliance**: [Compliance Checklist](./compliance-checklist.md)
- **GitHub Issues**:
  [Report bugs](https://github.com/jgoldfoot/BiModalDesign/issues)
- **Discussions**:
  [Community forum](https://github.com/jgoldfoot/BiModalDesign/discussions)
