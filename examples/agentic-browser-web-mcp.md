# Agentic Browser and WebMCP Integration

This example demonstrates how to implement standards-based patterns to support
**Agentic Browsers** and native **WebMCP** discovery.

As agentic browsers like Perplexity Comet and Google's agentic Chrome features
wrap foundation models natively around browsing sessions, interfaces must cater
to them without relying on custom attributes.

This example showcases two critical elements:

1. **WebMCP Discovery:** Using a standard `<link>` tag to announce MCP
   capabilities natively in the DOM, allowing an agentic browser to upgrade its
   interaction from HTTP/HTML to a structured tool protocol.
2. **Structured Semantic Action:** Using `schema.org/SearchAction` and
   `potentialAction` to provide the agentic browser with a deterministic,
   API-like interaction surface within the HTML, avoiding brittle visual/DOM
   interaction.

## Code Example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Agentic Commerce Store</title>
    <meta
      name="description"
      content="Shop the latest products with our agent-friendly interface."
    />

    <!-- 1. Standardized WebMCP Discovery -->
    <!-- This allows Agentic Browsers (Level 1/2) to discover and connect to the site's MCP Server -->
    <link
      rel="alternate"
      type="application/mcp+json"
      href="https://api.example.com/mcp"
    />

    <!-- 2. Structured Action Discovery for Agentic Navigation -->
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
  <body>
    <main role="main" aria-label="Product Catalog">
      <header>
        <h1>Agentic Commerce Store</h1>
      </header>

      <!-- Semantic forms with HTML5 constraints provide defensive safety for tool use -->
      <section aria-labelledby="search-heading">
        <h2 id="search-heading">Find a Product</h2>
        <form
          role="search"
          action="/search"
          method="GET"
          aria-label="Product search"
        >
          <label for="search-input">Search for items</label>
          <input
            id="search-input"
            type="search"
            name="q"
            required
            minlength="2"
            maxlength="100"
            aria-describedby="search-help"
          />
          <p id="search-help">Enter 2 to 100 characters.</p>
          <button type="submit">Search</button>
        </form>
      </section>

      <!-- Content accessible in initial payload (FR-1 compliant) -->
      <section aria-label="Featured Products">
        <article itemscope itemtype="https://schema.org/Product">
          <h3 itemprop="name">Wireless Noise-Canceling Headphones</h3>
          <p itemprop="description">Experience pure sound without the wire.</p>
          <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
            <span itemprop="priceCurrency" content="USD">$</span
            ><span itemprop="price" content="199.99">199.99</span>
            <link itemprop="availability" href="https://schema.org/InStock" />In
            Stock
          </div>
        </article>
      </section>
    </main>
  </body>
</html>
```

## Why this matters

- **Safety:** HTML5 constraints (`required`, `minlength`, `maxlength`) provide
  proactive defense, stopping an agent from submitting invalid data.
- **Resilience:** The JSON-LD `SearchAction` gives the agent an explicit URL
  pattern to query (`/search?q={search_term}`), rather than forcing it to
  visually locate the search box, click it, and type text.
- **Protocol Upgrades:** The
  `<link rel="alternate" type="application/mcp+json">` serves as a bridge,
  allowing an agentic browser to move from navigating DOM nodes to invoking
  deterministic tools via WebMCP.
