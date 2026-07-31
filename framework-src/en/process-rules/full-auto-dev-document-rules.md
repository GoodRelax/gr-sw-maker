# full-auto-dev Document Management Rules v0.1.0

## Version 0.1.0 | Date: 2026-08-01

> **Status:** Pre-release (before PoC). Will be promoted to v1.0.0 after PoC completion.

---

# 1. Overview

This document defines the naming conventions, structure, versioning, and ownership of all files in the full-auto-dev framework.

All agents MUST follow these rules when creating or updating managed files.

Regardless of the specification format used by the process (ANMS / ANPS / ANGS), the document management formats in this document (Common Block, Form Block, etc.) apply to all managed documents.

**Related document:** [Process Rules](full-auto-dev-process-rules.md) — Process rules for phase definitions, agent definitions, quality management, etc.

## 1.1 Versioning of This Document

The version of this document itself is managed in **MAJOR.MINOR.PATCH** format.

| Level | Change Target | Impact Scope | Existing File Reuse |
|--------|---------|---------|:------------------:|
| **MAJOR** | Structural changes to Common Block / Footer | All managed files | All files require migration |
| **MINOR** | Changes/additions to Form Block | Only files of the affected type | Only affected types need review |
| **PATCH** | Detail Block Guidance / wording corrections | No impact | Can be used as-is |

The `schema_version` of managed files records the **MAJOR.MINOR** of this document (PATCH is omitted).

**Release status:**

| Version | Condition | Meaning |
|-----------|------|------|
| 0.x.x | Before PoC | Design stage. Common Block and all else can be freely changed. **While here, a container change moves MINOR** (MAJOR is reserved for the promotion to 1.0.0) |
| 1.0.0 | PoC completed and verified | Official version. MAJOR changes require a migration guide |

## 1.2 Framework Convention Revision Rules

Revision rules applicable to all files under process-rules/ (including this document).

**Target:** every `.md` file under `framework-src/{lang}/process-rules/`. They are not listed individually, because a list goes stale every time a rule document is added.

**Revision categories:**

| Category | Change Content | Approval | Impact Analysis |
|------|---------|:----:|---------|
| **Breaking** | Structural changes (addition/deletion/renaming of sections, fields, namespaces) | User approval required | List all affected files |
| **Non-breaking** | Content corrections/clarifications (maintaining existing structure) | User notification only | Not required |
| **Additive** | New additions (new file_type, new agent, new term) | User notification only | No impact on existing items |

**Revision procedure:**

1. Identify the change content
2. Determine the category (Breaking / Non-breaking / Additive)
3. For Breaking changes:
   - List affected files (conventions, agent prompts, project artifacts)
   - Report the change content and impact to the user and request approval
   - After approval, modify the convention
   - Update the affected files
4. For Non-breaking / Additive changes:
   - Modify the convention
   - Report the change content to the user

**History management:** Revision history for framework conventions is managed via Git. Convention files are not subject to Common Block, so Footer / change_log are not required.

---

# 2. Directory Structure

**Framework repository:**

```
{framework-root}/
  README.md                   # Repository overview
  process-rules/              # Operational rules (framework definitions)
    full-auto-dev-process-rules-ja.md
    full-auto-dev-process-rules-en.md
    full-auto-dev-document-rules-ja.md   # ← This document
    full-auto-dev-document-rules-en.md
    agent-list-ja.md                     # Agent list
    agent-list-en.md
    prompt-structure-ja.md               # Prompt structure conventions
    prompt-structure-en.md
    glossary-ja.md                       # Glossary
    glossary-en.md
    review-standards-ja.md               # Review standards (R1-R7)
    review-standards-en.md
    spec-template-ja.md                  # Specification template
    spec-template-en.md
  essays/                     # Papers and research (Japanese/English)
  .claude/commands/           # Custom command definitions
```

**Consumer projects:**

```
{project-root}/
  CLAUDE.md                       # Project settings (references process-rules)
  user-order.md                   # User input specification (3-question format)
  src/                            # Source code
  tests/                          # Test code
  infra/                          # IaC (Infrastructure as Code)
  project-management/             # Orchestration + PM artifacts
    pipeline-state.md
    handoff/
    progress/
    old/
  docs/                           # Design artifacts (final deliverables)
    spec/                         # Specifications
    api/                          # OpenAPI definitions
    security/                     # Threat models, security architecture
    observability/                # Observability design
    hardware/                     # HW requirement specifications (conditional)
    ai/                           # AI/LLM requirement specifications (conditional)
    framework/                    # Framework requirement specifications (conditional)
    operations/                   # Runbooks, DR plans (conditional)
    old/
  project-records/                # Process records (audit trails)
    reviews/
    decisions/
    risks/
    defects/
    change-requests/
    traceability/
    security/                     # Security scan results (SAST/SCA/DAST/manual)
    licenses/                     # License reports
    performance/                  # Performance test reports
    improvement/                  # Retrospective and improvement records
    release/                      # Release judgment checklist
    incidents/                    # Production incident records (conditional)
    legal/                        # Legal research results (conditional)
    safety/                       # Functional safety records (conditional)
    field-issues/                 # Field testing feedback (conditional)
    snapshots/                    # Project snapshots (zip, etc.)
    old/
```

**Separation principle:**

| Directory | Stored Content | Primary Users |
|-------------|----------|-----------|
| `project-management/` | Orchestration state, handoffs, progress, WBS, cost | orchestrator, progress-monitor |
| `docs/` | Specifications, API documents, security design — "what was built" | All agents, users, downstream consumers |
| `project-records/` | Reviews, decisions, risks, defects, CRs — "how it was built" | Auditors, reviewers, process-oriented stakeholders |

---

# 3. File Naming Conventions

## 3.1 General Policy

- Style: **kebab-case** only (exceptions: when following external standards or language conventions)
- Timestamps: **UTC**
- Language suffix: Primary language files have no suffix. Only translated versions get `-{lang}.md` (see section 12). Framework documents (process-rules/, essays/) are an exception and are managed as `-ja.md` / `-en.md` pairs

## 3.2 Process Documents (project-management/)

Files used for pipeline management, inter-agent handoffs, and progress management.

**Format:**

```
{file_type}-{NNN}-{YYYYMMDD}-{HHMMSS}.md
```

| File | Naming Example | Notes |
|---------|--------|------|
| Pipeline state | `pipeline-state.md` | Singleton. No serial number or timestamp |
| Handoff | `handoff-001-20260314-102530.md` | Standard format |
| Progress report | `progress-001-20260314-150000.md` | Standard format |
| Cost log | `cost-log.json` | Time-series JSON. Not subject to Common Block. owner: progress-monitor, consumed_by: orchestrator |
| Test progress | `test-progress.json` | Time-series JSON. Not subject to Common Block. owner: test-engineer, consumed_by: progress-monitor |
| defect curve | `defect-curve.json` | Time-series JSON. Not subject to Common Block. owner: test-engineer, consumed_by: progress-monitor |
| WBS | `wbs.md` | Singleton |
| Test plan | `test-plan.md` | Singleton |
| Interview record | `interview-record.md` | Singleton. Created in planning phase |
| Stakeholder register | `stakeholder-register.md` | Singleton. Recommended process |

## 3.3 Process Records (project-records/)

Records of reviews, decisions, risks, defects, change requests, and traceability.

**Format:**

```
{file_type}-{NNN}-{YYYYMMDD}-{HHMMSS}.md
```

| File | Naming Example | Notes |
|---------|--------|------|
| Review result | `review-003-20260314-153000.md` | Standard format |
| Decision record | `decision-002-20260315-090000.md` | Standard format |
| Risk entry | `risk-001-20260314-120000.md` | Individual risk |
| Risk register | `risk-register.md` | Singleton. Integrated register |
| defect ticket | `defect-012-20260316-140000.md` | Standard format |
| Change request | `change-request-001-20260317-110000.md` | Standard format |
| Traceability | `traceability-matrix.md` | Singleton |
| Security scan | `security-scan-report-001-20260318-100000.md` | Standard format. Distinguished by scan_type |
| License report | `license-report.md` | Singleton |
| Performance test report | `performance-report-001-20260320-140000.md` | Standard format |
| incident record | `incident-report-001-20260320-100000.md` | Standard format. operation phase |

## 3.4 Specifications (docs/spec/)

Project requirement and design specifications. Depends on the specification format (ANMS/ANPS/ANGS).

**Format:**

```
{project-name}-spec.md            # ANMS (single file)
{project-name}-spec-ch{N}.md      # ANPS (chapter split)
```

| File | Naming Example | Notes |
|---------|--------|------|
| ANMS specification | `my-app-spec.md` | Single file |
| ANPS Ch1-2 | `my-app-spec-ch1-2.md` | Chapter split |
| ANPS Ch3 | `my-app-spec-ch3.md` | Chapter split |
## 3.5 Root-Placed Documents

High-visibility documents placed at the project root.

| File | Naming Example | Notes |
|---------|--------|------|
| User input specification | `user-order.md` | Singleton. 3-question format |
| Executive dashboard | `executive-dashboard.md` | Singleton. Project-wide status summary |
| Final report | `final-report.md` | Singleton. Created in delivery phase |

## 3.6 General Documents (docs/)

Design artifacts other than specifications, such as API definitions and security design.

**Format:**

```
{descriptive-name}.{extension}
```

| File | Naming Example | Notes |
|---------|--------|------|
| OpenAPI definition | `openapi.yaml` | Follows external standard (OpenAPI 3.0) |
| Threat model | `threat-model.md` | With Common Block |
| Security architecture | `security-architecture.md` | With Common Block |
| Observability design | `observability-design.md` | With Common Block |
| Infrastructure diagram | `infrastructure.md` | With Common Block |
| User manual | `user-manual.md` | With Common Block |
| Runbook | `runbook.md` | With Common Block |
| Disaster recovery plan | `disaster-recovery-plan.md` | With Common Block |

## 3.7 Source Code (src/)

**Format:** Follows the conventions of the adopted language/framework.

| Language | Convention | Example |
|------|------|-----|
| TypeScript | camelCase filenames, PascalCase components | `userService.ts`, `UserCard.tsx` |
| Python | snake_case | `user_service.py` |
| Go | snake_case | `user_service.go` |
| Rust | snake_case | `user_service.rs` |

- **Not subject to** Common Block
- Traceability is managed in `project-records/traceability/traceability-matrix.md`

## 3.8 Test Code (tests/)

**Format:** Follows the conventions of the test framework.

| Type | Convention | Example |
|------|------|-----|
| Unit test | Target filename + `.test` / `.spec` | `userService.test.ts` |
| Integration test | Target + `.integration.test` | `api.integration.test.ts` |
| E2E test | Flow name + `.e2e.test` | `login-flow.e2e.test.ts` |
| Performance test | Target + `.perf` | `api-latency.perf.js` (k6) |

- **Not subject to** Common Block

## 3.9 Configuration and Infrastructure (root / infra/)

**Format:** Use the standard name for each tool. Do not rename.

| File | Location | Notes |
|---------|------|------|
| `package.json` | Root | npm/yarn standard |
| `tsconfig.json` | Root | TypeScript standard |
| `.eslintrc.json` | Root | ESLint standard |
| `Dockerfile` | Root or infra/ | Docker standard |
| `docker-compose.yml` | Root or infra/ | Docker Compose standard |
| `*.tf` | infra/ | Terraform standard |
| `.github/workflows/*.yml` | .github/ | GitHub Actions standard |

- **Not subject to** Common Block

## 3.10 old/ Directory Rules

Common to all old/ directories:

