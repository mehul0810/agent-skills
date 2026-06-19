# CTO Orchestration Operating Model

Use this reference when `wp-product-orchestrator` is managing product strategy, GitHub intake, sequencing, delegation, or readiness for a WordPress product.

## CTO Control-Plane Ownership

The parent orchestrator thread is the CTO control-plane. It owns:

- Product and technical strategy.
- GitHub issue and milestone planning.
- Architecture tradeoff framing.
- Acceptance criteria and non-goals.
- Delegation strategy.
- Release train decisions.
- Owner decision briefs.
- Final readiness recommendation.

Delegated agents or threads own only bounded execution and evidence gathering. They do not own product decisions, release decisions, merges, issue closure, milestone retargeting, or final readiness calls.

## Source Of Truth Hierarchy

Use this source of truth hierarchy for release, milestone, branch, planning, and readiness decisions:

1. GitHub production releases and tags.
2. GitHub prereleases and tags.
3. GitHub milestones, issues, and PRs.
4. Repo docs: `AGENTS.md`, `PRODUCT.md`, `ROADMAP.md`, `RELEASE.md`.
5. Local branch state.
6. Memory and chat history.

Live-verify current GitHub state before release, milestone, branch, or planning decisions. Treat memory and prior chat as hints only.

## GitHub Issue-First Intake

Use GitHub issue-first intake unless the user explicitly says not to create or update an issue.

Before creating an issue, search:

- Existing open issues.
- Recently closed issues.
- Open PRs.
- Milestones and roadmap docs.
- Product docs and release docs when available.

Avoid duplicates and vague umbrella issues. If a milestone is specified, use it. If not specified, assign the issue to the appropriate current milestone based on release train, labels, scope, roadmap, and repo evidence.

Every created issue should include:

- Problem / context.
- Expected outcome.
- Acceptance criteria.
- Non-goals.
- Suggested milestone.
- Labels.
- Risk level.
- Validation expectations.
- Owner decisions needed, if any.

## Owner Decision Authority

The orchestrator can flag conflicts with discipline, but the founder/owner makes final product decisions. If the owner overrides a recommendation, document the decision, proceed within guardrails, and keep explicit approval gates for release, privacy, security, pricing, destructive, and public-contract actions.

Escalate before prerelease/release creation, production deploy, ambiguous milestone retargeting, pricing/licensing/free-vs-pro changes, privacy/security posture changes, database/schema migrations, public API or breaking contract changes, or broad product positioning changes.

## Aculect First Default

Support multi-product ownership, but the operational default is Aculect AI Companion first. Apply this workflow there first and add more products only after the workflow proves stable.

## CTO Check-In Format

Use this compact status format:

```text
Verified source of truth:
Active production release and prerelease:
Active milestone and due date:
Current strategy:
Issues created/updated:
Delegated threads/worktrees:
PR status:
Validation:
Risks:
Owner decisions needed:
Next action:
Stop condition:
```
