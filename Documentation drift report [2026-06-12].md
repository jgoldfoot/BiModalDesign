## Documentation drift report [2026-06-12]

### README vs Whitepaper

- **[VARIATION] Design Principles:**
  - **README.md (Lines 94-96):** Lists principles across layers but lacks a
    formalized "Design Principles" section with a numbered or prioritized list.
    - `Layer 3: Structured Data       (schema.org, JSON-LD)      → Level 1-3`
    - `Layer 2: Semantic Structure    (HTML5, ARIA, headings)     → Level 1-3`
  - **docs/whitepaper.md (Line 759-764):** Formalizes these into "Core
    Principles", explicitly stating: "These principles build upon FR-1 (Layer
    1). Without Layer 1 compliance, Layers 2-3 are invisible to Level 0-1
    agents." The README implies the stack but does not formalize them into
    principles.

### README vs FR-1 Checker Implementation

- **[DRIFT] FR-1 Checker Validation Categories:**
  - **README.md (Line 198-199):** Claims the `fr1-checker.js` provides detailed
    scoring across six categories: "Use `--verbose` for detailed scoring across
    six categories."
  - **tools/validators/fr1-checker.js (Lines 494-500):** The actual code
    computes `componentScores` for only five categories: `structure`,
    `semantic`, `navigation`, `forms`, and `content`. Agent-specific features
    are checked (Lines 688-690) but not scored.

### README vs Examples

- **[VARIATION] Example Code Snippets:**
  - **README.md (Lines 154-159):** The core pattern snippet uses:
    ```html
    <!-- Layer 2: Semantic structure with ARIA -->
    <main role="main" aria-label="Product catalog">
      <h1>Wireless Headphones</h1>
    </main>
    ```
  - **examples/ssr-pass-example.html (Lines 157-158):** The corresponding
    example drops `role="main"` and uses a different heading:
    ```html
    <main aria-label="Product catalog">
      <h1>Premium Tech Accessories</h1>
    </main>
    ```

### README vs package.json

- **[DRIFT] Versioning:**
  - **README.md (Line 214):** Refers to "BiModal Design v3.0 integrates emerging
    agent protocols".
  - **package.json (Line 3):** Shows `"version": "0.1.0"`, indicating the actual
    published package is significantly out of sync with the documentation's
    stated framework version.
