# Strategic Update Proposal: Open-Source Frameworks & Benchmark Tracking 2026

**Date:** June 2026 **Status:** Proposed Update to BiModal Design v3.0
Methodology **Author:** Strategic Research and Innovation Lead

## 1. Landscape Monitoring & Benchmark Synthesis

Recent intelligence reveals rapid growth in open-source developer frameworks for
web agents. According to AIMultiple and Firecrawl benchmarks (2026), the top
open-source agents evaluated on the WebVoyager benchmark (which measures
multi-step web tasks across dynamic sites) report the following accuracy scores:

- **Browser-Use:** 89.1%
- **Skyvern 2.0:** 85.85%
- **Agent-E:** 73.1%

Developer frameworks are bifurcating: DOM-first architectures (like Browser-Use)
and vision-first or hybrid approaches (like Skyvern). These frameworks are
increasingly deployed via managed infrastructure (like Browserbase, Steel, and
Firecrawl) to handle dynamic web elements and complex web execution tasks.

## 2. Gap Analysis

The current repository documentation does not adequately reflect these newer
benchmarks and the specific frameworks dominating developer adoption in
mid-2026.

- **Benchmark Update needed:** WebVoyager's new baseline needs tracking,
  demonstrating that high-performing DOM agents (Browser-Use) require strong
  Layer 1 and Layer 2 foundations to parse the page reliably.
- **Form Automation and dynamic workflows:** Tools like Skyvern lead in
  form-heavy workflows, requiring clear semantic boundaries and robust ARIA
  state management.

## 3. Proposed Architectural Refinements & Content Updates

To maintain BiModal Design as the definitive standard, we propose the following
specific updates:

**1. Update Whitepaper Content:** Modify `docs/whitepaper.md` to incorporate the
newest benchmarks and tools. Mention Browser-Use (89.1% WebVoyager), Skyvern 2.0
(85.85% WebVoyager), and Agent-E (73.1%), updating the benchmarks to reflect the
2026 state of the art.

**2. Introduce Pattern for Open-Source Agent Forms:** Create a new code
integration pattern specifically outlining how to design multi-step forms
optimized for frameworks like Skyvern and Browser-Use that rely heavily on DOM
parsing. This relies heavily on AOM and standard attributes without falling back
on custom `data-agent-*` properties.

**3. New Code Example:** Create `examples/browser-framework-forms.html`
demonstrating a complex, multi-step form optimized for high-performance
open-source agents using native web standards.

**4. Update Citations:** Add `Browser-Use`, `Skyvern`, `Agent-E`, and update the
`WebVoyager` benchmark in the Research & Citations sections in `README.md` and
`docs/whitepaper.md`.

_These updates adhere strictly to the framework's core ethos: utilizing
established web standards to support advanced agent capabilities efficiently,
reducing computational overhead without relying on custom, non-standard
attributes._
