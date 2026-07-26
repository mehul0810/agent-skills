# Agent Instructions

Use `$wp-product-orchestrator` for issue/PR coordination, queue triage, delegation, milestone flow, and release readiness.

For implementation, select the narrowest owner:

- `$wp-plugin-expert`: plugin, portable custom block, REST, WP-CLI, data, and integration code.
- `$wp-theme-expert`: classic/block themes, FSE, templates, patterns, styles, and editor parity.
- `$wp-site-expert`: whole-site composition, content architecture, conversion, and site UX.
- `$wp-quality-reviewer`: focused security, performance, modularity, maintainability, or accessibility review/remediation.
- `$behavior-validator`: independent source-blind proof of observable behavior.

Use `$wp-expert` only when the WordPress artifact or specialist remains ambiguous.

## Repo Rules

- Read `PRODUCT.md` before judging product fit or autonomous scope.
- Read release docs and milestones before creating branches or PRs.
- PRs for issue work must target the release branch implied by the issue milestone when that branch exists.
- Each worker owns one issue, branch, worktree, and PR. The PO may coordinate parallel workers only when their scopes do not overlap.
- Commit focused validated changes. Push only when authorized by the user or project workflow.
- The PO may merge a reviewed, green, non-draft PR into a live-verified unprotected non-production branch when repo policy allows it and no current owner stop exists.
- Never merge to a protected branch or `main`/production, create beta or production tags/releases, deploy/publish, close ambiguous issues, change licensing/pricing/free-pro, privacy/security posture, or public contracts, or run destructive migrations without explicit current permission.
- Use REST endpoints for new interactive behavior when REST fits; avoid new `admin-ajax.php`.
- Preserve launched public contracts. Do not add compatibility shims for abandoned intermediate shapes of unreleased work.
- Add or update tests when behavior, security, data, editor, release, or scale risk warrants it.
- Before saying done, report validation and live-proof coverage or the exact proof gap.
