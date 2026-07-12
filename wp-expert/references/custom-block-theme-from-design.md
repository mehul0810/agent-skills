# Custom Block Theme From Design

Use this as supporting architecture detail for a custom block-based Full Site Editing theme. For a supplied screenshot, Figma frame, image, mockup, or chosen visual direction, use `../../shared/references/visual-to-wordpress-implementation.md` as the primary contract and load this file only for a confirmed FSE architecture risk; do not chain additional generic design references by default.

## Official Anchors

- Theme Handbook: `https://developer.wordpress.org/themes/`
- Global Settings and Styles: `https://developer.wordpress.org/themes/global-settings-and-styles/`
- `theme.json` overview: `https://developer.wordpress.org/themes/core-concepts/global-settings-and-styles/`
- Template parts: `https://developer.wordpress.org/themes/templates/template-parts/`
- `theme.json` reference: `https://developer.wordpress.org/block-editor/reference-guides/theme-json-reference/`
- Block Bindings API: `https://developer.wordpress.org/block-editor/reference-guides/block-api/block-bindings/`
- Interactivity API: `https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/`

## Non-Negotiables

- Build the theme around the Site Editor model: `theme.json`, templates, template parts, patterns, core blocks, block supports, and custom blocks only when necessary.
- Decide theme vs plugin ownership before building: presentation belongs in the theme; durable data, business rules, and cross-theme functionality usually belong in plugins.
- Do not use Custom HTML blocks or Shortcode blocks to implement new design sections. Treat them as legacy containment only and flag them as technical debt.
- Keep admin editability explicit. Editors should be able to update content, images, buttons, navigation, global styles, template parts, and reusable sections without code edits.
- If a normal page/post is the editing surface, the visible page body must be controlled by that page/post content, not by hard-coded template or pattern markup that bypasses editing.
- Preserve design intent through tokens, layout rules, patterns, and editor constraints, not by freezing the page into one custom block.
- Validate editor and frontend parity; frontend-only is not a finished block theme.

## Design-To-Theme Audit

Before implementation, create a design map:

- Ownership: what belongs to theme files, plugin functionality, post content, post meta, options, synced patterns, or external data.
- Templates: `front-page`, `home`, `index`, `page`, `single`, `archive`, `search`, `404`, CPT templates, WooCommerce templates, and landing-page variants.
- Template parts: header, footer, navigation, sidebar, loop sections, CTA bands, newsletter/signup, social proof, and reusable global sections.
- Patterns: hero, feature grid, card list, stats, testimonials, logos, CTA, pricing, FAQ, media split, post grid, author block, and page sections.
- Tokens: color palette, gradients, typography scale, fluid sizes, spacing scale, content width, wide width, radii, shadows, borders, motion, and breakpoint behavior.
- Content model: editable text, images, links, buttons, navigation, query-driven content, reusable global content, site options, post meta, and dynamic data.
- Interaction model: menus, tabs, accordions, sliders, filtering, search, forms, modals, and animation requirements.

## Image-To-WordPress Translation Loop

Run this loop before writing markup:

1. Read the image as a contract for hierarchy, spacing, composition, and visible states at the shown breakpoint.
2. Classify each section by ownership: page content, template part, pattern, query/dynamic data, or custom interactive component.
3. Choose the primary editing surface per section: Pages > Edit, Site Editor, synced pattern, document settings, inspector controls, options page, or plugin data source.
4. Map the section to the cheapest WordPress-native layer that preserves fidelity and editability: `theme.json`, core blocks, pattern, template part, block style/variation, bindings, custom block, or dynamic block.
5. Decide what must stay file-owned versus database-owned. Repo-distributed structure belongs in files; intentional user customizations can live in database overrides.
6. Only then write or edit the template, pattern, block, and CSS.

## Surface Selection Matrix

Use this default mapping unless repo rules or the user contract say otherwise:

- Full page content the editor should manage from Pages > Edit: structural template plus `Post Content`; seed the body with blocks or insertable patterns.
- Shared site chrome or sections reused across templates: template parts.
- Reusable design sections editors may insert and adapt per page: unsynced patterns.
- Reusable global content that should update everywhere: synced patterns.
- Query-driven listings, archives, and blog grids: Query Loop or a custom dynamic block when Query Loop is insufficient.
- Stable structured UI with constrained child areas: custom block with `InnerBlocks`.
- Data-driven components that need custom rendering, permissions, or integrations: custom dynamic block.

