# WP Plugin Expert Router

Use this router only after `wp-plugin-expert` is selected. Load one primary reference for the core deliverable, then at most one support reference for a confirmed risk.

## Primary Routes

- Enterprise implementation/review preparation, hardening, or quality classification: `../../shared/references/enterprise-code-quality-gate.md`; when it classifies risk as elevated, use `../../shared/references/enterprise-runtime-assurance.md` as its single support.
- Focused independent security, performance, modularity/maintainability, or accessibility review or review-led remediation: route to `wp-quality-reviewer`; routine feature constraints and fixes stay with this plugin specialist.
- Cross-boundary engineering graph, missing project knowledge/docs, graph closure, and durable failure learning: `../../shared/references/wordpress-engineering-graph.md`.
- Compatibility, supply chain, production observation, recovery, and adaptive enterprise contracts: `../../shared/references/enterprise-runtime-assurance.md`.
- WordPress 7.0/7.1 APIs, editor changes, security baseline, compatibility testing, or `Tested up to`: `../../shared/references/wordpress-7-0-7-1-enterprise-compatibility.md`.
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
- Explicit VIP/enterprise candidate go/no-go and disaster recovery: `../../wp-expert/references/vip-enterprise-launch-readiness.md` or `../../wp-expert/references/disaster-recovery-business-continuity.md`; do not use this route for general enterprise implementation preparation.
- Third-party APIs, SDKs, OAuth, webhooks, retries, rate limits: `../../wp-expert/references/third-party-api-integrations.md`.
- React admin/editor apps: `../../wp-expert/references/react-wordpress-enterprise.md`.
- Existing Tailwind utility CSS, Tailwind v3/v4 migration, utility build/source discovery, Preflight scope, or an isolated React/app surface: `../../shared/references/tailwind-informed-frontend-engineering.md`; keep WPDS primary for native admin/editor work.
- Accessibility implementation constraints plus i18n, RTL/bidi, multilingual, light/dark/system, forced-colors, browser, and input-mode readiness: `../../wp-expert/references/accessibility-i18n-global-readiness.md`; use the reviewer for a focused accessibility audit.
- Screenshot/Figma/image/mockup to plugin-owned admin, editor, onboarding, or customer-facing implementation: `../../shared/references/visual-to-wordpress-implementation.md`.
- Stateful block or frontend interaction, Interactivity API directives, hydration, client-side navigation, or interaction lifecycle proof: `../../wp-expert/references/interactivity-api-frontend.md`.
- Premium plugin admin/editor UI, onboarding, settings, forms, state coverage, and operational UX: `../../wp-expert/references/ui-ux-pro-for-wordpress.md`.
- WordPress-native admin/editor components and tokens: `../../wp-expert/references/wordpress-design-system.md`.
- Distinctive plugin-owned customer-facing frontend or anti-template composition without a selected target: `../../shared/references/frontend-design-taste.md`.
- New or materially changed plugin-owned customer typography system, font selection, readable measure, type-scale tokens, or editor/frontend type parity: `../../shared/references/wordpress-typography-system.md`; keep native WordPress typography for routine wp-admin UI.
- Trend-led product UI, AI-generated/adaptive output, personalization, voice, kinetic typography, guided motion, or immersive/3D interaction: `../../shared/references/emerging-interface-design-contract.md`.
- Product experience defaults and onboarding lens: `../../shared/references/product-experience-principles.md`.
- Premium/enterprise workflow accountability and proof: `../../shared/references/enterprise-design-judgment.md`.
- WooCommerce extensions: `../../wp-expert/references/woocommerce-commerce-engineering.md`.
- Build tooling, Composer, npm, webpack: `../../wp-expert/references/build-tooling.md`.
- Production dependency classification, package/ZIP/SVN contents, CI artifacts, and dev-package exclusion: `../../shared/references/production-dependency-discipline.md`.
- CI/CD, standards, GitHub workflows: `../../wp-expert/references/standards-ci-github.md`.
- Changelog or launch-state compatibility: `../../wp-expert/references/changelog-release-notes.md` or `../../wp-expert/references/release-contract-compatibility.md`.
- Plugin milestone/release branch choreography, per-PR changelog field, candidate channels, and mainline release handoff: `../../shared/references/plugin-release-workflow.md`.
- Troubleshooting: `../../wp-expert/references/advanced-troubleshooting-decision-tree.md`.
- If the primary artifact changes or another lane owns the outcome, return a compact evidence handoff to `wp-expert` or the owning specialist; do not load another broad router.

## Always Keep Visible

- Use REST for new interactive endpoints when it fits; avoid new `admin-ajax.php` by default.
- Keep bootstraps thin and behavior in small owned modules/classes with explicit contracts.
- Preserve launched public contracts and real production data; do not add compatibility for abandoned intermediate shapes of unreleased work.
- Stage only intended files, commit scoped validated changes when expected, and push only when explicitly asked or repo-local automation authorizes it.
