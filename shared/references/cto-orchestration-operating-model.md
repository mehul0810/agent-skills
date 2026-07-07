# CTO Orchestration Operating Model

Use this when `wp-portfolio-cto` manages cross-product governance or `wp-product-orchestrator` needs topology, intake, delegation, or readiness.

## Thread Topology

Use this operating model:

- Portfolio control thread: cross-product CTO control room. Owner-approved alias: `CTO`.
- Product-orchestrator thread: one long-lived user-visible control thread per managed plugin. Owner-approved aliases: `PO` and `<Product Name> PO`.
- Implementation/evidence worker thread: Codex-created bounded worker for one task/PR.
- Active release/CI heartbeat: temporary high-frequency thread while a specific PR/release is moving.

Product threads are user-visible control threads and must not be archived unless the owner asks. Only Codex-created implementation/evidence workers may be archived after PR/task reconciliation.

Use thread IDs, not aliases, for sensitive actions such as archive, pin, release delegation, interruption/fork recovery, or destructive cleanup.

## Portfolio Thread Ownership

The portfolio thread owns blockers, release conflicts, owner briefs, skill routing, and readiness.

The portfolio thread should not do product-level work by default. It should steer, resolve cross-product conflicts, escalate owner decisions, and route product execution back to the relevant product thread. Only bypass a PO for super-critical work it still cannot do with GPT-5.5 and xhigh/max reasoning.

For delegation recovery, request exact saved Codex projects for managed plugin repo roots when app UI setup is owner-only. Ask before interrupting, recreating, or forking user-created product-orchestrator threads. Route substantive skill updates through a Skill PO lane/thread unless the fix is emergency coordination; direct-main Skill PO publication needs explicit CTO/owner approval.

The portfolio thread is accountable for product-orchestrator effectiveness, not just status relay. Compare the previous product `Next action` with current state. Repeated `idle`, `DONT_NOTIFY`, or unchanged next-action language is a governance signal.

Classify `PO loop slip` when any of these repeat across heartbeats on an active train:

- A clean/green, correctly based, non-production PR remains unmerged without a concrete blocker.
- A wrong-base, stale, draft, or failing PR is reported repeatedly without a recovery action.
- The product thread says the next action is known but does not attempt it.
- The product thread keeps monitoring a release train that still needs burn-down, validation, or reconciliation.

Threshold: one heartbeat for untouched clean/green merge-ready non-production PRs or release blockers; two unchanged idle/no-drift or repeated-next-action heartbeats for other executable work. Require execution, an exact blocker/tool failure, or burn-down split. Repeated idle is not quiet state.

When a PO output is unclear, log-like, contradictory, passive, repeated, stalled, missing an expected action, or misaligned with the owner-approved objective, CTO must intervene without waiting for owner prompting. Ask why, what blocks it, and what changes before the next heartbeat, then correct the PO, reduce/pause cadence, demand the exact blocker, recover/fork with approval, or route a skill/process patch.

## Product Thread Ownership

Each product-orchestrator thread owns a plugin:

- Backlog strategy and GitHub issue intake.
- Web research and product-idea generation.
- WordPress.org support triage.
- WordPress.org Advanced View tracking: installs, downloads, ratings, support, last updated, and signals.
- Plugin-page visibility: readme, tags, screenshots, banners/icons, changelog, Playground, and docs.
- Website/docs visibility: troubleshooting, release notes, authority/growth content without claiming unshipped features.
- Milestone planning and release-train hygiene.
- Delegation strategy for implementation/evidence workers.

The primary product-thread objective is release-ready progress, not status polling. Keep selecting the highest-leverage action until the train is ready for release approval.

## Source Of Truth Hierarchy

Use this source of truth hierarchy for release, milestone, branch, planning, and readiness:

1. GitHub production releases and tags.
2. GitHub prereleases and tags.
3. GitHub milestones, issues, and PRs.
4. Repo docs: `AGENTS.md`, `PRODUCT.md`, `ROADMAP.md`, `RELEASE.md`, `DESIGN.md`, optional `TESTING.md`/`PLAYGROUND.md`.
5. Local branch state.
6. Memory and chat history.

Live-verify current GitHub state before release, milestone, branch, or planning decisions. Treat memory and prior chat as hints only.

## Bounded Live Check Policy

For routine non-release portfolio/product heartbeats, batch GitHub live checks where possible. If GitHub/network access times out, retry at most once for a narrow missing signal, then report `live check unavailable` and use local/public/repo evidence as fallback. Do not start implementation, merge, relabel, create issues, or make release/ready-state decisions when owner labels, comments, milestones, or PR state could not be live-verified.

Routine product heartbeats must return promptly. If a quiet or post-intervention heartbeat cannot finish live checks quickly, return a partial owner-readable result with verified evidence, blocked checks, owner-decision change/no-change, and next retry/cadence instead of leaving the thread in progress.

