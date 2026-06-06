# Strategic Update Proposal: Odysseys and Trajectory Efficiency

**Date:** June 2026 **Status:** Proposed Update to BiModal Design v3.0
Methodology **Author:** Strategic Research and Innovation Lead

## 1. Landscape Monitoring & Benchmark Synthesis

Recent intelligence from mid-2026 reveals a critical new benchmark for
evaluating AI agents: **Odysseys**. Unlike earlier benchmarks that focused on
single-site, short-term tasks, Odysseys ("Benchmarking Web Agents on Realistic
Long Horizon Tasks," arXiv:2604.24964) evaluates agents on multi-site,
long-horizon workflows derived from real user browsing data.

A critical finding from Odysseys is the inadequacy of binary pass/fail
evaluation for long-horizon settings. Even top frontier models only achieve a
44.5% success rate, leaving substantial room for improvement. Furthermore,
Odysseys introduces the **Trajectory Efficiency** metric. It highlights that
agents must not simply succeed _eventually_, but must succeed _efficiently_.
Current models achieve only 1.15% trajectory efficiency, meaning they take
significantly more steps than necessary, often wandering or failing due to the
compounded fragility of navigating complex, live DOMs over long periods.

## 2. Gap Analysis

Comparing the current repository documentation against the Odysseys benchmark
reveals the following gaps:

- **Missing "Long Horizon" Context:** Our Whitepaper currently treats agent
  tasks largely as discrete actions (e.g., extracting data or submitting a
  single form). It lacks explicit discussion of "long-horizon" and "multi-site"
  workflows where sustained context and efficient state transitions are
  critical.
- **Trajectory Efficiency:** We emphasize making the DOM accessible (Layer 2)
  and providing API alternatives (Layer 4/5), but we lack a structural pattern
  in Layer 2/3 designed specifically to maximize _Trajectory Efficiency_. We
  don't provide a way for agents to deterministically navigate multi-step
  workflows (like paginated results, checkout flows, or related content hubs)
  without falling back to visual parsing and clicking.

## 3. Proposed Architectural Refinements & Content Updates

To maintain BiModal Design as the definitive standard, we propose the following
updates:

**1. Update Whitepaper Content:** Modify `docs/whitepaper.md` to incorporate
insights from the Odysseys benchmark. Emphasize the importance of long-horizon
workflows and Trajectory Efficiency, explaining that efficient deterministic
navigation paths are required to reduce the compounded error rates of
long-running agents.

**2. Introduce Pattern 12:** Add "Pattern 12: Trajectory Efficiency via
Relational Navigation" to `docs/implementation-guide.md`. This pattern advocates
for utilizing standard HTML `<link>` relations (`rel="prev"`, `rel="next"`,
`rel="collection"`, `rel="alternate"`) to expose the logical connections between
pages. This allows agents to confidently map their trajectory and jump directly
to related states without brittle UI interaction.

**3. New Code Example:** Create `examples/odysseys-trajectory-efficiency.md`
providing a concrete implementation of Pattern 12 using `<link>` relations for a
multi-step flow.

**4. Update Citations:** Add Odysseys to the Research & Citations sections in
`README.md` and `docs/whitepaper.md`.

_These updates align perfectly with the framework's core ethos: utilizing
established web standards (HTML link relations) to improve agentic efficiency
and human-centered outcomes without custom attributes._
