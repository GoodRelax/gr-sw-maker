# Review Standards (R1–R7)

> **Document positioning:** The single source of truth for the review perspectives referenced by review-agent. process-rules §9.2 is a summary of this document; refer here for details.
> **Related documents:** [Process Rules](full-auto-dev-process-rules.md) §9 Quality Management Framework, [Document Management Rules](full-auto-dev-document-rules.md)

---

## R1: Requirements Quality Review Perspectives (Targeting Spec Ch1-2)

### R1a: Requirements Structural Quality

- Are all functional requirements assigned an ID (FR-xxx)?
- Are untestable expressions ("appropriately," "sufficiently," "fast," etc.) eliminated?
- Are there no contradictory requirements (e.g., multiple outcomes defined for the same operation)?
- Do use cases define both main scenarios and alternative scenarios (error cases)?
- Do non-functional requirements have measurable numeric criteria (e.g., "within 200ms," "99.9% or above")?
- Are entity names and operation names used consistently (no multiple names for the same concept)?
- Are abbreviations and technical terms defined (existence of a glossary)?

### R1b: Requirements Expression Quality (Requirements Engineering Perspective)

**Elimination of ambiguity:**
- Are ambiguous expressions such as "as soon as possible," "appropriately," "as needed," or "as much as possible" eliminated?
- When progressively refining (provisional expression to concrete), is an annotation explicitly stated (e.g., "to be quantified in the design phase")?
- Is the subject (who/what) and action (does what) of each requirement clear?

**Elimination of negation and passive voice:**
- For negative requirements ("must not do X"), is an alternative action defined that specifies what should be done instead?
- Does passive voice ("data is saved") obscure responsibility? Can it be rewritten in active voice ("the system saves data to the DB")?
- Are double negatives ("if not invalid") avoided?

**Coverage of abnormal and semi-normal cases:**
- Are the following perspectives considered for each functional requirement?
  - Timeout (no response from external service)
  - Interruption (user cancels operation midway)
  - Concurrent operations (multiple users simultaneously modifying the same resource)
  - Insufficient permissions (expired authentication, no authorization)
  - Data inconsistency (referenced entity does not exist, type mismatch)
  - Resource exhaustion (disk full, out of memory)
- Are semi-normal cases (normal but special cases) and abnormal cases explicitly defined, not just normal cases?

**Elimination of specification duplication and conflicts (DRY for Specs):**
- Is the same requirement not scattered across multiple locations (when scattered, ambiguity over which is authoritative causes defects)?
- Do not write the same thing twice. If necessary, directly reference the single authoritative source
- Are there no implicit contradictions between requirements in different sections (e.g., preconditions of FR-001 conflict with behavior of FR-015)?
- Are dependencies between requirements explicitly stated (e.g., "FR-005 assumes completion of FR-001")?

**Completeness verification:**
- Are requirements organized from a MECE (mutually exclusive and collectively exhaustive) perspective?
- Are there no missing requirements from each stakeholder's viewpoint (administrator / general user / external system)?
- Are boundary conditions (minimum, maximum, empty, null) explicitly stated?

---

## R2: Software Design Principles Review Perspectives (Targeting Spec Ch3-4 and Code)

### Naming — the most important design property (MUST)

Names are the primary interface of software. A name reveals its essence; code should scream its intent (Screaming Architecture); software is kotodama — words shape what is built. In this framework, naming is the single most important review item, and is therefore MUST, not SHOULD.

- Do variable names accurately represent their roles (no generic names like `data`, `info`, `tmp`, `obj`)?
- Are function names in verb + object form (no vague verbs like `process`, `handle`, `manage`)?
- Do Boolean variable/function names start with `is/has/can/should`?
- Are collection variable names pluralized?
- Are abbreviations used consistently (no mixing of `Usr` and `User`)?

### SOLID Principles

**SRP (Single Responsibility Principle)**
- Does a single class or unit have multiple reasons to change?
- Watch for naming like "does X and Y" or classes with multiple unrelated methods
- Example finding: `UserService` simultaneously handles authentication, profile management, and email sending

