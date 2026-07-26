# Project: [Project Name]

## Project Overview

[Describe the user's concept here]

## Concept Distinction (Important)

- **gr-sw-maker** = Tool name / Repository name / npm package name
- **full-auto-dev** = Methodology name (a higher-level concept independent of the tool)
- Do not replace full-auto-dev with gr-sw-maker, or vice versa
- Usage in file names and documents: Use gr-sw-maker for tool-specific topics, full-auto-dev for methodology/process topics

## Development Policy

- This project proceeds with nearly fully automated development
- User confirmation is limited to critical decisions only
- Minor technical decisions are made autonomously by Claude Code
- Specifications are output under docs/spec/ (format selected based on project scale: ANMS/ANPS). Other design artifacts are output as Markdown under docs/
- Process documents (pipeline state, handoff, progress) are output under project-management/
- Process records (reviews, decisions, risks, defects, CRs, traceability) are output under project-records/
- Code under src/, tests under tests/, IaC under infra/
- Refer to the following operational rules:
  - process-rules/full-auto-dev-process-rules.md (Process Rules: phase definitions, quality management)
  - process-rules/full-auto-dev-document-rules.md **v0.0.0** (Document Rules: naming, block structure, versioning. Pre-release before PoC)
  - process-rules/agent-list.md (Agent List: roster, ownership, data flow)
  - process-rules/prompt-structure.md (Prompt Structure Convention: S0-S6)
  - process-rules/glossary.md (Glossary: selection rationale, abbreviation criteria, confusable pair distinctions)
  - process-rules/defect-taxonomy.md (Defect Taxonomy: definitions and usage of error/fault/failure/defect/incident/hazard)
  - process-rules/review-standards.md (Review Standards: R1-R6)
  - process-rules/field-issue-handling-rules.md (Field Issue Handling Rules: conditional)

## Language Settings

- Project primary language: [e.g., en]
- Translation language: [e.g., ja (blank = single-language project)]
- Primary language files have no suffix. Translation versions only get `-{lang}.md` suffix
- Field names and namespaces are fixed in English. Field values, Detail Blocks, and agent prompts are written in the primary language

## Specification Format Selection

Select specification format based on project scale:

| Level | Abbreviation | Full Name | Representation | Scale |
|-------|-------------|-----------|----------------|-------|
| 1 | ANMS | AI-Native Minimal Spec | Single Markdown file | Fits in one context window |
| 2 | ANPS | AI-Native Plural Spec | Multiple Markdown files + Common Block | Does not fit, no GraphDB needed |
| 3 | ANGS | AI-Native Graph Spec | GraphDB + Git (MD as views) | Large scale |

- Template: process-rules/spec-template.md
- Determine format with user during setup phase based on scale assessment

## Technology Stack

- Language: [e.g., TypeScript]
- Framework: [e.g., Next.js 15]
- Database: [e.g., PostgreSQL]
- Test Framework: [e.g., Vitest]
- Performance Testing: [e.g., k6]
- Container: [e.g., Docker / docker-compose]
- IaC: [e.g., Terraform]
- CI/CD: [e.g., GitHub Actions]
- Observability: [e.g., OpenTelemetry + Grafana]

## Branch Strategy

- Main branch: main (direct commits prohibited)
- Development branch: develop (integration branch)
- Feature branches: feature/{issue-number}-{description} (branched from develop)
- Defect fix branches: fix/{issue-number}-{description}
- Release branches: release/v{version} (branched from develop)
- PR merge: develop → main allowed only after review-agent PASS
- Agent Teams parallel implementation: use git worktree, each agent works on a dedicated branch

## Coding Standards

- [Project-specific rules]
- Follow ESLint configuration
- Add JSDoc comments to all public functions
- Handle errors explicitly
- Use structured logging (JSON format) (console.log is prohibited)
- **Naming is sacred:** Generic meaningless words such as `type`, `data`, `info`, `value` are prohibited. Names must convey "what it is" at a glance. Qualify the type with a domain prefix (e.g., `status` → `decision_status`)
- **AI/LLM Prompt Placement Principle:** Product prompts go under `src/` (equivalent to code). Project-driving prompts go under `.claude/` (meta layer). Do not mix them

## Security Requirements

- Countermeasures against OWASP Top 10 are mandatory
- Use JWT for authentication
- Always validate input values
- Use parameterized queries as SQL injection countermeasure
- SAST: CodeQL (auto-executed in GitHub Actions)
- SCA: npm audit / Snyk (must run when adding dependencies)
- Secret scanning: git-secrets or truffleHog (pre-commit hook)
- Scan results: recorded in project-records/security/ (SAST/SCA/secret scanning)

## Quality Targets (Single Source of Truth for all quality gates)

Agreed with the user during setup. All agents and quality gates reference this section for threshold values.

| Metric | Target | Notes |
|--------|--------|-------|
| Unit test pass rate | [e.g., 95%] or higher | All business logic |
| Integration test pass rate | [e.g., 100%] | API endpoints |
| Code coverage | [e.g., 80%] or higher | Coverage tools |
| E2E tests | Major user flows PASS | Corresponds to Ch4 Gherkin scenarios |
| Performance tests | All NFR numerical targets achieved | [e.g., k6] |
| Security vulnerabilities | Critical: 0, High: 0 | SAST/SCA scan results |
| Review findings | Critical: 0, High: 0 | review-agent output |
| Coding convention compliance | 0 violations | Linter execution results |
| Cost budget alert threshold | [e.g., 80%] of budget | Triggers user notification |
| Patch response time | Critical: [e.g., 48h], High: [e.g., 1 week] | operation phase only |

## API Documentation

- Output in OpenAPI 3.0 format under docs/api/
- architect agent generates simultaneously with spec Ch3 elaboration
- After implementation, test-engineer verifies consistency with endpoints

## Observability Requirements

- Logging: structured JSON format, 4 levels: DEBUG/INFO/WARN/ERROR
- Metrics: instrument RED (Rate/Error/Duration) metrics on all APIs
- Tracing: request tracing with OpenTelemetry
- Alerting: alert on error rate >1%, P99 latency exceeding SLA

## Agent Teams Configuration

When working with Agent Teams, use the following role definitions:

- **Orchestrator Agent (orchestrator)**: Project-wide orchestration. Manages pipeline-state.md / executive-dashboard.md / final-report.md / decision records. Controls phase transitions and quality gates. Defined in `.claude/agents/orchestrator.md`
- **SRS Agent (srs-writer)**: Creates specification under docs/spec/ based on user-order.md (3-question format) + process-rules/spec-template.md (Ch1-2 Foundation & Requirements, format selected during setup phase). Structures user concepts
- **Architect Agent (architect)**: Elaborates ANMS spec Ch3-6 under docs/spec/ (Architecture, Specification, Test Strategy, Design Principles). Generates OpenAPI spec under docs/api/
- **Security Agent (security-reviewer)**: Creates security design under docs/security/. Reviews implementation code for vulnerabilities. Records scan results as security-scan-report under project-records/security/
- **Implementer Agent (implementer)**: Implements code under src/. Follows design documents, adheres to Clean Architecture and DIP. Also creates unit tests
- **Test Agent (test-engineer)**: Creates and executes tests under tests/. Generates coverage reports
- **Review Agent (review-agent)**: Outputs review reports to project-records/reviews/. Reviews from R1-R6 perspectives (SW engineering principles, concurrency, performance), blocking phase transition until Critical/High findings reach zero
- **PM Agent (progress-monitor)**: Outputs progress reports to project-management/progress/. Manages WBS/defect curve/cost
- **Change Manager Agent (change-manager)**: Records user-initiated change requests to project-records/change-requests/ after spec approval, performs impact analysis. impact_level=high requires user approval. AI-side technical changes are managed via defect/decision
- **Risk Manager Agent (risk-manager)**: Records risk entries to project-records/risks/, manages risk-register.md. Notifies user when score≧6
- **License Checker Agent (license-checker)**: Checks license compatibility when adding dependencies, manages attribution
- **Kotodama-kun Agent (kotodama-kun)**: Checks that terminology and naming in artifacts comply with framework glossary and project glossary
- **Framework Translation Verifier Agent (framework-translation-verifier)**: Verifies multi-language translation consistency of framework documents before release
- **User Manual Writer Agent (user-manual-writer)**: Creates user manual under docs/ during delivery phase
- **Runbook Writer Agent (runbook-writer)**: Creates operational runbook under docs/operations/ during delivery phase
- **Incident Reporter Agent (incident-reporter)**: Creates incident reports under project-records/incidents/ during operation phase
- **Process Improver Agent (process-improver)**: Conducts retrospectives at each phase completion, proposes process improvements through defect pattern root cause analysis
- **Decree Writer Agent (decree-writer)**: Safely applies approved improvements to governance files (CLAUDE.md, agent definitions, process-rules). Executes changes after safety checks including self-modification prohibition and quality gate protection, records before/after diff
- **Field Test Engineer Agent (field-test-engineer)** (conditional: field testing enabled): Conducts field testing with user, records feedback, performs post-fix verification. Owner of field-issue tickets
- **Feedback Classifier Agent (feedback-classifier)** (conditional: field testing enabled): Classifies feedback against spec as defect / CR / question
- **Field Issue Analyst Agent (field-issue-analyst)** (conditional: field testing enabled): Root cause analysis (defect), solution planning (defect / CR), impact/side-effect/alternative analysis

## Critical Decision Criteria

Seek user confirmation in the following cases:

- Fundamental architectural choices
- External dependency selection (HW/AI/Framework) (dependency-selection phase)
- External service/API selection
- Significant changes to security model
- Decisions affecting budget or schedule
- Ambiguous requirements with multiple possible interpretations
- Risk score of 6 or higher
- Cost budget reaching the alert threshold defined in Quality Targets above
- Change request with High impact level

Claude Code may decide autonomously in the following cases:

- Specific library version selection
- Code refactoring approach
- Test case design
- Documentation structure
- Defect fix methods

## Mandatory Process Configuration (see process-rules/full-auto-dev-process-rules.md Chapter 3)

- Change management: post-spec-approval changes are processed via change-manager agent
- Risk management: create risk register at planning phase completion, update at each phase start
- Traceability: record requirement ID → design ID → test ID mapping in project-records/traceability/
- Issue management: defects are recorded as defect tickets in project-records/defects/ with root cause analysis
- License management: run license-checker agent when adding dependencies
- Audit trail: record critical decisions in project-records/decisions/
- Cost management: record API token consumption in project-management/progress/cost-log.json

## Conditional Processes (determined during setup phase)

Enable only when applicable conditions exist:
- Legal research: [enabled/disabled] - Reason: [describe]
- Patent research: [enabled/disabled] - Reason: [describe]
- Technology trend research: [enabled/disabled] - Reason: [describe]
- Functional safety (HARA/FMEA/FTA): [enabled/disabled] - Reason: [describe]
- Accessibility (WCAG 2.1): [enabled/disabled] - Reason: [describe]
- HW integration: [enabled/disabled] - Reason: [describe]
- AI/LLM integration: [enabled/disabled] - Reason: [describe]
- Framework requirement definition: [enabled/disabled] - Reason: [describe]
- HW production process management: [enabled/disabled] - Reason: [describe]
- Product i18n/l10n: [enabled/disabled] - Reason: [describe]
- Certification acquisition: [enabled/disabled] - Reason: [describe]
- Operations and maintenance: [enabled/disabled] - Reason: [describe]
- Field testing: [enabled/disabled] - Reason: [describe]

## Document Base Format (MCBSMD)

- Output the entire content **as a single Markdown code block** so it can be copied in one go.
- **Enclose the entire Markdown with six backticks ` `````` ` at the beginning and end.** Specify its language as markdown.
- **Use these six backticks only once as the outermost enclosure.**
- **Never output speculation or fabrications.** If something is unclear or requires investigation, explicitly state so.
- This method is called **MCBSMD** (Multiple Code Blocks in a Single Markdown)

### Code and Diagram Block Rules

- As a rule, use Mermaid for diagrams. Use PlantUML only when the diagram cannot be expressed in Mermaid.
- Any diagrams or software code inside the Markdown must each be enclosed in their own code blocks using triple backticks ` ``` `.
- Each code block must specify a language or file type (e.g., ` ```python ` or ` ```mermaid `).
- Each code or diagram block must be preceded by a descriptive title in the format **title:**
  (e.g., `**System Architecture:**`, `**Login Flow:**`)
- Always follow the structure below for every code or diagram block:

  > **title:**
  >
  > ```language
  > (code or diagram content here without truncation or abbreviation)
  > ```
  >
  > Write the explanation for the code block here, immediately after the block, following a blank line.

- Do not write explanations inside the code blocks.
- In all diagrams, use alphanumeric characters and underscores (`_`) by default; non-ASCII plain text (no spaces) is permitted when necessary. Special symbols (e.g., `\`, `/`, `|`, `<`, `>`, `{`, `}`) are strictly prohibited.
- Output all diagram content without omission. Never use `...` or any shorthand.

### Diagram Label and Notation Rules

- All arrows and relationship lines in diagrams MUST have labels. Follow these notation rules:
  1. Mermaid `flowchart` and `graph`: place the label inside the arrow using pipes (e.g., `A -->|Label| B`)
  2. Other Mermaid diagrams / All PlantUML: place the label after the arrow using a colon (e.g., `A --> B : Label`)
- For line breaks in labels or node text:
  1. Mermaid: use `<br/>` inside a quoted string (e.g., `A -->|"Line1<br/>Line2"| B`, `A["Line1<br/>Line2"]`)
  2. PlantUML: use `\n` (e.g., `A -> B : Line1\nLine2`)

### Math Rules

- Use standard LaTeX notation for all mathematical formulas.
  1. Inline math: always use single dollar signs. Place a space before the opening `$`
     and a space after the closing `$`
     (e.g., `The function is $y = x + 1$ here.`)
  2. Block equations: always place `$$` on its own line, above and below the formula.
     Example:
     > $$
     > E = mc^2
     > $$