- Location: `{same-directory}/old/`
- Append datetime to filename: `{original-filename}-{YYYYMMDD}-{HHMMSS}.md`
- Maintain the name from the original file minus the timestamp portion (for recognizability)

---

# 4. Block Structure

All managed `.md` files follow the following 4-part structure. **The Common Block and the Form Block share one YAML frontmatter; the Detail Block and the Footer are in the body.**

**Block diagram:**

```mermaid
graph TD
    A["Common Block<br/>Shared across all file_types<br/>Top level of the frontmatter"]
    B["Form Block<br/>file_type-specific<br/>Under the namespace key"]
    C["Detail Block<br/>Detailed description zone<br/>Markdown body"]
    D["Footer<br/>Change history<br/>Table at the end of the body"]

    A -->|"same frontmatter"| B
    B -->|"closes the frontmatter"| C
    C -->|"next"| D
```

The role of each block is clear. The Common Block identifies the file, the Form Block defines file-type-specific structured formats (structures that AI should follow), the Detail Block describes detailed explanations, rationale, and evidence, and the Footer tracks change history. **Structured values sit in the frontmatter and prose sits in the body**, so the part a machine reads and the part a person reads are separated without any parsing.

**A file carries exactly one Form Block (MUST). Repeated entries belong to a table in the Detail Block.** All 37 file_types in §9 take this shape, and what a Form Block holds is a **document-level attribute** such as a count, a status or an id. The `test-plan` Form Block, for instance, holds `test_case_count`, while the list of test cases lives in a Detail Block table. `wbs`, `traceability`, `risk-register`, `threat-model` and `license-report` are the same shape. **This rule is what makes a parser that has to detect repeated Form Blocks unnecessary.**

## 4.1 Information Placement Criteria

When determining which block to place new information in, use the following criteria.

**Placement criteria table:**

| Block | Decision Test | Nature | Purpose / Users |
|-------|-----------|------|--------|
| **Common Block** | "Is this field the same across all file types?" -> Yes | File identity | The framework itself (file discovery, routing) |
| **Form Block** | "Will an agent parse this value to make a decision/action?" -> Yes | Structured state/metrics specific to the file type | Other agents (decision-making, gates, dashboards) |
| **Detail Block** | "Is this detailed explanation, rationale, or evidence?" -> Yes | The body of domain knowledge | Humans + agents (for understanding, not routing) |
| **Footer** | "When, who changed what?" -> Yes | Change history (append-only) | Auditing (traceability, debugging) |

**Decision flowchart:**

```mermaid
flowchart TD
    Start["Which Block to place<br/>new information in?"] -->|"Start decision"| Q1{"Same field across<br/>all file_types?"}
    Q1 -->|"Yes"| Common["Common Block"]
    Q1 -->|"No"| Q2{"Will an agent<br/>parse and make<br/>decisions/actions?"}
    Q2 -->|"Yes"| Q3{"Is the value<br/>quantitative<br/>or enum?"}
    Q3 -->|"Yes"| Type["Form Block"]
    Q3 -->|"No_qualitative"| Split["Separate:<br/>enum to Form Block<br/>details to Detail Block"]
    Q2 -->|"No"| Q4{"Change history?"}
    Q4 -->|"Yes"| Footer["Footer"]
    Q4 -->|"No"| Detail["Detail Block"]
```

This flowchart shows the procedure for determining Block placement of information. The most confusing branch is Q2->Q3, where information is "used by agents but qualitative" and needs to be separated into enum and Detail Block.

**Three principles when in doubt:**

1. **Numeric values and enums go in Form Block.** If there is any possibility of use in dashboards or gates, normalize and place in Form Block rather than deriving from Detail Block
2. **Qualitative descriptions go in Detail Block.** However, if something "appears qualitative but can be classified by enum," separate the enum into Form Block and details into Detail Block
3. **When in doubt, lean toward Form Block.** Extracting information from free-form Detail Block is fragile. Structurize what can be structured

## 4.2 Placement Decision Examples

### Example 1: threat-model.md (Threat Model)

security-reviewer creates a threat model. Other agents reference it for implementation.

| Information | Candidates | Decision | Rationale |
|------|------|------|------|
| File purpose | Common? Form? | **Common** (`purpose`) | Field shared across all file types |
| Adopted threat analysis methodology (STRIDE, DREAD, etc.) | Form? Detail? | **Form Block** (`threat-model:methodology`) | Agent parses to determine methodology. Can also be displayed on dashboard |
| Total number of identified threats | Form? Detail? | **Form Block** (`threat-model:threat_count`) | Numeric metric. Aggregated by progress-monitor |
| Number of unmitigated Critical threats | Form? Detail? | **Form Block** (`threat-model:unmitigated_critical_count`) | Used by technical-authority for the gate decision (-> §9.4.1 GATE-DESIGN) |
| Per-threat details (attack vectors, impact, mitigations) | Form? Detail? | **Detail Block** | Detailed analysis content. Not parsed for decisions |

**Decision point:** The "total number of threats" could be counted from Detail Block tables, but having a normalized value in Form Block ensures reliable machine readability.

### Example 2: wbs.md (WBS)

progress-monitor manages the WBS. orchestrator references it for phase progression decisions.

| Information | Candidates | Decision | Rationale |
|------|------|------|------|
| Total task count | Form? Detail? | **Form Block** (`wbs:task_total`) | Input for completion rate calculation |
| Completed task count | Form? Detail? | **Form Block** (`wbs:task_completed`) | Displayed on dashboard |
| WBS completion rate | Form? Detail? | **Form Block** (`wbs:completion_pct`) | Derivable from the two rows above, but orchestrator uses it immediately for progression decisions |
| Details of each task (assignee, duration, dependencies) | Form? Detail? | **Detail Block** | Task details are domain knowledge |

**Decision point:** The completion rate can be derived from the task table in Detail Block, but even derived values belong in Form Block if agents use them immediately for decisions.

### Example 3: executive-dashboard.md (Executive Dashboard)

progress-monitor updates the project-wide summary. Users grasp the situation at a glance.

| Information | Candidates | Decision | Rationale |
|------|------|------|------|
| Current phase | Form? Detail? | **Form Block** (`executive-dashboard:phase`) | Synced with pipeline-state |
| Overall project completion rate | Form? Detail? | **Form Block** (`executive-dashboard:completion_pct`) | Numeric metric |
| Overall health status (green/yellow/red) | Form? Detail? | **Form Block** (`executive-dashboard:health`) | orchestrator determines whether to escalate |
| Current blocker (empty if none) | Form? Detail? | **Form Block** (`executive-dashboard:blocker`) | Escalation if not empty. It holds a summary rather than a count because pipeline-state:blocked already carries the machine-readable blocking state |
| Detailed summary per phase | Form? Detail? | **Detail Block** | Summary text for humans to read |

**Decision point:** The dashboard has a large Form Block, but that is correct. The raison d'etre of this file is "aggregation of structured status."

### Example 4: final-report.md (Final Report)

orchestrator creates it in the delivery phase. Material for users to decide on project closure.

| Information | Candidates | Decision | Rationale |
|------|------|------|------|
| Final test pass rate and coverage | Form? Detail? | **Neither** (refer to `progress:test_pass_rate` / `progress:coverage_pct`) | Do not copy a measurement another file_type already owns. The same value in two places with different owners always drifts |
| Unresolved defect count | Form? Detail? | **Form Block** (`final-report:open_defect_count`) | Input for the project closure decision (-> §9.4.1 GATE-DELIVERY) |
| Total API cost | Form? Detail? | **Form Block** (`final-report:total_cost_usd`) | Input for the acceptance decision and the next estimate |
| Goal achievement assessment | Form? Detail? | **Separate**: enum (`final-report:goal_achievement`: achieved/partially-achieved/not-achieved) -> **Form Block**, details -> **Detail Block** | Appears qualitative but can be classified by enum |
| Remaining issues / technical debt list | Form? Detail? | **Detail Block** | Detailed list |
| Lessons Learned | Form? Detail? | **Detail Block** | Entirely free-form |

**Decision point:** "Goal achievement assessment" appears qualitative, but separate the enum classification into Form Block and detailed explanation into Detail Block.

### Example 5: user-order.md / {project}-spec.md (Specifications)

srs-writer creates Ch1-2, architect details Ch3-6.

| Information | Candidates | Decision | Rationale |
|------|------|------|------|
| Specification format (ANMS/ANPS) | Form? Detail? | **Form Block** (`spec-foundation:spec_format`) | Agent determines reading method |
| Completed chapters (within Ch1-2) | Form? Detail? | **Form Block** (`spec-foundation:completed_chapters`) | architect determines if handoff is possible. Different concept from document_status (entire document vs. chapter-level) |
| Completed chapters | Form? Detail? | **Form Block** (`spec-architecture:completed_chapters`) | architect determines work start position |
| Functional requirement count / Non-functional requirement count | Form? Detail? | **Form Block** (`spec-foundation:fr_count`, `spec-foundation:nfr_count`) | Denominator for traceability coverage calculation |
| Full text of Ch1-6 | Form? Detail? | **Detail Block** | Specification body following ANMS/ANPS format |

**Decision point:** Common Block + Form Block are "metadata about the file as a specification." The ANMS chapter structure is "the content of the specification." Metadata and content are different layers and do not constitute double management.

### Example 6: performance-report-NNN-*.md (Performance Test Report)

test-engineer creates after k6 execution. Comparison results against NFR targets.

| Information | Candidates | Decision | Rationale |
|------|------|------|------|
| Number of test scenarios | Form? Detail? | **Form Block** (`performance-report:scenario_count`) | Aggregated on dashboard |
| NFR achievement rate (pass/total) | Form? Detail? | **Form Block** (`performance-report:nfr_pass_rate`) | testing phase fails if not 100% |
| P99 latency | Form? Detail? | **Form Block** (`performance-report:p99_latency_ms`) | SLA exceedance alert decision |
| Detailed results per scenario | Form? Detail? | **Detail Block** | Table of latency, throughput, error rate |
| k6 script configuration parameters | Form? Detail? | **Detail Block** | Test condition records (for reproducibility) |

---

## 4.3 Status Value Naming Convention

Status values (enum field choices) in this framework MUST follow these meta-rules.

### 4.3.1 Lifecycle Model

All statuses are classified into one of four states.

| # | State | Meaning | English Pattern | Japanese Pattern |
|:-:|-------|---------|----------------|-----------------|
| 1 | Not Started | Work has not begun | Adjective / noun (open, draft) | ○○前 / 未○○ |
| 2 | In Progress | Work is actively underway | in-{noun} (in-review, in-analysis) | ○○中 |
| 3 | Waiting | Blocked pending external input | waiting-for-{noun} / needs-{noun} / blocked | ○○待 |
| 4 | Completed | Work is finished | Past participle (approved, fixed, closed) | ○○済 |

> **Note:** Judgment results such as `pass / fail` are binary outcomes, not lifecycle states, and are therefore exempt from this convention.

```mermaid
stateDiagram-v2
    [*] --> NotStarted
    NotStarted --> InProgress : start
    InProgress --> Waiting : external input required
    Waiting --> InProgress : input received
    InProgress --> Completed : finish
    Completed --> [*]
```

### 4.3.2 Naming Rules

1. **Values are kebab-case, English only** — per Language Policy (§12), status values are never translated
2. **"In Progress" uses `in-{noun}`** — the subject of a status is an item (document, defect, etc.), not a person; `-ing` form implies the item is the actor (e.g., ✗ `reviewing` → ✓ `in-review`)
3. **"Completed" uses past participle** — completion is a "resulting state", not an "action" (e.g., approved, fixed, closed)
4. **"Waiting" specifies what is awaited** — use `waiting-for-{noun}` / `needs-{noun}`; `blocked` is reserved for unknown or external-cause stalls

