# Product Development Role Topology

Defines decision, execution, review, proof, and release accountability. Roles do not require permanent threads unless the owner adopts the topology below.

## Role Contracts

### Product Planner

Validate user/problem evidence, workflow, outcome, UX/WordPress ownership, constraints, risks, dependencies, and proportionate proof before implementation. Recommendations use `product-value-decision.md` and include its user/business value case. Return product/repo, milestone, branch/base, acceptance criteria, proof environment, and open contract questions; keep research without actionable evidence out of the release backlog.

### Product Operations / PO

Own one product's issue/milestone priorities, accepted scope, labels, assignments, branch/train, workers, and acceptance. Convert the Planner packet/value case into duplicate-screened PR-sized issues. Post-release, compare outcomes with the stated threshold; classify `validated|mixed|disproved|unmeasured`, capture support, usage, proof, regression, and process learning, and route reusable lessons to product docs or the cross-product loop.

### Engineering Review

Independently review the exact PR/head against issue, architecture, tests, accessibility, security/privacy, performance, maintainability, compatibility, and declared runtime proof. Do not implement or expand scope. Return findings first, corrections, proof gaps, and `PASS|FAIL|BLOCKED`; use `$wp-quality-reviewer` for focused domains and fresh `$behavior-validator` for observable behavior when applicable.

### Test & Proof

Independently test the exact PR/head or package against acceptance criteria, golden workflows, supported environments, accessibility, and changed UI widths. Return runner/environment, fixtures/mutation level, artifact/SHA, commands/browser evidence, failures/skips, cleanup, and `PASS|FAIL|BLOCKED`. Do not repair in the proof task; return failures to PO for bounded correction.

### Release Readiness

Assess an exact milestone candidate, not general branch state: scope, SHA, production ancestry, CI, version/package/readme/changelog/release notes, issue dispositions, quality and packaged browser/golden-workflow proof, rollback, and legitimate proof environment. Return `GO|NO-GO`, blockers, accepted gaps, and exact owner approval requested. Readiness grants no release authority.

## CTO Boundary

CTO is escalation-only for public API/schema or breaking contracts, security/privacy posture, material architecture/cross-product impact, release-risk exceptions, and unresolved product contracts. Product lanes own routine planning, issue/PR state, review, and readiness.

## Task And Thread Shape

- Preserve exact product identity across shared parent projects; name product, repo/path, milestone, branch/base, issue/PR, and candidate when applicable.
- Shared durable lanes must remain product-scoped; Planner and Release Readiness may be milestone-bound for quiet products.
- Name temporary work by outcome. PO uses an in-task subagent for isolated execution by default; create a new user-visible worker task only when the owner explicitly requests it. Reconcile evidence and close/archive authorized Codex-created workers when complete.
- One task carries one role contract. Record combined-role handoffs and preserve review/behavioral-proof independence.

### Owner-Approved Dedicated Product Topology

Only when the owner explicitly requests durable role rooms and visible task creation, create protected `<Product> Planner`, `<Product> PO`, `<Product> Review`, `<Product> Test & Proof`, and `<Product> Release Readiness` tasks in the same saved product project. They retain role state; GitHub/repo docs remain source of truth. Do not give every task a heartbeat. Otherwise map roles onto the current task and in-task agents.

Do not create a permanent Worker task. Creating a user-visible disposable worker task requires an explicit owner request for that task; when authorized, record its thread ID and exact repo/worktree paths. Product-project membership does not prove an app-managed worktree root; for a broader project, use a verified manual worktree outside WordPress-scanned paths.

### Disposable Worker Lifecycle

PO or its heartbeat performs lifecycle reconciliation automatically for exact tracked worker IDs. A pushed commit or open PR is not completion. Use `set_thread_archived` only when a Codex-created worker is idle with final summary; Engineering Review and applicable Test & Proof pass; corrections/current validation match exact PR/head; PR and issue/train are reconciled; and no handoff remains.

Failed review/proof returns bounded correction; do not archive. Clean worktrees separately only after storage-lifecycle safety proof. Automation inspects tracked completed workers, archives reconciled successes quietly, and reports a missing tool, identity, review, or PR state once. Never auto-archive owner-created role/control tasks.

## Required Handoffs

1. Planner -> PO: evidence-backed packet or bounded research decision.
2. PO -> Worker: issue, scope/non-goals, branch/base, validation, proof environment/mutation, risks, stop condition.
3. Worker -> Review/Test: exact PR/head, issue, changed contract, tests, package/runtime, known gaps.
4. Review/Test -> PO: independent dispositions/corrections; PO reconciles acceptance/train.
5. PO -> Release Readiness: exact candidate, scope, evidence index.
6. Release Readiness -> Owner/PO: GO/NO-GO; owner approves protected merge, beta/stable tag, release, publish, or exception.

Do not skip a role because one thread already knows the implementation. Compress quiet/small-product execution, but preserve discovery validation, independent review proportional to risk, exact-candidate readiness, and post-release learning.
