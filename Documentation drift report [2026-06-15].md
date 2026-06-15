# Documentation drift report [2026-06-15]

## README.md vs docs/whitepaper.md

### 1. Key Research Findings

- **File**: `README.md`
- **Line Numbers**: 118-120
- **Quote**:
  ```markdown
  - **12-20% baseline success** for HTTP Retrievers on conventional CSR sites,
    improving to **42-65%** with Layer 1 compliance and **60-75%** with full
    Layer 1-3 implementation.
  - **35-50% baseline success** for Browser Automation agents on conventional
    UI, improving to **55-72%** with semantic structure and up to **75-88%**
    with structured data.
  ```
- **File**: `docs/whitepaper.md`
- **Line Numbers**: 524-526
- **Quote**:
  ```markdown
  | Level 0 (HTTP Retrievers) | 12-20% | 42-65% | 60-75% | | Level 1 (LLM
  Browsers) | 25-35% | 50-70% | 70-85% | | Level 2 (Browser Automation) | 35-50%
  | 55-72% | 75-88% |
  ```
- **Label**: [VARIATION]
- **Notes**: The README consolidates the table into bullet points and omits
  Level 1, but the numbers shown match the whitepaper exactly.

### 2. Foundational Requirements Definitions

- **File**: `README.md`
- **Line Numbers**: 186-187
- **Quote**:

  ```markdown
  ### FR-1: Initial Payload Accessibility

  The foundational requirement: critical content must exist in the initial HTTP
  response. This is Layer 1 of defense in depth — the floor, not the ceiling.
  ```

- **File**: `docs/whitepaper.md`
- **Line Numbers**: 2109-2111
- **Quote**:
  ```markdown
  **FR-1 (Foundational Requirement 1)**: Initial Payload Accessibility — the
  requirement that critical content exists in the initial HTTP response from the
  server. Layer 1 of the defense-in-depth model.
  ```
- **Label**: [VARIATION]
- **Notes**: The definitions are functionally identical with slight phrasing
  differences.

### 3. Framework Maturity Levels

- **File**: `README.md`
- **Line Numbers**: 296-304
- **Quote**:
  ```markdown
  | Level | Name                    | Layers     | Agent Coverage | Success Rate |
  | ----- | ----------------------- | ---------- | -------------- | ------------ |
  | 0     | Infrastructure Ready    | Layer 1    | Level 0-1      | 40-65%       |
  | 1     | Semantically Accessible | Layers 1-2 | Level 0-2      | 55-75%       |
  | 2     | Data-Rich               | Layers 1-3 | Level 0-3      | 65-85%       |
  | 3     | API-Enabled             | Layers 1-4 | Level 0-4      | 80-92%       |
  | 4     | Agent-Native            | Layers 1-5 | All levels     | 90-98%       |
  ```
- **File**: `docs/whitepaper.md`
- **Line Numbers**: 1421-1428
- **Quote**:
  ```markdown
  | **Level** | **Name**                    | **Layers Implemented** | **Agent Coverage** | **Typical Success Rate** |
  | --------- | --------------------------- | ---------------------- | ------------------ | ------------------------ |
  | 0         | **Infrastructure Ready**    | Layer 1                | Level 0-1 agents   | 40-65%                   |
  | 1         | **Semantically Accessible** | Layers 1-2             | Level 0-2 agents   | 55-75%                   |
  | 2         | **Data-Rich**               | Layers 1-3             | Level 0-3 agents   | 65-85%                   |
  | 3         | **API-Enabled**             | Layers 1-4             | Level 0-4 agents   | 80-92%                   |
  | 4         | **Agent-Native**            | Layers 1-5             | All agent levels   | 90-98%                   |
  ```
- **Label**: [VARIATION]
- **Notes**: Minor differences in column header names and formatting ("Layers"
  vs "Layers Implemented"), but no substantive content drift.

### 4. Citations