### 4.3.3 Cross-Process Transition Rules

When completion of Process A triggers the start of Process B, three patterns apply.

| Pattern | Condition | Transition | Example |
|---------|-----------|------------|---------|
| Immediate | No decision needed, same owner | A-done → B-wip (A-done is logged but not a resting state) | fixed → in-retest |
| Decision Branch | Multiple destinations | A-done lingers → decision routes to next state (record as decision) | reviewed → {in-fix / deferred / accepted} |
| Owner Handoff | Next owner differs | A-done → B-wait → B-wip ("wait" is mandatory) | implemented → waiting-for-review → in-review |

**Decision criteria:**

1. Are there multiple destinations? → Yes: **Decision Branch**
2. Does the owner change? → Yes: **Owner Handoff**
3. Neither → **Immediate**

```mermaid
stateDiagram-v2
    state "Process A" as A {
        A_wip : in-progress
        A_done : completed
        A_wip --> A_done : finish
    }
    state "Process B" as B {
        B_wait : waiting
        B_wip : in-progress
        B_wait --> B_wip : start
    }

    A_done --> B_wip : Immediate
    A_done --> A_done : Decision Branch (lingers)
    A_done --> B_wait : Owner Handoff
```

---

# 5. Common Block Specification

The Common Block is written as **YAML frontmatter**. It MUST be placed at the top of the file, delimited by `---`. A bespoke tag format MUST NOT be used.

**The container format follows Open Knowledge Format (OKF) v0.2.** The former `<doc:field>` form required a dedicated parser, whereas YAML frontmatter is read as-is by `yq`, Python, JS, GitHub rendering and most editors. **Do not build your own where a standard exists.**

**Key order (optimized for the AI reading flow):**

```
-- OKF core (what this is) --
okf_version -> type -> description
-- Identification (how to read it) --
-> schema_version -> language
-- State (may I touch it) --
-> document_status -> document_version
-- Workflow (is this my job) --
-> owner -> commissioned_by -> consumed_by
-- Context (what is this about) --
-> project -> purpose
-- References (what is related) --
-> related_docs -> sources
-- Provenance and update (when, by whom) --
-> generated -> updated
-- file_type specific --
-> {namespace}
```

**Key definitions:**

| Key | Type | Required | Class | Description |
|-----|------|----------|-------|-------------|
| okf_version | string | Yes | OKF | The OKF version this conforms to. Currently `"0.2"` |
| type | string | Yes | OKF | One of the registered file types (see Section 7). **The only key OKF requires** |
| description | string | Yes | OKF | A concise description of the file contents |
| schema_version | string | Yes | Extension | This framework's schema version (currently `"0.1"`) |
| language | string (ISO 639-1) | Yes | Extension | The language this file is written in (e.g. `ja`, `en`, `fr`) |
| document_status | enum: draft / in-review / approved / archived | Yes | Extension | Document lifecycle status. **OKF's `status` is not used** (its value range differs) |
| document_version | string | Yes | Extension | Version number in `{major}.{minor}` form (e.g. `1.2`). **The filename stays fixed; the version lives in this key** |
| owner | actor | Yes | Extension | The actor holding write permission. Follows the notation in 5.1 |
| commissioned_by | string | Yes | Extension | What triggered this document (values: `user`, `orchestrator`, `phase-{name}`, or `{agent-name}`) |
| consumed_by | list | Yes | Extension | The agents that use this document next. **Written as a YAML list** (repeating a tag is no longer needed) |
| project | string | Yes | Extension | Project name |
| purpose | string | Yes | Extension | Why this file exists and what action is expected |
| related_docs | list | No | Extension | References to input/output/next files. Each entry's key is `ref` / `input` / `output` / `next` |
| sources | list | No | OKF | Where quoted figures and others' judgements came from. See 5.2 |
| generated | map | Yes | OKF | `by` (the actor that created it) and `at` (ISO 8601, UTC) |
| updated | map | Yes | Extension | `by` and `at`, refreshed on every write (Section 6) |
| {namespace} | map | Per file_type | Extension | The file-type-specific Form Block (Section 9), nested under the namespace name |

**Common Block template:**

```yaml
---
okf_version: "0.2"
type: {file_type}
description: {summary}

schema_version: "0.1"
language: {language_code}

document_status: draft
document_version: "0.1"

owner: {actor}
commissioned_by: {trigger}
consumed_by:
  - {agent-name}

project: {project-name}
purpose: {purpose}

related_docs:
  - ref: {path-to-related-file}

sources:
  - id: {citation-id}
    resource: {path-or-url}
    author: {actor}
    last_modified: {YYYY-MM-DD}

generated:
  by: {actor}
  at: {ISO-8601-timestamp}
updated:
  by: {actor}
  at: {ISO-8601-timestamp}

{namespace}:
  {field_name}: {value}
---
```

**related_docs keys:**

| Key | Meaning |
|---------|------|
| `ref` | General reference (default) |
| `input` | A file this document consumes |
| `output` | A file this document produces |
| `next` | The next file in sequence (e.g. the next handoff) |

**Correspondence with the former format:**

| Former (`<doc:>` tag form) | New (frontmatter) |
|---|---|
| `file_type` | `type` |
| `summary` | `description` |
| `created_by` + `created_at` | `generated.by` + `generated.at` |
| `updated_by` + `updated_at` (Footer) | `updated.by` + `updated.at` |
| Form Block `<ns:field>` | `{ns}.{field}` |
| The remaining 9 fields | Extension keys under the same name |

**When `okf_version` may be declared:** the OKF producer conformance condition is that every `.md` has parseable frontmatter and a non-empty `type`. A file created under this specification satisfies it. **In a project where files in the former format remain, the declaration is not true until the conversion is finished. It MUST NOT be declared before that.**

## 5.1 Actor Notation

`owner`, `generated.by`, `updated.by`, the `by` of a change_log entry and the approver of a decision MUST be written in one of these three forms.

| Form | Meaning | Example |
|-----|------|---|
| `{agent-name}` | An agent did it | `architect` |
| `human:{id}` | A human did it | `human:product-owner` |
| `process:{id}` | An automated process that is not an agent did it | `process:gate-guard` |

**Why:** previously only an agent name fitted, so **human approval and machine generation could not be told apart.** A waiver may carry user approval, but that fact appeared only in prose and no machine could judge it. Splitting the three forms makes "did a human confirm this" readable from the structure.

## 5.2 sources

**Attach it only to quoted figures and to quoted judgements of others (MUST).** Requiring it everywhere inflates the volume of writing and leaves the rules pushing only in the direction of more.

| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `id` | string | Yes | The identifier the body cites |
| `resource` | string | Yes | A file path or URL |
| `author` | string | No | Who produced it. Follows the actor notation in 5.1 |
| `last_modified` | string | No | Date last modified (`YYYY-MM-DD`) |

The body cites this `id`. **Because there was nowhere to record which figure came from where, the provenance itself became the point of contention in a report.** This is the smallest structure that prevents a repeat.

---

# 6. Footer Specification

**The updating actor and timestamp live in the frontmatter `updated` key** (Section 5). All the Footer carries is the change history.

The change_log is written as **a table at the end of the body**, not in the frontmatter: it grows with every append, which would take the frontmatter out of its role as a set of document-level attributes.

**Footer template:**

```markdown
## Change Log

| at | by | action |
|---|---|---|
| {ISO-8601-timestamp} | {actor} | created |
```

**change_log rules:**

- Append-only: modifying or deleting an existing row is NEVER permitted
- Every write operation MUST add a new row, and MUST refresh the frontmatter `updated` key at the same time
- `by` MUST follow the actor notation in 5.1. **This column is the only place a machine can judge that a human approved something**
- `action` describes what changed (e.g. "created", "updated phase to 2", "archived previous version to old/")

## 6.1 Checking Dependents on Revision

**A revision is not finished when the diff is applied (MUST).** Check whether the existing descriptions that depend on what changed have gone stale, and record the result in the change_log.

The `change_log` records what was changed, but **nobody looks at whether the change left a dependent description out of date.** In the trial, a retrospective identified this pattern as structural after planning, nothing was changed in the rules, and the same pattern produced seven fresh instances during design.

**Kinds of description to check:**

| Kind | Count in the trial | What a miss produces |
|---|:-:|---|
| Diagrams (class, sequence, state, branching) | **4** | Prose and diagram disagree, and a reader cannot tell which one is current |
| The Consequences of an ADR | 1 | The consequences of a decision keep an outdated premise |
| Lines in the body stating an impact | 1 | The stated scope of impact is narrower than reality |
| Identifiers in code | 1 | The name in the specification drifts from the name in the implementation |

**How to record it:** state in the `action` column which kinds were checked and what came of it (e.g. `"updated Ch3.2; checked diagrams (2 updated), ADR consequences (no change)"`).

**The limit of this rule:** it is self-reported, and **a kind not on the list is still missed.** What it buys is that, with the kinds enumerated, "not checked" becomes visible. It is a rule for visibility, not for completeness.

---

# 7. File Types (Common Block Managed)

**Namespace naming convention:** Namespaces use the file_type name as-is. Abbreviations are prohibited (e.g., ~~`cr:`~~ -> `change-request:`). As a rule, 2 words or fewer, maximum 3 words. **The Common Block has no namespace and sits at the top level of the frontmatter.** When a category has sub-types, place the category first (e.g., `spec-foundation:`, `spec-architecture:`).

**What the tiers mean:**

| Tier | Meaning |
|------|---------|
| Core | Always produced, in every project. Never exempt by scale |
| Standard | Produced by the standard process. Follows the exemption matrix in §3.1.1 |
| Conditional | Produced only when the corresponding conditional process is enabled |

There is no need to learn all 37 file_types at once. **Understanding the nine Core ones is enough to run the pipeline.**

