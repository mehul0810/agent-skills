# WP Site Expert Router

Use this router only after `wp-site-expert` is selected. Load one primary reference for the site outcome, then at most one support reference for confirmed search, UX, tracking, migration, privacy, or performance risk.

## Primary Routes

- Focused independent security, performance, modularity/maintainability, or accessibility review or review-led remediation: route to `wp-quality-reviewer`; routine site delivery constraints and fixes stay with this specialist.
- Cross-boundary engineering graph, missing project knowledge/docs, graph closure, and durable failure learning: `../../shared/references/wordpress-engineering-graph.md`.
- Compatibility, supply chain, production observation, recovery, and adaptive enterprise contracts: `../../shared/references/enterprise-runtime-assurance.md`.
- WordPress 7.0/7.1 site upgrade, editor/media behavior, runtime block inventory, or compatibility proof: `../../shared/references/wordpress-7-0-7-1-enterprise-compatibility.md`.
- Source-of-truth, ownership, public-contract, release, performance, privacy, or proof decisions: `../../wp-expert/references/architecture-decision-gate.md`.
- Conversion-focused landing pages, funnels, CRO-safe implementation: `../../wp-expert/references/conversion-focused-website-engineering.md`.
- UX discovery, IA, user journeys, UX writing, design QA: `../../wp-expert/references/ux-product-strategy-design-qa.md`.
- Premium UI implementation, states, dashboards, forms: `../../wp-expert/references/ui-ux-pro-for-wordpress.md`.
- Distinctive greenfield/redesign frontend direction or anti-template composition review without a selected target: `../../shared/references/frontend-design-taste.md`.
- New or materially changed website typography system, font selection, readable measure, type-scale tokens, or editor/frontend type parity: `../../shared/references/wordpress-typography-system.md`.
- Trend-led composition, AI-generated/adaptive UI, personalization, voice, kinetic typography, guided scrolling, or immersive/3D interaction: `../../shared/references/emerging-interface-design-contract.md`.
- Direct visual-to-WordPress implementation from screenshot/Figma/image/mockup to an editable site/page: `../../shared/references/visual-to-wordpress-implementation.md`.
- Material spacing, alignment, grid, density, or responsive-composition risk: `../../shared/references/spatial-layout-and-alignment-system.md`; with a selected visual target, keep visual implementation primary and use this as the single support.
- Existing Tailwind utility CSS, Tailwind v3/v4 migration, utility build/source discovery, or Preflight scope: `../../shared/references/tailwind-informed-frontend-engineering.md`; use it only as the support reference when implementation stack behavior is the confirmed risk.
- Plug-and-play product experience and advanced-user controls: `../../shared/references/product-experience-principles.md`.
- Enterprise proof, accountable IA, governance, and failure behavior: `../../shared/references/enterprise-design-judgment.md`.
- Technical SEO, canonicals, redirects, sitemaps, schema, crawl risk: `../../wp-expert/references/technical-seo-engineering.md`.
- Analytics, GA4/GTM/data layer, consent-aware tracking: `../../wp-expert/references/analytics-measurement-engineering.md`.
- Content modeling, CPT/taxonomy/meta/block/custom-table decisions: `../../wp-expert/references/content-modeling-information-architecture.md`.
- Block Editor page/post structure, Core/plugin block selection, patterns/styles/variations, author usability, CSS governance, and WYSIWYG proof: `../../shared/references/block-editor-page-composition.md`.
- Runtime block inventory, core-first page composition, editable render proof, and Site Editor override precedence: `../../shared/references/core-first-site-theme-workflow.md`.
- Stateful block or site interaction, Interactivity API behavior, client-side navigation, or interaction lifecycle proof: `../../wp-expert/references/interactivity-api-frontend.md`.
- Content migration, editorial scale, redirects, launch cutovers: `../../wp-expert/references/content-migration-editorial-scale.md`.
- Accessibility implementation constraints plus i18n, RTL/bidi, multilingual, light/dark/system, forced-colors, browser, and input-mode readiness: `../../wp-expert/references/accessibility-i18n-global-readiness.md`; use the reviewer for a focused accessibility audit.
- Performance budgets and implementation constraints for Core Web Vitals and scale: `../../wp-expert/references/performance-profiling-scale-budgets.md`; use the reviewer for focused profiling or reassessment.
- Local-first validation, standards, GitHub Actions, and release automation: `../../wp-expert/references/standards-ci-github.md`.
- Edge caching/CDN and personalization: `../../wp-expert/references/edge-caching-cdn-architecture.md`.
- Headless/decoupled site architecture: `../../wp-expert/references/headless-decoupled-wordpress.md`.
- Local HTTPS/browser testing blockers: `../../wp-expert/references/local-https-testing.md`.
- Exact owner-provided values and calibrated proof: `../../wp-expert/references/planning-drift-control.md`.
- Enterprise launch, rollback, observability, or continuity: `../../wp-expert/references/vip-enterprise-launch-readiness.md`, `../../wp-expert/references/observability-incident-response.md`, or `../../wp-expert/references/disaster-recovery-business-continuity.md`.
- Web-heavy, current-policy, API, or source-backed research: `../../shared/references/research-token-discipline.md`.
- If the primary artifact changes or another lane owns the outcome, return a compact evidence handoff to `wp-expert` or the owning specialist; do not load another broad router.

## Always Keep Visible

- Prioritize admin-editable, WordPress-native solutions over hard-coded pages when the site owner should manage content.
- A block-managed page/post is incomplete until the intended non-technical author can create or insert its structure, edit representative content/media/links, save/reopen, and preview it without CSS or code.
- Keep mobile-first responsive architecture visible for visitor-facing and admin/editor-facing flows.
- Preserve premium and enterprise feel: clear IA, intentional hierarchy, strong copy, polished states, accessible interactions, fast perceived performance, and consistent design language.
- For exact user-provided CSS values, copy, or config, apply directly and confirm by diff unless runtime risk requires more.
