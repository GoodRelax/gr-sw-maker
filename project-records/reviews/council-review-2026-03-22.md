``````markdown
# Council Review Report — 2026-03-22

## 1. Phase 0: Translation Consistency Check

**Verifier:** framework-translation-verifier (foreground)

| Category | Pairs | PASS | FAIL |
|----------|------:|-----:|-----:|
| Process rules | 10 | 9 | 1 |
| Agent definitions | 21 | 21 | 0 |
| Project instruction template | 1 | 1 | 0 |
| Custom commands | 5 | 4 | 1 |
| Essays | 2 | 2 | 0 |
| **Total** | **39** | **37** | **2** |

**FAIL details:** Both FAILs were content accuracy issues (stale numbers) identical in JA and EN — not translation mismatches. Treated as content issues for Phase 2.

- F-01 (Medium): porting-guide ja/en — "18 files x 2 languages" and "3 files x 2 languages" (stale)
- F-02 (Low): council-review ja/en — Sub-agent A description "18 EN agents" vs prompt body "21"

**Gate decision:** PASS (proceed to Phase 1)

---

## 2. Sub-agent Results

### Sub-agent A: Prompt Quality Check (21 EN Agents)

| Check | Result |
|-------|--------|
| C1: S0-S6 structure compliance | PASS |
| C2: YAML frontmatter vs agent-list §1 | PASS |
| C3: Out file_type vs ownership | PASS |
| C4: In file_type vs provider Out | PASS |
| C5: Procedure logic | PASS |
| C6: Exception table coverage | PASS |
| C7: tools vs responsibilities | **FAIL** (1 finding) |
| C8: process-improver/decree-writer constraints | PASS |
| C9: kotodama-kun check in Procedure | **FAIL** (1 finding) |

**Findings:**

| # | Severity | Agent | Check | Finding | Status |
|:-:|:--------:|-------|:-----:|---------|--------|
| A1 | Critical | feedback-classifier | C7 | tools = Read/Glob/Grep only, but Procedure requires Write/Edit to append classification results to field-issue tickets | **Fixed** — added Write/Edit to tools |
| A2 | Medium | field-test-engineer | C9 | No kotodama-kun check in Procedure. field-issue tickets are rapid-fire field testing records | **Fixed** — added to kotodama-kun exclusion list |

### Sub-agent B: Terminology Mechanical Scan

| Check | Result |
|-------|--------|
| C1: Agent count consistency | **FAIL** (4 locations with stale "18") |
| C2: file_type name matching | PASS (all 33 match) |
| C3: Framework name usage | PASS (no old repo name) |
| C4: Phase name consistency | PASS (8 phases match) |
| C5: file_type count consistency | **FAIL** (2 locations with stale "32") |

**Findings:**

| # | Severity | Check | Finding | Status |
|:-:|:--------:|:-----:|---------|--------|
| B1 | High | C1 | process-rules L193: "17 agents in groups, 18 including orchestrator" | **Fixed** — replaced with "see agent-list §1" |
| B2 | High | C1 | glossary L71: "one of the 18 role definitions" | **Fixed** — replaced with "role definitions in agent-list §1" |
| B3 | High | C1 | porting-guide L44: "18 files x 2 languages" | **Fixed** — replaced with "see agent-list §1 for count" |
| B4 | High | C1 | council-review L93, L148, L188: hardcoded "18" | **Fixed** — replaced with dynamic count instructions |
| B5 | High | C5 | document-rules L1620: "All 32 file types" | **Fixed** — replaced with "All file types" |
| B6 | High | C5 | council-review L165: "total file_type count (32)" | **Fixed** — replaced with "count actual rows in §7 table" |

---

## 3. Main Council Review (Expert 1-4)

### Expert 1: Process Engineering

| Verification Item | Result |
|---|---|
| 8-phase transition conditions consistent within F02 | PASS |
| R1-R6 application phases match (F02 ↔ F07) | PASS |
| Escalation criteria match (F02 ↔ F01) | PASS |
| Change management flow consistency | PASS |
| defect state transition defined | PASS |
| Retrospective cycle (process-improver → orchestrator → decree-writer) consistent (F02 ↔ F04) | PASS |
| Conditional processes match (F01 ↔ F02) | PASS (13 items in both) |
| Quality criteria: conditional process evaluation count | **FAIL** → **Fixed** ("All 12 items" → "All items") |

### Expert 2: Agent Architecture

| Verification Item | Result |
|---|---|
| No file_type ownership duplication (F04 §2) | PASS |
| Data flow diagram arrows match agent In/Out (F04 §3) | PASS |
| F02 §1.2 overall architecture ↔ F04 §3 consistency | **FAIL** → **Fixed** (agent count removed from prose) |
| Non-owning agent I/O patterns consistent | PASS |
| decree-writer safety checks ↔ F02 §3.3.3 | PASS |
| decree-writer approval table consistency | PASS |

### Expert 3: Terminology & Document Structure

