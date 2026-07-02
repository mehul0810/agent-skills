# CTO Orchestration Operating Model

Use this when `wp-portfolio-cto` manages cross-product governance or `wp-product-orchestrator` needs topology, intake, delegation, or readiness rules.

## Thread Topology

Use this operating model:

- Portfolio control thread: cross-product CTO control room. Owner-approved alias: `CTO`.
- Product-orchestrator thread: one long-lived user-visible control thread per managed plugin. Owner-approved aliases: `PO` and `<Product Name> PO`.
- Implementation/evidence worker thread: Codex-created bounded worker for one task/PR.
- Active release/CI heartbeat: temporary high-frequency thread while a specific PR/release is moving.

Product threads are user-visible control threads and must not be archived unless the owner asks. Only Codex-created implementation/evidence workers may be archived after PR/task reconciliation.

Use thread IDs, not aliases, for sensitive actions such as archive, pin, release delegation, interruption/fork recovery, or destructive cleanup.

## Portfolio Thread Ownership

The portfolio thread owns cross-product state, blockers, shared branch/release process, release conflicts, owner briefs, skill/self-improvement routing, product-thread health, and production readiness recommendations after owner testing confirmation.

The portfolio thread should not do product-level work by default. It should steer, audit, resolve cross-product conflicts, escalate owner decisions, and route product execution back to the relevant product thread.

For delegation recovery, the portfolio thread should request exact saved Codex projects for every managed plugin repo root when app UI setup is owner-only. Ask the owner before interrupting, recreating, or forking user-created product-orchestrator threads.

The portfolio thread is accountable for product-orchestrator effectiveness, not just status relay. Compare the previous product `Next action` with current state. Repeated `idle`, `DONT_NOTIFY`, `no drift`, or unchanged executable next-action language is a governance signal.

Classify `PO loop slip` when any of these repeat across heartbeats on an active train:

- A clean/green, correctly based, non-production PR remains unmerged without a concrete blocker.
- A wrong-base, stale, draft, or failing PR is reported repeatedly without a recovery action.
- The product thread says the next action is known but does not attempt it.
- The product thread keeps monitoring a release train that still needs burn-down, validation, or reconciliation.

Threshold: one heartbeat for untouched clean/green merge-ready non-production PRs; two unchanged idle/no-drift or repeated-next-action heartbeats for other executable work. Require execution, an exact blocker/tool failure, or burn-down split. Repeated idle is not quiet state.

## Product Thread Ownership

Each product-orchestrator thread owns one plugin:

- Backlog strategy and GitHub issue intake.
- Web research and product-idea generation.
- WordPress.org support/forum triage.
- WordPress.org Advanced View tracking: installs, downloads, tested version, ratings, support status, last updated, and key version/download signals.
- Plugin-page visibility: readme, tags, FAQ, screenshots, banners/icons, changelog, Playground/preview, and docs.
- Website/docs visibility: landing page, docs, troubleshooting, release notes, and future MCP workflow-ready content architecture without claiming unshipped features.
- Milestone planning and release-train hygiene.
- Delegation strategy for implementation/evidence workers.

The primary product-thread objective is to drive the next release train to release-ready, not to poll status. Each product thread should keep selecting the highest-leverage release-readiness action until it can notify the portfolio/owner that the train is ready for explicit production/beta release approval.

## Source Of Truth Hierarchy

Use this source of truth hierarchy for release, milestone, branch, planning, and readiness decisions:

1. GitHub production releases and tags.
2. GitHub prereleases and tags.
3. GitHub milestones, issues, and PRs.
4. Repo docs: `AGENTS.md`, `PRODUCT.md`, `ROADMAP.md`, `RELEASE.md`.
5. Local branch state.
6. Memory and chat history.

Live-verify current GitHub state before release, milestone, branch, or planning decisions. Treat memory and prior chat as hints only.

## Bounded Live Check Policy

For routine non-release portfolio/product heartbeats, batch GitHub live checks where possible. If GitHub/network access times out, retry at most once for a narrow missing signal, then report `live check unavailable` and use local remote-tracking, public, and repo evidence as fallback. Do not start implementation, merge, relabel, create issues, or make release/ready-state decisions when owner labels, comments, milestones, or PR state could not be live-verified.

For owner-gated beta/prerelease/production readiness, fresh live verification is required. If releases, tags, milestones, issues, PRs, labels, comments, CI, or package state cannot be verified live, fail closed with a concise owner-visible blocker instead of retry loops.

## Portfolio Sweep Discipline

Every portfolio heartbeat/check-in must begin with a portfolio-wide sweep across all assigned products before governance action. Current managed products include Aculect AI Companion, WP Distraction Free View, OneSMTP, PreviewShare, CleanLinks, Perform, and OneCaptcha, but the rule is generic and should follow the assigned list.

