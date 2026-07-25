# Product Queue Triage

Use this reference for GitHub issue/PR triage in WordPress repositories.

## Goal

Convert queue state into autonomous work, decisions, blockers, or deferrals.

The product-thread objective is release readiness: keep advancing the next release train to approval.

## Product Heartbeat Execution Contract

Each heartbeat compares prior `Next action` with queue state. Repeated executable work must execute, delegate, or name the blocker.

`DONT_NOTIFY` is valid only when no eligible execution remains, or every issue/PR is owner-gated, blocked, failing, draft, wrong-base with recovery, or deliberately deferred.

Escalate to portfolio CTO when executable work stays unchanged for two heartbeats, or one heartbeat for merge-ready PRs or release blockers.

## Start With Repo State

Run:

```bash
git status --short --branch
git remote -v
git branch --show-current
git branch -a --list '*release*' '*hotfix*' '*support*' '*maintenance*' '*develop*'
gh repo view --json nameWithOwner,defaultBranchRef,url
```

Read applicable repo policy/docs, changelog/`readme.txt`, labels, and milestones.

Ensure `owner:codex` and `owner:me` labels exist in each managed repo. Labels define ready state: `owner:codex` is ready for orchestrator/worker action; `owner:me` marks a question, but reversible non-release choices can be resolved and relabeled `owner:codex`.

## Queue Discovery

For the repo:

```bash
gh issue list --state open --limit 100 --json number,title,labels,milestone,url
gh pr list --state open --limit 100 --json number,title,isDraft,mergeStateStatus,baseRefName,headRefName,labels,milestone,url
```

Batch normal reads. Retry once for the missing signal, then report `live check unavailable` and use local remote-tracking and repo evidence only for non-mutating summary. Do not create issues, relabel, merge, delegate, or decide readiness without live labels/comments/milestones/PR/CI.

Inspect details before recommending action:

```bash
gh issue view <number-or-url> --json number,title,body,comments,labels,milestone,url
gh pr view <number-or-url> --json number,title,body,comments,reviews,files,statusCheckRollup,mergeStateStatus,baseRefName,headRefName,isDraft,url
```

Separate human PR/issues, owner/automation issues, bot/dependency PRs, and release PRs.

## Issue Intake

User requests become GitHub issues first unless explicitly told not to. Product-idea issues require web research first. Competitor names may inform private research, but keep them out of public issue titles and bodies.

Owner-mentioned work is approved intake signal, not an owner-decision blocker. When `@mehul0810` names work or says to proceed, duplicate-screen, create/update the issue, assign `@mehul0810`, and prioritize it into the nearest appropriate milestone or release train among the next three.

Do not blindly drain every issue in a milestone. Before implementation, define the milestone/release scope and priority set from evidence, impact, and risk using `rolling-milestone-triage.md`; brief ambiguity.

A milestone-assigned issue/PR is ready unless it hits a production/beta release gate. `owner:me` is not a stall for reversible non-release choices: document rationale, relabel to `owner:codex`, and proceed/delegate. If `@mehul0810` answers, resume when answered and relabeled `owner:codex` after reviewing body/comments/reviews. If the current milestone has no ready work, continue to the next milestone's ready work.

Before creating an issue:

- Search open/recent issues, PRs, milestones, roadmap/product/release docs.
- Avoid broad umbrella issues; prefer one issue per PR.
- Assign to `@mehul0810`.
- Reuse supported labels/milestones; label ready work `owner:codex`.
- Include acceptance criteria, non-goals, branch/base, validation, proof needs, risk, model/reasoning, and owner decisions.
- Milestone work must use `release/<release-version>` as branch and PR base, where `<release-version>` is the version/milestone title, not the GitHub milestone ID or sequence number. If the title is not a release version, infer from repo policy/source-of-truth evidence or ask. Use `develop` only for unmilestoned integration or creating missing milestone branches.
- If a wrong milestone-ID branch was created, preserve commits by replaying or reconciling them into the correct `release/<release-version>` branch, retarget open PRs, and do not delete the wrong branch without explicit owner approval.
- Missing milestone due dates or branch-policy gaps are not blanket blockers for owner-approved intake. Create/update and recommend order; escalate only unsafe ambiguity.
- Dirty or behind primary checkouts block direct edits, not fresh scoped worktree delegation from a clean upstream branch.
- If delegation is deferred, report the exact blocker: issue number, missing branch/base, missing owner decision, missing tool/project, or unsafe checkout state.

