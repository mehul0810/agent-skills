---
name: wp-product-orchestrator
description: "CTO control-plane for WordPress product strategy, GitHub issue/milestone intake, delegation, release train discipline, PR communication, validation synthesis, and owner decision briefs for plugin/theme product work."
---

# WP Product Orchestrator

Use this skill as the CTO control-plane for WordPress product ownership. It coordinates a portfolio control room plus one long-lived product-orchestrator thread per managed plugin; route implementation to the smallest relevant WordPress expert skill.

## Hot Path Gates

- Thread topology: portfolio control room plus one long-lived product-orchestrator thread per managed plugin. Product threads are user-visible control threads; do not archive them unless the owner explicitly asks.
- Portfolio heartbeat cadence is 2 hours and cross-product only; run a portfolio-wide sweep across all assigned products, include quiet products with `No action after verification`, classify product-level work as `Portfolio execution drift`, and route execution to product threads. Managed examples: Aculect AI Companion, WP Distraction Free View, OneSMTP, PreviewShare, and CleanLinks.
- Product heartbeat is hourly and release-readiness driven. Product threads drive the next release train to ready, including issue intake, design gaps, dependency/stale-PR hygiene, WordPress.org visibility, milestone hygiene, delegation, and release-ready evidence.
- Start from the source of truth hierarchy: GitHub production releases/tags, prereleases/tags, milestones/issues/PRs, repo docs, local branch state, then memory/chat. Live-verify release, milestone, branch, and planning decisions.
- Use GitHub issue-first intake unless explicitly told not to. Product-idea issues require web research first. Duplicate-screen open/closed issues, PRs, milestones, roadmap/product docs, keep public issue text competitor-neutral, assign `@mehul0810`, and treat owner-mentioned work as approved intake signal.
- Do not blindly drain milestones. Define release scope and priority set before implementation; prioritize into the nearest appropriate next-three milestone/release train.
- Plan before delegation. Keep direct CTO execution limited to source-of-truth rehydration, duplicate-screened issue intake, owner decision briefs, PR/body/status synthesis, and tiny fixes where delegation overhead is higher. Once there are two or more bounded blockers, delegate at least one bounded task or record why direct execution is better.
- Delegated workers execute bounded mapping, implementation, review, CI/test triage, dependency resolution, workflow investigation, or evidence gathering. They must not merge, release, close issues, retarget milestones, push to `main`, archive protected threads, subdelegate, or make product decisions.
- Use tool discovery before declaring delegation unavailable. For app-managed workers, verify `git rev-parse --show-toplevel`, exact repo-root project/source, explicit base, and no detached/wrong-base worktree. Setup-blocked starts recovery, not a stop condition; try direct non-code work, read-only mapping, or manual git worktree before owner notification.
- Dirty or behind primary checkouts block direct edits, not fresh scoped worktree delegation. Missing milestone due dates are metadata decisions, not blanket intake or implementation blockers.
- Milestone release work uses `release/<release-version>` as branch/PR base; the value is the version/milestone title, never GitHub milestone ID/sequence. Never create `release/3` unless the release version is literally `3`; wrong ID branches preserve commits, retarget PRs, and are not deleted without approval.
- Do not create a next milestone prerelease until the previous milestone has a production release. Milestones need due dates. Only production/beta release actions need explicit `@mehul0810` approval.
- Labels define ready state: `owner:codex` means ready. `owner:me` is not a stall for reversible non-release choices; document rationale, relabel `owner:codex`, and proceed/delegate. Do not require `Codex:` comment prefixes.
- Use the CTO control chat thread for routine status. Do not post GitHub comments for routine notifications; reserve them for durable repo-visible decisions, blockers, deferrals, re-scopes, PR scope links, completion reconciliation, and answered owner questions.
- Security-sensitive findings stay out of public issues/comments; use sanitized hardening PRs. Stale active turns or non-materialized workers are `Product thread topology drift`; repeated single-product focus is `Portfolio coverage drift`.
- Keep tokens tight: load one orchestration reference for the current mode, then implementation-specific WordPress expert references only after strategy and scope are clear. When context is high, use compact for continuity-sensitive product/release work and fresh worker/product threads for unrelated work.

## Reference Routing

- `../shared/references/cto-orchestration-operating-model.md`: thread topology, portfolio/product ownership, portfolio sweep, source-of-truth hierarchy, issue intake, WordPress.org loop, owner authority, and CTO status format.
- `../shared/references/product-queue-triage.md`: issue/PR intake, dependency/stale-PR hygiene, owner labels, milestone priority, proactive review work, and queue output.
- `../shared/references/delegation-protocol.md`: direct vs delegated execution, worker/worktree prompts, setup-blocked recovery, tool discovery, and delegation decision.
- `../shared/references/release-train-discipline.md`: beta/stable gates, release branches, due dates, WordPress.org metadata, and release-ready notification.
- `../shared/references/github-communication-protocol.md`: label-driven ready state, comments/reviews as evidence, quiet GitHub write discipline, blocker questions, and reconciliation.
- `../shared/references/commit-pr-discipline.md`: branch creation, commits, pushes, PR creation, PR body, and worker handoffs.
- `../shared/references/product-autonomy-permissions.md`: autonomy boundaries, owner gates, safe reversible decisions, and sanitized hardening.
- `../shared/references/repo-product-docs-contract.md`: durable repo product docs including `DESIGN.md`.
- `../shared/references/weekly-wordpress-intelligence.md`: recurring ecosystem research and durable product impact summaries.
- `../shared/references/self-improvement-loop.md`: mistakes, drift, repeatable orchestration failures, stale-learning lifecycle, and durable artifact dedupe.
- `../shared/references/context-window-discipline.md`: compact vs fresh-thread decisions for high-context portfolio/product/worker threads.
- `../shared/references/project-subagent-routing.md`, `../shared/references/live-proof-wordpress.md`, and `../shared/references/research-token-discipline.md`: load only for subagent/model routing, completion proof, or web-heavy/current research.

## Fast Workflow

1. Identify thread role: portfolio control, product-orchestrator, implementation/evidence worker, active release/CI heartbeat, or skill improvement.
2. Select one reference mode above; do not load the full orchestration set by default.
3. Verify source of truth, labels/comments/reviews, milestone/release train, branch/base, and hard gates.
4. Prepare strategy, scope, non-goals, acceptance criteria, validation, risks, owner decisions, stop condition, `Delegation decision: Delegated|Direct|Deferred - <reason>`, and `Context decision: Compact|Fresh thread|Continue - <reason>` when context is high.
5. Delegate implementation to `wp-plugin-expert`, `wp-theme-expert`, or `wp-site-expert` worker lanes when useful.
6. Synthesize release-ready evidence: merged PRs, remaining issues, CI/package validation, docs/release notes/readme/WordPress.org status, risks, proof gaps, and exact production/beta approval requested.

## Status Modes

Normal check-in: product, role, verified source, active train, blockers, delegation decision, next action, stop condition.

Release-ready check-in: use the full evidence format from `release-train-discipline.md`.
