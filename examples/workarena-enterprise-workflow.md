# Optimizing for Enterprise Knowledge Work (WorkArena++)

This example demonstrates how to implement BiModal Design principles to support
complex, long-horizon enterprise workflows, a key evaluation area highlighted by
the **WorkArena++** benchmark.

In enterprise settings (like ServiceNow, Salesforce, or internal IT portals),
agents face dense UIs and must perform compositional planning—interpreting an
implicit goal (like "Restock low inventory items") and executing multiple
sub-tasks (reading a dashboard, cross-referencing catalogs, and submitting
forms).

## The Example: IT Ticket Resolution

This example models a simplified IT ticket dashboard and a corresponding
resolution form. It demonstrates how to explicitly link tasks, provide rich
semantic context, and utilize standard HTML constraints to safely guide an agent
through a multi-step workflow without relying on pure visual reasoning.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>IT Service Desk - Restock Inventory</title>

    <!-- Layer 3: Structured Data exposing the implicit goal and task context -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Action",
        "name": "Restock Low Inventory",
        "description": "Review the inventory dashboard and reorder items falling below the minimum threshold.",
        "actionStatus": "PotentialActionStatus",
        "object": {
          "@type": "ItemList",
          "name": "Low Stock Items",
          "url": "#inventory-dashboard"
        },
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "#restock-form",
          "actionPlatform": ["http://schema.org/DesktopWebPlatform"]
        }
      }
    </script>
  </head>
  <body>
    <!-- Layer 2: Semantic Structure & Focus Management -->
    <main aria-labelledby="page-title">
      <h1 id="page-title">Ticket INC-10293: Restock Inventory</h1>

      <!-- Section 1: Data Gathering (The Dashboard) -->
      <section id="inventory-dashboard" aria-labelledby="dashboard-title">
        <h2 id="dashboard-title">Current Inventory Levels</h2>

        <!-- Table uses explicit scope and aria-labels for reliable AOM parsing -->
        <table aria-label="Inventory Status">
          <thead>
            <tr>
              <th scope="col">Item ID</th>
              <th scope="col">Description</th>
              <th scope="col">Current Stock</th>
              <th scope="col">Min Threshold</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ITM-001</td>
              <td>ThinkPad T14 Gen 3</td>
              <td aria-label="5 units in stock">5</td>
              <td>10</td>
              <td
                aria-label="Critical: Needs Restock"
                style="color: red; font-weight: bold;"
              >
                Critical
              </td>
            </tr>
            <tr>
              <td>ITM-002</td>
              <td>Dell UltraSharp 27 Monitor</td>
              <td aria-label="15 units in stock">15</td>
              <td>10</td>
              <td>Healthy</td>
            </tr>
          </tbody>
        </table>
      </section>

      <hr />

      <!-- Section 2: Execution (The Form) -->
      <section id="restock-form" aria-labelledby="form-title">
        <h2 id="form-title">Submit Restock Order</h2>

        <!-- Layer 2: Defensive Constraints to ensure safe execution -->
        <form action="/api/restock" method="POST" aria-label="Order Form">
          <fieldset>
            <legend>Order Details</legend>

            <div class="form-group">
              <label for="item-id">Item ID (Required)</label>
              <input
                type="text"
                id="item-id"
                name="item_id"
                required
                pattern="^ITM-\d{3}$"
                aria-describedby="item-id-help"
              />
              <span id="item-id-help" class="help-text">Format: ITM-XXX</span>
            </div>

            <div class="form-group">
              <label for="order-quantity">Quantity to Order</label>
              <!-- Defensive bounds prevent catastrophic over-ordering -->
              <input
                type="number"
                id="order-quantity"
                name="quantity"
                min="1"
                max="50"
                required
              />
            </div>

            <div class="form-group">
              <label for="ticket-reference">Related Ticket</label>
              <input
                type="text"
                id="ticket-reference"
                name="ticket_ref"
                value="INC-10293"
                readonly
                aria-readonly="true"
              />
            </div>
          </fieldset>

          <button type="submit" aria-label="Submit Restock Order">
            Place Order
          </button>
        </form>
      </section>
    </main>
  </body>
</html>
```

## Why this matters

The WorkArena++ benchmark exposes that agents struggle with _compositional
reasoning_ across dense UIs.

1. **Semantic Grounding for Implicit Goals:** By using standard HTML tables with
   strict `scope` attributes and explicit `aria-label`s on statuses (e.g.,
   distinguishing visual red text with an explicit "Critical: Needs Restock"
   label), we provide a reliable data source for the agent's reasoning step,
   bypassing visual hallucinations.
2. **Defensive Constraints:** In a high-stakes enterprise environment, an agent
   hallucinating an order quantity could be disastrous. Using native HTML5
   `min="1"` and `max="50"` attributes ensures that even if an autonomous agent
   miscalculates the required stock, the UI defends against catastrophic
   execution errors.
3. **Structured Navigation:** The JSON-LD block explicitly links the data
   gathering component (`#inventory-dashboard`) to the execution component
   (`#restock-form`), effectively handing the agent a map for the multi-step
   workflow.
