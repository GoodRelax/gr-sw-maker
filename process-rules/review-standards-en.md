# Review Standards (R1–R6)

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

### SOLID Principles

**SRP (Single Responsibility Principle)**
- Does a single class or module have multiple reasons to change?
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
- **Correctness of layer classification**: Is the Entity/UseCase/Adapter/Framework classification appropriate? Are concepts that belong to the domain misclassified in the Framework layer? Conversely, are things that could remain in Framework unnecessarily elevated to Entity? Judge based on "is this essential to the project's purpose, or merely a means?"
- **Appropriateness of the Adapter layer**: Is the Adapter layer so thin that external dependencies leak into the domain? Is it so thick that business logic has crept into the Adapter layer?

**Naming**
- Do variable names accurately represent their roles (no generic names like `data`, `info`, `tmp`, `obj`)?
- Are function names in verb + object form (no vague verbs like `process`, `handle`, `manage`)?
- Do Boolean variable/function names start with `is/has/can/should`?
- Are collection variable names pluralized?
- Are abbreviations used consistently (no mixing of `Usr` and `User`)?

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

## Review Finding Disposition Rules

After review-agent raises findings, the following disposition workflow applies. See also process-rules §9.5.

### Disposition Flow

1. review-agent raises findings with severity (Critical / High / Medium / Low)
2. The responsible agent (or orchestrator) triages each finding and records a disposition
3. orchestrator verifies all findings have dispositions before allowing phase transition

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
