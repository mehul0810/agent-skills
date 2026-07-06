# WP Plugin Expert Router

Use this router only after `wp-plugin-expert` is selected. Load one primary reference for the core deliverable, then at most one support reference for a confirmed risk.

## Primary Routes

- Plugin architecture/features/refactors: `../../wp-expert/references/plugin-architecture.md`.
- Product-grade plugin surfaces, add-ons, pro/free boundaries, public hooks, feature flags, diagnostics: `../../wp-expert/references/plugin-product-architecture.md`.
- Admin supportability, Site Health, support bundles, recovery controls: `../../wp-expert/references/plugin-debuggability-supportability.md`.
- WordPress.org guideline review: `../../wp-expert/references/plugin-guidelines-review.md`.
- WordPress.org release operations: `../../wp-expert/references/wordpress-org-release-operations.md`.
- Custom tables/schema/indexes/migrations: `../../wp-expert/references/database-table-architecture-review.md`.
- REST/webhook/OAuth/uploads/security-sensitive endpoints: `../../wp-expert/references/security-threat-modeling-review.md`.
- Performance profiling, scale budgets, object cache, query behavior: `../../wp-expert/references/performance-profiling-scale-budgets.md`.
- Third-party APIs, SDKs, OAuth, webhooks, retries, rate limits: `../../wp-expert/references/third-party-api-integrations.md`.
- React admin/editor apps: `../../wp-expert/references/react-wordpress-enterprise.md`.
- WooCommerce extensions: `../../wp-expert/references/woocommerce-commerce-engineering.md`.
- Build tooling, Composer, npm, webpack: `../../wp-expert/references/build-tooling.md`.
- CI/CD, standards, GitHub workflows: `../../wp-expert/references/standards-ci-github.md`.
- Changelog or launch-state compatibility: `../../wp-expert/references/changelog-release-notes.md` or `../../wp-expert/references/release-contract-compatibility.md`.
- Troubleshooting: `../../wp-expert/references/advanced-troubleshooting-decision-tree.md`.
- Ambiguous or cross-lane work: `../../wp-expert/references/reference-routing-map.md`.

## Always Keep Visible

- Use REST for new interactive endpoints when it fits; avoid new `admin-ajax.php` by default.
- Keep bootstraps thin and behavior in small owned modules/classes with explicit contracts.
- Preserve launched public contracts and real production data; do not add compatibility for abandoned intermediate shapes of unreleased work.
- Stage only intended files, commit scoped validated changes when expected, and push only when explicitly asked or repo-local automation authorizes it.
