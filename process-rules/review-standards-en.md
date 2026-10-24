# Review Standards (R1–R8)

> **Document positioning:** The single source of truth for the review perspectives referenced by review-agent. process-rules §9.2 is a summary of this document; refer here for details.
> **Related documents:** [Process Rules](full-auto-dev-process-rules-en.md) §9 Quality Management Framework, [Document Management Rules](full-auto-dev-document-rules-en.md)

---

## R1: Requirements Quality Review Perspectives (Targeting Spec Ch1-4)

### R1a: Requirements Structural Quality

- Are all functional requirements assigned an ID (FR-xxx)?
- Are untestable expressions ("appropriately," "sufficiently," "fast," etc.) eliminated?
- Is the set of requirements free of contradictions (e.g., multiple outcomes defined for the same operation)?
- Do use cases define both main scenarios and alternative scenarios (error cases)?
- Do non-functional requirements have measurable numeric criteria (e.g., "within 200ms," "99.9% or above")?
- Are entity names and operation names used consistently (no multiple names for the same concept)?
- Are abbreviations and technical terms defined (existence of a glossary)?

### R1b: Requirements Expression Quality (Requirements Engineering Perspective)

**Elimination of ambiguity:**
- Are ambiguous expressions such as "as soon as possible," "appropriately," "as needed," or "as much as possible" eliminated?
- When progressively refining (provisional expression to concrete), is an annotation saying so stated explicitly (e.g., "to be quantified in the design phase")?
- Are the subject (who/what) and the action (does what) of each requirement clear?

**Elimination of negation and passive voice:**
- For negative requirements ("must not do X"), is an alternative action defined that specifies what should be done instead?
- Is responsibility kept clear rather than obscured by passive voice ("data is saved")? Is active voice ("the system saves data to the DB") used wherever a sentence can be rewritten that way?
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
- Is each requirement written in one place only, not scattered across multiple locations (when scattered, ambiguity over which is authoritative causes defects)?
- Do not write the same thing twice. If necessary, directly reference the single authoritative source
- Are requirements in different sections free of implicit contradictions (e.g., preconditions of FR-001 conflict with behavior of FR-015)?
- Are dependencies between requirements explicitly stated (e.g., "FR-005 assumes completion of FR-001")?

**Completeness verification:**
- Are requirements organized from a MECE (mutually exclusive and collectively exhaustive) perspective?
- Are requirements complete from each stakeholder's viewpoint (administrator / general user / external system)?
- Are boundary conditions (minimum, maximum, empty, null) explicitly stated?

**Traceability:**
- Can the purpose, higher-level requirements, lower-level requirements, implementation, and test cases be traced in both directions by ID?
- If all lower-level requirements are met, is the higher-level requirement met? If all higher-level requirements are met, is the purpose met?
- Can every lower-level requirement, implementation, and test case be traced to a higher-level requirement (no work that does not serve the purpose)?
- Is a verification method (test, inspection, analysis, demonstration) decided for each requirement?

**Requirements notation (EARS: Easy Approach to Requirements Syntax):**
- Are requirements written in the EARS patterns?
    - Ubiquitous: `The <system> shall <response>`
    - Event-driven: `When <trigger>, the <system> shall <response>`
    - State-driven: `While <state>, the <system> shall <response>`
    - Unwanted behavior: `If <trigger>, then the <system> shall <response>`
    - Optional feature: `Where <feature>, the <system> shall <response>`
    - Combined: `Where <feature>, while <state>, when <trigger>, the <system> shall <response>`
- Does each requirement sentence have only one `shall`?

---

## R2: Software Design Principles Review Perspectives (Targeting Spec Ch5-6 and Code)

### Naming — A Name Shows What It Is (MUST, Most Important)

Naming is the primary interface of software. Treat naming as the most important review item: it is MUST, not SHOULD. A name shows what it is. Code should scream its intent (Screaming Architecture). In software, words carry power: names define the structure and the intent.

- Do variable names accurately represent their roles (no generic names like `data`, `info`, `tmp`, `obj`)?
- Are the names of commands (functions and methods that change state) in verb + object form (no vague verbs like `process`, `handle`, `manage`; a method that only returns a value follows "Parts of speech" below and is split by purity)?
- Do Boolean variable/function names start with `is/has/can/should`?
- Are collection variable names pluralized?
- Are abbreviations used consistently (no mixing of `Usr` and `User`)?

**Parts of speech** (`pure` / `semi-pure-a` / `semi-pure-b` / `non-pure` are the four purity values. They are defined in R7 below; the annotation rule is "`@purity` Tag" in R7)**:**

| Target | Part of speech | Example |
|---|---|---|
| Class, type | Noun or noun phrase | `Order`, `CellVoltage` |
| Command (`non-pure`; changes state) | Verb + object | `cancelOrder` |
| Query (`pure` / `semi-pure-a`) | Noun phrase, or `is/has/can` | `totalPrice`, `isExpired` |
| Operation that reads the outside (`semi-pure-b`) | Verb + object | `readDocument`, `fetchUser` |
| Property | Noun (Booleans and collections follow the rules above) | `retryCount`, `orders` |
| Event | **Past tense** | `OrderPlaced`, `CellVoltageExceeded` |

**Distinguish commands from events by their form.** A command is **a request for something to happen**, and it can be refused. An event is **a notice of something that has already happened**, and it cannot be refused. When `PlaceOrder` and `OrderPlaced` differ in form, **the receiver can read from the name whether it may refuse.** The part of speech of a method matches the CQS separation in R2.

**Having no side effect is not the same as being cheap to call.** A function that reads the clock, random numbers, or a DB/file/network (`semi-pure-b`) **is named with a verb**, even when it changes no state and only returns a value. A noun name hides that the call is slow and can fail, so it gets called casually inside loops (POLA in R2). Do not rename `readDocument()` to `document()`. **Decide by the function's existing `@purity` tag (R7)** — there is no need to classify it again.

**Put the unit in the name of a quantity whose unit is fixed.** `timeoutMs` / `voltageMv` / `capacityAh`. **A unit mix-up passes the type check.** This does not apply to a value that carries its unit at run time (`Quantity { amount, unit }`, etc.), because there the unit is part of the value, not of the name.

