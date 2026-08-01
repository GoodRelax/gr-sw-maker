Read user-order.md and start the nearly fully automated software development process.

**Reference rules:** Follow process-rules/full-auto-dev-document-rules.md (Document Management Rules) and process-rules/full-auto-dev-process-rules.md (Process Rules).

Execute the following phases sequentially:

## Phase 0: Conditional Process Evaluation (Mandatory — Execute Before Writing Specifications)
0-pre. Start the measurement path (mandatory before the run; Process Rules §3.2.7)
    - If `.claude/settings.local.json` carries no OpenTelemetry env, write it (`CLAUDE_CODE_ENABLE_TELEMETRY=1`, `OTEL_METRICS_EXPORTER=otlp`, `OTEL_LOGS_EXPORTER=otlp`, `OTEL_EXPORTER_OTLP_PROTOCOL=http/json`, `OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:4318`, `OTEL_METRIC_EXPORT_INTERVAL=10000`, `OTEL_LOGS_EXPORT_INTERVAL=5000`. **Omit the last two and the default export intervals are long enough that the check below waits without cause**)
      → If it had to be written, ask the user to restart Claude Code. env is read only at startup, so nothing is exported until the restart
    - Start the receiver. On Windows run `cmd /c start "" "tools\start-otel-sink.bat"`; on other systems run `nohup node tools/otel-sink.mjs &`. **Never drop the empty `""` on Windows (MUST NOT).** `start` reads the first unquoted word as the program name rather than the window title, and fails saying that name was not found
    - Read project-management/progress/session-state.json and tell the two stopped states apart
      - The file is absent, or `sink_heartbeat_at` does not advance → the receiver is not running. Start it again
      - `sink_heartbeat_at` advances but `last_event_at` is null → the receiver is alive but the sender is off. Check the env and the restart
    → Never proceed to Phase 1 until neither state holds (MUST NOT). Only the user may decide to run without measurement, and that decision is recorded as a decision
0a. Read user-order.md
0b. Validate user-order.md: Confirm the following mandatory items are documented
    - What do you want to build (What), and why (Why)
    → If any items are missing: Supplement through dialogue with the user before proceeding
0b2. Propose CLAUDE.md based on user-order.md content (project name, tech stack, coding conventions, security policy, branch strategy, language settings, etc.)
    - Language settings: Determine the project primary language (ISO 639-1) and translation languages
    → Place CLAUDE.md after user approval
0c. Evaluate necessity of functional safety (impact on human life/infrastructure, safety standard compliance)
    → If applicable: Immediately request user confirmation and finalize safety requirements before proceeding
0d. Evaluate necessity of regulatory investigation (personal data, medical, financial, telecommunications, EU market, public sector)
    → If applicable: Append to CLAUDE.md and include regulatory requirements in the specification's non-functional requirements
0e. Evaluate necessity of patent investigation (novel algorithms, AI models, commercial sales)
    → If applicable: Add patent investigation tasks to the WBS before the design phase begins
0f. Evaluate necessity of technology trend investigation (exceeds 6 months, rapidly changing technology domains, approaching EOL)
    → If applicable: Add technology trend review steps to the WBS at the start of each phase
0g. Evaluate necessity of accessibility (WCAG 2.1) (web apps, EU market targets, etc.)
    → If applicable: Append to CLAUDE.md and include accessibility requirements in the specification's NFR
0h. Evaluate necessity of HW integration (embedded/IoT, physical device control, sensors/actuators)
    → If applicable: Append to CLAUDE.md and include HW requirements in the planning phase interview
0i. Evaluate necessity of AI/LLM integration (embedded AI features, prompt engineering, use of inference results)
    → If applicable: Append to CLAUDE.md and include AI requirements in the planning phase interview
0j. Evaluate necessity of framework requirement definition (non-standard I/F frameworks, expected replacements, EOL risks)
    → If applicable: Append to CLAUDE.md and conduct evaluation/selection in the dependency-selection phase
0k. Evaluate necessity of HW production process management (HW integration with mass production, supply chain management)
    → If applicable: Add supply chain management and incoming inspection tasks to the WBS
0l. Evaluate necessity of product i18n/l10n (multilingual support, RTL languages, localization)
    → If applicable: Add i18n requirements to the specification Ch2 NFR
0m. Evaluate necessity of certification acquisition (CE/FCC/medical device certification and other public certifications)
    → If applicable: Add certification acquisition tasks to the WBS and plan submission document creation
