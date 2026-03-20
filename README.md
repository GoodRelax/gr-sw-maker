# Nearly Fully Automated Software Development Template

[Japanese version available here](README-ja.md)

A project template that **nearly fully automates** the software development process using AI coding agent multi-agent capabilities. The user only does three things: describe the concept, make key decisions, and accept the deliverables.

## AI Platform Support

Default configuration targets **Claude Code** (Anthropic), but the framework is portable to other AI coding agents.

| Status | Platform |
|---|---|
| Ready to use | Claude Code |
| Porting guide available | OpenAI Codex CLI, Gemini CLI, Cursor, Windsurf, Cline, Roo Code, Aider |

**Tell your AI to read the [Porting Guide](process-rules/porting-guide-en.md) and auto-convert.** If it can't handle that, it can't handle this framework.

## Language Support

Default language is English (`-en.md`). Japanese (`-ja.md`) is also included.

To switch to another language, delete the unwanted suffix files and have your AI translate the rest. See [Switching Language](#switching-language) for details.

> Both English and Japanese are maintained in this repository. Consistency between languages is verified by AI agents before each release.

## Quick Start

### 1. Install

```bash
git clone https://github.com/GoodRelax/gr-sw-maker.git my-project
cd my-project
```

### 2. Switch AI platform (skip if using Claude Code)

Have your AI read the [Porting Guide](process-rules/porting-guide-en.md) and auto-convert. See [Switching AI Platform](#switching-ai-platform) for details.

### 3. Switch language (skip if using English)

Delete unwanted language files and have your AI translate the rest. See [Switching Language](#switching-language) for details.

### 4. Describe what you want to build

Write your concept in `user-order.md`:

```markdown
# What I want to build

## What?
A web app for managing team tasks — create tasks, assign members, set deadlines, and view progress on a dashboard.

## Why?
Work is siloed across individuals and no one knows who is doing what. Excel-based tracking has hit its limits.

## Other preferences
Web-based. Mobile-friendly would be nice.
```

### 5. Launch

```
/full-auto-dev
```

The AI proposes a project configuration, conducts a structured interview, generates a specification, and proceeds through design, implementation, testing, and delivery — all automatically.

## Switching AI Platform

If you are not using Claude Code, have your AI read [`process-rules/porting-guide-en.md`](process-rules/porting-guide-en.md) and auto-convert. Roughly:

- ~70% of files are portable — no changes needed
- ~15% require find-and-replace (vendor names, model names, paths)
- ~15% require format conversion (YAML frontmatter only — prompt body is reusable)

## Switching Language

1. Delete all files with the unwanted language suffix (e.g., `-ja.md`)
2. Have your AI translate the remaining `-en.md` files to your target language (e.g., `-vi.md`)

Files without a language suffix (`CLAUDE.md`, `.claude/agents/*.md`, etc.) do not need translation.

## Documentation

- [Process Rules](process-rules/full-auto-dev-process-rules-ja.md) — Phase definitions, agents, quality gates
- [Document Rules](process-rules/full-auto-dev-document-rules-ja.md) v0.0.0 — Naming, block structure, versioning
- [Porting Guide](process-rules/porting-guide-en.md) — How to convert to other AI platforms
- [Spec Format & Design Rationale](essays/) — ANMS / ANPS / ANGS three-tier spec system

## License

© 2026 GoodRelax. MIT License. See [LICENSE](LICENSE).
