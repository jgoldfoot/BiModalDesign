# MCP Discovery and Defensive Safety Patterns

This example demonstrates how to bridge semantic web content (Layers 1-3) with
native agent protocols like MCP (Layer 5) through standardized web discovery,
while simultaneously implementing defensive design constraints (Safety) as
highlighted by the **ST-WebAgentBench** benchmark.

## Key Concepts Demonstrated

1. **Standardized Web Discovery**: Using standard HTML `<link rel="alternate">`
   tags in the document `<head>` to advertise the presence of an MCP server to
   visiting Level 2 (Browser Automation) or Level 3 (Computer-Use) agents.
2. **Defensive Form Constraints**: Using standard HTML5 attributes (`required`,
   `pattern`, `min`, `max`) to proactively block destructive or invalid actions
   by autonomous agents.

## Example Implementation

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Financial Dashboard - BiModal Design</title>

    <!-- Layer 4: API Discovery -->
    <link rel="api" href="/api/openapi.json" />

    <!--
      Concept 1: Standardized Web Discovery (Layer 5)
      Agents visiting this URL can parse this link tag to discover the MCP server,
      allowing them to "upgrade" their connection from HTML parsing to a robust,
      native protocol connection for tool use.
    -->
    <link
      rel="alternate"
      type="application/mcp+json"
      href="https://api.example.com/mcp"
    />

    <!-- Layer 3: Structured Data -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Financial Dashboard",
        "description": "Manage your accounts and transfer funds."
      }
    </script>
  </head>
  <body>
    <!-- Layer 2: Semantic Structure -->
    <main aria-label="Account Management">
      <h1>Transfer Funds</h1>

      <!--
        Concept 2: Defensive Form Constraints (Safety)
        ST-WebAgentBench highlights the risk of autonomous agents submitting
        invalid or destructive data. By explicitly adding constraints to the form,
        we guide agents using standard DOM behaviors rather than relying on
        post-submission server errors.
      -->
      <form id="transfer-funds-form" action="/api/transfer" method="POST">
        <div class="form-group">
          <label for="account-input">Destination Account (10 digits):</label>
          <input
            type="text"
            id="account-input"
            name="account"
            required
            pattern="[0-9]{10}"
            aria-label="10-digit Account Number"
            aria-describedby="account-help"
          />
          <span id="account-help">Must be exactly 10 digits.</span>
        </div>

        <div class="form-group">
          <label for="amount-input">Amount ($1 - $5000):</label>
          <input
            type="number"
            id="amount-input"
            name="amount"
            required
            min="1"
            max="5000"
            aria-label="Transfer Amount (Max 5000)"
            aria-describedby="amount-help"
          />
          <span id="amount-help">Maximum transfer is $5000 per day.</span>
        </div>

        <button type="submit" aria-label="Confirm Transfer">
          Transfer Funds
        </button>
      </form>
    </main>
  </body>
</html>
```

## Why This Works for Agents

- **Seamless Protocol Upgrade**: When an agent navigates to the page (e.g. via
  an LLM searching for "transfer funds on example bank"), it can instantly read
  the `<link rel="alternate" type="application/mcp+json">` tag and switch to
  using the MCP protocol for robust, API-level function calling instead of
  brittle DOM clicking.
- **Fail-Safe Interactions**: If the agent attempts to transfer $10,000 via a
  DOM click, the native browser `max="5000"` validation will trigger and prevent
  the form submission, protecting against hallucinations or logical errors
  identified in ST-WebAgentBench.
