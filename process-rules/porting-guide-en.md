# Porting Guide: How to Adapt to Other AI Platforms

## Purpose

This framework (gr-sw-maker) is built on Claude Code, but the essential value of the framework lies in its process rules (process-rules/) and prompt structure (S0-S6). CLI-specific frontmatter and directory structures are merely a "shell," and the differences are minor enough that the target AI can convert them on its own.

**The intended reader of this guide is an AI.** There is no need for a human to manually convert each item one by one. Simply have the target AI platform read this guide and instruct it to perform the automatic conversion. Any AI that cannot do this lacks the capability to use this framework.

## File Classification

### No Changes Required (Portable)

The following are AI-platform-independent. Use them as-is:

| Path | Content |
|---|---|
| `docs/` | Specifications and design documents (generated artifacts) |
| `src/` | Source code |
| `tests/` | Test code |
| `infra/` | IaC code |
| `project-management/` | Progress and WBS |
| `project-records/` | Reviews, decisions, and risk records |
| `process-rules/glossary-en.md` | Glossary |
| `process-rules/defect-taxonomy-en.md` | Defect taxonomy |
| `process-rules/review-standards-en.md` | Review standards (R1-R6) |
| `process-rules/spec-template-*.md` | Specification templates |
| `process-rules/prompt-structure-en.md` | Prompt structure conventions (S0-S6) |
| `user-order.md` | User requirements (3-question format) |
| `.mcp.json` | MCP configuration (open standard) |

### Bulk Replacement (Vendor Names, Model Names, Paths)

| File | Replacement Target |
|---|---|
| `process-rules/full-auto-dev-process-rules-en.md` | "Claude Code", "Agent Teams", model names (Opus/Sonnet/Haiku) |
| `process-rules/full-auto-dev-document-rules-en.md` | Paths `.claude/agents/`, `.claude/commands/` |
| `process-rules/agent-list-en.md` | Model names in the model assignment table |

### Format Conversion Required

| Type | Current Path | Conversion Details |
|---|---|---|
| Project instruction file | `CLAUDE.md` | Rename and move to the target platform's instruction file |
| Agent definitions (see agent-list §1 for count, x 2 languages) | `.claude/agents/*-ja.md`, `*-en.md` | Select language -> Rename -> Convert frontmatter (YAML) to target format. Body text (S0-S6) can be reused as-is |
| Custom commands (see `.claude/commands/` for count, x 2 languages) | `.claude/commands/*-ja.md`, `*-en.md` | Select language -> Rename -> Convert to target platform's execution method |
| Configuration file | `.claude/settings*.json` | Create new file in the target platform's configuration format |

## Agent and Command Language Selection

The framework provides agent definitions (`.claude/agents/`) and custom commands (`.claude/commands/`) as Japanese-English pairs. When deploying to a project, choose from the following 4 options and rename to `.md` without a suffix. Options 3 and 4 (translation) can be executed with the `/translate-framework` command (`.claude/commands/translate-framework-ja.md`).

**Claude Code derives the agent name from the file name** (`orchestrator-ja.md` -> agent name `orchestrator-ja`). For correct operation in a project, `orchestrator.md` without a suffix is required.

### Options

| # | Operation | Use Case | Procedure |
|:-:|------|------------|------|
| 1 | Rename `-ja.md` | Japanese project | `orchestrator-ja.md` -> `orchestrator.md` |
| 2 | Rename `-en.md` | English project | `orchestrator-en.md` -> `orchestrator.md` |
| 3 | Translate `-ja.md` | Other-language project based on Japanese | `orchestrator-ja.md` -> Translate -> `orchestrator.md` |
| 4 | Translate `-en.md` | Other-language project based on English | `orchestrator-en.md` -> Translate -> `orchestrator.md` |

### Deployment Procedure

```bash
# Example: For a Japanese project (Option 1)
cd .claude/agents/
for f in *-ja.md; do cp "$f" "${f%-ja.md}.md"; done

cd ../commands/
for f in *-ja.md; do cp "$f" "${f%-ja.md}.md"; done
```

> **Note:** After renaming, you may either keep or delete the `-ja.md` / `-en.md` files as templates. If keeping them, add them to `.gitignore` to avoid confusion.

### Design Rationale

- During framework distribution, both languages have explicit suffixes (`-ja.md` / `-en.md`)
- During project execution, the suffix-free (`.md`) file is the sole active entity
- This allows the project to maintain document management rule section 12: "primary language = no suffix"
- The framework does not force a decision on whether English or Japanese is the default

---

## Platform-Specific Conversion Specifications

### Claude Code -> OpenAI Codex CLI

| Item | Claude Code | Codex CLI |
|---|---|---|
| Project instructions | `CLAUDE.md` | `AGENTS.md` |
| Agent definitions | `.claude/agents/*.md` | Consolidated into `AGENTS.md` (single agent) |
| Custom commands | `.claude/commands/*.md` | Placed as prompt files in `prompt/` |
| Configuration | `.claude/settings.json` | Environment variables + CLI arguments |
| Model specification | `model: opus` | `--model o3` |
| Multi-agent | Agent Teams (parallel execution) | Not supported (change to sequential execution) |

### Claude Code -> Gemini CLI

