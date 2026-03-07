# BiModal Design v3.0 Compliance Checklist

## Layer 1: Content Accessibility — FR-1 (BLOCKING)

**Must pass before implementing other layers.**

### Test Method

```bash
# Test your live site
curl -s https://yoursite.com | grep -E '<(main|nav|h1|article)'
```

- [ ] **Content visible in server response** — Core content appears in HTML
      source (SSR/SSG)
- [ ] **Navigation accessible** — Main menu items visible without JavaScript
- [ ] **Forms functional** — Basic form submission works with JS disabled
- [ ] **Critical user flows work** — Key actions (signup, purchase) function
      server-side

**Agent Coverage:** Level 0 (HTTP Retrievers), Level 1 (LLM Browsers)

**Fail = Stop here. Fix rendering strategy first.**
**Pass = Continue with Layer 2 below.**

---

## Layer 2: Semantic Structure (Target: 80%+ compliance)

### HTML5 Landmarks

- [ ] `<main>` element wraps primary content
- [ ] `<nav>` elements for navigation sections
- [ ] `<header>` and `<footer>` for page structure
- [ ] `<section>` and `<article>` for content grouping
- [ ] `<aside>` for complementary content

### Heading Hierarchy

- [ ] Single `<h1>` per page
- [ ] No skipped heading levels (h1 → h2 → h3, not h1 → h3)
- [ ] Headings describe content structure, not visual styling

### ARIA Roles & Properties

- [ ] `role="button"` on interactive elements that aren't `<button>`
- [ ] `aria-label` on elements without visible text
- [ ] `aria-required="true"` on mandatory form fields
- [ ] `aria-live` regions for dynamic content updates
- [ ] `aria-describedby` linking help text to form fields
- [ ] `aria-current="page"` on active navigation links

### Form Structure

- [ ] `<fieldset>` and `<legend>` group related form controls
- [ ] `<label>` explicitly associated with every input (`for` attribute)
- [ ] Required fields marked with `aria-required="true"`
- [ ] Error messages linked via `aria-describedby`

### Stable Selectors

- [ ] Static CSS classes (avoid randomly generated class names)
- [ ] Consistent ID patterns (no dynamic IDs like `btn-xyz123`)
- [ ] Semantic HTML elements as primary selectors
- [ ] `data-testid` attributes for testing hooks

**Agent Coverage:** Level 1 (LLM Browsers), Level 2 (Browser Automation),
Level 3 (Vision Agents)

---

## Layer 3: Structured Data (Target: 90%+ compliance)

### JSON-LD / schema.org

- [ ] `itemscope` and `itemtype` on key content containers
- [ ] `itemprop` on data fields (name, price, description, etc.)
- [ ] JSON-LD `<script type="application/ld+json">` blocks for rich data
- [ ] Schema.org vocabulary: Product, Organization, BreadcrumbList, FAQPage,
      HowTo, etc.

### OpenGraph & Meta Tags

- [ ] `og:title`, `og:description`, `og:image` for social/AI sharing
- [ ] `<meta name="description">` on every page
- [ ] Canonical URLs with `<link rel="canonical">`

### Example: v3.0 Standards-Based Markup

```html
<!-- v3.0: Use schema.org instead of data-agent-* -->
<article itemscope itemtype="https://schema.org/Product">
  <h2 itemprop="name">Wireless Headphones</h2>
  <p itemprop="description">High-quality wireless headphones</p>
  <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
    <span itemprop="price" content="99.99">$99.99</span>
    <link itemprop="availability" href="https://schema.org/InStock" />
  </div>
  <button type="button" aria-label="Add Wireless Headphones to cart">
    Add to Cart
  </button>
</article>
```

**Agent Coverage:** Level 1-3 (LLM Browsers, Browser Automation, Vision Agents)

---

## Layer 4: API Surface (Target: 95%+ compliance)

### API Discoverability

- [ ] REST or GraphQL endpoints documented with OpenAPI / GraphQL introspection
- [ ] API endpoints discoverable via `<link rel="api" href="/api/openapi.json">`
- [ ] Rate limiting and authentication clearly documented
- [ ] Consistent response formats (JSON with typed fields)
- [ ] Error responses include actionable messages

### OpenAPI Specification

- [ ] `openapi.json` or `openapi.yaml` available at a well-known path
- [ ] All endpoints described with parameters, request bodies, and responses
- [ ] Example requests and responses included
- [ ] Authentication schemes documented

