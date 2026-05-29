# Block Theme And Block Architecture

Use this before building or refactoring blocks, block editor features, or a block-based FSE theme. The goal is to choose the right WordPress-native layer before writing code. For style guides, design tokens, custom themes, or child themes on top of an existing theme, also read `style-guide-theme-translation.md`. For UX discovery, information architecture, premium/enterprise design QA, or pixel-faithful implementation from an image/screenshot/mockup, also read `ux-product-strategy-design-qa.md`.

## Official Anchors

- Theme Handbook: `https://developer.wordpress.org/themes/`
- Global Settings and Styles: `https://developer.wordpress.org/themes/core-concepts/global-settings-and-styles/`
- Template Parts: `https://developer.wordpress.org/themes/templates/template-parts/`
- Block Variations API: `https://developer.wordpress.org/block-editor/reference-guides/block-api/block-variations/`
- InnerBlocks: `https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/nested-blocks-inner-blocks/`
- Block Bindings API: `https://developer.wordpress.org/block-editor/reference-guides/block-api/block-bindings/`
- Interactivity API: `https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/`

## Architecture First Questions

Answer these before implementation:

- What is content, what is layout, what is design system, what is dynamic data, and what is interaction?
- What style guide, design token system, parent theme, or child theme constraints must be respected?
- Who should edit each part: site admin, editor, content author, developer, or data source?
- Should this survive a theme switch? If yes, plugin or custom block ownership is likely; if no, theme patterns/templates/styles may be enough.
- Is the section reusable as a design composition, a global region, a data-driven component, or a one-off template structure?
- What must be locked to preserve design integrity, and what must remain editable to avoid developer dependency?
- What are the empty, long-content, translated, missing-media, permission, and responsive states?

## Ownership Rules

- Theme owns presentation: `theme.json`, templates, template parts, patterns, style variations, block styles, and theme-specific CSS.
- Plugin owns durable functionality: custom post types, taxonomies, options, meta contracts, REST routes, business rules, data integrations, and blocks that should work across themes.
- Custom blocks can live in a theme only when they are genuinely theme-specific and safe to lose on theme switch.
- Do not put business data or irreplaceable content solely into theme files or hard-coded pattern markup.

## Decision Stack

Use the first layer that satisfies the requirement without making editing fragile:

1. Content model: post content, post meta, terms, users, options, CPTs, query data, or external API data.
2. `theme.json`: tokens, settings, styles, custom templates, template parts registration, pattern references, and block-level style constraints.
3. Templates and template parts: page/document structure and reusable global regions.
4. Patterns: reusable section compositions editors can insert and adapt.
5. Core blocks: native blocks with supports, layout, typography, color, spacing, border, shadow, and alignment.
6. Block styles: alternate visual treatment with a CSS class only.
7. Block variations: predefined attributes or inner blocks for an existing block.
8. Block bindings: connect supported block attributes to dynamic sources without custom editing UI.
9. Custom block with `InnerBlocks`: structured container where editors still compose content safely.
10. Custom dynamic block: server-rendered data, query, permissions, API, or business logic.
11. Interactivity API: frontend interaction that should remain compatible with WordPress script modules and client-side navigation.

Avoid jumping to step 9 or 10 because the design looks custom.

## Pattern, Template Part, Or Custom Block

Use a pattern when:

- The section is mostly layout and content composition.
- Editors can safely modify text, media, buttons, and nested blocks.
- The section can be copied, inserted, and adjusted per page.

Use a template part when:

- The region is global or repeated across templates, such as header, footer, sidebar, or reusable site chrome.
- The region should be referenced from templates through the Template Part block.

Use a custom block when:

- Editors need constrained structured controls that core blocks cannot provide safely.
- The component needs repeaters, parent/child block relationships, controlled child blocks, dynamic rendering, or custom data sources.
- The frontend interaction or accessibility semantics need purpose-built behavior.
- Stable markup/data contracts matter more than freeform editor layout.

## Existing Block Work

- Do not fork or recreate a core block unless there is a clear product reason.
- Prefer block styles for visual variants and block variations for preset attributes or inner block layouts.
- Use `render_block` or block hooks only when the change is scoped, reversible, and tested against editor and frontend output.
- Preserve existing block comments, attributes, saved markup, and deprecations for static blocks.
- When changing saved markup, add deprecations/migrations or keep render dynamic to avoid invalid block warnings.
- Validate insert, edit, save, reload, copy/paste, transform, and frontend render behavior.

## Custom Block Design

- Start with `block.json` metadata, supports, attributes, editor script, view script/module, style handles, and render strategy.
- Use attributes for scalar user choices. Use post meta/options/CPT data for durable data that should not live inside post content.
- Use `InnerBlocks`, `allowedBlocks`, `parent`, `ancestor`, templates, and locking to give editors safe composition instead of a rigid all-in-one block.
- Prefer dynamic rendering when output depends on server data, permissions, queries, integrations, or evolving markup.
- Prefer static rendering only when saved markup is stable and migrations are planned.
- Keep sidebar controls purposeful. Do not expose every CSS knob when `theme.json`, supports, or design presets should constrain choices.
- Treat attributes and external data as untrusted in dynamic render callbacks. Sanitize, validate, escape, and authorize.

## FSE Theme Build Sequence

1. Define theme/plugin ownership and content contracts.
2. Build the token system in `theme.json` before composing pages.
3. Create the minimum template hierarchy and template parts.
4. Build section patterns from core blocks first.
5. Add block styles and variations for repeatable design variants.
6. Add bindings for supported dynamic fields where native editing is enough.
7. Add custom blocks only for gaps proven by the decision stack.
8. Add Interactivity API behavior for frontend interactions that need state.
9. Validate in Site Editor, post editor, preview, and frontend.

## Validation Checklist

- No Custom HTML or Shortcode blocks are used for new design implementation.
- Editor can insert, edit, save, reload, and preview without invalid block warnings.
- Templates, parts, and patterns have clear names and appear in the expected Site Editor surfaces.
- Locked areas protect design integrity without blocking required content edits.
- Existing content remains valid after refactors.
- Dynamic sources handle empty, unauthorized, missing, stale, translated, and long-content states.
- CSS is scoped and does not fight core block markup.
- Frontend scripts are loaded only where needed and are compatible with the chosen rendering/interactivity model.
- Visual parity is checked across editor canvas, Site Editor preview, frontend, and responsive breakpoints.
- Premium/enterprise feel is preserved: coherent typography, spacing, alignment, interaction states, accessibility, and brand fidelity.
