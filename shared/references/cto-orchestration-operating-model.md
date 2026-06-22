# CTO Orchestration Operating Model

Use this reference when `wp-product-orchestrator` is managing portfolio governance, product-thread ownership, GitHub intake, sequencing, delegation, or readiness for WordPress products.

## Thread Topology

Use this operating model:

- Portfolio control thread: cross-product CTO control room.
- Product-orchestrator thread: one long-lived user-visible control thread per managed plugin.
- Implementation/evidence worker thread: Codex-created bounded worker for one task/PR.
- Active release/CI heartbeat: temporary high-frequency thread while a specific PR/release is moving.

Product threads are user-visible control threads and must not be archived unless the owner explicitly asks. Only Codex-created implementation/evidence worker threads may be archived after their PR/task is reconciled.

## Portfolio Thread Ownership

The portfolio control thread owns cross-product state, blockers, shared branch/release process, release conflicts, owner decision briefs, skill/self-improvement routing, product-thread health checks, and production readiness recommendations after owner testing confirmation.

The portfolio thread should not do product-level work by default. It should steer, audit, resolve cross-product conflicts, escalate owner decisions, and route product execution back to the relevant product thread.

For delegation recovery, the portfolio thread should request exact saved Codex projects for every managed plugin repo root when app UI setup is truly owner-only. Ask the owner before interrupting, recreating, or forking user-created product-orchestrator threads.

## Product Thread Ownership

Each product-orchestrator thread owns one plugin:

- Backlog strategy and GitHub issue intake.
- Web research and product-idea generation.
- WordPress.org support/forum triage when hosted on WordPress.org.
- WordPress.org Advanced View tracking when hosted there: active installs, downloads, version tested, ratings, support status, last updated, and relevant version/download signals.
- Plugin-page visibility: readme, tags, FAQ, screenshots, banners/icons, changelog, Playground/preview opportunities, and docs links.
- Website/docs visibility: landing page, docs, troubleshooting, release notes, and future MCP workflow-ready content architecture without claiming unshipped MCP features.
- Milestone planning and release-train hygiene.
- Delegation strategy for implementation/evidence workers.

Product threads own product-level strategy and action. Implementation still goes to bounded workers when delegation is useful.

The primary product-thread objective is to drive the next release train to release-ready, not to poll status. Each product thread should keep selecting the highest-leverage release-readiness action until it can notify the portfolio/owner that the train is ready for explicit production/beta release approval.

## Worker Ownership

Delegated workers own only bounded implementation, CI triage, dependency resolution, workflow investigation, review, or evidence gathering. They do not own product decisions, release decisions, merges, issue closure, milestone retargeting, protected thread archiving, or final readiness calls.

## Source Of Truth Hierarchy

Use this source of truth hierarchy for release, milestone, branch, planning, and readiness decisions:

1. GitHub production releases and tags.
2. GitHub prereleases and tags.
3. GitHub milestones, issues, and PRs.
4. Repo docs: `AGENTS.md`, `PRODUCT.md`, `ROADMAP.md`, `RELEASE.md`.
5. Local branch state.
6. Memory and chat history.

Live-verify current GitHub state before release, milestone, branch, or planning decisions. Treat memory and prior chat as hints only.

## Portfolio Sweep Discipline

Every portfolio heartbeat/check-in must begin with a portfolio-wide sweep across all assigned products before governance action. Current managed products include Aculect AI Companion, WP Distraction Free View, OneSMTP, PreviewShare, and CleanLinks, but the rule is generic and should follow the assigned product list as it changes.

For each product, verify or report the minimum source-of-truth state:

- Repo path and remote.
- Latest production release.
- Latest prerelease, if any.
- Active release train or milestone due date.
- Open PRs and issues.
- Dependabot/dependency/tooling PRs and stale PRs.
- CI or release blockers.
- Ownership labels and owner comments/reviews.
- Local dirty state when the repo is touched.
- Product-thread and delegated/skill work.

Only after this sweep should the portfolio thread choose the highest-leverage governance action. If one product consumes owner attention, the final report still needs every product's verified status and next action/stop condition. Quiet products must be included with `No action after verification`.

## GitHub Issue-First Intake

Use GitHub issue-first intake unless the user explicitly says not to create or update an issue.

GitHub labels define ready state. Ensure `owner:codex` and `owner:me` exist in each managed repo. Use `owner:codex` for items ready for orchestrator/worker action. `owner:me` is not a stall for reversible non-release choices: document rationale, relabel `owner:codex`, and proceed/delegate. A milestone-assigned issue/PR is ready unless it hits a production/beta release gate.

When `@mehul0810` explicitly names a work item or says to proceed, treat that as approved backlog/intake signal, not an owner-decision blocker. Examples include `add DESIGN.md`, dependency hygiene, stale PR cleanup, WordPress.org visibility work, support triage, and docs architecture.

Before creating an issue, search:

- Existing open issues.
- Recently closed issues.
- Open PRs.
- Milestones and roadmap docs.
- Product docs and release docs when available.

Product-idea issues require web research first. Competitor names may inform private research but must not appear in public GitHub issue titles or bodies.

