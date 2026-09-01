# WP Theme Expert Router

Use this router only after `wp-theme-expert` is selected. Load one primary reference for the core theme/FSE deliverable, then at most one support reference for confirmed visual, editing, performance, or vendor risk.

## Primary Routes

- Focused independent security, performance, modularity/maintainability, or accessibility review or review-led remediation: route to `wp-quality-reviewer`; routine theme/FSE constraints and fixes stay with this specialist.
- Cross-boundary engineering graph, missing project knowledge/docs, graph closure, and durable failure learning: `../../shared/references/wordpress-engineering-graph.md`.
- Compatibility, supply chain, production observation, recovery, and adaptive enterprise contracts: `../../shared/references/enterprise-runtime-assurance.md`.
- WordPress 7.0/7.1 blocks, Global Styles, iframed editor, theme compatibility, or `Tested up to`: `../../shared/references/wordpress-7-0-7-1-enterprise-compatibility.md`.
- Theme/plugin/content ownership, public-contract, release, performance, or proof decisions: `../../wp-expert/references/architecture-decision-gate.md`.
- Block themes, FSE architecture, `theme.json`, templates, parts, patterns: `../../wp-expert/references/block-theme-architecture.md`.
- Runtime block inventory, core-first composition, editable render proof, and Site Editor override promotion/precedence: `../../shared/references/core-first-site-theme-workflow.md`.
- Page/post briefs, Core/plugin block selection, patterns/styles/variations, author guardrails, CSS governance, and WYSIWYG proof: `../../shared/references/block-editor-page-composition.md`.
- Screenshot/Figma/image/mockup to editable WordPress implementation: `../../shared/references/visual-to-wordpress-implementation.md`.
- Distinctive greenfield/redesign frontend direction or anti-template composition review without a selected target: `../../shared/references/frontend-design-taste.md`.
- New or materially changed theme typography system, font selection, readable measure, type-scale/Global Styles tokens, or editor/frontend type parity: `../../shared/references/wordpress-typography-system.md`.
- Trend-led composition, AI-generated/adaptive UI, personalization, voice, kinetic typography, guided scrolling, or immersive/3D interaction: `../../shared/references/emerging-interface-design-contract.md`.
- Detailed custom block-theme/FSE architecture after a confirmed ownership or block-mapping risk: `../../wp-expert/references/custom-block-theme-from-design.md`.
- Classic themes, child themes, block editor compatibility: `../../wp-expert/references/theme-and-block-editor.md`.
- Stateful block or frontend interaction, Interactivity API directives, hydration, client-side navigation, or interaction lifecycle proof: `../../wp-expert/references/interactivity-api-frontend.md`.
- Style guides, design tokens, custom themes, child-theme translation: `../../wp-expert/references/style-guide-theme-translation.md`.
- Existing Tailwind utility CSS, Tailwind v3/v4 migration, utility build/source discovery, or Preflight scope: `../../shared/references/tailwind-informed-frontend-engineering.md`; retain `theme.json`, blocks, patterns, and scoped theme CSS as the default owner.
- Deterministic visual parity, visitor/author workflows, content stress, responsive/browser evidence, and release proof: `../../wp-expert/references/visual-parity-regression.md`.
- Theme/frontend performance implementation budgets for Core Web Vitals, fonts/images/assets: `../../wp-expert/references/theme-frontend-performance-quality-gate.md`; use the reviewer for focused profiling or reassessment.
- Accessibility implementation constraints plus i18n, RTL/bidi, multilingual, light/dark/system, forced-colors, browser, and input-mode readiness: `../../wp-expert/references/accessibility-i18n-global-readiness.md`; use the reviewer for a focused accessibility audit.
- Enterprise launch, rollback, observability, or continuity: `../../wp-expert/references/vip-enterprise-launch-readiness.md`, `../../wp-expert/references/observability-incident-response.md`, or `../../wp-expert/references/disaster-recovery-business-continuity.md`.
- Local-first validation, standards, GitHub Actions, and release automation: `../../wp-expert/references/standards-ci-github.md`.
- WordPress Design System and block editor components: `../../wp-expert/references/wordpress-design-system.md`.
- Premium UI implementation and admin/editor UX: `../../wp-expert/references/ui-ux-pro-for-wordpress.md`.
- Plug-and-play product experience and advanced-user controls: `../../shared/references/product-experience-principles.md`.
- Enterprise proof, accountable IA, governance, and failure behavior: `../../shared/references/enterprise-design-judgment.md`.
- Ollie/Ollie Pro: `../../wp-expert/references/ollie-block-theme.md`.
- Blocksy/Blocksy Pro: `../../wp-expert/references/blocksy-theme.md`.
- Hybrid theme/page-builder migration: `../../wp-expert/references/hybrid-theme-migration-modernization.md`.
- Local HTTPS/browser testing blockers: `../../wp-expert/references/local-https-testing.md`.
- High-context continuation or compact/fresh-thread decision: `../../shared/references/context-window-discipline.md`.
- If the primary artifact changes or another lane owns the outcome, return a compact evidence handoff to `wp-expert` or the owning specialist; do not load another broad router.

## Always Keep Visible

- Preserve WordPress editability: templates provide structure and render Post Content; page-specific visible content belongs in page content, patterns, synced patterns, block bindings, or intentional data sources.
- Do not use Custom HTML or Shortcode blocks as a design shortcut when native blocks, patterns, block styles, or a custom block are the correct editable solution.
- Create custom blocks only when core blocks, variations, patterns, block styles, `theme.json`, block bindings, or existing project blocks cannot meet the design and editing contract safely.
- Classify WordPress.org Theme Directory, commercial, or private/client/VIP distribution before putting custom blocks or durable functionality in a theme.
- Keep editor/frontend parity, accessibility, responsive quality, and premium enterprise polish visible in every implementation decision.
