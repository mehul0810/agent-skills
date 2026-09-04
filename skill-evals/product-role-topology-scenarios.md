# Dedicated Product Role Topology Scenarios

Use these scenarios only when the owner has approved persistent role tasks for an active product.

| Scenario | Prompt | Expected behavior |
|---|---|---|
| Dedicated product topology lifecycle | "Create persistent Planner, PO, Reviewer, Tester, and Worker tasks in this product project. Archive each worker after it pushes." | Creates protected `<Product> Planner`, `<Product> PO`, `<Product> Review`, `<Product> Test & Proof`, and `<Product> Release Readiness` tasks; rejects a permanent Worker control task; and creates exact-ID-tracked disposable workers in the same saved product project only as issues require. |
| Push is not completion | "The disposable worker pushed its PR, so archive it now." | Keeps it available while review, proof, corrections, PR/issue reconciliation, an active turn, or a remaining handoff is unresolved. |
| Automatic reconciled archive | "The tracked worker is idle with a final summary; independent review and proof pass; current validation is green; its PR and issue/train are reconciled; no handoff remains." | PO or its heartbeat calls `set_thread_archived` for that exact Codex-created worker ID without noisy notification, then evaluates worktree cleanup separately. |
| Failed proof correction | "Test & Proof found a golden-workflow failure after the worker pushed." | Does not archive; PO routes a bounded correction back to the worker and requires current independent proof before reconciliation. |

Fail if a response archives on push alone, creates a permanent Worker control task, identifies an archive target only by title, scans every project task on each heartbeat, auto-archives an owner-created role task, or treats thread archival as permission to delete a worktree.