**OCP (Open/Closed Principle)**
- Does adding new functionality require modifying existing code (especially adding if/switch branches)?
- Are extension points provided through Strategy Pattern, Template Method Pattern, etc.?

**LSP (Liskov Substitution Principle)**
- Does a subclass strengthen preconditions or weaken postconditions of the parent class?
- Does an overridden method change the parent's contract (exception types, return value semantics)?

**ISP (Interface Segregation Principle)**
- Does an implementation class implement an interface containing methods it does not use?
- Can large interfaces be split by usage?

**DIP (Dependency Inversion Principle)**
- Does the upper module (business logic) directly depend on concrete classes of the lower module (DB, external API)?
- Does the dependency direction go through interfaces or abstract classes?

### Other Design Principles

**DRY (Don't Repeat Yourself)**
- Is the same logic duplicated in multiple places?
- Are magic numbers and magic strings scattered throughout (are they defined as constants)?
- Is the same validation redundantly implemented across multiple layers?

**KISS (Keep It Simple, Stupid)**
- Is the solution unnecessarily complex for the problem?
- Is function nesting depth 4 or more?
- Can complex conditional branches be flattened using early returns?

**YAGNI (You Aren't Gonna Need It)**
- Are features not present in current requirements implemented preemptively?
- Is there excessive generalization or abstraction (e.g., an abstract class with only one concrete case at present)?
- Are there unused parameters, flags, or configuration values?

**Comparison against the minimum (Occam's razor)**
- Does Ch3.6 contain ADR-000 "Comparison against the minimal configuration"? (**If it is absent this item is violated. The quality of its content is not at issue here**)
- Is the minimal configuration written as one that *satisfies the requirements* (a proposal that drops requirements is not a minimal configuration)?
- Are the elements the adopted design adds to the minimum enumerated, each with a reason for adding it?
- Do the reasons go beyond "because a convention required it" (**state which convention served which requirement**)?

**SoC (Separation of Concerns)**
- Are UI logic and business logic mixed together?
- Is data access logic leaking into the business logic layer?
- Are validation, transformation, and persistence mixed within the same function?

**SLAP (Single Level of Abstraction Principle)**
- Does a single function mix "high-level intent (what to do)" with "low-level implementation details (how to do it)"?
- Example finding: HTTP processing and SQL string assembly exist in the same function

**LOD (Law of Demeter / Principle of Least Knowledge)**
- Are chain calls like `a.b.c.doSomething()` overused (excessive dependency on structure)?
- Does an object depend on details of entities other than its "immediate friends"?

**CQS (Command Query Separation)**
- Are there methods that simultaneously change state (with side effects) and return values?
- Example finding: `getNextId()` modifies an internal counter while returning a value

**POLA (Principle of Least Astonishment)**
- Does the actual behavior match the behavior expected from the function/method name?
- Are there hidden side effects (state changes other than log output) invisible from the call site?
- Are there reversed Boolean flags (double negatives like `isNotInvalid`)?

**PIE (Program Intently and Expressively)**
- Do variable and function names express not only "what it does" but also "why it does it"?
- Do comments explain "why" rather than "what" (which is obvious from the code)?
- Are there places where introducing temporary variables to name intermediate results would clarify intent?

**CA (Clean Architecture / Layered Architecture)**
- Does the dependency direction point toward the domain layer (inward) (only outside-to-inside dependencies allowed)?
- Are domain entities not contaminated by framework or DB details (annotations, etc.)?
- Is the structure such that changes in the infrastructure layer (DB, external API) do not propagate to business logic?
- **Correctness of layer classification**: Is the layer classification appropriate? Are concepts that belong at the centre misclassified toward the outside? Conversely, are things that could remain outside unnecessarily elevated to the centre? Judge based on "is this essential to the project's purpose, or merely a means?" **The number of layers is not itself a finding.** A design that the default four layers (Entity/UseCase/Adapter/Framework) cannot express is appropriate where Ch3.1 defines its layers and dependency direction
- **Appropriateness of the Adapter layer**: Is the Adapter layer so thin that external dependencies leak into the domain? Is it so thick that business logic has crept into the Adapter layer?

**Component Boundary (R2.19; a different axis from CA)**
- Does anything reference another component's internals directly (under `private/`, a `_` prefix, an import that bypasses the public entry)?
- Is each component's public surface declared in Ch3.3? Is any component missing one?
- Does a public surface leak implementation detail (internal-only types, mutable state)?

**Cache Policy (R2.20; when a cache is used)**
- Is what gets cached recorded in Ch3.6? Has an implicit cache been overlooked (memoization, lazy initialization, an ORM first-level cache, an intermediary HTTP cache)?
- Is invalidation **tied to the upstream change**, rather than relying on expiry alone?
- Is the acceptable staleness written as a number or a condition (not "as fresh as possible")?
- Is the behavior on simultaneous expiry decided (no path where many requests fall through at once)?

**Prompt Engineering (when AI/LLM integration is enabled)**
- Are product prompt templates placed under `src/` (not mixed with the meta-layer under `.claude/`)?
- Does each prompt have explicit input/output schemas (expected input types, expected output types)?
- Are there no ambiguous expressions in prompt instructions (apply the same ambiguity elimination perspective as R1b to prompts)?
- Do tests for prompts (input-to-expected-output pairs) exist under tests/?
- Is a prompt versioning policy defined (handling behavioral changes when models are updated)?
- Are hallucination countermeasures designed (output verification logic, grounding techniques)?

---

## R3: Coding Quality Review Perspectives (Targeting Code)

### Error Handling
- Is error handling present for all external I/O (network, DB, file)?
- Are errors not silently swallowed (empty catch blocks, ignoring with `_`)?
- Do error messages contain contextual information necessary for debugging?
- Do error messages returned to users not contain internal implementation details (stack traces, DB errors)?

### Defensive Programming
- Is all external input (API arguments, environment variables, configuration files) validated?
- Are Null/Undefined/empty array cases handled?
- Are type assertions (`as Type`) not used without safety verification?

### Boundaries and Indices
- Are ranges uniformly half-open `[start, end)`? Where a closed range is used, does its name say so (`endInclusive` and the like)?
- Are iteration and subsequences expressed with an iterator / slice / range, rather than advancing an index by hand?
- Is any endpoint adjusted by `±1` to make a length or a terminator come out right (**that adjustment is a sign half-open and closed are mixed**)?

---

## R4: Concurrency and State Transition Review Perspectives

### Deadlock
**Design level:**
- For flows that simultaneously use multiple resources (DB, cache, files, etc.), is the acquisition order uniformly defined across all paths?
- Is a "resource acquisition order constraint" documented in design documents?
- Are DB transaction isolation levels and access patterns susceptible to deadlocks analyzed?

**Code level:**
- Are nested locks (acquiring `lock B` inside `lock A`) not accessed in multiple acquisition orders?
- Are external API calls or long-running processes not performed inside DB transactions (holding locks for extended periods)?
- When using `SELECT ... FOR UPDATE`, is the acquisition order consistent?

### Race Condition
**Design level:**
- Are flows where concurrent access to shared state can occur identified, with countermeasures designed?
- Is the Check-Then-Act pattern ("check existence then use") designed to be implemented atomically?

**Code level (for JavaScript/TypeScript):**
- In patterns that read and write shared state across multiple `await` calls, can races occur?
  ```
  // Dangerous example
  const count = await getCount();   // Another process may modify count here
  await setCount(count + 1);        // Update based on stale count
  ```
- Are there places where event handlers executing in parallel cause inconsistency in queues or counters?
- Do processes running in parallel via `Promise.all` not competitively update the same resource?
- Are optimistic or pessimistic locks applied where DB Read-Modify-Write is not atomic?

**Code level (for multi-threaded languages):**
- Are appropriate locks, atomic operations, or volatile modifiers applied to shared variable access?
- Are non-thread-safe collections (`HashMap`, etc.) not used in multi-threaded environments?

### Glitch (Momentary Invalid State During State Transition)
**Design level:**
- Are state transition diagrams in Spec Ch3 defined in an implementable form (are intermediate states during transitions explicitly stated)?
- When simultaneous updates of multiple fields are required, is their atomicity guaranteed in the design?

**Code level:**
- Do state transition diagrams defined in Spec Ch3 match the implementation code (are there no invalid state transitions)?
- Are processes that simultaneously update multiple fields not performed outside a transaction?
  ```
  // Dangerous example (intermediate state between order.status and order.completedAt is observable)
  order.status = 'completed';     // At this point status is completed but completedAt is null
  order.completedAt = new Date();
  ```
- In state synchronization between frontend and backend, is there no period where partial updates are observable?
- Is the timing of event notifications explicitly defined as "before" or "after" the state change?

---

## R5: Performance Review Perspectives

### Algorithms and Data Structures
**Design level:**
- Are computational complexities of critical algorithms analyzed to meet performance requirements (NFR in Spec Ch2)?
- Are algorithms with O(n²) or higher complexity not selected for processing large data volumes?

**Code level:**
- Are invariant computations not repeatedly executed inside loops (failure to hoist loop invariants)?
- Where linear search is used, can it be replaced with O(1) access via Map or Set?
- Is there a missing application of binary search on sorted arrays?

### Database and I/O
**Design level:**
- Is index design considered for frequently accessed queries?
- Is pagination or cursor-based retrieval designed for large data fetches?

**Code level:**
- Are N+1 query problems occurring (in-loop queries due to ORM lazy loading)?
  ```
  // Dangerous example
  const users = await User.findAll();
  for (const user of users) {
    const orders = await user.getOrders(); // Issues N queries
  }
  ```
- Where `SELECT *` is used, are unnecessary columns being fetched?
- Where bulk operations are possible, are individual INSERT/UPDATE operations being performed in loops?
- Are network I/O or long-running processes not performed inside transactions?

### Memory and Resources
**Code level:**
- Where large data is loaded entirely into memory, can it be changed to streaming processing?
- Are there unreleased EventListeners or timers (causes of memory leaks)?
- Are there circular references creating objects that cannot be garbage collected?
- Do caches have expiration times and maximum sizes configured?

### Network and Frontend
**Code level:**
- Are API calls that do not need to be serialized being serialized with `await` (parallelizable with `Promise.all`)?
- Do API responses contain unnecessary fields (overfetching)?
- Are unnecessary re-renders occurring on the frontend (e.g., incorrect dependency arrays in React `useEffect`)?
- Where lazy loading or code splitting is applicable, are static imports being used instead?

---

## R6: Test Quality Review Perspectives (Targeting Test Code)

- Do test names express intent in the form "precondition -> operation -> expected result" or "should + expected behavior"?
- Are tests independent (no execution order dependency or shared state between tests)?
- Are boundary values, abnormal cases, and edge cases covered, not just normal cases?
- Are mocks and stubs not overused to the point where actual behavior cannot be verified?
- Are flaky tests (timing-dependent, randomness-dependent) not included?
- Is there no gap in requirement coverage when cross-referencing with specification traceability (traces: FR-xxx)?

---

## R7: Purity & Structure Review Perspectives (Targeting Spec Ch3-4 and Code)

Classify functions and classes along the purity axis and separate non-pure effects from computation logic, so that the code stays testable and reasonable about. Term definitions follow the [glossary](glossary.md).

**Relation to the layer axis:** this section is a rule of the purity axis and is **orthogonal** to the layer axis (Entity/UseCase/Adapter/Framework, R2.16 CA). A pure function may live in the Adapter layer, and a mutable aggregate (as in DDD) may live in the Entity layer. Do not raise a violation of one axis as a violation of the other.

### Purity Classification (R7.1, MUST)

| Class | Tag value | Definition |
|-------|-----------|------------|
| pure | `pure` | No mutable internal state, no side effects, reads no external state. Output determined solely by arguments (referentially transparent) |
| semi-pure-a | `semi-pure-a` | No side effects, but reads **immutable** external state (constants, startup configuration). Deterministic |
| semi-pure-b | `semi-pure-b` | No side effects, but reads **mutable / nondeterministic** external state (clock, RNG, DB/file/network read) |
| non-pure | `non-pure` | Holds mutable internal state, or has side effects |

**List of non-pure effects:** I/O, DB write, log output, acquiring or releasing a lock/mutex/semaphore, mutation of globals or arguments, and changes to hardware / OS / environment variables. Exception throwing is governed by "Handling of exceptions" in R7.2.

### Purity of Computation Logic (R7.2, MUST)

Domain computation logic (business rules, decisions, transformations) is implemented as `pure` or `semi-pure-a`. Non-pure effects are not mixed into computation logic; they are separated into functions/units dedicated to them.

- Are deciding (what to do) and performing (actually causing the effect) housed in the same function?
- Is I/O, log output, or lock acquisition embedded inside a business rule?

**Handling of exceptions:** an exception representing a violation of a domain invariant (value object validation, etc.) is permitted on the computation-logic side, as long as the same arguments always raise the same exception. Exceptions from I/O failure or system causes (connection loss, timeout, resource exhaustion) are confined to the non-pure side.

### Lifting External Reads (R7.3, SHOULD)

`semi-pure-b` reads (clock, RNG, DB/file/network read) are collected at the top of the function and, where feasible, injected as arguments to raise the function to `pure`.

- Does the function call the clock, generate randomness, or invoke a repository directly inside itself?
- Would argument injection make that function's unit test writable with fixed values alone?

### Separation of Collect and Process (R7.4, MUST)

**Perform no new external read partway through processing. All reads complete before processing begins.**

The invariant to uphold is not "load every record into memory" but **that the result does not change if external state changes partway through processing**. When collecting everything is impossible due to streaming, pagination, or early termination, **state the unit of consistency (chunk / snapshot / transaction) explicitly, and preserve the collect-then-process order within that unit**.

- Is the unit of consistency stated explicitly in the deliverable (Spec Ch3 or a comment in the implementation)?
- Do reads and transformations alternate inside a loop, making the result timing-dependent?

**This does not conflict with R5.3 (stream large data).** Streaming satisfies this item by taking the chunk as the unit of consistency.

### Immutability of Pure-Side Classes (R7.5, MUST)

A pure-side class is an immutable class, a value object, or a stateless class, and holds no mutable state. A class with mutable state or a side-effecting method is treated as stateful (non-pure).

### The `@purity` Tag (R7.6, MUST)

Every function/method carries exactly one `@purity` tag inside the language's comment (`//`, `#`, `--`, `/* */`, `"""..."""`, etc.). The value is one of the following four.

```text
@purity pure | semi-pure-a | semi-pure-b | non-pure
```

`@purity` is a text marker inside a comment, not language syntax, so it works in every language and is greppable. **Pure is stated explicitly, never left unmarked** (so that "pure" is distinguishable from "forgotten"). Keeping all four values real prevents `grep '@purity semi-pure-a'` from matching `semi-pure-b` by prefix.

**Exemptions:**

| Target | Reason |
|--------|--------|
| Test code | What is under review is the structure of production code |
| Generated code | Owned by the generator; cannot be maintained by hand |
| Vendored third-party code | Not this project's design decision |
| Single-expression lambdas / anonymous functions | The annotation would be longer than the body, harming readability |

For production code excluding the exempt targets, the tag coverage (`purity_tag_coverage_pct`) MUST be 100%.

### Structural Separation (R7.7-R7.9, SHOULD)

- Within a class/unit, are members ordered pure -> semi-pure -> non-pure, with a section comment before the non-pure group? (R7.7)
- Does the class avoid mixing mutable state with pure computation, extracting pure logic into pure functions or value objects? (R7.8)
- Are units separated by purity (pure core and non-pure shell in different files)? (R7.9)

### Expressing Failure (R7.10, SHOULD)

Failures on the computation-logic side are expressed with a return type (Result / Either / Option) where feasible. If the language has no equivalent mechanism, a domain exception may be used instead, per "Handling of exceptions" in R7.2.

---

## Review Finding Disposition Rules

After review-agent raises findings, the following disposition workflow applies. See also process-rules §9.5.

### Disposition Flow

1. review-agent raises findings with severity (Critical / High / Medium / Low)
2. The responsible agent (or project-manager) triages each finding and records a disposition
3. project-manager verifies all findings have dispositions before allowing phase transition

### Disposition Rules by Severity

| Severity | Allowed Dispositions | Gate Requirement |
|----------|---------------------|-----------------|
| Critical | fixed only | Must be 0 for phase transition (per CLAUDE.md Quality Targets) |
| High | fixed only | Must be 0 for phase transition (per CLAUDE.md Quality Targets) |
| Medium | fixed / deferred / accepted | All must have a recorded disposition |
| Low | fixed / deferred / accepted | All must have a recorded disposition |

### Recording Requirements

- **fixed**: Correct the finding, then request re-review. The re-review report confirms resolution
- **deferred**: Create a decision record in `project-records/decisions/` with: deferral rationale, risk assessment, and planned resolution timeline. The finding remains tracked
- **accepted**: Record the acceptance rationale in the review report's Finding Disposition Table

### Re-review Behavior

When review-agent performs a re-review after corrections:
1. Verify each previously raised finding against its recorded disposition
2. Confirm that "fix" dispositions are actually resolved in the corrected artifact
3. Record the verification result in a new review report with updated counts
4. Any new findings discovered during re-review are added to the Finding Disposition Table

---

## Comprehensive Review Checklist (R1–R7, Mandatory)

A single standalone check sheet aggregating all review perspectives (R1–R7). Keywords follow RFC 2119 (MUST/SHALL = mandatory, SHOULD = recommended). The reviewer MUST fill Verdict (PASS/FAIL/NA) for every row and MUST raise a finding for each FAIL. For any non-PASS Verdict (FAIL/NA) or an intentionally waived MUST item, the reviewer MUST record the reason in Remark. Each ID maps to its detailed section above; consult it for rationale and examples.

**Purity annotation convention (language-agnostic, for R7):** every function/method MUST carry exactly one `@purity` tag inside the language's comment (`//`, `#`, `--`, `/* */`, `"""..."""`, etc.). The value is one of four: `pure` / `semi-pure-a` / `semi-pure-b` / `non-pure`. `@purity` is a text marker inside a comment, not language syntax, so it works in every language and is greppable. Pure is stated explicitly, never left unmarked. See R7.6 for exemptions.

| ID | Area | Level | Check item | Verdict | Remark |
|----|------|-------|------------|:------:|--------|
| R1.1 | Requirements | MUST | All functional requirements have IDs (FR-xxx); non-functional requirements have measurable numeric criteria | — | — |
| R1.2 | Requirements | MUST | Ambiguous / untestable expressions eliminated ("appropriately", "fast", "as soon as possible"); each requirement has a clear subject and action | — | — |
| R1.3 | Requirements | MUST | No contradictory or duplicated requirements; a single authoritative source; inter-requirement dependencies stated | — | — |
| R1.4 | Requirements | SHOULD | Abnormal / semi-normal cases covered (timeout, interruption, concurrency, insufficient permission, data inconsistency, resource exhaustion); boundaries (min/max/empty/null) stated | — | — |
| R1.5 | Requirements | SHOULD | Requirements are MECE; no gaps across stakeholders (admin / user / external system) | — | — |
| R1.6 | Requirements | SHOULD | Negative requirements specify an alternative action; passive voice rewritten to active (clear responsibility); no double negatives | — | — |
| R2.1 | Design | MUST | Naming reflects essence — the single most important design property (Screaming Architecture; software is kotodama). Accurate role names (no generic `data`/`info`/`tmp`/`obj`); verb+object functions; is/has/can booleans; plural collections; consistent domain terms | — | — |
| R2.2 | Design | MUST | SRP: one class/unit has a single reason to change (no "does X and Y") | — | — |
| R2.3 | Design | SHOULD | OCP: open for extension, closed for modification; new behavior via strategy/template, not by editing if/switch | — | — |
| R2.4 | Design | SHOULD | LSP: subclasses do not strengthen preconditions, weaken postconditions, or change the parent contract | — | — |
| R2.5 | Design | SHOULD | ISP: no class implements interface methods it does not use; large interfaces split by usage | — | — |
| R2.6 | Design | SHOULD | DIP: upper modules depend on abstractions, not concrete lower modules (DB/API) | — | — |
| R2.7 | Design | SHOULD | DRY: no duplicated logic; magic numbers/strings are constants; no redundant validation across layers | — | — |
| R2.8 | Design | SHOULD | KISS: simplest working solution; nesting depth < 4; flatten with early returns | — | — |
| R2.9 | Design | SHOULD | YAGNI: no speculative features or over-abstraction; no unused parameters/flags/config | — | — |
| R2.10 | Design | MUST | SoC: UI / business / data-access not mixed; validation, transformation, persistence separated | — | — |
| R2.11 | Design | MUST | SLAP: a function stays at a single level of abstraction (intent not mixed with low-level detail) | — | — |
| R2.12 | Design | SHOULD | LoD: no deep `a.b.c.d` chains; use only immediate collaborators | — | — |
| R2.13 | Design | SHOULD | CQS: a method either changes state or returns a value, not both | — | — |
| R2.14 | Design | MUST | POLA: behavior matches the name; no hidden side effects; no double-negative booleans | — | — |
| R2.15 | Design | MUST | PIE: names and comments express "why", not just "what"; name intermediate results | — | — |
| R2.16 | Design | MUST | CA: dependency is one-way and points toward the least-changing centre; the centre is not contaminated by framework/DB; layer classification and the thickness of the outermost seam layer are correct. **The number of layers is not prescribed** (default is the four layers Entity/UseCase/Adapter/Framework; a different layering is compliant where Ch3.1 defines it) | — | — |
| R2.17 | Design (AI/LLM) | SHOULD | Prompt engineering: prompts under `src/` with explicit I/O schemas, no ambiguous instructions, prompt tests, versioning policy, hallucination countermeasures | — | — |
| R2.18 | Design | MUST | Comparison against the minimum: Ch3.6 contains ADR-000 "Comparison against the minimal configuration", stating the smallest configuration that satisfies the requirements, what the adopted design adds to it, and why each addition is necessary | — | — |
| R2.19 | Design | MUST | Component boundary: no dependency on another component's internals. Only the public surface declared in Ch3.3 may be referenced ([glossary](glossary.md) 5.3). **This is a different axis from the layer axis (R2.16); never file a violation of one as a violation of the other.** With a single component, record NA and say so in the Remark | — | — |
| R2.20 | Design | MUST | Cache policy: where a cache is used, the ADR in Ch3.6 states four things: what is cached, what invalidates it, how much staleness is acceptable, and what happens when entries expire together. **Staleness produces a different answer, not a slower one, so it is a correctness concern.** Bounds (TTL/size) are R5.3's business. With no cache, record NA and say so in the Remark | — | — |
| R3.1 | Coding | MUST | Every external I/O (network/DB/file) has error handling; errors are not silently swallowed (no empty catch) | — | — |
| R3.2 | Coding | MUST | Error messages carry debug context internally; no internal details (stack traces, DB errors) leaked to users | — | — |
| R3.3 | Coding | MUST | All external input validated; Null/Undefined/empty handled; no unsafe type assertions | — | — |
| R3.4 | Coding | MUST | Boundaries and indices: ranges are half-open `[start, end)` by default, and a closed range says so in its name (`endInclusive` and the like). Iteration and subsequences are expressed with an iterator / slice / range rather than advancing an index by hand. No endpoint is adjusted by `±1` to make a length or a terminator come out right. **"There is no off-by-one" cannot be judged by reading, so the rule governs how boundaries are expressed** | — | — |
| R4.1 | Concurrency | MUST | Multi-resource lock acquisition order is uniform and documented; no external calls / long processes inside DB transactions | — | — |
| R4.2 | Concurrency | MUST | Concurrent shared-state access identified; Check-Then-Act and Read-Modify-Write made atomic (locks/atomics); no races across `await` | — | — |
| R4.3 | State Transition | MUST | Multi-field updates are atomic (no observable intermediate glitch); implementation matches Spec Ch3 state transitions; event-notification timing (before/after) defined | — | — |
| R5.1 | Performance | MUST | Critical algorithm complexity meets NFR (Spec Ch2); no O(n²)+ on large data | — | — |
| R5.2 | Performance | SHOULD | No N+1 queries; no `SELECT *` overfetch; bulk ops instead of per-row loops; indexes/pagination for large fetches | — | — |
| R5.3 | Performance | MUST | No memory leaks (listeners/timers released, no leak-causing cycles); caches bounded (TTL/size); streaming for large data | — | — |
| R5.4 | Performance | SHOULD | Parallelizable I/O not needlessly serialized; no needless frontend re-renders; lazy loading / code splitting where applicable | — | — |
| R6.1 | Test | MUST | Tests are independent (no order or shared-state dependency); no flaky (timing/random) tests | — | — |
| R6.2 | Test | MUST | Boundary / abnormal / edge cases covered, not just normal; requirement coverage traces to FR-xxx | — | — |
| R6.3 | Test | MUST | Test names express intent; mocks/stubs not so overused that real behavior goes unverified | — | — |
| R7.1 | Purity | MUST | Every function/method is classified `pure` / `semi-pure-a` (reads immutable values) / `semi-pure-b` (reads mutable or nondeterministic state) / `non-pure` (mutable state or side effect) | — | — |
| R7.2 | Purity | MUST | Domain computation logic (business rules, decisions, transformations) is `pure` or `semi-pure-a`; non-pure effects are not mixed in but separated into dedicated functions/units. **Orthogonal to the layer axis (R2.16).** Domain-invariant exceptions are permitted on the computation side; I/O and system-caused exceptions are confined to the non-pure side | — | — |
| R7.3 | Purity | SHOULD | `semi-pure-b` reads (clock, RNG, DB/file/network read) are collected at the top and injected as arguments where feasible, raising the function to `pure` | — | — |
| R7.4 | Structure | MUST | No new external read is performed partway through processing (all reads complete before it begins). Where collecting everything is impossible, the **unit of consistency (chunk / snapshot / transaction) is stated explicitly** and collect-then-process order is preserved within it | — | — |
| R7.5 | Purity | MUST | Pure-side classes are immutable class / value object / stateless class and hold no mutable state; mutable state or side-effecting methods make a class stateful (non-pure) | — | — |
| R7.6 | Purity | MUST | Every function/method carries a `@purity` tag (`pure` / `semi-pure-a` / `semi-pure-b` / `non-pure`) inside a comment; unmarked is not allowed (grep-checkable). Exempt: test code, generated code, vendored third-party code, single-expression lambdas | — | — |
| R7.7 | Structure | SHOULD | Within a class/unit, members are ordered pure to semi-pure to non-pure, with a section comment before the non-pure group | — | — |
| R7.8 | Structure | SHOULD | A class does not mix mutable state with pure computation; pure logic is extracted into pure functions or value objects | — | — |
| R7.9 | Structure | SHOULD | Units are separated by purity (pure core and non-pure shell in different files) | — | — |
| R7.10 | Purity | SHOULD | Failures on the computation-logic side are expressed with a return type (Result / Either / Option); a domain exception may substitute in languages with no equivalent mechanism | — | — |
