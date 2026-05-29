# Bypass Live DOM with Structured Data (WebVoyager)

This example demonstrates how to implement a standard, semantic navigation
pattern for autonomous agents that bypasses brittle DOM navigation.

Benchmarks like **WebVoyager** highlight that real-world tool use on live
websites frequently fails during complex, dynamic navigation. Navigating
multi-step search bars, dropdowns, and JavaScript-heavy routing logic is highly
prone to context rot and hallucination for Level 2 and Level 3 agents.

By using the `schema.org/SearchAction` pattern through the `potentialAction`
property, we provide a semantic, programmatic route for agents to construct URLs
and navigate directly to their desired state, entirely bypassing the fragile UI
layers.

## Key Concepts Demonstrated

1. **Action Discovery:** Exposing actions explicitly via JSON-LD
   `potentialAction` informs agents _what_ can be done.
2. **Parametrized Routing:** Defining `target` and `query-input` allows the
   agent to construct valid URL routes directly, turning a multi-step visual
   interaction into a single HTTP/navigation action.
3. **Bypassing Live DOM:** Rather than finding the `<input>`, typing, and
   clicking `<button type="submit">`, the agent simply navigates directly to
   `/search?q={term}`.

## Example Implementation

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Global Store - Search</title>

    <!--
      Concept 1 & 2: Action Discovery and Parametrized Routing
      This structured data tells agents exactly how to perform a search
      without needing to interact with the complex React/Vue DOM elements below.
    -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": "https://www.example-store.com/",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.example-store.com/search?q={search_term}",
          "query-input": "required name=search_term"
        }
      }
    </script>
  </head>
  <body>
    <!-- Layer 2: Semantic Structure -->
    <header>
      <!--
        Concept 3: Bypassing Live DOM
        A Level 3 agent *could* try to interact with this visually, but
        the structured data above provides a much safer, faster route.
        Especially if this search bar opens a dynamic modal when focused.
      -->
      <form
        role="search"
        id="complex-dynamic-search-form"
        aria-label="Site Search"
      >
        <!-- Imagine this input triggers a complex auto-complete dropdown -->
        <input
          type="search"
          id="visual-search-input"
          placeholder="Search for products..."
          aria-autocomplete="list"
        />
        <button type="submit">Search</button>
      </form>
    </header>

    <main aria-label="Featured Products">
      <h1>Welcome to Global Store</h1>
      <!-- Page content -->
    </main>
  </body>
</html>
```

## Why This Works for Agents

- **Deterministic Navigation:** The agent parses the JSON-LD, extracts the
  `target` URL template, substitutes `{search_term}`, and navigates directly.
  This is 100% deterministic compared to visual clicking.
- **Resilience to UI Changes:** If the marketing team redesigns the search bar
  into a hidden modal or an off-canvas menu, the agent's navigation path (the
  `SearchAction`) remains unbroken.
- **No Custom Attributes:** This pattern relies entirely on established W3C
  standards (`schema.org`) and is universally recognized by modern LLM browsers
  and search engines.
