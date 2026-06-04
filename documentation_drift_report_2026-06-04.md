# Documentation drift report [2026-06-04]

## README.md vs docs/whitepaper.md

**Finding 1: Design Principles Discrepancy**

- **Paths**: `README.md` (Lines 151-177), `docs/whitepaper.md` (Line 743-755)
- **Label**: [DRIFT]
- **Details**: The README implies design principles like semantic HTML5
  landmarks, WAI-ARIA roles, and schema.org JSON-LD through code snippets but
  doesn't list them explicitly in a numbered sequence or explain them as
  foundational principles. The whitepaper has a dedicated section for these
  principles outlining Semantic Clarity, Semantic Discovery and API
  documentation. Additionally, the README mentions WCAG 2.2 AA conceptually in
  the principles context, but it's only mentioned at the end of the whitepaper
  as a reference.
- **Quotes**:
  - `README.md` (Line 152):
    ```
    <!-- Layer 2: Semantic structure with ARIA -->
    <main role="main" aria-label="Product catalog">
    ```
  - `docs/whitepaper.md` (Line 748-750):

    ```
    ### **7.1 Core Principles**

    #### **7.1.1 Semantic Clarity (Layer 2)**
    ```

**Finding 2: Key Research Findings Discrepancy**

- **Paths**: `README.md` (Lines 117-123), `docs/whitepaper.md` (Line 105, 509)
- **Label**: [DRIFT]
- **Details**: The README specifies "12-20% baseline success for HTTP Retrievers
  on conventional CSR sites, improving to 42-65% with Layer 1 compliance and
  60-75% with full Layer 1-3 implementation." However, these specific numbers
  and the focus on HTTP Retrievers do not exist in the whitepaper's metrics or
  benchmarking sections. The whitepaper only lists metrics for Browser
  Automation.
- **Quotes**:
  - `README.md` (Lines 117-119):
    ```
    - **12-20% baseline success** for HTTP Retrievers on conventional CSR sites,
      improving to **42-65%** with Layer 1 compliance and **60-75%** with full Layer
      1-3 implementation.
    ```
  - `docs/whitepaper.md` (Line 105):
    ```
    | Browser Automation Success            | 35-50%          | 55-72%              | 75-88%                          |
    ```

## README.md vs AGENTS.md vs examples/

**Finding 3: Examples - Use of Deprecated Attributes**

- **Paths**: `examples/astro-ssg-example.md` (Line 205, 206), `AGENTS.md` (Lines
  22-23), `README.md` (Line 207-209)
- **Label**: [DRIFT]
- **Details**: The README and AGENTS.md state that v3.0 replaces custom
  `data-agent-*` attributes with established standards, explicitly instructing
  not to use them. However, `examples/astro-ssg-example.md` still heavily relies
  on these deprecated `data-agent-*` attributes (e.g., `data-agent-context`,
  `data-agent-enhanced`) in its "Agent Detection Script".
- **Quotes**:
  - `AGENTS.md` (Lines 22-23):
    ```
    **Important**: v3.0 replaces custom `data-agent-*` attributes with established
    web standards. Do not add new `data-agent-*` attributes.
    ```
  - `examples/astro-ssg-example.md` (Line 205-206):
    ```
    document.documentElement.setAttribute('data-agent-context', 'detected');
    document.documentElement.setAttribute('data-agent-type', agentInfo.type);
    ```
