You are the coordinator of an advisory council (Council) that performs a cross-cutting quality review of the gr-sw-maker framework.
Detect contradictions, inconsistencies, and omissions by combining delegation of mechanical checks to sub-agents with your own bird's-eye review.

---

## Phase 0: Translation Consistency Check (Gate)

Before entering the main review, verify translation consistency across all JA/EN pairs.
If discrepancies are detected, halt the review and ask the user for a decision.

### Target Pairs

| Category | Glob Pattern | Expected Pairs |
|----------|--------------|:--------------:|
| Process rules | `process-rules/*-ja.md` ↔ `*-en.md` | 10 |
| Agent definitions | `.claude/agents/*-ja.md` ↔ `*-en.md` | 21 |
| Project instruction template | `CLAUDE-ja.md` ↔ `CLAUDE-en.md` | 1 |
| Custom commands | `.claude/commands/*-ja.md` ↔ `*-en.md` | 5 |
| Essays | `essays/anms-essay-ja.md` ↔ `-en.md`, `essays/angs-essay-ja.md` ↔ `-en.md` | 2 |

### Check Criteria (per translate-framework §2 + §6)

**Structural checks:**
- [ ] T1: Do heading structures (h1-h4) match in count and order between JA and EN?
- [ ] T2: Do table row counts and column counts match?
- [ ] T3: Do Mermaid diagram node counts and arrow counts match?
- [ ] T4: Do numerical values in documents (agent count, file_type count, phase count, etc.) match between JA and EN?
- [ ] T5: Do link targets (references to `.md` files) match between JA and EN?

**English-fixed element checks:**
- [ ] T6: Are YAML frontmatter keys and `name` field values identical?
- [ ] T7: Are file_type names, phase names, S0-S6 section headings, and subsection headings untranslated (kept in English)?
- [ ] T8: Are field names, namespace prefixes, and HTML comments (FIELD annotations) identical?

**Terminology check:**
- [ ] T9: Are glossary terms used consistently across all files?

### Launch Method

`Agent tool` (subagent_type: "framework-translation-verifier", description: "Full JA-EN translation consistency gate")

> **Note:** Phase 0 runs in the foreground (NOT background). The result must be confirmed before proceeding to the next phase.

### Known Acceptable Differences

The following differences are intentional design choices and should NOT be reported as discrepancies:

- **spec-template table column count difference**: The JA version's section listing tables include an extra "日本語" (Japanese) column for bilingual comparison, making them one column wider than the EN version. This is by design

### Gate Decision

| Result | Next Action |
|--------|-------------|
| All pairs consistent | Proceed to Phase 1 |
| Discrepancies found | Record discrepancies in the report and **halt the review** to ask the user for a decision. Do not automatically determine which version (source or target) is correct (per translate-framework §6 "When Discrepancies Are Found") |

---

## Files Under Review (Phase 1 onwards)

If Phase 0 passes, JA and EN content is confirmed consistent. From this point, **only EN versions** are reviewed.

| # | Path | Content |
|:-:|------|---------|
| F01 | `CLAUDE-en.md` | Project instruction template |
| F02 | `process-rules/full-auto-dev-process-rules-en.md` | Process rules |
| F03 | `process-rules/full-auto-dev-document-rules-en.md` | Document management rules |
| F04 | `process-rules/agent-list-en.md` | Agent list (Single Source of Truth) |
| F05 | `process-rules/glossary-en.md` | Glossary |
| F06 | `process-rules/defect-taxonomy-en.md` | Defect taxonomy |
| F07 | `process-rules/review-standards-en.md` | Review standards (R1-R6) |
| F08 | `process-rules/prompt-structure-en.md` | Prompt structure conventions (S0-S6) |
| F09 | `process-rules/spec-template-en.md` | Specification template |
| F10 | `process-rules/porting-guide-en.md` | Porting guide |
| F11 | `.claude/agents/*-en.md` (21 files) | Agent definitions |
| F12 | `.claude/commands/*-en.md` | Custom commands |
| F13 | `essays/anms-essay-en.md` | ANMS essay |
| F14 | `essays/angs-essay-en.md` | ANGS essay |
| F15 | `user-order.md` | User requirement template |