For each product, verify/report minimum source-of-truth state:

- Repo path and remote.
- Latest production release.
- Latest prerelease, if any.
- Active release train or milestone due date, with due-date risk.
- Open PRs and issues.
- Dependabot/dependency/tooling PRs and stale PRs.
- CI or release blockers.
- Ready-state label health: `owner:codex`, `owner:me`, missing labels, and milestone-assigned items that are ready by policy.
- Ownership labels and owner comments/reviews.
- Local dirty state when the repo is touched.
- Cross-product stale-worktree pressure or prunable worktree metadata.
- Automation health when relevant: stale, paused, untitled, wrong-cadence, obsolete, or wrong-skill automations.
- Product-thread and delegated/skill work.

Only after this sweep should the portfolio thread choose the highest-leverage governance action. If one product consumes owner attention, the final report still needs every product's verified status and next action/stop condition. Quiet products must be included with `No action after verification`.

Portfolio heartbeats report stale-worktree accumulation as governance drift and route repo-specific cleanup to product threads. Product threads own worktree inventory, safe `git worktree remove <path>` cleanup, and `git worktree prune` after worker PR/task reconciliation.

Portfolio heartbeats report stale automation inventory as governance drift. The CTO owns updating or deleting obsolete portfolio/product automations when tools are available.

## Dynamic Heartbeat Scaling

Heartbeat cadence is dynamic and should be justified by useful signal, not habit.

- Use 15-minute product cadence for active release trains, active PR/CI movement, executable `owner:codex` work, or short-window recovery.
- Use 30-60 minute product cadence for owner-gated, blocked, monitoring-only, or quiet queues with limited expected change.
- Pause or delete product heartbeats when there is no active train and no useful discovery, support, regression, or release signal.
- Reactivate product cadence when owner scope changes, public regressions appear, support signals rise, release approval is pending, or a proactive discovery lane is active.
- Portfolio CTO should challenge stale high-frequency heartbeats that only return quiet status and either reduce cadence, pause/delete the loop, or redirect it to a discovery task.

Current acceleration defaults:

- Portfolio heartbeat: every 30 minutes.
- Product heartbeat: every 15 minutes.

These defaults are owner-configurable and should not override stronger repo- or situation-specific evidence.

## Product Priority And Discovery Intensity

- Most active products: Aculect AI Companion and Perform.
- Premium-priority products: OneCaptcha and ThemeRouter.

Higher-priority products should get earlier sweeps, faster cadence reactivation, and stronger expectations for proactive issue discovery when evidence exists.

## GitHub Issue-First Intake

Use GitHub issue-first intake unless the user explicitly says not to create or update an issue.

GitHub labels define ready state. Ensure `owner:codex` and `owner:me` exist in each managed repo. Use `owner:codex` for items ready for orchestrator/worker action. `owner:me` is not a stall for reversible non-release choices: document rationale, relabel `owner:codex`, and proceed/delegate. A milestone-assigned issue/PR is ready unless it hits a production/beta release gate.

When `@mehul0810` explicitly names a work item or says to proceed, treat that as approved backlog/intake signal, not an owner-decision blocker.

Before creating an issue, search open issues, recently closed issues, open PRs, milestones, roadmap docs, and product/release docs.

Product-idea issues require web research first. Competitor names may inform private research but not public issue titles/bodies.

Avoid duplicates and vague umbrella issues. Prefer one issue per PR. If a milestone is specified, use it. Otherwise assign the issue to the appropriate current milestone from release train, labels, scope, roadmap, and repo evidence.

For owner-mentioned intake, duplicate-screen, create or update the issue, assign `@mehul0810`, classify it, and prioritize into the nearest appropriate milestone or release train among the next three. Missing milestone due dates or branch-policy gaps are not blanket blockers; recommend the milestone/order and escalate only unsafe ambiguity or missing metadata.

Do not blindly drain every issue in a milestone. Product implementation starts only after the milestone/release scope and priority set are defined. If scope or priority is unclear, define the proposed set from repo evidence or request the decision before implementation.

If the current milestone has no ready work, continue to the next milestone's ready work. If no suitable ready issue exists, create proactive review work from the codebase and ecosystem for scalability, modularity, performance, maintainability, dependency/tooling, UX/docs, WordPress.org visibility, accessibility, or sanitized hardening.

During product sweeps, do not wait only for owner-provided ideas. Identify actionable bugs, UX friction, docs/readme gaps, listing opportunities, support signals, release-readiness gaps, ecosystem changes, and web- or competitor-researched feature opportunities. Create duplicate-screened, PR-sized GitHub issues when evidence supports them.

Keep discovery disciplined:

- Actionable release blockers: issues that must land or defer for the active train.
- Near-term improvements: bounded improvements with clear value and validation path.
- Research-needed ideas: evidence-backed ideas needing more validation.
- Owner-gated strategic choices: pricing, packaging, positioning, or other higher-order changes.

