Translate gr-sw-maker framework documents into $ARGUMENTS.

Argument format: `{source language} {target language}` (e.g., `ja fr`, `en fr`, `ja en`)

---

## 1. Collecting Files for Translation

Collect translation targets using the following glob patterns (`{src}` = source language suffix):

| Category | Glob Pattern |
|----------|--------------|
| Process rules | `process-rules/*-{src}.md` |
| Agent definitions | `.claude/agents/*-{src}.md` |
| Custom commands | `.claude/commands/*-{src}.md` |
| Project instruction template | `CLAUDE.md` |
| User order template | `user-order.md` |

### Optional (Essays)

| Glob Pattern |
|--------------|
| `essays/anms-essay-{src}.md` |
| `essays/angs-essay-{src}.md` |

---

## 2. Elements to Keep in English (Do Not Translate)

The following are language-independent machine-parseable identifiers and must not be translated (per Document Management Rules §12.4):

| Element | Example | Reason |
|---------|---------|--------|
| YAML frontmatter keys | `name:`, `description:`, `tools:`, `model:` | Machine parsing |
| YAML `name` field values | `orchestrator`, `srs-writer` | Agent names are fixed in English |
| file_type names | `spec-foundation`, `pipeline-state`, `defect` | Function as namespaces |
| Phase names | `setup`, `planning`, `design` | Enum values |
| S0-S6 section headings | `## Activation`, `## Ownership`, `## Procedure`, `## Rules`, `## Exception` | Defined by prompt structure conventions |
| Subsection headings | `### Purpose`, `### Start Conditions`, `### End Conditions`, `### In`, `### Out`, `### Work` | Same as above |
| Field names / namespace prefixes | `doc:type`, `impact_level` | Machine parsing |
| HTML comments (FIELD annotations) | `<!-- FIELD: ... -->` | Machine parsing |
| Source code identifiers | Variable names, function names | International convention |

---

## 3. Elements to Translate

| Element | Example |
|---------|---------|
| YAML `description` field values | `プロジェクト全体のオーケストレーション` → target language |
| Agent prompt body text | Procedure descriptions, rule explanations, exception handling |
| Description columns in tables | Roles, purposes, remarks |
| Mermaid diagram labels | Node names, arrow labels (non-ASCII plain text allowed) |
| process-rules convention descriptions | Definitions, procedures, notes |
| CLAUDE.md section descriptions and comments | Template fill-in instructions |
| user-order.md question text | The 3 questions and fill-in examples |

---

## 4. Translation Rules

1. Do not translate elements listed in §2 "Elements to Keep in English"
2. Refer to `process-rules/glossary-{src}.md` for term definitions and ensure consistent translation of technical terms. The glossary itself should also be translated
3. For technical terms in `process-rules/defect-taxonomy-{src}.md` (error, fault, failure, defect, incident, hazard): translate only if an established translation exists in the target language; otherwise keep in English
4. Mermaid diagram labels may be written in the target language. However, special symbols (`\`, `/`, `|`, `<`, `>`, `{`, `}`) are prohibited
5. File naming: `*-{src}.md` → `*-{target}.md` (e.g., `orchestrator-ja.md` → `orchestrator-fr.md`)
6. Output `CLAUDE.md` as `CLAUDE-{target}.md` and `user-order.md` as `user-order-{target}.md`

---

## 5. Execution Steps

1. Collect translation target files using the glob patterns
2. Read `process-rules/glossary-{src}.md` and create a term translation table
3. Translate each file and output as `*-{target}.md`
4. Perform the quality self-check (§6)
5. Verify consistency with the original using the framework-translation-verifier agent

---

## 6. Quality Self-Check

After completing translation of all files, verify the following:

- [ ] Elements fixed in English (§2) have not been translated
- [ ] file_type names, agent names, and phase names are identical to the original
- [ ] Row count and column count of tables match the original
- [ ] Node count and arrow count of Mermaid diagrams match the original
- [ ] Glossary terms are used consistently across all files
- [ ] Heading structure (h1-h4) count and order match the original
- [ ] Numerical values in documents (agent count, file_type count, phase count, etc.) match the original
- [ ] Link targets (references to `.md` files) match the original

### When Discrepancies Are Found

Do not automatically determine which version (source or target) is correct. Record discrepancies in the report and ask the user to decide. The translated version may become the primary maintenance target in the future, so do not assume the source language is always authoritative.
