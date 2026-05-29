# Strategic Update Proposal: VisualWebArena, ST-WebAgentBench, and MCP Discovery

**Date:** March 2026 **Status:** Proposed Update to BiModal Design v3.0
Methodology **Author:** Strategic Research and Innovation Lead

## 1. Landscape Monitoring & Benchmark Synthesis

Recent advancements in the AI agent evaluation ecosystem have shifted the
goalposts for what constitutes "accessible" for AI. Two critical developments
necessitate an update to the BiModal Design framework:

1.  **VisualWebArena Benchmark:** VisualWebArena expands upon earlier frameworks
    by explicitly evaluating vision-language models on web-based tasks. It
    emphasizes that while vision is powerful, lack of strong textual and
    structural grounding leads to high failure rates in complex interfaces. Pure
    visual reasoning must be supported by structural context.
2.  **ST-WebAgentBench:** This benchmark highlights the critical importance of
    safety and trustworthiness in web agents. It underscores that we must
    defensively design forms and actions to constrain agent behavior and prevent
    destructive actions (e.g., accidental form submissions or data deletion).
3.  **MCP (Model Context Protocol) Maturation:** The industry is moving towards
    standardized discovery of agent protocols. Relying solely on out-of-band
    communication for MCP servers is insufficient; websites should announce
    their agent capabilities directly in the DOM.

## 2. Gap Analysis

Comparing the current repository documentation against these industry trends
reveals the following gaps:

- **Missing Standardized MCP Discovery:** We currently suggest implementing an
  MCP server (Layer 5) but do not provide a standard mechanism for an agent
  browsing the web (Level 2 or 3) to discover that an MCP server exists.
- **Safety Constraints in Tool Use:** While we discuss Layer 4 (APIs) and Layer
  5 (Protocols), we lack defensive UI patterns (in Layer 2) that leverage
  standard HTML5 validation to constrain agent behavior proactively.
- **VisualWebArena Insights:** The Whitepaper does not sufficiently integrate
  the findings from VisualWebArena regarding vision-language grounding, which
  further reinforces the necessity of Layer 2 (Semantic Structure).

## 3. Proposed Architectural Refinements & Content Updates

To maintain BiModal Design as the definitive standard, we propose the following
specific updates:

**1. Standardized MCP Discovery:** Update `README.md` and
`docs/implementation-guide.md` to introduce the usage of
`<link rel="alternate" type="application/mcp+json" href="...">` in the HTML
`<head>`. This elegantly bridges Layer 2 (Semantic Structure) and Layer 5 (Agent
Protocols) by making protocols discoverable natively.

**2. Introduce Safety Constraints:** Add a pattern to
`docs/implementation-guide.md` demonstrating how to use HTML5 constraints
(`required`, `pattern`, `min`, `max`) as defensive mechanisms to guide tool-use
and computer-use agents safely, mitigating risks identified by ST-WebAgentBench.

**3. New Example:** Create `examples/mcp-discovery-and-safety.md` demonstrating
these new capabilities in a concrete scenario.

**4. Whitepaper Updates:** Modify `docs/whitepaper.md` to include insights from
VisualWebArena and ST-WebAgentBench, and to formalize MCP web discovery.

_These updates adhere strictly to the framework's core ethos: utilizing
established web standards to ensure graceful degradation and robust agent
interactions._
