# Adjacent Finding Protocol

Use this when a worker or specialist notices an improvement, bug, refactor need, docs gap, test gap, UX issue, security concern, performance concern, or product opportunity outside the current scoped task.

## Worker Rule

Do not expand the current PR or task scope blindly.

Finish the assigned work unless the adjacent finding is severe enough to require immediate escalation.

## Worker Obligations

- Classify the finding: bug, refactor, docs, test, UX, security, performance, or product opportunity.
- State severity: low, medium, high, or critical.
- Capture evidence: file/path, screenshot, log, stack trace, benchmark signal, repro note, support signal, or source link.
- State likely impact: user-facing, admin/editor, release risk, maintainability, scale, security/privacy, or product value.
- Suggest routing: current product backlog, release blocker, sanitized hardening, docs follow-up, or owner-gated strategy.
- Include the finding in the final worker report under `Adjacent findings`, separate from the scoped task result.

## Scope Boundary

Default action is detect, report, and preserve scope.

Do not add adjacent fixes to the current PR unless the parent PO explicitly rescopes the issue or the finding is inseparable from the safe completion of the assigned change.

## Severity Escape Hatch

If the adjacent finding suggests security/privacy risk, data loss, broken package/release behavior, or a release-blocking regression:

- Escalate immediately instead of burying it in final notes.
- Stop or narrow the current task if continuing would ship or hide the risk.
- Use sanitized wording for security-sensitive findings.

## PO Obligations

When a worker reports an adjacent finding, the Product Orchestrator should:

- Duplicate-screen open issues, closed issues, PRs, and roadmap/release context.
- Decide one of: create focused issue, attach to an existing issue, defer with reason, or mark owner-gated.
- Create a bounded GitHub issue with labels, milestone/release context, validation expectations, and evidence when warranted.
- Keep the worker PR scoped unless the finding is truly inseparable from the current safe fix.

## Output Shape

Worker final report:

```text
Adjacent findings
- Type/severity: ...
- Evidence: ...
- Impact: ...
- Suggested routing: ...
```

PO triage outcome:

```text
Adjacent finding triage
- Action: issue | existing issue | defer | owner-gated
- Evidence: ...
- URL or rationale: ...
```
