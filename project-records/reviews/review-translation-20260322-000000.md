# Translation Consistency Review — Full Framework EN/JA Pair Verification

<!-- doc:type: review -->
<!-- doc:owner: framework-translation-verifier -->
<!-- doc:created: 2026-03-22 -->
<!-- doc:status: approved -->

---

## Common Block

| Field | Value |
|-------|-------|
| doc:type | review |
| doc:owner | framework-translation-verifier |
| doc:created | 2026-03-22T00:00:00Z |
| doc:document_status | approved |
| doc:purpose | Verify structural and semantic consistency of all EN/JA file pairs in the gr-sw-maker framework before release |

---

## Form Block

| Field | Value |
|-------|-------|
| review:target | All 40 EN/JA file pairs across 5 categories |
| review:verdict | FAIL |
| review:critical_count | 0 |
| review:high_count | 0 |
| review:medium_count | 0 |
| review:low_count | 1 |

---

## Detail Block

### Scope

All 40 EN/JA file pairs verified:

| Category | Count | Files |
|----------|------:|-------|
| process-rules | 11 | full-auto-dev-process-rules, full-auto-dev-document-rules, agent-list, spec-template, defect-taxonomy, prompt-structure, review-standards, glossary, framework-development, porting-guide, field-issue-handling-rules |
| agent definitions | 21 | orchestrator, srs-writer, architect, security-reviewer, implementer, test-engineer, progress-monitor, change-manager, risk-manager, license-checker, kotodama-kun, framework-translation-verifier, user-manual-writer, runbook-writer, incident-reporter, process-improver, decree-writer, field-test-engineer, feedback-classifier, review-agent, field-issue-analyst |
| CLAUDE template | 1 | CLAUDE |
| custom commands | 5 | full-auto-dev, translate-framework, council-review, check-progress, retrospective |
| essays | 2 | anms-essay, angs-essay |

### Verification Criteria and Results

| # | Criterion | Result | Notes |
|:-:|-----------|:------:|-------|
| T1 | Heading structure (h1-h4 count, order, hierarchy) | PASS | All 40 pairs match |
| T2 | Table structure (row and column counts) | PASS | Intentional extra "日本語" column in spec-template JA is a known acceptable difference |
| T3 | Mermaid/diagram structure (node IDs, arrow counts) | PASS | All diagram node IDs are identical; arrow counts match |
| T4 | Sentence-level completeness (all sentences/list items have counterparts) | PASS | All sections have corresponding content in both languages |
| T5 | Terminology consistency (proper nouns, technical terms) | FAIL | See finding F-001 |
| T6 | Numerical value consistency (agent count, thresholds, phase count) | PASS | All numeric values match across pairs |
| T7 | English-fixed elements (YAML keys, file_type names, phase names, S0-S6 headings, Mermaid node IDs) | PASS | All fixed elements remain in English in JA versions |
| T8 | Link consistency (correct language suffixes, existing targets) | PASS | All internal links use correct language suffixes |

### Finding F-001

| Attribute | Value |
|-----------|-------|
| Severity | Low |
| Criterion | T5 — Terminology consistency |
| File pair | `.claude/agents/field-test-engineer-en.md` / `.claude/agents/field-test-engineer-ja.md` |
| Location | EN file, line 38 — In table header (third column) |
| Issue | The EN In-table uses "Purpose" as the third column header, while all other 20 EN agent definition files use "Usage" for the same column. The JA version correctly uses "用途" (consistent with all other JA agents). This is a terminology inconsistency within the EN version: the EN column header is "Purpose" while the JA column header is "用途" (which back-translates to "Usage/Purpose" but is the standard term used across all JA agents). |
| Impact | Minor inconsistency visible only in the EN version. Does not affect agent behavior or information completeness. |
| Recommended action | Change EN `field-test-engineer-en.md` line 38 third column header from "Purpose" to "Usage" to align with all other agent In-table headers. |

### Intentional Acceptable Differences (Not Flagged)

| File pair | Difference | Status |
|-----------|-----------|--------|
| spec-template-en.md / spec-template-ja.md | JA version has an extra "日本語" column in Chapter Structure and Section Structure listing tables | Intentional bilingual reference column — ACCEPTED |
| field-issue-handling-rules Mermaid | Edge label "Field OK" (EN) vs "実機OK" (JA) | Edge label content translation — ACCEPTED (node IDs identical) |
| All process-rules files | Table column headers translated (Provider→提供元, Usage→用途, etc.) | Structural translation of column headers — ACCEPTED |
| angs-essay, anms-essay | Draft watermark text ("Draft (alpha version, work in progress)" vs "ドラフト(作成中のα版)") | Content translation — ACCEPTED |

### Verification Methodology

All 40 file pairs were read in full (large files read in sections using offset reads). For each pair:
- YAML frontmatter keys and `name` field values were compared
- All headings (h1-h4) were extracted and compared by count, order, and hierarchy
- All tables were compared by row count and column count
- All Mermaid diagram blocks were compared for node IDs and arrow counts
- All list items and procedure steps were compared for completeness
- All internal `.md` links were verified for correct language suffixes
- All S0-S6 section headings were verified to be in English in both versions
- All file_type names, phase names, and field names were verified to be untranslated

---

## Footer

| Date | Author | Change |
|------|--------|--------|
| 2026-03-22 | framework-translation-verifier | Initial review — verification of all 40 EN/JA file pairs |
