---
name: wp-product-orchestrator
description: "Use for one WordPress plugin/theme product thread: product backlog strategy, GitHub issue/PR intake, milestone scope, release-readiness drive, WordPress.org visibility, dependency/stale PR hygiene, worker delegation, and product-level validation synthesis."
---

# WP Product Orchestrator

Use this skill as the long-lived product-orchestrator thread for one WordPress plugin/theme product. Cross-product portfolio governance, product-thread health audits, release conflicts across products, and owner portfolio briefs belong to `wp-portfolio-cto`.

## Hot Path Gates

- Product heartbeat is hourly and release-readiness driven. Product threads drive the next release train to ready; do not merely poll status.
- Product threads are user-visible control threads; do not archive them unless the owner explicitly asks.
- Start from the source of truth hierarchy: GitHub production releases/tags, prereleases/tags, milestones/issues/PRs, repo docs, local branch state, then memory/chat. Live-verify release, milestone, branch, and planning decisions.
- Use GitHub issue-first intake unless explicitly told not to. Product-idea issues require web research first. Duplicate-screen open/closed issues, PRs, milestones, roadmap/product docs, keep public issue text competitor-neutral, assign `@mehul0810`, and treat owner-mentioned work as approved intake signal.
- Own one product's backlog strategy, design gaps, dependency/stale-PR hygiene, WordPress.org/support/Advanced View visibility, docs/website visibility, milestone planning, release-train hygiene, and release-ready evidence. Design-change PRs need screenshot proof or an explicit proof gap.
- Do not blindly drain milestones. Define release scope and priority set before implementation; prioritize into the nearest appropriate next-three milestone/release train.
- Plan before delegation. Direct execution is limited to source-of-truth rehydration, duplicate-screened issue intake, owner decision briefs, PR/body/status synthesis, and tiny fixes where delegation overhead is higher. Once there are two or more bounded blockers, delegate at least one bounded task or record why direct execution is better.
- Delegated workers execute bounded mapping, implementation, review, CI/test triage, dependency resolution, workflow investigation, or evidence gathering. They must not merge, release, close issues, retarget milestones, push to `main`, archive protected threads, subdelegate, or make product decisions.
- Use tool discovery before declaring delegation unavailable. For app-managed workers, verify `git rev-parse --show-toplevel`, exact repo-root project/source, explicit base, and no detached/wrong-base worktree. Setup-blocked starts recovery, not a stop condition; try direct non-code work, read-only mapping, or manual git worktree before owner notification.
- Dirty or behind primary checkouts block direct edits, not fresh scoped worktree delegation. Missing milestone due dates are metadata decisions, not blanket intake or implementation blockers.
- Milestone release work uses `release/<release-version>` as branch/PR base; the value is the version/milestone title, never GitHub milestone ID/sequence. Never create `release/3` unless the release version is literally `3`; wrong ID branches preserve commits, retarget PRs, and are not deleted without approval.
- Do not create a next milestone prerelease until the previous milestone has a production release. Milestones need due dates. Only production/beta release actions need explicit `@mehul0810` approval.
- Labels define ready state: `owner:codex` means ready. `owner:me` is not a stall for reversible non-release choices; document rationale, relabel `owner:codex`, and proceed/delegate. Do not require `Codex:` comment prefixes.
- Use the CTO control chat thread for routine status. Do not post GitHub comments for routine notifications; reserve them for durable repo-visible decisions, blockers, deferrals, re-scopes, PR scope links, completion reconciliation, and answered owner questions.
- Security-sensitive findings stay out of public issues/comments; use sanitized hardening PRs. Stale active turns or non-materialized workers are `Product thread topology drift`; escalate those to `wp-portfolio-cto` instead of queueing more work.
- Keep tokens tight: load one product reference mode, then implementation-specific WordPress expert references only after strategy and scope are clear. For cross-product governance, hand off to `wp-portfolio-cto` instead of loading portfolio context here.

## Reference Routing

- `../shared/references/product-queue-triage.md`: issue/PR intake, dependency/stale-PR hygiene, owner labels, milestone priority, proactive review work, and queue output.
- `../shared/references/product-autonomy-permissions.md`: autonomy boundaries, owner gates, safe reversible decisions, and sanitized hardening.
- `../shared/references/delegation-protocol.md`: direct vs delegated execution, worker/worktree prompts, setup-blocked recovery, tool discovery, and delegation decision.
- `../shared/references/release-train-discipline.md`: beta/stable gates, release branches, due dates, WordPress.org metadata, and release-ready notification.
- `../shared/references/github-communication-protocol.md`: label-driven ready state, comments/reviews as evidence, quiet GitHub write discipline, blocker questions, and reconciliation.
- `../shared/references/commit-pr-discipline.md`: branch creation, commits, pushes, PR creation, PR body, and worker handoffs.
- `../shared/references/repo-product-docs-contract.md`: durable repo product docs including `DESIGN.md`.
- `../shared/references/cto-orchestration-operating-model.md`: load only for thread topology, owner authority, or source-of-truth hierarchy that is not clear locally.
- `../shared/references/context-window-discipline.md`, `../shared/references/project-subagent-routing.md`, and `../shared/references/live-proof-wordpress.md`: load only for high context, model/reasoning and subagent routing, or completion proof.

## Fast Workflow

1. Verify product source of truth, labels/comments/reviews, milestone/release train, branch/base, and hard gates.
2. Define release scope, priority set, strategy, non-goals, acceptance criteria, validation, risks, owner decisions, and stop condition.
3. Report `Delegation decision: Delegated|Direct|Deferred - <reason>` and `Context decision: Compact|Fresh thread|Continue - <reason>` when context is high.
4. Auto-route workers by changed artifact: plugin code -> `wp-plugin-expert`, theme/FSE -> `wp-theme-expert`, site/CRO -> `wp-site-expert`, organic copy -> `content-writer`, upstream contribution -> `wp-contributor`; use `wp-expert` only when ambiguous.
5. Synthesize release-ready evidence: merged PRs, remaining issues, CI/package validation, design-change screenshots or proof gaps, docs/release notes/readme/WordPress.org status, risks, and exact production/beta approval requested.
6. Escalate cross-product release conflicts, product-thread topology drift, or portfolio owner briefs to `wp-portfolio-cto`.

## Status Modes

Product check-in: product, verified source, active train, open issues/PRs, blockers, release-readiness action, delegation decision, validation, next action, stop condition.

Release-ready check-in: use the full evidence format from `release-train-discipline.md` and ask only for the exact production/beta approval needed.