**Component and class names by layer:**

| Layer | Part of speech | Example | Warning sign |
|---|---|---|---|
| Entity | Noun | `Order`, `Temperature` | A verb, `...Data` / `...Info` |
| Use Case | **Verb phrase** (if a suffix is used, `...UseCase` / `...Interactor`) | `ConvertUnit`, `PlaceOrder` | **`...Service`** |
| Adapter | Role + technology | `PostgresOrderRepository`, `CliPresenter` | Technology only (`DbHelper`), role only (`Manager`) |
| Framework | Noun phrase | `ExpressRouter` (the technology name may appear as is) | — |

**In a design that does not use the default four layers, apply this table to the layers that Ch5.1 defines** (as CA in R2 says, the number of layers does not matter). Match each row to a layer by its **role** (what the layer is responsible for).

**Making a Use Case a verb phrase is not a matter of taste.** `OrderService` can hold any number of operations, but `PlaceOrder` cannot. **The naming enforces SRP in R2.** Put the other way, a Use Case named with a noun is a warning that it will grow too large.

### SOLID Principles

**SRP (Single Responsibility Principle)**
- Does each class, unit, module, component, and layer have only one responsibility?
- Does every class, unit, module, component, and layer avoid having more than one responsibility?
- Can the responsibility of a higher-level element (layer, component, module) be stated in one sentence, without listing the responsibilities of the elements it contains?
- Example: bad `fileHandlers`, whose responsibility is "read JSON and write CSV" (only a list of the elements inside) → good `documentIo`, whose responsibility is "exchange documents with files" (a one-sentence summary)
- When the phrases of procedure (a step in the middle of one operation), scope (a list of what the work reaches), and constraint (a condition, default, or prohibition) are removed from the sentence that states the responsibility, does only one phrase remain?
- When two or more phrases remain, does every event that changes one of them also change the others (if one can change alone, they are separate responsibilities)?
- Example: bad "Save the document, and draw the list on the screen" (a change in how to draw does not change saving) → good "Save the document. Check its shape before saving, and return the reason if it cannot be saved" ("check" is a procedure; "return the reason" is a constraint)
- Example: bad `UserService` (authentication, profile management, email sending) → good `Authenticator`, `ProfileEditor`, `MailSender`
- Recommended: avoid classes named like "does X and Y" and classes that gather unrelated methods, because they tend to have more than one responsibility

**OCP (Open-Closed Principle)**
- Can new functionality be added without modifying existing code (especially without adding if/switch branches)?
- Are extension points provided through the Strategy pattern, the Template Method pattern, etc.?

**LSP (Liskov Substitution Principle)**
- Does each subclass avoid strengthening the preconditions or weakening the postconditions of the parent class?
- Do overridden methods keep the parent's contract (exception types, return value semantics)?

**ISP (Interface Segregation Principle)**
- Does each implementation class avoid implementing interfaces that contain methods it does not use?
- Are large interfaces split by usage?

**DIP (Dependency Inversion Principle)**
- Do upper modules (business logic) avoid depending directly on concrete classes of lower modules (DB, external API)?
- Does the dependency direction go through interfaces or abstract classes?

### Other Design Principles

