# Self-Improvement Loop

Use this reference when the owner flags that something was done wrong, a delegated thread drifted, or the orchestrator identifies a repeatable process failure.

## Self-Improvement Loop

When a mistake is identified:

1. Stop and classify the failure.
2. Correct immediate local state if safe.
3. Identify the missing rule or gate.
4. Decide where the learning belongs.
5. Decide the stale-learning lifecycle outcome.
6. Add or update behavior audit coverage when the mistake is repeatable.
7. Do not leave important workflow lessons only in chat memory.

Before adding guidance, prefer tightening routing, replacing weak wording, consolidating duplicates, adding a deterministic check, or extending an eval. Add a new rule only when the behavior is missing and repeatable evidence justifies its token cost.

## Learning Placement

Place durable lessons where they can be enforced:

- `wp-portfolio-cto` skill: cross-product portfolio governance, product-thread health, release conflicts, and owner portfolio briefs.
- `wp-product-orchestrator` skill: one-product backlog, release-readiness, issue/PR intake, and delegation behavior.
- Shared reference: reusable protocol across skills or products.
- Repo `AGENTS.md`: repo-specific agent workflow, branch rules, validation gates.
- Repo `PRODUCT.md`, `ROADMAP.md`, or `RELEASE.md`: product truth, roadmap intent, release process.
- ADR: material architecture or product decision.
- GitHub issue: actionable product/engineering work.
- Automation memory: recurring audit/check-in learning that should be reused by automation.

## Closed Feedback And Outcome Lineage

For a repeatable correction or evidence-backed proactive pattern, preserve one compact chain:

`observation -> evidence -> decision -> action -> verification -> outcome -> durable artifact`

- Assign a stable pattern key that describes the failure or opportunity without copying product payloads.
- Keep source pointers, trust/privacy class, confidence, affected scope, and risk; aggregate the same pattern across products before adding another rule.
- Route ambiguous owner corrections and security/privacy findings to review instead of guessing the durable destination.
- An accepted learning needs decision, action, verifier, and artifact pointers plus a verification window. Issue creation, merge, release, or passing checks are delivery evidence, not outcome proof.
- Close the result as `met`, `missed`, `inconclusive`, or `not applicable`; keep it `pending` until the window can be evaluated.
- Promote product-specific learning to product docs/issues and cross-product learning to the owning shared skill, contract, runtime, harness, or private decision record. Never mutate a repository merely because a candidate was classified.

When the governed Agent Loop runtime is available, emit its compact learning-event contract and use the review-only candidate ledger. Otherwise preserve the same fields in the issue, PR, run record, or audit handoff; do not invent a parallel memory format.

## Stale Learning Lifecycle

When a prior learning, prompt line, memory note, repo-doc rule, or skill rule looks outdated, classify it before creating a new durable artifact:

- `Add`: new cross-project rule is missing and supported by repeated evidence.
- `Correct`: rule is still valid but needs a narrower source, base branch, validation gate, or wording.
- `Retire`: rule is obsolete, harmful, or contradicted by current source-of-truth evidence.
- `Supersede`: older memory or guidance remains historical but a newer repo doc, PR, issue, or skill rule is now authoritative.
- `Keep Watching`: evidence is suggestive but not strong enough for durable guidance.
- `Ignore`: one-off, project-specific, noisy, sensitive, or already handled elsewhere.

End every stale-learning audit item with an explicit outcome:

- `Fixed now`: corrected in the current run.
- `PR opened`: durable change proposed and linked.
- `Supersede note created`: old memory/guidance marked historical.
- `Detected only`: stale item found but current job cannot safely modify it.
- `Blocked`: exact access, dirty-worktree, branch/base, or owner-decision blocker.
- `Deferred`: evidence is real but another tracked issue/PR/thread owns the fix.

## Durable Artifact Dedupe

Before creating a memory note, repo-doc PR, skill PR, workflow prompt update, or recurring automation, check:

- Target note or existing supersede note.
- Target repo docs and current policy branch.
- Normalized rule slug or distinctive phrase.
- Normalized automation name, prompt intent, schedule, cwd/target, and active status.
- Open PRs and issues.
- Recently merged PRs and closed issues.
- Local branches that may contain unpublished docs work.
- Automation memory for same-day rollups or already-classified stale findings.
- Active automation definitions with the same normalized job, cadence, target, or prompt.

If a merged repo-doc PR already owns the behavior, report the older note as superseded or fixed instead of opening another PR. If a local checkout disagrees with live PR or branch evidence, fetch or treat live GitHub state as authoritative before concluding that docs are missing.

For recurring audits, keep one compact rollup per date and replace the current day block instead of appending duplicate same-day summaries.

For recurring automations, do not treat every active task with the same name as independent signal. Dedupe by normalized job purpose, schedule, target, prompt hash or distinctive prompt clauses, and memory path. If duplicates are active, run only the current task, avoid writing duplicate memory or PRs, and report the duplicate automation IDs for cleanup or use automation-management tools when the owner has authorized cleanup.

## Failure Classification

Use concrete labels:

- Source-of-truth drift.
- Missing GitHub issue-first intake.
- Missing branch/base proof.
- Delegation before strategy.
- Missing delegation after strategy.
- Delegation unavailable without tool discovery.
- Wrong app-managed worktree root or base.
- Setup-blocked polling loop.
- Stale active product thread.
- Blanket blocker from due date, release branch, or dirty primary checkout.
- Portfolio coverage drift.
- Portfolio execution drift.
- Product thread topology drift.
- Empty completed or `systemError` turn.
- Wrong model or reasoning allocation.
- Missing issue or PR proof.
- Repeated owner-instruction drift.
- Scope creep or over-engineering.
- Missing owner approval.
- Release train violation.
- Missing validation or live proof.
- Missing GitHub communication.
- Token waste from loading irrelevant references.
- Invented or unverified claim.
- Visual source inferred without inspection.
- Missing asset-generation or provenance contract.
- Owner correction fixed locally but not learned.
- Duplicate durable artifact.
- Duplicate recurring automation.
- Stale local-ref conclusion.
- Unclassified stale learning.
