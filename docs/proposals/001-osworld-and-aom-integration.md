# Strategic Update Proposal: OSWorld, WebArena-Verified, and the AOM

**Date:** March 2026 **Status:** Proposed Update to BiModal Design v3.0
Methodology **Author:** Strategic Research and Innovation Lead

## 1. Landscape Monitoring & Benchmark Synthesis

Recent advancements in the AI agent evaluation ecosystem have shifted the
goalposts for what constitutes "accessible" for AI. Two critical developments
necessitate an update to the BiModal Design framework:

1.  **OSWorld Benchmark:** The emergence of OSWorld highlights a shift towards
    OS-level "Computer-Use" agents. These agents do not merely interact with the
    web via HTTP or browser APIs; they interact with the entire operating system
    interface using a combination of vision and OS-level accessibility trees
    (like the Accessibility Object Model - AOM).
2.  **WebArena-Verified:** The publication of WebArena-Verified has exposed
    systematic evaluation errors in earlier benchmarks, underscoring the need
    for more robust, rigorous testing of agent capabilities and highlighting the
    unreliability of pure vision-based interaction without structural fallbacks.

## 2. Gap Analysis

Comparing the current repository documentation against these industry trends
reveals the following gaps:

- **Level 3 Definition:** The current definition of "Level 3 — Vision Agents"
  focuses almost exclusively on visual interaction (screenshots and vision
  models). It neglects the fact that state-of-the-art Computer-Use agents (like
  Anthropic's Claude Computer Use) heavily rely on the OS-level accessibility
  tree (AOM) as a primary data source, falling back to pure vision only when the
  AOM fails or is incomplete.
- **Layer 2 Emphasis:** "Layer 2: Semantic Structure" currently emphasizes HTML5
  landmarks and ARIA primarily for "Browser Automation" (Level 2). We must
  explicitly document that Layer 2 is critical because it populates the AOM,
  making it the bedrock for reliable Level 3 (Computer-Use) agent interaction.
- **Missing Defensive Strategies:** We lack specific implementation patterns
  optimized for OS-level agents, such as explicit focus management,
  comprehensive `aria-keyshortcuts` for keyboard-driven agents, and
  `aria-roledescription` for complex custom components.

## 3. Proposed Architectural Refinements & Content Updates

To maintain BiModal Design as the definitive standard, we propose the following
specific updates:

**1. Expand "Level 3":** Broaden "Level 3 — Vision Agents" to "Level 3 — Vision
& Computer-Use Agents" across all documentation. Emphasize their dual reliance
on vision and the Accessibility Object Model (AOM).

**2. Elevate Layer 2's Purpose:** Update `docs/whitepaper.md` to explicitly
state that Layer 2 (Semantic Structure) is responsible for populating the AOM.
This reinforces the "Defense in Depth" philosophy: well-structured ARIA provides
high-fidelity, reliable interaction targets for OS agents, bypassing the
unreliability of pure vision models exposed by WebArena-Verified.

**3. New Code Patterns in Implementation Guide:** Add specific patterns to
`docs/implementation-guide.md` focusing on:

- **Focus Management:** Explicitly moving focus to support keyboard-navigating
  agents.
- **Agent-Optimized ARIA:** Emphasizing `aria-keyshortcuts` (since OS agents
  often prefer keyboard shortcuts over precise pointer clicks) and
  `aria-roledescription`.

**4. New Example:** Create `examples/os-agent-optimization.md` demonstrating
these principles in a concrete scenario.

_These updates adhere strictly to the framework's core ethos: utilizing
established web standards (W3C AOM, ARIA) to ensure graceful degradation,
without relying on custom or proprietary attributes._
