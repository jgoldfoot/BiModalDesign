# Optimizing for OS-Level / Computer-Use Agents (Level 3)

This example demonstrates how to implement BiModal Design principles to support
Level 3 Computer-Use agents (like Claude Computer Use) that interact with
interfaces via a combination of vision models and the operating system's
Accessibility Object Model (AOM).

Benchmarks like **OSWorld** and **WebArena-Verified** have shown that pure
vision-based interaction is brittle. These agents explicitly query the AOM to
find reliable, exact coordinates for interaction.

Therefore, robust Layer 2 (Semantic Structure) implementation is critical. This
example shows how to use standards-based ARIA attributes to populate the AOM
effectively, without resorting to custom `data-agent-*` attributes.

## Key Concepts Demonstrated

1. **Explicit Role Definitions**: Using `aria-roledescription` to clarify custom
   widgets to the agent.
2. **Keyboard Shortcuts**: Exposing `aria-keyshortcuts` so agents can bypass
   imprecise clicking in favor of deterministic keyboard navigation.
3. **Focus Management**: Explicitly moving focus to dynamic content to ensure
   the agent's context follows the UI state.
4. **State Management**: Using `aria-busy` and `aria-expanded` to communicate
   asynchronous state changes.

## Example Implementation

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Advanced Task Board</title>
    <!-- Layer 3: Structured Data omitted for brevity -->
  </head>
  <body>
    <!-- Layer 2: Semantic Structure -->
    <main aria-label="Project Task Board">
      <h1>Q3 Launch Tasks</h1>

      <!--
      Concept 1: Explicit Role Definitions
      Agents query the AOM to understand custom layouts.
    -->
      <div
        role="group"
        aria-roledescription="Kanban Board Column"
        aria-label="In Progress Tasks"
        id="in-progress-col"
      >
        <h2>In Progress</h2>

        <article aria-labelledby="task-1-title" class="task-card">
          <h3 id="task-1-title">Update API Documentation</h3>

          <!--
          Concept 2: Keyboard Shortcuts
          Computer-Use agents can execute key presses more reliably than precise mouse clicks.
        -->
          <button
            type="button"
            aria-label="Move task to Done"
            aria-keyshortcuts="m d"
            onclick="moveTask('done')"
          >
            Move to Done (M, D)
          </button>
        </article>
      </div>

      <!--
      Concept 3 & 4: Focus and State Management
      When content loads asynchronously, agents need clear AOM state changes.
    -->
      <section aria-label="Task Details" id="detail-panel" hidden>
        <div id="detail-content" aria-live="polite" aria-busy="false">
          <!-- Content injected here via JS -->
        </div>
        <button
          type="button"
          aria-label="Close task details"
          aria-keyshortcuts="Escape"
          onclick="closeDetails()"
        >
          Close
        </button>
      </section>
    </main>

    <script>
      // Concept 3: Focus Management Example
      function loadTaskDetails(taskId) {
        const panel = document.getElementById('detail-panel');
        const content = document.getElementById('detail-content');

        // 1. Reveal panel and set loading state
        panel.removeAttribute('hidden');
        content.setAttribute('aria-busy', 'true');
        content.innerHTML = '<p>Loading...</p>';

        // 2. Explicitly move focus so the agent's context shifts to the new panel
        panel.setAttribute('tabindex', '-1');
        panel.focus();

        // Simulate network request
        setTimeout(() => {
          // 3. Update state when loaded
          content.setAttribute('aria-busy', 'false');
          content.innerHTML =
            '<h4>Task Details</h4><p>Extensive documentation updates required...</p>';
        }, 1500);
      }
    </script>
  </body>
</html>
```

## Why This Works for Agents

- **High-Fidelity Targeting**: When the agent issues a command like "Move the
  API doc task to done", it queries the AOM. `aria-label="Move task to Done"`
  gives it a deterministic target.
- **Fallback Mechanisms**: If the visual model fails to parse a complex CSS
  layout, the agent relies on the clean AOM tree (`main` -> `group` -> `article`
  -> `button`) to execute the action.
- **Deterministic Execution**: Reading `aria-keyshortcuts="m d"` allows the
  agent to simply synthesize keypresses (M, then D) rather than calculating X/Y
  coordinates for a mouse click, drastically reducing interaction failure rates.
