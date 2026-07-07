# Product Queue Triage

Use this reference for GitHub issue/PR triage in WordPress repositories.

## Goal

Convert queue state into action: autonomous work, owner decisions, release blockers, or deferrals.

The product-thread objective is release readiness: keep advancing the next release train until it is ready for production/beta release approval with evidence.

## Product Heartbeat Execution Contract

Every product heartbeat compares previous `Next action` with queue state. Repeated executable work is not quiet state: execute it, delegate it, or return the exact blocker/tool failure.

`DONT_NOTIFY` is valid only when no eligible execution remains, or every issue/PR is owner-gated, blocked, failing, draft, wrong-base with recovery, or deliberately deferred.

Escalate to portfolio CTO when executable work stays unchanged for two heartbeats, or one heartbeat for merge-ready PRs or release blockers.

## Start With Repo State

Run checks:

```bash
git status --short --branch
git remote -v
git branch --show-current
git branch -a --list '*release*' '*hotfix*' '*support*' '*maintenance*' '*develop*'
gh repo view --json nameWithOwner,defaultBranchRef,url
```

Read policy: `AGENTS.md`, `PRODUCT.md`, `RELEASE.md`, `DESIGN.md`, optional `TESTING.md`/`PLAYGROUND.md`, changelog, `readme.txt`, labels, milestone data.

Ensure `owner:codex` and `owner:me` labels exist in each managed repo. Labels define ready state: `owner:codex` is ready for orchestrator/worker action; `owner:me` marks a question, but reversible non-release choices can be resolved and relabeled `owner:codex`.

## Queue Discovery

For the current repo:

```bash
gh issue list --state open --limit 100 --json number,title,labels,milestone,url
gh pr list --state open --limit 100 --json number,title,isDraft,mergeStateStatus,baseRefName,headRefName,labels,milestone,url
```

Batch GitHub reads. For routine heartbeats, retry once for the missing signal, then report `live check unavailable` and use local remote-tracking and repo evidence only for non-mutating summary. Do not create issues, relabel, merge, delegate, or decide readiness when owner labels/comments, milestones, PR state, or CI are not live-verified.

Inspect details before recommending action:

```bash
gh issue view <number-or-url> --json number,title,body,comments,labels,milestone,url
gh pr view <number-or-url> --json number,title,body,comments,reviews,files,statusCheckRollup,mergeStateStatus,baseRefName,headRefName,isDraft,url
```

Treat these as separate intake lanes:

- human contributor PRs,
- human-created issues,
- owner-created backlog issues,
- automation-created issues,
- bot/dependency PRs,
- release-train PRs.

## Issue Intake

User requests become GitHub issues first unless explicitly told not to. Product-idea issues require web research before filing. Competitor names may inform private research, but keep them out of public issue titles and bodies.

Owner-mentioned work is approved intake signal, not an owner-decision blocker. When `@mehul0810` names work or says to proceed, duplicate-screen, create/update the issue, assign `@mehul0810`, classify it, and prioritize into the nearest appropriate milestone or release train among the next three.

Do not blindly drain every issue in a milestone. Before implementation, define the milestone/release scope and priority set from evidence, roadmap, labels, blockers, impact, and risk. Use `rolling-milestone-triage.md`. If unclear, create a decision brief or ask before implementation.

A milestone-assigned issue/PR is ready unless it hits a production/beta release gate. `owner:me` is not a stall for reversible non-release choices: document rationale, relabel to `owner:codex`, and proceed/delegate. If `@mehul0810` answers a question and the item is relabeled `owner:codex`, resume when answered and relabeled `owner:codex` after reviewing the body, comments, and reviews. If the current milestone has no ready work, continue to the next milestone's ready work.

Before creating an issue:

- Search open issues, recently closed issues, open PRs, milestones, roadmap docs, product docs, and release docs.
- Avoid broad umbrella issues; prefer one issue per PR.
- Assign to `@mehul0810`.
- Reuse existing labels and milestones when evidence supports them; label ready backlog `owner:codex`.
- Include acceptance criteria, non-goals, branch/base, validation, proof needs, risk, model/reasoning, and owner decisions.
- Milestone work must use `release/<release-version>` as branch and PR base, where `<release-version>` is the version/milestone title, not the GitHub milestone ID or sequence number. If the milestone title is not a release version, infer only from repo release policy/source-of-truth evidence; otherwise ask or create a product-thread decision brief. Do not create `release/3` unless the documented release version is literally `3`. Use `develop` only for unmilestoned integration or as the verified source for creating missing milestone branches.
- If a wrong milestone-ID branch was created, preserve commits by replaying or reconciling them into the correct `release/<release-version>` branch, retarget open PRs, and do not delete the wrong branch without explicit owner approval.
- Missing milestone due dates or branch-policy gaps are not blanket blockers for owner-approved intake. Create/update the issue and recommend the milestone/order; escalate only missing metadata or unsafe ambiguity.
- Dirty or behind primary checkouts block direct edits, not fresh scoped worktree delegation from a clean upstream branch.
- If delegation is deferred, report the exact blocker: issue number, missing branch/base, missing owner decision, missing tool/project, or unsafe checkout state.

