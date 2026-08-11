# Documentation Drift

Living record of **genuine, unresolved** cross-artifact inconsistencies. Per
[AGENTS.md](AGENTS.md#documentation-drift-reports), this file is overwritten
each run and lists only real contradictions — not acceptable contextual
variations.

_Last reviewed: 2026-08-03_

## Open

### [QUESTION] Unverified MCP discovery pattern (`application/mcp+json`)

Both README.md (Quick Start, Layer 5 snippet) and docs/whitepaper.md
(Standardized WebMCP Discovery) recommend announcing an MCP server with:

```html
<link rel="alternate" type="application/mcp+json" href="/mcp-server" />
```

The 2026-07-21 research scan could not confirm from any primary source that
`application/mcp+json` is a registered media type or that this `link` pattern is
a specified discovery mechanism in either the MCP specification or the WebMCP
Draft Community Group Report. WebMCP's actual surface is
`document.modelContext`, which is a different mechanism.

This may be an original framework proposal rather than an existing standard — a
legitimate thing to publish, but it currently reads as established practice.
**Decision needed:** confirm a primary source, or relabel it as a BiModal Design
proposal. Not edited in the scan PR, since the scan cuts unverified claims
rather than silently rewriting authored recommendations.

**Update (2026-08-03 scan):** MCP `2026-07-28` adds `server/discover`, an RPC
servers **MUST** implement to advertise protocol versions, capabilities, and
identity
([changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog),
major change 3). This does not resolve the question — `server/discover` is
post-connection negotiation, whereas the `<link>` tag addresses pre-connection
discovery from a page — but it narrows it: the framework can now position the
`<link>` pattern explicitly as a bridge to `server/discover` rather than as an
independent standard. Still needs Joel's call on labelling.

### [DRIFT] Implementation guide teaches deprecated MCP features

`docs/whitepaper.md` (§ MCP primitives) records that Roots, Sampling, and
Logging are Deprecated as of `2026-07-28`, while `docs/implementation-guide.md`
Pattern 11 teaches Sampling and Roots as a forward-looking pattern. The
2026-08-03 scan added a deprecation caveat to Pattern 11, but did not rewrite
the pattern itself — that is an authoring decision.
`examples/mcp-client-capabilities.md` and
`docs/proposals/015-mcp-client-capabilities.md` carry the same assumption and
were left untouched. **Decision needed:** migrate these to the Multi Round-Trip
Requests pattern, or mark them as legacy for the deprecation window.

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

- **[DRIFT] package.json description** — used the obsolete binary framing
  ("dual-mode interfaces … for both humans and AI agents"). Updated to the v3.0
  agent-capability-spectrum description.
- **[DRIFT] Maturity level names in `__tests__/setup.test.js`** — defined levels
  1–3 as "Basic Accessibility / Semantic Stability / Agent-Tested",
  contradicting the canonical docs. Corrected to "Semantically Accessible /
  Data-Rich / API-Enabled".

### Resolved earlier

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