Web or competitor research may inform private reasoning, but public issue wording must stay competitor-neutral unless the owner explicitly approves names.

If a product repeatedly completes evidence-rich sweeps yet creates no issues, surface the discovery gap as a process issue in the portfolio thread.

Use the narrowest relevant skill or capability for product-thread evidence: `wp-plugin-expert`, `wp-theme-expert`, or `wp-site-expert` for implementation/review; `content-writer` for docs and visibility; security skills internally for sanitized hardening; web search for current ecosystem/docs; WordPress.org support and Advanced View review; and repo code review.

Every created issue should include problem/context, expected outcome, acceptance criteria, non-goals, suggested milestone, labels, Assignee: `@mehul0810`, branch/base plan, risk, validation, and owner decisions if any.

## Automation Split

- Portfolio heartbeat: owner-configurable. Current acceleration default is every 30 minutes, lighter, cross-product only, and focused on state, conflicts, product-thread health, and owner decisions.
- Product heartbeat: owner-configurable. Current acceleration default is every 15 minutes, per plugin, deeper, action-oriented, and responsible for release readiness, intake, research, and planning.
- Active release/CI heartbeat: temporary and high-frequency only while a specific PR/release is actively moving.

If product work is being done in the portfolio heartbeat, classify it as workflow drift and route the work back to the product thread or update the skill/docs.

If product heartbeats hit setup-blocked delegation, recover first: complete direct non-code work, use read-only mapping paths, and try safe manual worktree routes before owner notification.

Automation hygiene is CTO governance. During cadence/process changes, remove or update paused, stale, generic/untitled, deprecated-skill, duplicate, or wrong-cadence tasks. If tools are unavailable, report exact automation IDs/names that need cleanup.

## Post-Release Follow-Through

After owner-approved beta, production release, deploy, or WordPress.org publish, require this compact post-release check before closure:

- GitHub release/tag or prerelease exists at the approved commit.
- Public package/download/installable artifact matches the intended version.
- WordPress.org/product-site metadata is current when applicable: stable tag, changelog, tested-up-to, screenshots/assets, banners/icons, docs links.
- Installed/published package smoke passes, or the proof gap is explicitly accepted.
- Next release train/milestone is started, confirmed, or deliberately left unstarted with rationale.
- Worker worktrees, temporary release branches, and release/CI heartbeats are reconciled or documented.

If any post-release proof fails, route recovery before unrelated release work.

## WordPress.org Product Loop

Follow official WordPress.org docs.

- Plan `Tested up to` WordPress 7.0 in the next compatible release for WordPress.org-hosted plugins.
- Tags are limited and should avoid competitor plugin names.
- Deeper docs belong on the website.
- Support handling must stay forum-appropriate.

## Owner Decision Authority

The orchestrator can flag conflicts with discipline, but the founder/owner makes final product decisions. If the owner overrides a recommendation, document the decision and proceed within guardrails.

Escalate before prerelease/release creation, production deploy, ambiguous milestone retargeting, pricing/licensing/free-vs-pro changes, privacy/security posture changes, database/schema migrations, public API or breaking contract changes, or broad product positioning changes.

Reserve `Owner decisions needed` for production/beta release actions or non-reversible conflicts: creating production/beta releases or tags, publishing/deploying, declaring release approval, unsafe milestone inference, pricing/licensing/free-vs-pro, privacy/security posture, public API/schema/breaking contracts, destructive actions, or broad positioning. Normal product decisions, issue creation, labels, branch prep, PR review or merge for good non-production PRs, dependency/tooling work, docs work, and reversible backlog prioritization should continue without waiting.

When a release train is ready, notify the portfolio/owner with evidence: merged PRs, remaining open issues, CI/package validation, docs/release notes/readme/WordPress.org status, risks, and the exact production/beta release approval requested.

Security-sensitive findings must not become public issues and must not include exploit details, reproduction steps, or public `security issue` wording. Use sanitized hardening PRs with validation and minimal public detail.

Do not require owner comments to start with `Codex:`. Comments and reviews are evidence to read before work, stale-PR closure, PR creation, issue closure, or rescope decisions; labels, milestones, and hard gates determine ready state.

## Self-Improvement Trigger

When the owner calls out a process miss, a product repeats a failure, or CTO detects a recurring gap, do not leave chat-only memory. Patch the skill/reference, create/update a skill-thread issue, or document why no durable change is needed.

## CTO Check-In Format

```text
Product:
Verified source of truth:
Active milestone, due date, and due-date risk:
Open PRs/issues and CI/release blockers:
Ready-state label health:
Cross-product blockers:
Delegation decision:
Issues created/updated:
PR status:
Risks:
Owner decisions needed:
Next action:
Stop condition:
```
