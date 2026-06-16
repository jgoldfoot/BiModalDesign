# Hybrid Agent MCP Handoff Example

This example demonstrates how to structure a UI to support **Hybrid Agents**.
Hybrid agents mix UI navigation (Computer-Use/Browser Automation) with direct
API/Protocol execution.

A common pattern is an agent navigating a complex UI to find a specific product
or workflow, but preferring to execute the final transaction (e.g., a purchase
or complex data mutation) via a robust API rather than clicking brittle DOM
elements subject to **DOM selector drift**.

This example shows a product page that uses standard `<link>` tags and semantic
HTML to allow an agent to seamlessly transition from Layer 2 (Semantic
Structure) interaction to Layer 5 (Agent Protocols) execution.

## The Approach

1.  **Layer 2 (Semantic Structure):** Provide robust ARIA attributes so the
    agent can understand the context without relying on brittle CSS classes.
2.  **Layer 3 (Structured Data):** Provide a `schema.org/Product` definition so
    the agent knows exactly what entity it is looking at.
3.  **Layer 5 Discovery:** Provide an explicit link to the Model Context
    Protocol (MCP) server so the agent can handoff the transaction.

## Implementation

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Acme Pro Server - Hybrid Handoff Example</title>

    <!--
    LAYER 5 DISCOVERY:
    The hybrid agent reads this tag and knows it can switch
    from DOM interaction to MCP tool calling.
  -->
    <link
      rel="alternate"
      type="application/mcp+json"
      href="https://api.acme.com/mcp"
    />

    <!--
    LAYER 3 STRUCTURED DATA:
    The agent uses this to get the exact product ID without parsing the DOM.
  -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org/",
        "@type": "Product",
        "sku": "SRV-PRO-99X",
        "name": "Acme Pro Server",
        "offers": {
          "@type": "Offer",
          "price": "1999.00",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        }
      }
    </script>
  </head>
  <body>
    <!--
    LAYER 2 SEMANTIC STRUCTURE:
    If the agent chooses to continue via the UI (or falls back),
    ARIA attributes provide resilience against DOM selector drift.
    Notice we don't rely on classes like `.btn-primary` for the agent.
  -->
    <main role="main" aria-label="Product Details: Acme Pro Server">
      <header>
        <h1 aria-label="Product Name">Acme Pro Server</h1>
        <p aria-label="Price">$1,999.00</p>
      </header>

      <section aria-labelledby="specs-heading">
        <h2 id="specs-heading">Specifications</h2>
        <ul>
          <li>64 Core Processor</li>
          <li>256GB RAM</li>
        </ul>
      </section>

      <!--
      The agent can click this button, OR use the MCP server discovered
      in the <head> to call the `purchase_product` tool with sku "SRV-PRO-99X".
    -->
      <button
        type="button"
        aria-label="Add Acme Pro Server to cart"
        aria-describedby="availability-message"
      >
        Add to Cart
      </button>
      <p id="availability-message" aria-live="polite">In Stock</p>
    </main>
  </body>
</html>
```

## How the Hybrid Agent Processes This

1.  **Navigation:** The agent arrives at the page via standard browser
    navigation (Level 2/3 capability).
2.  **Discovery:** It parses the `<head>` and identifies the
    `application/mcp+json` link.
3.  **Context Extraction:** It reads the JSON-LD to understand it is looking at
    `sku: SRV-PRO-99X`.
4.  **Handoff:** Instead of risking failure due to DOM selector drift by
    clicking the "Add to Cart" button and navigating a complex multi-step
    checkout UI, the agent connects to `https://api.acme.com/mcp`.
5.  **Execution:** The agent calls the `add_to_cart` or `purchase` tool provided
    by the MCP server, passing the exact SKU.

This pattern provides the highest possible success rate in production by
combining the flexibility of web browsing with the reliability of
protocol-native execution.