> **Out of scope:** `essays/research/*.md` (research reports), `prompt/next-session-handoff.md` (working notes)

---

## Phase 1: Sub-agent Delegation

Launch the following 2 sub-agents **in parallel in the background using the Agent tool (run_in_background: true)**. Delegate mechanical and localized checks to preserve the main council's context.

**After launching both simultaneously, proceed to Phase 2 without waiting for completion.**

### Sub-agent A: Prompt Quality Checker

**Launch method:** `Agent tool` (description: "Prompt quality check for EN agents", run_in_background: true)

**Prompt (pass the following as-is):**

```
Perform a quality check on all 21 agent definition files (EN versions) in the gr-sw-maker framework.
No code needs to be written. Read and analyze only.

## Files to Read

1. process-rules/agent-list-en.md §1 (agent list table) and §2 (all ownership sections)
2. process-rules/prompt-structure-en.md (S0-S6 structure conventions)
3. .claude/agents/*-en.md all 21 files

## Check Items

- [ ] C1: Do all 21 agents comply with the S0-S6 structure? (All sections present: Activation/Ownership/Procedure/Rules/Exception, in correct order)
- [ ] C2: Does each agent's YAML frontmatter (name, description, tools, model) match the agent-list §1 table?
- [ ] C3: Are the file_type entries in each agent's Out table registered as owned by that agent in agent-list §2?
- [ ] C4: Do the file_type entries in each agent's In table exist in the providing agent's Out?
- [ ] C5: Do the Procedure steps form a logical sequence that satisfies Start Conditions → End Conditions?
- [ ] C6: Does the Exception table cover realistic abnormal cases?
- [ ] C7: Is the tools frontmatter consistent with the agent's responsibilities? (e.g., no Write for read-only agents)
- [ ] C8: Verify that process-improver does NOT have Write/Edit, and decree-writer DOES have Write/Edit
- [ ] C9: Do agents requiring kotodama-kun checks include terminology check steps in their Procedure? (Excluded: orchestrator, review-agent, change-manager, license-checker, framework-translation-verifier, decree-writer)

## Output Format

Record each check item result as PASS/FAIL. For FAIL items, list specific findings in the following format.
If all checks PASS, return "ALL PASS".

| # | Severity | Target Agent | Check Item | Finding | Fix Proposal |
|:-:|:--------:|--------------|:----------:|---------|-------------|

Severity definitions:
- Critical: Causes malfunction at runtime, such as data flow disruption or ownership duplication
- High: Contradiction exists but is avoidable
- Medium: Inconsistency with limited impact
- Low: Improvement recommended
```

### Sub-agent B: Terminology Mechanical Scan

**Launch method:** `Agent tool` (description: "Terminology mechanical scan on EN files", run_in_background: true)

**Prompt (pass the following as-is):**

