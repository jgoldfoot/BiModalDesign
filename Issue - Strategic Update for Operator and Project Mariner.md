# Strategic Update for Operator and Project Mariner

**Title:** Integrate findings on Operator, Project Mariner, and CUA into BiModal
Design methodology

**Body:**

### Overview

Recent industry developments in early 2026 have shown significant advancements
in Computer-Using Agents (CUAs). Specifically, the Operator system (achieving
87% success on complex workflows and leading OSWorld and WebArena benchmarks)
and Google's Project Mariner (scoring highly on ScreenSpot and WebVoyager and
introducing "Teach & Repeat" capabilities) signify a shift toward highly
capable, hybrid vision-and-semantic agents. Microsoft's UFO² ecosystem further
emphasizes this trend.

### Gap Analysis

The current BiModal Design framework (v3.0) does not fully account for:

1. **Teach & Repeat Workflows:** We lack explicit guidance on structuring UIs to
   be reliably learned by demonstration (stable IDs, explicit forms, clear ARIA
   labeling).
2. **Multi-Task Concurrency:** We need to consider that agents like Project
   Mariner can handle multiple tasks simultaneously, meaning global state
   reliance is an anti-pattern.
3. **GUI/Vision Fusion:** Pure HTML fallbacks are insufficient if the visual
   rendering doesn't align perfectly with the semantic tree for these hybrid
   agents.

### Proposed Changes

1. **Whitepaper Updates:** Added a section to `docs/whitepaper.md` discussing
   Operator, Project Mariner, and UFO², including their benchmark scores on
   WebArena, OSWorld, ScreenSpot, and WebVoyager.
2. **New Implementation Pattern:** Documented a pattern for "Demonstration
   Learning Optimization" focusing on stable identifiers and explicit
   boundaries.
3. **New Example:** Added `examples/operator-teach-and-repeat.html` to
   demonstrate this pattern.
4. **Update Citations:** Ensured the relevant projects and benchmarks are cited
   in `README.md` and `docs/whitepaper.md`.

Please review the associated PR and proposal document
`docs/proposals/011-operator-and-project-mariner.md` for the full details.
