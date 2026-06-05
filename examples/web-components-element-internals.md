# Agent-Accessible Web Components via ElementInternals

This example demonstrates how to implement BiModal Design principles within Web
Components using the `ElementInternals` API.

As web applications increasingly use the Shadow DOM for style and markup
encapsulation, they inadvertently hide the semantic structure and state of
custom elements from the Accessibility Object Model (AOM). This creates a "black
box" for Level 2 (Browser Automation) and Level 3 (Computer-Use) agents that
rely on the AOM to understand and interact with the interface.

By using `ElementInternals`, developers can expose the internal state and
semantic role of a Web Component directly to the AOM, ensuring the component is
fully comprehensible to AI agents without cluttering the light DOM with
redundant ARIA attributes.

## Key Concepts Demonstrated

1.  **AOM Population via ElementInternals:** Using `attachInternals()` to assign
    semantic roles and accessible names that agents can read directly from the
    accessibility tree.
2.  **State Management:** Dynamically updating AOM properties (like
    `ariaValueNow` or `ariaChecked`) inside the component so that external
    agents are aware of state changes without needing to inspect the
    encapsulated Shadow DOM.
3.  **Keyboard & Focus Management:** Ensuring the custom element can be focused
    and interacted with via standard keyboard events, which is crucial for
    deterministic agent execution.

## Example Implementation

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>BiModal Web Component Example</title>
  </head>
  <body>
    <!-- Layer 2: Semantic Structure in Light DOM -->
    <main aria-label="Settings Dashboard">
      <h1>Preferences</h1>

      <!--
      The custom element appears simple in the light DOM.
      Agents query the AOM to understand what this element actually is.
    -->
      <agent-toggle id="notifications-toggle" checked>
        Enable AI Notifications
      </agent-toggle>
    </main>

    <script>
      class AgentToggle extends HTMLElement {
        static get formAssociated() {
          return true;
        }

        constructor() {
          super();
          this.attachShadow({ mode: 'open' });

          // Concept 1: AOM Population
          // attachInternals() allows the component to communicate directly with the AOM.
          this._internals = this.attachInternals();
          this._internals.role = 'switch';

          // Ensure the element is focusable for keyboard-driven agents
          if (!this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', '0');
          }

          this.shadowRoot.innerHTML = `
          <style>
            :host {
              display: inline-flex;
              align-items: center;
              cursor: pointer;
              font-family: sans-serif;
            }
            :host(:focus) {
              outline: 2px solid #005fcc;
              outline-offset: 2px;
            }
            .track {
              width: 40px;
              height: 20px;
              background: #ccc;
              border-radius: 10px;
              margin-right: 10px;
              position: relative;
              transition: background 0.2s;
            }
            .thumb {
              width: 16px;
              height: 16px;
              background: white;
              border-radius: 50%;
              position: absolute;
              top: 2px;
              left: 2px;
              transition: transform 0.2s;
            }
            :host([checked]) .track {
              background: #005fcc;
            }
            :host([checked]) .thumb {
              transform: translateX(20px);
            }
          </style>
          <div class="track"><div class="thumb"></div></div>
          <slot></slot>
        `;

          this.addEventListener('click', this._toggle.bind(this));
          this.addEventListener('keydown', (e) => {
            // Concept 3: Keyboard Management (Space or Enter to toggle)
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              this._toggle();
            }
          });
        }

        connectedCallback() {
          // Concept 1: Accessible Name
          // Set the label based on the light DOM text content
          this._internals.ariaLabel = this.textContent.trim();
          this._updateState();
        }

        get checked() {
          return this.hasAttribute('checked');
        }

        set checked(val) {
          if (val) {
            this.setAttribute('checked', '');
          } else {
            this.removeAttribute('checked');
          }
          this._updateState();
        }

        _toggle() {
          this.checked = !this.checked;
          // Dispatch event for any standard listeners
          this.dispatchEvent(new Event('change', { bubbles: true }));
        }

        _updateState() {
          // Concept 2: State Management
          // Directly update the AOM so agents know the current state
          this._internals.ariaChecked = this.checked ? 'true' : 'false';
        }
      }

      customElements.define('agent-toggle', AgentToggle);
    </script>
  </body>
</html>
```

## Why This Works for Agents

- **Opaque DOM, Transparent Semantics:** An agent inspecting the page doesn't
  need to pierce the Shadow DOM to figure out what `<agent-toggle>` is. It
  queries the AOM, sees a `switch` role, reads the label "Enable AI
  Notifications", and sees `ariaChecked="true"`.
- **Reliable Execution:** Because the component handles standard keyboard events
  (`Space` and `Enter`) and explicitly manages focus, computer-use agents can
  interact with it deterministically without relying on brittle coordinate-based
  mouse clicks.
- **Standards Compliant:** This entirely avoids custom `data-agent-*`
  attributes, adhering strictly to the `ElementInternals` web standard for
  maximum interoperability across different agent capabilities.