Avoid duplicates and vague umbrella issues. Prefer one issue per PR. If a milestone is specified, use it. If not specified, assign the issue to the appropriate current milestone based on release train, labels, scope, roadmap, and repo evidence.

For owner-mentioned intake, duplicate-screen, create or update the issue, assign `@mehul0810`, classify by type/complexity/risk, and prioritize into the nearest appropriate milestone or release train among the next three. Missing milestone due dates or branch-policy gaps are not blanket blockers; recommend the milestone/order and escalate only the missing metadata or unsafe ambiguity.

Do not blindly drain every issue in a milestone. Product implementation starts only after the milestone/release scope and priority set are defined. If scope or priority is unclear, the product thread should define the proposed set from repo evidence or request the decision before implementation.

If the current milestone has no ready work, continue to the next milestone's ready work. If no suitable ready issue exists, create proactive review work from the codebase and current ecosystem for scalability, modularity, performance, maintainability, dependency/tooling, UX/docs, WordPress.org visibility, accessibility, or sanitized hardening.

Use any relevant skill or capability for product-thread evidence: `wp-expert` for implementation/review, content/SEO skills for docs and visibility, security skills internally for sanitized hardening, web search for current ecosystem/docs, WordPress.org support and Advanced View review, and repo code review. Keep public issues/comments sanitized when security-sensitive.

Every created issue should include:

- Problem / context.
- Expected outcome.
- Acceptance criteria.
- Non-goals.
- Suggested milestone.
- Labels.
- Assignee: `@mehul0810`.
- Branch/base plan.
- Risk level.
- Validation expectations.
- Owner decisions needed, if any.

## Automation Split

- Portfolio heartbeat: every 2 hours, lighter, cross-product only, focused on state, conflicts, product-thread health, and owner decisions.
- Product heartbeat: hourly, per plugin, deeper, action-oriented, and responsible for product-level release readiness, intake, research, and planning.
- Active release/CI heartbeat: temporary and high-frequency only while a specific PR/release is actively moving.

If product work is being done in the portfolio heartbeat, classify it as workflow drift and route the work back to the product thread or update the skill/docs.

If product heartbeats hit setup-blocked delegation, recover first: complete direct non-code work, use read-only mapping paths, and try safe manual worktree routes before owner notification.

## WordPress.org Product Loop

Public plugin loops should follow current official WordPress.org docs. Use official docs as live sources when guidance is drift-prone.

Current guidance to preserve unless official docs change:

- The plugin readme controls the WordPress.org plugin page.
- Plan `Tested up to` WordPress 7.0 in the next compatible release for WordPress.org-hosted plugins.
- Tags are limited and should avoid competitor plugin names.
- Deeper docs belong on the product website.
- Support forum handling must stay forum-appropriate.

When hosted on WordPress.org, product threads should monitor support/forum activity, Advanced View signals, readme quality, tags, FAQ, screenshots, banners/icons, changelog, Playground/preview opportunities, and docs links.

## Owner Decision Authority

The orchestrator can flag conflicts with discipline, but the founder/owner makes final product decisions. If the owner overrides a recommendation, document the decision, proceed within guardrails, and keep explicit approval gates for release, privacy, security, pricing, destructive, and public-contract actions.

Escalate before prerelease/release creation, production deploy, ambiguous milestone retargeting, pricing/licensing/free-vs-pro changes, privacy/security posture changes, database/schema migrations, public API or breaking contract changes, or broad product positioning changes.

Reserve `Owner decisions needed` for production/beta release actions or non-reversible conflicts: creating production/beta releases or tags, publishing/deploying, declaring release approval, unsafe milestone inference, pricing/licensing/free-vs-pro, privacy/security posture, public API/schema/breaking contracts, destructive actions, or broad positioning. Normal product decisions, issue creation, labels, branch prep, PR review or merge for good non-production PRs, dependency/tooling work, docs work, and reversible backlog prioritization should continue without waiting.

When a release train is ready, notify the portfolio/owner with evidence: merged PRs, remaining open issues, CI/package validation, docs/release notes/readme/WordPress.org status, risks, and the exact production/beta release approval requested.

Security-sensitive findings must not become public issues and must not include exploit details, reproduction steps, or public `security issue` wording. Use sanitized hardening PRs with validation and minimal public detail.

Do not require owner comments to start with `Codex:`. Comments and reviews are evidence to read before work, stale-PR closure, PR creation, issue closure, or rescope decisions; labels, milestones, and hard gates determine ready state.

## Aculect First Default

Support multi-product ownership, but the operational default is Aculect AI Companion first. Apply this workflow there first and add more products only after the workflow proves stable.

## CTO Check-In Format

Use this compact status format:

```text
Product:
Thread role:
Verified source of truth:
Active production release and prerelease:
Active milestone and due date:
Open PRs/issues and CI/release blockers:
Ownership labels and owner comments/reviews:
Product-thread health:
Current strategy:
Delegation decision:
Issues created/updated:
Delegated threads/worktrees:
PR status:
Validation:
Risks:
Owner decisions needed:
Next action:
Stop condition:
```