## Block Mapping Ladder

Use the first layer that satisfies design fidelity, editability, accessibility, and maintainability:

1. `theme.json`: global styles, presets, layout sizes, block settings, spacing, typography, color, shadows, borders, custom properties, template part registration, and style variations.
2. Core blocks: Group, Row, Stack, Columns, Cover, Media & Text, Image, Gallery, Heading, Paragraph, Buttons, Navigation, Site Logo, Site Title, Query Loop, Post Template, Post Terms, Featured Image, Template Part, and Post Content.
3. Block bindings: bind supported core block attributes to post meta, post data, term data, pattern overrides, or custom binding sources when the need is dynamic data mapping, not a full custom editing UI.
4. Block supports and styles: spacing, dimensions, layout, color, typography, border, shadow, alignment, block style variations, and scoped CSS for gaps that `theme.json` cannot express cleanly.
5. Patterns: reusable section markup in `/patterns`, pattern categories, clear titles, viewport width metadata, and starter layouts editors can insert and modify.
6. Template parts and templates: reusable block markup in `/parts` and top-level templates in `/templates`; register parts in `theme.json` so they appear cleanly in the Site Editor.
7. Block variations or block styles: use when a core block can handle the content model but needs a named preset or controlled variation.
8. Custom block with `InnerBlocks`: use when the design needs safe composition with controlled child blocks, templates, parent/ancestor rules, or locking.
9. Custom dynamic block: use when rendering depends on server data, permissions, query state, integrations, or evolving markup.
10. Interactivity API: use for frontend behavior that needs stateful interactions while staying aligned with WordPress block rendering.

## When To Create A Custom Block

Create a custom block when at least one is true:

- The design needs a structured content model that core blocks cannot enforce without fragile layout editing.
- The section renders dynamic data from posts, terms, users, external APIs, options, or custom tables.
- The interaction requires purpose-built controls, accessible behavior, or frontend scripts that should not be hand-assembled by editors.
- The design needs constrained repeaters, nested items, allowed child blocks, custom previews, or dynamic server rendering.
- The markup must stay stable across redesigns and cannot rely on user-edited raw HTML.

Do not create a custom block when:

- A pattern made of core blocks can satisfy the section.
- A core block plus Block Bindings can satisfy the data model with stable editor UX.
- The only gap is spacing, color, border, radius, shadow, or responsive behavior that can be solved with `theme.json`, block supports, block styles, or scoped CSS.
- The block would simply wrap a hard-coded design with no meaningful editor controls.
- The only purpose is to mimic a static design that could be represented by a locked pattern or a variation of core blocks.
- A shortcode or Custom HTML block is being used to avoid proper block/theme architecture.

## Block Bindings Guidance

- Use Block Bindings for dynamic text/media/link/date fields that map cleanly to supported core block attributes and keep the editing surface native.
- Prefer bindings or pattern overrides when the design needs repeated structured sections with per-instance field changes but not a full custom authoring UI.
- Register source data with explicit schema and permissions. For post meta sources, expose only intended keys and keep sensitive keys unbound.
- Validate compatibility per WordPress version and supported block attributes before committing to bindings as the primary model.
- Promote a custom block only when bindings cannot support required structure, editorial constraints, or interaction semantics.

## Admin Editability Model

- Use templates for page-level structure and template parts for global or repeated site regions.
- Use patterns as section starters that editors can insert, duplicate, and modify.
- Use synced patterns only for content that should update globally across the site; use unsynced theme patterns for reusable design sections.
- For custom page designs, prefer a structural page template with `<!-- wp:post-content /-->`, then put the designed sections into the page's `post_content` as editable blocks or inserted patterns.
- Avoid Site Editor database template overrides as the delivery mechanism unless the user intentionally wants an admin-owned template customization; repo-owned theme changes should live in files and page-owned content should live in content.
- Use block locking, allowed blocks, InnerBlocks templates, and template locking to protect layout while preserving content editability.
- Prefer document/sidebar panels for document-level settings and inspector controls for block-specific settings.
- Keep classic editor meta boxes out of the block editor unless preserving a legacy compatibility contract.
- When classic editor support requires meta boxes, register/show them for classic screens and keep them hidden in the block editor UI.