| file_type | Namespace | Purpose | Directory | Singleton? | Tier |
|-----------|---------|------|-------------|:----------:|:----:|
| pipeline-state | `pipeline-state:` | Pipeline orchestration state | `project-management/` | Yes | Core |
| handoff | `handoff:` | Inter-agent task handoff | `project-management/handoff/` | No | Standard |
| progress | `progress:` | Project progress and metrics | `project-management/progress/` | No | Standard |
| interview-record | `interview-record:` | Interview record | `project-management/` | Yes | Standard |
| wbs | `wbs:` | WBS / Gantt chart | `project-management/progress/` | Yes | Standard |
| test-plan | `test-plan:` | Test plan | `project-management/` | Yes | Standard |
| review | `review:` | Code/design review results | `project-records/reviews/` | No | Core |
| decision | `decision:` | Architecture decision record | `project-records/decisions/` | No | Core |
| tech-decision | `tech-decision:` | Technical ruling and quality gate decision record | `project-records/tech-decisions/` | No | Core |
| governance-change-log | `governance-change-log:` | Record of changes applied to governance files | `project-records/governance/` | No | Standard |
| deployment-design | `deployment-design:` | Deployment design (environments, procedure, rollback) | `docs/operations/` | Yes | Standard |
| risk-register | `risk-register:` | Risk register (aggregate of individual risks) | `project-records/risks/` | Yes | Standard |
| risk | `risk:` | Risk entry and register | `project-records/risks/` | No | Standard |
| defect | `defect:` | defect tracking | `project-records/defects/` | No | Core |
| change-request | `change-request:` | Change request management | `project-records/change-requests/` | No | Standard |
| traceability | `traceability:` | Requirement-to-test tracing | `project-records/traceability/` | Yes | Standard |
| license-report | `license-report:` | License compatibility report | `project-records/licenses/` | Yes | Standard |
| performance-report | `performance-report:` | Performance test results report | `project-records/performance/` | No | Standard |
| spec-foundation | `spec-foundation:` | Specification Ch1-2 (Foundation, Requirements) | `docs/spec/` | Yes | Core |
| spec-architecture | `spec-architecture:` | Specification Ch3-6 (Architecture, Specification, Test Strategy, Design Principles) | `docs/spec/` | Yes | Core |
| threat-model | `threat-model:` | Threat model | `docs/security/` | Yes | Standard |
| security-architecture | `security-architecture:` | Security design | `docs/security/` | Yes | Standard |
| observability-design | `observability-design:` | Observability design | `docs/observability/` | Yes | Standard |
| hw-requirement-spec | `hw-requirement-spec:` | HW requirement specification (conditional; inherits external-dependency-spec) | `docs/hardware/` | Yes | Conditional |
| ai-requirement-spec | `ai-requirement-spec:` | AI/LLM requirement specification (conditional; inherits external-dependency-spec) | `docs/ai/` | Yes | Conditional |
| framework-requirement-spec | `framework-requirement-spec:` | Framework requirement specification (conditional; inherits external-dependency-spec) | `docs/framework/` | Yes | Conditional |
| executive-dashboard | `executive-dashboard:` | Project-wide dashboard | Root | Yes | Standard |
| final-report | `final-report:` | Project final report | Root | Yes | Core |
| user-order | `user-order:` | User input specification (3-question format) | Root | Yes | Core |
| user-manual | `user-manual:` | End-user operation manual | `docs/` | Yes | Standard |
| security-scan-report | `security-scan-report:` | Security scan results (SAST/SCA/DAST/manual) | `project-records/security/` | No | Standard |
| runbook | `runbook:` | Runbook (daily operations, incident response) | `docs/operations/` | Yes | Standard |
| incident-report | `incident-report:` | Production incident record and post-mortem | `project-records/incidents/` | No | Standard |
| disaster-recovery-plan | `disaster-recovery-plan:` | Disaster recovery plan (RPO/RTO, recovery procedures) | `docs/operations/` | Yes | Conditional |
| stakeholder-register | `stakeholder-register:` | Stakeholder register (recommended process) | `project-management/` | Yes | Conditional |
| retrospective-report | `retrospective-report:` | Retrospective and process improvement record | `project-records/improvement/` | No | Standard |
| field-issue | `field-issue:` | Field testing feedback management (defect / CR unified). Conditional: field testing enabled | `project-records/field-issues/` | No | Conditional |

### external-dependency-spec (External Dependency Requirement Specification Template)

A common template for requirement specifications targeting external dependencies (the Framework layer in Clean Architecture). The following 3 concrete file_types inherit from this template.

**Inheritance hierarchy:**

```
external-dependency-spec (abstract template)
  ├── hw-requirement-spec (physical devices: embedded/IoT)
  ├── ai-requirement-spec (AI/LLM: inference/generation services)
  └── framework-requirement-spec (DB/Web/infra, etc.: only when non-standard I/F)
```

**Common Detail Block chapter structure (inherited by all child types):**

| Chapter | Content | Description |
|:--:|------|------|
| 1 | Purpose | What this external dependency achieves |
| 2 | Requirements | Capabilities and performance SW demands |
| 3 | I/F Definition | Boundary of the SW-side Adapter layer. This corresponds to SW Spec Ch3 |
| 4 | Constraints | Restrictions the external dependency imposes on SW |
| 5 | Replacement Strategy | Alternatives and migration impact. Rationale for abstraction via DIP |
| 6 | Other | Procurement, cost, revision management, etc. |

**Applicability decision:** During planning phase interviews, identify "what is an external dependency and what is our own original work." Create a dedicated requirement-spec for external dependencies with low I/F standardization. For high I/F standardization (standard SQL, official framework APIs, etc.), recording the selection rationale in `project-records/decisions/` is sufficient.

---

## 7.1 Workflow Reference Table

Standard values for `commissioned_by` (creation trigger) and `consumed_by` (next consumer) for each file_type. Agents fill in these Common Block fields when creating files according to the following.

**commissioned_by value patterns:**

| Value | Meaning |
|---|------|
| `user` | Directly created by the user |
| `orchestrator` | Created by orchestrator as part of its own responsibilities |
| `phase-{name}` | Triggered by phase transition per process rules |
| `{agent-name}` | Triggered by an event from a specific agent |

**Phase names:**

| Phase Name | Meaning |
|-----------|------|
| `phase-setup` | Setup and process evaluation |
| `phase-planning` | Planning (interview and specification) |
| `phase-dependency-selection` | External dependency evaluation, selection, and procurement |
| `phase-design` | Design |
| `phase-implementation` | Implementation |
| `phase-testing` | Testing |
| `phase-delivery` | Delivery |
| `phase-operation` | Operation and maintenance |

**Workflow reference table:**

| file_type | commissioned_by | consumed_by | owner |
|-----------|----------------|-------------|-------|
| pipeline-state | `orchestrator` | All agents | orchestrator |
| handoff | Phase transition (e.g., `phase-planning`) | to-agent | orchestrator |
| progress | `phase-design` (updated thereafter) | orchestrator, user | progress-monitor |
| interview-record | `phase-planning` | architect, orchestrator | srs-writer |
| wbs | `phase-design` | progress-monitor, orchestrator | progress-monitor |
| test-plan | `phase-design` | test-engineer, review-agent | test-engineer |
| review | Phase gate (e.g., `phase-planning`) | orchestrator, target agent | review-agent |
| decision | Agent that needed the decision | All agents | orchestrator |
| tech-decision | When a gate decision or technical ruling is requested | Main session, orchestrator, all implementation agents | technical-authority |
| governance-change-log | When an improvement is applied | orchestrator, user, process-improver | decree-writer |
| deployment-design | `phase-design` | implementer, runbook-writer, technical-authority | architect |
| risk-register | `phase-planning` (updated thereafter) | orchestrator, technical-authority | risk-manager |
| risk | `phase-planning` | risk-manager, orchestrator | risk-manager |
| defect | `test-engineer` | Agent assigned to fix | test-engineer |
| change-request | `user` (user-initiated change requests only) | change-manager, orchestrator | change-manager |
| traceability | `phase-implementation` | review-agent | test-engineer |
| license-report | `phase-implementation` | orchestrator, security-reviewer | license-checker |
| performance-report | `phase-testing` | review-agent, orchestrator | test-engineer |
| spec-foundation | `phase-planning` | architect, review-agent | srs-writer |
| spec-architecture | `phase-design` | Implementation agents, review-agent | architect |
| threat-model | `phase-design` | architect, implementation agents | security-reviewer |
| security-architecture | `phase-design` | architect, implementation agents | security-reviewer |
| observability-design | `phase-design` | Implementation agents | architect |
| hw-requirement-spec | `phase-design` | architect (Adapter layer design), test-engineer (integration test planning) | architect |
| ai-requirement-spec | `phase-design` | architect (Adapter layer design), implementation agents | architect |
| framework-requirement-spec | `phase-design` | architect (Adapter layer design), implementation agents | architect |
| executive-dashboard | `phase-setup` | User, orchestrator | orchestrator |
| final-report | `phase-delivery` | User | orchestrator |
| user-order | `user` | srs-writer | srs-writer |
| security-scan-report | `phase-implementation` (ad hoc thereafter) | review-agent, orchestrator | security-reviewer |
| user-manual | `phase-delivery` | User | user-manual-writer |
| runbook | `phase-delivery` | Operations team | runbook-writer |
| incident-report | `phase-operation` (ad hoc) | orchestrator, user | incident-reporter |
| disaster-recovery-plan | `phase-design` | Operations team, orchestrator | architect |
| stakeholder-register | `phase-setup` | All agents | orchestrator |
| retrospective-report | Phase completion (ad hoc) | orchestrator | process-improver |
| field-issue | During field testing (as needed) | orchestrator, implementer, test-engineer | field-test-engineer |

---

# 8. Namespace Prefixes

A namespace groups the Form Block keys of one file_type and keeps extension keys from colliding. In the frontmatter the namespace is a mapping key, and the fields sit under it. See section 7 for naming conventions.

**The Common Block has no namespace.** The former `doc:` namespace is retired: every key in Section 5 sits at the top level of the frontmatter.

| Namespace | Usage Location | Example |
|---------|----------|-----|
| `pipeline-state:` | pipeline-state Form Block | `pipeline-state.phase: 2` |
| `handoff:` | handoff Form Block | `handoff.from: srs-writer` |
| `progress:` | progress Form Block | `progress.completion_pct: 45` |
| `interview-record:` | interview-record Form Block | `interview-record.interview_status: completed` |
| `wbs:` | wbs Form Block | `wbs.task_total: 24` |
| `test-plan:` | test-plan Form Block | `test-plan.test_level: unit,integration,e2e` |
| `review:` | review Form Block | `review.result: pass` |
| `decision:` | decision Form Block | `decision.id: DEC-001` |
| `risk:` | risk Form Block | `risk.score: 6` |
| `defect:` | defect Form Block | `defect.severity: high` |
| `change-request:` | change-request Form Block | `change-request.impact_level: medium` |
| `traceability:` | traceability Form Block | `traceability.coverage_pct: 85` |
| `license-report:` | license-report Form Block | `license-report.compatible_count: 12` |
| `performance-report:` | performance-report Form Block | `performance-report.nfr_pass_rate: 100%` |
| `spec-foundation:` | spec-foundation Form Block | `spec-foundation.fr_count: 15` |
| `spec-architecture:` | spec-architecture Form Block | `spec-architecture.completed_chapters: 3,4` |
| `threat-model:` | threat-model Form Block | `threat-model.threat_count: 8` |
| `security-architecture:` | security-architecture Form Block | `security-architecture.owasp_coverage: 10/10` |
| `observability-design:` | observability-design Form Block | `observability-design.log_format: structured-json` |
| `hw-requirement-spec:` | hw-requirement-spec Form Block | `hw-requirement-spec.interface_count: 4` |
| `ai-requirement-spec:` | ai-requirement-spec Form Block | `ai-requirement-spec.model_capability: reasoning,code-generation` |
| `framework-requirement-spec:` | framework-requirement-spec Form Block | `framework-requirement-spec.framework_name: PostgreSQL` |
| `executive-dashboard:` | executive-dashboard Form Block | `executive-dashboard.health: green` |
| `final-report:` | final-report Form Block | `final-report.goal_achievement: achieved` |
| `user-order:` | user-order Form Block | `user-order.format: ANMS` |
| `security-scan-report:` | security-scan-report Form Block | `security-scan-report.scan_type: sast` |
| `user-manual:` | user-manual Form Block | `user-manual.target_audience: end-user` |
| `runbook:` | runbook Form Block | `runbook.last_drill_date: 2026-03-15` |
| `incident-report:` | incident-report Form Block | `incident-report.severity: P1` |
| `disaster-recovery-plan:` | disaster-recovery-plan Form Block | `disaster-recovery-plan.rto_hours: 4` |
| `stakeholder-register:` | stakeholder-register Form Block | `stakeholder-register.stakeholder_count: 5` |
| `retrospective-report:` | retrospective-report Form Block | `retrospective-report.approval_status: proposed` |
| `field-issue:` | field-issue Form Block | `field-issue.type: defect` |

---

# 9. Form Block Specification

The Form Block lives in the same frontmatter as the Common Block, **nested under the file_type's namespace as a key.**