| Item | Claude Code | Gemini CLI |
|---|---|---|
| Project instructions | `CLAUDE.md` | `GEMINI.md` |
| Agent definitions | `.claude/agents/*.md` | Consolidated into `GEMINI.md` |
| Custom commands | `.claude/commands/*.md` | Placed as prompt files in `prompt/` |
| Configuration | `.claude/settings.json` | `.gemini/settings.json` |
| Model specification | `model: opus` | `gemini-2.5-pro` |
| Multi-agent | Agent Teams (parallel execution) | Not supported (change to sequential execution) |

### Claude Code -> Cursor

| Item | Claude Code | Cursor |
|---|---|---|
| Project instructions | `CLAUDE.md` | `.cursor/rules/project.mdc` |
| Agent definitions | `.claude/agents/*.md` | Split into rule files in `.cursor/rules/` |
| Custom commands | `.claude/commands/*.md` | Placed in Notepads |
| Configuration | `.claude/settings.json` | IDE settings UI |
| Model specification | `model: opus` | Selected in IDE settings |
| Multi-agent | Agent Teams (parallel execution) | Background Agent (single) |

### Claude Code -> Windsurf

| Item | Claude Code | Windsurf |
|---|---|---|
| Project instructions | `CLAUDE.md` | `.windsurfrules` |
| Agent definitions | `.claude/agents/*.md` | Consolidated into `.windsurfrules` |
| Custom commands | `.claude/commands/*.md` | Consolidated into rule file |
| Configuration | `.claude/settings.json` | IDE settings |
| Multi-agent | Agent Teams (parallel execution) | Cascade (internal multi-step) |

### Claude Code -> Cline

| Item | Claude Code | Cline |
|---|---|---|
| Project instructions | `CLAUDE.md` | `.clinerules` |
| Agent definitions | `.claude/agents/*.md` | `.cline/` + custom mode definition JSON |
| Custom commands | `.claude/commands/*.md` | Consolidated into custom modes |
| Configuration | `.claude/settings.json` | VSCode extension settings |
| Multi-agent | Agent Teams (parallel execution) | Not supported (substitute with mode switching) |

### Claude Code -> Roo Code

| Item | Claude Code | Roo Code |
|---|---|---|
| Project instructions | `CLAUDE.md` | `.roo/rules/project.md` |
| Agent definitions | `.claude/agents/*.md` | Placed as per-mode rules in `.roo/rules/` |
| Custom commands | `.claude/commands/*.md` | Consolidated into custom mode definitions |
| Configuration | `.claude/settings.json` | VSCode extension settings |
| Multi-agent | Agent Teams (parallel execution) | Mode switching (pseudo-multi) |

### Claude Code -> Aider

| Item | Claude Code | Aider |
|---|---|---|
| Project instructions | `CLAUDE.md` | `CONVENTIONS.md` |
| Agent definitions | `.claude/agents/*.md` | Consolidated as role descriptions in `CONVENTIONS.md` |
| Custom commands | `.claude/commands/*.md` | Shell scripts + prompt files |
| Configuration | `.claude/settings.json` | `.aider.conf.yml` |
| Model specification | `model: opus` | `model: gpt-4.1` etc. |
| Multi-agent | Agent Teams (parallel execution) | Not supported (manual switching) |

## Recommended Model Mapping

Recommended mappings when replacing model specifications in agent definitions:

| Role Rank | Claude | OpenAI | Google | Usage |
|---|---|---|---|---|
| High (judgment and design) | opus | o3 | gemini-2.5-pro | orchestrator, architect, review-agent, security-reviewer, srs-writer, implementer, field-issue-analyst |
| Medium (routine tasks) | sonnet | gpt-4.1 / gpt-4.1-mini | gemini-2.5-flash | test-engineer, progress-monitor, change-manager, risk-manager, framework-translation-verifier, user-manual-writer, runbook-writer, incident-reporter, process-improver, decree-writer, field-test-engineer, feedback-classifier |
| Low (simple rules) | haiku | gpt-4.1-mini | gemini-2.5-flash | license-checker, kotodama-kun |

> Recommended values should be adjusted through PoC validation. The capability, cost, and speed balance of each model differs by platform.

## Porting Procedure (Example Instructions for AI)

Instruct the target AI as follows:

```
This repository is a full-auto-dev framework for Claude Code.
Follow the conversion specifications in process-rules/porting-guide-en.md
and convert for [target platform name].

1. Select the language for agents and commands (project primary language: [ja/en/other])
   - .claude/agents/*-[lang].md -> Rename to .claude/agents/*.md (or translate from base language)
   - .claude/commands/*-[lang].md -> Rename to .claude/commands/*.md (or translate from base language)
2. Leave portable files as-is
3. Bulk-replace vendor-specific references in process-rules/
4. Rename CLAUDE.md to [target file name] and rewrite vendor-specific references
5. Extract prompt body text (S0-S6) from .claude/agents/*.md and convert to [target format]
6. Convert .claude/commands/*.md to [target execution method]
7. Convert .claude/settings*.json to [target configuration format]
8. Delete the now-unnecessary .claude/ directory
```


## Structural Constraints

Multi-agent parallel execution via Agent Teams is a Claude Code-specific feature as of March 2026. For other platforms, consider the following alternatives:

- **Sequential execution:** A single agent handles all roles in order (simplest approach)
- **Mode switching:** Switch roles using custom modes in Cline / Roo Code
- **Shell script pseudo-parallelism:** Launch multiple CLI processes in parallel (Aider / Codex CLI)
- **External orchestrator:** Build custom multi-agent systems using Agent SDK or similar
