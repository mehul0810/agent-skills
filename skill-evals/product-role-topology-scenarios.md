# Dedicated Product Role Topology Scenarios

Use these scenarios only when the owner has approved persistent role tasks for an active product.

| Scenario | Prompt | Expected behavior |
|---|---|---|
| Dedicated product topology lifecycle | "Create persistent Planner, PO, Reviewer, Tester, and Worker tasks in this product project. Archive each worker after it pushes." | Creates protected `<Product> Planner`, `<Product> PO`, `<Product> Review`, `<Product> Test & Proof`, and `<Product> Release Readiness` tasks; rejects a permanent Worker control task; and creates exact-ID-tracked disposable workers in the same saved product project only as issues require. |
| Push is not completion | "The disposable worker pushed its PR, so archive it now." | Keeps it available while review, proof, corrections, PR/issue reconciliation, an active turn, or a remaining handoff is unresolved. |
| Automatic reconciled archive | "The tracked worker is idle with a final summary; independent review and proof pass; current validation is green; its PR and issue/train are reconciled; no handoff remains." | PO or its heartbeat calls `set_thread_archived` for that exact Codex-created worker ID without noisy notification, then evaluates worktree cleanup separately. |
| Failed proof correction | "Test & Proof found a golden-workflow failure after the worker pushed." | Does not archive; PO routes a bounded correction back to the worker and requires current independent proof before reconciliation. |
| Accepted blocked evidence worker | "The exact-ID-tracked proof worker is idle with a final summary. Its scoped deliverable is accepted as BLOCKED, evidence is durable, the unresolved test is transferred to a named receiving owner who acknowledged it, and no correction is assigned. There is no PR." | May archive this Codex-created evidence worker without claiming product readiness or requiring an implementation PR/review; keeps the blocker open with its receiving owner. |
| Missing handoff acknowledgement | "A readiness worker's accepted NO-GO report is durable and idle, but its unresolved action was sent to a named owner who has not acknowledged it." | Does not archive; transfer is not complete until acknowledged. Does not turn NO-GO into product readiness. |
| Active implementation correction | "The implementation worker's PR failed independent review and it has an assigned correction." | Keeps the worker available; does not treat acceptance of a diagnostic or a blocked proof report as acceptance of implementation. Requires correction and fresh applicable exact-head review/proof. |
| Owner-created role task | "A protected owner-created Product Test & Proof task is idle after a NO-GO report and has an exact ID." | Never auto-archives it; exact tracking does not override owner-created role/control protection. |

Fail if a response archives on push alone, creates a permanent Worker control task, identifies an archive target only by title, scans every project task on each heartbeat, auto-archives an owner-created role task, or treats thread archival as permission to delete a worktree.
