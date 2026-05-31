# Strategic Update Proposal: MCP Async Tasks and Temporal Efficiency (OSWorld-Human)

**Date:** May 2026 **Status:** Proposed Update to BiModal Design v3.0
Methodology **Author:** Strategic Research and Innovation Lead

## 1. Landscape Monitoring & Benchmark Synthesis

Recent advancements in the AI agent evaluation ecosystem have shifted focus from
sheer capability to execution efficiency and long-running workflows. Two
critical developments necessitate an update to the BiModal Design framework:

1. **MCP November 2025 Specification - Async Tasks:** The Model Context Protocol
   (MCP) introduced a major paradigm shift with the `Tasks` primitive. This
   enables MCP servers to handle asynchronous, long-running operations, allowing
   agents to launch workflows, check progress, and retrieve results later,
   breaking the limitation of synchronous real-time RPC calls.
2. **OSWorld-Human Benchmark:** Recent temporal performance studies
   (OSWorld-Human) reveal that computer-use agents suffer from extreme
   end-to-end latency. Top-performing agents take 1.4x to 2.7x more steps than
   humans, with large model calls for planning dominating latency.

## 2. Gap Analysis

Comparing the current repository documentation against these industry trends
reveals the following gaps:

- **Missing Async Protocol Patterns:** Layer 5 (Agent Protocols) in our current
  Whitepaper and Implementation Guide only documents synchronous Tools,
  Resources, and Prompts. It lacks guidance on exposing and managing
  long-running `Tasks` via MCP, which is critical for scalable agentic
  deployments.
- **Agent Efficiency & Latency:** Our Defense in Depth strategy focuses on
  making elements _accessible_ but doesn't optimize for _temporal efficiency_.
  Agents forced to navigate granular UI steps (e.g., clicking 5 different
  filters) suffer compounded latency. We lack a "Macro Action" pattern (using
  schema.org `Action` or MCP) to allow agents to bypass granular UI interactions
  and execute composite workflows in a single step, addressing the
  inefficiencies highlighted by OSWorld-Human.

## 3. Proposed Architectural Refinements & Content Updates

To maintain BiModal Design as the definitive standard, we propose the following
specific updates:

**1. Expand Layer 5 Capabilities (Whitepaper):** Update `docs/whitepaper.md`
Section 8.2 to explicitly include the `Tasks` primitive in MCP, highlighting its
role in asynchronous and long-running agent workflows.

**2. Address Agent Efficiency (Whitepaper):** Update `docs/whitepaper.md`
Section 5 to include insights from OSWorld-Human regarding temporal latency, and
add a principle in Section 9 emphasizing "Macro Actions" for efficiency.

**3. New Code Pattern (Implementation Guide):** Add Pattern 10 in
`docs/implementation-guide.md` demonstrating how to expose an asynchronous MCP
Task, allowing agents to offload long-running operations.

**4. New Example:** Create `examples/mcp-async-tasks.md` demonstrating the new
MCP Tasks capability and how agents can interact with long-running operations
efficiently.

_These updates align with the framework's core ethos of a standards-based
approach, leveraging the latest MCP specifications and benchmark data to improve
human-centered and agentic outcomes without custom attributes._