0n. Evaluate necessity of operation & maintenance (production environment operation, SLA guarantees, post-release maintenance)
    → If applicable: Enable the operation phase and include RPO/RTO and monitoring architecture in the design phase
0n2. Evaluate whether field testing is required (HW integration enabled and device operation must be confirmed with the user present)
    -> If applicable: activate field-test-engineer / feedback-classifier / field-issue-analyst in the testing phase
0o. Report evaluation results to the user and request confirmation on adding conditional processes
0p. Launch project-manager to initialize project-management/pipeline-state.md

## Phase 1: Planning (Interview & Specification)
1a. Analyze user-order.md
1b. Launch srs-writer to conduct a structured interview with the user based on user-order.md
    - Domain deep-dive, scope boundaries, edge cases, priorities, constraints, known compromises, non-functional requirements
    - **Domain boundary identification**: Clarify "What is the core logic unique to this project?" and "Is this theory/algorithm part of the domain, or just used as an existing library?"
    - Limit to 3-5 questions per round. Summarize answers and confirm as you proceed
    - End when the user judges "that's enough"
1c. srs-writer records interview results in project-management/interview-record.md and requests user confirmation
1d. srs-writer creates mocks/samples/PoCs and requests user feedback (UI: wireframes/HTML mocks, API: OpenAPI snippets, Data: ER diagrams/sample JSON). Incorporate feedback and iterate until the user judges "looks right"
1e. srs-writer refers to process-rules/spec-template.md and creates the specification in docs/spec/[project-name]-spec.md using interview results + user-order.md as input (Ch1-2: Foundation & Requirements, format selected in the setup phase)
1f. srs-writer places skeletons (headings only) for Ch3-6 in the same file
1g. Report the specification overview to the user and request approval
1h. Conduct quality review of specification Ch1-2 with review-agent (R1 perspective: R1a structural quality + R1b expression quality)
1i. Launch technical-authority to decide GATE-INTERVIEW and GATE-PLANNING (Process Rules section 9.4.1). **This transition has two gates.** Proceed after PASS

## Phase 2: External Dependency Selection (Conditional — Only When HW/AI/Framework Integration Exists)
2a. Check Phase 0 conditional process evaluation results
    → If none of HW integration, AI/LLM integration, or framework requirement definition apply: Skip to Phase 3
2b. Launch architect to evaluate and select external dependencies (HW/AI/Framework)
2c. architect creates requirement-spec for each external dependency under docs/ (hw-requirement-spec, ai-requirement-spec, framework-requirement-spec)
2d. architect designs Adapter layer interfaces (abstraction based on DIP)
2e. Launch project-manager to record selection results in project-records/decisions/
2f. Report selection results to the user and request approval
2g. Launch technical-authority to decide GATE-DEPENDENCY (Process Rules section 9.4.1)

## Phase 3: Design (After Specification Ch1-2 Approval)
3a. Launch architect to detail Ch3 (Architecture) of the specification in docs/spec/ (perform layer classification first: classify all components into Entity/UseCase/Adapter/Framework and document at the beginning of Ch3)
3b. architect details Ch4 (Specification) of the specification in docs/spec/ using Gherkin
3c. architect defines Ch5 (Test Strategy) of the specification in docs/spec/
3d. architect configures Ch6 (Design Principles Compliance) of the specification in docs/spec/
3e. architect generates the OpenAPI 3.0 specification in docs/api/openapi.yaml
3f. Launch security-reviewer to create threat-model (STRIDE) and security-architecture in docs/security/
3g. architect creates the observability design (logging, metrics, tracing, alerting) in docs/observability/observability-design.md
3g2. architect creates the deployment design (environments, deployment procedure, rollback, secret management) in docs/operations/deployment-design.md
3h. Launch progress-monitor to create the WBS and Gantt chart in project-management/progress/wbs.md
3i. Create risk register in project-records/risks/ with risk-manager
3j. [If functional safety is enabled] Conduct safety analysis (see defect-taxonomy.md section 7 for details):
    - HARA: Before Ch3 detailing, perform hazard enumeration, safety goal assignment, and ASIL/SIL allocation → project-records/safety/hara-*.md
    - Add safety requirements to spec-foundation Ch2 NFR
    - FMEA: After Ch3 is finalized, perform component-level failure mode analysis → project-records/safety/fmea-*.md
    - FTA: If hazards with ASIL C or higher exist, analyze logical structure of causes → project-records/safety/fta-*.md
