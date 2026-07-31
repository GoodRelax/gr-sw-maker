Write the handoff document for this session:

0. **This MUST NOT be delegated to a subagent.** Only the main session holds the conversation history, and the two items below cannot be recovered from files
1. Read `project-management/pipeline-state.md` and confirm the phase at interruption and the outstanding tasks
2. Work out **the delta against the plan**: what the plan lists but is already done, what was done without being planned, and what was planned and turned out to be unnecessary
3. Work out **the defects this session introduced and then fixed itself**. Deliverables keep only the successful end state, so this route exists nowhere in the files
4. List the open questions, and any agreement with the user that is not written into a file
5. Write it to `project-management/session-handoff/session-handoff-{NNN}-{YYYYMMDD}-{HHMMSS}.md`, in the form given in Document Rules §9.38
6. Update `latest_handoff` in `pipeline-state` to the path of the file you wrote

**Steps 2 and 3 MUST NOT be skipped.** Without 2 the next session repeats finished work; without 3 it walks into the same hole. **Written straightforwardly, these two are the first to go missing.**
