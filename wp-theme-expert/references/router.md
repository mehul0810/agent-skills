# WP Theme Expert Router

Use this router only after `wp-theme-expert` is selected. Load one primary reference for the core theme/FSE deliverable, then at most one support reference for confirmed visual, editing, performance, or vendor risk.

## Primary Routes

- Block themes, FSE architecture, `theme.json`, templates, parts, patterns: `../../wp-expert/references/block-theme-architecture.md`.
- Screenshot/Figma/image/mockup to editable WordPress implementation: `../../shared/references/visual-to-wordpress-implementation.md`.
- Detailed custom block-theme/FSE architecture after a confirmed ownership or block-mapping risk: `../../wp-expert/references/custom-block-theme-from-design.md`.
- Classic themes, child themes, block editor compatibility: `../../wp-expert/references/theme-and-block-editor.md`.
- Style guides, design tokens, custom themes, child-theme translation: `../../wp-expert/references/style-guide-theme-translation.md`.
- Visual parity and screenshot regression: `../../wp-expert/references/visual-parity-regression.md`.
- Theme/frontend performance, Core Web Vitals, fonts/images/assets: `../../wp-expert/references/theme-frontend-performance-quality-gate.md`.
- WordPress Design System and block editor components: `../../wp-expert/references/wordpress-design-system.md`.
- Premium UI implementation and admin/editor UX: `../../wp-expert/references/ui-ux-pro-for-wordpress.md`.
- Ollie/Ollie Pro: `../../wp-expert/references/ollie-block-theme.md`.
- Blocksy/Blocksy Pro: `../../wp-expert/references/blocksy-theme.md`.
- Hybrid theme/page-builder migration: `../../wp-expert/references/hybrid-theme-migration-modernization.md`.
- Local HTTPS/browser testing blockers: `../../wp-expert/references/local-https-testing.md`.
- Ambiguous or cross-lane work: `../../wp-expert/references/reference-routing-map.md`.

## Always Keep Visible

- Preserve WordPress editability: templates provide structure and render Post Content; page-specific visible content belongs in page content, patterns, synced patterns, block bindings, or intentional data sources.
- Do not use Custom HTML or Shortcode blocks as a design shortcut when native blocks, patterns, block styles, or a custom block are the correct editable solution.
- Create custom blocks only when core blocks, variations, patterns, block styles, `theme.json`, block bindings, or existing project blocks cannot meet the design and editing contract safely.
- Keep editor/frontend parity, accessibility, responsive quality, and premium enterprise polish visible in every implementation decision.