3k. Conduct quality review of specification Ch3-4 and design with review-agent (R2/R4/R5/R7 perspectives)
3l. Launch technical-authority to decide GATE-DESIGN (Process Rules section 9.4.1). Proceed after PASS

## Phase 4: Implementation
4a. Launch implementer to implement code in src/ based on the specification (parallel implementation with Git worktree)
4b. implementer incorporates structured logging, metrics instrumentation, and tracing into code based on the observability design
4c. implementer creates and executes unit tests in tests/
4c2. implementer implements the IaC code in infra/ based on the deployment-design
4d. Conduct implementation code review with review-agent (R2/R3/R4/R5/R7 perspectives), proceed after PASS
4e. Execute SCA scan (npm audit, etc.) with security-reviewer and confirm zero Critical/High vulnerabilities
4f. Conduct license verification with license-checker
4g. Launch technical-authority to decide GATE-IMPL (Process Rules section 9.4.1)

## Phase 5: Testing
5a. Launch test-engineer to create and execute integration tests
5b. test-engineer creates and executes system tests to the extent possible
5c. test-engineer executes performance tests based on NFR numerical targets in specification Ch2 and records results in project-records/performance/
5c2. [If field testing is enabled] Launch field-test-engineer to run the field test, feedback-classifier to classify the feedback, and field-issue-analyst for root cause analysis and solution planning (follow the Field Issue Handling Rules)
5d. Launch progress-monitor to update the test execution curve and defect curve
5e. Conduct test code review with review-agent (R6 perspective)
5f. Launch technical-authority to decide GATE-TEST (Process Rules section 9.4.1)

## Phase 6: Delivery
6a. Conduct final review of all deliverables with review-agent (all R1-R7 perspectives)
    → If FAIL: Return to the corresponding phase based on the review perspective and fix
6b. implementer builds container images and verifies the IaC configuration in infra/
6c. Execute deployment and confirm basic operation with smoke tests
6d. Verify that monitoring and alerting configuration matches the observability design
6e. Verify and document rollback procedures
6f. Launch project-manager to create the final report in final-report.md
6f2. Launch user-manual-writer to create the user manual under docs/
6f3. Launch runbook-writer to create the operational runbook under docs/operations/
6g. test-engineer creates the acceptance test procedures
6g2. Launch technical-authority to decide GATE-DELIVERY (Process Rules section 9.4.1)
6h. Report completion to the user

## Phase 7: Operation & Maintenance (Conditional — Only When Operation & Maintenance Is Enabled)
7a. Establish incident management structure (place incident-report template)
7b. Configure scheduled execution of patch application and security scans
7c. Verify SLA monitoring (alerting and dashboards based on the observability design)
7d. Plan recovery procedure drills based on the disaster-recovery-plan
7e. When a production incident occurs, launch incident-reporter to create the incident-report and conduct root cause analysis
7f. When closing the project, launch technical-authority to decide GATE-EOL (Process Rules section 9.4.1)

## Common Steps at the Completion of Every Phase (applies to all phases)
Fa. Launch kotodama-kun and check terminology and naming across all Outs of that phase in one pass
Fb. Launch progress-monitor to read project-management/progress/session-state.json and append that phase's token consumption and cost to cost-log.json
    -> If session-state.json is absent or sink_heartbeat_at is stale: the measurement path has stopped. Record in cost-log.json that measurement was unavailable and report it to the user. **Never write an estimated consumption (MUST NOT)**
Fc. If compaction_count in session-state.json has risen above the previous phase, a compaction has happened. Create a **session-handoff** so there is a resumption point (`/session-handoff`; a different file_type from the inter-agent handoff)
    -> Context usage cannot be observed. Never decide to interrupt from an estimated usage figure (MUST NOT); whether to interrupt is the user's call
Fd. Launch project-manager to update pipeline-state.md and executive-dashboard.md and report to the user
Fe. Launch process-improver to run the retrospective and root cause analysis of defect patterns
Ff. Only when the user has approved the improvements from Fe, launch decree-writer to apply them to the governance files
Fg. When the user raises a change request after specification approval, launch change-manager for impact analysis and recording

> framework-translation-verifier maintains the framework documents themselves and is not launched by this pipeline.

Report progress at the completion of each phase.
Request user confirmation when important decisions are needed.
Make minor technical decisions autonomously.
