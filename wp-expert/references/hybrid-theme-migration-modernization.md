# Hybrid Theme Migration And Modernization

Use this for classic-to-block theme migration, page-builder-to-block migration, child theme modernization, WooCommerce template cleanup, block theme adoption, and preserving SEO/content while moving toward Full Site Editing or modern WordPress theme architecture.

Use alongside `theme-and-block-editor.md`, `block-theme-architecture.md`, `style-guide-theme-translation.md`, `content-migration-editorial-scale.md`, `technical-seo-engineering.md`, and `visual-parity-regression.md`.

## Migration Principles

- Preserve launched URLs, content, SEO signals, template behavior, and editorial workflows unless the project explicitly changes them.
- Modernize in phases; do not rewrite an entire theme when a hybrid path reduces risk.
- Separate presentation migration from durable data/functionality migration.
- Avoid Custom HTML and shortcode blocks for new layout implementation; use patterns, blocks, template parts, or custom blocks as needed.
- Keep rollback possible until the new theme/template path is proven.

## Current-State Audit

Inspect:

- Parent/child theme relationship, active templates, Customizer settings, widgets, menus, sidebars, template overrides, and `functions.php` hooks.
- Page builder usage, shortcode usage, reusable blocks, synced patterns, custom HTML blocks, and custom fields.
- WooCommerce template overrides and version drift.
- SEO-critical templates, schema, breadcrumbs, canonicals, redirects, and archive behavior.
- Build tooling, generated CSS/JS, font loading, image handling, and global CSS debt.
- Editorial workflows: who edits pages, templates, navigation, products, landing pages, and reusable sections.

## Migration Strategy Options

Choose the smallest safe strategy:

- Child theme cleanup: keep parent theme, remove brittle overrides, improve tokens/CSS, and preserve update path.
- Hybrid theme: keep classic templates where stable, add block patterns/template parts and editor styles gradually.
- Block theme migration: move templates, parts, patterns, and global styles to FSE when design/system ownership justifies it.
- Plugin extraction: move CPTs, meta, business logic, shortcodes, forms, and durable blocks out of the theme before theme replacement.
- Page-builder containment: freeze legacy builder pages, migrate priority templates first, and replace sections with block patterns over time.

## Content And SEO Preservation

- Map old templates to new templates and verify URL output.
- Preserve headings, schema, breadcrumbs, canonical tags, Open Graph/Twitter metadata, and pagination behavior.
- Keep redirect plans for any slug or URL changes.
- Migrate reusable sections to patterns/template parts with editor-friendly names.
- Preserve image alt text, captions, focal points, and responsive image behavior.
- Validate archive, search, 404, single, page, product, category, tag, author, and custom post type surfaces.

## WooCommerce Template Modernization

- Identify overridden templates and compare against current WooCommerce versions.
- Remove overrides that only duplicate default behavior.
- Prefer hooks, block patterns, Checkout Blocks, and theme styles over template copies when possible.
- Preserve payment, shipping, tax, coupon, account, email, and order-detail behavior.
- Validate product, cart, checkout, account, order received, and emails after cleanup.

## Acceptance Checks

- Critical URLs render with equivalent or intentionally improved content hierarchy.
- Editor can modify intended templates/parts/patterns without code edits.
- No invalid block warnings appear after save/reload.
- SEO-critical metadata and redirects are preserved.
- WooCommerce flows remain functional when affected.
- Performance and visual parity are checked on priority templates.
- Rollback path is documented for theme switch, template rollback, and migrated content.