```
Check mechanical terminology consistency across the entire gr-sw-maker framework.
No code needs to be written. Search and analyze using Grep/Glob/Read only.
Target EN version files primarily (use CLAUDE-en.md).

## Check Items

### C1: Agent Count Consistency
Count the actual rows in agent-list §1 table, then verify all files referencing agent count match that number.
Targets: CLAUDE-en.md, process-rules/*-en.md, essays/anms-essay-en.md, essays/angs-essay-en.md

### C2: file_type Name Consistency
Cross-check that file_type names in the file_type master table in process-rules/full-auto-dev-document-rules-en.md §7 exactly match those in the ownership sections of process-rules/agent-list-en.md §2.

### C3: Framework Name Usage
Search all files for the following:
- Does "claude-code-full-auto-dev" (old repo name) still remain? → Critical if found
- Is "gr-sw-maker" used in the context of tool name/repo name/package name?
- Is "full-auto-dev" used in the context of methodology name?
Targets: all .md files

### C4: Phase Name Consistency
Verify that the 8 phase names in process-rules/full-auto-dev-process-rules-en.md §2 (setup, planning, dependency-selection, design, implementation, testing, delivery, operation) match the activation map in process-rules/agent-list-en.md §4.

### C5: file_type Count Consistency
Count the actual rows in full-auto-dev-document-rules §7 file_type master table, then verify all files referencing file_type count match that number.

## Output Format

| # | Severity | Check Item | Finding | Fix Proposal |
|:-:|:--------:|:----------:|---------|-------------|

If all checks PASS, return "ALL PASS".

Severity definitions:
- Critical: Old repo name remains, file_type missing
- High: Numerical mismatch
- Medium: Minor expression differences
- Low: Notation inconsistencies
```

---

## Phase 2: Main Council Review

Begin reading and reviewing the following core rule files (EN versions) without waiting for sub-agent completion:
**F01, F02, F03, F04, F05, F06, F07, F09, F10, F12, F15**

> F08 (prompt structure conventions) and F11 (agent definitions) have been delegated to Sub-agent A.
> F13-F14 (essays) were verified for translation consistency in Phase 0. Read only if content review is needed.
> However, if verifying the F04 §3 data flow diagram requires referencing F11 In/Out, read only the necessary agent definitions.

The following 4 experts conduct a review from a bird's-eye perspective.

### Expert 1: Process Engineering

**Perspective:** SDLC phase transitions, quality gates, approval flow consistency

**Verification items:**
- [ ] Are the transition conditions for the 8 phases (setup→operation) free of contradictions within F02?
- [ ] Do the quality gate (R1-R6) application phases match between F02 and F07?
- [ ] Do the escalation criteria (risk≧6, cost 80%, impact_level=high) match between F02 and F01?
- [ ] Is the change management flow (F02 §3.2) description consistent?
- [ ] Is the defect state transition (F02 stateDiagram) defined?
- [ ] Is the retrospective cycle (process-improver → orchestrator → decree-writer) 3-step flow described consistently in F02 and F04?
- [ ] Do the conditional processes (13 items) match between F01 and F02?

### Expert 2: Agent Architecture

**Perspective:** SRP (Single Responsibility Principle), data flow, ownership, inter-agent dependencies

**Verification items:**
- [ ] Is there no duplication in file_type ownership across agents? (Cross-check all sections of F04 §2)
- [ ] Do the arrows in the F04 §3 data flow diagrams (main diagram + DocWriter diagrams + kotodama-kun diagram) align with the corresponding agents' In/Out?
- [ ] Is the F02 §1.2 overall architecture diagram (group-level overview) consistent with F04 §3 (detailed diagrams)?
- [ ] Are the input/output patterns of agents that do not own file_types (kotodama-kun, framework-translation-verifier, decree-writer) consistent?
- [ ] Are decree-writer's safety checks (SR1-SR6) aligned with the improvement cycle in F02 §3.3.3?
- [ ] Does decree-writer's approval table (CLAUDE.md=user, agents=orchestrator, process-rules=user) match across related files?

### Expert 3: Terminology & Document Structure

**Perspective:** Contextual consistency of terminology, compliance with Common Block / Form Block / Detail Block structure conventions

**Verification items (Terminology):**
- [ ] Are the key terms from the F05 glossary used in the correct context in F02/F03/F06/F07?
- [ ] Is the causal chain in the F06 defect taxonomy (error→fault→failure→defect/incident/hazard) consistent with F05?
- [ ] Are the F05 §4 "Confusable pair distinctions" upheld in the rule files? (fault vs defect, failure vs incident, etc.)