**The `{namespace}:{field_name}` in a Fields table names a position in the frontmatter.** `test-plan:coverage_target_pct` means:

```yaml
test-plan:
  coverage_target_pct: 80
```

The correspondence is uniform across all 37 file_types, so the Fields tables below read as they stand.

## 9.0 Form Block Definition Meta-Template

When defining a new Form Block, the following 2-section structure MUST be followed.

**Meta-template:**

```
## 9.N {file_type} (Namespace: {namespace}:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| {namespace}:{field_name} | {type} | {Yes/No} | {description} | {enum values, range, trigger conditions} |

### Detail Block Guidance

{Instructions for the sections and content that should be described in the Detail Block for this file type}
```

**Responsibilities of each section:**

| Section | Responsibility | Content |
|-----------|------|---------|
| **Fields** | Definition of structured formats that AI should follow | Field names, types, required/optional, descriptions, value ranges (enum values, numeric ranges), constraints (escalation conditions, gate conditions, etc.) |
| **Detail Block Guidance** | Structural constraints for the Detail Block | Recommended section headings, content to be described in each section, description formats to adopt (ADR format, table format, etc.) |

**Items NOT included in the meta-template (managed by Common Block or section 7):**

| Information | Management Location | Rationale |
|------|---------|------|
| file_type, owner | Common Block | Fields shared across all types |
| document_status | Common Block | Fields shared across all types |
| commissioned_by, consumed_by | Common Block | Fields shared across all types |
| document_version | Common Block | Fields shared across all types |
| Namespace, singleton, directory | Section 7 file_type table | Type registration information |
| Number of Form Blocks | Section 4 | **An invariant shared by every type (one per file).** Not declared per type |

**Rules for the "Value Range / Constraints" column in the Fields table:**

- Enum values: List with slash separation (e.g., `open / in-fix / closed`)
- Numeric range: Specify the range explicitly (e.g., `0-100`)
- Trigger conditions: Describe the result with `->` (e.g., `>=6 -> notify user`)
- Gate conditions: **reference the gate ID in Process Rules §9.4.1** (e.g. `-> Process Rules §9.4.1 GATE-DESIGN`). Do not write the threshold itself here. §9.4.1 is the single source of truth for gate conditions, and writing them in several places guarantees drift

### 9.0.1 Designing a Value Range (MUST)

When defining an enum, consider whether each of these four **meta-states** can be observed, and MUST either include it in the range or record why it is excluded.

| Meta-state | Meaning | What happened in the trial |
|---|---|---|
| **Not applicable** | The concept does not apply to this case | `tech-decision:verdict` had no such value, so it was written as prose in the Detail Block |
| **Undecided** | Not settled yet | `spec-foundation` had no chapter-level approval state, so a decision stood in for it |
| **Unmeasurable** | Measurement was attempted and produced no value | `final-report:total_cost_usd` required a number, leaving nowhere to say "not measured" |
| **Finished** | The subject completed or was abandoned and will not transition again | `pipeline-state` had no completed state, so **it stayed `pending` even after GATE-DELIVERY passed** |

**Why:** five events of this shape occurred in the trial, every one of them from listing the healthy values and omitting the meta-states. **In four the agent recognised the value was out of range and recorded prose instead. The one that left no record at all was the one with nowhere to write back to.**

**Record the decision to exclude, too.** It is what later distinguishes "considered and judged unnecessary" from "never considered".

---

## 9.1 pipeline-state (Namespace: pipeline-state:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| pipeline-state:phase | int | Yes | Current phase | 0-7 |
| pipeline-state:phase_label | string | Yes | Human-readable phase name | — |
| pipeline-state:step | string | Yes | Current step ID | — |
| pipeline-state:step_label | string | Yes | Step description | — |
| pipeline-state:phase_progress | string | Yes | "completed/total" for the current phase | — |
| pipeline-state:active_agents | list | Yes | Tasks and start times of active agents | Entry format below |
| pipeline-state:blocked | boolean | Yes | Is progress blocked? | true / false |
| pipeline-state:blocked_by | string | No | Blocking condition | — |
| pipeline-state:needs_human | boolean | Yes | Waiting for user? | true / false |
| pipeline-state:human_action | string | No | Action the user should take | — |
| pipeline-state:current_gate | list | No | Active quality gate. **Write it as a YAML list** (the transition out of planning carries both GATE-INTERVIEW and GATE-PLANNING). Do not use a single comma-separated string | — |
| pipeline-state:gate_result | enum | No | Gate result | pending / pass / fail |
| pipeline-state:gate_fail_target | string | No | Fallback phase on gate failure | — |
| pipeline-state:latest_handoff | string | No | Path to the latest handoff file | — |
| pipeline-state:project_status | enum | Yes | State of the project as a whole | in-progress / completed / aborted. **Do not express this by widening `phase`**, which would put something that is not a phase into a phase's range |

**active_agents entry format:**

```xml
<agent name="{agent-name}" task="{task-description}" started_at="{ISO-8601}" />
```

### Detail Block Guidance

Describe phase transition log (append-only table) and free-form notes.

## 9.2 handoff (Namespace: handoff:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| handoff:id | string | Yes | handoff-NNN | — |
| handoff:from | string | Yes | Source agent | — |
| handoff:to | string | Yes | Destination agent | — |
| handoff:phase_transition | string | Yes | "N->N" phase transition | — |
| handoff:handoff_status | enum | Yes | Handoff status | ready / in-progress / completed / blocked / needs-human |

### Detail Block Guidance

Describe deliverables, human intervention requirements, and quality gate results.

## 9.3 review (Namespace: review:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| review:id | string | Yes | review-NNN | — |
| review:target | string | Yes | Review target (file path or description) | — |
| review:dimensions | string | Yes | Applied perspectives (e.g., "R1" / "R2,R4,R5,R7" / "T1-T9") | R1-R7 (quality), T1-T9 (translation consistency) |
| review:gate | string | No | The gate this review decides | GATE-XXX |
| review:purity_tag_coverage_pct | int | No | `@purity` tag coverage (required when implementation code was reviewed) | 0-100. R7.6 requires 100 |
| review:result | enum | Yes | Review result | pass / fail |
| review:critical_count | int | Yes | Number of Critical findings | -> Process Rules §9.4.1 (per-GATE conditions) |
| review:high_count | int | Yes | Number of High findings | -> Process Rules §9.4.1 (per-GATE conditions) |
| review:medium_count | int | Yes | Number of Medium findings | — |
| review:low_count | int | Yes | Number of Low findings | — |
| review:gate_phase | string | No | Phase transition this review gates (e.g., "1->2") | — |
| review:findings_resolved_count | int | Yes | Number of findings with disposition "fix" | — |
| review:findings_deferred_count | int | No | Number of findings with disposition "defer". Each requires a decision record in project-records/decisions/ | — |

### Detail Block Guidance

Describe review finding details (location, severity, proposed fix). Process Rules §9.4.1 is the single source of truth for gate conditions; no threshold is written in this document. Finding disposition tracking follows Process Rules §9.5.

**Finding Disposition Table (required in all review reports):**

| # | Severity | Finding Summary | Disposition | Reference |
|:-:|:--------:|----------------|:-----------:|-----------|
| 1 | ... | ... | fixed / deferred / accepted | Correction details or DEC-NNN |

Dispositions: **fixed** = corrected and verified, **deferred** = acknowledged but deferred (decision record required), **accepted** = accepted as-is with rationale.

## 9.4 decision (Namespace: decision:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| decision:id | string | Yes | DEC-NNN | — |
| decision:category | enum | Yes | Decision category | architecture / security / technology / process / requirement |
| decision:decision_status | enum | Yes | Decision status | proposed / approved / rejected / superseded |
| decision:approved_by | actor | No | Approver. Empty when unapproved | Actor notation from 5.1 (`human:{id}` / `process:{id}` / agent name) |

### Detail Block Guidance

Use Michael Nygard's ADR format: Status / Context / Decision / Consequences.

## 9.5 risk (Namespace: risk:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| risk:id | string | Yes | RISK-NNN | — |
| risk:probability | enum | Yes | Probability of occurrence | low(1) / medium(2) / high(3) |
| risk:impact | enum | Yes | Impact level | low(1) / medium(2) / high(3) |
| risk:score | int | Yes | probability x impact | 1-9, >=6 -> notify user |
| risk:mitigation | string | Yes | Mitigation strategy | — |
| risk:risk_status | enum | Yes | Risk status | open / mitigated / closed / accepted |
| risk:assigned_to | string | Yes | Agent or role assigned to mitigation | — |

### Detail Block Guidance

Describe detailed risk analysis (causes, impact scenarios, detailed mitigation strategies). Escalation rule: Score of 6 or higher requires user notification.

## 9.6 progress (Namespace: progress:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| progress:phase | int | Yes | Current phase (synced with pipeline-state) | 0-7 |
| progress:completion_pct | int | Yes | Overall project completion rate | 0-100 |
| progress:wbs_completed | string | Yes | "completed/total" task count | — |
| progress:test_pass_rate | string | No | "passed/total" (empty before implementation phase) | — |
| progress:coverage_pct | int | No | Code coverage % (empty before design phase) | 0-100 |
| progress:defect_open_critical | int | Yes | Number of open Critical defects | — |
| progress:defect_open_high | int | Yes | Number of open High defects | — |
| progress:cost_spent_usd | number | Yes | API cost consumed | — |
| progress:cost_budget_usd | number | Yes | API cost budget | >=80% -> notify user |

### Detail Block Guidance

Describe progress summary narrative, recent milestone achievements, and outlook for the next phase.

## 9.7 defect (Namespace: defect:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| defect:id | string | Yes | DEF-NNN | — |
| defect:severity | enum | Yes | defect severity | critical / high / medium / low |
| defect:defect_status | enum | Yes | defect status | open / in-analysis / in-fix / in-retest / closed |
| defect:assigned_to | string | Yes | Agent assigned to fix | — |
| defect:found_in_phase | int | Yes | Phase in which the defect was found | 0-7 |
| defect:related_requirement | string | No | Requirement ID (e.g., FR-001). When traceable | — |
| defect:closed_reason | enum | No | Reason for the terminal state (required when it ends anywhere other than `closed`) | fixed / rejected / cannot-reproduce / withdrawn |
| defect:reproduction_attempt_count | int | No | Number of reproduction attempts (required for `cannot-reproduce`) | 1 or greater |
| defect:reopen_trigger | text | No | Condition for reopening (required for `rejected` / `cannot-reproduce`) | — |

### Detail Block Guidance

Describe defect details (reproduction steps, root cause analysis, fix content, retest results). The defect_status state transitions follow the diagram below.

**defect status state transition diagram:**

```mermaid
stateDiagram-v2
    state "open" as Open
    state "in-analysis" as InAnalysis
    state "in-fix" as InFix
    state "in-retest" as InRetest
    state "closed" as Closed
    [*] --> Open : defect reported
    Open --> InAnalysis : Assigned agent starts analysis
    InAnalysis --> InFix : Root cause identified
    InFix --> InRetest : Fix applied
    InRetest --> Closed : Retest passed
    InRetest --> InFix : Retest failed
    Closed --> [*]
```

## 9.8 change-request (Namespace: change-request:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| change-request:id | string | Yes | CR-NNN | — |
| change-request:cause | enum | Yes | Change cause (user-initiated only) | requirement-addition / requirement-change / scope-change |
| change-request:impact_level | enum | Yes | Impact level | high -> user approval required / medium / low |
| change-request:change_request_status | enum | Yes | Change request status | submitted / in-analysis / approved / rejected / implemented |
| change-request:approved_by | actor | No | Approver. Empty when undecided | Actor notation from 5.1 |

