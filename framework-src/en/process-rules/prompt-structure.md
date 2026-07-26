# Agent Prompt Structure Convention

> **Position of this document:** The single source of truth for the structure definition of agent prompts placed in `.claude/agents/*.md`. Refer to this document when creating new agents or modifying existing ones.
> **Related documents:** [Process Rules](full-auto-dev-process-rules.md) §7 Agent Definition, [Document Management Rules](full-auto-dev-document-rules.md)

---

## 1. Design Principles

1. **AI reads from top to bottom.** Information read earlier becomes the interpretive context for later information. Place "what should be known first" at the top
2. **Know the goal before entering the procedure.** Never drive without knowing the destination
3. **Separate normal and abnormal flows.** Procedure is for the normal flow, Exception is for the abnormal flow
4. **Unify section names with abstract concepts.** Do not use names of specific remediation methods as section names
5. **Agent = Function.** In (arguments) → Procedure → Out (return values). Work is local variables; delete them once Out is produced

---

## 2. Section Structure

```
---                          ← S0: YAML Frontmatter (defined externally by Claude Code)
name / description / tools / model
---

{Role declaration 1-3 lines}  ← S1: Identity (who you are)

## Activation                ← S2: Why / when to start / when to end
### Purpose                      Why this agent exists
### Start Conditions             Preconditions to begin work
### End Conditions               Criteria for work completion (= corresponds to Out list)

## Ownership                 ← S3: Definition of In / Out / Work
### In                           Inputs that exist at work start. Read-only. Do not modify
### Out                          Final deliverables at work end. Correspond to End Conditions
### Work                         Temporary files used only during work. Delete after Out is complete

## Procedure                 ← S4: What to do (normal flow)

## Rules                     ← S5: How to decide (optional, free subsection structure)

## Exception                 ← S6: What to do in abnormal situations
```

---

## 3. Section Definitions

### 3.0 S0: YAML Frontmatter

An external format defined by Claude Code. This framework does not modify it.

```yaml
---
name: agent-name
description: One-line description of activation conditions
tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
model: opus | sonnet | haiku | inherit
---
```

| Field | Description |
|-----------|------|
| name | Identifier for the agent (kebab-case) |
| description | One-line description referenced by Claude Code during agent selection |
| tools | Tools available to this agent |
| model | Model to use. opus (high quality) / sonnet (balanced) / haiku (fast) / inherit (same as parent) |

### 3.1 S1: Identity

**Purpose:** Declare who this agent is.

**Format:** Place 1-3 lines of plain text immediately after the YAML Frontmatter, without a Markdown heading.

```markdown
You are {role name}.
{One-line summary of responsibilities}.
```

**Rules:**
- The first sentence starts with "You are ..."
- Subsequent sentences summarize the scope of responsibilities
- Do not exceed 3 lines. Write details in Procedure or Rules

### 3.2 S2: Activation

**Purpose:** Define the work contract. Purpose = function responsibility, Start Conditions = preconditions, End Conditions = postconditions.

#### Purpose

The reason this agent exists. 1-2 lines. Write "why" rather than "what to do."

```markdown
### Purpose

{The reason this agent is called. The problem it solves. 1-2 lines.}
```

#### Start Conditions

Preconditions for starting work. Checklist format. Work cannot begin unless all conditions are met. If unmet, follow Exception.

```markdown
### Start Conditions

- [ ] {Precondition 1: What must be completed/exist}
- [ ] {Precondition 2: What must be completed/exist}
```

#### End Conditions

Criteria for judging work completion. Checklist format. Complete when all conditions are met. Corresponds to Out in Ownership.

```markdown
### End Conditions

- [ ] {Completion criterion 1: What must be output}
- [ ] {Completion criterion 2: What must PASS}
```

**Rules:**
- Each item in End Conditions MUST correspond to an Out in Ownership
- The orchestrator agent verifies End Conditions during phase transitions

### 3.3 S3: Ownership

**Purpose:** Define file input/output. As agent = function, explicitly specify In (arguments) / Out (return values) / Work (local variables).

#### In (Input)

Files that exist at work start. This agent only reads them and does not modify them (immutable).

