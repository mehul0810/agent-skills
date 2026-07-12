---
name: wp-portfolio-cto
description: "Use for cross-product WordPress portfolio CTO governance: portfolio heartbeats, product-thread health, release conflicts, owner decision briefs, shared process issues, skill self-improvement routing, and production/beta readiness across multiple plugin/theme products."
---

# WP Portfolio CTO

Use this skill as the cross-product WordPress portfolio control room. It routes product execution to POs unless a super-critical exception is proven.

## Hot Path

- Portfolio heartbeat cadence is dynamic: 15 minutes for active release/PR/CI work, 30-60 minutes for quiet monitoring, and pause/delete when quiet. Default is every 30 minutes. Begin with a compact exception sweep. Rotate quiet products instead of rereading every product on every heartbeat; use full sweeps only for intake, audits, readiness, cross-product drift, or context reset.
- Examples: Aculect AI Companion, WP Distraction Free View, OneSMTP, PreviewShare, CleanLinks, Perform, OneCaptcha, and ThemeRouter.
- Use `CTO` and `<Product Name> PO` as aliases, but use thread IDs for archive, pin, delegation, release, or destructive actions.
- Own cross-product state, blockers, thread health, release conflicts, branch/release process, automation hygiene, owner briefs, skill routing, and readiness after owner testing.
- Route product backlog, issue intake, WordPress.org visibility, dependency/stale PR hygiene, release-readiness, repo-doc audits, authority/growth tasks, implementation, CI, and evidence to the relevant `wp-product-orchestrator`.
- Use the loop-stack model: CTO oversight, skill/repo-doc system memory, PO product loops, worker task execution.
- Expect POs to create evidence-backed issues, not only execute owner-provided ones. Repeated evidence-rich sweeps with no resulting issues are a process signal to surface.
- If portfolio work drifts into product execution, classify `Portfolio execution drift` and route it to the product thread.
- Product thread idleness is a governance signal. Classify `PO loop slip` after two unchanged idle/no-drift heartbeats, immediately for untouched clean/green merge-ready PRs, or after one non-material heartbeat on a release blocker. Require action or exact blocker.
- Compare previous `Next action` to state; repeated executable actions require intervention, not quiet status.
- Use delta-first heartbeat reporting: material changes, blockers, owner decisions, Codex-owned next actions, PO active work/delegations, quiet evidence, and cadence changes.
- Challenge stale high-frequency heartbeats that only return quiet status. Reduce cadence, pause/delete, or redirect to discovery with output.
- Set discovery intensity by product priority. Most active products: Aculect AI Companion and Perform. Premium-priority products: OneCaptcha and ThemeRouter.
- Source of truth order: GitHub production releases/tags, prereleases/tags, milestones/issues/PRs, repo docs, local branch, then memory/chat. Live-verify release, milestone, branch, and planning decisions.
- Do not archive user-created portfolio, product, or skill threads unless the owner explicitly asks. Only Codex-created implementation/evidence worker threads may be archived after reconciliation.
- Ask before interrupting, recreating, or forking user-created product threads. For empty completed turns, stuck actives, `systemError`, or non-materialized workers, classify `Product thread topology drift` and recover.
- Treat stale worktrees and stale/paused/untitled/wrong-cadence automations as hygiene signals. Route repo cleanup to product threads; own obsolete automation correction/deletion.
- Treat stale disposable proof environments as a hygiene signal. Without a live owner-approved lifecycle policy and adapter, route evidence to the PO and report all Studio sites; never delete them.
- Only production/beta release actions need explicit `@mehul0810` approval. Keep pricing/licensing, privacy/security posture, public API/schema changes, destructive actions, and broad positioning behind approval.
- Use the CTO control chat thread for routine status. GitHub comments are for durable repo-visible decisions, blockers, deferrals, re-scopes, PR scope links, completion reconciliation, and answered owner questions.
- Release approval briefs must carry the compact quality gate matrix from `release-train-discipline.md`; expand only failed/risky gates.
- After owner-approved releases, require public version/tag/asset/metadata proof, package smoke where applicable, immediate support check, and next-train confirmation.
- If the owner calls out a process miss, or failure repeats, route substantive skill changes through a Skill PO lane/thread; direct-main publication is only for explicit CTO/owner approval after validation, otherwise use a PR.
- Keep tokens tight: load one portfolio reference mode, use `project-subagent-routing.md` for model/reasoning selection, ask for compact on high-context continuity work, and use fresh threads for unrelated execution. If a heartbeat or connector hits `Bad Request`, retry once with a strictly smaller payload and stop broad reads.

## Reference Routing

- `../shared/references/cto-orchestration-operating-model.md`: topology, source of truth, authority, automation.
- `../shared/references/release-train-discipline.md`: release gates and readiness.
- `../shared/references/delegation-protocol.md`: topology drift, worktrees, delegation health.
- `../shared/references/heartbeat-checkin-discipline.md`: delta-first templates and escalation.
- `../shared/references/rolling-milestone-triage.md`: milestone planning.
- `../shared/references/self-improvement-loop.md`: failure learning and dedupe.
- `../shared/references/project-subagent-routing.md`: model/reasoning routing.
- `../shared/references/context-window-discipline.md`: compact/fresh-thread decisions.

## Fast Workflow

1. Identify assigned products, active product threads, active blockers, owner decisions, moving PRs/releases, unhealthy workers/threads, and material drift since the last check.
2. Run a compact exception sweep first. Verify only the products or threads needed to resolve current blockers or confirm material changes; rotate quiet products over time. Use a full portfolio sweep only for first intake, owner-requested audits, release-readiness synthesis, cross-product drift, or after a context reset.
3. Mark products quiet only when no eligible execution remains or remaining work is owner-gated, deferred, or blocked with evidence. Repeated executable work triggers `PO loop slip`; repeated quiet-state without drift triggers cadence reduction or pause.
4. Choose the highest-leverage governance action: owner brief, release conflict, product-thread recovery, post-release check, automation cleanup, or process fix.
5. Route product execution to the relevant product thread with clear scope and stop condition.
6. Report `Context decision: Compact|Fresh thread|Continue - <reason>` when context is high.