## Design-To-FSE Page Recipe

For a custom designed page that must remain manageable from Pages > Edit:

1. Create a structural page template, such as `page-roadmap.html`, only for site chrome and layout boundaries.
2. Include `<!-- wp:post-content /-->` where the page-owned body should render.
3. Build the designed page sections as editable blocks in the page `post_content`; use theme patterns as insertable starters, not hidden body replacements.
4. Keep tokens, scoped CSS, block styles, and responsive rules in theme files.
5. Use synced patterns only for globally reused content that should update everywhere.
6. Use a custom block only when core blocks, bindings, patterns, styles, and variations cannot preserve fidelity and safe editing.
7. Validate Pages > Edit, Site Editor, frontend, responsive states, and the absence of unintended database template overrides.

## CSS And Responsive Strategy

- Encode design tokens in `theme.json` first; use CSS only for what the style engine and block supports cannot express safely.
- Use layout presets, `contentSize`, `wideSize`, spacing scale, and fluid typography before custom wrappers.
- Build mobile-first. Avoid fixed heights and absolute positioning unless the design truly requires them and responsive states are verified.
- Scope CSS to block classes, pattern wrapper classes, or theme utility classes; avoid global CSS that changes core block behavior unexpectedly.
- Check editor canvas, Site Editor, preview, and frontend at mobile, tablet, laptop, and wide breakpoints.

## Implementation Workflow

1. Create the design map and ownership map.
2. Define content contracts and dynamic data sources before block markup.
3. Build `theme.json` tokens and settings before page markup.
4. Create the minimum template hierarchy and template parts, keeping page templates structural when Pages > Edit should own the body.
5. Prototype sections in the editor with core blocks; store reusable starters in `/patterns`, but insert page-specific sections into the page content.
6. Add block styles/variations/bindings for repeatable design and data needs.
7. Build custom blocks only where the decision matrix proves core blocks, patterns, variations, and bindings are insufficient.
8. For custom blocks, decide static vs dynamic rendering, attributes vs meta/options/data sources, `InnerBlocks` constraints, and deprecation strategy.
9. Add Interactivity API behavior only when frontend interaction requires state.
10. Add visual parity checks for editor canvas, Site Editor preview, and frontend render states across breakpoints.
11. Validate editor editability, frontend fidelity, responsive behavior, accessibility, performance, and release packaging.

## Frontend Design Implementation Contract

For screenshot-to-WordPress work, the implementation is only complete when all of these are true:

- The design is translated into tokens, layout rules, and block architecture before deep CSS polish.
- Every visible section has one clear owner and one intended admin editing surface.
- Templates stay structural when page/post content is supposed to own the visible body.
- Patterns are editor-friendly starters, not hidden substitutes for page content ownership.
- Custom blocks exist only for proven content-model, interaction, or dynamic-data gaps.
- The rendered page matches the source visual closely at the target breakpoint and degrades cleanly across smaller/larger breakpoints.
- The page is manageable by the intended WordPress user without code edits, Custom HTML, or shortcode crutches.

## Validation Checklist

- The design map identifies ownership, editing surface, tokens, and template-vs-content boundaries before final implementation.
- No new Custom HTML or Shortcode blocks are used for design implementation.
- Editors can update expected content and global sections from the intended admin surface: Pages > Edit for page-owned content, Site Editor for templates/parts, and synced pattern editing for global reusable content.
- Page templates that should expose page-owned content include Post Content and do not hide the visible body in template-only markup.
- Header, footer, navigation, templates, template parts, and patterns appear with clear labels.
- Core block patterns remain valid; no invalid block warnings appear after save/reload.
- Editor canvas, frontend, and preview match within acceptable design tolerance.
- Dynamic fields mapped through Block Bindings render correctly in editor and frontend with expected empty/error states.
- Custom blocks can be inserted, edited, saved, reloaded, copied, transformed when supported, and rendered without validation warnings.
- Interactive blocks degrade safely and load scripts only where needed.
- Mobile, tablet, desktop, and wide layouts are verified.
- Keyboard navigation, focus states, landmarks, headings, alt text, contrast, and reduced motion are checked.
- Query Loop and dynamic content states cover empty, long content, missing image, and translated text.
- Custom blocks include tests or at least targeted editor/frontend smoke checks.
- Release artifact includes built assets and excludes development-only Composer/npm packages.
