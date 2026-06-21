# Documentation drift report [2026-06-21]

This report compares how the BiModal Design framework is described across major
artifacts to flag substantive inconsistencies.

## README.md vs docs/whitepaper.md (Citations)

**Label:** [DRIFT]

**README.md (Lines 354-357):**

> - **Operator** — Evaluating multi-agent vision-and-semantic systems across
>   complex JavaScript interfaces (OpenAI, 2026)
> - **Project Mariner** — Benchmarking "Teach & Repeat" capabilities and
>   multi-task concurrency (Google, 2026)

**docs/whitepaper.md (Lines 2068-2071):**

> 8. **Operator**: Evaluating multi-agent vision-and-semantic systems across
>    complex JavaScript interfaces (OpenAI, 2025)
> 9. **Project Mariner**: Benchmarking capabilities and multi-task concurrency
>    (Google, 2025)

The README cites the publication year for the Operator and Project Mariner
research papers as 2026, while the whitepaper cites them as 2025.

## README.md vs package.json

**Label:** [DRIFT]

**README.md (Lines 71-74):**

> # Quick pass/fail FR-1 check
>
> node tools/validators/fr1-validator.js https://your-site.com
>
> # Comprehensive audit (structure, semantics, navigation, forms, agent features)
>
> node tools/validators/fr1-checker.js https://your-site.com --verbose

**package.json (Lines 6-12):**

> "bin": { "bimodal-design": "./tools/bimodal-design-cli.js", "bmd":
> "./tools/bimodal-design-cli.js", "bmd-validate":
> "./tools/validators/fr1-validator.js", "bmd-audit":
> "./accessibility/compliance-audit.js", "bmd-simulate":
> "./tools/agent-simulator.js" },

The README quick start instructions tell users to run the raw
`node tools/validators/... ` scripts instead of the global binary commands
(e.g., `bmd-validate`) that are explicitly configured in `package.json`.

## README.md vs docs/whitepaper.md (Maturity Levels)

**Label:** [QUESTION]

**README.md (Lines 182-190):**

> | Level | Name                    | Layers     | Agent Coverage | Success Rate |
> | ----- | ----------------------- | ---------- | -------------- | ------------ |
> | 0     | Infrastructure Ready    | Layer 1    | Level 0-1      | 40-65%       |
> | 1     | Semantically Accessible | Layers 1-2 | Level 0-2      | 55-75%       |
> | 2     | Data-Rich               | Layers 1-3 | Level 0-3      | 65-85%       |
> | 3     | API-Enabled             | Layers 1-4 | Level 0-4      | 80-92%       |
> | 4     | Agent-Native            | Layers 1-5 | All levels     | 90-98%       |

**docs/whitepaper.md (Lines 1497-1501):**

> - **Compliance thresholds**:
>   - 90%+: BiModal Design Certified
>   - 75-89%: BiModal Design Advanced
>   - 60-74%: BiModal Design Foundational
>   - <60%: At Risk (requires redesign)

The README defines Maturity Levels 0-4 based on which architectural layers are
implemented, whereas the whitepaper introduces a scoring-based "Certification
Tiers" model (Certified, Advanced, Foundational, At Risk) to describe site
compliance. It's unclear if these models coexist or if one supersedes the other.

## README.md vs docs/whitepaper.md (Design Principles)

**Label:** [VARIATION]

**README.md (Lines 102-114):**

> v3.0 uses established standards as the **primary** semantic layer, with
> `data-agent-*` attributes as a **supplementary** layer for intent and action
> metadata that standards don't cover:
>
> | Layer          | Purpose                          | Example                                   |
> | -------------- | -------------------------------- | ----------------------------------------- |
> | Schema.org     | Content identity and structure   | `itemscope itemtype="schema.org/Product"` |
> | WAI-ARIA       | Accessibility and interaction    | `aria-label="Add to cart"`                |
> | `data-agent-*` | Agent intent, actions, and hints | `data-agent-action="add-to-cart"`         |

**docs/whitepaper.md (Lines 878-888):**

> ### **7.1.3 Structured Data (Layer 3)**
>
> Schema.org microdata and JSON-LD provide explicit entities that agents can
> parse reliably without complex NLP:
>
> ```html
> <div itemscope itemtype="https://schema.org/Product">
>   <span itemprop="name">Agent-Optimized UI Kit</span>
>   <meta itemprop="price" content="49.99" />
> </div>
> ```

The README presents Schema.org, WAI-ARIA, and `data-agent-*` as distinct design
principles. The whitepaper treats Schema.org (Layer 3) and Semantic Clarity/ARIA
(Layer 2) as distinct core principles but downplays `data-agent-*` attributes in
the core principles section compared to the prominence it receives in the
README's introductory table.

## README.md vs examples/ssr-pass-example.html (Examples)

**Label:** [VARIATION]

**README.md (Lines 80-84):**

> <main role="main" aria-label="Product catalog">
>   <h1>Wireless Headphones</h1>
>   <nav role="navigation" aria-label="Main navigation">
>     <a href="/products" aria-label="Browse all products">Products</a>
>   </nav>
> </main>

**examples/ssr-pass-example.html (Lines 115-123):**

>   <header>
>     <nav aria-label="Main navigation">
> <!-- ... -->
>     </nav>
>   </header>
>
>   <main aria-label="Product catalog">

The README code snippet explicitly assigns ARIA `role="main"` to `<main>` and
`role="navigation"` to `<nav>`. The example implementation omits these explicit
`role` attributes, relying on the native semantics of the HTML5 elements.
