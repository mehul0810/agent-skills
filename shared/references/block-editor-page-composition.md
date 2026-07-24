# Block Editor Page And Post Composition

Use this for planning, building, or refactoring an editor-managed page/post when block selection, reusable sections, author usability, or editor/frontend parity matters.

## Official Anchors

- Block API: `https://developer.wordpress.org/block-editor/reference-guides/block-api/`
- Block styles: `https://developer.wordpress.org/block-editor/reference-guides/block-api/block-styles/`
- Block variations: `https://developer.wordpress.org/block-editor/reference-guides/block-api/block-variations/`
- Theme patterns: `https://developer.wordpress.org/themes/patterns/registering-patterns/`
- Block locking/content-only editing: `https://developer.wordpress.org/block-editor/how-to-guides/curating-the-editor-experience/block-locking/`

## Composition Contract

Frontend resemblance is not completion. The saved block tree must express the content hierarchy and layout, while WordPress controls express supported design choices. CSS styles that architecture; it must not secretly manufacture the page.

Before implementation, define:

- document type, purpose, audience, primary action, search/content intent, and author role,
- template and visible-region ownership,
- page/post outline, heading hierarchy, media, CTA, dynamic data, and empty/error states,
- reusable/global sections and expected update behavior,
- author tasks: create, insert, edit, replace media, reorder allowed sections, preview, revise, and recover,
- responsive, accessibility, performance, translation, and content-length constraints.

## Live Capability Inventory

Inspect the target editor/runtime, not documentation alone. Record:

- registered Core and plugin block types, namespace/source, supports, transforms, and server/dynamic behavior,
- active variations, block styles, patterns, pattern categories, template parts, and allowed-block policy,
- plugin/version/license/activation dependencies and what content does when a dependency is absent,
- existing project blocks and whether they are stable, accessible, responsive, maintained, and portable.

Use the authenticated editor state when client registrations affect the inserter; server registry results alone may not describe the complete author experience. Prefer a suitable Core block, then a proven existing project/plugin block. Do not create plugin lock-in for presentation that Core plus a pattern/style can express. Do not assume an installed plugin's block is appropriate merely because it exists.

## Select The Earliest Durable Layer

| Need | Use |
|---|---|
| Global tokens, widths, and supported controls | `theme.json` |
| Alternate appearance of one block | Block style |
| Preset attributes or inner-block starting state | Block variation |
| Reusable multi-block section/page starter | Unsynced pattern |
| Deliberately shared global content/layout | Synced pattern; overrides only when runtime support and author workflow are verified |
| Structural site chrome | Template or template part |
| Page/post-specific body | Saved `post_content` rendered through Post Content |
| Dynamic content from supported attributes | Block binding |
| Durable data, query, integration, or interaction | Existing or justified plugin-owned custom/dynamic block |

Patterns solve repeatable composition; styles solve appearance; variations solve insertion presets. A custom block is not a substitute for a pattern, and a stylesheet is not a substitute for any of them.

## Page And Post Ownership

- A Page template provides structure and renders Post Content. Page-specific hero, proof, sections, media, FAQs, and CTAs belong in the Page body unless intentionally global or data-driven.
- A Single Post template owns post title, featured image, byline/date/taxonomy, navigation, comments, and other consistent chrome. Article headings, paragraphs, lists, figures, quotes, tables, and inline CTAs remain editable post content.
- Archive/search/home templates use Query and Post Template primitives rather than copied page bodies.
- A landing page may use a curated pattern and proportional locking. Prefer `contentOnly` or move/remove locks that protect layout while leaving copy, links, and media easy to edit.
- Give each visible region one source of truth. Never split the same content across template markup, page content, CSS pseudo-content, options, and hidden Site Editor overrides.

## Author-Friendly Construction

1. Build the semantic outline and actual saved block hierarchy before visual polish.
2. Choose layout blocks by relationship: Columns for explicit peer columns, Grid for repeated responsive peers, Row for horizontal clusters, Stack for vertical sequences, and Group for semantic containment or unsupported layout needs.
3. Insert reusable section patterns into real page/post content. Give patterns clear translated names, descriptions, categories, keywords, viewport width, and relevant post types.
4. Provide a small, coherent style/variation vocabulary with semantic labels. Use presets instead of raw CSS values or a sidebar full of low-level knobs.
5. Add a custom block only after documenting the missing semantic, data, interaction, or safe-editing contract and its plugin/theme/distribution ownership.
6. Curate allowed blocks and locking only to reduce mistakes. Do not make routine content changes developer-dependent.

The List View hierarchy, block toolbar, sidebar controls, inserter previews, and editor canvas must help a non-technical author understand the page. Avoid deep anonymous Group nesting, unexplained custom classes, hidden dependencies, or patterns that insert invalid/unavailable blocks.

Every container needs a semantic, layout, style, or locking responsibility. Remove redundant single-child Group wrappers when the child can own the same support; keep a wrapper only when its responsibility is documented and visible in the editing model.

## CSS And WYSIWYG Governance

- Use `theme.json`, block supports, style-engine output, block styles, and scoped block stylesheets before bespoke CSS.
- Load presentation rules in both editor and frontend where the author needs visual context. Match content/wide widths, typography, spacing, color, states, and responsive behavior closely enough for reliable editing.
- Do not use page-ID selectors, DOM-position selectors, pseudo-content, absolute positioning, or frontend-only wrappers to compensate for the wrong saved block structure.
- If a rule exists only because the block tree, variation, style, or token is wrong, fix that source first. Keep CSS for genuine presentation and documented layout exceptions.
- Do not expose arbitrary device-specific offsets to authors. Build intrinsic responsive behavior and test long/translated content.

WYSIWYG means the editor reliably represents hierarchy, component identity, supported choices, and likely wrapping/reflow. It does not justify hiding unavoidable admin chrome differences or claiming pixel identity without evidence.

## Proof And Definition Of Done

Test with the intended non-technical role, not only an administrator:

1. Create a new page/post from the documented pattern or starting flow.
2. Edit representative copy, heading, image, link/CTA, and reusable content.
3. Reorder only intended sections; verify locks and allowed blocks are understandable.
4. From a collapsed top-level List View, locate and edit a representative section without opening Code Editor or interpreting CSS classes; record pass/fail and any confusing wrapper.
5. Save, close, reopen, undo/revise, preview, and confirm frontend output changes.
6. Inspect `parse_blocks()` hierarchy and render through `do_blocks()`; require no unexpected HTML/Shortcode blocks or block-validation warnings.
7. Compare editor and frontend at desktop and narrow widths; test long headings, translated copy, missing media, empty queries, keyboard use, and reduced motion as relevant.
8. Verify patterns/styles/variations appear with useful names/previews and plugin-block dependencies behave as documented.

Do not call the work complete when only the frontend is polished, the pattern file exists but was not inserted, a template hides page-owned content, or the author needs CSS/code to reproduce the design.

## Output

Report the page/post brief, runtime capability inventory, ownership map, saved block tree, pattern/style/variation/custom-block decisions, CSS exceptions, author workflow proof, editor/frontend evidence, dependency/portability risk, and remaining gaps.
