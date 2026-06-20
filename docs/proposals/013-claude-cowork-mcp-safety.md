# Strategic Update Proposal: Claude Cowork, Local MCP, and Extensibility Safety

**Date:** June 2026 **Status:** Proposed Update to BiModal Design v3.0
Methodology **Author:** Strategic Research and Innovation Lead

## 1. Landscape Monitoring & Synthesis

Recent intelligence reveals key architectural evolutions regarding Agent safety
and capabilities on the desktop. Specifically:

1. **Claude Cowork Architecture:** Anthropic's "Claude Cowork" (a task mode
   within the Claude Desktop app launched in early 2026) demonstrates a
   fundamentally new approach to agent safety. Instead of running tools on the
   host machine with full access or sandbox isolation that severely limits
   utility, Cowork executes tasks inside a Virtual Machine (VM) while treating
   local Model Context Protocol (MCP) servers as the secure bridge.
2. **Local vs Remote MCP:** By treating local MCP servers as user-installed
   software (where admins decide which local MCPs to enable), Cowork scopes
   permission securely. Remote MCP servers are unaffected. This solves the "N×M"
   data integration problem securely.
3. **Parallel Sub-Agents:** Desktop agents decompose complex work into parallel
   workstreams, keeping each inspectable.

## 2. Gap Analysis

Comparing the current repository documentation against these industry trends
reveals the following gaps:

- **Desktop Agent Sandbox & MCP Trust:** Our framework (Layer 5) discusses MCP
  Discovery but doesn't explicitly address the "Virtual Machine + Local MCP"
  security boundary required for powerful, host-level agents.
- **Inspectable Parallel Workstreams:** BiModal Design lacks explicit guidance
  on how local tools and MCP endpoints should report status for parallel
  execution, which is crucial for the new generation of desktop agents like
  Claude Cowork.

## 3. Proposed Architectural Refinements & Content Updates

To maintain BiModal Design as the definitive standard, we propose the following
specific updates:

**1. Update Whitepaper Content:** Modify `docs/whitepaper.md` to incorporate the
Claude Cowork architecture, explaining the role of Local MCP servers in
establishing a security boundary for desktop-level agents, while differentiating
them from Remote MCP discovery.

**2. New Implementation Pattern:** Document a pattern for "Secure Desktop Agent
Execution via Local MCP", showing how to structure an MCP server to safely
expose local files or commands to a sandboxed agent.

**3. New Example:** Create `examples/claude-cowork-local-mcp.md` to provide a
concrete, standard-based example of configuring a local MCP server that respects
folder-scoped access.

**4. Update Citations:** Add references to Anthropic's Claude Cowork
architecture and its approach to local agent containment to the Research &
Citations sections in `README.md` and `docs/whitepaper.md`.