**Agent Coverage:** Level 4 (Tool-Use Agents), Level 5 (Protocol-Native Agents)

---

## Layer 5: Agent Protocols (Target: Full agent-native coverage)

### MCP (Model Context Protocol)

- [ ] MCP server exposes tools for key actions (search, purchase, etc.)
- [ ] MCP resources expose structured data (product catalog, etc.)
- [ ] MCP prompts provide guided workflows for common tasks

### A2A (Agent-to-Agent Protocol)

- [ ] Agent Card published at `/.well-known/agent.json`
- [ ] Capabilities declared (what the agent/service can do)
- [ ] Input/output schemas defined

### NLWeb (Natural Language Web)

- [ ] NLWeb endpoint accepts natural language queries
- [ ] Responses include schema.org-typed results
- [ ] Query intent classification documented

**Agent Coverage:** Level 5 (Protocol-Native Agents)

---

## Security & Privacy Compliance

### Agent Permissions

- [ ] Clear permission boundaries defined
- [ ] Rate limiting implemented for automated requests
- [ ] CORS policies configured for agent access
- [ ] Authentication requirements documented

### Prompt Injection Defense

- [ ] User-generated content sanitized before rendering
- [ ] No hidden instructions in HTML comments or metadata
- [ ] Content boundaries clearly marked for agent consumption

### Privacy Controls

- [ ] GDPR compliance for EU users
- [ ] CCPA compliance for California users
- [ ] Data retention policies documented
- [ ] User consent mechanisms for agent interactions

---

## Testing & Validation

### Automated Testing

- [ ] HTML validation (W3C validator)
- [ ] Accessibility testing (axe-core)
- [ ] Structured data validation (Google Rich Results Test)
- [ ] Performance testing (Lighthouse)

### Agent-Level Testing

- [ ] **Level 0**: `curl` returns meaningful HTML content
- [ ] **Level 1**: Content parseable without JS execution
- [ ] **Level 2**: Playwright/Puppeteer can complete key flows
- [ ] **Level 3**: Visual hierarchy clear in screenshots
- [ ] **Level 4**: API endpoints return correct data
- [ ] **Level 5**: MCP/A2A tools callable and functional

### Manual Testing

- [ ] Disable JavaScript — site still functional
- [ ] Screen reader testing
- [ ] Mobile device testing
- [ ] Cross-browser validation

---

## Scoring Your Compliance

### Maturity Levels

| Level | Name                  | Layers  | Agent Coverage | Target |
| ----- | --------------------- | ------- | -------------- | ------ |
| 0     | Infrastructure Ready  | Layer 1 | Level 0-1      | 40-65% |
| 1     | Semantically Accessible | Layers 1-2 | Level 0-2  | 55-75% |
| 2     | Data-Rich             | Layers 1-3 | Level 0-3   | 65-85% |
| 3     | API-Enabled           | Layers 1-4 | Level 0-4   | 80-92% |
| 4     | Agent-Native          | Layers 1-5 | All levels  | 90-98% |

### Minimum Requirements by Maturity Level

- **Level 0**: FR-1 (Layer 1) passes
- **Level 1**: Layer 1 + 80% Layer 2 compliance
- **Level 2**: Level 1 + 70% Layer 3 compliance
- **Level 3**: Level 2 + 60% Layer 4 compliance
- **Level 4**: Level 3 + Layer 5 protocols implemented

---

## Migration from v2.x

If upgrading from BiModal Design v2.x, replace custom attributes with standards:

| v2.x Attribute                    | v3.0 Replacement                              |
| --------------------------------- | --------------------------------------------- |
| `data-agent-context="product"`    | `itemscope itemtype="schema.org/Product"`      |
| `data-agent-action="buy"`         | `aria-label="Add to cart"`                     |
| `data-agent-field="price"`        | `itemprop="price"`                             |
| `data-agent-component="nav"`      | `<nav aria-label="Main navigation">`           |
| `data-agent-intent="checkout"`    | `<form aria-label="Checkout" method="POST">`   |
| `data-agent-state="loading"`      | `aria-busy="true"`                             |

---

## Resources

- [Getting Started Guide](./getting-started.md)
- [White Paper v3.0](./whitepaper.md)
- [Implementation Guide](./implementation-guide.md)
- [Example Implementations](../examples/)
- [Report Issues](https://github.com/jgoldfoot/BiModalDesign/issues)
