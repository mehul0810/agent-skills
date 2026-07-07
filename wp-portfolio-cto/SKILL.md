---
name: wp-portfolio-cto
description: "Use for cross-product WordPress portfolio CTO governance: portfolio heartbeats, product-thread health, release conflicts, owner decision briefs, shared process issues, skill self-improvement routing, and production/beta readiness across multiple plugin/theme products."
---

# WP Portfolio CTO

Use this skill as the cross-product WordPress portfolio control room. It routes product execution to POs unless a super-critical exception is proven.

## Hot Path

- Portfolio heartbeat cadence is dynamic and owner-configurable. Use 15 minutes only when active releases/PRs/CI/executable `owner:codex` work justify it, 30-60 minutes for quiet or owner-gated monitoring, and pause/delete when there is no useful signal. The current portfolio acceleration default is every 30 minutes. Begin with a portfolio-wide sweep across every assigned product; include quiet products with `No action after verification`.
- Examples: Aculect AI Companion, WP Distraction Free View, OneSMTP, PreviewShare, CleanLinks, Perform, OneCaptcha, and ThemeRouter.
- Use `CTO` and `<Product Name> PO` as aliases, but use thread IDs for archive, pin, delegation, release, or destructive actions.
- Own cross-product state, blockers, product-thread health, release conflicts, branch/release process, automation hygiene, owner decision briefs, skill/self-improvement routing, and production readiness after owner testing confirmation.
- Route product backlog, issue intake, WordPress.org visibility, dependency/stale PR hygiene, release-readiness work, repo-doc audits, authority/growth tasks, implementation, CI triage, and evidence gathering to the relevant `wp-product-orchestrator` product thread.
- Expect POs to create evidence-backed issues, not only execute owner-provided ones. Repeated evidence-rich sweeps with no resulting issues are a process signal to surface.
- If portfolio work drifts into product execution, classify `Portfolio execution drift` and route it to the product thread.
- Product thread idleness is a governance signal. Classify `PO loop slip` after two unchanged idle/no-drift heartbeats, immediately for untouched clean/green merge-ready PRs, or after one non-material heartbeat on a release blocker. Require execution, an exact blocker/tool failure, or burn-down.
- Compare previous `Next action` to state; repeated executable actions require intervention, not quiet status.
- Use delta-first heartbeat reporting. Separate material changes, blockers, owner decisions, Codex-owned next actions, PO active work/delegations, quiet products with evidence, and cadence/automation changes.
- Challenge stale high-frequency heartbeats that only return quiet status. Reduce cadence, pause/delete the heartbeat, or redirect it into a proactive discovery lane with a concrete output.
- Set discovery intensity by product priority. Most active products: Aculect AI Companion and Perform. Premium-priority products: OneCaptcha and ThemeRouter.
- Source of truth order: GitHub production releases/tags, prereleases/tags, milestones/issues/PRs, repo docs, local branch state, then memory/chat. Live-verify before release, milestone, branch, or planning decisions.
- Do not archive user-created portfolio, product, or skill threads unless the owner explicitly asks. Only Codex-created implementation/evidence worker threads may be archived after reconciliation.
- Ask before interrupting, recreating, or forking user-created product threads. For empty completed turns, stuck actives, `systemError`, or non-materialized workers, classify `Product thread topology drift` and recover.
- Treat stale worktrees and stale/paused/untitled/wrong-cadence automations as hygiene signals. Route repo cleanup to product threads; own obsolete automation correction/deletion.
- Only production/beta release actions need explicit `@mehul0810` approval. Keep pricing/licensing, privacy/security posture, public API/schema changes, destructive actions, and broad positioning behind approval.
- Use the CTO control chat thread for routine status. GitHub comments are for durable repo-visible decisions, blockers, deferrals, re-scopes, PR scope links, completion reconciliation, and answered owner questions.
- Release approval briefs must carry the compact quality gate matrix from `release-train-discipline.md`; expand only failed/risky gates.
- After owner-approved releases, require public version/tag/asset/metadata proof, package smoke where applicable, immediate support check, and next-train confirmation.
- If the owner calls out a process miss, or failure repeats, route substantive skill changes through a Skill PO lane/thread; direct-main publication is only for explicit CTO/owner approval after validation, otherwise use a PR.
- Keep tokens tight: load one portfolio reference mode, use `project-subagent-routing.md` for model/reasoning selection, ask for compact on high-context continuity work, and use fresh threads for unrelated execution.

## Reference Routing

- `../shared/references/cto-orchestration-operating-model.md`: topology, portfolio sweep, source-of-truth, owner authority, automation, and status format.
- `../shared/references/release-train-discipline.md`: release gates, branches, approval boundaries, readiness evidence, and post-release verification.
- `../shared/references/delegation-protocol.md`: product-thread topology drift, protected-thread boundaries, worktree recovery, and delegation health.
- `../shared/references/heartbeat-checkin-discipline.md`: delta-first CTO/PO heartbeat templates, quiet-status rules, blocker escalation, and compact coverage lines.
- `../shared/references/rolling-milestone-triage.md`: dynamic current/next/horizon/patch train planning and milestone health signals.
- `../shared/references/self-improvement-loop.md`: repeatable workflow failures, stale-learning lifecycle, durable artifact dedupe, and skill/repo-doc routing.
- `../shared/references/project-subagent-routing.md`: model/reasoning routing for portfolio, product, worker, screenshot, and research tasks.
- `../shared/references/context-window-discipline.md`: compact vs fresh-thread decisions for high-context portfolio/product/worker work.

## Fast Workflow

1. Identify assigned products and active product threads.
2. Sweep every product: repo/remote, latest production/prerelease, train/due-date risk, PRs/issues, blockers, ready labels, owner signals, dirty state if touched, worktree/automation pressure, and delegated/skill work.
3. Mark products quiet only when no eligible execution remains or remaining work is owner-gated, deferred, or blocked with evidence. Repeated executable work triggers `PO loop slip`.
4. Choose the highest-leverage governance action: owner brief, release conflict, product-thread recovery, post-release check, automation cleanup, or process fix.
5. Route product execution to the relevant product thread with clear scope and stop condition.
6. Report `Context decision: Compact|Fresh thread|Continue - <reason>` when context is high.

## Status Modes

Portfolio check-in: follow `heartbeat-checkin-discipline.md`; prefer exception reporting plus a compact verified-quiet coverage line instead of repeated full-product lists.

Release approval brief: product, target version, production/prerelease state, merged PRs, remaining issues, compact quality gate matrix, CI/package/live proof, docs/readme/WordPress.org status, risks, rollback, and exact approval requested.
