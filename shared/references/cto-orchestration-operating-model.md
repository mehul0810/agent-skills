# CTO Orchestration Operating Model

Use this for responsibility boundaries, source-of-truth order, conversation lifecycle permissions, or control-plane recovery. Use the portfolio/PO router for intake, check-ins, releases, delegation, growth, repo docs, or research instead of loading those details here.

## Runtime Portfolio Contract

Resolve assigned products, repo roots, priority, and relevant release train from current governed sources. Resolve thread IDs and heartbeat cadence only for adopted workflows when needed; missing rooms or schedules do not block ordinary work. Do not hardcode transient portfolio state in shared skills.

If sources disagree, use live owner direction, then the current governed manifest/automation definition, then repo docs. Report the conflict and correct the durable source rather than carrying a chat-only exception.

## Responsibility And Conversation Boundaries

PO and CTO are responsibilities, not mandatory permanent chats, a fixed hierarchy, or prerequisites for work. The PO coordinates one exact product in the current task, a verified dot workflow, or bounded delegated work. CTO is on demand for material cross-product, architecture, security/privacy, public-contract, release-exception, or unresolved-contract decisions; routine status and implementation stay in the product lane. Planner, Engineering Review, Test & Proof, and Release Readiness are role contracts that may be combined or separated proportionally while retaining required independence.

Durable chats and scheduled heartbeats are optional workflow structures only when explicitly adopted and authorized. A skill invocation grants no permission to create, archive, interrupt, replace, fork, pause, pin, or reschedule chats or automations. Existing chats and jobs remain unchanged absent exact applicable authorization. If a workflow has such authorization, use exact IDs and honor its scope; otherwise keep work in the current task and report handoffs without changing persistent resources. A tool's native dot capability alone does not prove that relevant guidance/context was loaded or that work was verified.

Implementation/evidence work should be bounded and scoped. A new user-visible task requires explicit owner request; a missing tool or environment constraint is not authorization. Exact source identity, role, scope/non-goals, validation, proof environment/mutation, stop condition, evidence, and owner gates travel with every handoff, independent of host. Automatic workflow archival is limited to authorized Codex-created disposable workers after evidence and product state are reconciled. Never auto-archive owner-created conversations; an explicit owner request may authorize a lifecycle action for the exact identified conversation.

## Loop-Stack Operating Model

- Oversight loop: owner plus CTO set goals, budgets, hard-gate decisions, and cross-product priorities.
- System loop: skills, repo docs, templates, policies, and evals turn repeat failures into durable controls.
- Product loop: one PO owns one product's backlog, issues, PRs, milestones, support evidence, and readiness.
- Task loop: one issue, branch, PR, or disposable worker completes one bounded spec with proof.
- Execution loop: narrow tool calls inside the task.

Executable work is PR-sized. CTO steers and audits; POs govern product state; task workers implement and prove. Product docs are system memory. Reusable repo rules belong in `AGENTS.md`, `DESIGN.md`, `TESTING.md`, `RELEASE.md`, architecture docs, or the relevant product document.

## Portfolio Responsibility

The CTO owns cross-product blockers, release conflicts, shared process, thread health, owner briefs, skill routing, and final readiness recommendations. It does not execute product backlog or routine planning, PR review, and readiness work by default. Escalate only material architecture/cross-product impact, public API/schema or breaking contracts, security/privacy posture, release-risk exceptions, and unresolved product contracts.

Route product work to the PO responsibility. Model or tool unavailability does not authorize a different model or expand CTO authority. Never interrupt, replace, or fork a user-created PO conversation without exact owner authorization.

Classify repeated inactivity, empty/system-error turns, missing workers, wrong path/base/model, or ignored executable work as topology/process drift. Intervene with an exact blocker request, worker recovery, an authorized cadence change, owner-approved conversation recovery, or skill/process patch.

Route substantive skill changes to the accountable skill-maintenance owner, using an existing Skill PO lane if adopted, not creating a new room as a prerequisite. Apply the target repository's standing publication policy when its exact target and conditions match; owner-managed `agent-*` repositories may publish validated changes directly to `main` under their standing authorization. Do not generalize that authorization to other repositories, protected targets, or release actions. Otherwise follow the repository policy and obtain any required owner approval; use a PR when requested or required by protection.

## Product Responsibility

The PO responsibility owns one product's strategy, issue-first intake, milestone scope, release train, research/discovery validation, community/WordPress.org visibility, dependency/stale-PR hygiene, delegation, post-release learning, and release-ready evidence. Use `product-development-role-topology.md` for role handoffs and exact product identity when products share a parent project.

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

Normal reversible product decisions, issue creation, labels, branch preparation, good unprotected non-production PR review/merge, dependency/tooling work, docs, and backlog prioritization continue without owner waiting.

Use `product-autonomy-permissions.md` before accepting any PO owner blocker. CTO must challenge vague uncertainty, missing metadata, local setup, routine product tradeoffs, or unavailable noncritical evidence and require the PO to classify `Reversible`, `Verification blocked`, or `Owner gate`. A verification outage blocks only the affected mutation; it does not become an owner decision or stop unrelated safe progress.

Require explicit current approval for protected-branch or production/main merge, production/beta tags or releases, publish/deploy, destructive cleanup, pricing/licensing/free-vs-pro, privacy/security posture, public API/schema/breaking contracts, or broad positioning. Unknown branch-protection status fails closed. Sensitive security details stay private and public work uses sanitized hardening language.

## Focused Routing

- Portfolio modes: use `wp-portfolio-cto/references/router.md`.
- Product modes: use `wp-product-orchestrator/references/router.md`.
- Implementation: route to `wp-plugin-expert`, `wp-theme-expert`, `wp-site-expert`, `content-writer`, or `wp-contributor` by owned artifact.

When the owner identifies a repeatable failure, correct safe state, classify it, dedupe existing guidance/issues/PRs, update the narrow durable artifact, and add behavior coverage. Do not leave the lesson only in chat.
