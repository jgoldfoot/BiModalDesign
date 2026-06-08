# Documentation drift report [2026-06-08]

## README vs docs/whitepaper.md and docs/compliance-checklist.md

**Finding:** The Framework Maturity Levels table uses inconsistent column naming
for success rates across artifacts.

- `README.md` (line 274):
  `| Level | Name | Layers | Agent Coverage | Success Rate |`
- `docs/whitepaper.md` (line 1509):
  `| **Level** | **Name** | **Layers Implemented** | **Agent Coverage** | **Typical Success Rate** |`
- `docs/compliance-checklist.md` (line 210):
  `| Level | Name | Layers | Agent Coverage | Target |`

**Quote from README.md:**

> `| Level | Name                    | Layers     | Agent Coverage | Success Rate |`

**Quote from docs/compliance-checklist.md:**

> `| Level | Name                    | Layers     | Agent Coverage | Target |`

**[VARIATION]**

---

## README vs tools/validators/fr1-validator.js

**Finding:** The conceptual definition of Foundational Requirement 1 (FR-1)
differs from its programmatic implementation. The documentation describes it
conceptually as the presence of content, while the validator tests specific
heuristics.

- `README.md` (line 188): Describes FR-1 conceptually as "critical content must
  exist in the initial HTTP response."
- `tools/validators/fr1-validator.js` (lines 66-70): Checks specific
  quantitative metrics, such as body length > 1000 and text content length >
  200, and ensures the page is not an empty `#root` div without text.

**Quote from README.md:**

> `The foundational requirement: critical content must exist in the initial HTTP response. This is Layer 1 of defense in depth — the floor, not the ceiling.`

**Quote from tools/validators/fr1-validator.js:**

> ```javascript
> const hasContent = body.length > 1000;
> const hasSemanticHTML = /<(article|section|nav|main|header|footer)/.test(
>   bodyLower
> );
> const hasText = body.replace(/<[^>]*>/g, '').trim().length > 200;
> const notSPA = !/<div[^>]*id=["']root["']/.test(bodyLower) || hasText;
> ```

**[DRIFT]**

---

## README vs examples/astro-ssg-example.md

**Finding:** The `astro-ssg-example.md` example extensively uses custom
`data-agent-*` attributes which conflicts with the v3.0 standard explicitly
stated in the README, Whitepaper, and AGENTS.md, which prioritize established
web standards.

- `README.md` (line 201): States that "v3.0 uses established standards as the
  primary semantic layer, with data-agent-\* attributes as a supplementary
  layer".
- `examples/astro-ssg-example.md` (lines 1120-1126): Employs custom attributes
  directly, without a v3.0 deprecation note, unlike `examples/csr-mitigation.md`
  which includes a "v3.0 Migration Note".

**Quote from README.md:**

> `v3.0 uses established standards as the primary semantic layer, with data-agent-* attributes as a supplementary layer for intent and action metadata that standards don't cover:`

**Quote from examples/astro-ssg-example.md:**

> ```html
> <label for="priority" data-agent-content="field-label">
>   Priority Level
> </label>
> <select
>   id="priority"
>   name="priority"
>   data-agent-field="inquiry-priority"
> ></select>
> ```

**[DRIFT]**
