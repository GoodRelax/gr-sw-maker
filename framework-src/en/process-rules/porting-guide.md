# Porting Guide: How to Adapt to Other AI Platforms

## Purpose

This framework (gr-sw-maker) is built on Claude Code, but the essential value of the framework lies in its process rules (process-rules/) and prompt structure (S0-S6). CLI-specific frontmatter and directory structures are merely a "shell," and the differences are minor enough that the target AI can convert them on its own.

**The intended reader of this guide is an AI.** There is no need for a human to manually convert each item one by one. Simply have the target AI platform read this guide and instruct it to perform the automatic conversion. Any AI that cannot do this lacks the capability to use this framework.

## File Classification

### No Changes Required (Portable)

The following are AI-platform-independent. Use them as-is:

| Path | Content |
|---|---|
| `framework-src/{lang}/process-rules/glossary.md` | Glossary |
| `framework-src/{lang}/process-rules/defect-taxonomy.md` | Defect taxonomy |
| `framework-src/{lang}/process-rules/review-standards.md` | Review standards (R1-R7) |
| `framework-src/{lang}/process-rules/spec-template.md` | Specification template |
| `framework-src/{lang}/process-rules/prompt-structure.md` | Prompt structure conventions (S0-S6) |
| `framework-src/{lang}/user-order.md` | User requirements (3-question format) |

> **Directories of generated output (`docs/`, `src/`, `tests/`, `infra/`, `project-management/`, `project-records/`) are not listed here.** They are not what gets ported; they are where the ported process writes. What porting asks is whether the rules and prompts carry over, not whether the output directories are compatible.

### Bulk Replacement (Vendor Names, Model Names, Paths)

| File | Replacement Target |
|---|---|
| `framework-src/{lang}/process-rules/full-auto-dev-process-rules.md` | "Claude Code", "Agent Teams", model names |
| `framework-src/{lang}/process-rules/full-auto-dev-document-rules.md` | Paths `.claude/agents/`, `.claude/commands/` |
| `framework-src/{lang}/process-rules/agent-list.md` | Model names in the model assignment table |

> **The model assignments are as of 2026-03.** Models are superseded over time; when porting, substitute the latest equivalent available on the target platform.

### Format Conversion Required

| Type | Current Path | Conversion Details |
|---|---|---|
| Project instruction file | `framework-src/{lang}/CLAUDE.md` | Rename and move to the target platform's instruction file |
| Agent definitions (see agent-list §1 for count) | `framework-src/{lang}/agents/*.md` | Convert the frontmatter (YAML) to the target format. Body text (S0-S6) is reused as-is |
| Custom commands | `framework-src/{lang}/commands/*.md` | Convert to the target platform's execution method |
| Configuration file | `.claude/settings*.json` | Create new file in the target platform's configuration format |

## Language Selection for Agents and Commands

The framework ships its originals as two trees, `framework-src/ja/` and `framework-src/en/`. `setup.js` deploys the selected language to the working locations.

**Claude Code takes the agent name from the `name:` field in the frontmatter.** It is not derived from the file name. The originals therefore carry no suffix to begin with, and no rename is needed at deploy time.

### Choosing a Language

| # | Operation | Use case |
|:-:|-----------|----------|
| 1 | `node setup.js ja` | Japanese project |
| 2 | `node setup.js en` | English project |
| 3 | `/translate-framework ja {lang}` followed by `node setup.js {lang}` | Another language, based on Japanese |
| 4 | `/translate-framework en {lang}` followed by `node setup.js {lang}` | Another language, based on English |

`/translate-framework` reads `framework-src/{src}/` and creates a new `framework-src/{target}/`.

### On the Target Platform

Even when the target platform has no `.claude/agents/`, **the structure of the original tree `framework-src/{lang}/` carries over unchanged.** Only the deployment target has to follow the conventions of the platform.

> **Note:** `.claude/` and the top-level `process-rules/` are output of `setup.js`, not originals. What to edit when porting is the `framework-src/{lang}/` side.

---

## Mechanisms Specific to Claude Code

The following depend on Claude Code features. **They may be omitted when porting to another platform.** The process still holds without them; what is lost is the automated checking.

| Mechanism | Purpose | Substitute when omitted |
|---|---|---|
| `tools/gate-guard.mjs` (`PreToolUse` hook) | Mechanically refuses writes to `src/`, `tests/`, `infra/` and others before the gate has passed | Manual confirmation by a human or an agent |
| `tools/session-meter.mjs` (`statusLine`) | Records context usage and cost into `session-state.json` | Switch cost tracking to manual recording |
| `.claude/settings.json` | Where the two above are registered | Not needed |

**When omitted, the cost budget alert and gate enforcement do not operate.** State that in the project's CLAUDE.md equivalent and decide on a substitute.

### What gate-guard protects

| Write destination | Gate that must have passed |
|---|---|
| `docs/api/` `docs/observability/` `docs/security/` | GATE-PLANNING |
| `src/` `tests/` `infra/` | GATE-DESIGN |
| `project-records/performance/` | GATE-IMPL |
| `final-report.md` | GATE-TEST |

`project-management/` and `project-records/reviews/` are always allowed: **blocking the records that open a gate would deadlock the pipeline.**

The only question it answers is whether a passing review for that gate exists in `project-records/reviews/`. Whether the review was sound is technical-authority's ruling, not a machine's.

**Set `GR_SW_MAKER_SKIP_GATE_GUARD=1` if a false positive blocks work.** Every unexpected condition -- hook absent, payload malformed, path unrecognised -- allows the write, so that a bug in the guard cannot stop all work.

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
Follow the conversion specifications in framework-src/{lang}/process-rules/porting-guide.md
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
