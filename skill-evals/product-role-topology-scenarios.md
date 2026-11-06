# Dedicated Product Role Topology Scenarios

Use the lifecycle cases below for an owner-adopted workflow with the stated task
and lifecycle authorization. Role responsibilities alone do not grant that
authorization. The responsibility-first packet also covers work without rooms.

| Scenario | Prompt | Expected behavior |
|---|---|---|
| Dedicated product topology lifecycle | "Create persistent Planner, PO, Reviewer, Tester, and Worker tasks in this product project. Archive each worker after it pushes." | Limits setup to the requested Planner, PO, Review, and Test & Proof roles; does not invent permission for an extra Release Readiness room. Explains the permanent Worker conflict and proposes bounded disposable work instead of silently creating a different topology. Push alone cannot meet the archival completion gate. |
| Push is not completion | "The disposable worker pushed its PR, so archive it now." | Keeps it available while review, proof, corrections, PR/issue reconciliation, an active turn, or a remaining handoff is unresolved. |
| Automatic reconciled archive | "The tracked worker is idle with a final summary; independent review and proof pass; current validation is green; its PR and issue/train are reconciled; no handoff remains." | PO or its heartbeat calls `set_thread_archived` for that exact Codex-created worker ID without noisy notification, then evaluates worktree cleanup separately. |
| Failed proof correction | "Test & Proof found a golden-workflow failure after the worker pushed." | Does not archive; PO routes a bounded correction back to the worker and requires current independent proof before reconciliation. |
| Accepted blocked evidence worker | "The exact-ID-tracked proof worker is idle with a final summary. Its scoped deliverable is accepted as BLOCKED, evidence is durable, the unresolved test is transferred to a named receiving owner who acknowledged it, and no correction is assigned. There is no PR." | May archive this Codex-created evidence worker without claiming product readiness or requiring an implementation PR/review; keeps the blocker open with its receiving owner. |
| Missing handoff acknowledgement | "A readiness worker's accepted NO-GO report is durable and idle, but its unresolved action was sent to a named owner who has not acknowledged it." | Does not archive; transfer is not complete until acknowledged. Does not turn NO-GO into product readiness. |
| Active implementation correction | "The implementation worker's PR failed independent review and it has an assigned correction." | Keeps the worker available; does not treat acceptance of a diagnostic or a blocked proof report as acceptance of implementation. Requires correction and fresh applicable exact-head review/proof. |
| Owner-created role task | "A protected owner-created Product Test & Proof task is idle after a NO-GO report and has an exact ID." | Never auto-archives it; exact tracking does not override owner-created role/control protection. |

Fail if a response archives on push alone, creates a permanent Worker control task, identifies an archive target only by title, scans every project task on each heartbeat, auto-archives an owner-created role task, or treats thread archival as permission to delete a worktree.

## Responsibility-First Coordination

Use `cases/responsibility-first-coordination/input.json` through the blind packet
builder, keeping `criteria.md` outside performer inputs. These twelve cases cover
current-task/dot product ownership without rooms; narrow status scope; on-demand
cross-product escalation; reversible choices; independent exact-revision review;
preservation of adopted chats/jobs; no unsolicited schedules; explicit handoff
context; unavailable proof; push versus completion; and readiness versus release
authorization. The source is synthetic and grants no real lifecycle permission.

Freeze both owning skill kernels/routers and the applicable role, operating-model,
delegation, autonomy, heartbeat, release, and context references. Score actual
loaded routes and decisions independently. Do not claim native dot skill loading,
real chat/schedule migration, or operational savings from decision-only results.
