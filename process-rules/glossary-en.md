# Glossary

> **Purpose of this document:** Definitions of terms used in the full-auto-dev framework. General dictionary terms are not included. This document records framework-specific meanings, selection rationale, and non-adopted alternatives.
> **Related documents:** [Process Rules](full-auto-dev-process-rules.md), [Document Management Rules](full-auto-dev-document-rules.md), [Agent List](agent-list.md), [Defect Taxonomy](defect-taxonomy.md)

---

## 1. Intentionally Selected Terms

Terms where one synonym was intentionally chosen from multiple alternatives. Non-adopted alternatives and reasons are recorded.

| Term | English | Definition | Not Adopted | Reason |
|------|---------|------------|-------------|--------|
| requirement | requirement | A condition the system must satisfy. Formalized using EARS syntax | 要件 (yoken) | "requirement" is the root concept (what is demanded). 要件 is a derivative (conditions to be met). Unified to "requirement" |
| interview | interview | Structured questioning of users for requirement elicitation | ヒアリング (hearing) | "hearing" is Japanese-English (wasei-eigo). In English, "hearing" means a court proceeding or the sense of hearing |
| status | status | A value indicating the current position in a workflow | state | The distinction between state (mode of existence) and status (progress position) is unnecessary in practice. Unified to status |
| error | error | A mistake in human cognition, judgment, or operation. The cause of a fault (IEEE 1044). See [defect-taxonomy](defect-taxonomy.md) for details | 誤り (ayamari) | Unified to English term. The Japanese word "誤り" is an everyday word with low technical precision |
| fault | fault | An incorrect condition latent in code, design, or specification resulting from an error. Does not manifest until discovered (IEEE 1044, IEC 61508) | フォールト, 欠陥 | Unified to English term. Katakana form also not adopted |
| failure | failure | An event where a fault manifests at runtime and the system no longer satisfies requirements (IEEE 1044, IEC 61508) | フェイラー, 故障, 障害 | "故障" (koshou) is hardware-oriented, "障害" (shougai) is ambiguous. Unified to English term |
| defect | defect | A formal record (file_type) of a failure (or fault) discovered during testing or operations. Causal chain: error → fault → failure → defect | 障害, bug, バグ, 不具合 | "障害" is deprecated due to confusion with failure/incident. Unified to English term |
| incident | incident | An unplanned event affecting services in a production environment (ITIL, ISO 20000). file_type: incident-report | 障害, インシデント | Unified to English term. Katakana form also not adopted |
| hazard | hazard | A danger source where a failure could cause harm to life, property, or environment (IEC 61508). Used when the conditional process "Functional Safety" is enabled | ハザード | Unified to English term |
| fault origin | fault origin | The phase where a fault was introduced. Three classifications: requirements fault / design fault / implementation fault (IEEE 1044). Used in root cause analysis of defect | — | A classification axis for identifying the origin of a fault in the causal chain |
| HARA | HARA | Hazard Analysis and Risk Assessment (ISO 26262). An analysis method to identify hazard at the system level and derive safety goals. Required when Functional Safety is enabled | — | Top-down analysis. See [defect-taxonomy §7](defect-taxonomy.md) for details |
| FMEA | FMEA | Failure Mode and Effects Analysis (IEC 60812). A method to comprehensively analyze fault modes and effects at the component level | — | Bottom-up analysis. Performed after Ch3 is finalized |
| FTA | FTA | Fault Tree Analysis (IEC 61025). An analysis method that traces causes from a specific top event using AND/OR gates in reverse | — | Top-down analysis. Used for root cause analysis of high-risk hazard or critical incident |
| interview-record | interview-record | A structured record of user interviews (file_type) | hearing-record | Linked to the selection of interview above |
| disaster-recovery-plan | disaster-recovery-plan | Definition of recovery procedures based on RPO/RTO (file_type) | dr-plan | Follows the namespace abbreviation prohibition rule |

## 2. Framework-Specific Concepts

Concepts defined by this framework that are not found in dictionaries.