- **File**: `README.md`
- **Line Numbers**: 331-332
- **Quote**:
  ```markdown
  - **WebAgents Survey 2025** — "A Survey of WebAgents: Towards Next-Generation
    AI Agents for Web Automation" (arXiv:2503.23350v4)
  ```
- **File**: `docs/whitepaper.md`
- **Line Numbers**: 2145-2146
- **Quote**:
  ```markdown
  1. **WebAgents Survey 2025**: "A Survey of WebAgents: Towards Next-Generation
     AI Agents for Web Automation with Large Foundation Models" —
     arXiv:2503.23350v4
  ```
- **Label**: [VARIATION]
- **Notes**: The README slightly abbreviates the paper title, but the arXiv IDs
  and core references match perfectly.

### 5. Quick Start Commands

- **File**: `README.md`
- **Line Numbers**: 134
- **Quote**:
  ```bash
  curl -s https://your-site.com | grep -E '<(main|nav|h1|article)'
  ```
- **File**: `docs/whitepaper.md`
- **Line Numbers**: 469
- **Quote**:
  ```bash
  curl -s https://yoursite.com | grep -E '<(main|nav|header|footer|article|section)'
  ```
- **Label**: [DRIFT]
- **Notes**: The README checks for `h1` but misses `header`, `footer`, and
  `section`, which could result in inconsistent manual FR-1 validation.

## README.md vs tools/validators/fr1-checker.js

### 1. FR-1 Checker Scope (Image Alt Text)

- **File**: `README.md`
- **Line Numbers**: 193-195
- **Quote**:
  ```markdown
  - **`fr1-checker.js`** — comprehensive audit covering semantic content,
    navigation accessibility, form labels, heading hierarchy, ARIA landmarks,
    image alt text, and agent-specific features.
  ```
- **File**: `tools/validators/fr1-checker.js`
- **Line Numbers**: 59-65
- **Quote**:

  ```javascript
  // Test 1: Basic HTML structure
  this.checkBasicStructure(document, analysis);

  // Test 2: Semantic content
  this.checkSemanticContent(document, analysis);

  // Test 3: Navigation accessibility
  this.checkNavigation(document, analysis);

  // Test 4: Form accessibility
  this.checkForms(document, analysis);

  // Test 5: Content meaningfulness
  this.checkContentMeaning(document, analysis);

  // Test 6: Agent-specific features
  this.checkAgentFeatures(document, analysis);
  ```

- **Label**: [DRIFT]
- **Notes**: The README claims `fr1-checker.js` validates "image alt text", but
  the underlying implementation has no image-specific checks within its methods.

## README.md vs docs/implementation-guide.md

### 1. Quick Start Commands

- **File**: `README.md`
- **Line Numbers**: 134
- **Quote**:
  ```bash
  curl -s https://your-site.com | grep -E '<(main|nav|h1|article)'
  ```
- **File**: `docs/implementation-guide.md`
- **Line Numbers**: 135
- **Quote**:
  ```bash
  curl -s https://your-app.com/ | grep -E '<(nav|main|h1|form)'
  ```
- **Label**: [DRIFT]
- **Notes**: Discrepancy in the semantic tags being checked. README uses
  `article` while the Implementation Guide checks for `form`.

## README.md vs AGENTS.md

### 1. Framework Definitions

- **File**: `README.md`
- **Line Numbers**: 5-6
- **Quote**:
  ```markdown
  > **A design framework for building interfaces that work across the full AI
  > agent capability spectrum — from HTTP retrievers to protocol-native
  > agents.**
  ```
- **File**: `AGENTS.md`
- **Line Numbers**: 4-5
- **Quote**:
  ```markdown
  This file helps AI agents understand how to contribute to BiModal Design, a
  framework for building interfaces that work across the full AI agent
  capability spectrum.
  ```
- **Label**: [VARIATION]
- **Notes**: Both correctly and consistently describe the scope across the AI
  capability spectrum.
