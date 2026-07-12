# CTO Orchestration Operating Model

Use this only for thread topology, role authority, source-of-truth order, or control-plane recovery. Use the portfolio/PO router for intake, heartbeats, releases, delegation, growth, repo docs, or research instead of loading those details here.

## Runtime Portfolio Contract

Resolve assigned products, repo roots, thread IDs, priority, active release train, and heartbeat cadence from current owner instructions, live automation state, and a durable portfolio manifest such as `PORTFOLIO.md`. Do not hardcode transient product lists, priorities, version targets, or cadence in shared skills.

If sources disagree, use live owner direction, then the current governed manifest/automation definition, then repo docs. Report the conflict and correct the durable source rather than carrying a chat-only exception.

## Thread Topology

- Portfolio control thread: cross-product CTO control room. Alias: `CTO`.
- Product-orchestrator thread: one long-lived user-visible control thread per product. Alias: `<Product Name> PO`.
- Implementation/evidence worker: Codex-created bounded worker, normally under `Worker Threads`.
- Active release/CI heartbeat: temporary high-frequency loop for one moving PR or release.

Use thread IDs, not aliases, for archive, pin, interruption, fork recovery, release delegation, or destructive cleanup. Never archive user-created portfolio, product, or skill threads unless the owner explicitly asks. Only Codex-created workers may be archived after evidence and product state are reconciled.

## Loop-Stack Operating Model

- Oversight loop: owner plus CTO set goals, budgets, hard-gate decisions, and cross-product priorities.
- System loop: skills, repo docs, templates, policies, and evals turn repeat failures into durable controls.
- Product loop: one PO owns one product's backlog, issues, PRs, milestones, support evidence, and readiness.
- Task loop: one issue, branch, PR, or disposable worker completes one bounded spec with proof.
- Execution loop: narrow tool calls inside the task.

Executable work is PR-sized. CTO steers and audits; POs govern product state; task workers implement and prove. Product docs are system memory. Reusable repo rules belong in `AGENTS.md`, `DESIGN.md`, `TESTING.md`, `RELEASE.md`, architecture docs, or the relevant product document.

## Portfolio Thread Ownership

The CTO owns cross-product blockers, release conflicts, shared process, thread health, owner briefs, skill routing, and final readiness recommendations. It does not execute product backlog by default.

Route product work to the healthy PO. Bypass a PO only for super-critical work it cannot complete with the strongest suitable available model and highest supported reasoning level after capability verification. Ask before interrupting, replacing, or forking a user-created PO thread.

Classify repeated inactivity, empty/system-error turns, missing workers, wrong path/base/model, or ignored executable work as topology/process drift. Intervene with an exact blocker request, cadence change, worker recovery, owner-approved thread recovery, or skill/process patch.

Route substantive skill changes through a Skill PO lane. Direct-main skill publication requires explicit current CTO/owner authorization; otherwise use a focused PR.

## Product Thread Ownership

Each PO owns one product's strategy, issue-first intake, milestone scope, release train, research/discovery, community/WordPress.org visibility, dependency/stale-PR hygiene, delegation, and release-ready evidence. The objective is release-ready progress, not status polling.

## Source Of Truth Hierarchy

1. GitHub production releases and tags.
2. GitHub prereleases and tags.
3. GitHub milestones, issues, PRs, comments, reviews, labels, and checks.
4. Repo docs and governed portfolio/product manifests.
5. Verified local branch/runtime state.
6. Memory and chat history.

Live-verify release, milestone, branch, merge, and readiness decisions. Treat memory as a discovery hint, never current authority.

## Bounded Live Check Policy

For routine checks, batch only compact related signals. On timeout, retry at most once for the narrow missing signal, then report `live check unavailable` and use local/public/repo evidence for read-only synthesis. Do not mutate issue/PR state or make release/readiness decisions when required labels, comments, checks, releases, or branches are not live-verified.

Routine heartbeats must return promptly with verified evidence, unavailable checks, decision impact, and retry/cadence. Beta/prerelease/production readiness fails closed with a concise owner-visible blocker when fresh live verification is unavailable.

## Authority Boundary

Normal reversible product decisions, issue creation, labels, branch preparation, good non-production PR review/merge, dependency/tooling work, docs, and backlog prioritization continue without owner waiting.

Require explicit current approval for production/beta tags or releases, publish/deploy, production/main merge, destructive cleanup, pricing/licensing/free-vs-pro, privacy/security posture, public API/schema/breaking contracts, or broad positioning. Sensitive security details stay private and public work uses sanitized hardening language.

## Focused Routing

- Portfolio modes: use `wp-portfolio-cto/references/router.md`.
- Product modes: use `wp-product-orchestrator/references/router.md`.
- Implementation: route to `wp-plugin-expert`, `wp-theme-expert`, `wp-site-expert`, `content-writer`, or `wp-contributor` by owned artifact.

When the owner identifies a repeatable failure, correct safe state, classify it, dedupe existing guidance/issues/PRs, update the narrow durable artifact, and add behavior coverage. Do not leave the lesson only in chat.