For owner-gated beta/prerelease/production readiness, fresh live verification is required. If releases, tags, milestones, issues, PRs, labels, comments, CI, or package state cannot be verified live, fail closed with a concise owner-visible blocker instead of retry loops.

## Portfolio Sweep Discipline

Every portfolio heartbeat/check-in starts with a sweep across assigned products before governance action. Managed products include Aculect AI Companion, WP Distraction Free View, OneSMTP, PreviewShare, CleanLinks, Perform, and OneCaptcha.

For each product, verify/report minimum state:

- Repo path and remote.
- Latest production release.
- Latest prerelease, if any.
- Active release train or milestone due date, with due-date risk.
- Open PRs and issues.
- Dependabot/dependency/tooling PRs and stale PRs.
- CI or release blockers.
- Ready-state label health: `owner:codex`, `owner:me`, missing labels, and milestone-assigned items ready by policy.
- Ownership labels and owner comments/reviews.
- Local dirty state when the repo is touched.
- Cross-product stale-worktree pressure or prunable worktree metadata.
- Product-thread and delegated/skill work.

Only after this sweep should the portfolio thread choose the highest-leverage governance action. If one product consumes owner attention, the final report still needs every product's verified status and next action/stop. Quiet products still use `No action after verification`.
Exception reports should surface Open PRs/issues and CI/release blockers for non-quiet products.

Portfolio heartbeats report stale-worktree accumulation as governance drift and route repo-specific cleanup to product threads.

## Dynamic Heartbeat Scaling

Heartbeat cadence is dynamic and should be justified by signal, not habit.

- Use 15-minute product cadence for active release trains, PR/CI movement, executable `owner:codex` work, or short-window recovery.
- Use 30-60 minute product cadence for owner-gated, blocked, monitoring-only, or quiet queues.
- Pause or delete product heartbeats when there is no active train and no useful discovery, support, regression, or release signal.
- Reactivate product cadence when owner scope changes, regressions appear, support signals rise, release approval is pending, or a proactive discovery lane is active.
- Portfolio CTO should challenge stale high-frequency heartbeats that only return quiet status and either reduce cadence, pause/delete the loop, or redirect it to a discovery task.

Current acceleration defaults:

- Portfolio heartbeat: every 30 minutes.
- Product heartbeat: every 15 minutes.

These defaults are owner-configurable and should not override stronger signals.

## Product Priority And Discovery Intensity

- Most active products: Aculect AI Companion and Perform.
- Premium-priority products: OneCaptcha and ThemeRouter.

## GitHub Issue-First Intake

GitHub labels define ready state. Ensure `owner:codex` and `owner:me` exist in each managed repo. Use `owner:codex` for items ready. `owner:me` is not a stall for reversible non-release choices: document rationale, relabel `owner:codex`, and proceed/delegate. A milestone-assigned issue/PR is ready unless it hits a production/beta release gate.

When `@mehul0810` explicitly names a work item or says to proceed, treat that as an approved backlog/intake signal, not an owner-decision blocker.

Before creating an issue, search open issues, recently closed issues, open PRs, milestones, roadmap docs, and product/release docs.

When the owner provides an exact issue, PR, release URL, or number, inspect that exact entity first before broad queue scans or inference. If a broad scan excludes the referenced entity because it is closed, merged, or not open, report that finding instead of switching to other open items. If an earlier answer used the wrong entity, say so plainly before correcting course.

Product-idea issues require web research first. Competitor names may inform private research but not public titles/bodies.

Design-visible issues need a before screenshot/link. If blocked, state blocker plus route, repro, or artifact path.

Avoid duplicates and umbrella issues. Prefer one issue per PR. If a milestone is specified, use it. Otherwise assign the issue to the appropriate current milestone from release train, labels, scope, roadmap, and repo evidence.

For owner-mentioned intake, duplicate-screen, create/update the issue, assign `@mehul0810`, classify it, and prioritize into the nearest milestone or release train among the next three. Missing due dates or branch-policy gaps are not blanket blockers; recommend order and escalate unsafe ambiguity.

Do not blindly drain every issue in a milestone. Product implementation starts only after the milestone/release scope and priority set are defined. If scope or priority is unclear, define the proposed set from repo evidence or request the decision before implementation.

If the current milestone has no ready work, continue to the next milestone's ready work. If none exists, create proactive review work for scale, modularity, performance, maintainability, dependency/tooling, UX/docs, WordPress.org visibility, accessibility, or sanitized hardening.

During product sweeps, do not wait only for owner-provided ideas. Identify actionable bugs, UX friction, docs/readme gaps, listing opportunities, support signals, release-readiness gaps, ecosystem changes, feature opportunities, and authority/growth tasks. Create duplicate-screened, PR-sized GitHub issues when evidence supports them.