If none is ready, create proactive review work for scalability, modularity, performance, maintainability, tooling, UX/docs, WordPress.org, accessibility, sanitized hardening, or authority/growth. Keep it PR-sized and classify as blocker, near-term improvement, research-needed idea, or owner-gated strategic choice.

Convert real discoveries into issues unless they are safely fixed inside the current PR scope. Duplicate-screen first, then create a focused issue with observed symptom, why it matters, suspected source, affected files/surfaces, acceptance criteria, validation/proof expectation, risk, and whether docs need updating.

Security-sensitive findings must not become public issues and must not include exploit details, reproduction steps, or public `security issue` wording. Use sanitized hardening PRs with validation and minimal public detail.

Use `community-intake-hygiene.md` for contributor PR courtesy, external issue courtesy, AI-friendly templates, and Playground hygiene.

## Design Contract Intake

Create focused GitHub issues to add or adapt `DESIGN.md` for real design gaps; duplicate-screen, assign, classify, and include branch/base.

For premium/enterprise or AI/workflow surfaces, use `enterprise-design-judgment.md`. State accountable role, control/proof gap, failure behavior, and screenshot evidence.

## Dependency And Stale PR Triage

Check dependency/tooling and stale PRs.

- Do not merge Dependabot or dependency PRs directly into `main`.
- Consolidate relevant dependency/tooling updates into one duplicate-screened GitHub issue assigned to `@mehul0810`, with supported metadata, validation, and branch/base.
- Prefer one planned tooling/dependency update issue/PR over scattered Dependabot PRs.
- Dependabot PRs should target the active development/release branch when supported; never accept GitHub default `main` without explicit release approval.
- For stale, superseded, wrong-base, abandoned, or release-misaligned PRs, close with a durable GitHub comment and link the replacement issue/PR when available.
- Do not close active owner-directed or release-critical PRs without checking comments, reviews, labels, and milestones first.
- Routine status stays in chat; stale-PR closure comments are durable transitions.

## Adjacent Finding Triage

Use `adjacent-finding-protocol.md`. Do not blindly expand the current PR; duplicate-screen the finding and route it to issue, existing issue, defer, or owner-gated triage. If fixed safely inside scope, mention it in PR summary/validation and update product docs only when it teaches a reusable repo-specific rule.

## Classification

Classify each item:

- `Autonomous`: bounded, aligned, provable, no sensitive decision.
- `Needs owner`: production/beta release action, unsafe milestone inference, or non-reversible product/security/privacy/API/schema/destructive/broad-positioning conflict. Ask clearly in the issue/PR and label `owner:me`; reversible non-release choices should be decided, documented, relabeled `owner:codex`, and continued.
- `Release blocker`: must land or be explicitly deferred.
- `Blocked`: missing access, bad environment/branch/base, unclear reproduction.
- `Defer/close`: duplicate, superseded, stale without evidence, support-only, or poor product fit.

## WordPress Product Signals

Prioritize lifecycle/rollback, auth/data integrity, delivery, editor/frontend/accessibility/performance, WordPress.org/package/dependencies/`readme.txt` and a live-verified `Tested up to` target, multisite/cache/jobs/import/privacy, and hot paths.

Lower priority when the item is cosmetic without acceptance criteria, stale without reproduction, unsupported, or off-direction.

## Autonomous Work Loop

Work one item at a time: verify entity/metadata/base; reproduce/root-cause; choose the smallest contract-safe fix; use the narrow specialist; test and prove by risk; commit/push/PR only as authorized; reconcile GitHub, screenshots/gaps, worktrees, heartbeats, and adjacent findings; leave a clean expected checkout.

## Release-Ready Notification

When the train is ready for owner approval, report:

- Merged PRs and included scope.
- Remaining open issues and why they are non-blocking or deferred.
- CI/package/build/lint/test/live proof.
- Release metadata match for target version: plugin header, readme stable tag/changelog, package metadata, release notes, and current Plugin Check.
- Readme/changelog audit: compatibility fields, upgrade notice, feature/FAQ/assets/tags, no future-work claims.
- Docs/release notes/WordPress.org/support/Advanced View status.
- Risks, rollback notes, and unresolved proof gaps.
- Exact approval requested: production or beta release target/version.

## Owner-Facing Triage Output

Use this format:

```text
Autonomous candidates
- <url> <title>: why it qualifies; validation needed; risk.

Needs owner
- <url> <title>: exact decision/access needed; recommendation.

Release blockers
- <url> <title>: target milestone/base branch; must land/defer reason.

Defer/close
- <url> <title>: duplicate/superseded/stale reason; suggested action.
```

For implementation-ready items, include the intended base branch and whether a release branch was found from the milestone. Include canonical URLs.