### Detail Block Guidance

Describe change details (reason, impact scope, response plan). Escalation rule: impact_level = high requires user approval.

## 9.9 traceability (Namespace: traceability:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| traceability:scope | string | Yes | Coverage scope of this matrix | — |
| traceability:requirement_count | int | Yes | Total number of tracked requirements | — |
| traceability:covered_count | int | Yes | Number of requirements with at least one test | — |
| traceability:coverage_pct | int | Yes | Traceability coverage | 0-100 |

### Detail Block Guidance

Describe the traceability matrix in the Detail Block. Column definitions for the matrix are as follows.

| Column | Description |
|-------|------|
| Requirement ID | FR-NNN or NFR-NNN |
| Requirement | Short description |
| Design Reference | Specification section or ADR reference |
| Implementation | File path or module |
| Test ID | Comma-separated test identifiers |
| Status | covered / partial / uncovered |

---

## 9.10 interview-record (Namespace: interview-record:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| interview-record:interview_status | enum | Yes | Interview status | not-started / in-progress / completed |
| interview-record:session_count | int | Yes | Number of completed sessions | — |
| interview-record:open_question_count | int | Yes | Number of unresolved questions | -> Process Rules §9.4.1 GATE-INTERVIEW |

### Detail Block Guidance

Describe per-session records (questions, answers, agreements) in table format. Place the unresolved items list at the end.

---

## 9.11 wbs (Namespace: wbs:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| wbs:task_total | int | Yes | Total task count | — |
| wbs:task_completed | int | Yes | Completed task count | — |
| wbs:task_in_progress | int | Yes | In-progress task count | — |
| wbs:task_blocked | int | Yes | Blocked task count | >=1 -> notify orchestrator |
| wbs:completion_pct | int | Yes | WBS completion rate | 0-100 |

### Detail Block Guidance

Describe WBS table (task ID, task name, assigned agent, dependencies, status, estimate, actual) and Gantt chart (Mermaid gantt recommended).

---

## 9.12 test-plan (Namespace: test-plan:)

> **Boundary against spec Ch5:** Ch5 "Test Strategy" defines **what is verified and to what extent** (test levels, coverage policy, acceptance criteria) - a design decision owned by architect. `test-plan` defines **when, by whom and in what order it is executed** (steps, assignment, schedule, environments) - an execution plan owned by test-engineer. The same content is never written in both. When Ch5 changes, test-plan is updated; never the reverse.

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| test-plan:test_level | string | Yes | Test levels (comma-separated) | unit / integration / e2e / performance |
| test-plan:coverage_target_pct | int | Yes | Coverage target | 0-100 |
| test-plan:pass_rate_target_pct | int | Yes | Pass rate target | 0-100 |
| test-plan:test_case_count | int | Yes | Total planned test case count | — |
| test-plan:environment | string | Yes | Test environment overview | — |

### Detail Block Guidance

Describe scope and strategy per test level, test case list (ID, target requirement, overview, expected result), test environment configuration, and test data strategy.

---

## 9.13 spec-foundation (Namespace: spec-foundation:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| spec-foundation:spec_format | enum | Yes | Specification format | ANMS / ANPS (ANGS is at research stage and is not in the domain) |
| spec-foundation:fr_count | int | Yes | Total number of functional requirements | — |
| spec-foundation:nfr_count | int | Yes | Total number of non-functional requirements | — |
| spec-foundation:completed_chapters | string | Yes | Completed chapters (comma-separated) | 1 / 2 |
| spec-foundation:approved_chapters | string | No | Chapters **approved by the user** (comma-separated) | 1 / 2. Omit while none are approved. `completed_chapters` is the writer's completion; this is approval, a different thing |

### Detail Block Guidance

Describe Specification Ch1 (Foundation: project overview, scope, terminology definitions, assumptions) and Ch2 (Requirements: functional requirements list FR-NNN, non-functional requirements list NFR-NNN, requirement priority matrix). Follow the structure of spec-template.md.

---

## 9.14 spec-architecture (Namespace: spec-architecture:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| spec-architecture:completed_chapters | string | Yes | Completed chapters (comma-separated) | 3 / 4 / 5 / 6 |
| spec-architecture:component_count | int | Yes | Number of architecture components | — |
| spec-architecture:api_endpoint_count | int | No | Number of OpenAPI-defined endpoints | — |
| spec-architecture:migration_count | int | No | Number of data model migrations | — |

### Detail Block Guidance

Describe Specification Ch3 (Architecture: system architecture diagram, layer definitions, component design, data model), Ch4 (Specification: API specifications, sequence diagrams, state transition diagrams), Ch5 (Test Strategy: test approach, coverage targets), Ch6 (Design Principles: adopted design principles and their application points). Follow the structure of spec-template.md.

---

## 9.15 threat-model (Namespace: threat-model:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| threat-model:methodology | enum | Yes | Threat modeling methodology | STRIDE / PASTA / other |
| threat-model:threat_count | int | Yes | Number of identified threats | — |
| threat-model:mitigated_count | int | Yes | Number of threats with mitigations implemented | — |
| threat-model:unmitigated_critical_count | int | Yes | Number of unmitigated Critical threats | -> Process Rules §9.4.1 GATE-DESIGN |

### Detail Block Guidance

Describe threat list table (threat ID, STRIDE classification, attack scenario, impact level, mitigation, status), data flow diagram (DFD), and trust boundary definitions.

---

## 9.16 security-architecture (Namespace: security-architecture:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| security-architecture:owasp_coverage | string | Yes | OWASP Top 10 countermeasure coverage | "N/10" format |
| security-architecture:auth_method | string | Yes | Authentication method | — |
| security-architecture:encryption_at_rest | boolean | Yes | Encryption at rest | true / false |
| security-architecture:encryption_in_transit | boolean | Yes | Encryption in transit | true / false |

### Detail Block Guidance

Describe authentication/authorization design, encryption policy, input validation strategy, individual countermeasure list for OWASP Top 10, and secret management policy.

---

## 9.17 security-scan-report (Namespace: security-scan-report:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| security-scan-report:scan_type | enum | Yes | Scan type | sast / sca / dast / secret-scan / manual |
| security-scan-report:tool_name | string | Yes | Tool name used | — |
| security-scan-report:finding_critical | int | Yes | Critical finding count | -> Process Rules §9.4.1 GATE-IMPL |
| security-scan-report:finding_high | int | Yes | High finding count | -> Process Rules §9.4.1 GATE-IMPL |
| security-scan-report:finding_medium | int | Yes | Medium finding count | — |
| security-scan-report:finding_low | int | Yes | Low finding count | — |

### Detail Block Guidance

Describe finding list (finding ID, severity, CWE/CVE, affected location, fix status), scan target scope, and tool configuration overview.

---

## 9.18 observability-design (Namespace: observability-design:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| observability-design:log_format | enum | Yes | Log format | structured-json / plain-text |
| observability-design:metrics_type | string | Yes | Metrics type (comma-separated) | RED / USE / custom |
| observability-design:tracing_enabled | boolean | Yes | Distributed tracing enabled | true / false |
| observability-design:alert_count | int | Yes | Number of defined alert rules | — |

### Detail Block Guidance

Describe log design (level definitions, structure, rotation), metrics design (RED metrics definitions, instrumentation points), tracing design (propagation method, sampling rate), alert design (conditions, notification targets, escalation), and dashboard design.

---

## 9.19 hw-requirement-spec (Namespace: hw-requirement-spec:)

> Inherits external-dependency-spec. Conditional process (only when HW integration is enabled).

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| hw-requirement-spec:device_type | string | Yes | Device type (e.g., sensor, actuator, SBC) | — |
| hw-requirement-spec:interface_count | int | Yes | Number of SW-HW interfaces | — |
| hw-requirement-spec:interface_protocol | string | Yes | Communication protocol (comma-separated) | — |
| hw-requirement-spec:safety_relevant | boolean | Yes | Functional safety relevant | true -> HARA/FMEA required |

### Detail Block Guidance

Follow the external-dependency-spec common chapter structure (Purpose, Requirements, I/F Definition, Constraints, Replacement Strategy, Other). Include pin assignments, timing diagrams, and electrical characteristics in the I/F Definition.

---

## 9.20 ai-requirement-spec (Namespace: ai-requirement-spec:)

> Inherits external-dependency-spec. Conditional process (only when AI/LLM integration is enabled).

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| ai-requirement-spec:model_capability | string | Yes | Required model capabilities (comma-separated) | — |
| ai-requirement-spec:latency_target_ms | int | No | Inference latency target (milliseconds) | — |
| ai-requirement-spec:cost_per_request_usd | number | No | Per-request cost target (USD) | — |
| ai-requirement-spec:fallback_strategy | string | Yes | Fallback strategy | — |

### Detail Block Guidance

Follow the external-dependency-spec common chapter structure. Include prompt design policy (placed under src/), model selection criteria, evaluation metrics (accuracy, latency, cost), and fallback procedures.

---

## 9.21 framework-requirement-spec (Namespace: framework-requirement-spec:)

> Inherits external-dependency-spec. Conditional process (only when framework requirement definition is enabled).

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| framework-requirement-spec:framework_name | string | Yes | Framework name | — |
| framework-requirement-spec:version_constraint | string | Yes | Version constraint | — |
| framework-requirement-spec:interface_standard | enum | Yes | I/F standardization level | standard / non-standard / mixed |
| framework-requirement-spec:migration_risk | enum | Yes | Migration risk | low / medium / high |

### Detail Block Guidance

Follow the external-dependency-spec common chapter structure. Include detailed non-standard I/F specifications, Adapter layer design policy, and version upgrade tracking strategy. When interface_standard = standard, do not create this file; recording the selection rationale in a decision is sufficient (see section 7).

---

## 9.22 executive-dashboard (Namespace: executive-dashboard:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| executive-dashboard:health | enum | Yes | Project health | green / yellow / red |
| executive-dashboard:phase | string | Yes | Current phase name | — |
| executive-dashboard:completion_pct | int | Yes | Overall completion rate | 0-100 |
| executive-dashboard:risk_top | string | No | Top risk summary (one line) | — |
| executive-dashboard:blocker | string | No | Current blocker (empty if none) | — |

### Detail Block Guidance

Describe a concise user-facing summary (recent progress, next milestone, key risks, cost status). Do not include technical details (refer to progress / pipeline-state).

---

## 9.23 final-report (Namespace: final-report:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| final-report:goal_achievement | enum | Yes | Project goal achievement level | achieved / partially-achieved / not-achieved |
| final-report:total_cost_usd | number | No | Total API cost | **Omit it when measurement was unavailable.** State the gap in the Detail Block and in cost-log.json, and **never fill in an estimate (MUST NOT)** (§3.2.7) |
| final-report:total_defect_count | int | Yes | Cumulative defect count | — |
| final-report:open_defect_count | int | Yes | Unresolved defect count | -> Process Rules §9.4.1 GATE-DELIVERY |
| final-report:lesson_count | int | Yes | Number of lessons | — |
| final-report:unapplied_improvement_count | int | Yes | Improvements not yet applied (`retrospective-report` entries whose `approval_status` is anything but `applied`) | 0 or more. **When not zero, break it down in the Detail Block** |
| final-report:oldest_unapplied_improvement_at | string | No | Proposal date of the oldest unapplied improvement (`YYYY-MM-DD`) | Omit when none are outstanding |

### Detail Block Guidance

