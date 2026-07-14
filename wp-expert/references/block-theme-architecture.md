# Block Theme And Block Architecture

Use this before building or refactoring blocks, block editor features, or block/FSE architecture. For supplied visuals, keep `../../shared/references/visual-to-wordpress-implementation.md` primary and load this only for a confirmed ownership, distribution, editing, or block-contract risk.

## Official Anchors

- Theme Handbook: `https://developer.wordpress.org/themes/`
- Theme release requirements: `https://developer.wordpress.org/themes/releasing-your-theme/`
- Global Settings and Styles: `https://developer.wordpress.org/themes/core-concepts/global-settings-and-styles/`
- Block Variations: `https://developer.wordpress.org/block-editor/reference-guides/block-api/block-variations/`
- Block Bindings: `https://developer.wordpress.org/block-editor/reference-guides/block-api/block-bindings/`
- Interactivity API: `https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/`

## Architecture Questions

Before code, decide:

- What is content, layout, design system, durable data, business behavior, and interaction?
- Who edits each area, from which WordPress surface, with what constraints?
- Must content or functionality survive a theme switch?
- Is the target a WordPress.org Theme Directory theme, commercial theme, or private/client/VIP theme?
- Which WordPress/Gutenberg versions, registered blocks/supports, browsers, and integrations are real targets?
- What are the empty, long, translated, missing-media, permission, error, responsive, and recovery states?

Verify runtime blocks/supports instead of inferring them from documentation.

## Distribution And Portability Gate

- WordPress.org Theme Directory themes must not ship custom blocks, shortcodes, CPTs, forms, or plugin territory. Put required functionality and durable block contracts in a companion plugin; run Theme Check and directory guidance before packaging.
- Private/client/VIP or commercial themes may own genuinely presentation-specific blocks only when the product contract permits it and losing them on theme switch is acceptable.
- If data, content semantics, public APIs, or user workflows must survive a theme change, plugin ownership wins regardless of visual coupling.
- Test theme switch/deactivation portability for plugin-owned content. Never leave irreplaceable content encoded only in a theme-specific block without an explicit migration/export path.

## Decision Stack

Use the first layer that preserves fidelity and safe editing:

1. Content/data model: post content, terms, meta, options, CPT/query data, or external data.
2. `theme.json`: tokens, settings, styles, templates/parts registration, and block constraints.
3. Templates and template parts: document structure and global regions.
4. Patterns and synced patterns: reusable compositions and intentional global content.
5. Registered core blocks and supports.
6. Block styles or variations.
7. Block bindings.
8. Existing project blocks.
9. Custom block with constrained `InnerBlocks`.
10. Dynamic block for server data, permissions, queries, or evolving markup.
11. Interactivity API for stateful frontend behavior.

Do not jump to custom code because the design looks custom.

## Editing Ownership

- Themes own presentation; plugins own durable functionality and data contracts.
- Page templates stay structural and render `<!-- wp:post-content /-->` when Pages > Edit owns the body.
- Page-specific copy, media, and CTAs belong in `post_content`, inserted patterns, or intentional data sources, not hidden template/pattern markup.
- Template parts own global chrome. Unsynced patterns are reusable starters; synced patterns own deliberately global content.
- Use `contentOnly`, template locking, allowed blocks, and `InnerBlocks` constraints proportionally. Protect structure without making normal content changes developer-dependent.
- Keep one source of truth per visible region; do not let template, pattern, page content, database override, and CSS compete.

## Existing And Custom Blocks

- Preserve block comments, attributes, saved markup, transforms, and deprecations. Add migrations or use dynamic rendering when markup contracts change.
- Validate insert, edit, save, reload, copy/paste, transform, undo/revision, and frontend render behavior.
- Define custom blocks through `block.json`; keep attributes/data ownership explicit and inputs untrusted.
- Use `InnerBlocks`, parent/ancestor/child relationships, allowed blocks, templates, and locking for safe composition.
- Keep inspector controls purposeful. Prefer presets and semantic choices over exposing raw CSS knobs.
- Scope editor/frontend/view assets precisely and load interaction code only when needed.

## FSE Build Sequence

1. Classify distribution and theme/plugin/content ownership.
2. Verify runtime blocks/supports and establish content/component contracts.
3. Build semantic tokens in `theme.json`.
4. Create the minimum structural templates and global parts.
5. Compose editable page sections with core blocks and patterns.
6. Add styles, variations, bindings, then justified custom/dynamic blocks where policy permits.
7. Add Interactivity API behavior only for real state.
8. Prove editor/frontend parity, visitor/author workflows, content stress, accessibility, responsiveness, performance, portability, and packaging.

## Validation

- No Custom HTML or Shortcode shortcut implements new design work.
- Distribution rules and Theme Check apply where relevant.
- Page-owned content is editable from the expected admin surface and survives save/reload.
- Blocks remain valid across the supported WordPress/Gutenberg range.
- Dynamic sources handle empty, unauthorized, stale, translated, long, and error states.
- CSS and assets are scoped and do not fight Core or user Global Styles.
- Theme switching preserves plugin-owned data/content or exposes the documented migration path.
- Site Editor database overrides are reconciled through the core-first workflow.
