Conduct the following retrospective:

## Analysis Phase (performed by process-improver)

1. Read all defect tickets from project-records/defects/
2. Identify recurring defect patterns
3. Analyze root causes (CMMI CAR process)
4. Verify conformance with the document management rules (process-rules/full-auto-dev-document-rules-ja.md)
   - Does the Common Block / Form Block structure match the actual situation?
   - Are there any missing or unnecessary fields?
5. Record the analysis results and improvement measures in project-records/improvement/retrospective-{today's date}.md

## Approval Phase (performed by orchestrator)

6. Make approval decisions on improvement measures:
   - Changes to CLAUDE.md / process-rules → Request user approval
   - Changes to agent definitions → orchestrator decides

## Application Phase (performed by decree-writer)

7. Apply approved improvement measures to target files
8. Record before/after diff in project-records/improvement/

## Recurrence Prevention Record Format
- defect pattern: [Description of the pattern]
- Root cause: [Result of Why-Why analysis]
- Countermeasure: [Content to add to CLAUDE.md or agent definitions]
- Effectiveness verification method: [Verification method in the next phase]