Describe project summary (goal achievement assessment, scope fulfillment, quality summary), cost analysis (consumption by phase), lessons learned, remaining issues, and recommendations. **Where improvements remain unapplied, record the breakdown - what, proposed when, and why it is still outstanding - not only the count.** A backlog of proposals is not itself a defect, but **carried into the next project unseen, nobody notices when the same root cause recurs.**

---

## 9.24 user-order (Namespace: user-order:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| user-order:format | enum | Yes | Selected specification format | ANMS / ANPS (ANGS is at research stage and is not in the domain) |
| user-order:question_count | int | Yes | Number of answered questions in 3-question format | 3 (fixed) |

### Detail Block Guidance

Describe the answers to the 3 questions the user answers (1. What do you want to build?, 2. Why?, 3. Any other requests). srs-writer validates this file and uses it as input for spec-foundation.

---

## 9.25 license-report (Namespace: license-report:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| license-report:total_dependency_count | int | Yes | Total number of dependencies | — |
| license-report:compatible_count | int | Yes | License-compatible count | — |
| license-report:incompatible_count | int | Yes | License-incompatible count | -> Process Rules §9.4.1 GATE-IMPL |
| license-report:unknown_count | int | Yes | License-unknown count | -> Process Rules §9.4.1 GATE-IMPL |

### Detail Block Guidance

Describe dependency list table (library name, version, license, compatibility assessment, attribution required), compatibility assessment criteria, and attribution text (for NOTICE/THIRD-PARTY-LICENSES).

---

## 9.26 performance-report (Namespace: performance-report:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| performance-report:test_tool | string | Yes | Performance testing tool name | — |
| performance-report:scenario_count | int | Yes | Number of test scenarios | — |
| performance-report:nfr_pass_rate | string | Yes | NFR pass rate | "N/M" format. -> Process Rules §9.4.1 GATE-TEST |
| performance-report:p99_latency_ms | int | No | P99 latency (milliseconds) | — |
| performance-report:throughput_rps | number | No | Throughput (requests/second) | — |

### Detail Block Guidance

Describe per-scenario test result table (scenario name, NFR-ID, target value, measured value, pass/fail), load profile, bottleneck analysis, and improvement recommendations.

---

## 9.27 user-manual (Namespace: user-manual:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| user-manual:target_audience | string | Yes | Target audience | — |
| user-manual:chapter_count | int | Yes | Number of chapters | — |
| user-manual:screenshot_count | int | No | Number of screenshots | — |

### Detail Block Guidance

Describe installation instructions, basic operation guide (corresponding to major user flows), configuration reference, FAQ, and troubleshooting.

---

## 9.28 runbook (Namespace: runbook:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| runbook:procedure_count | int | Yes | Number of operational procedures | — |
| runbook:last_drill_date | string | No | Last drill date (ISO-8601) | — |
| runbook:environment | string | Yes | Target environment | — |

### Detail Block Guidance

Describe daily operational procedures (deploy, backup, rotation), incident response procedures (per-alert response flows), escalation flow, and recovery verification procedures. Each procedure should be described with numbered steps.

---

## 9.29 incident-report (Namespace: incident-report:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| incident-report:incident_id | string | Yes | INC-NNN | — |
| incident-report:severity | enum | Yes | incident severity | P1 / P2 / P3 / P4 |
| incident-report:incident_status | enum | Yes | incident status | open / in-investigation / mitigated / resolved / closed |
| incident-report:detected_at | string | Yes | Detection datetime (ISO-8601) | — |
| incident-report:resolved_at | string | No | Resolution datetime (ISO-8601). Empty when unresolved | — |
| incident-report:duration_minutes | int | No | Impact duration (minutes). Filled after resolution | — |

### Detail Block Guidance

Describe timeline (detection -> response -> resolution chronology), impact scope, root cause analysis (RCA), recurrence prevention measures, and related changes (fix commits, configuration changes).

---

## 9.30 disaster-recovery-plan (Namespace: disaster-recovery-plan:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| disaster-recovery-plan:rto_hours | int | Yes | Recovery Time Objective (hours) | — |
| disaster-recovery-plan:rpo_hours | int | Yes | Recovery Point Objective (hours) | — |
| disaster-recovery-plan:backup_strategy | string | Yes | Backup strategy overview | — |
| disaster-recovery-plan:last_test_date | string | No | Last test date (ISO-8601) | — |

### Detail Block Guidance

Describe disaster scenario list (scenario, impact, recovery procedure), backup and restore procedures, failover procedures, recovery priority (tier classification), and communication plan.

---

## 9.31 stakeholder-register (Namespace: stakeholder-register:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| stakeholder-register:stakeholder_count | int | Yes | Number of registered stakeholders | — |
| stakeholder-register:communication_plan_defined | boolean | Yes | Communication plan defined | true / false |

### Detail Block Guidance

Describe stakeholder list table (name/role, interests, influence level, communication frequency, communication method) and RACI matrix (recommended).

---

## 9.32 retrospective-report (Namespace: retrospective-report:)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| retrospective-report:phase | enum | Yes | Phase subject to retrospective | setup / planning / dependency-selection / design / implementation / testing / delivery / operation |
| retrospective-report:defect_pattern_count | int | Yes | Number of analyzed defect patterns | 0 or more |
| retrospective-report:improvement_count | int | Yes | Number of proposed improvements | 0 or more |
| retrospective-report:approval_status | enum | Yes | Improvement approval status | proposed / approved / applied / rejected |

### Detail Block Guidance

Describe the body of the retrospective analysis. Include root cause analysis of defect patterns (aggregated by fault origin), KPT (Keep/Problem/Try) format analysis results, and specific improvement proposals (target files, change content, expected effects). After approval, decree-writer applies the changes and records before/after diff in project-records/improvement/.

---

## 9.33 field-issue (Namespace: field-issue:) (Conditional: field testing enabled)

### Fields

| Field | Type | Required | Description | Value Range / Constraints |
|-----------|------|------|------|-----------|
| field-issue:issue_id | string | Yes | Unique identifier | FI-NNN |
| field-issue:type | enum | Yes | Determined by feedback-classifier | defect / cr |
| field-issue:status | enum | Yes | Current status | reported / classified / in-analysis / cause-identified / in-planning / solution-proposed / approved / spec-updated / spec-reviewed / fixed / code-reviewed / tested / verified |
| field-issue:severity | enum | Yes | Severity | critical / high / medium / low |
| field-issue:reported_by | string | Yes | Reporter | field-test-engineer |
| field-issue:classified_by | string | No | Classifier | feedback-classifier |
| field-issue:analyzed_by | string | No | Analyst | field-issue-analyst |
| field-issue:root_cause | text | No | Root cause (defect only) | — |
| field-issue:impact_analysis | text | No | Impact scope / side effects / alternative comparison | — |
| field-issue:approved_solution | text | No | Confirmed solution | — |
| field-issue:spec_update_required | boolean | No | Whether spec update is needed | — |
| field-issue:related_requirements | list | No | Related requirement IDs | — |
| field-issue:related_defect_id | string | No | Link to defect found in automated testing | DEF-NNN |
| field-issue:closed_reason | enum | No | Reason for the terminal state (required when it ends anywhere other than `verified`) | verified / rejected / cannot-reproduce / withdrawn |
| field-issue:reproduction_attempt_count | int | No | Number of reproduction attempts (required for `cannot-reproduce`) | 1 or greater |
| field-issue:reopen_trigger | text | No | Condition for reopening (required for `rejected` / `cannot-reproduce`) | — |

### Detail Block Guidance

Describe the details of the field-issue. field-test-engineer records feedback (symptoms, logs, reproduction steps), feedback-classifier appends classification results, and field-issue-analyst appends root cause analysis and solution planning results. For status transition details, refer to [Field Testing Feedback Management Rules](field-issue-handling-rules.md).

---

## 9.34 tech-decision (Namespace: tech-decision:)

### Fields

| Field | Type | Required | Description | Range/Constraint |
|-------|------|----------|-------------|------------------|
| tech-decision:id | string | Yes | Unique identifier | TD-NNN |
| tech-decision:title | string | Yes | Title of the decision | — |
| tech-decision:decision_status | enum | Yes | State of the decision | proposed / decided / superseded |
| tech-decision:phase | enum | Yes | Target phase | setup / planning / dependency-selection / design / implementation / testing / delivery / operation |
| tech-decision:gate | string | No | Target gate (for a gate decision) | GATE-XXX |
| tech-decision:verdict | enum | No | Gate verdict (for a gate decision) | PASS / FAIL / CONDITIONAL / NOT-APPLICABLE. **CONDITIONAL and NOT-APPLICABLE carry their reason in the Detail Block** |
| tech-decision:fail_count | integer | No | Consecutive FAIL count on the same gate | 0 or greater |
| tech-decision:send_back_to | enum | No | Where to send back (on FAIL) | design / implementation |
| tech-decision:rationale | text | Yes | Rationale for the decision | — |
| tech-decision:waiver | string | No | Presence of and reference to a waiver | none / reference to the waiver record |
| tech-decision:reevaluate_at | string | No | Re-evaluation timing (required when a waiver is granted) | — |
| tech-decision:approved_by | actor | No | Who approved the decision (**required when a waiver is granted**) | Actor notation from 5.1. **A waiver's user approval left in prose cannot be judged by machine** |

### Detail Block Guidance

Record the point at issue, the options compared, and the options not adopted with the reason. For a gate decision, include a table mapping the findings of the referenced review to their disposition. When a waiver is granted, always record the user approval, the scope of impact, and the re-evaluation timing (Process Rules §9.1).

Judgments made on grounds of cost, schedule or risk are recorded in decision (owner: orchestrator), not in this file_type.

---

## 9.35 governance-change-log (Namespace: governance-change-log:)

### Fields

| Field | Type | Required | Description | Range/Constraint |
|-------|------|----------|-------------|------------------|
| governance-change-log:id | string | Yes | Unique identifier | GCL-NNN |
| governance-change-log:source_report | string | Yes | The retrospective-report the change came from | File name |
| governance-change-log:target_file | string | Yes | The governance file that was changed | Path |
| governance-change-log:apply_status | enum | Yes | Result of application | applied / partially-applied / rejected |
| governance-change-log:approved_by | actor | Yes | Who approved it | Actor notation from 5.1. **Do not write bare `user`** (a human is `human:{id}`) |
| governance-change-log:safety_check_result | enum | Yes | Result of the safety check | pass / fail |
| governance-change-log:rejected_reason | text | No | Why it was not applied (required for rejected / partially-applied) | — |

### Detail Block Guidance

Record the before/after diff of the applied change. Include each safety-check item and its verdict (self-modification prohibited, quality gate definitions protected, thresholds never relaxed). When `apply_status` is anything other than `applied`, `rejected_reason` MUST be filled in.

The owner is decree-writer. It is kept in a separate directory from retrospective-report (owner: process-improver), which is where the improvement was proposed. If the agent that proposes and the agent that applies wrote to the same directory, it would no longer be possible to tell which record is whose.

---

## 9.36 deployment-design (Namespace: deployment-design:)

### Fields

| Field | Type | Required | Description | Range/Constraint |
|-------|------|----------|-------------|------------------|
| deployment-design:environments | list | Yes | The environments defined | e.g. dev / staging / production |
| deployment-design:iac_tool | string | Yes | The IaC tool | Matches the IaC entry in CLAUDE.md "Technology Stack" |
| deployment-design:deploy_strategy | enum | Yes | Deployment strategy | rolling / blue-green / canary / recreate |
| deployment-design:rollback_procedure | text | Yes | Rollback procedure | — |
| deployment-design:secret_management | string | Yes | How secrets are managed | — |

### Detail Block Guidance

