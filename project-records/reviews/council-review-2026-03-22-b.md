# Council Review Report — 2026-03-22 (Session B: Post-§4.3 Status Naming Convention)

## Review Scope

Verify that the §4.3 status naming convention addition and existing status value compliance fixes from the previous session are consistently reflected across all framework documents.

---

## Phase 0: Translation Consistency Gate

**Result: CONDITIONAL PASS**

| Check | Result |
|-------|--------|
| T1: Heading structure | PASS (all 40 pairs) |
| T2: Table structure | PASS (all 40 pairs) |
| T3: Mermaid diagram structure | PASS (all 40 pairs) |
| T4: Numeric consistency | PASS (no inter-language discrepancy) |
| T5: Link consistency | PASS |
| T6: YAML frontmatter | PASS (all 21 agent pairs) |
| T7: English-fixed elements | PASS |
| T8: Field names / namespaces | PASS |
| T9: Terminology consistency | PASS |

**Findings (content staleness, not translation mismatch):**

| # | Severity | Pair | Issue |
|:-:|:--------:|------|-------|
| P0-1 | Low | framework-development JA/EN | EN version is git-untracked. Content matches JA but not committed |

**Gate decision:** CONDITIONAL PASS — No structural translation mismatches detected across all 40 pairs. Content issues are identical in both languages (not translation errors). Proceed to Phase 1.

---

## Phase 1: Sub-agent Results

### Sub-agent A: Prompt Quality Check

**Status:** Completed. **ALL PASS** (C1-C9).

