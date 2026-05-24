# Custom Block Theme From Design

Use this when converting a Figma/static/brand design into a custom block-based Full Site Editing theme that stays modular, editable from WordPress admin, visually faithful, and maintainable without using Custom HTML or Shortcode blocks for new design implementation.

## Official Anchors

- Theme Handbook: `https://developer.wordpress.org/themes/`
- Global Settings and Styles: `https://developer.wordpress.org/themes/global-settings-and-styles/`
- `theme.json` overview: `https://developer.wordpress.org/themes/core-concepts/global-settings-and-styles/`
- Theme styles: `https://developer.wordpress.org/themes/global-settings-and-styles/styles/`
- Template parts: `https://developer.wordpress.org/themes/templates/template-parts/`
- Style variations: `https://developer.wordpress.org/themes/global-settings-and-styles/style-variations/`
- Block style variations: `https://developer.wordpress.org/themes/features/block-style-variations/`
- `theme.json` reference: `https://developer.wordpress.org/block-editor/reference-guides/theme-json-reference/`
- Create Block: `https://developer.wordpress.org/block-editor/getting-started/devenv/get-started-with-create-block/`

## Non-Negotiables

- Build the theme around the Site Editor model: `theme.json`, templates, template parts, patterns, core blocks, block supports, and custom blocks only when necessary.
- Do not use Custom HTML blocks or Shortcode blocks to implement new design sections. Treat them as legacy containment only and flag them as technical debt.
- Keep admin editability explicit. Editors should be able to update content, images, buttons, navigation, global styles, template parts, and reusable sections without editing code.
- Preserve design intent through tokens, layout rules, patterns, and editor constraints, not by freezing the entire page into one custom block or hard-coded markup.
- Validate editor and frontend parity; a design that only works on the frontend is not a finished block theme.

## Design-To-Theme Audit

Before implementation, create a design map:

- Templates: `front-page`, `home`, `index`, `page`, `single`, `archive`, `search`, `404`, CPT templates, WooCommerce templates, and landing-page variants.
- Template parts: header, footer, navigation, sidebar, loop sections, CTA bands, newsletter/signup, social proof, and reusable global sections.
- Patterns: hero, feature grid, card list, stats, testimonials, logos, CTA, pricing, FAQ, media split, post grid, author block, and page sections.
- Tokens: color palette, gradients, typography scale, fluid sizes, spacing scale, content width, wide width, radii, shadows, borders, motion, and breakpoint behavior.
- Content model: editable text, images, links, buttons, navigation, query-driven content, reusable global content, site options, post meta, and dynamic data.
- Interaction model: menus, tabs, accordions, sliders, filtering, search, forms, modals, and animation requirements.

## Block Mapping Ladder

Use the first layer that satisfies design fidelity, editability, accessibility, and maintainability:

1. `theme.json`: global styles, presets, layout sizes, block settings, spacing, typography, color, shadows, borders, custom properties, template part registration, and style variations.
2. Core blocks: Group, Row, Stack, Columns, Cover, Media & Text, Image, Gallery, Heading, Paragraph, Buttons, Navigation, Site Logo, Site Title, Query Loop, Post Template, Post Terms, Featured Image, Template Part, and Post Content.
3. Block supports and styles: spacing, dimensions, layout, color, typography, border, shadow, alignment, block style variations, and scoped CSS for gaps that `theme.json` cannot express cleanly.
4. Patterns: reusable section markup in `/patterns`, pattern categories, clear titles, viewport width metadata, and starter layouts editors can insert and modify.
5. Template parts and templates: reusable block markup in `/parts` and top-level templates in `/templates`; register parts in `theme.json` so they appear cleanly in the Site Editor.
6. Block variations or block styles: use when a core block can handle the content model but needs a named preset or controlled variation.
7. Custom block: use only when core blocks/patterns cannot provide the required structured editing, dynamic rendering, interaction, data source, validation model, or accessibility semantics.

## When To Create A Custom Block

Create a custom block when at least one is true:

- The design needs a structured content model that core blocks cannot enforce without fragile layout editing.
- The section renders dynamic data from posts, terms, users, external APIs, options, or custom tables.
- The interaction requires purpose-built controls, accessible behavior, or frontend scripts that should not be hand-assembled by editors.
- The design needs constrained repeaters, nested items, allowed child blocks, custom previews, or dynamic server rendering.
- The markup must stay stable across redesigns and cannot rely on user-edited raw HTML.

Do not create a custom block when:

- A pattern made of core blocks can satisfy the section.
- The only gap is spacing, color, border, radius, shadow, or responsive behavior that can be solved with `theme.json`, block supports, block styles, or scoped CSS.
- The block would simply wrap a hard-coded design with no meaningful editor controls.
- A shortcode or Custom HTML block is being used to avoid proper block/theme architecture.

## Admin Editability Model

- Use templates for page-level structure and template parts for global or repeated site regions.
- Use patterns as section starters that editors can insert, duplicate, and modify.
- Use synced patterns only for content that should update globally across the site; use unsynced theme patterns for reusable design sections.
- Use block locking, allowed blocks, InnerBlocks templates, and template locking to protect layout while preserving content editability.
- Prefer document/sidebar panels for document-level settings and inspector controls for block-specific settings.
- Keep classic editor meta boxes out of the block editor unless preserving a legacy compatibility contract.

## Theme File Architecture

A custom block theme should usually include:

```text
theme-slug/
  style.css
  theme.json
  functions.php
  templates/
  parts/
  patterns/
  styles/
  assets/
  src/
  build/
```

Guidelines:

- Keep `functions.php` thin: setup, asset registration, pattern categories, block styles/variations, and custom block registration.
- Put reusable section markup in `/patterns`, not hard-coded page templates unless it is structural.
- Put global regions in `/parts`, directly under the folder; WordPress does not support nested template parts.
- Use `/styles` for global style variations when alternate design skins are required.
- Keep custom block source and build artifacts organized so release packaging includes runtime assets but not dev tooling.

## CSS And Responsive Strategy

- Encode design tokens in `theme.json` first; use CSS only for what the style engine and block supports cannot express safely.
- Use layout presets, `contentSize`, `wideSize`, spacing scale, and fluid typography before custom wrappers.
- Build mobile-first. Avoid fixed heights and absolute positioning unless the design truly requires them and responsive states are verified.
- Scope CSS to block classes, pattern wrapper classes, or theme utility classes; avoid global CSS that changes core block behavior unexpectedly.
- Check editor canvas, Site Editor, preview, and frontend at mobile, tablet, laptop, and wide breakpoints.

## Implementation Workflow

1. Create the design map and identify required templates, parts, patterns, tokens, and possible custom blocks.
2. Build `theme.json` tokens and settings before page markup.
3. Prototype sections in the editor with core blocks and copy stable block markup into `/patterns`, `/templates`, or `/parts`.
4. Replace fragile sections with block styles/variations or custom blocks only when the decision matrix justifies it.
5. Register template parts and pattern categories so the admin UI is understandable.
6. Build custom blocks with `block.json`, `useBlockProps`, meaningful attributes, editor preview, frontend rendering, and accessibility baked in.
7. Validate editor editability, frontend fidelity, responsive behavior, accessibility, performance, and release packaging.

## Validation Checklist

- No new Custom HTML or Shortcode blocks are used for design implementation.
- Editors can update expected content and global sections from the admin/Site Editor.
- Header, footer, navigation, templates, template parts, and patterns appear with clear labels.
- Core block patterns remain valid; no invalid block warnings appear after save/reload.
- Editor canvas, frontend, and preview match within acceptable design tolerance.
- Mobile, tablet, desktop, and wide layouts are verified.
- Keyboard navigation, focus states, landmarks, headings, alt text, contrast, and reduced motion are checked.
- Query Loop and dynamic content states cover empty, long content, missing image, and translated text.
- Custom blocks include tests or at least targeted editor/frontend smoke checks.
- Release artifact includes built assets and excludes development-only Composer/npm packages.
