# Agent Instructions

Use `$wp-product-orchestrator` for autonomous issue/PR coordination, queue triage, plugin/theme development workflow, live proof, and release readiness.

Use `$wp-expert` for implementation details, architecture, plugin/theme/block/FSE decisions, performance, security, UX, testing, and WordPress.org/WPVIP standards.

## Repo Rules

- Read `PRODUCT.md` before judging product fit or autonomous scope.
- Read release docs and milestones before creating branches or PRs.
- PRs for issue work must target the release branch implied by the issue milestone when that branch exists.
- Work one issue/PR at a time unless the user explicitly asks for broader planning.
- Commit focused validated changes. Push only when authorized by the user or project workflow.
- Do not merge, close, release, deploy, publish to WordPress.org, change licensing/pricing/free-pro boundaries, or run destructive migrations without explicit current permission.
- Use REST endpoints for new interactive behavior when REST fits; avoid new `admin-ajax.php`.
- Preserve launched public contracts. Do not add compatibility shims for abandoned intermediate shapes of unreleased work.
- Add or update tests when behavior, security, data, editor, release, or scale risk warrants it.
- Before saying done, report validation and live-proof coverage or the exact proof gap.
