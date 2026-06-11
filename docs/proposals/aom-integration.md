# Strategic Proposal: Accessibility Object Model (AOM) Integration for Web Components

## Overview

As the BiModal Design framework evolves, it is crucial to stay aligned with web
standards and emerging agent capabilities. This proposal outlines the
integration of the Accessibility Object Model (AOM), specifically the
`ElementInternals` API, to natively expose semantics, roles, and states for Web
Components. This transition will reduce reliance on custom `data-agent-*`
attributes, adhering to our standards-first ethos and significantly improving
the reliability of autonomous web agents, particularly Level 2 (Browser
Automation) and Level 3 (Vision & Computer-Use Agents).

## Context and Benchmarks

Recent evaluations of multimodal agents on visually grounded tasks, such as
those conducted in **VisualWebArena** and **WebArena**, demonstrate that agents
heavily rely on the underlying DOM and accessibility trees to comprehend and
interact with web interfaces. While visual reasoning is improving, pure visual
navigation remains brittle. Agents perform with significantly higher reliability
when interfaces provide well-structured Layer 2 (Semantic Structure) data.

Currently, BiModal Design relies on standard HTML/ARIA where possible,
supplementing with `data-agent-*` attributes. However, for encapsulating logic
inside Custom Elements (Web Components), using `ElementInternals` allows authors
to directly attach default accessibility semantics to the element's AOM without
cluttering the light DOM with custom attributes.

## Proposed Changes

### 1. Adopt `ElementInternals` for Custom Elements

We propose that all custom elements built within the BiModal framework utilize
the `attachInternals()` method. By using the `ElementInternals` interface,
components can define their implicit roles, accessible names, and ARIA states
directly in the AOM.

### 2. Deprecate `data-agent-*` for Native Roles/States in Web Components

Where `ElementInternals` can natively define `ariaExpanded`, `ariaPressed`,
`role`, and other accessibility properties, we should avoid the use of custom
`data-agent-*` properties that duplicate this functionality. This ensures that
assistive technologies (for humans) and autonomous agents (Levels 2 and 3) read
from a single, standard source of truth: the computed accessibility tree.

### 3. Updates to the Five Architectural Layers

This integration strengthens **Layer 2 (Semantic Structure)**. By natively
populating the AOM, we ensure that Level 2 and Level 3 agents—which often query
the accessibility tree directly—receive the most accurate and up-to-date state
representation without needing custom parsers for `data-agent-*` attributes.

## Rationale

- **Standards-Based:** Aligns with the core ethos of BiModal Design by
  leveraging standard browser APIs.
- **Improved Reliability:** Reduces the risk of agent failure due to visual
  interpretation errors, as highlighted by VisualWebArena. Agents can
  deterministically query the AOM.
- **Maintainability:** Encapsulates accessibility logic within the component,
  preventing light DOM attribute synchronization issues.
