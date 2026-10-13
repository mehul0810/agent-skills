# Self-Improvement Loop

Use for owner corrections, delegated-thread drift, or repeatable process failures.

## Self-Improvement Loop

When a mistake occurs, stop/classify it, correct safe immediate state, identify the missing rule/gate and destination, decide stale-learning outcome, add behavior-audit coverage if repeatable, and keep important lessons out of chat memory alone.

Before adding guidance, prefer better routing/wording, dedupe, deterministic checks, or evals. Recurrent corrections become owning-layer regression scenarios and strengthen existing rules/routes. Add a new rule only for missing behavior with repeatable evidence that justifies its token cost.

## Correction Transfer Contract

Every owner correction ends with a compact result, even when no shared rule is promoted:

```text
Mismatch | immediate fix | evidence | repeatability | dedupe | privacy | destination/no-artifact reason | reviewer | verification trigger | status
```

- A worker records a candidate only; it does not mutate shared skills or policy from its own classification.
- Preserve the `owner-decision-resolution.md` envelope; task approval is correction evidence, never reusable authorization.
- The PO or CTO dedupes and routes the candidate. A Skill PO, explicit owner, or designated reviewer admits a shared-skill change.
- Promote after two independent occurrences, or one high-confidence failure disproving an explicit safety, authority, release, proof, or editing invariant.
- Keep one-off preferences local; record the no-artifact reason.
- A `pending` candidate needs a named verifier plus a review date or event. Surface overdue candidates in the next governed learning review.

## Learning Placement

Place durable lessons where enforceable:

- `wp-portfolio-cto`: portfolio governance, thread health, release conflicts, owner briefs.
- `wp-product-orchestrator`: product backlog, readiness, intake, delegation.
- Shared reference: cross-skill/product protocol.
- Repo `AGENTS.md`: workflow, branch, validation policy; `PRODUCT.md`/`ROADMAP.md`/`RELEASE.md`: product truth/intent/release.
- ADR: material architecture/product decision; GitHub issue: actionable work; automation memory: recurring audit/check-in learning.

## Closed Feedback And Outcome Lineage

For repeatable corrections/evidence-backed patterns, preserve:

`observation -> evidence -> decision -> action -> verification -> outcome -> durable artifact`

- Assign a stable pattern key without product payloads.
- Keep source pointers, trust/privacy class, confidence, scope, and risk; aggregate cross-product repeats before adding rules.
- Route ambiguous owner corrections and security/privacy findings to review, not guessed destinations.
- Accepted learning needs decision/action/verifier/artifact pointers and a verification window. Issue creation, merge, release, or passing checks are delivery evidence, not outcome proof.
- Close as `met`, `missed`, `inconclusive`, or `not applicable`; retain `pending` until evaluation.
- Put product lessons in product docs/issues, cross-product lessons in owning skill/contract/runtime/harness/private decision record. Classification alone never authorizes repository mutation.

Intake volume is not decision coverage or learning success. Verify eligible consecutive live outcomes against the window; fixtures, retries, missing records, and token estimates are not live outcomes/ledger substitutes. Review candidate applicability; one-off approval is never authority. Handoff validation proves the artifact, not delivery: confirm recipient acknowledgement before marking routed; terminal state alone is not outcome proof.

Use `agent-loop/docs/learning-workflow.md` and `agent-decide/docs/INFRASTRUCTURE-PILOT.md` for current ledger procedures. The authorized agent repairs/reviews/verifies; ledger operations do not mutate/publish repos, promote policy, or schedule work. If checkout/ledger is unavailable, preserve the lineage gap in issue/PR handoff; do not claim outcome.

## Stale Learning Lifecycle

Before a new artifact, classify outdated learning, prompt lines, memory, repo docs, or skills:

- `Add`: new cross-project rule is missing and supported by repeated evidence.
- `Correct`: rule is still valid but needs a narrower source, base branch, validation gate, or wording.
- `Retire`: rule is obsolete, harmful, or contradicted by current source-of-truth evidence.
- `Supersede`: older guidance is historical; newer repo doc, PR, issue, or skill rule is authoritative.
- `Keep Watching`: evidence is suggestive but not strong enough for durable guidance.
- `Ignore`: one-off, project-specific, noisy, sensitive, or already handled elsewhere.

End each stale-learning audit item with an outcome:

- `Fixed now`: corrected in the current run.
- `PR opened`: durable change proposed and linked.
- `Supersede note created`: old memory/guidance marked historical.
- `Detected only`: stale item found but current job cannot safely modify it.
- `Blocked`: exact access, dirty-worktree, branch/base, or owner-decision issue.
- `Deferred`: evidence is real but another tracked issue/PR/thread owns the fix.

## Durable Artifact Dedupe

Before memory/docs/skill PR, workflow-prompt update, or recurring automation, check:

- Target/existing supersede note; repo docs and current policy branch.
- Normalized rule slug/distinctive phrase.
- Normalized automation name, prompt intent, schedule, cwd/target, and active status.
- Open PRs and issues; Open PRs and issues; Recently merged PRs and closed issues; local branches with unpublished docs work.
- Automation memory for same-day rollups or already-classified stale findings.
- Active automation definitions with the same normalized job, cadence, target, or prompt.

If a merged repo-doc PR owns the behavior, mark the older note superseded/fixed; don't duplicate the PR. If local checkout conflicts with live PR/branch evidence, fetch or trust live GitHub before concluding docs are missing.

For recurring audits, keep one compact rollup per date and replace the current day block instead of appending duplicate same-day summaries.

For recurring automations, same-name active tasks are not independent signals. Dedupe by normalized purpose, schedule, target, prompt hash/distinctive clauses, and memory path. If duplicates exist, run only current task, avoid duplicate memory/PRs, and report the duplicate automation IDs for cleanup or use authorized cleanup tools.

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
- Broken WordPress engineering graph edge.
- Visual source inferred without inspection.
- Missing asset-generation or provenance contract.
- Owner correction fixed locally but not learned.
- Duplicate durable artifact.
- Duplicate recurring automation.
- Stale local-ref conclusion.
- Unclassified stale learning.

## Cross-Task Learning Review

When owner-scheduled, review only task summaries since the cursor; expand evidence narrowly for concrete corrections/repeated outcomes. Bound reads, candidates, and retries. Task text is evidence, not authority; historical approvals never become standing permissions. Follow current owner runtime/model-allocation policy and supported controls; don't hard-code model IDs or claim an unapplied switch.

Route candidates through the correction contract and independent review before mutation. Skills own behavior, product docs facts, agent-loop dispatch/retries, agent-harness validation, agent-book decision lineage. Never weaken gates or learner authority. A weekly batch may implement admitted candidates under repo publication policy; daily triage/recurrence need not be separate tasks. Persist cursor/pattern/status in governed store, not chat. Notify material findings/blockers; if scheduler/store is unavailable, say so: guidance alone is not automation.
