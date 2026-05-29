# Human-in-the-Loop Confirmation (τ-bench)

This example demonstrates how to implement a standard, semantic
Human-in-the-Loop (HITL) confirmation pattern for autonomous agents.

Benchmarks like **τ-bench** highlight that real-world tool use is rarely a
single-shot execution. When taking critical actions (like financial transfers,
deleting user data, or purchasing items), agents must be able to pause their
execution flow and ask the human for final approval.

By using the native HTML `<dialog>` element combined with
`schema.org/ConfirmAction`, we provide a robust, semantic signal to the agent
that it is "blocked" and must wait for human intervention, preventing it from
hallucinating success or wildly retrying.

## Key Concepts Demonstrated

1. **Semantic Blocking:** Using `<dialog aria-modal="true">` explicitly blocks
   interaction with the rest of the page. An agent navigating the AOM will see
   that the rest of the document is inert, forcing it to address the dialog.
2. **Action Context:** Using
   `itemscope itemtype="https://schema.org/ConfirmAction"` explicitly describes
   the _purpose_ of the current UI state: waiting for confirmation.
3. **Deterministic Completion:** The use of `<form method="dialog">` provides
   clear, standardized `value="confirm"` and `value="cancel"` options that the
   agent or human can interact with.

## Example Implementation

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Account Settings - Delete Account</title>
  </head>
  <body>
    <!-- Layer 2: Semantic Structure -->
    <main aria-label="Account Settings" id="main-content">
      <h1>Danger Zone</h1>

      <p>Deleting your account is irreversible.</p>

      <!-- The agent clicks this button, which triggers the HITL confirmation -->
      <button
        type="button"
        id="initiate-delete-btn"
        aria-label="Delete my account"
        onclick="requestConfirmation()"
      >
        Delete Account
      </button>
    </main>

    <!--
      Concept 1 & 2: Semantic Blocking and Action Context
      This dialog remains hidden until the action is initiated. Once open,
      it captures focus and prevents interaction with #main-content.
    -->
    <dialog
      id="hitl-confirmation-modal"
      aria-modal="true"
      aria-labelledby="confirm-title"
      itemscope
      itemtype="https://schema.org/ConfirmAction"
    >
      <h2 id="confirm-title" itemprop="name">Confirm Account Deletion</h2>

      <p itemprop="description">
        You are about to permanently delete your account. This action cannot be
        undone. Please confirm this action.
      </p>

      <!--
        Concept 3: Deterministic Completion
        The form method="dialog" naturally handles closing the modal and returning the value.
      -->
      <form method="dialog" id="confirmation-form">
        <div class="button-group">
          <button
            type="submit"
            value="cancel"
            aria-label="Cancel deletion and keep account"
          >
            Cancel
          </button>
          <button
            type="submit"
            value="confirm"
            aria-label="Permanently delete account"
            class="danger"
          >
            Yes, Delete Account
          </button>
        </div>
      </form>
    </dialog>

    <script>
      const modal = document.getElementById('hitl-confirmation-modal');
      const form = document.getElementById('confirmation-form');

      function requestConfirmation() {
        // Calling showModal() makes the dialog modal and inert the rest of the page.
        // This is a powerful signal to the Accessibility Object Model (AOM).
        modal.showModal();
      }

      // Handle the result of the human/agent interaction
      modal.addEventListener('close', () => {
        if (modal.returnValue === 'confirm') {
          // Proceed with the destructive action
          executeDeletion();
        } else {
          // Action cancelled, agent can resume other tasks
          console.log('Deletion cancelled by user.');
        }
      });

      function executeDeletion() {
        console.log('Executing account deletion...');
        // API call to Layer 4 would happen here
      }
    </script>
  </body>
</html>
```

## Why This Works for Agents

- **Clear Paused State:** When the agent clicks "Delete Account", the
  `showModal()` API hides the rest of the DOM from the accessibility tree. The
  agent _cannot_ continue its previous workflow and is forced to recognize the
  new, modal context.
- **Human Handoff:** Because the modal is semantically labeled as a
  `ConfirmAction`, an advanced tool-use agent can recognize this state, pause
  its own execution loop, and message the human: _"I have prepared the deletion.
  Please click 'Yes, Delete Account' to finalize it."_
- **No Custom Attributes:** This pattern relies entirely on established W3C
  standards (HTML5 `<dialog>`, ARIA `aria-modal`) and `schema.org`.