Keep discovery disciplined:

- Actionable release blockers: issues that must land or defer for the active train.
- Near-term improvements: bounded improvements with clear value.
- Research-needed ideas: evidence-backed ideas needing more validation.
- Owner-gated strategic choices: pricing, packaging, positioning, or other higher-order changes.

Web or competitor research may inform private reasoning, but public issue wording must stay competitor-neutral unless the owner explicitly approves names.

If a product repeatedly completes evidence-rich sweeps yet creates no issues, surface the discovery gap as a process issue in the portfolio thread.

Use the narrowest relevant skill or capability for product-thread evidence: `wp-plugin-expert`, `wp-theme-expert`, or `wp-site-expert` for implementation/review; `content-writer` for docs/visibility; security skills for sanitized hardening; web search for current ecosystem/docs; WordPress.org review; and repo code review.

Every created issue should include problem/context, expected outcome, acceptance criteria, non-goals, milestone, labels, Assignee: `@mehul0810`, branch/base, risk, validation, proof needs when relevant, and owner decisions if any. Add model/reasoning only when it cuts worker planning waste.

## Automation Split

- Portfolio heartbeat: owner-configurable. Current acceleration default is every 30 minutes, cross-product only, focused on state, conflicts, product-thread health, and owner decisions.
- Product heartbeat: owner-configurable. Current acceleration default is every 15 minutes, per plugin, focused on release readiness, intake, and planning.
- Active release/CI heartbeat: temporary and high-frequency only while a specific PR/release is actively moving.

If product work is being done in the portfolio heartbeat, classify it as workflow drift and route the work back to the product thread or update the skill/docs.

If product heartbeats hit setup-blocked delegation, recover first: complete direct non-code work, use read-only mapping, and try manual worktree routes before owner notification.

Automation hygiene is CTO governance. During cadence/process changes, remove or update paused, stale, generic/untitled, deprecated-skill, duplicate, or wrong-cadence tasks. If tools are unavailable, report automation IDs needing cleanup.

## Post-Release Follow-Through

After owner-approved beta, production release, deploy, or WordPress.org publish, require this post-release check before closure:

- GitHub release/tag or prerelease exists at the approved commit.
- Public package/download/installable artifact matches the intended version.
- WordPress.org/product-site metadata is current when applicable: stable tag, changelog, tested-up-to, screenshots/assets, banners/icons, docs links.
- Installed/published package smoke passes, or the proof gap is explicitly accepted.
- Next release train/milestone is started, confirmed, or deliberately left unstarted with rationale.
- Worker worktrees, temporary release branches, and release/CI heartbeats are reconciled or documented.

If post-release proof fails, route recovery before unrelated release work.

## WordPress.org Product Loop

Follow official WordPress.org docs.

- Plan `Tested up to` WordPress 7.0 in the next compatible release for WordPress.org-hosted plugins.
- Tags are limited and should avoid competitor plugin names.
- Deeper docs belong on the website.
- Support handling must stay forum-appropriate.

## Owner Decision Authority

The orchestrator can flag conflicts with discipline, but the founder/owner makes final product decisions. If the owner overrides a recommendation, document the decision and proceed within guardrails.

Escalate before prerelease/release creation, production deploy, ambiguous milestone retargeting, pricing/licensing/free-vs-pro changes, privacy/security posture changes, database/schema migrations, public API or breaking contract changes, or broad product positioning changes.

Reserve `Owner decisions needed` for production/beta release actions or non-reversible conflicts: creating production/beta releases or tags, publishing/deploying, declaring release approval, unsafe milestone inference, pricing/licensing/free-vs-pro, privacy/security posture, public API/schema/breaking contracts, destructive actions, or broad positioning. Normal product decisions, labels, branch prep, PR review or merge for good non-production PRs, dependency/tooling work, docs work, and reversible backlog prioritization should continue without waiting.

When a release train is ready, notify the owner with evidence: merged PRs, remaining open issues, CI/package validation, docs/release notes/readme/WordPress.org status, risks, and the approval requested.

Security-sensitive findings must not become public issues and must not include exploit details, reproduction steps, or public `security issue` wording. Use sanitized hardening PRs with validation and minimal public detail.

Do not require owner comments to start with `Codex:`. Read comments/reviews before work or rescope; labels, milestones, and hard gates determine ready state.

## Self-Improvement Trigger

When the owner calls out a process miss, a product repeats a failure, or CTO detects a recurring gap, do not leave chat-only memory. Patch the skill/reference, create/update a skill-thread issue, or document why no durable change is needed.

## CTO Check-In Format

Use `heartbeat-checkin-discipline.md` for delta-first CTO and PO check-ins. Default to exception reporting plus a compact quiet-coverage line instead of repeating full unchanged product lists, and translate PO outputs into owner-facing portfolio language rather than forwarding raw worker-style status.