| Check | Result |
|-------|--------|
| C1: S0-S6 structure compliance (all 21 agents) | PASS |
| C2: YAML frontmatter vs agent-list §1 (name, model) | PASS (all 21 match) |
| C3: Out file_type vs agent-list §2 ownership | PASS |
| C4: In file_type exists in provider's Out | PASS |
| C5: Procedure logic (Start→End Conditions) | PASS |
| C6: Exception table coverage | PASS |
| C7: tools vs responsibility alignment | PASS |
| C8: process-improver no Write/Edit, decree-writer has Write/Edit | PASS |
| C9: kotodama-kun check in applicable agent Procedures | PASS (11 agents have it, 9 exempt agents don't) |

### Sub-agent B: Terminology Mechanical Scan

**Status:** Completed.

**Results:**

| Check | Result | Details |
|-------|--------|---------|
| C1: Agent count consistency | PASS | agent-list §1: 21 agents. All files consistent |
| C2: file_type name match | PASS | document-rules §7 and agent-list §2 fully match |
| C3: Framework name usage | PASS | No old repo name "claude-code-full-auto-dev" in any framework document. Found only in: (a) council-review command check instructions (intentional — it's the search target), (b) past council-review records in project-records/ (historical audit trails, not modifiable) |
| C4: Phase name consistency | PASS | All 8 phase names match between process-rules §2 and agent-list §4 |
| C5: file_type count consistency | PASS | document-rules §7 master table: 33 file_types |

---

## Phase 2: Main Council Review

### Expert 1: Process Engineering

**Findings:**

| # | Severity | File | Issue | Proposed Fix |
|:-:|:--------:|------|-------|-------------|
| E1-1 | High | process-rules §4.6.5, agent-list §3 | **field-issue status count mismatch**: Both files state "12 statuses" but field-issue-handling-rules §5 and document-rules §9 define **13 statuses** (reported, classified, in-analysis, cause-identified, in-planning, solution-proposed, approved, spec-updated, spec-reviewed, fixed, code-reviewed, tested, verified). Gate count (12) and prohibition count (5) are correct. | Change "12 statuses" to "13 statuses" in both process-rules §4.6.5 (line 1166) and agent-list §3 field-testing diagram caption (line 307). Update JA versions accordingly |
| E1-2 | Medium | process-rules §3.2.4 (line 455-463) | **Defect state diagram uses PascalCase**: State names are `Open`, `InAnalysis`, `InFix`, `InRetest`, `Closed` instead of the canonical kebab-case enum values `open / in-analysis / in-fix / in-retest / closed` defined in document-rules §9.7. Violates the §4.3 status naming convention established in the previous session. | Update the Mermaid stateDiagram to use the canonical enum values. Mermaid stateDiagram-v2 does not support hyphens in state IDs, so use aliases: `state "in-analysis" as InAnalysis` or use label syntax |
| E1-3 | Medium | process-rules Appendix A (line 2629) | **Final review scope mismatch**: Sequence diagram says "Request Final R1-R5 Review" but §4.7.1 specifies the final review covers "all R1-R6 perspectives". R6 is handled separately earlier for performance-report, but the final review should explicitly be R1-R6. | Change "Request Final R1-R5 Review" to "Request Final R1-R6 Review" |

**Checks PASS:**
- 8 phase transition conditions: consistent within F02 ✓
- Quality gates R1-R6 application phases: F02 §9.1 matches F07 ✓
- Escalation criteria (risk≧6, cost 80%, impact_level=high): F01 matches F02 ✓
- Change management flow: consistent ✓
- Retrospective cycle (process-improver → orchestrator → decree-writer): F02 §3.3.3 matches F04 §3 ✓
- Conditional processes: 13 items in F01 match 13 items in F02 §3.4.1 ✓
- Review finding disposition rules: F02 §9.5 matches F07 ✓

### Expert 2: Agent Architecture

**No findings (all checks PASS).**

- file_type ownership: No overlaps in F04 §2 (all 33 file_types have unique owners) ✓
- F02 §1.2 overview (5 groups, 18 agents + 3 conditional) matches F04 §3 detailed flows ✓
- file_type-less agents (kotodama-kun, framework-translation-verifier, decree-writer): input/output patterns are consistent ✓
- decree-writer approval table: F03 §11 ("CLAUDE.md/process-rules = user, agents = orchestrator") consistent across files ✓
- kotodama-kun usage list: 11 agents use it, 9 do not (plus kotodama-kun itself) = 21 total ✓

### Expert 3: Terminology & Document Structure

**No findings (all checks PASS).**

- F05 glossary terms used correctly in F02/F03/F06/F07 ✓
- F06 causal chain (error→fault→failure→defect/incident/hazard) consistent with F05 ✓
- F05 §4 confusable pairs respected across all rule files ✓
- F03 §7 file_type table (33 entries) fully covered in F04 §2 with matching owners ✓
- F03 §7.1 workflow reference table owner column matches F04 §2 and F03 §11 (triple match) ✓
- F03 §12 multilingual rules (primary=no suffix) consistent with F10 porting guide ✓
- decree-writer delegated write permission annotation in F03 §11 consistent ✓
- §4.3 status naming convention: All status enums across document-rules (document_status, handoff_status, defect_status, change_request_status, incident_status, decision_status, risk_status, interview_status, field-issue:status) comply with the 4-state lifecycle model and naming rules ✓

### Expert 4: Diagram & Table Cross-check

**Findings:**

| # | Severity | Cross-check | Issue | Proposed Fix |
|:-:|:--------:|-------------|-------|-------------|
| E4-1 | Medium | X16: Appendix A ↔ F04 §3 | Same as E1-3 above (Final R1-R5 instead of R1-R6) | See E1-3 |

**Checks PASS:**

| # | Cross-check | Result |
|:-:|-------------|--------|
| X01 | F04 §3 data flow ↔ F02 §1.2 overview | PASS — 5 groups match; field-testing agents in separate diagram |
| X03 | F04 §2 ownership ↔ F03 §7.1 workflow table | PASS — owner column matches all 33 entries |
| X04 | F04 §2 ownership ↔ F03 §11 ownership model | PASS — all entries match |
| X05 | F04 §4 activation map ↔ F02 §2 phase definitions | PASS — 8 phases match |
| X06 | F04 §3 data flow ↔ F11 agent In/Out | Delegated to Sub-agent A (pending) |
| X08 | F05 glossary ↔ F06 defect taxonomy | PASS — no contradictions |
| X09 | F02 §3.3 quality mgmt ↔ F07 R1-R6 | PASS — perspectives and target phases match |
| X10 | F01 CLAUDE.md ↔ F04 §1 agent list | PASS — 21 agents, names and roles match |
| X11 | F10 model mapping ↔ F04 §1 model column | PASS — opus(7)/sonnet(12)/haiku(2) = 21 |
| X16 | F02 Appendix A ↔ F04 §3 data flow | CONDITIONAL — one label mismatch (E1-3/E4-1) |
| X18 | F02 §5.5 structure ↔ actual files | PASS — 21 agents, 5 commands, 11 process-rules match |

**Additional Mermaid checks:**
- No syntax errors detected in reviewed diagrams ✓
- Style targets all correspond to defined nodes ✓

---

## Phase 3: Integrated Assessment

### 3.1 Consolidated Finding List

| # | Severity | Source | File | Finding | Proposed Fix |
|:-:|:--------:|--------|------|---------|-------------|
| 1 | High | Expert 1 | process-rules §4.6.5 (EN/JA), agent-list §3 (EN/JA) | field-issue status count "12" should be "13" | Update both files in both languages: "12 statuses" → "13 statuses" |
| 2 | Medium | Expert 1 | process-rules §3.2.4 (EN/JA) | Defect state diagram uses PascalCase instead of §4.3 kebab-case | Rewrite Mermaid states with alias syntax to display kebab-case values |
| 3 | Medium | Expert 1 + Expert 4 | process-rules Appendix A (EN/JA) | "Final R1-R5 Review" should be "Final R1-R6 Review" | Fix label in sequence diagram |
| 4 | Low | Phase 0 | framework-development-en.md | Git untracked file | Stage and commit with other changes |

### 3.2 Summary Counts

| Severity | Count |
|----------|:-----:|
| Critical | 0 |
| High | 1 |
| Medium | 2 |
| Low | 1 |

### 3.3 Overall Judgment

| Criteria | Value |
|----------|-------|
| Critical findings | 0 |
| High findings | 1 |
| Condition | Critical = 0, High ≦ 3 |
| **Judgment** | **CONDITIONAL PASS** |

**Rationale:** One High finding (field-issue status count "12" → "13") is a straightforward numeric correction with no impact on runtime behavior. Two Medium findings are label/naming corrections in Mermaid diagrams. All findings are non-breaking editorial fixes that can be applied in a single batch.

**Recommendation:** Fix all 4 findings in both JA and EN versions before the next release. After fixes, no re-review is required (all findings are mechanical corrections).

---

## Appendix: Sub-agent Integration Status

- **Sub-agent A (Prompt Quality Check):** Completed. ALL PASS (C1-C9). All 21 agent definitions comply with S0-S6 structure, YAML frontmatter matches agent-list §1, ownership and data flow are consistent, and kotodama-kun integration is properly implemented.
- **Sub-agent B (Terminology Mechanical Scan):** Completed. All 5 checks PASS. No additional findings beyond the main council review. The old repo name detection was evaluated and determined to be a false positive (found only in check instructions and historical records).

**Note on §4.3 compliance (primary review scope):** The new §4.3 status naming convention and all existing status enum value modifications from the previous session (document_status: review→in-review, handoff_status: done→completed, change_request_status: analyzing→in-analysis, incident_status: investigating→in-investigation, and all field-issue status renames) have been verified as correctly applied. No residual old values were found in any EN rule file.
