# Framework Development Guide

> **Purpose of this document:** A guide for the development and maintenance of the gr-sw-maker framework itself. Intended for framework developers (those who revise the framework's rule documents and agent definitions).
> **Related documents:** [Porting Guide](porting-guide.md), [Agent List](agent-list.md), [Document Management Rules](full-auto-dev-document-rules.md)

---

## 1. Distinction Between Framework Development and App Development

gr-sw-maker is used in two ways.

| | Framework development | Application development |
|---|---|---|
| **Purpose** | Revise the framework's own rules and agent definitions | Build an application using gr-sw-maker |
| **Repository** | `gr-sw-maker` (the originals on GitHub) | A project created by `npm init gr-sw-maker` |
| **Who works on it** | Framework developers | Application developers |
| **What is edited** | The originals under `framework-src/{lang}/` | The working files deployed by `setup.js` |

---

## 2. Directory Layout

**All originals live under `framework-src/{lang}/` and carry no language suffix.**

```text
framework-src/
  ja/
    CLAUDE.md               ... Original of the application template
    user-order.md           ... Original of the user requirement template
    agents/                 ... Agent definition originals (22)
    commands/               ... Command definition originals (5)
    process-rules/          ... Process rule originals (11)
  en/                       ... Identical structure
```

`setup.js` deploys the selected language to the working locations.

| Original | Deployed to |
|---|---|
| `framework-src/{lang}/agents/` | `.claude/agents/` |
| `framework-src/{lang}/commands/` | `.claude/commands/` |
| `framework-src/{lang}/process-rules/` | `process-rules/` |
| `framework-src/{lang}/CLAUDE.md` | `CLAUDE.md` |
| `framework-src/{lang}/user-order.md` | `user-order.md` |

### 2.1 Why This Layout

**Links resolve in both the original tree and the deployed tree.** `[Defect Taxonomy](defect-taxonomy.md)` inside `framework-src/ja/process-rules/glossary.md` resolves correctly, as the same string, in the original tree and in the deployed `process-rules/`. Under the suffix scheme it resolved only in the latter.

**Agent name collisions become structurally impossible.** Claude Code scans `.claude/agents/`. `framework-src/ja/agents/` has no `.claude/` in its path, so it is never scanned and the same agent name cannot be registered twice.

**Parity checking becomes trivial.**

```bash
diff <(cd framework-src/ja && find . -type f | sort) \
     <(cd framework-src/en && find . -type f | sort)
```

**Adding a language does not touch `.gitignore`.** Adding `framework-src/fr/` is enough.

### 2.2 Files That Are Not Originals

| File | Framework development | Application development |
|---|---|---|
| `CLAUDE.md` (root) | Working instructions for framework development. Gitignored (private) | Deployed by `setup.js`. Instructions for full-auto-dev. Git tracked |
| `.claude/agents/*.md` etc. | Output of `setup.js`. Gitignored | Working files. Git tracked |
| `create-gr-sw-maker/` | Holds the npm package itself | Removed by `create.js` |
| `setup.js` | Maintained as a distributed file; also used here to verify behavior | `node setup.js <lang>` switches language |
| `tools/` | Check scripts | Removed by `create.js` |
| `essays/` | Papers and research reports | Removed by `create.js` |
| `maintenance/` | Review records and fix plans | Removed by `create.js` |
| `README.md` / `README-ja.md` | Description of the framework | `create.js` regenerates the README |
| `prompt/` | Working notes. Gitignored (private) | Does not exist |

**The root `CLAUDE.md` and `framework-src/{lang}/CLAUDE.md` are different files.** The first holds working instructions for framework development; the second is the template distributed to application developers. Their contents do not match.

---

## 3. Roles of create.js and setup.js

### 3.1 create.js (`create-gr-sw-maker/bin/create.js`)

| Item | Content |
|---|---|
| **Trigger** | `npm init gr-sw-maker <project-name>` |
| **Used in** | Application development only |
| **What it does** | 1. Download the tarball from GitHub (`--ref` selects any branch, tag or commit)<br/>2. Extract into the target directory<br/>3. Remove files that exist only for framework development (`LICENSE`, `README-ja.md`, `essays/`, `tools/`, `maintenance/`, `create-gr-sw-maker/`, `.github/`)<br/>4. Empty `project-records/` while keeping the `.gitkeep` files<br/>5. Install `gitignore-user.template` as `.gitignore` and delete the template<br/>6. Generate `README.md` from the project name |

**`framework-src/` is not removed.** It is the input to `setup.js`, and without it a language can no longer be switched.

### 3.2 setup.js

| Item | Content |
|---|---|
| **Trigger** | `node setup.js [lang] [--force]` |
| **Used in** | Application development, and to verify behavior during framework development |
| **What it does** | Deploys the contents of `framework-src/{lang}/` to the working locations |
| **Overwrite protection** | `CLAUDE.md` and `user-order.md` are backed up to `*.bak` before being overwritten when their content differs. `--force` skips the backup |
| **Residue removal** | Removes framework-owned files the selected language does not provide, plus leftovers from the old suffix scheme. Files the user added themselves are never removed |

---

## 4. Why .gitignore is Split Into Two Files

`.gitignore` carries **opposite meanings** in the framework repository and in an application project.

| Path | Framework repository | Application project |
|---|---|---|
| `.claude/agents/foo.md` | Output of `setup.js`. Must not be committed | A working file. Must be committed |

Because the same path means the reverse thing, one `.gitignore` cannot serve both. **The two are split.**

| File | Role |
|---|---|
| `.gitignore` | For the framework repository only. Excludes deploy output |
| `gitignore-user.template` | For an application project. `create.js` installs it as `.gitignore` and deletes the template |

**The previous scheme - one file cut in half by a marker line and a regex - has been retired.** The wording of the marker line was an implicit API spanning `.gitignore` and `create.js`, and correcting that wording stopped the cut **without raising an error**. Today a missing template makes `create.js` throw on the spot.

**Watch the anchors.** A pattern without a leading slash, such as `CLAUDE.md`, matches at every depth and would swallow `framework-src/{lang}/CLAUDE.md`. Write a root-only exclusion as `/CLAUDE.md`.

---

## 5. Procedure When Revising

### 5.1 ja and en Go in the Same Commit (MUST)

**Never create a commit that changes only one language.** Split apart, the next person cannot tell which side is authoritative and which is merely not yet updated, and the drift becomes permanent.

`tools/check-parity.mjs` checks structural agreement, and the pre-commit hook rejects a one-sided commit.
Enable the hook once per clone.

```bash
git config core.hooksPath tools/hooks
```

The hook rejects a commit that stages only one language, then runs `check-parity`. **A rewording that preserves structure is invisible to the parity check**, so the staged-pair test is the substantive one.

### 5.2 Cross-check Form Block Tag Names

When revising the document management rules, **confirm that every tag name appearing in the §4.2 examples exists in the §9 Fields tables.** A tag name that exists only in an example will be treated as authoritative by an agent, producing output nobody can read.

`tools/check-tagnames.mjs` performs this cross-check.

### 5.3 Confirm That Referenced Sections Exist

When writing a section number into an agent's "rule sections to read", confirm that the section exists. Pointing at a section that does not exist sends the agent to read the entire rule document instead.

`tools/check-links.mjs` verifies both Markdown links and section citations. **A section number that exists under a different title** is beyond it; check that by eye.

### 5.4 Scope of a Revision

| Document revised | Also verify |
|---|---|
| `agent-list.md` | The frontmatter of every agent definition, `full-auto-dev-document-rules.md` §7 / §11 |
| `full-auto-dev-document-rules.md` §7 | Ownership in `agent-list.md` §2, the Out of each agent |
| `review-standards.md` | review-agent's applicable-perspectives table, `full-auto-dev-process-rules.md` §9.2 |
| `prompt-structure.md` | All 24 agent definitions |
| Adding or removing an agent | Perform all six steps of "Procedure for Adding New Agents" in `agent-list.md` §5 |

### 5.5 A Proposal That Adds Must Carry the Smallest Alternative (MUST)

A proposal that **adds** a rule, a field, a check or an agent MUST state three things alongside it.

| # | What to state |
|:-:|---|
| 1 | **What happens if it is not added.** Give a count where the event was observed |
| 2 | **The smaller alternative** (the minimal configuration) |
| 3 | **Why the minimal configuration was not taken** |

**Why:** R2.18 makes a product design compare itself against the smallest configuration that satisfies the requirements, but **the framework itself was exempt.** The rules it ships come to 11,264 lines in ja alone, and nothing has ever asked whether they could be fewer. **A proposal to add a rule is expected to carry a justification; no evidence has ever been asked for that not adding it was considered.** A structure where only the adding force operates is what the trial identified as the root cause of over-design, and the framework is an instance of it.

**The limit:** what this guarantees is that a comparison was recorded, not that its conclusion was right. **That is the same deliberate acceptance R2.18 makes.**

### 5.6 Defaults and MUSTs Carry Their Reason (MUST, scope-limited)

**The scope is defaults and MUSTs only.** Writing a reason into every clause would add volume, inviting from the rules' own side the growth 5.5 exists to resist.

| Target | What to state |
|---|---|
| **A default** | Why that is the default, and **where to record a departure from it** |
| **A MUST** | What breaks when it is not obeyed |

**Why:** in the trial, the server/web assumptions baked into the CLAUDE.md template collided with a CLI in **six places**, each needing a decision to reinterpret it. **Had "why this is the default" been written down, "this does not apply to a CLI" would have been immediate.** The reader is an LLM, and where only the default is written, the default is what gets followed.

**Comparison against the minimal configuration (5.5 applied to itself):**

| # | Content |
|:-:|---|
| 1 | **Without it:** reinterpreting defaults recurs. The trial's count is six places |
| 2 | **Minimal configuration:** write the reason on defaults only, leaving MUSTs out of scope |
| 3 | **Why not taken:** what needed reinterpreting in the trial were defaults, but **what got argued over were MUSTs.** Leaving them out means re-litigating why each obligation exists every time |

---


---

## 6. Running the Checks Locally

All of these run with no dependencies. CI (`.github/workflows/framework-check.yml`) runs the same seven, so **if they pass here they pass there.**

| Command | What it checks |
|---|---|
| `node --check <file>` | Syntax of every `*.js` / `*.mjs` |
| `node tools/check-parity.mjs` | Language tree agreement: line, heading, table row, code fence and link target counts |
| `node tools/check-roster.mjs` | Roster against the definitions, frontmatter `name` / `model`, review perspective wiring |
| `node tools/check-links.mjs` | Dead links and section citations |
| `node tools/check-tagnames.mjs` | Form Block tag names against the §9 Fields tables |
| `node tools/check-terms.mjs` | That no term rejected by glossary section 1 has crept into the prose |
| `node tools/check-setup.mjs` | What `setup.js` deploys, idempotency, language switching, `.bak` protection |

`check-setup.mjs` copies `setup.js` and `framework-src/` into a temporary directory before running, so **it never touches the `CLAUDE.md` or `user-order.md` you are working on.**

`tools/gate-guard.mjs`, `tools/otel-sink.mjs` and `tools/session-meter.mjs` are runtime machinery rather than checks and are not listed here; see "Claude Code specific machinery" in the porting guide.

## 7. npm publish Procedure

1. Commit and push all framework changes
2. Run `npm publish` inside `create-gr-sw-maker/`
3. Run an end-to-end test with `npm init gr-sw-maker <test-project>`
4. Verify `node setup.js ja` and `node setup.js en` inside the generated project

**Note:** only the `create-gr-sw-maker` package is published to npm. gr-sw-maker itself is not registered on npm; it is distributed as a tarball download from GitHub.

Because a change to `create.js` is the package content itself, **it does not reach users until the package is published again.**
