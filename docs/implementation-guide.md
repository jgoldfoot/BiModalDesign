# BiModal Design v3.0 Implementation Guide

A comprehensive guide for implementing BiModal Design's Defense in Depth
strategy across the full Agent Capability Spectrum.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Framework Selection](#framework-selection)
3. [Implementation Phases](#implementation-phases)
4. [Code Integration Patterns](#code-integration-patterns)
5. [Testing and Validation](#testing-and-validation)
6. [Performance Optimization](#performance-optimization)
7. [Deployment Strategies](#deployment-strategies)
8. [Monitoring and Analytics](#monitoring-and-analytics)

## Getting Started

### Prerequisites

- **Development Environment**: Node.js 20+, modern build tools
- **Framework Knowledge**: Understanding of your chosen framework (React, Vue,
  etc.)
- **Accessibility Basics**: Familiarity with semantic HTML, ARIA, and schema.org
- **Performance Awareness**: Basic understanding of web performance metrics

### Quick Assessment

```bash
# Test FR-1: Does content load without JS?
curl -s https://your-app.com/ | grep -E '<(main|nav|h1|article)'

# Test structured data
curl -s https://your-app.com/ | grep "application/ld+json"
```

**Assessment Questions:**

- [ ] Does your app serve meaningful content without JavaScript? (Layer 1)
- [ ] Are HTML5 landmarks and ARIA labels used properly? (Layer 2)
- [ ] Is structured data (schema.org/JSON-LD) present? (Layer 3)
- [ ] Are APIs documented with OpenAPI? (Layer 4)
- [ ] Are agent protocols (MCP/A2A) available? (Layer 5)

## Framework Selection

Choose your implementation strategy based on your current architecture:

### Option 1: Server-Side Rendering (SSR) — Recommended

**Best for:** New projects, SEO-critical applications, maximum agent coverage

**Frameworks:** Next.js (React), Nuxt.js (Vue), SvelteKit, Remix

**Agent Coverage:** Excellent — Levels 0-5 supported **Implementation Effort:**
Medium

```javascript
// Next.js: Server component ensures FR-1 compliance
export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <main aria-label="Product catalog">
      <h1>Product Catalog</h1>
      {products.map((product) => (
        <article
          key={product.id}
          itemScope
          itemType="https://schema.org/Product"
        >
          <h2 itemProp="name">{product.name}</h2>
          <p itemProp="description">{product.description}</p>
          <span itemProp="price" content={product.price}>
            ${product.price}
          </span>
        </article>
      ))}
    </main>
  );
}
```

### Option 2: Static Site Generation (SSG) — Highest Performance

**Best for:** Content sites, blogs, marketing pages, documentation

**Frameworks:** Astro, Next.js SSG, Nuxt Generate, 11ty

**Agent Coverage:** Excellent — Levels 0-5 supported **Implementation Effort:**
Low

```astro
---
// Astro: All content is pre-rendered at build time
const products = await fetchProducts();
---
<main aria-label="Product catalog">
  {products.map((product) => (
    <article itemscope itemtype="https://schema.org/Product">
      <h2 itemprop="name">{product.name}</h2>
      <p itemprop="description">{product.description}</p>
    </article>
  ))}
</main>
```

### Option 3: CSR with Mitigation — Requires Work

**Best for:** Existing SPAs where SSR isn't feasible

**Agent Coverage:** Partial — Level 0-1 require skeleton content
**Implementation Effort:** High

See [CSR Mitigation Guide](../examples/csr-mitigation.md) for detailed
strategies.

### Option 4: Hybrid SSR/CSR — Most Flexible

**Best for:** Complex applications needing both SPA interactivity and agent
support

**Agent Coverage:** Excellent when properly implemented **Implementation
Effort:** High

## Implementation Phases

### Phase 1: Layer 1 — Content Accessibility (Week 1)

**Goal:** Ensure FR-1 compliance — content in the initial HTML response.

#### Step 1.1: Test FR-1 Compliance

```bash
curl -s https://your-app.com/ | grep -E '<(nav|main|h1|form)'
# Should return meaningful semantic elements with content
```

#### Step 1.2: Implement SSR/SSG

If your site fails FR-1, switch to server rendering or static generation. This
is the single most impactful change for agent accessibility.

#### Step 1.3: Verify Agent Levels 0-1

```bash
# Level 0 (HTTP Retriever): Does curl return content?
curl -s https://your-app.com/ | wc -c
# Should be >5000 bytes of meaningful HTML

# Level 1 (LLM Browser): Is content parseable?
curl -s https://your-app.com/ | grep -E '<(h1|h2|p|article|section)'
```

**Deliverable:** FR-1 passing, content visible without JavaScript

### Phase 2: Layer 2 — Semantic Structure (Weeks 2-3)

**Goal:** Establish accessible semantic structure for Levels 1-3.

#### Step 2.1: Add HTML5 Landmarks

```html
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/products" aria-current="page">Products</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>

<main aria-label="Product catalog">
  <!-- Primary content -->
</main>

<aside aria-label="Related products">
  <!-- Complementary content -->
</aside>

<footer>
  <!-- Site footer -->
</footer>
```

#### Step 2.2: Implement ARIA Labels

```html
<form aria-label="Contact form" method="POST" action="/contact">
  <fieldset>
    <legend>Contact Information</legend>
    <label for="name">Full Name *</label>
    <input
      id="name"
      required
      aria-required="true"
      aria-describedby="name-help"
    />
    <small id="name-help">Your legal name for our records</small>
  </fieldset>
</form>
```

#### Step 2.3: Ensure Heading Hierarchy

```html
<h1>Product Catalog</h1>
<h2>Electronics</h2>
<h3>Wireless Headphones</h3>
<h3>Smart Speakers</h3>
<h2>Clothing</h2>
<h3>T-Shirts</h3>
```

#### Step 2.4: Optimize for OS-Level Computer-Use Agents (AOM)

Computer-Use agents rely heavily on the Accessibility Object Model (AOM). Add
explicit `aria-keyshortcuts` and `aria-roledescription` to enhance OS-level
interaction, and implement explicit Focus Management (see Pattern 5) to support
keyboard-navigating agents.

```html
<!-- Explicit keyshortcuts tell the agent it can press "C" instead of searching for the button -->
<button aria-label="Add to cart" aria-keyshortcuts="c" onclick="addToCart()">
  Add to Cart (C)
</button>

<!-- Describe custom widgets clearly -->
<div
  role="group"
  aria-roledescription="product carousel"
  aria-label="Featured items"
></div>
```

**Deliverable:** Semantic HTML audit report, ARIA labels on all interactive
elements

### Phase 3: Layer 3 — Structured Data (Weeks 3-4)

**Goal:** Add schema.org structured data for enhanced agent understanding.

#### Step 3.1: Add Inline Microdata

```html
<article itemscope itemtype="https://schema.org/Product">
  <h2 itemprop="name">Wireless Headphones</h2>
  <p itemprop="description">High-quality wireless audio</p>
  <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
    <span itemprop="price" content="99.99">$99.99</span>
    <meta itemprop="priceCurrency" content="USD" />
    <link itemprop="availability" href="https://schema.org/InStock" />
  </div>
</article>
```

#### Step 3.2: Add JSON-LD Blocks

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

**Deliverable:** Structured data passing Google Rich Results Test

### Phase 4: Layer 4 — API Surface (Weeks 4-5)

**Goal:** Expose programmatic access for Level 4 agents.

#### Step 4.1: Document APIs with OpenAPI

```yaml
openapi: 3.0.0
info:
  title: Product Catalog API
  version: 1.0.0
paths:
  /api/products:
    get:
      summary: List all products
      parameters:
        - name: category
          in: query
          schema:
            type: string
      responses:
        '200':
          description: Product list
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Product'
```

#### Step 4.2: Make APIs Discoverable

```html
<link rel="api" type="application/openapi+json" href="/api/openapi.json" />
```

**Deliverable:** OpenAPI spec published, API endpoints tested

### Phase 5: Layer 5 — Agent Protocols (Weeks 5-6)

**Goal:** Enable protocol-native agent access for Level 5.

#### Step 5.1: Implement MCP Server

```javascript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const server = new McpServer({ name: 'product-catalog', version: '1.0.0' });

server.tool('search_products', { query: z.string() }, async ({ query }) => {
  const results = await searchProducts(query);
  return { content: [{ type: 'text', text: JSON.stringify(results) }] };
});
```

#### Step 5.2: Publish Agent Card (A2A)

```json
// /.well-known/agent.json
{
  "name": "Product Catalog Agent",
  "description": "Search and browse product catalog",
  "capabilities": ["product-search", "product-details", "add-to-cart"],
  "protocols": ["mcp", "a2a"]
}
```

**Deliverable:** MCP server functional, Agent Card published

### Phase 6: Testing & Validation (Week 6)

**Goal:** Verify implementation across all agent levels.

See [Testing and Validation](#testing-and-validation) below.

## Code Integration Patterns

### Pattern 1: Progressive Enhancement

Start with accessible HTML, enhance with JavaScript:

```html
<!-- Base: Works for all agent levels -->
<button type="button" aria-label="Add to cart">Add to Cart</button>

<!-- Enhanced: JavaScript adds interactivity for humans -->
<script>
  document
    .querySelector('[aria-label="Add to cart"]')
    .addEventListener('click', handleAddToCart);
</script>
```

### Pattern 2: Standards-Based Data Markup

Use schema.org and ARIA instead of custom attributes:

```html
<!-- v3.0: Standards-based approach -->
<article itemscope itemtype="https://schema.org/Product">
  <h2 itemprop="name">Wireless Headphones</h2>
  <p itemprop="description">Premium wireless audio</p>
  <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
    <span itemprop="price" content="99.99">$99.99</span>
  </div>
  <button aria-label="Add Wireless Headphones to cart">Add to Cart</button>
</article>
```

### Pattern 3: Server-First Forms

Forms that work without JavaScript:

```html
<form method="POST" action="/api/contact" aria-label="Contact form">
  <fieldset>
    <legend>Contact Information</legend>
    <label for="email">Email *</label>
    <input id="email" type="email" name="email" required aria-required="true" />
  </fieldset>
  <button type="submit">Send Message</button>
</form>
```

### Pattern 4: Layered Content Delivery

Serve content at multiple levels simultaneously:

```html
<!-- Layer 1: Content in HTML -->
<main aria-label="Product catalog">
  <h1>Our Products</h1>

  <!-- Layer 2: Semantic structure -->
  <section aria-labelledby="electronics-heading">
    <h2 id="electronics-heading">Electronics</h2>

    <!-- Layer 3: Structured data -->
    <article itemscope itemtype="https://schema.org/Product">
      <h3 itemprop="name">Wireless Headphones</h3>
    </article>
  </section>
</main>

<!-- Layer 3: JSON-LD for richer structured data -->
<script type="application/ld+json">
  { "@context": "https://schema.org", "@type": "ItemList", ... }
</script>

<!-- Layer 4: API link for programmatic access -->
<link rel="api" href="/api/openapi.json" />

<!-- Layer 5: MCP Server Discovery -->
<link rel="alternate" type="application/mcp+json" href="/mcp-server" />
```

### Pattern 5: Focus Management for Keyboard Agents

Computer-Use agents often navigate via keyboard. Manage focus explicitly when
dynamic content loads:

```javascript
function showModal() {
  const modal = document.getElementById('checkout-modal');
  modal.removeAttribute('hidden');
  modal.setAttribute('aria-modal', 'true');

  // Explicitly move focus for keyboard-navigating agents
  const firstInput = modal.querySelector('input');
  if (firstInput) firstInput.focus();
}
```

### Pattern 6: Defensive Form Constraints (Safety)

Agents evaluated in benchmarks like **ST-WebAgentBench** can make destructive
mistakes if inputs aren't constrained. Use standard HTML5 validation to
proactively guide agent tool use:

```html
<form id="transfer-funds-form">
  <!-- The pattern and min/max explicitly constrain agent behavior before submission -->
  <input
    type="text"
    name="account"
    required
    pattern="[0-9]{10}"
    aria-label="10-digit Account Number"
  />
  <input
    type="number"
    name="amount"
    required
    min="1"
    max="5000"
    aria-label="Transfer Amount (Max 5000)"
  />
  <button type="submit" aria-label="Confirm Transfer">Transfer</button>
</form>
```

### Pattern 7: Human-in-the-Loop Confirmation (τ-bench)

When an agent attempts a critical action, use `<dialog aria-modal="true">` and
`schema.org/ConfirmAction` to pause execution and prompt the human. This
satisfies multi-turn interaction requirements highlighted by **τ-bench**.

```html
<!-- The dialog blocks the rest of the UI, explicitly pausing the agent -->
<dialog
  id="confirmation-modal"
  aria-modal="true"
  aria-labelledby="confirm-title"
  itemscope
  itemtype="https://schema.org/ConfirmAction"
>
  <h2 id="confirm-title" itemprop="name">Confirm Transfer</h2>
  <p itemprop="description">
    Are you sure you want to transfer $5,000 to Account 1234567890?
  </p>

  <form method="dialog">
    <!-- The human or agent must interact with these explicit controls -->
    <button value="cancel" aria-label="Cancel transfer">Cancel</button>
    <button value="confirm" aria-label="Confirm transfer">Confirm</button>
  </form>
</dialog>

<script>
  // Show the modal explicitly to trigger a focus change and pause flow
  document.getElementById('confirmation-modal').showModal();
</script>
```

### Pattern 8: Bypass Live DOM with Structured Data (WebVoyager)

WebVoyager highlights that dynamic, multi-step UI navigation on live pages is a
major failure point for agents. Avoid forcing agents to navigate dynamic DOM
components (like custom dropdowns or modals) by exposing direct, parameterized
routing via schema.org `potentialAction`.

```html
<head>
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "https://www.example.com/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.example.com/search?q={search_term}",
        "query-input": "required name=search_term"
      }
    }
  </script>
</head>
```

### Pattern 9: WebMCP Discovery for Agentic Browsers

As Agentic Browsers natively wrap foundation models around the browsing session,
providing a clear path to upgrade from standard DOM traversal to structured tool
use is critical. Use standard `<link>` tags to declare WebMCP discovery. For a
complete example, see
[Agentic Browser WebMCP Integration](../examples/agentic-browser-web-mcp.md).

```html
<head>
  <!-- Standardized WebMCP Discovery -->
  <link
    rel="alternate"
    type="application/mcp+json"
    href="https://api.example.com/mcp"
  />
</head>
```

### Pattern 10: MCP Async Tasks for Long-Running Operations

Benchmarks like OSWorld-Human (arXiv:2506.16042) show computer-use agents lose
most of their time to end-to-end latency, with even top performers taking
1.4-2.7x more steps than a human reference trajectory. Forcing an agent through
a long synchronous tool call makes this worse and risks the transport timing out
before the work completes.

The MCP `Tasks` primitive (introduced in the 2025-11-25 spec, SEP-1686,
currently experimental) addresses this with a "call-now, fetch-later" flow.
Tasks are an augmentation of an existing `tools/call`, not a separate kind of
tool you register: the client augments the call with a task, the server returns
a task handle immediately, and the client polls `tasks/get` for status
(`working` -> `completed`/`failed`/`cancelled`) then retrieves the
`CallToolResult` via `tasks/result`.

> **The Tasks API is experimental and may change.** Pin to the 2025-11-25 spec
> version.

A server opts in by declaring the `tasks` capability and marking a tool
task-augmentable via its `execution` field. Task state is persisted through a
`TaskStore` (`InMemoryTaskStore` ships for reference; use a durable store in
production).

```typescript
import {
  InMemoryTaskStore,
  isTerminal,
  Server,
} from '@modelcontextprotocol/server';
import type {
  CallToolResult,
  CreateTaskOptions,
  CreateTaskResult,
  GetTaskPayloadResult,
  GetTaskResult,
  Tool,
} from '@modelcontextprotocol/server';

const taskStore = new InMemoryTaskStore();

const server = new Server(
  { name: 'enterprise-reporting-agent', version: '2.1.0' },
  {
    capabilities: {
      tools: {},
      tasks: { requests: { tools: { call: {} } } }, // declare task support
    },
  }
);

server.setRequestHandler(
  'tools/list',
  async (): Promise<{ tools: Tool[] }> => ({
    tools: [
      {
        name: 'generate_comprehensive_audit',
        description:
          'Runs a long audit across departments and returns a report',
        inputSchema: {
          type: 'object',
          properties: {
            startDate: { type: 'string' },
            endDate: { type: 'string' },
            departments: { type: 'array', items: { type: 'string' } },
          },
          required: ['startDate', 'endDate', 'departments'],
        },
        execution: { taskSupport: 'required' }, // 'optional' also allows sync calls
      },
    ],
  })
);

// Create the task, return the handle immediately, run the work in the background.
server.setRequestHandler(
  'tools/call',
  async (request, ctx): Promise<CallToolResult | CreateTaskResult> => {
    const { name, arguments: args } = request.params;
    const taskParams = (request.params._meta?.task ?? request.params.task) as
      { ttl?: number; pollInterval?: number } | undefined;
    if (!taskParams) throw new Error(`Tool ${name} requires task mode`);

    const options: CreateTaskOptions = {
      ttl: taskParams.ttl,
      pollInterval: taskParams.pollInterval ?? 2000,
    };
    const task = await taskStore.createTask(
      options,
      ctx.mcpReq.id,
      request,
      ctx.sessionId
    );

    void (async () => {
      try {
        await taskStore.updateTaskStatus(task.taskId, 'working', 'Working...');
        const report = await runAudit(args); // your long-running work
        await taskStore.storeTaskResult(task.taskId, 'completed', {
          content: [{ type: 'text', text: report.summary }],
        });
      } catch (error) {
        await taskStore.storeTaskResult(task.taskId, 'failed', {
          content: [{ type: 'text', text: `Audit failed: ${String(error)}` }],
          isError: true,
        });
      }
    })();

    return { task }; // the handle, not the result
  }
);

server.setRequestHandler(
  'tasks/get',
  async (request): Promise<GetTaskResult> => {
    const task = await taskStore.getTask(request.params.taskId);
    if (!task) throw new Error(`Task ${request.params.taskId} not found`);
    return task;
  }
);

server.setRequestHandler(
  'tasks/result',
  async (request): Promise<GetTaskPayloadResult> => {
    const task = await taskStore.getTask(request.params.taskId);
    if (!task) throw new Error(`Task ${request.params.taskId} not found`);
    if (!isTerminal(task.status)) {
      throw new Error(
        `Task ${request.params.taskId} not finished; keep polling`
      );
    }
    return taskStore.getTaskResult(request.params.taskId);
  }
);
```

Transport and session wiring use standard Streamable HTTP; see the full runnable
version in `examples/mcp-async-tasks.md`. The SDK also exposes a higher-level
helper, `server.experimental.tasks.registerToolTask(...)`, documented in the MCP
TypeScript SDK server guide (also experimental).

## Testing and Validation

### Testing by Agent Level

```bash
# Level 0: HTTP Retriever
curl -s https://your-app.com/ | grep -E '<(main|nav|h1)'
# Expected: semantic HTML with content

# Level 1: LLM Browser
curl -s https://your-app.com/ | grep "application/ld+json"
# Expected: structured data present

# Level 2: Browser Automation
npx playwright test --project=chromium
# Expected: all flows complete

# Level 4: Tool-Use Agent
curl https://your-app.com/api/products
# Expected: JSON response with typed data

# Level 5: Protocol-Native
# Test MCP server connectivity
```

### Automated Test Suite

```javascript
// playwright.config.js
module.exports = {
  projects: [
    {
      name: 'level-0-http',
      use: { javaScriptEnabled: false },
    },
    {
      name: 'level-2-automation',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'level-3-vision',
      use: {
        ...devices['Desktop Chrome'],
        screenshot: 'on',
      },
    },
  ],
};
```

### Validation Checklist

**Layer 1 — Content Accessibility:**

- [ ] Content loads without JavaScript
- [ ] Navigation works with keyboard only
- [ ] Forms submit successfully server-side

**Layer 2 — Semantic Structure:**

- [ ] HTML5 landmarks present
- [ ] ARIA labels on interactive elements
- [ ] Heading hierarchy correct

**Layer 3 — Structured Data:**

- [ ] JSON-LD validates (Google Rich Results Test)
- [ ] schema.org types correct
- [ ] OpenGraph meta tags present

**Layer 4 — API Surface:**

- [ ] OpenAPI spec validates
- [ ] API endpoints return correct data
- [ ] Error responses are clear

**Layer 5 — Agent Protocols:**

- [ ] MCP tools callable
- [ ] Agent Card accessible at `/.well-known/agent.json`

## Performance Optimization

### Core Web Vitals Targets

- **First Contentful Paint (FCP):** < 1.0s
- **Largest Contentful Paint (LCP):** < 1.5s
- **Cumulative Layout Shift (CLS):** < 0.1
- **Time to First Byte (TTFB):** < 200ms for agents

### Agent-Specific Optimizations

```html
<!-- Inline critical CSS for faster agent parsing -->
<style>
  main {
    display: block;
  }
  nav {
    display: flex;
  }
</style>

<!-- Defer non-critical JavaScript -->
<script src="/app.js" defer></script>
```

### Content Delivery

```nginx
# Compress content
gzip on;
gzip_types text/html text/css application/javascript application/json;

# Cache static assets
location ~* \.(css|js|png|jpg|svg|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

## Deployment Strategies

### Strategy 1: Universal SSR (Recommended)

Single deployment with server rendering for all users:

```javascript
// Next.js App Router: server components by default
export default async function Page() {
  const data = await fetchData();
  return <MainContent data={data} />;
}
```

### Strategy 2: Static Generation with ISR

Pre-build pages, revalidate on a schedule:

```javascript
// Next.js: Incremental Static Regeneration
export const revalidate = 3600; // Revalidate every hour

export default async function Page() {
  const data = await fetchData();
  return <MainContent data={data} />;
}
```

### Strategy 3: Edge Computing

Deploy at the edge for lowest latency:

```javascript
// Cloudflare Workers / Vercel Edge
export const runtime = 'edge';

export default async function Page() {
  const data = await fetchData();
  return <MainContent data={data} />;
}
```

## Monitoring and Analytics

### Key Metrics to Track

**Agent Coverage Metrics:**

- Content accessibility rate by agent level
- Structured data validation pass rate
- API response times and error rates
- MCP tool invocation success rate

**Business Impact Metrics:**

- AI-assisted discovery rate (GEO performance)
- Search engine indexing coverage
- Agent task completion rates
- Accessibility compliance scores

### Monitoring Setup

```bash
# Periodic FR-1 check
curl -s https://your-app.com/ | grep -c '<(main|nav|h1|article)'

# Structured data validation
curl -s https://your-app.com/ | grep -c 'application/ld+json'

# API health
curl -s -o /dev/null -w "%{http_code}" https://your-app.com/api/products
```

## Implementation Checklist

### Pre-Implementation

- [ ] Framework selection completed
- [ ] Team trained on BiModal Design v3.0 concepts
- [ ] Agent Capability Spectrum understood
- [ ] Defense in Depth layers prioritized

### Layer 1: Content Accessibility

- [ ] FR-1 compliance verified
- [ ] SSR/SSG implemented
- [ ] Content visible without JavaScript

### Layer 2: Semantic Structure

- [ ] HTML5 landmarks added
- [ ] ARIA labels implemented
- [ ] Heading hierarchy correct
- [ ] Forms properly structured

### Layer 3: Structured Data

- [ ] schema.org microdata on key content
- [ ] JSON-LD blocks for rich data
- [ ] OpenGraph meta tags present

### Layer 4: API Surface

- [ ] REST/GraphQL endpoints documented
- [ ] OpenAPI specification published
- [ ] API discoverable via link tags

### Layer 5: Agent Protocols

- [ ] MCP server implemented (optional)
- [ ] Agent Card published (optional)
- [ ] NLWeb endpoint available (optional)

### Validation

- [ ] All agent levels tested
- [ ] Performance benchmarks met
- [ ] Compliance checklist passed
- [ ] Monitoring configured

## Next Steps

1. **Review the whitepaper** — [BiModal Design v3.0](./whitepaper.md)
2. **Check compliance** — [Compliance Checklist](./compliance-checklist.md)
3. **See examples** — [Implementation Examples](../examples/)
4. **Troubleshoot issues** — [Troubleshooting Guide](./troubleshooting.md)

## Support

- **Documentation**:
  [BiModal Design Docs](https://github.com/jgoldfoot/BiModalDesign/docs)
- **Examples**:
  [Implementation Examples](https://github.com/jgoldfoot/BiModalDesign/examples)
- **Issues**: [GitHub Issues](https://github.com/jgoldfoot/BiModalDesign/issues)
- **Discussions**:
  [Community Forum](https://github.com/jgoldfoot/BiModalDesign/discussions)

### Pattern 11: Agent-Accessible Web Components via ElementInternals

When building Web Components, the Shadow DOM inherently encapsulates internal
markup and state, creating a "black box" that can obscure critical interaction
data from the Accessibility Object Model (AOM). This is problematic for Level 2
and Level 3 agents.

To ensure your custom elements remain semantically accessible without cluttering
the light DOM, use the `ElementInternals` API. This allows the component to
communicate its role, state, and labels directly to the AOM natively.

```javascript
class AgentToggle extends HTMLElement {
  static get formAssociated() {
    return true;
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // 1. Attach internals to communicate with the AOM
    this._internals = this.attachInternals();

    // 2. Set the semantic role directly on the AOM
    this._internals.role = 'switch';

    // 3. Ensure keyboard focusability
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }

    // Shadow DOM setup omitted for brevity...
  }

  connectedCallback() {
    // 4. Expose the accessible name to the AOM
    this._internals.ariaLabel = this.textContent.trim();
    this._updateState();
  }

  _updateState() {
    // 5. Keep the AOM state in sync with the internal state
    this._internals.ariaChecked = this.checked ? 'true' : 'false';
  }
}
customElements.define('agent-toggle', AgentToggle);
```

See the full
[Web Components ElementInternals Example](../examples/web-components-element-internals.md)
for more details.

### Pattern 12: Trajectory Efficiency via Relational Navigation (Odysseys)

The Odysseys benchmark demonstrated that agents fail on long-horizon, multi-step
tasks due to compounded errors in navigating the visual UI. Provide standard
HTML `<link>` relations to create deterministic navigation paths.

```html
<head>
  <!-- Expose logical topology to agents in the head -->
  <link rel="prev" href="/checkout/step1" title="Return to Cart" />
  <link rel="next" href="/checkout/step3" title="Proceed to Payment" />
  <link rel="collection" href="/account/orders" title="View All Orders" />
</head>
```

**Why it works**: Agents can bypass visual parsing of the UI entirely to find
the "Next" button. They can programmatically extract the URL from the
`rel="next"` tag, drastically improving Trajectory Efficiency and reducing
failure rates over long-running tasks.

**Reference**:
[Trajectory Efficiency Example](../examples/odysseys-trajectory-efficiency.md)

### Pattern 13: Demonstration Learning Optimization (Teach & Repeat)

With the rise of "Teach & Repeat" capabilities in agents like Google Project
Mariner and complex GUI navigation by systems like OpenAI Operator, interfaces
must be optimized for demonstration learning.

**Why it's necessary**: Agents learning by observing a human (or another agent)
rely heavily on stable identifiers, clear boundaries for workflows, and precise
semantic labeling to reliably replicate the task later. Pure HTML fallback is
insufficient if the visual structure and the DOM don't strongly correlate.

```html
<!-- BiModal Pattern: Demonstration Learning Optimization -->
<div class="workflow-container">
  <!-- Use <form> to bound the workflow context -->
  <form id="onboarding-request-form" aria-labelledby="form-title">
    <h2 id="form-title">Employee Details</h2>

    <!-- Provide explicit <label> associations rather than implicit ones -->
    <div class="form-group">
      <label for="employee-first-name">First Name</label>
      <!-- Use stable IDs and name attributes (no dynamically generated strings) -->
      <input
        type="text"
        id="employee-first-name"
        name="firstName"
        required
        aria-required="true"
        autocomplete="given-name"
      />
    </div>

    <!-- Clear affordances with standard elements -->
    <button type="submit" id="submit-onboarding-request">Submit Request</button>
  </form>
</div>
```

**Key Principles:**

1. **Stable Identifiers**: Never use dynamically generated class names or IDs
   (e.g., `id="input-abc123"`) for interactive elements.
2. **Explicit Workflow Boundaries**: Use semantic elements like `<form>` or
   `<fieldset>` to encapsulate related steps in a task.
3. **Multi-Task Concurrency Safe**: Avoid reliance on global state or assuming
   linear navigation, as advanced agents may attempt to perform multiple tasks
   simultaneously across different browser tabs.

**Reference**:
[Operator Teach & Repeat Example](../examples/operator-teach-and-repeat.html)

### Pattern 14: Long-Horizon State Exposure (OSWorld 2.0)

_Status: Proposed for v3.0 based on OSWorld 2.0 benchmark findings._

In complex workflows requiring hundreds of tool calls, even frontier agents
suffer from "Constraint Amnesia." They lose track of mid-task constraints,
historical choices, and dynamic limits as their context window shifts.

To support these long-horizon agents, do not rely on the agent to remember
transient alerts or previously submitted forms. Instead, explicitly persist
accumulated task state, dynamic constraints, and historical actions directly in
the DOM using semantically anchored elements (e.g., `<aside>`, `<output>`,
`<section aria-labelledby="...">`). This ensures that critical state is
permanently available in the Accessibility Object Model (AOM) for the agent to
reference at any step.

See `examples/osworld2-state-exposure.html` for an example.
