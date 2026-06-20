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

For setup-blocked delegation, the portfolio thread should request exact saved Codex projects for every managed plugin repo root. Ask the owner before interrupting, recreating, or forking user-created product-orchestrator threads.

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
- CI or release blockers.
- Owner `Codex:` instructions.
- Local dirty state when the repo is touched.
- Product-thread and delegated/skill work.

Only after this sweep should the portfolio thread choose the highest-leverage governance action. If one product consumes owner attention, the final report still needs every product's verified status and next action/stop condition. Quiet products must be included with `No action after verification`.

## GitHub Issue-First Intake

Use GitHub issue-first intake unless the user explicitly says not to create or update an issue.

Before creating an issue, search:

- Existing open issues.
- Recently closed issues.
- Open PRs.
- Milestones and roadmap docs.
- Product docs and release docs when available.

Product-idea issues require web research first. Competitor names may inform private research but must not appear in public GitHub issue titles or bodies.

Avoid duplicates and vague umbrella issues. Prefer one issue per PR. If a milestone is specified, use it. If not specified, assign the issue to the appropriate current milestone based on release train, labels, scope, roadmap, and repo evidence.

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

- Portfolio heartbeat: lighter, cross-product only, focused on state, conflicts, product-thread health, and owner decisions.
- Product heartbeat: per plugin, deeper, action-oriented, and responsible for product-level intake/research/planning.
- Active release/CI heartbeat: temporary and high-frequency only while a specific PR/release is actively moving.

If product work is being done in the portfolio heartbeat, classify it as workflow drift and route the work back to the product thread or update the skill/docs.

If product heartbeats are setup-blocked because exact repo-root projects are missing, avoid noisy polling. Report `DONT_NOTIFY/setup-blocked` unless there is a new owner or source-of-truth signal.

## WordPress.org Product Loop

Public plugin loops should follow current official WordPress.org docs. Use official docs as live sources when guidance is drift-prone.

Current guidance to preserve unless official docs change:

- The plugin readme controls the WordPress.org plugin page.
- Tags are limited and should avoid competitor plugin names.
- Deeper docs belong on the product website.
- Support forum handling must stay forum-appropriate.

When hosted on WordPress.org, product threads should monitor support/forum activity, Advanced View signals, readme quality, tags, FAQ, screenshots, banners/icons, changelog, Playground/preview opportunities, and docs links.

## Owner Decision Authority

The orchestrator can flag conflicts with discipline, but the founder/owner makes final product decisions. If the owner overrides a recommendation, document the decision, proceed within guardrails, and keep explicit approval gates for release, privacy, security, pricing, destructive, and public-contract actions.

Escalate before prerelease/release creation, production deploy, ambiguous milestone retargeting, pricing/licensing/free-vs-pro changes, privacy/security posture changes, database/schema migrations, public API or breaking contract changes, or broad product positioning changes.

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
Owner Codex instructions:
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
