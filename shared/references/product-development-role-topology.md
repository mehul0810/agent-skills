# Product Development Role Topology

Use this reference to turn product work into explicit decision, execution, review, proof, and release contracts. Roles describe accountability; they do not require permanent threads unless the owner adopts the dedicated topology below.

## Role Contracts

### Product Planner

Validate discovery before implementation: user/problem evidence, current workflow, expected outcome, UX and WordPress ownership, constraints, non-goals, dependencies, risks, and cheapest useful proof. For feature, UX, growth, or product-research recommendations, use `product-value-decision.md` and include its compact user/business value case. Return an implementation-ready packet with exact product/repo, milestone, recommended branch/base, acceptance criteria, proof-environment choice, and unresolved contract questions. Research findings without actionable evidence stay in a research lane, not the release backlog.

### Product Operations / PO

Own one product's issues, milestones/due dates, priority, accepted scope, labels, assignment, branch/train state, worker coordination, and acceptance reconciliation. Convert the Planner packet and value case into duplicate-screened PR-sized issues. After release, compare the stated outcome/decision threshold with measured or qualitative evidence, classify the bet `validated|mixed|disproved|unmeasured`, and capture support, usage, proof, regression, and release-process learning; route reusable lessons to product docs or the cross-product learning loop.

### Engineering Review

Independently review the exact PR/head against the linked issue, product/repo architecture, tests, accessibility, security/privacy, performance, maintainability, compatibility, and declared browser/runtime proof. The reviewer does not silently implement or expand scope. Return findings first, required corrections, proof gaps, and `PASS|FAIL|BLOCKED`. Use `$wp-quality-reviewer` for focused technical domains and a fresh `$behavior-validator` for observable behavior when applicable.

### Test & Proof

Independently exercise the exact PR/head or packaged artifact against acceptance criteria, golden workflows, supported environments, accessibility behavior, and changed UI at relevant widths. Return the runner/environment, fixtures and mutation level, exact artifact/SHA, commands and browser evidence, failures/skips, cleanup state, and `PASS|FAIL|BLOCKED`. Do not repair the implementation inside the proof task; return failures to PO for a bounded worker correction.

### Release Readiness

Assess an exact milestone candidate, not general branch state. Verify release scope, candidate SHA, production-branch ancestry, required CI, version/package/readme/changelog/release notes, open-issue dispositions, quality evidence, packaged browser/golden-workflow proof, rollback, and proof-environment legitimacy. Return `GO|NO-GO`, remaining blockers, accepted gaps, and the exact owner approval requested. Readiness never grants release authority.

## CTO Boundary

CTO is escalation-only for public API/schema or breaking contracts, security/privacy posture, material architecture or cross-product impact, release-risk exceptions, and unresolved product contracts. Routine planning, issue/PR state, engineering review, and readiness execution remain with the product lanes.

## Task And Thread Shape

- Preserve exact product identity even when products share a parent project. Every task names product, repository/path, milestone, branch/base, issue/PR, and release candidate when applicable.
- Use shared durable lanes only when their contract remains product-scoped. Planner and Release Readiness may be milestone-bound for quiet products.
- Name temporary implementation, proof, docs, design, and review work by outcome. Reconcile evidence and close/archive Codex-created workers when complete; do not create permanent functional silos by habit.
- One task may carry one role contract. When one person or thread performs multiple roles, record each handoff and preserve independence where review or behavioral proof requires it.

### Owner-Approved Dedicated Product Topology

For an active product where the owner wants durable role control rooms, create protected tasks in the same saved product project named `<Product> Planner`, `<Product> PO`, `<Product> Review`, `<Product> Test & Proof`, and `<Product> Release Readiness`. These tasks retain only their role state; GitHub and repo docs remain source of truth. Do not give every task a heartbeat.

Do not create a permanent Worker task. PO creates outcome-named disposable workers in that same product project only when an issue needs isolated execution, records their thread IDs, and supplies exact repo/worktree paths. Product-project membership does not prove an app-managed worktree root; if the saved project is broader than the Git repo, use a verified manual worktree outside WordPress-scanned paths.

### Disposable Worker Lifecycle

PO or its heartbeat performs lifecycle reconciliation automatically for exact tracked worker IDs. A pushed commit or open PR is not completion. Use `set_thread_archived` only after the Codex-created worker is idle with a final summary, Engineering Review and applicable Test & Proof pass, corrections and current validation match the exact PR/head, the PR plus issue/train are reconciled, and no handoff remains.

Failed review/proof returns a bounded correction to the worker; do not archive it. After archive, clean its worktree separately only when storage-lifecycle safety evidence passes. Automation inspects only tracked completed workers, archives successful reconciliation without noisy notification, and reports a missing archive tool, identity, review, or PR state once. Never auto-archive owner-created role/control tasks.

## Required Handoffs

1. Planner -> PO: evidence-backed implementation packet or a bounded research decision.
2. PO -> Worker: issue, scope/non-goals, branch/base, validation, proof environment/mutation level, risks, and stop condition.
3. Worker -> Engineering Review and Test & Proof: exact PR/head, issue, changed contract, tests, package/runtime target, and known gaps.
4. Engineering Review and Test & Proof -> PO: independent dispositions and corrections; PO reconciles acceptance and train state.
5. PO -> Release Readiness: exact candidate plus closed/open scope and evidence index.
6. Release Readiness -> Owner/PO: GO/NO-GO brief; owner approves any protected production merge, beta/stable tag, release, publish, or documented exception.

Do not skip a role because one thread already knows the implementation. Compress quiet/small-product execution, but preserve discovery validation, independent review proportional to risk, exact-candidate readiness, and post-release learning.