| Verification Item | Result |
|---|---|
| Glossary terms used correctly in F02/F03/F06/F07 | PASS |
| Defect taxonomy causal chain ↔ glossary | PASS |
| Confusable pair distinctions upheld | PASS |
| Form Block field definitions reasonable (F03 §9) | PASS |
| F03 §7 ↔ F04 §2 all entries have owners | PASS |
| F03 §7.1 ↔ F04 §2 ↔ F03 §11 triple match | PASS |
| F03 §12 multilingual rule ↔ F10 language selection | PASS |
| decree-writer delegated write permission consistent | PASS |
| Glossary agent count | **FAIL** → **Fixed** ("18" → "agent-list §1") |

### Expert 4: Diagram & Table Cross-check

| # | Comparison Pair | Result |
|:-:|---|---|
| X01 | F04 §3 Data flow ↔ F02 §1.2 Architecture | **FAIL** → **Fixed** |
| X03 | F04 §2 Ownership ↔ F03 §7.1 Workflow ref | PASS |
| X04 | F04 §2 Ownership ↔ F03 §11 Ownership model | PASS |
| X05 | F04 §4 Activation map ↔ F02 §2 Phase defs | PASS |
| X06 | F04 §3 Data flow ↔ F11 agent In/Out | PASS |
| X08 | F05 Glossary ↔ F06 Defect taxonomy | PASS |
| X09 | F02 §3.3 Quality mgmt ↔ F07 Review standards | PASS |
| X10 | F01 Agent Teams ↔ F04 §1 Agent list | PASS (21 agents match) |
| X11 | F10 Porting guide ↔ F04 §1 model column | **FAIL** → **Fixed** (file count removed) |
| X16 | F02 Appendix A Sequence ↔ F04 §3 Data flow | PASS |
| X18 | F02 §5.5 Recommended structure ↔ actual files | PASS |

---

## 4. Consolidated Findings (Pre-fix)

| # | Severity | Discoverer | Target | Finding | Fix Applied |
|:-:|:--------:|---|---|---|---|
| 1 | Critical | Sub-agent A | feedback-classifier ja/en | tools missing Write/Edit — data flow broken | Added Write/Edit to tools |
| 2 | High | Sub-agent B / Expert 2 | process-rules ja/en L193 | Hardcoded "17/18 agents" | Replaced with "see agent-list §1" |
| 3 | High | Sub-agent B / Expert 1 | process-rules ja/en L1909 | Hardcoded "All 12 items" | Replaced with "All items" |
| 4 | High | Sub-agent B / Expert 3 | glossary ja/en L71 | Hardcoded "18 role definitions" | Replaced with "role definitions in agent-list §1" |
| 5 | High | Sub-agent B / Expert 4 | porting-guide ja/en L44 | Hardcoded "18 files x 2 languages" | Replaced with "see agent-list §1 for count" |
| 6 | High | Sub-agent B / Expert 4 | porting-guide ja/en L44 | Hardcoded "3 files x 2 languages" | Replaced with "see .claude/commands/ for count" |
| 7 | High | Sub-agent B | document-rules ja/en L1620 | Hardcoded "All 32 file types" | Replaced with "All file types" |
| 8 | High | Sub-agent B | council-review ja/en L93 | description hardcoded "18 EN agents" | Replaced with "EN agents" |
| 9 | High | Sub-agent B | council-review ja/en L148 | C1 check target hardcoded "18" | Replaced with "count actual rows in agent-list §1" |
| 10 | High | Sub-agent B | council-review ja/en L165 | C5 check target hardcoded "32" | Replaced with "count actual rows in §7 table" |
| 11 | High | Sub-agent B | council-review ja/en L188 | "F11 (18 agent definitions)" | Replaced with "F11 (agent definitions)" |
| 12 | Medium | Sub-agent A | field-test-engineer ja/en | Missing kotodama-kun check in Procedure | Added to kotodama-kun exclusion list |

---

## 5. Overall Judgment

### Pre-fix

| Severity | Count |
|---|:-:|
| Critical | 1 |
| High | 10 |
| Medium | 1 |
| Low | 0 |

**Judgment: FAIL** (Critical >= 1)

### Post-fix

All 12 findings have been fixed in this review session.

| Severity | Count |
|---|:-:|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |

**Judgment: PASS** (Critical = 0, High = 0)

### Root Cause Analysis

The majority of findings (10/12) stem from a single root cause: **hardcoded counts in prose text that were not updated when new agents/file_types/conditional processes were added.** The fix applied not only corrects the current values but eliminates the hardcoding pattern itself by replacing counts with references to their Single Source of Truth (agent-list §1, document-rules §7, CLAUDE.md conditional processes section). This prevents recurrence in future additions.

The Critical finding (feedback-classifier tools) was a design oversight during the initial creation of the new agent — the "read-only classifier" mental model conflicted with the actual need to write classification results back to tickets.

---

## 6. Recommendations

1. **Adopt a "no hardcoded counts" principle** for framework documents. When referencing the number of agents, file_types, or conditional processes, always point to the Single Source of Truth rather than embedding a number.
2. **Run council-review after any agent/file_type addition** to catch propagation issues early.

``````