**Verification items (Document Structure):**
- [ ] Are the Form Block fields for all file_types defined in F03 §9 reasonable? (Field name, type, and constraint consistency)
- [ ] Do all entries in the F03 §7 file_type table exist in F04 §2 with an assigned owner?
- [ ] Does the owner column in the F03 §7.1 workflow reference table match triply with F04 §2 and F03 §11?
- [ ] Is the F03 §12 multilingual rule (primary language = no suffix) aligned with the language selection procedure in F10?
- [ ] Is decree-writer's "delegated write permission" annotation (F03 §11) consistent?

### Expert 4: Diagram & Table Cross-check

**Perspective:** Cross-checking Mermaid diagrams and tables across core rule files

**Cross-check targets (mandatory):**

| # | Comparison Pair | Verification Perspective |
|:-:|-----------------|------------------------|
| X01 | F04 §3 Data flow diagram ↔ F02 §1.2 Overall architecture diagram | Group-level consistency (F02 is overview, F04 is detailed) |
| X03 | F04 §2 Ownership ↔ F03 §7.1 Workflow reference table | file_type owner match |
| X04 | F04 §2 Ownership ↔ F03 §11 Ownership model | Same as above |
| X05 | F04 §4 Activation map ↔ F02 §2 Phase definitions | Phase names, launched agents consistency |
| X06 | F04 §3 Data flow diagram ↔ F11 Each agent's In/Out | file_type flow consistency (read only necessary agent definitions) |
| X08 | F05 Glossary ↔ F06 Defect taxonomy | No contradictions in term definitions |
| X09 | F02 §3.3 Quality management ↔ F07 Review standards R1-R6 | Perspective and target phase consistency |
| X10 | F01 CLAUDE.md Agent Teams ↔ F04 §1 Agent list | Agent count, names, roles match |
| X11 | F10 Porting guide model mapping ↔ F04 §1 model column | Model assignment match |
| X16 | F02 Appendix A Sequence diagram ↔ F04 §3 Data flow diagram | Participant and message consistency |
| X18 | F02 §5.5 Recommended structure ↔ Actual file structure | File name match |

**Additional verification:**
- [ ] Are there no syntax errors in any Mermaid diagrams? (Undefined node references, style target mismatches, etc.)
- [ ] The council shall add any cross-check pairs deemed necessary

---

## Phase 3: Integrated Judgment

### 3.1 Integration of Sub-agent Results

Receive results from the 2 sub-agents (A: Prompt quality, B: Terminology mechanical scan) and integrate them with Phase 2 findings.

### 3.2 Findings List

Consolidate all findings in the following format:

| # | Severity | Discoverer | Target File | Finding | Fix Proposal |
|:-:|:--------:|------------|-------------|---------|-------------|
| 1 | Critical | Expert N / Sub-agent X | F0X | ... | ... |

**Severity definitions:**
- **Critical**: Contradiction causes malfunction at runtime (data flow disruption, ownership duplication, etc.)
- **High**: Contradiction exists but is avoidable (numerical mismatch, missing label, etc.)
- **Medium**: Inconsistency with limited impact (expression variation, minor description omission, etc.)
- **Low**: Improvement recommended (readability, redundant description, etc.)

### 3.3 Overall Judgment

| Judgment | Condition |
|----------|-----------|
| **PASS** | Critical = 0 and High = 0 |
| **CONDITIONAL PASS** | Critical = 0 and High ≦ 3 |
| **FAIL** | Critical ≧ 1 or High ≧ 4 |

---

## Output

Output the review results to `project-records/reviews/council-review-{today's date}.md`.

Output in MCBSMD format (single Markdown enclosed in sextuple backticks).

Output structure:
1. Phase 0 results (translation consistency check summary)
2. Sub-agent results summary (A/B results)
3. Main council review results (Expert 1-4 results)
4. Cross-check results (X01-X18 each PASS/FAIL)
5. Consolidated findings list
6. Overall judgment
