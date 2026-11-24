# Core-First Site And Theme Workflow

Use this for block-based site/theme implementation when block availability, editable page ownership, or Site Editor precedence could change the architecture.

## 1. Verify Runtime Block Availability

Inspect target runtime before choosing blocks. Query `WP_Block_Type_Registry::get_instance()->get_all_registered()` through WP-CLI/scoped probe or authenticated block-types REST. Record relevant Core/plugin sources, supports, styles, variations, patterns, transforms, dynamic behavior, activation/license requirements, and inserter/editor availability.

Do not infer availability from version, docs, Gutenberg source, experimental status, or another environment; registration varies by version, flags, timing, or policy. If unavailable, use the nearest registered Core composition, existing project block, or justified custom block and report fallback.

## 2. Map Core Blocks First

When registered and suitable, prefer `core/icon`, `core/breadcrumbs`, `core/accordion`, `core/query`, `core/post-featured-image`, `core/navigation`, `core/search`, `core/table`, `core/group`, `core/columns`, and template parts before custom markup/blocks.

Treat `core/tabs`, `core/table-of-contents`, `core/form`, and every other documented or experimental block as runtime-dependent. Never generate its markup until registration is verified on the target environment. Do not use Custom HTML or Shortcode blocks to imitate an unavailable core block.

For WooCommerce or another Automattic-maintained WordPress product, use the ecosystem section in `../../wp-expert/references/third-party-api-integrations.md` instead of assuming its blocks, plan features, or service connection.

## 3. Establish The Design Contract

Inspect repo `DESIGN.md`; if durably absent/stale, refresh only within scope or create an issue. Keep concise/tokenized: widths, spacing, alignment, type, color, radius, responsive behavior, block styles/variations, exceptions. Reuse `theme.json` tokens.

## 4. Prove Editable Content

For editor-managed pages, inspect saved `post_content` with `parse_blocks()` and verify expected block names, hierarchy, attributes, and absence of unintended `core/html` or `core/shortcode`. Render the saved content with `do_blocks()` in the correct WordPress context and verify the result rather than validating only a pattern/template source file.

Capture desktop/mobile frontend; prove editor when parity/ownership changes. Confirm Pages > Edit, Site Editor, or documented source controls visible content. Have the intended non-technical role edit representative copy/media/links, save/reopen, and create/insert the page/pattern without code.

## 5. Reconcile Site Editor Overrides

Database `wp_template` or `wp_template_part` records can shadow files; user-origin `wp_global_styles` can shadow `theme.json`. Markup may depend on `wp_navigation`, synced-pattern refs, or attachments. Before calling a file change ineffective, inspect resolved sources and matching records/entities for the active stylesheet. Record type, stable ID/slug, theme, modified time, fingerprint, and classify override as intentional, stale test data, or deployment drift.

Do not delete or overwrite database customizations silently. Preserve intentional owner changes; use explicit reset/migration/reconciliation only with approval and rollback evidence. Completion reports must identify whether the rendered source is a theme file or database override.

## 6. Promote Intentional Editor Changes

When Site Editor work is intended to become repo-owned theme design:

1. Freeze/backup approved records and referenced Navigation, synced-pattern, and media entities. Map resolved templates/parts to `templates/{slug}.html`/`parts/{slug}.html`, default user Global Styles to `theme.json`; preserve `templateParts`; use `styles/{slug}.json` only for intentional selectable variations with clean-install activation.
2. Export/sync through Create Block Theme or reviewed equivalent; generated output is draft, not trusted source.
3. Review JSON, blocks, templates, parts, patterns, and assets. Resolve nonportable `ref` and numeric IDs: remove Navigation refs only when theme owns portable menu markup, otherwise define setup/migration for `wp_navigation`, patterns, and media. Remove noise/environment URLs; package/source required assets.
4. Build from identified commit and inspect release files/assets.
5. Install on clean DB without source-site template/part/user Global Styles. Verify resolver uses promoted files/theme data, dependencies exist or migrate, and approved frontend renders without hidden overrides/missing entities.
6. Prove author can locate, edit, save, reload, preview, and recover template/part/Global Styles.
7. For existing sites, inventory overrides and rehearse idempotent migration/reset plus rollback. Override removal/replacement remains owner-gated.

