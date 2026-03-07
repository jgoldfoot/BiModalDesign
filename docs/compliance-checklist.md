# BiModal Design Compliance Checklist

## FR-1: Initial Payload Accessibility (BLOCKING)

**🚨 Must pass before implementing other BiModal Design patterns**

### Test Method

```bash
# Test your live site
curl -s https://yoursite.com | grep "your-main-content"
```

- [ ] **Content visible in server response** - Core content appears in HTML
      source
- [ ] **Navigation accessible** - Main menu items visible without JavaScript
- [ ] **Forms functional** - Basic form submission works with JS disabled
- [ ] **Critical user flows work** - Key actions (signup, purchase) function
      server-side

**❌ Fail = Stop here. Fix rendering strategy first.**  
**✅ Pass = Continue with semantic optimization below.**

---

## Level 1: Semantic Foundation (Target: 80%+ compliance)

### HTML5 Structure

- [ ] `<main>` element wraps primary content
- [ ] `<nav>` elements for navigation sections
- [ ] `<header>` and `<footer>` for page structure
- [ ] `<section>` and `<article>` for content grouping
- [ ] `<aside>` for complementary content

### ARIA Roles & Properties

- [ ] `role="button"` on interactive elements that aren't `<button>`
- [ ] `aria-label` on elements without visible text
- [ ] `aria-required="true"` on mandatory form fields
- [ ] `aria-live` regions for dynamic content updates
- [ ] `aria-describedby` linking help text to form fields

### Form Structure

- [ ] `<fieldset>` and `<legend>` group related form controls
- [ ] `<label>` explicitly associated with every input (`for` attribute)
- [ ] Required fields marked with `aria-required="true"`
- [ ] Error messages linked via `aria-describedby`

---

## Level 2: Agent-Aware Attributes (Target: 90%+ compliance)

### Data Attributes for Agent Context

- [ ] `data-agent-intent` on forms (e.g., "user-registration", "checkout")
- [ ] `data-agent-group` on fieldsets (e.g., "personal-info", "payment")
- [ ] `data-agent-field` on inputs (e.g., "user.email", "address.street")
- [ ] `data-agent-action` on buttons (e.g., "submit-form", "add-to-cart")
- [ ] `data-agent-state` for component states (e.g., "loading", "error",
      "success")

### Example Implementation

```html
<form data-agent-intent="user-registration">
  <fieldset data-agent-group="personal-info">
    <legend>Personal Information</legend>
    <input data-agent-field="user.email" type="email" required />
  </fieldset>
  <button data-agent-action="submit-registration">Create Account</button>
</form>
```

### Stable Selectors

- [ ] Static CSS classes (avoid randomly generated class names)
- [ ] Consistent ID patterns (no dynamic IDs like `btn-xyz123`)
- [ ] Semantic HTML elements as primary selectors
- [ ] `data-testid` attributes for testing hooks

---

## Level 3: Structured Data & APIs (Target: 95%+ compliance)

### JSON-LD Structured Data

- [ ] Schema.org vocabulary implemented
- [ ] Product/Service/Organization markup where applicable
- [ ] Breadcrumb navigation structured data
- [ ] FAQ/How-to structured data for content pages

### API Discoverability

- [ ] REST endpoints documented with OpenAPI
- [ ] GraphQL schema introspection enabled
- [ ] API endpoints hinted in HTML (`data-agent-api` attributes)
- [ ] Rate limiting and authentication clearly documented

### Performance Optimization

- [ ] Server-side rendering or static generation
- [ ] Critical CSS inlined
- [ ] Resource hints (`preload`, `prefetch`) implemented
- [ ] Lazy loading for non-critical content

---

## Security & Privacy Compliance

### Agent Permissions

- [ ] Clear permission boundaries defined
- [ ] Rate limiting implemented for automated requests
- [ ] CORS policies configured for agent access
- [ ] Authentication requirements documented

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
- [ ] Performance testing (Lighthouse)
- [ ] Agent simulation testing

### Manual Testing

- [ ] Disable JavaScript - site still functional
- [ ] Screen reader testing
- [ ] Mobile device testing
- [ ] Cross-browser validation

### Agent Testing Tools

```bash
# Install BiModal Design CLI (when available)
npm install -g @bimodal-design/framework

# Run compliance check
bimodal-design validate https://yoursite.com

# Run agent simulation
bimodal-design simulate https://yoursite.com
```

---

## Scoring Your Compliance

### Calculation Method

1. **Count passed items** in each level
2. **Calculate percentage** per level
3. **Overall score** = weighted average

### Compliance Levels

- **🥇 BiModal Design Certified (90%+)**: Ready for production agent deployment
- **🥈 BiModal Design Advanced (75-89%)**: Good foundation, minor improvements
  needed
- **🥉 BiModal Design Basic (60-74%)**: Functional but needs optimization
- **🚨 BiModal Design At Risk (<60%)**: Major issues, requires redesign

### Minimum Requirements by Level

- **Level 1**: FR-1 + 80% semantic compliance
- **Level 2**: Level 1 + 70% agent attributes
- **Level 3**: Level 2 + 60% structured data
- **Level 4**: Level 3 + 90% security compliance

---

## Quick Fixes for Common Issues

### Issue: Content not visible to agents

**Fix**: Implement SSR/SSG or add server-side fallbacks

### Issue: Forms fail for agents

**Fix**: Add proper labels, fieldsets, and data-agent attributes

### Issue: Dynamic selectors break automation

**Fix**: Use stable CSS classes and data attributes

### Issue: Missing semantic structure

**Fix**: Replace generic `<div>` with HTML5 landmarks

---

## Resources

- [Getting Started Guide](./getting-started.md)
- [Full White Paper](./whitepaper.md)
- [Example Implementations](../examples/)
- [Report Issues](https://github.com/jgoldfoot/BiModalDesign/issues)