Record the composition of each environment (network, compute, data stores), the deployment procedure, the rollback procedure, and how secrets are managed. implementer writes the IaC code under `infra/` from this document, and runbook-writer writes the operational procedures from it. technical-authority rules on whether `infra/` conforms to this design.

The owner is architect. The `infra/` implementation is done by implementer, keeping the designer and the implementer separate.

---

## 9.37 risk-register (Namespace: risk-register:)

### Fields

| Field | Type | Required | Description | Range/Constraint |
|-------|------|----------|-------------|------------------|
| risk-register:total_count | int | Yes | Total risks registered | 0 or greater |
| risk-register:open_count | int | Yes | Risks not yet closed | 0 or greater |
| risk-register:max_score | int | Yes | Highest score among open risks | 1-9 |
| risk-register:escalated_count | int | Yes | Count already escalated to the user at score 6 or above | 0 or greater |

### Detail Block Guidance

Record the register listing the individual `risk` entries. Each row carries risk_id, summary, score, state, and who owns the mitigation.

**Difference from `risk`:** `risk` is an individual risk entry, created as numbered files. `risk-register` is the single file that aggregates them. Keeping both under one file_type made the singleton determination contradictory, so they are separated. Both are owned by risk-manager.

---

# 10. Versioning Rules

Versioning is determined by the document **status** at the time of change.

**Rules by status:**

```
draft      → Overwrite the file and increment the minor of document_version
in-review  → Overwrite the file and increment the minor of document_version
approved   → Move the current file to old/{name}-v{old}.md, create the new version under the same name, increment the major
archived   → Do not modify (reference only)
```

**The value domain of `document_status` is draft / in-review / approved / archived - four values.** `released` is not in that domain, so it is removed from the versioning rules.

**The file name does not change.** The version lives in `document_version`. A version is put into the file name only when moving it to `old/`, so that no reference has to follow a rename.

**Singleton files** (pipeline-state.md, risk-register.md, traceability-matrix.md):

- Always overwrite
- History is tracked via change_log entries and git

---

# 11. Ownership Model

Each file has exactly one `owner` agent. Only the owner can modify Common Block and Form Block fields.

| Owner | File (file_type) | Write Scope |
|---------|---------|-----------|
| orchestrator | pipeline-state | Full control. Only orchestrator writes this file |
| orchestrator | executive-dashboard | Full control of project-wide dashboard |
| orchestrator | final-report | Full control of project final report |
| orchestrator | decision | Full control of decision records |
| technical-authority | tech-decision | Full control of technical ruling and gate decision records |
| decree-writer | governance-change-log | Full control of governance application records |
| architect | deployment-design | Full control of the deployment design; the infra/ implementation belongs to implementer |
| risk-manager | risk-register | Full control of the risk register |
| srs-writer | user-order | Validation and completion. User provides initial input |
| srs-writer | interview-record | Full control of interview records |
| srs-writer | spec-foundation | Common + Form + Detail of specification Ch1-2 |
| architect | spec-architecture | Common + Form + Detail of specification Ch3-6 |
| architect | observability-design | Full control of observability design |
| architect | hw-requirement-spec | Full control of HW requirement specification (conditional process) |
| architect | ai-requirement-spec | Full control of AI/LLM requirement specification (conditional process) |
| architect | framework-requirement-spec | Full control of framework requirement specification (conditional process) |
| review-agent | review | Full control of review documents |
| progress-monitor | progress | Full control of progress and cost data |
| progress-monitor | wbs | Full control of WBS and Gantt chart |
| risk-manager | risk | Full control of risk entries |
| change-manager | change-request | Full control of change request documents |
| test-engineer | test-plan | Full control of test plan |
| test-engineer | defect | Full control of defect tickets |
| test-engineer | traceability | Full control of traceability matrix |
| test-engineer | performance-report | Full control of performance test reports |
| security-reviewer | threat-model | Full control of threat model |
| security-reviewer | security-architecture | Full control of security design |
| security-reviewer | security-scan-report | Full control of security scan results (SAST/SCA/DAST/manual) |
| license-checker | license-report | Full control of license report |
| user-manual-writer | user-manual | Full control of end-user manual |
| runbook-writer | runbook | Full control of runbook |
| incident-reporter | incident-report | Full control of incident records |
| architect | disaster-recovery-plan | Full control of disaster recovery plan |
| orchestrator | stakeholder-register | Full control of stakeholder register |
| orchestrator | handoff | Creation of handoff entries. `to` agent may only update status |
| process-improver | retrospective-report | Full control of retrospective and process improvement records |
| field-test-engineer | field-issue | Full control of field testing feedback (conditional: field testing enabled). feedback-classifier and field-issue-analyst may append to Detail Block |

**Detail Block exception:** Any agent MAY append to the Detail Block of a file they do not own, provided they record the append in the change_log.

**decree-writer delegated write permission:** decree-writer does not own any file_type, but performs writes to CLAUDE.md, agent definitions (.claude/agents/), and process-rules/ based on approved retrospective-reports. Prior approval is required based on the approval table (CLAUDE.md / process-rules = user approval, agent definitions = orchestrator approval). All changes are recorded as before/after diff in project-records/improvement/.

**Handoff ownership:** Created by the `from` agent. After `status` becomes `in-progress`, the `to` agent can update the status.

---

# 12. Language Policy

## 12.1 Overview

Language design consists of 3 layers.

| Layer | Target | How Language is Determined |
|---|------|-------------|
| Framework layer | process-rules/, essays/ | Provided as Japanese/English pairs. Independent of the project |
| Project settings layer | CLAUDE.md language settings | Selected by user at project start |
| File layer | Common Block `language` | Each file declares its own language |

## 12.2 Project Language Settings

Configure the following in CLAUDE.md (proposed by AI during setup phase):

- **project_language:** Primary language (ISO 639-1: `ja`, `en`, `fr`, etc.)
- **translation_languages:** List of translation languages (empty = single-language project)

## 12.3 File Naming and Language Suffix

| Mode | Condition | Naming Convention |
|--------|------|---------|
| Single language | translation_languages is empty | No suffix (e.g., `threat-model.md`) |
| Multi-language | translation_languages has one or more | Primary language: no suffix, translated versions: `-{lang}.md` (e.g., `threat-model-en.md`) |

The primary language file always has no suffix. Agents always read/write the file without suffix.

## 12.4 Per-Element Language Rules

| Element | Language | Customizable | Rationale |
|------|------|:-----------:|------|
| Field names and namespace prefixes | English (fixed) | No | Machine parsability |
| Values of `owner` / `commissioned_by` / `consumed_by` | English (fixed) | No | Agent names are fixed in English; translating them breaks data-flow matching |
| Values of `document_status` / `file_type` | English (fixed) | No | They are enum values, judged by machine |
| HTML comments (FIELD annotations) | English (fixed) | No | Machine parsability |
| Common Block field values (purpose, summary, etc.) | Project primary language | Yes | Read by humans and agents |
| Form Block field names | English (fixed) | No | Machine parsability |
| Form Block field values | Project primary language | Yes | Content-dependent |
| Detail Block | Project primary language | Yes | Free-form text |
| Source code identifiers (variable names, function names) | English (fixed) | No | International convention |
| Code comments | Project primary language | Yes | Match the team's language |
| Agent prompts (.claude/agents/) | Project primary language | Yes | Ensure consistency of output language |

## 12.5 Framework Document Languages

| Directory | Provided Languages | Naming |
|-------------|---------|------|
| process-rules/ | Japanese + English | `-ja.md` / `-en.md` |
| essays/ | Japanese + English | `-ja.md` / `-en.md` |

Framework documents are managed as Japanese/English pairs independently of the project's primary language. Translations to other languages are accepted as community contributions (with `-{lang}.md` suffix).

## 12.6 Non-Adoption of Language Subfolders

Language-specific subfolders (`ja/`, `en/`) are not adopted. Reason: When agents execute operations like "read all review results," they would need to traverse multiple directories, reducing processing efficiency. Languages are distinguished by suffix within the same directory.

---

# 13. Common Block Application Scope

**Decision principle:** "Is this a Markdown document managed by agents?" -> Yes -> Common Block required.

**One-line test:** "Is this a Markdown document that **our agents own and manage**?" -> Yes -> Common Block required.

## 13.1 Conditions Requiring Common Block (all must be met)

1. File format is `.md` (Markdown)
2. Created and updated by framework agents
3. No external tool dictates the file structure

## 13.2 Conditions Not Requiring Common Block (any one is sufficient)

1. **External tool-dictated format** — File structure is dictated by tools outside the framework (`.claude/agents/*.md`, `.claude/commands/*.md`, `openapi.yaml`, `Dockerfile`, `*.tf`, `.github/workflows/*.yml`)
2. **JSON time-series data** — Consumed by programs for chart rendering, etc. (`cost-log.json`, `test-progress.json`, `defect-curve.json`)
3. **Source code and test code** — Follow language/framework conventions (`src/`, `tests/`)
4. **Project configuration** — Templates directly managed by the user (`CLAUDE.md`)

## 13.3 Application List

| Common Block Managed | Not Common Block Managed |
|---------------------|----------------------|
| All file types in Chapter 7 (with Form Block) | External tool-dictated formats (.claude/agents/, openapi.yaml, etc.) |
| Specifications (user-order.md, {project}-spec.md) | JSON time-series data (cost-log, test-progress, defect-curve) |
| Security design documents (threat-model, security-architecture) | Source code and test code |
| Observability design documents (observability-design) | Configuration files and IaC (Infrastructure as Code) |
| WBS (wbs.md) | CLAUDE.md |
| Test plan (test-plan.md) | |
| Interview record (interview-record.md) | |
| License report (license-report.md) | |
| Performance test report (performance-report-NNN-*.md) | |
| Final report (final-report.md) | |
| Executive dashboard (executive-dashboard.md) | |

---

# 14. Design Rationale

| Decision | Rationale |
|---------|------|
| 3-directory separation | Separates orchestration (PM), artifacts (docs), and process records. Those not interested in process can ignore project-records/ |
| YAML frontmatter (OKF v0.2) | A standard format needing no dedicated parser: `yq`, every language, GitHub rendering and editors read it as-is. **A bespoke format obliges you to build the checking tools yourself** |
| Append-only change_log | Guarantees audit trail integrity. Agents cannot rewrite history |
| Singleton pipeline-state | The single source of truth for "where we are now" |
| Owner-based write control | Prevents conflicting edits. Clear responsibility for each file |
| Excluding JSON from Common Block | Time-series data is consumed by programs for charts. Adding MD structure provides no benefit |
| UTC timestamps | Eliminates timezone ambiguity in multi-agent operations |
| Status-based versioning | Drafts are living documents (overwrite OK), approved documents require history preservation |
| Independent of specification format | These rules are for process document management and are orthogonal to specification format selection (ANMS/ANPS/ANGS). However, Common Block also applies to specifications (coexists with specification formats) |
| Common Block application criteria | Extended from the old criteria (process documents only) to "all MD documents managed by agents." Only external tool-dictated formats, JSON, and code are excluded |
| Placing process-rules/ in the framework side | Rule documents are invariant across projects. Managed separately from project-specific PM artifacts |
| Category-specific naming conventions | Process documents, specifications, general documents, code, and configuration each follow different conventions. Unifying them would be unnatural |

---

# References

1. full-auto-dev Process Rules — `process-rules/full-auto-dev-process-rules.md`
2. Martin, R.C. "The Clean Architecture" — Stable Dependencies Principle (SDP)
3. Nygard, M. "Documenting Architecture Decisions" — Reference for ADR format
