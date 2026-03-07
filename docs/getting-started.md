# Getting Started with BiModal Design v3.0

## Quick Start Checklist

BiModal Design uses a **Defense in Depth** strategy with five layers to ensure
your interface works across the full **Agent Capability Spectrum** — from simple
HTTP crawlers to protocol-native AI agents.

Before implementing any patterns, ensure your application meets **FR-1: Initial
Payload Accessibility** — the foundational requirement that content exists in the
server response.

### Step 1: Check Your Rendering Strategy (Layer 1)

**Test this first:** View source (Ctrl+U) on your live site. Can you see your
content in the HTML?

- **SSR/SSG**: Content visible in source → Agent accessible (Levels 0-5)
- **CSR only**: Empty divs in source → Invisible to Level 0-1 agents

```bash
curl -s https://yoursite.com | grep -E '<(main|nav|h1|article)'
# Should return semantic HTML with content
```

### Step 2: Implement Semantic Structure (Layer 2)

```html
<!-- Before: Agent-opaque -->
<div class="header">
  <div class="nav">...</div>
</div>

<!-- After: Agent-accessible -->
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/products">Products</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>
```

### Step 3: Add Structured Data (Layer 3)

```html
<article itemscope itemtype="https://schema.org/Product">
  <h2 itemprop="name">Wireless Headphones</h2>
  <p itemprop="description">High-quality wireless audio</p>
  <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
    <span itemprop="price" content="99.99">$99.99</span>
    <link itemprop="availability" href="https://schema.org/InStock" />
  </div>
  <button aria-label="Add Wireless Headphones to cart">Add to Cart</button>
</article>
```

### Step 4: Document Your API (Layer 4)

Expose REST/GraphQL endpoints with an OpenAPI specification so tool-use agents
(Level 4) can interact with your service programmatically.

### Step 5: Add Agent Protocols (Layer 5)

For maximum agent coverage, expose functionality via MCP, A2A, or NLWeb so
protocol-native agents (Level 5) can bypass the UI entirely.

## Framework-Specific Setup

### Next.js (Recommended for SSR)

```bash
npx create-next-app@latest --typescript --app
```

### Astro (Best for content sites)

```bash
npm create astro@latest
```

### Nuxt (Vue ecosystem)

```bash
npx nuxi@latest init my-bimodal-app
```

## The Agent Capability Spectrum

Understanding which agents consume your interface helps prioritize layers:

| Level | Agent Type          | What They See          | Critical Layer |
| ----- | ------------------- | ---------------------- | -------------- |
| 0     | HTTP Retrievers     | Raw HTML only          | Layer 1        |
| 1     | LLM Browsers        | Parsed HTML, no JS     | Layer 1-2      |
| 2     | Browser Automation  | Full rendered DOM      | Layer 2-3      |
| 3     | Vision Agents       | Screenshots            | Layer 2-3      |
| 4     | Tool-Use Agents     | API responses          | Layer 4        |
| 5     | Protocol-Native     | Protocol data          | Layer 5        |

## Testing Agent Accessibility

### Quick Test: cURL Method

```bash
# Test if Level 0 agents can see your content
curl -s https://yoursite.com | grep "main content"

# Should return your actual content, not empty divs
```

### Browser Test

1. Disable JavaScript in your browser
2. Navigate to your site
3. Can you still see and use the core functionality?

## Common Mistakes to Avoid

- **CSR-only without fallbacks** — Invisible to Level 0-1 agents
- **Dynamic IDs** — `id="btn-xyz123"` breaks agent selectors
- **Visual-only cues** — Color changes without semantic updates
- **Missing labels** — Agents need `aria-label` or explicit labels
- **Custom attributes over standards** — Use `itemprop`, `aria-label`, schema.org
  instead of custom `data-agent-*` attributes

## Next Steps

1. **Validate compliance**: Use our
   [compliance checklist](./compliance-checklist.md)
2. **Read the whitepaper**: [BiModal Design v3.0](./whitepaper.md)
3. **Add structured data**: Implement JSON-LD for better agent understanding
4. **Test with real agents**: Set up automated testing across agent levels

## Need Help?

- [Full White Paper](./whitepaper.md)
- [Implementation Guide](./implementation-guide.md)
- [Report Issues](https://github.com/jgoldfoot/BiModalDesign/issues)
- [Discussions](https://github.com/jgoldfoot/BiModalDesign/discussions)
