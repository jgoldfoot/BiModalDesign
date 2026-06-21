# Documentation Drift

Living record of **genuine, unresolved** cross-artifact inconsistencies. Per
[AGENTS.md](AGENTS.md#documentation-drift-reports), this file is overwritten
each run and lists only real contradictions — not acceptable contextual
variations.

_Last reviewed: 2026-06-21_

## Open

### [QUESTION] Maturity Levels vs. Certification Tiers

Two compliance models coexist without a cross-reference:

- **README.md** — Maturity Levels 0–4, defined by which Defense-in-Depth layers
  are implemented (Infrastructure Ready → Agent-Native).
- **docs/whitepaper.md** — Certification Tiers, defined by audit score (90%+
  Certified, 75–89% Advanced, 60–74% Foundational, <60% At Risk).

These measure different things (architecture implemented vs. score achieved) and
can legitimately coexist, but neither doc references the other. **Decision
needed:** add a sentence linking the two models, or leave them independent.

## Resolved this cycle

- **[DRIFT] Citation years** — README cited Operator and Project Mariner as
  2026; whitepaper cited 2025. Operator launched Jan 2025 and Mariner was
  announced Dec 2024, so 2025 is correct. Fixed in README.

## Reviewed — acceptable variation (no action)

- **Quick Start uses `node tools/validators/...` vs. the `bmd-validate` bin
  alias** — intentional: the README targets repo cloners; the bin aliases serve
  installed-package users. Both are valid.
- **`role="main"` / `role="navigation"` in the README snippet vs. omitted in
  `examples/ssr-pass-example.html`** — both correct; the example relies on
  native HTML5 landmark semantics, which is acceptable.
- **`data-agent-*` prominence** — the README's three-layer table and the
  whitepaper's Layer 2/3 principles are consistent; emphasis differs by document
  purpose.