If no ready issue exists, create proactive review work from code/ecosystem signals for scalability, modularity, performance, maintainability, dependency/tooling, UX/docs, WordPress.org visibility, accessibility, sanitized hardening, or authority/growth. Also identify bugs, UX friction, docs gaps, ecosystem changes. Keep each issue bounded, assigned, labeled `owner:codex`, tied to the nearest milestone when supported, and classified as: blocker, near-term improvement, research-needed idea, or owner-gated strategic choice.

Security-sensitive findings must not become public issues and must not include exploit details, reproduction steps, or public `security issue` wording. Use sanitized hardening PRs with validation and minimal public detail.

For contributor/community PR courtesy, external issue courtesy, AI-friendly templates, and Playground preview hygiene, use `community-intake-hygiene.md`.

## Design Contract Intake

Create focused GitHub issues to add or adapt `DESIGN.md` when a design gap exists. Duplicate-screen, assign to `@mehul0810`, reuse labels/milestones when supported, and include validation plus branch/base plan.

## Dependency And Stale PR Triage

Check dependency/tooling and stale PRs.

- Do not merge Dependabot or dependency PRs directly into `main`.
- Consolidate relevant dependency/tooling updates into one duplicate-screened GitHub issue assigned to `@mehul0810` with labels/milestone where supported, validation, and branch/base plan.
- Prefer one planned tooling/dependency update issue/PR over scattered Dependabot PRs.
- Dependabot PRs should target the active development/release branch when supported; never accept GitHub default `main` without explicit release approval.
- For stale, superseded, wrong-base, abandoned, or release-misaligned PRs, close with a durable GitHub comment explaining why and link the replacement issue/PR when available.
- Do not close active owner-directed, release-critical, or ambiguous PRs without checking comments, reviews, labels, and milestones first.
- Routine status stays in chat; stale-PR closure comments are durable transitions.

## Adjacent Finding Triage

Use `adjacent-finding-protocol.md`. Do not blindly expand the current PR; duplicate-screen the finding and route it to issue, defer, or owner-gated triage.

## Classification

Classify each item:

- `Autonomous`: bounded, aligned with product docs, validation path, no sensitive decision.
- `Needs owner`: production/beta release action, unsafe milestone inference, or non-reversible product/security/privacy/API/schema/destructive/broad-positioning conflict. Ask clearly in the issue/PR and label `owner:me`; reversible non-release choices should be decided, documented, relabeled `owner:codex`, and continued.
- `Release blocker`: must land or be explicitly deferred before the target milestone/release.
- `Blocked`: missing access, failing environment, stale/conflicted branch, unknown base, unclear reproduction.
- `Defer/close`: duplicate, superseded, stale without evidence, support-only, or poor product fit.

## WordPress Product Signals

Raise priority for activation/upgrade/uninstall/rollback; admin lockout, capabilities, nonces, REST, data integrity; forms/email delivery; editor/frontend/accessibility/Core Web Vitals; WordPress.org compliance, release contents, dependencies, `readme.txt`, and hosted-plugin metadata including planning `Tested up to` WordPress 7.0; multisite, object cache, cron/background jobs, import/export, privacy export/erase, and hot paths.

Lower priority when the item is cosmetic without acceptance criteria, stale without reproduction, unsupported, or off-direction.

## Autonomous Work Loop

Work one item at a time:

1. Verify issue/PR details, milestone, labels, branch, and product fit.
2. Reproduce or establish root cause where feasible.
3. Choose the smallest enterprise-grade fix that preserves launched contracts.
4. Create/update branch from the correct release/default base.
5. Implement with the narrowest specialist lane: `wp-plugin-expert`, `wp-theme-expert`, `wp-site-expert`, `content-writer`, or `wp-contributor`; use `wp-expert` only when ambiguous.
6. Add/update tests when behavior risk warrants it.
7. Validate with syntax/lint/static/runtime/live proof appropriate to risk.
8. Commit focused changes; push/PR only if authorized.
9. Update PR/issue with proof when authorized.
10. Reconcile worker output, issue/PR state, screenshot/proof gaps, stale worktrees, temporary heartbeats, and adjacent findings.
11. Return local repo to a clean, expected branch state before selecting the next item.

## Release-Ready Notification

When the train is ready for owner approval, report:

- Merged PRs and included scope.
- Remaining open issues and why they are non-blocking or deferred.
- CI, package, build, lint, test, and live-proof validation.
- Release metadata match for target version: plugin header, readme stable tag/changelog, package metadata, release notes, and current Plugin Check.
- Readme/changelog audit: `Tested up to`, Requires WP/PHP if present, upgrade notice when applicable, feature descriptions, FAQ/screenshots/tags where relevant, and no overclaiming unmerged future milestone work.
- Docs, release notes, readme, WordPress.org, support, and Advanced View status.
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
