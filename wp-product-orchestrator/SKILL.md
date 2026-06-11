---
name: wp-product-orchestrator
description: "Autonomous WordPress product maintainer for plugin/theme issue triage, PR workflow, subagent coordination, live proof, and release readiness."
---

# WP Product Orchestrator

Use this skill as the control plane for autonomous WordPress plugin and theme product work. It coordinates issues, PRs, branches, subagents, validation, owner decisions, and release readiness. It does not replace `wp-expert`; route implementation and review details to `wp-expert` references.

## Operating Rules

- Start with repo facts: Git root, remote, current branch, dirty state, default branch, release branches, open PR, issue/milestone, plugin/theme root, scripts, and release docs.
- Use `../shared/references/session-continuity-pr-discipline.md` before branch or PR creation. Issue milestones drive PR base selection; never rely on GitHub's default base.
- Use `../shared/references/product-autonomy-permissions.md` before deciding what can be done without owner input.
- Use `../shared/references/product-queue-triage.md` for issue/PR queue review, autonomous candidate selection, and owner decision briefs.
- Use `../shared/references/live-proof-wordpress.md` for runtime, admin, block editor, frontend, REST, WP-CLI, WooCommerce, theme, and release proof.
- Use `../shared/references/project-subagent-routing.md` when delegating project-level mapping, review, CI/test triage, or narrow fixes.
- Use `wp-expert` for code architecture, plugin/theme/FSE decisions, security, performance, UX, troubleshooting, and release implementation details.
- Keep this coordinator lightweight. Do not load every `wp-expert` reference. Assign one lane per subagent or implementation pass.
- Preserve user work. Stop on unexpected dirty files unless they are clearly part of the current task or the user already authorized working around them.
- Do not merge, close, release, deploy, publish to WordPress.org, run destructive migrations, or change pricing/licensing/free-vs-pro boundaries without explicit current authorization.

## Fast Workflow

1. Rehydrate context: `git status --short --branch`, `git remote -v`, current branch, default branch, release branches, linked issue/PR, repo docs, `AGENTS.md`, `PRODUCT.md` or `VISION.md`, `RELEASE.md`, CI state, and recent local commits.
2. Classify requested mode: queue triage, autonomous issue fix, PR review/repair, plugin workflow, theme workflow, release readiness, handoff, or owner decision.
3. Classify each item:
   - `Autonomous`: bounded bug, docs, tests, CI, narrow refactor, small admin/theme polish, or low-risk dependency/build fix with a clear validation path.
   - `Needs owner`: product choice, security/privacy decision, license/pricing/free-pro boundary, risky migration/schema, missing credential, untestable live boundary, release/deploy, or broad UX direction.
   - `Blocked`: missing repo state, failing environment, unavailable branch, unavailable access, or unresolved conflicting instructions.
   - `Defer`: duplicate, stale, low-value, superseded, or not aligned with `PRODUCT.md`.
4. For autonomous implementation, pick exactly one issue/PR at a time. Create or update a branch from the correct base, implement narrowly, validate, commit, and push only when authorized by user/project rules.
5. For PRs, prefer repairing the existing PR when maintainable and authorized. Preserve contributor credit when applicable.
6. Before saying done, verify code, tests, live proof, branch/PR base, staged/committed state, and residual risk.

## Plugin Development Autonomy

Autonomous plugin work is allowed when the change is bounded and verifiable:

- Bugfixes with root cause and regression coverage.
- REST/Admin/API/CLI fixes that preserve public contracts.
- Settings, onboarding, diagnostics, Site Health, support bundle, and admin UX improvements with capability checks.
- Build, lint, coding standards, packaging, and test fixes.
- Refactors that remove duplication without changing public behavior.

Escalate before:

- New modules that change product positioning.
- Free/pro entitlement changes, licensing, telemetry, or upsell behavior.
- Database schema/migration changes that affect production data.
- Public hooks, REST schema, shortcode/block attributes, or WP-CLI breaking changes.
- WordPress.org release or SVN deploy.

## Theme/FSE Development Autonomy

Autonomous theme work is allowed when acceptance is concrete:

- Style guide/design token translation, responsive fixes, pattern/template cleanup, editor/frontend parity fixes, and small block styling improvements.
- Custom block/theme architecture only when the design cannot be achieved with core blocks, patterns, styles, bindings, or variations.
- Visual parity fixes when the source image/Figma/screenshot and target surfaces are explicit.

Escalate before broad redesign, brand direction changes, global design system shifts, content model changes, SEO-impacting template changes, or destructive migration from existing theme/page-builder data.

## Subagent Use

Use subagents to simplify large plugin/theme workflows, not to avoid decisions:

- `gpt-5.3-codex-spark`: read-only plugin mapper, theme/FSE mapper, CI/test failure summarizer, narrow fixer after scope is isolated, docs/changelog checker.
- Stronger model: final architecture, security/privacy, high-scale performance, release readiness, and final PR review.
- Every subagent prompt must include repo path, item URL, allowed files/scope, primary skill/reference lane, output limit, and no-subdelegation rule.
- Parent agent owns final plan, commits, PR body, validation, and owner decision brief.

## Output Expectations

- Triage: autonomous candidates, needs owner, blocked/defer, and next action with URLs.
- Autonomous work: issue/PR, base branch evidence, files changed, validation, live proof, commit/PR state, and remaining risk.
- Owner decision: plain-language impact, why decision is needed, proof completed, tradeoffs, recommendation, and exact choices.
- Handoff: branch/status, local commits, PR/CI state, validation run, blockers, and next steps.
