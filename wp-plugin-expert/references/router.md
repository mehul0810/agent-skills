# WP Plugin Expert Router

Use this router only after `wp-plugin-expert` is selected. Load one primary reference for the core deliverable, then at most one support reference for a confirmed risk.

## Primary Routes

- Focused independent security, performance, modularity/maintainability, or accessibility review or review-led remediation: route to `wp-quality-reviewer`; routine feature constraints and fixes stay with this plugin specialist.
- Cross-boundary engineering graph, missing project knowledge/docs, graph closure, and durable failure learning: `../../shared/references/wordpress-engineering-graph.md`.
- Compatibility, supply chain, production observation, recovery, and adaptive enterprise contracts: `../../shared/references/enterprise-runtime-assurance.md`.
- Isolated source-of-truth, ownership, public-contract, release, security, performance, or proof decision: `../../wp-expert/references/architecture-decision-gate.md`.
- Plugin architecture/features/refactors: `../../wp-expert/references/plugin-architecture.md`.
- Plugin-owned portable custom blocks, `block.json`, static/dynamic rendering, attributes, transforms/deprecations, block bindings, and Interactivity API: `../../wp-expert/references/theme-and-block-editor.md`.
- Product-grade plugin surfaces, add-ons, pro/free boundaries, public hooks, feature flags, diagnostics: `../../wp-expert/references/plugin-product-architecture.md`.
- Admin supportability, Site Health, support bundles, recovery controls: `../../wp-expert/references/plugin-debuggability-supportability.md`.
- WordPress.org guideline review: `../../wp-expert/references/plugin-guidelines-review.md`.
- WordPress.org release operations: `../../wp-expert/references/wordpress-org-release-operations.md`.
- Custom tables/schema/indexes/migrations: `../../wp-expert/references/database-table-architecture-review.md`.
- REST/webhook/OAuth/uploads implementation constraints for security-sensitive endpoints: `../../wp-expert/references/security-threat-modeling-review.md`; use the reviewer for a focused audit.
- Performance budgets and implementation constraints for scale, object cache, and query behavior: `../../wp-expert/references/performance-profiling-scale-budgets.md`; use the reviewer for focused profiling or reassessment.
- Privacy, consent, telemetry, retention, exporter/eraser support: `../../wp-expert/references/privacy-consent-data-governance.md`.
- Multisite/network activation, tenant scope, and large-fleet operations: `../../wp-expert/references/advanced-multisite-network-engineering.md`.
- Incidents, SLOs, monitoring, logs, and operational recovery: `../../wp-expert/references/observability-incident-response.md`.
- VIP/enterprise launch readiness and disaster recovery: `../../wp-expert/references/vip-enterprise-launch-readiness.md` or `../../wp-expert/references/disaster-recovery-business-continuity.md`.
- Third-party APIs, SDKs, OAuth, webhooks, retries, rate limits: `../../wp-expert/references/third-party-api-integrations.md`.
- React admin/editor apps: `../../wp-expert/references/react-wordpress-enterprise.md`.
- Product experience defaults and onboarding lens: `../../shared/references/product-experience-principles.md`.
- Premium/enterprise workflow accountability and proof: `../../shared/references/enterprise-design-judgment.md`.
- WooCommerce extensions: `../../wp-expert/references/woocommerce-commerce-engineering.md`.
- Build tooling, Composer, npm, webpack: `../../wp-expert/references/build-tooling.md`.
- CI/CD, standards, GitHub workflows: `../../wp-expert/references/standards-ci-github.md`.
- Changelog or launch-state compatibility: `../../wp-expert/references/changelog-release-notes.md` or `../../wp-expert/references/release-contract-compatibility.md`.
- Troubleshooting: `../../wp-expert/references/advanced-troubleshooting-decision-tree.md`.
- If the primary artifact changes or another lane owns the outcome, return a compact evidence handoff to `wp-expert` or the owning specialist; do not load another broad router.

## Always Keep Visible

- Use REST for new interactive endpoints when it fits; avoid new `admin-ajax.php` by default.
- Keep bootstraps thin and behavior in small owned modules/classes with explicit contracts.
- Preserve launched public contracts and real production data; do not add compatibility for abandoned intermediate shapes of unreleased work.
- Stage only intended files, commit scoped validated changes when expected, and push only when explicitly asked or repo-local automation authorizes it.
