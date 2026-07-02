# Strategic Update Proposal: OSWorld 2.0 and Long-Horizon State Persistence

**Date:** June 2026 **Status:** Proposed Update to BiModal Design v3.0
Methodology **Author:** Strategic Research and Innovation Lead

## 1. Landscape Monitoring & Benchmark Synthesis

Recent intelligence from mid-2026 highlights a significant leap in the
evaluation of computer-use agents with the release of the **OSWorld 2.0**
benchmark ("Benchmarking Computer Use Agents on Long-Horizon Real-World Tasks,"
arXiv:2606.29537).

Unlike its predecessor or other benchmarks focusing on isolated, short tasks,
OSWorld 2.0 evaluates agents on extremely complex, long-horizon workflows. A
typical task takes human users ~1.6 hours and requires over 318 tool calls from
frontier agents (compared to ~30 in OSWorld 1.0).

Critical findings from OSWorld 2.0 include:

1. **Low Success Rates on Long-Horizon Tasks**: Even the most advanced models
   (e.g., Claude Opus 4.8) achieve only a ~20.6% completion rate.
2. **Constraint Amnesia**: Agents routinely "lose track of constraints" over
   long sessions.
3. **Hidden State Failures**: Agents struggle most when tasks hinge on "hidden
   state they must recover," failing to infer or recall information that arrived
   mid-task.
4. **Verification Skipping**: Agents often skip verification steps, guessing
   rather than confirming state.

## 2. Gap Analysis

Comparing current BiModal Design documentation against the OSWorld 2.0 benchmark
reveals the following gaps:

- **Lack of Long-Horizon State Persistence**: Our framework excels at making
  current, immediate DOM nodes accessible (Layer 2) and providing structural
  flow (Layer 3). However, we lack explicit guidance on how to persist and
  expose _accumulated workflow state_ and _constraints_ to an agent whose
  context window is continuously shifting over hundreds of steps.
- **Mid-Task Information Vulnerability**: When alerts or dynamic data arrive
  mid-task and then disappear or get buried in deep UI hierarchies, agents lose
  access to them. We need a pattern to ensure this critical data remains
  semantically anchored.

## 3. Proposed Architectural Refinements & Content Updates

To address the limitations exposed by OSWorld 2.0 and maintain BiModal Design as
the definitive standard, we propose the following updates:

**1. Update Whitepaper Content:** Modify `docs/whitepaper.md` to incorporate
insights from the OSWorld 2.0 benchmark. Emphasize that while Layer 2 and 3
solve immediate navigation, long-horizon tasks require persistent state
exposure. Discuss how agents lose track of constraints and hidden states.

**2. Introduce Pattern for State Exposure:** Create a new code integration
pattern in `docs/implementation-guide.md` specifically addressing "Long-Horizon
State Exposure". This pattern will demonstrate how to use semantic HTML like
`<aside>`, `<output>`, and ARIA attributes like `aria-live` to persistently
expose task state, constraints, and historical actions in a way that remains
visible to the agent's context model, even when not visually prominent to the
human user.

**3. New Code Example:** Create `examples/osworld2-state-exposure.html` to
provide a concrete, copy-pasteable example of this new pattern, modeling a
complex workflow where constraints and state are explicitly persisted.

**4. Update Citations:** Add OSWorld 2.0 to the Research & Citations sections in
`README.md` and `docs/whitepaper.md`.

_These updates adhere strictly to the framework's core ethos: utilizing
established web standards to support advanced agent capabilities efficiently,
reducing failure rates without relying on custom, non-standard attributes._
