# Product Development Role Topology

Defines decision, execution, review, proof, and release accountability. Roles are responsibilities, not a required permanent chat hierarchy. Map them to the current task and bounded delegated work unless the owner explicitly adopts durable role conversations.

## Role Contracts

### Product Planner

Validate user/problem evidence, workflow, outcome, UX/WordPress ownership, constraints, risks, dependencies, and proportionate proof before implementation. Recommendations use `product-value-decision.md` and include its user/business value case. Return product/repo, milestone, branch/base, acceptance criteria, proof environment, and open contract questions; keep research without actionable evidence out of the release backlog.

### Product Operations / PO

Own one product's issue/milestone priorities, accepted scope, labels, assignments, branch/train, workers, and acceptance. Convert the Planner packet/value case into duplicate-screened PR-sized issues. Post-release, compare outcomes with the stated threshold; classify `validated|mixed|disproved|unmeasured`, capture support, usage, proof, regression, and process learning, and route reusable lessons to product docs or the cross-product loop.

### Engineering Review

Independently review the exact PR/head against issue, architecture, tests, accessibility, security/privacy, performance, maintainability, compatibility, and declared runtime proof. Do not implement or expand scope. Return findings first, corrections, proof gaps, and `PASS|FAIL|BLOCKED`; use `$wp-quality-reviewer` for focused domains and fresh `$behavior-validator` for observable behavior when applicable.

### Test & Proof

Independently test the exact PR/head or package against acceptance criteria, golden workflows, supported environments, applicable accessibility checks, and changed UI widths. Return runner/environment, fixtures/mutation level, artifact/SHA, commands/browser evidence, failures/skips, cleanup, and `PASS|FAIL|BLOCKED`. Do not repair in the proof task; return failures to PO for bounded correction. Exclude macOS VoiceOver and voice-over narration verification unless explicitly requested; do not substitute another screen reader or claim assistive-technology compatibility from their absence.

### Release Readiness

Assess an exact milestone candidate, not general branch state: scope, SHA, production ancestry, CI, version/package/readme/changelog/release notes, issue dispositions, quality and packaged browser/golden-workflow proof, rollback, and legitimate proof environment. Return `GO|NO-GO`, blockers, accepted gaps, and exact owner approval requested. Readiness grants no release authority.

## CTO Boundary

CTO is escalation-only for public API/schema or breaking contracts, security/privacy posture, material architecture/cross-product impact, release-risk exceptions, and unresolved product contracts. Product lanes own routine planning, issue/PR state, review, and readiness.

## Task And Handoff Shape

- Preserve exact product identity across shared parent projects; name product, repo/path, milestone, branch/base, issue/PR, and candidate when applicable.
- Keep every handoff product-scoped and identify the source of truth. Planner and Release Readiness may be milestone-bound when useful; they are not prerequisite rooms.
- Name bounded work by outcome. Use in-task delegation when suitable; create a new user-visible worker task only when the owner explicitly requests it. Reconcile evidence; do not close or archive persistent conversations without exact authorization.
- Name the responsible role at each step; a coordinator may cover planning, product decisions, and readiness without separate chats. Record handoffs and preserve review/behavioral-proof independence.

### Optional Durable Product Topology

Only when explicitly adopted and authorized, use durable role conversations. Create only the exact roles requested, not extra rooms to complete a Planner/PO/Review/Test/Release Readiness set. They may retain role context; GitHub/repo docs remain source of truth. A role invocation does not authorize changing chats or schedules. Otherwise use the current task and bounded delegation.

Do not create a permanent Worker task. Creating a user-visible disposable worker task requires an explicit owner request for that task; when authorized, record its thread ID and exact repo/worktree paths. Product-project membership does not prove an app-managed worktree root; for a broader project, use a verified manual worktree outside WordPress-scanned paths.

### Disposable Worker Lifecycle

Lifecycle reconciliation is limited to workers for which the current workflow has exact authorization. Use archive controls only for Codex-created disposable workers when authorized; never auto-archive owner-created role/control conversations or disposables. A pushed commit or open PR is not completion. Implementation requires idle final summary, independent Engineering Review and applicable Test & Proof passing on the exact PR/head, corrections/current validation matching that head, reconciled PR/issue/train, and no handoff. Failed review/proof or assigned corrections keep workers available for correction/fresh validation; accepted diagnostics cannot change their implementation role or establish readiness.

Non-implementation research/review/proof/readiness requires accepted scoped deliverable, durable evidence, unresolved actions transferred with acknowledged receiving-owner handoff, idle final summary, and no assigned correction. Accepted `BLOCKED`/`NO-GO` needs no implementation PR/pass and establishes no product readiness. Both branches retain creator/identity gates. Clean worktrees separately after storage-lifecycle safety proof. When specifically authorized, archive eligible disposable workers quietly; report unavailable prerequisites once.

## Required Handoffs

1. Planner -> PO: evidence-backed packet or bounded research decision.
2. PO -> Worker: issue, scope/non-goals, branch/base, validation, proof environment/mutation, risks, stop condition.
3. Worker -> Review/Test: exact PR/head, issue, changed contract, tests, package/runtime, known gaps.
4. Review/Test -> PO: independent dispositions/corrections; PO reconciles acceptance/train.
5. PO -> Release Readiness: exact candidate, scope, evidence index.
6. Release Readiness -> Owner/PO: GO/NO-GO; owner approves protected merge, beta/stable tag, release, publish, or exception.

Do not infer independence merely because work is in separate conversations; preserve independent review and proof where applicable. Compress quiet/small-product execution while preserving discovery validation, risk-proportionate independent review, exact-candidate readiness, and post-release learning.
