Read user-order.md and start the nearly fully automated software development process.

**Reference rules:** Follow process-rules/full-auto-dev-document-rules-ja.md (Document Management Rules) and process-rules/full-auto-dev-process-rules-ja.md (Process Rules).

Execute the following phases sequentially:

## Phase 0: Conditional Process Evaluation (Mandatory — Execute Before Writing Specifications)
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
0o. Report evaluation results to the user and request confirmation on adding conditional processes

## Phase 1: Planning (Interview & Specification)
1a. Analyze user-order.md
1b. Conduct a structured interview with the user based on user-order.md
    - Domain deep-dive, scope boundaries, edge cases, priorities, constraints, known compromises, non-functional requirements
    - **Domain boundary identification**: Clarify "What is the core logic unique to this project?" and "Is this theory/algorithm part of the domain, or just used as an existing library?"
    - Limit to 3-5 questions per round. Summarize answers and confirm as you proceed
    - End when the user judges "that's enough"
1c. Record interview results in project-management/interview-record.md and request user confirmation
1d. Create mocks/samples/PoCs and request user feedback (UI: wireframes/HTML mocks, API: OpenAPI snippets, Data: ER diagrams/sample JSON). Incorporate feedback and iterate until the user judges "looks right"
1e. Refer to process-rules/spec-template-ja.md and create the specification in docs/spec/[project-name]-spec.md using interview results + user-order.md as input (Ch1-2: Foundation & Requirements, format selected in the setup phase)
1f. Place skeletons (headings only) for Ch3-6 in the same file
1g. Report the specification overview to the user and request approval
1h. Conduct quality review of specification Ch1-2 with review-agent (R1 perspective: R1a structural quality + R1b expression quality), proceed after PASS

## Phase 2: External Dependency Selection (Conditional — Only When HW/AI/Framework Integration Exists)
2a. Check Phase 0 conditional process evaluation results
    → If none of HW integration, AI/LLM integration, or framework requirement definition apply: Skip to Phase 3
2b. Evaluate and select external dependencies (HW/AI/Framework)
2c. Create requirement-spec for each external dependency under docs/ (hw-requirement-spec, ai-requirement-spec, framework-requirement-spec)
2d. Design Adapter layer interfaces (abstraction based on DIP)
2e. Record selection results in project-records/decisions/
2f. Report selection results to the user and request approval

## Phase 3: Design (After Specification Ch1-2 Approval)
3a. Detail Ch3 (Architecture) of the specification in docs/spec/ (perform layer classification first: classify all components into Entity/UseCase/Adapter/Framework and document at the beginning of Ch3)
3b. Detail Ch4 (Specification) of the specification in docs/spec/ using Gherkin
3c. Define Ch5 (Test Strategy) of the specification in docs/spec/
3d. Configure Ch6 (Design Principles Compliance) of the specification in docs/spec/
3e. Generate OpenAPI 3.0 specification in docs/api/openapi.yaml
3f. Create security design in docs/security/
3g. Create observability design (logging, metrics, tracing, alerting) in docs/observability/observability-design.md
3h. Create WBS and Gantt chart in project-management/progress/wbs.md
3i. Create risk register in project-records/risks/ with risk-manager
3j. [If functional safety is enabled] Conduct safety analysis (see defect-taxonomy-ja.md section 7 for details):
    - HARA: Before Ch3 detailing, perform hazard enumeration, safety goal assignment, and ASIL/SIL allocation → project-records/safety/hara-*.md
    - Add safety requirements to spec-foundation Ch2 NFR
    - FMEA: After Ch3 is finalized, perform component-level failure mode analysis → project-records/safety/fmea-*.md
    - FTA: If hazards with ASIL C or higher exist, analyze logical structure of causes → project-records/safety/fta-*.md
3k. Conduct quality review of specification Ch3-4 and design with review-agent (R2/R4/R5 perspectives), proceed after PASS

## Phase 4: Implementation
4a. Implement code in src/ based on the specification (parallel implementation with Git worktree)
4b. Incorporate structured logging, metrics instrumentation, and tracing into code based on the observability design
4c. Create and execute unit tests in tests/
4d. Conduct implementation code review with review-agent (R2/R3/R4/R5 perspectives), proceed after PASS
4e. Execute SCA scan (npm audit, etc.) with security-reviewer and confirm zero Critical/High vulnerabilities
4f. Conduct license verification with license-checker

## Phase 5: Testing
5a. Create and execute integration tests
5b. Create and execute system tests to the extent possible
5c. Execute performance tests based on NFR numerical targets in specification Ch2 and record results in project-records/performance/
5d. Update test execution curve and defect curve
5e. Conduct test code review with review-agent (R6 perspective)
5f. Evaluate quality criteria

## Phase 6: Delivery
6a. Conduct final review of all deliverables with review-agent (all R1-R6 perspectives)
    → If FAIL: Return to the corresponding phase based on the review perspective and fix
6b. Build container images and verify IaC configuration in infra/
6c. Execute deployment and confirm basic operation with smoke tests
6d. Verify that monitoring and alerting configuration matches the observability design
6e. Verify and document rollback procedures
6f. Create final report in final-report.md
6g. Create acceptance test procedures
6h. Report completion to the user

## Phase 7: Operation & Maintenance (Conditional — Only When Operation & Maintenance Is Enabled)
7a. Establish incident management structure (place incident-report template)
7b. Configure scheduled execution of patch application and security scans
7c. Verify SLA monitoring (alerting and dashboards based on the observability design)
7d. Plan recovery procedure drills based on the disaster-recovery-plan
7e. When a production incident occurs, create an incident-report and conduct root cause analysis

Report progress at the completion of each phase.
Request user confirmation when important decisions are needed.
Make minor technical decisions autonomously.