**DRY (Don't Repeat Yourself)**
- Is each piece of logic kept in one place, not duplicated in multiple places?
- Is each decision, calculation, or conversion (what one requirement of the specification decides) held in only one place in the implementation?
- Before writing a helper function, did you search the public face of other components for the same processing?
- Is your component free of copies of other components' non-public functions?
- Are magic numbers and magic strings defined as constants, not scattered throughout?
- Is each validation implemented in one layer only, not redundantly across multiple layers?

**KISS (Keep It Simple, Stupid)**
- Is the solution as simple as the problem allows?
- Is function nesting depth below 4?
- Are complex conditional branches flattened with early returns where possible?

**YAGNI (You Aren't Gonna Need It)**
- Are only the features in the current requirements implemented, with nothing built preemptively?
- Is the code free of excessive generalization or abstraction (e.g., an abstract class with only one concrete case at present)?
- Is the code free of unused parameters, flags, and configuration values?

**Comparison with the Minimal Configuration (Occam's Razor)**
- Does ADR-000 "Comparison with the Minimal Configuration" exist in Ch5.6 (**if it does not exist, this item is violated; the quality of its content is not judged here**)?
- Is the minimal configuration written as one that "meets the requirements" (an option that drops requirements is not the minimal configuration)?
- Are the elements that the adopted option adds to the minimal configuration listed, each with the reason it was added?
- Does each reason go beyond "because the rules say so" (**state which rule served which requirement**)?

**SoC (Separation of Concerns)**
- Are UI logic and business logic kept apart?
- Is data access logic kept out of the business logic layer?
- Are validation, transformation, and persistence kept in separate functions?

**SLAP (Single Level of Abstraction Principle)**
- Does each function avoid mixing "high-level intent (what to do)" with "low-level implementation details (how to do it)"?
- Example finding: HTTP processing and SQL string assembly exist in the same function

**LoD (Law of Demeter / Principle of Least Knowledge)**
- Does the code avoid heavy use of chain calls like `a.b.c.doSomething()` (excessive dependency on structure)?
- Does each object depend only on its "immediate friends," not on details of other objects?

**CQS (Command-Query Separation)**
- Does each method either change state (with side effects) or return a value, not both?
- Example finding: `getNextId()` modifies an internal counter while returning a value

**POLA (Principle of Least Astonishment)**
- Does the actual behavior match the behavior expected from the function/method name?
- Are side effects (state changes other than log output) visible from the call site, not hidden?
- Is the code free of reversed Boolean flags (double negatives like `isNotInvalid`)?

**PIE (Program Intently and Expressively)**
- Do variable and function names express not only "what it does" but also "why it does it"?
- Do comments explain "why" rather than "what" (which is obvious from the code)?
- Are intermediate results named with temporary variables wherever this clarifies intent?

**CA (Clean Architecture / Layered Architecture)**
- Does the dependency direction point toward the domain layer (inward) (only outside-to-inside dependencies allowed)?
- Are domain entities free of framework or DB details (annotations, etc.)?
- Is the structure such that changes in the infrastructure layer (DB, external API) do not propagate to business logic?
- **Correctness of layer classification**: Is the layer classification appropriate? Is every concept that belongs to the center placed in the center, not in the outer ring? Conversely, does what could stay in the outer ring stay there, rather than being raised to the center? Judge based on "is this essential to the project's purpose, or merely a means?" **The number of layers itself is not a finding.** A design that the default four layers (Entity/UseCase/Adapter/Framework) cannot express is valid if Ch5.1 defines its layers and the direction of dependencies
- **Appropriateness of the Adapter layer**: Is the Adapter layer thick enough that external dependencies do not leak into the domain? Is it thin enough that business logic does not creep into it?

**Component Boundaries (an axis separate from CA)**
- Does each component refer to other components only through their public entries, never directly to their internal implementation (under `private/`, a `_` prefix, an import that bypasses the public entry)?
- Is the public face of each component declared in Ch5.3, with no component left undeclared?
- Is the public face free of internal implementation details (internal-only types, mutable state)?

**Cache Policy (when caches are used)**
- Is what is cached recorded in Ch5.6? Are implicit caches (memoization, lazy initialization, the ORM first-level cache, HTTP intermediate caches) included too?
- Is invalidation **tied to changes upstream**, rather than relying on expiry alone?
- Is the allowed staleness written as a number or a condition (not "as fresh as possible")?
- Is the behavior on simultaneous expiry decided (so that many requests cannot fall through to the back end at once)?

**Compatibility and Versions**
- Do stored and exchanged formats (files, APIs, messages) carry a version?
- When the shape changes, are compatible changes (adding values or elements that can be omitted) distinguished from incompatible changes (changing existing elements), and can a reader learn of an incompatible change through an error?
- Example: bad silently change the meaning of an element in JSON that has no version → good raise `schemaVersion`, and report an error code when an old version is read

**Build Versions**
- Does the build system add the version automatically (no one rewrites it by hand)?
- Can the source commit be traced from the version?
- Recommended: use the build's UTC date and time, from year to second, as the version (e.g., `20261024T153045Z`). The version is then unique, and the order between versions is clear
- Recommended: give an item that others depend on (a library, an API) a version that shows compatibility as well (SemVer: `MAJOR.MINOR.PATCH`)

**OKPN/OMPV**
- Definition: A data element, such as a JSON property or a function parameter, is a pair of a name (key) and the rule for the values that name takes.
- **OKPN (One Kind Per Name)**
    - Does each name of a data element take values of one kind only?
    - Does every name of a data element avoid taking values of more than one kind?
    - Example: bad `"color": "#c0504d/#b2423f"` (light and dark packed into one string) → good `"color": {"light": "#c0504d", "dark": "#b2423f"}`
- **OMPV (One Meaning Per Value)**
    - Does each value of a data element have one meaning only?
    - Does every value of a data element avoid carrying more than one meaning?
    - Example: bad `"parentId": 0` (0 means "no parent") → good omit `parentId`
- Exception: Where a referenced standard defines the specification of a data element, conform to that specification.

**Prompt Engineering (when AI/LLM integration is enabled)**
- Are product prompt templates placed under `src/` (not mixed with the meta-layer under `.claude/`)?
- Does each prompt have explicit input/output schemas (expected input types, expected output types)?
- Are prompt instructions free of ambiguous expressions (apply the same ambiguity elimination perspective as R1b to prompts)?
- Do tests for prompts (input-to-expected-output pairs) exist under tests/?
- Is a prompt versioning policy defined (handling behavioral changes when models are updated)?
- Are hallucination countermeasures designed (output verification logic, grounding techniques)?

---

## R3: Coding Quality Review Perspectives (Targeting Code)

### Error Handling
- Is error handling present for all external I/O (network, DB, file)?
- Are errors always handled, never silently swallowed (empty catch blocks, ignoring with `_`)?
- Do error messages contain contextual information necessary for debugging?
- Are error messages returned to users free of internal implementation details (stack traces, DB errors)?

### Logging and Observability
- Are log levels (error / warn / info / debug) used according to their meaning?
- Are personal information and secrets kept out of logs?
- When something fails, do the logs keep enough context (what, with which input, where) to trace the cause?

### Defensive Programming
- Is all external input (API arguments, environment variables, configuration files) validated?
- Are Null/Undefined/empty array cases handled?
- Is every type assertion (`as Type`) backed by a safety check?

### Boundaries and Indexes
- Are ranges uniformly half-open `[start, end)`? Where a closed range is used, does the name show it (`endInclusive`, etc.)?
- Are iteration and subsequences expressed with iterator / slice / range, rather than with an index variable advanced by hand?
- Does the code avoid writing `±1` at end points to make the length or the end come out right (**such an adjustment is a sign that half-open and closed ranges are mixed**)?

### Resource Lifetime
- Are acquired resources released by a language mechanism (`try-with-resources` / `using` / `defer` / `with` / RAII, etc.)?
- Is every hand-written `close()` / `release()` safe from being skipped on an exception path?
- Are acquisition and release paired in the same function, with neither one placed at a different level?

### Time
- Is elapsed time measured with a monotonic clock, not with the wall clock?
- Are stored and exchanged times in UTC or with an offset? Is local time used only for display?
- Is date arithmetic done without a fixed number of seconds (`86400`, etc.)?

### Null Trap
- Does the specification define how an omitted data element and a data element whose value is null are handled, and does the implementation follow that specification?
- Recommended: omit a data element with no value as a whole.
- Recommended: do not put null into the value of a data element with no value.
- Recommended: where a value cannot be omitted, as with a function's return value, express the absence in the way the language recommends, or with a discriminated union.
- Reason: null gives "no value" two spellings, omission and null, so the writer and the reader handle null differently.
- Example: bad `{"taskId": 7, "parentTaskId": null}` → good `{"taskId": 7}` (specification: a task with `parentTaskId` omitted is a top-level task; a null value is an error)
- Example: `undefined` in TypeScript, or a discriminated union `{"isTaskFound": false}` / `{"isTaskFound": true, "task": {"taskId": 7}}`
- Exception: Where a referenced standard defines the specification of a data element, conform to that specification.

---

## R4: Concurrency and State Transition Review Perspectives

### Deadlock
**Design level:**
- For flows that simultaneously use multiple resources (DB, cache, files, etc.), is the acquisition order uniformly defined across all paths?
- Is a "resource acquisition order constraint" documented in design documents?
- Are the DB transaction isolation levels analyzed, together with the access patterns that can cause deadlocks?

**Code level:**
- Are nested locks (acquiring `lock B` inside `lock A`) always acquired in the same order on every path?
- Are DB transactions free of external API calls and long-running processes (which hold locks for extended periods)?
- When using `SELECT ... FOR UPDATE`, is the acquisition order consistent?

### Race Condition
**Design level:**
- Are flows where concurrent access to shared state can occur identified, with countermeasures designed?
- Is the Check-Then-Act pattern ("check existence then use") designed to be implemented atomically?

**Code level (for JavaScript/TypeScript):**
- Are patterns that read and write shared state across multiple `await` calls free of races?
  ```
  // Dangerous example
  const count = await getCount();   // Other code may change count here
  await setCount(count + 1);        // Update based on stale count
  ```
- Are queues and counters kept consistent when event handlers run in parallel?
- Do processes running in parallel via `Promise.all` avoid competing to update the same resource?
- Are optimistic or pessimistic locks applied where DB Read-Modify-Write is not atomic?

**Code level (for multi-threaded languages):**
- Are appropriate locks, atomic operations, or volatile modifiers applied to shared variable access?
- Are non-thread-safe collections (`HashMap`, etc.) kept out of multi-threaded environments?

### Glitch (Momentary Invalid State During State Transition)
**Design level:**
- Are state transition diagrams in Spec Ch5.5 defined in an implementable form (are intermediate states during transitions explicitly stated)?
- When simultaneous updates of multiple fields are required, is their atomicity guaranteed in the design?

**Code level:**
- Do state transition diagrams defined in Spec Ch5.5 match the implementation code (with no invalid state transitions)?
- Are processes that update multiple fields at once performed inside a transaction?
  ```
  // Dangerous example (intermediate state between order.status and order.completedAt is observable)
  order.status = 'completed';     // At this point status is completed but completedAt is null
  order.completedAt = new Date();
  ```
- In state synchronization between frontend and backend, does the design avoid any moment at which a partial update is observable?
- Is the timing of event notifications explicitly defined as "before" or "after" the state change?

### State Machine
- Is a state machine (the definition) named `...StateMachine` and the current state (the value) named `...State`, so that the two are kept apart?
- Are states named with adjectives or past participles, and events in the past tense?
- Are states, events, and transitions identified by name, without serial numbers?
- Does each state machine have a state transition diagram (UML) and a state transition table as a pair, both made from one source?
- Is one state name defined for each state?
- Does the design avoid defining a state as a combination of several values?
- Example: bad a combination of `isLoading` and `hasError` (this allows an impossible state where both are true) → good `loadState` is exactly one of `loading`, `failed`, `loaded`
- Do tests confirm, at every cell of the table, that the next state in the implementation matches the table?
- Recommended: in the state transition table, make the rows the events, the columns the current states, and each cell "next state [guard] / action"; write `-` even in a cell where nothing changes (events usually outnumber states, so listing the events as rows makes the table easier to read)
- Recommended: decide the next state from the current state and the event (and the guard) only. If it depends on the previous state, define that difference as a state. Do not use the UML history state (H), because it makes the specification and the tests complex
    - Example: bad record the previous state (`playing` or `fastForwarding`) in a history variable to resume from `paused` → good split the state into `pausedFromPlaying` and `pausedFromFastForwarding`

---

## R5: Performance Review Perspectives

### Algorithms and Data Structures
**Design level:**
- Are computational complexities of critical algorithms analyzed to meet performance requirements (NFR in Spec Ch4.2)?
- Does processing of large data volumes avoid algorithms of O(n²) or higher complexity?

**Code level:**
- Are loop invariants hoisted out of loops, rather than recomputed inside them?
- Is O(1) access via Map or Set used wherever it can replace linear search?
- Is binary search applied to sorted arrays?

### Database and I/O
**Design level:**
- Is index design considered for frequently accessed queries?
- Is pagination or cursor-based retrieval designed for large data fetches?

**Code level:**
- Is the code free of N+1 query problems (in-loop queries due to ORM lazy loading)?
  ```
  // Dangerous example
  const users = await User.findAll();
  for (const user of users) {
    const orders = await user.getOrders(); // Issues N queries
  }
  ```
- Where `SELECT *` is used, does it avoid fetching columns that are not needed?
- Where bulk operations are possible, are they used instead of individual INSERT/UPDATE operations in loops?
- Are transactions free of network I/O and long-running processes?

### Memory and Resources
**Code level:**
- Is large data processed by streaming where possible, rather than loaded entirely into memory?
- Are all EventListeners and timers released (unreleased ones cause memory leaks)?
- Is the code free of circular references that create objects that cannot be garbage collected?
- Do caches have expiration times and maximum sizes configured?

### Network and Frontend
**Code level:**
- Are API calls that need not be serialized run in parallel (e.g., with `Promise.all`) rather than serialized with `await`?
- Are API responses free of unnecessary fields (overfetching)?
- Is the frontend free of unnecessary re-renders (e.g., incorrect dependency arrays in React `useEffect`)?
- Are lazy loading and code splitting used where applicable, instead of static imports?

---

## R6: Test Quality Review Perspectives (Targeting Test Code)

- Do test names express intent in the form "precondition → operation → expected result" or "should + expected behavior"?
- Are tests independent (no execution order dependency or shared state between tests)?
- Are boundary values, abnormal cases, and edge cases covered, not just normal cases?
- Are mocks and stubs used sparingly enough that actual behavior is still verified?
- Is the test suite free of flaky tests (timing-dependent, randomness-dependent)?
- Is requirement coverage complete when cross-referenced with specification traceability (traces: FR-xxx)?

**Test case notation (Gherkin):**
- Are test cases written with Gherkin `Given` (precondition) / `When` (operation) / `Then` (expected result), continued with `And` / `But`?
- Does one scenario check only one behavior (one `When`)?
- Does each scenario carry the ID of the requirement it checks?

---

## R7: Purity and Structure Review Perspectives (Targeting Spec Ch5-6 and Code)

Classify functions and classes along the axis of purity, and separate non-pure effects from calculation logic, so that the code stays easy to test and easy to reason about. Terms follow the [Glossary](glossary-en.md).

**Relation to the layer axis:** This section is a rule on the purity axis, and it is **orthogonal** to the layer axis (Entity/UseCase/Adapter/Framework, CA in R2). Pure functions may live in the Adapter layer, and mutable aggregates (such as DDD Aggregates) may live in the Entity layer. Do not raise a violation on one axis as a violation on the other.

### Purity Classification

| Category | Tag value | Definition |
|------|--------|------|
| Pure | `pure` | No mutable internal state, no side effects, reads no external state. The output is determined by the arguments alone (referentially transparent) |
| Semi-pure-a | `semi-pure-a` | No side effects, but reads external state that is an **immutable value** (constants, settings read at startup, etc.). Deterministic |
| Semi-pure-b | `semi-pure-b` | No side effects, but reads external state that is **mutable or non-deterministic** (clock, random numbers, DB/file/network reads) |
| Non-pure | `non-pure` | Has mutable internal state, or has side effects |

**List of non-pure effects:** I/O, DB writes, log output, acquiring and releasing a lock/mutex/semaphore, rewriting global variables or arguments, changing HW/OS/environment variables. For throwing exceptions, follow "Exception handling" under "Purity of Calculation Logic" in R7.

### Purity of Calculation Logic

Implement domain calculation logic (business rules, decisions, conversions) as `pure` or `semi-pure-a`. Do not mix non-pure effects into calculation logic; separate them into functions/units dedicated to them.

- Are the decision (deciding what to do) and the execution (actually applying the effect) kept in separate functions?
- Are business rules free of I/O, log output, and lock acquisition?

**Exception handling:** An exception that expresses a violation of a domain invariant (validation of a value object, etc.) is allowed on the calculation-logic side, as long as the same arguments always throw the same exception. Exceptions from I/O failures or from the system (disconnection, timeout, resource exhaustion) belong only on the non-pure side.

### Lifting External Reads

Collect `semi-pure-b` reads (clock, random numbers, DB/file/network reads) at the start of the function, and where possible inject them as arguments to lift the function to `pure`.

- Does the function avoid getting the current time, generating random numbers, or calling a repository directly inside itself?
- Does argument injection let the unit tests of the function be written with fixed values only?

### Separation of Collection and Processing

**Do not make new external reads in the middle of processing. Finish reading before processing starts.**

The invariant to keep is not "load every item into memory" but **"the result does not change even if external state changes during processing."** When collecting every item is impossible because of streaming, pagination, or early exit, **state the unit of consistency (chunk / snapshot / transaction), and keep the order collect → process within that unit**.

- Is the unit of consistency stated in an artifact (Spec Ch5.5 or a comment in the implementation code)?
- Does each loop avoid alternating reads and processing, so that the result does not depend on timing?

**This does not conflict with "Memory and Resources" in R5 (stream large data).** Streaming satisfies this item by treating a chunk as the unit of consistency.

### Immutability of Pure-Side Classes

A pure-side class is an immutable class, a value object, or a stateless class, and holds no mutable state. A class with mutable state or with side-effecting methods is treated as stateful (non-pure).

### `@purity` Tag

Every function/method carries exactly one `@purity` tag inside the language's comment (`//`, `#`, `--`, `/* */`, `"""..."""`, etc.). The value is one of the following four.

```text
@purity pure | semi-pure-a | semi-pure-b | non-pure
```

`@purity` is a text marker inside a comment, not language syntax, so it works in every language and can be checked with grep. **State pure explicitly too; never leave it unmarked** (to tell a missing tag from pure). Spelling out all four values in full prevents the accident in which `grep '@purity semi-pure-a'` picks up `semi-pure-b` by prefix match.

**Exemptions:**

| Target | Reason |
|------|------|
| Test code | What is checked is the structure of product code |
| Generated code | It belongs to the generator and cannot be maintained by hand |
| Vendored third-party code | It is not a design decision of this project |
| Single-expression lambdas and anonymous functions | The annotation would be longer than the body and hurt readability |

For product code other than the exemptions, the tag coverage (`purity_tag_coverage_pct`) must be 100%.

### Structural Separation

- Within a class/unit, are members ordered pure → semi-pure → non-pure, with a section comment before the non-pure group?
- Does a class keep mutable state and pure computation apart, with pure logic extracted into pure functions or value objects?
- Are units split by purity (pure core and non-pure shell in different files)?

### Failure Representation

Express failures on the calculation-logic side with return types (Result / Either / Option) where possible. If the language has no equivalent mechanism, a domain exception may be used instead, following "Exception handling" under "Purity of Calculation Logic" in R7.

---

## R8: Security Review Perspectives (Targeting Spec and Code)

### Secrets
- Are keys, tokens, and passwords kept out of code, configuration files, logs, and error messages?
- Are secrets read from environment variables or a secret store?

### Input and Injection
- Does the code avoid joining values from outside as is into SQL, shell commands, file paths, or HTML?
- Is every such value protected by at least one of placeholders, escaping, or an allow list?

### Authentication and Authorization
- Are authentication (who) and authorization (what they may do) checked separately?
- Does each process run with only the minimum permissions it needs?

### Dependencies and OSS
- Are the versions of dependency packages pinned (lock file)?
- Are dependency packages checked regularly for known vulnerabilities?
- Are OSS licenses compatible with the way the product is distributed, and are the required notices (copyright, license text, NOTICE) bundled?
- Has it been confirmed that no copyleft license (such as GPL) extends to the whole product?

---

## Review Finding Disposition Rules

After review-agent raises findings, the following disposition workflow applies. See also process-rules §9.5.

### Disposition Flow

1. review-agent raises findings with severity (Critical / High / Medium / Low)
2. The responsible agent (or project-manager) triages each finding and records a disposition
3. project-manager verifies all findings have dispositions before allowing phase transition

### Disposition Rules by Severity

| Severity | Allowed Dispositions | Gate Requirement (Lite / Standard) | Gate Requirement (Strict) |
|--------|-------------|-----------|-----------|
| Critical | fixed only | Must be 0 for phase transition (per CLAUDE.md Quality Targets) | Same as Lite / Standard |
| High | fixed only | Must be 0 for phase transition (per CLAUDE.md Quality Targets) | Same as Lite / Standard |
| Medium | fixed / deferred / accepted | All must have a recorded disposition | **Must be 0 (fixed only). Deferred and accepted are not allowed** |
| Low | fixed / deferred / accepted | **Lite: no record needed. Standard: all must have a recorded disposition** | All must have a recorded disposition |

> **The passing bar depends on the development mode** (Table E-2 in `development-mode.md` is the source; reflected in this table on 2026-08-12). **The mode is always stated in the request as one of its givens** (`development-mode.md` "Givens always attached to a request"), so both the reviewer and the judge can look up this table by mode.
>
> **The scope of re-review also depends on the mode.** Standard re-checks only the findings marked "fixed"; **Strict re-checks all findings** (deferred and accepted ones are verified too).
>
> **Escalation of a gate FAIL:** Lite and Standard escalate to the user on the **3rd** FAIL, and **Strict on the 2nd** (retry policy in Process Rules §9.1.1).

### Recording Requirements

- **fixed**: Fix the issue the finding points out, then request re-review. The re-review report confirms resolution
- **deferred**: Create a decision record in `project-records/decisions/` with: deferral rationale, risk assessment, and planned resolution timeline. The finding remains tracked
- **accepted**: Record the acceptance rationale in the review report's Finding Disposition Table

### Re-review Behavior

When review-agent performs a re-review after corrections:
1. Verify each previously raised finding against its recorded disposition
2. Confirm that findings with the disposition "fixed" are actually resolved in the corrected artifact
3. Record the verification result in a new review report with updated counts
4. Any new findings discovered during re-review are added to the Finding Disposition Table

---

## Comprehensive Review Checklist (R1–R8, Mandatory)

A checklist that combines all review perspectives (R1–R8) and can also be used on its own. Keywords follow RFC 2119 (MUST/SHALL = mandatory, SHOULD = recommended). The reviewer MUST fill in the Verdict (PASS/FAIL/NA) for every row. Every FAIL MUST be raised as a finding. When the Verdict is not PASS (FAIL/NA), or when a MUST item is intentionally skipped, the reason MUST be written in Remark. Each row maps to the detailed section above by its chapter and perspective name; see there for rationale and examples.

**Purity annotation convention (language-agnostic, for R7):** every function/method MUST carry exactly one `@purity` tag inside the language's comment (`//`, `#`, `--`, `/* */`, `"""..."""`, etc.). The value is one of four: `pure` / `semi-pure-a` / `semi-pure-b` / `non-pure`. `@purity` is a text marker inside a comment, not language syntax, so it works in every language and is greppable. Pure is stated explicitly, never left unmarked. For exemptions, see "`@purity` Tag" in R7.

| Chapter | Perspective | Level | Check item | Verdict | Remark |
|----|------|-------|----------|:------:|--------|
| R1 | Requirements Structural Quality | MUST | Every functional requirement has an ID (FR-xxx). Non-functional requirements have measurable numeric criteria | — | — |
| R1 | Elimination of ambiguity | MUST | Ambiguous, unverifiable expressions ("appropriately," "fast," "as soon as possible") are eliminated. The subject and action of each requirement are clear | — | — |
| R1 | Elimination of specification duplication and conflicts | MUST | No contradictory or duplicated requirements. There is a single source of truth. Dependencies between requirements are explicit | — | — |
| R1 | Coverage of abnormal and semi-normal cases | SHOULD | Abnormal and semi-normal cases are covered (timeout, interruption, concurrency, insufficient permissions, data inconsistency, resource exhaustion). Boundary values (min/max/empty/null) are explicit | — | — |
| R1 | Completeness verification | SHOULD | Requirements are MECE. No gaps from each stakeholder's viewpoint (administrator/general user/external system) | — | — |
| R1 | Elimination of negation and passive voice | SHOULD | Negative requirements state the alternative action. Passive voice is rewritten in active voice (responsibility made clear). No double negatives | — | — |
| R1 | Traceability | MUST | Purpose, higher-level requirements, lower-level requirements, implementation, and tests can be traced both ways by ID. Meeting the lower level meets the higher level, and meeting the higher level meets the purpose. Each requirement has a verification method | — | — |
| R1 | Requirements notation (EARS) | SHOULD | Requirements are written in the EARS patterns, with one shall per sentence | — | — |
| R2 | Naming | MUST | Names express the essence — the most important item in design (Screaming Architecture; in software, words carry power). No generic names. For parts of speech, units, and consistent terms, see the Naming section | — | — |
| R2 | SRP | MUST | Each class, unit, module, component, and layer has only one responsibility | — | — |
| R2 | SRP (responsibility sentence) | MUST | After removing the procedure, scope, and constraint phrases, one phrase remains | — | — |
| R2 | SRP (higher-level element) | MUST | The responsibility can be stated in one sentence without listing the elements inside | — | — |
| R2 | OCP | SHOULD | Open for extension, closed for modification. New behavior comes through Strategy/Template, not through added if/switch branches | — | — |
| R2 | LSP | SHOULD | A subclass does not strengthen preconditions, weaken postconditions, or change the parent's contract | — | — |
| R2 | ISP | SHOULD | No class is forced to implement interface methods it does not use. Large interfaces are split by usage | — | — |
| R2 | DIP | SHOULD | Upper modules depend on abstractions, not on concrete lower modules (DB/API) | — | — |
| R2 | DRY | SHOULD | No duplicated logic. Magic numbers/strings are defined as constants. No duplicated validation across layers | — | — |
| R2 | KISS | SHOULD | The simplest solution that works. Nesting depth below 4. Flattened with early returns | — | — |
| R2 | YAGNI | SHOULD | No preemptive features or excessive abstraction. No unused parameters/flags/settings | — | — |
| R2 | SoC | MUST | UI, business, and data access are not mixed. Validation, transformation, and persistence are separated | — | — |
| R2 | SLAP | MUST | Each function stays at a single level of abstraction (intent and low-level details are not mixed) | — | — |
| R2 | LoD | SHOULD | No deep chains like `a.b.c.d`. Only direct collaborators are used | — | — |
| R2 | CQS | SHOULD | A method either changes state or returns a value, not both | — | — |
| R2 | POLA | MUST | Behaves as the name says. No hidden side effects. No double-negative Booleans | — | — |
| R2 | PIE | MUST | Names and comments express "why," not "what." Intermediate results are named | — | — |
| R2 | CA | MUST | Dependencies point one way, toward the center that changes least. The center is not contaminated by frameworks/DB. The number of layers does not matter | — | — |
| R2 | Prompt Engineering | SHOULD | Location, input/output schemas, tests, versions, and hallucination countermeasures are in place | — | — |
| R2 | Comparison with the Minimal Configuration | MUST | ADR-000 in Ch5.6 has the minimal configuration, the added elements, and the reason for each | — | — |
| R2 | Component Boundaries | MUST | Other components are referred to only through their public face in Ch5.3 (an axis separate from CA in R2) | — | — |
| R2 | Cache Policy | MUST | If caches are used, an ADR in Ch5.6 records what is cached, the invalidation trigger, the allowed staleness, and the behavior on simultaneous expiry | — | — |
| R2 | DRY (one place) | MUST | The same decision, calculation, or conversion is not written in two or more places | — | — |
| R2 | DRY (public face) | MUST | Search the public face of other components before writing a helper function. Do not copy non-public functions | — | — |
| R2 | OKPN | MUST | Each name of a data element takes values of one kind only. For exceptions, see "OKPN/OMPV" in R2 | — | — |
| R2 | OMPV | MUST | Each value of a data element has one meaning only. For exceptions, see "OKPN/OMPV" in R2 | — | — |
| R2 | Compatibility and Versions | MUST | Stored and exchanged formats carry a version, and a reader learns of an incompatible change through an error | — | — |
| R2 | Build Versions | MUST | The build system adds the version automatically, and the source commit can be traced from it | — | — |
| R3 | Error Handling | MUST | All external I/O (network/DB/file) has error handling. Errors are not swallowed (no empty catch) | — | — |
| R3 | Error Messages | MUST | Internal error messages carry the context needed for debugging. Messages to users do not leak internal details (stack traces, DB errors) | — | — |
| R3 | Defensive Programming | MUST | All external input is validated. Null/Undefined/empty are handled. No type assertions without safety checks | — | — |
| R3 | Boundaries and Indexes | MUST | Ranges are half-open `[start, end)`; a closed range is shown by its name. End points are not adjusted with `±1` | — | — |
| R3 | Resource Lifetime | MUST | Acquired resources are released by a language mechanism (`try-with-resources` / `using` / `defer` / `with` / RAII, etc.) | — | — |
| R3 | Time | MUST | Elapsed time uses a monotonic clock, stored and exchanged times are UTC or carry an offset, and date arithmetic uses calendar APIs | — | — |
| R3 | Null Trap | MUST | The specification defines how an omitted data element and a null value are handled, and the implementation follows it | — | — |
| R3 | Logging and Observability | MUST | Log levels are used by meaning, personal information and secrets are not logged, and enough context remains to trace the cause of a failure | — | — |
| R4 | Deadlock | MUST | Lock acquisition order across multiple resources is uniform and documented. No external calls or long-running work inside DB transactions | — | — |
| R4 | Race Condition | MUST | Concurrent access to shared state is identified. Check-Then-Act and Read-Modify-Write are made atomic (lock/atomic). No races across await | — | — |
| R4 | Glitch | MUST | Updates of multiple fields are atomic (no observable intermediate glitch). The implementation matches the state transitions in Spec Ch5.5. Event notification timing (before/after) is defined | — | — |
| R4 | State Machine | MUST | The state transition diagram and the state transition table come as a pair. States are not defined by combinations of values. Every cell is tested | — | — |
| R5 | Algorithms and Data Structures | MUST | The complexity of key algorithms meets the NFR (Ch4.2). No O(n²) or worse for large data | — | — |
| R5 | Database and I/O | SHOULD | No N+1 queries. No over-fetching with `SELECT *`. Bulk operations instead of per-item work in loops. Indexes/paging for large fetches | — | — |
| R5 | Memory and Resources | MUST | No memory leaks (listeners/timers released, no leaking circular references). Caches have limits (TTL/size). Large data is streamed | — | — |
| R5 | Network and Frontend | SHOULD | Parallelizable I/O is not needlessly serialized. No unnecessary frontend re-renders. Lazy loading/code splitting is used where applicable | — | — |
| R6 | Independence | MUST | Tests are independent (no order or shared-state dependency). No flaky tests (timing/randomness dependent) | — | — |
| R6 | Coverage | MUST | Boundary values, abnormal cases, and edge cases are covered (not just normal cases). Requirement coverage traces to FR-xxx | — | — |
| R6 | Test Names | MUST | Test names express intent. Overuse of mocks/stubs does not leave actual behavior unverified | — | — |
| R6 | Gherkin | SHOULD | Test cases are written in Given / When / Then, with one behavior per scenario and a requirement ID | — | — |
| R7 | Purity Classification | MUST | Each function/method is classified as `pure` / `semi-pure-a` (reads immutable values) / `semi-pure-b` (reads mutable or non-deterministic state) / `non-pure` (mutable state or side effects) | — | — |
| R7 | Purity of Calculation Logic | MUST | Calculation logic (business rules, decisions, conversions) is `pure` or `semi-pure-a`. Non-pure effects are not mixed in (orthogonal to CA in R2) | — | — |
| R7 | Lifting External Reads | SHOULD | `semi-pure-b` reads (clock, random numbers, DB/file/network reads) are collected at the start and, where possible, injected as arguments to lift the function to `pure` | — | — |
| R7 | Separation of Collection and Processing | MUST | No new external reads in the middle of processing. If every item cannot be collected, the unit of consistency is stated | — | — |
| R7 | Immutability of Pure-Side Classes | MUST | Each pure-side class is an immutable class, a value object, or a stateless class and holds no mutable state. A class with mutable state or side-effecting methods is stateful (non-pure) | — | — |
| R7 | `@purity` Tag | MUST | Every function/method carries a `@purity` tag in a comment (exemptions are in the "`@purity` Tag" section) | — | — |
| R7 | Structural Separation (order) | SHOULD | Within a class/unit, members are ordered pure → semi-pure → non-pure, with a section comment before the non-pure group | — | — |
| R7 | Structural Separation (state and computation) | SHOULD | A class does not mix mutable state with pure computation; pure logic is extracted into pure functions or value objects | — | — |
| R7 | Structural Separation (files) | SHOULD | Units are separated by purity (pure core and non-pure shell in different files) | — | — |
| R7 | Failure Representation | SHOULD | Failures on the calculation-logic side are expressed with return types (Result / Either / Option). A language without an equivalent mechanism may use domain exceptions instead | — | — |
| R8 | Secrets | MUST | Keys, tokens, and passwords are not written in code, configuration, or logs | — | — |
| R8 | Input and Injection | MUST | External values are not joined as is into SQL, commands, paths, or HTML | — | — |
| R8 | Authentication and Authorization | MUST | Authentication and authorization are checked separately, and each process runs with the minimum permissions | — | — |
| R8 | Dependencies and OSS | MUST | Dependency versions are pinned, known vulnerabilities are checked, OSS licenses are compatible, and the required notices are bundled | — | — |

---

## Design Principles Index

**This section is where compliance with software design principles is checked.**

**The check is done by the R2 and R7 reviews.** Principles may be added or removed according to the nature of the project.

**Design principles catalog:**

| Category | Identifier | Formal Name | Check Perspective |
| -------- | -------------------- | ------------------------------------- | -------------------------------------------------------------------------- |
| Naming | Naming | — | Do names convey intent? Do they match the domain vocabulary (Chapter 1.8)? |
| Dependency | Dependency Direction | — | Does the dependency direction follow the architecture layers in Chapter 5.1? |
| Dependency | SDP | Stable Dependencies Principle | Does each dependency point to a component more stable (changing less often) than itself (CA in R2)? |
| Simplicity | KISS | Keep It Simple, Stupid | Is the simplest working solution chosen? |
| Simplicity | YAGNI | You Aren't Gonna Need It | Is only what is needed now built, with no over-engineering? |
| Simplicity | Minimal Comparison | — | Does ADR-000 in Ch5.6 compare with the minimal configuration and give the reasons for the additions ("Comparison with the Minimal Configuration" in R2)? |
| Simplicity | DRY | Don't Repeat Yourself | Are code, logic, and definitions free of duplication? |
| Separation of Responsibilities | SoC | Separation of Concerns | Are concerns properly separated? |
| Separation of Responsibilities | SRP | Single Responsibility Principle | Does each class, unit, module, component, and layer have only one responsibility? Is a higher-level responsibility a summary of the lower-level responsibilities, not their sum (SRP in R2)? |
| Separation of Responsibilities | SLAP | Single Level of Abstraction Principle | Is the level of abstraction within a function uniform? |
| SOLID | OCP | Open-Closed Principle | Is it open for extension and closed for modification? |
| SOLID | LSP | Liskov Substitution Principle | Does it still work correctly when a child class replaces the parent class? |
| SOLID | ISP | Interface Segregation Principle | Are interfaces properly split? |
| SOLID | DIP | Dependency Inversion Principle | Does it depend on abstractions, not on concretions? |
| Coupling | LoD | Law of Demeter | Does it avoid digging into the internal structure of objects (only direct collaborators used)? |
| Coupling | CQS | Command-Query Separation | Are commands and queries separated? |
| Readability | POLA | Principle of Least Astonishment | Does it behave as the reader expects? |
| Readability | PIE | Program Intently and Expressively | Does the code convey its intent clearly? |
| Testing | Testability | — | Is it easy to unit test? Is the design easy to inject mocks and stubs into? |
| Purity | Pure / Semi-pure-a / Semi-pure-b / Non-pure | — | Can each function be classified as pure / semi-pure-a / semi-pure-b / non-pure? Are side effects and external reads moved out of calculation logic (functional core / imperative shell)? |
| Structure | Collect-Process Separation | Collect, then process | Is processing free of new external reads in the middle? When collecting every item is impossible, is the unit of consistency (chunk/snapshot/transaction) stated, so that the result does not depend on timing? |
| State Transition | State Transition | — | Is reading the transition condition kept separate from performing the transition? |
| State Transition | State Machine | — | Does each state machine have a diagram and a state transition table as a pair, with separate names for the definition and the current state ("State Machine" in R4)? |
| Concurrency | Concurrency Safety | — | Are deadlocks, race conditions, and glitches prevented? |
| Error | Error Propagation | — | Are errors propagated and handled properly, not swallowed? |
| Resource Management | Resource Lifecycle | — | Are the acquisition and release of resources (connections, files, memory) paired ("Resource Lifetime" in R3)? |
| Immutability | Immutability | — | Are values that need not change immutable? |
| Data | OKPN | One Kind Per Name | Does each name of a data element take values of one kind only (OKPN in R2)? |
| Data | OMPV | One Meaning Per Value | Does each value of a data element have one meaning only (OMPV in R2)? |
| Data | Null Trap | — | Does the specification define how an omitted data element and a null value are handled (Null Trap in R3)? |
| Data | Compatibility | — | Do stored and exchanged formats carry a version and distinguish compatible from incompatible changes ("Compatibility and Versions" in R2)? |
| Security | Least Privilege | Principle of Least Privilege | Does each process run with only the minimum permissions it needs ("Authentication and Authorization" in R8)? |
| Resource Efficiency | Resource Efficiency | — | Are CPU load, memory use, storage wear, etc. within acceptable limits? |