Production database customization is not source code; do not overwrite it because repo files differ. State whether files, explicit migration, or retained user overrides win.

## Production-Ready Evidence

Do not call this done from source-site screenshots or a working-tree diff alone. Require:

- the before-state record inventory and recoverable export/backup,
- the reviewed repository diff, automated syntax/package results, commit identity, and inspected release artifact,
- clean-install source-resolution evidence naming the active `templates/*.html`, `parts/*.html`, and `theme.json` or intentional style-variation source, with no user-origin override required for the approved design,
- matched desktop and narrow frontend evidence plus Site Editor edit/save/reload proof,
- an existing-site migration dry run and rollback result, or a documented reason no existing-site reconciliation applies,
- explicit pass, fail, and skipped results with remaining visual, editing, asset, compatibility, and rollout risk.

## Output

Report verified block inventory, Core/custom mapping, `DESIGN.md` action, saved-content/render and desktop/mobile proof, template/part/Global Styles precedence, promotion, artifact identity, and migration/rollback. State unavailable blocks/fallbacks.

## WordPress 7.1 Block Selection Matrix

After live discovery, choose by meaning, data source, interaction, author task, and ownership: registered semantic Core block; proven active plugin block; style for appearance; variation for preset attributes; pattern for composition; binding for dynamic values; template part for shared structure; custom block only for a missing durable contract. Official catalogs: `https://wordpress.org/documentation/article/blocks-list/` and `https://developer.wordpress.org/block-editor/reference-guides/core-blocks/`.

| Need | Prefer | Boundary |
|---|---|---|
| Narrative | Paragraph, Heading, List, Quote | Preserve semantics; Pullquote is emphasis, not structure. |
| Disclosure/views | Details for one item; Accordion for a related set; Tabs for genuinely parallel views | Require registered child structure, headings/labels, keyboard/focus/mobile behavior, and readable fallback. |
| Data/paired content | Table for tabular data; Media & Text for a true editorial pair | Never use Table for layout; use Columns/Grid when content is merely adjacent. |
| Media | Image, Gallery, Audio, Video, Playlist, File, Cover, Icon | Match item/collection/sequence/download/overlay/symbol intent; verify alt/decorative state, captions, dimensions, weight, privacy, and failures. |
| Layout | Group for owned containment; Stack/Row for one axis; Columns for fixed peers; Grid for repeated responsive peers | Remove anonymous wrappers; prove wrapping, stacking/reading order, translation, and content stress rather than offsets. |
| Actions/space | Buttons/Button; tokenized gaps/padding; Separator for a real boundary | Avoid false buttons and Spacer/Separator patches. |
| Site structure | Navigation, Breadcrumbs, identity blocks, Search, Social Icons | Keep shared chrome in templates/parts/entities; prove mobile overlay, keyboard/focus, names, schema, and portability. |
| Collections | Query Loop, Post Template, No Results, Pagination | Preserve context, author empty states, bound query cost, and avoid copied cards. |
| Entity data | Title, Excerpt, Featured Image, author/date/terms/comments, Post Content, Template Part | Use in valid context; page body stays in Post Content. |
| Remote content | Provider Embed, generic Embed/RSS | Verify provider support, consent, sizing, cache/timeouts, sanitization, and unavailable state. |

WordPress 7.1 documents Playlist and Tabs, but registration wins. Table of Contents and Gutenberg-only/experimental blocks remain runtime-dependent. Classic is compatibility-only; do not add deprecated Author, Comment, Comment Author Avatar, or Text Columns. Custom HTML and Shortcode are migration/integration escape hatches, never page-building substitutes.

For substantial work, record relevant blocks in `DESIGN.md`, `AGENTS.md`, or evidence: `name | source/version | purpose | supports/styles/variations | dependency/license | data/render owner | accessibility/responsive | portability/fallback | chosen/rejected reason`. Refresh after upgrades.
