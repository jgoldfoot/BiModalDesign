# Optimizing for Trajectory Efficiency (Odysseys)

This example demonstrates how to implement Pattern 12 to support long-horizon
web agents evaluated by benchmarks like **Odysseys**.

The Odysseys benchmark emphasizes that long-running agents often fail because of
compounded errors during multi-step navigation. Instead of forcing an agent to
visually locate "Next Page" buttons or "Related Items" links, which is
error-prone and lowers **Trajectory Efficiency**, you can provide deterministic
semantic relationships.

By utilizing standard HTML `<link>` relations in the document `<head>`, you
expose the logical topology of a workflow directly to Level 2 (Browser
Automation) and Level 3 (Computer-Use) agents.

## Key Concepts Demonstrated

1. **Relational Navigation:** Using `rel="prev"`, `rel="next"`, and
   `rel="collection"` to provide deterministic next-step URLs, allowing agents
   to bypass the DOM for navigation.
2. **Contextual Integrity:** Maintaining clear document relationships ensures
   that an agent working on a long-horizon task (e.g., comparing 50 products
   across multiple pages) does not lose its structural context.

## Example Implementation: Multi-Step Checkout

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Checkout - Step 2: Shipping</title>

    <!--
    Concept 1 & 2: Relational Navigation & Contextual Integrity
    Instead of relying on the agent to parse the visual UI buttons for "Back" and "Continue",
    provide deterministic machine-readable links representing the workflow topology.
    -->
    <link
      rel="prev"
      href="/checkout/step1-cart"
      title="Return to Shopping Cart"
    />
    <link
      rel="next"
      href="/checkout/step3-payment"
      title="Proceed to Payment Details"
    />
    <link rel="collection" href="/account/orders" title="View All Orders" />
    <link
      rel="help"
      href="/support/shipping-policies"
      title="Shipping Policy Documentation"
    />
  </head>
  <body>
    <!-- Layer 2: Semantic Structure -->
    <main aria-label="Shipping Details Workflow">
      <h1>Shipping Information</h1>
      <p>Step 2 of 4</p>

      <!-- Visual UI for humans (and fallback for agents) -->
      <form action="/checkout/step3-payment" method="POST">
        <!-- Form fields omitted for brevity -->

        <div class="actions">
          <a href="/checkout/step1-cart">Back to Cart</a>
          <button type="submit">Continue to Payment</button>
        </div>
      </form>
    </main>
  </body>
</html>
```

## Why This Works for Agents

- **High Trajectory Efficiency:** An agent evaluating the current state reads
  the `<head>` and immediately knows the URL for the next logical step
  (`rel="next"`). It can formulate its plan without executing complex DOM
  queries or vision-model evaluations on the UI.
- **Error Reduction:** Visually identical buttons (e.g., two buttons labeled
  "Next", one for a carousel and one for the form) confuse agents. Standardized
  `<link>` tags remove this ambiguity.
- **Standards Compliant:** This completely avoids custom attributes, relying on
  established HTML standards that are natively supported by the web platform.
