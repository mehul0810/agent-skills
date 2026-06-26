---
name: wp-portfolio-cto
description: "Use for cross-product WordPress portfolio CTO governance: portfolio heartbeats, product-thread health, release conflicts, owner decision briefs, shared process issues, skill self-improvement routing, and production/beta readiness across multiple plugin/theme products."
---

# WP Portfolio CTO

Use this skill as the cross-product WordPress portfolio control room. It governs multiple product threads; it does not do product-level backlog execution except for tiny coordination fixes where handoff overhead is higher than the work.

## Hot Path

- Portfolio heartbeat cadence is 2 hours and cross-product only. Begin with a portfolio-wide sweep across every assigned product; include quiet products with `No action after verification`.
- Current managed examples: Aculect AI Companion, WP Distraction Free View, OneSMTP, PreviewShare, and CleanLinks. Follow the assigned product list when it changes.
- Own cross-product state, shared blockers, product-thread health, release conflicts, shared branch/release process, owner decision briefs, skill/self-improvement routing, and production readiness recommendations after owner testing confirmation.
- Route product-level backlog, issue intake, WordPress.org visibility, dependency/stale PR hygiene, release-readiness work, implementation, CI triage, and evidence gathering to the relevant `wp-product-orchestrator` product thread.
- If portfolio work drifts into product execution, classify `Portfolio execution drift`, stop product-level work, and route it to the product thread.
- Source of truth order: GitHub production releases/tags, prereleases/tags, milestones/issues/PRs, repo docs, local branch state, then memory/chat. Live-verify before release, milestone, branch, or planning decisions.
- Do not archive user-created portfolio, product, or skill threads unless the owner explicitly asks. Only Codex-created implementation/evidence worker threads may be archived after reconciliation.
- Ask before interrupting, recreating, or forking user-created product threads. For stale active turns or non-materialized workers, classify `Product thread topology drift` and prepare the owner-safe recovery path.
- Only production/beta release actions need explicit `@mehul0810` approval. Keep pricing/licensing/free-vs-pro, privacy/security posture, public API/schema/breaking contracts, destructive actions, and broad positioning behind explicit approval.
- Use the CTO control chat thread for routine status. GitHub comments are for durable repo-visible decisions, blockers, deferrals, re-scopes, PR scope links, completion reconciliation, and answered owner questions.
- Keep tokens tight: load one portfolio reference mode, use `project-subagent-routing.md` for model/reasoning selection, ask for compact on continuity-sensitive high-context portfolio work, and use fresh product/worker threads for unrelated product execution.

## Reference Routing

- `../shared/references/cto-orchestration-operating-model.md`: thread topology, portfolio ownership, portfolio sweep, source-of-truth hierarchy, owner authority, automation split, and CTO status format.
- `../shared/references/release-train-discipline.md`: cross-product release gates, release branches, prerelease/stable approval boundaries, and release-ready evidence.
- `../shared/references/delegation-protocol.md`: product-thread topology drift, protected-thread boundaries, worktree recovery, and delegation health.
- `../shared/references/github-communication-protocol.md`: quiet GitHub write discipline, comments/reviews as evidence, owner labels, blocker questions, and reconciliation.
- `../shared/references/self-improvement-loop.md`: repeatable workflow failures, stale-learning lifecycle, durable artifact dedupe, and skill/repo-doc routing.
- `../shared/references/weekly-wordpress-intelligence.md`: weekly ecosystem intelligence and durable cross-product impact summaries.
- `../shared/references/project-subagent-routing.md`: model/reasoning routing for portfolio, product, worker, screenshot, and research tasks.
- `../shared/references/context-window-discipline.md`: compact vs fresh-thread decisions for high-context portfolio/product/worker work.

## Fast Workflow

1. Identify assigned products and active product threads.
2. Sweep every product: repo/remote, latest production and prerelease, active train/milestone due date, open PRs/issues, CI/release blockers, owner labels/comments/reviews, local dirty state if touched, and delegated/skill work.
3. Mark quiet products `No action after verification`; do not omit them.
4. Choose the highest-leverage governance action: owner decision brief, release conflict resolution, product-thread recovery, shared process fix, or skill/repo-doc improvement.
5. Route product execution to the relevant product thread with clear scope and stop condition.
6. Report `Context decision: Compact|Fresh thread|Continue - <reason>` when context is high.

## Status Modes

Portfolio check-in: product, verified source, release train, blockers, product-thread health, delegation state, owner decisions, next action, stop condition.

Release approval brief: product, target version, production/prerelease state, merged PRs, remaining issues, CI/package/live proof, docs/readme/WordPress.org status, risks, rollback, and exact approval requested.