```markdown
### In

| file_type | Provider | Usage |
|-----------|--------|------|
| {file_type} | {Creator: user / agent name / framework} | {What it is read for} |
```

#### Out (Output)

Final deliverables at work end. Correspond to deliverables listed in End Conditions. Become the In for the next agent.

```markdown
### Out

| file_type | Destination | Next Consumer |
|-----------|--------|-----------|
| {file_type} | {Path/naming pattern} | {Agent that receives this deliverable as In} |
```

#### Work (Temporary)

Temporary files used only during work. Document only when they exist.

```markdown
### Work

| File | Usage |
|---------|------|
| {Filename/pattern} | {What it is used for} |
```

**Work principles:**
- **Delete** once Out is complete. Do not leave garbage behind
- Other agents do not reference Work. If reference is needed, **promote it to Out**
- Do not reuse. Create new Work for the next execution
- If there is no Work, state "None"

**Criteria for classifying In / Out / Work:**

| Question | Answer | Classification |
|------|------|:----:|
| Does it exist before work starts, and will I not modify it? | Yes | **In** |
| Is it a deliverable included in End Conditions? | Yes | **Out** |
| Is it used only during work and unnecessary after completion? | Yes | **Work** |

### 3.4 S4: Procedure

**Purpose:** Define the normal-flow work steps.

```markdown
## Procedure

1. {Step 1: Verb + object}
2. {Step 2: Verb + object}
   - {Substep or supplementary note}
3. ...
```

**Rules:**
- Write in numbered steps
- Each step begins with a verb
- Procedure covers normal flow only. Write abnormal-case branches in Exception
- **Self-identification rule (all agents):** When communicating with the user for the first time, the agent MUST state its name in bracket notation (e.g., `[orchestrator]`, `[review-agent]`). This enables the user to identify which agent is speaking, aids debugging, and improves session transcript readability

### 3.5 S5: Rules

**Purpose:** Define domain-specific rules, decision criteria, thresholds, and conventions.

```markdown
## Rules

### {Rule category name}

{Define rules using tables, bullet lists, or paragraphs}
```

**Rules:**
- Subsection structure is free per agent
- Optionally add `### Constraints` (things that must not be done) as a subsection
- Separate large rule systems into external documents and link to them (e.g., review-agent → review-standards.md)

### 3.6 S6: Exception

**Purpose:** Define abnormal conditions and responses.

```markdown
## Exception

| Abnormality | Response |
|------|------|
| {Description of abnormal condition} | {Safe response. Principle: Do not proceed by guessing. Report to orchestrator} |
```

**Common principle:** When uncertain, do not proceed by guessing. Report to orchestrator.

**Rules:**
- Cover three categories: Start Conditions unmet, unexpected situations during Procedure, and End Conditions unachievable
- The default report target is orchestrator. Whether orchestrator asks the user is orchestrator's decision
- Responses describe "actions that err on the side of safety" (stop, delegate the decision, present options, etc.)

---

## 4. Required / Optional

| Section | Required | Reason |
|-----------|:----:|------|
| S0: YAML Frontmatter | Yes | Defined externally by Claude Code |
| S1: Identity | Yes | A prompt cannot function without a role declaration |
| S2: Activation | Yes | The work contract. Without it, the agent cannot function as a function |
| S3: Ownership | Yes | Definition of In/Out/Work. The single source of truth for file_type ownership |
| S4: Procedure | Yes | The body of work instructions |
| S5: Rules | Optional | Domain-specific. Some agents may not have any |
| S6: Exception | Yes | Undefined abnormal flows lead to runaway behavior |

---

## 5. Design Rationale for Section Order

| Order | Section | Reason: Why this position |
|:----:|-----------|---------------------|
| S1 | Identity | First, know who you are |
| S2 | Activation | Next, understand why you were called (Purpose), whether you can start (Start), and the goal (End) |
| S3 | Ownership | After knowing the goal, review In/Out/Work. Reading a file list without knowing the goal is meaningless |
| S4 | Procedure | Enter the procedure after grasping the goal and files |
| S5 | Rules | Refer to when uncertain during procedure execution |
| S6 | Exception | Refer to in abnormal situations. Placing it after the normal flow (Procedure) makes the normal/abnormal separation clear |