| Term | Definition |
|------|------------|
| STFB | Stable Top, Flexible Bottom. A specification chapter structure based on the Stable Dependencies Principle. Upper chapters are stable and abstract; lower chapters are variable and concrete |
| ANMS | AI-Native Minimal Spec. A specification format in a single Markdown file. For projects that fit within one context window |
| ANPS | AI-Native Plural Spec. A specification format using multiple Markdown files + Common Block. For medium-scale projects |
| ANGS | AI-Native Graph Spec. A specification format using GraphDB + Git. For large-scale projects. MD serves as views |
| Common Block | A metadata block common to all file_type. Identity proof of the file (identification, state, workflow, context, provenance) |
| Form Block | A structured field block specific to each file_type. Parsed by agents for decisions and actions |
| Detail Block | The detailed description zone. The body of domain knowledge. Read by both humans and agents for understanding |
| Footer | The update history block. Append-only. For auditing |
| In | Agent input. Files that exist at the start of work. Immutable (read-only) |
| Out | Agent output. The final deliverable at the end of work. Corresponds to End Conditions. Becomes the In for the next agent |
| Work | Agent temporary working files. Deleted after Out is completed. Not reused |

## 3. Abbreviation Permission Decisions

Records of abbreviation usage decisions in namespaces (file_type names). Principle: abbreviations are prohibited (document-rules §7).

| Abbreviation | Full Name | Decision | Reason |
|--------------|-----------|:--------:|--------|
| WBS | Work Breakdown Structure | Permitted | A common PM term. Nobody writes "Work Breakdown Structure" in full |
| SRS | Software Requirements Specification | Permitted for agent name only | `srs-writer` is an agent name (not subject to namespace rules). Cannot be used in namespaces |
| DR | Disaster Recovery | Not permitted | Renamed to `disaster-recovery-plan`. Within the 3-word limit |
| CR | Change Request | Not permitted | Renamed to field name `change_request_status` |
| HW | Hardware | Permitted | Used in file_type `hw-requirement-spec`. `hardware-requirement-spec` exceeds the 4-word limit |
| AI | Artificial Intelligence | Permitted | A common term. Used in `ai-requirement-spec` |
| FW | Framework | Not permitted | `framework-requirement-spec` is within the 3-word limit. Abbreviation unnecessary |

## 4. Distinguishing Confusable Pairs

Clarifying distinctions between concepts that are similar but different.

| Pair | Distinction |
|------|-------------|
| gr-sw-maker vs full-auto-dev | gr-sw-maker = tool name / repository name / npm package name. full-auto-dev = methodology name (a higher-level concept independent of the tool). They must never be interchanged. Use gr-sw-maker for tool-specific topics and full-auto-dev for methodology/process topics |
| requirement vs change request | requirement = a condition the system must satisfy. change request = a user-initiated change request after specification approval. Both contain "request" but in English they are distinct words: requirement vs request |
| specification vs template | specification = a project-specific deliverable (docs/spec/). template = a boilerplate provided by the framework (process-rules/spec-template.md) |
| agent vs sub-agent | agent = one of the role definitions registered in agent-list §1. sub-agent = a child process spawned by Claude Code (which may include agents) |
| orchestrator vs organizer | orchestrator = the orchestrator agent defined in the process rules. organizer = a graph-traversal agent proposed in the ANGS paper. Currently the same role referred to by different names in different contexts |
| document_status vs {type}_status | Both are status. document_status = Common Block (document lifecycle: draft/in-review/approved/archived). {type}_status = Form Block (domain-specific workflow position) |
| fault vs defect | fault = an incorrect condition latent in code (undiscovered). defect = a formal issue ticket recorded after discovery (file_type). A fault is discovered and filed as a defect |
| failure vs incident | failure = a technical event where requirements are no longer satisfied (including during testing). incident = an operational event where a failure affects services in production. A failure during testing is not an incident |
| defect vs incident | defect = a discovery record during testing/development (file_type: defect, owner: test-engineer). incident = an occurrence record in production (file_type: incident-report, owner: incident-reporter). They differ by phase |
| hazard vs risk | hazard = a danger source to life and property (IEC 61508). risk = an impact on project objectives (file_type: risk). hazard is specific to functional safety; risk is common to all projects |
