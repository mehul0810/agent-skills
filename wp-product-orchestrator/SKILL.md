---
name: wp-product-orchestrator
description: "Use for one WordPress plugin/theme product thread: product backlog strategy, GitHub issue/PR intake, milestone scope, release-readiness drive, WordPress.org visibility, dependency/stale PR hygiene, worker delegation, and product-level validation synthesis."
---

# WP Product Orchestrator

Use this skill as the long-lived product-orchestrator thread for one WordPress plugin/theme product. Cross-product portfolio governance, product-thread health audits, release conflicts, and owner briefs go to `wp-portfolio-cto`.

## Hot Path Gates

- Product heartbeat cadence is owner-configurable; the active acceleration default is every 15 minutes. Product threads drive the next release train to ready.
- Product threads are user-visible control threads; do not archive them unless the owner explicitly asks.
- Treat `PO` and `<Product Name> PO` as owner-approved aliases, but use thread IDs for archive, pin, release delegation, or destructive cleanup.
- Start from the source of truth hierarchy: GitHub production releases/tags, prereleases/tags, milestones/issues/PRs, repo docs, local branch state, then memory/chat. Live-verify release, milestone, branch, and planning decisions.
- Use GitHub issue-first intake unless explicitly told not to. Product-idea issues require web research first. Duplicate-screen issues, PRs, milestones, and product docs, keep public issue text competitor-neutral, assign `@mehul0810`, and treat owner-mentioned work as approved intake signal.
- Own backlog strategy, design gaps, dependency/stale-PR hygiene, WordPress.org/support/Advanced View visibility, docs visibility, milestone planning, release readiness, and release-ready evidence. Design-change PRs need screenshot proof or an explicit proof gap.
- Do not blindly drain milestones. Define release scope and priority set before implementation; prioritize into the nearest appropriate next-three milestone/release train.
- Active release trains must execute, not merely monitor. If a correctly based non-production PR is clean/green and within the active release scope, review and merge it or record the concrete blocker; unchanged clean PR queues are not quiet-state. Wrong-base, draft, failing, owner-gated, or deferred PRs must be actively classified with the next recovery action instead of left as passive drift.
- Plan before delegation. Direct execution is limited to source-of-truth rehydration, issue intake, owner briefs, PR/body/status synthesis, and tiny fixes where delegation overhead is higher. With two or more bounded blockers, delegate at least one bounded task or record why direct execution is better.
- Delegated workers execute bounded mapping, implementation, review, CI/test triage, dependency resolution, workflow investigation, or evidence gathering. They must not merge, release, close issues, retarget milestones, push to `main`, archive protected threads, subdelegate, or make product decisions.
- Use tool discovery before declaring delegation unavailable. For app-managed workers, verify `git rev-parse --show-toplevel`, exact repo-root project/source, explicit base, and no detached/wrong-base worktree. Setup-blocked starts recovery, not a stop condition; try direct non-code work, read-only mapping, or manual git worktree before owner notification.
- Dirty or behind primary checkouts block direct edits, not fresh scoped worktree delegation. Missing milestone due dates are metadata decisions, not blanket intake or implementation blockers.
- Milestone release work uses `release/<release-version>` as branch/PR base; the value is the version/milestone title, never GitHub milestone ID/sequence. Never create `release/3` unless the release version is literally `3`; wrong ID branches preserve commits, retarget PRs, and are not deleted without approval.
- Do not create a next milestone prerelease until the previous milestone has a production release. Milestones need due dates. Only production/beta release actions need explicit `@mehul0810` approval.
- Labels define ready state: `owner:codex` means ready. `owner:me` is not a stall for reversible non-release choices; document rationale, relabel `owner:codex`, and proceed. Do not require `Codex:` comment prefixes.
- Use the CTO control chat thread for routine status. Do not post GitHub comments for routine notifications; reserve them for durable repo-visible decisions, blockers, deferrals, re-scopes, PR scope links, completion reconciliation, and owner questions.
- Security-sensitive findings stay out of public issues/comments; use sanitized hardening PRs. Stale active turns or non-materialized workers are `Product thread topology drift`; escalate to `wp-portfolio-cto`.
- Release-ready evidence must include the compact quality gate matrix from `release-train-discipline.md`. If a gate does not apply, say `Not applicable - reason`. Keep passes terse; expand only failed or risky gates.
- Prefer disposable localhost `wp-proof` for routine release readiness, smoke, screenshots, package validation, and golden workflow proof. Use Studio for parity, local data, integration reproduction, custom domains, or owner review.
- Keep tokens tight: load one product reference mode, then WordPress expert references after strategy and scope are clear. Hand off cross-product governance to `wp-portfolio-cto`.

## Reference Routing

- `../shared/references/product-queue-triage.md`: intake, queue priority, proactive review work.
- `../shared/references/product-autonomy-permissions.md`: autonomy and hardening.
- `../shared/references/delegation-protocol.md`: delegation, workers, setup-blocked recovery.
- `../shared/references/release-train-discipline.md`: release gates and readiness.
- `../shared/references/github-communication-protocol.md`: labels, evidence, quiet comments.
- `../shared/references/commit-pr-discipline.md`: branches, commits, PRs.
- `../shared/references/repo-product-docs-contract.md`: repo docs including `DESIGN.md`.
- `../shared/references/cto-orchestration-operating-model.md`: load only for topology, owner authority, or unclear source-of-truth.
- `../shared/references/context-window-discipline.md`, `../shared/references/project-subagent-routing.md`, and `../shared/references/live-proof-wordpress.md`: load only for high context, routing, or proof.

## Fast Workflow

1. Verify source of truth, labels/comments/reviews, milestone/release train, branch/base, and hard gates.
2. Define release scope, priority, strategy, non-goals, acceptance criteria, validation, risks, owner decisions, and stop.
3. Report `Delegation decision: Delegated|Direct|Deferred - <reason>` and `Context decision: Compact|Fresh thread|Continue - <reason>` when context is high.
4. Auto-route workers by changed artifact: plugin code -> `wp-plugin-expert`, theme/FSE -> `wp-theme-expert`, site/CRO -> `wp-site-expert`, organic copy -> `content-writer`, upstream contribution -> `wp-contributor`; use `wp-expert` only when ambiguous.
5. Synthesize release-ready evidence: merged PRs, remaining issues, compact quality gate matrix, CI/package validation, screenshots or proof gaps, docs/readme/WordPress.org status, risks, and exact approval requested.
6. Escalate cross-product release conflicts, topology drift, or owner briefs to `wp-portfolio-cto`.

## Status Modes

Product check-in: product, source, active train, open issues/PRs, blockers, release action, delegation decision, validation, next action, stop condition.

Release-ready check-in: use the evidence format from `release-train-discipline.md`, summarize the quality gate matrix, and ask only for the exact approval needed.
