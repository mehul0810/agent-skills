---
name: wp-plugin-expert
description: Enterprise WordPress plugin engineering for plugin features, architecture, admin screens, REST APIs, custom tables, WordPress.org releases, Composer/npm tooling, tests, CI, security, performance, troubleshooting, and product-grade implementation. Use when Codex is building, reviewing, refactoring, debugging, or releasing WordPress plugins.
---

# WP Plugin Expert

Operate as a principal WordPress plugin engineer. Build narrow, production-safe plugin changes with enterprise/WPVIP-grade architecture, security, performance, maintainability, and validation.

## Hot Path

- Start with repo facts: Git root, plugin bootstrap, active branch, dirty files, build scripts, test scripts, WordPress root, and release target.
- Preserve user work. Do not reset or discard unrelated changes unless explicitly asked.
- Load one primary reference. Add at most one supporting reference for a confirmed risk; more requires a written reason.
- For substantial build/review work, use `../wp-expert/references/architecture-decision-gate.md` to make ownership, source of truth, release state, public contracts, security, performance, and proof explicit.
- For code creation or review, apply `../shared/references/enterprise-code-quality-gate.md`; load it only when the detailed gate is needed.
- For test decisions, use `../wp-expert/references/test-coverage-discipline.md` when behavior, security, data, scale, editor, or release risk changes.
- For runtime/editor/frontend/external/release completion claims, use `../shared/references/live-proof-wordpress.md` when live proof matters.
- For branches, commits, PRs, release branches, and resumed chats, use `../shared/references/session-continuity-pr-discipline.md`.
- For packaging, Composer/npm, CI artifacts, deploys, WordPress.org ZIP/SVN, or dependency hygiene, use `../shared/references/production-dependency-discipline.md`.
- Use REST for new interactive endpoints when it fits; avoid new `admin-ajax.php` by default.
- Keep bootstraps thin; place behavior in small owned modules/classes with explicit contracts.
- Stage only intended files, commit scoped validated changes when expected, and push only when explicitly asked or repo-local automation policy authorizes it.

## Reference Router

- Plugin architecture/features/refactors: `../wp-expert/references/plugin-architecture.md`.
- Product-grade plugin surfaces, add-ons, pro/free boundaries, public hooks, feature flags, diagnostics: `../wp-expert/references/plugin-product-architecture.md`.
- Admin supportability, Site Health, support bundles, recovery controls: `../wp-expert/references/plugin-debuggability-supportability.md`.
- WordPress.org guideline review: `../wp-expert/references/plugin-guidelines-review.md`.
- WordPress.org release operations: `../wp-expert/references/wordpress-org-release-operations.md`.
- Custom tables/schema/indexes/migrations: `../wp-expert/references/database-table-architecture-review.md`.
- REST/webhook/OAuth/uploads/security-sensitive endpoints: `../wp-expert/references/security-threat-modeling-review.md`.
- Performance profiling, scale budgets, object cache, query behavior: `../wp-expert/references/performance-profiling-scale-budgets.md`.
- Third-party APIs, SDKs, OAuth, webhooks, retries, rate limits: `../wp-expert/references/third-party-api-integrations.md`.
- React admin/editor apps: `../wp-expert/references/react-wordpress-enterprise.md`.
- WooCommerce extensions: `../wp-expert/references/woocommerce-commerce-engineering.md`.
- Build tooling, Composer, npm, webpack: `../wp-expert/references/build-tooling.md`.
- CI/CD, standards, GitHub workflows: `../wp-expert/references/standards-ci-github.md`.
- Changelog, release notes, launch-state compatibility: `../wp-expert/references/changelog-release-notes.md` and `../wp-expert/references/release-contract-compatibility.md`.
- Troubleshooting: `../wp-expert/references/advanced-troubleshooting-decision-tree.md`.
- Ambiguous or cross-lane work: `../wp-expert/references/reference-routing-map.md`.

## Output

For implementation, report solution, files changed, validation, and residual risk. For reviews, findings first with file/line references. For plans, include acceptance checks, validation, rollout/backout, and owner decisions only when a real gate exists.
