# Core-First Site And Theme Workflow

Use this for block-based site/theme implementation when block availability, editable page ownership, or Site Editor precedence could change the architecture.

## 1. Verify Runtime Block Availability

Inspect the target WordPress runtime before choosing blocks. Query `WP_Block_Type_Registry::get_instance()->get_all_registered()` through WP-CLI or a scoped runtime probe; use the authenticated block-types REST endpoint when appropriate. Record the registered names relevant to the design.

Do not infer availability from WordPress version, documentation, Gutenberg source, experimental status, or another environment. A documented block may be absent because of Core/Gutenberg version, feature flags, registration timing, or site policy. If a requested block is unavailable, use the nearest registered core composition, an existing project block, or a justified custom block; report the fallback.

## 2. Map Core Blocks First

When registered and semantically suitable, prefer `core/icon`, `core/breadcrumbs`, `core/accordion`, `core/query`, `core/post-featured-image`, `core/navigation`, `core/search`, `core/table`, `core/group`, `core/columns`, and template-part primitives before custom markup or new blocks.

Treat `core/tabs`, `core/table-of-contents`, `core/form`, and every other documented or experimental block as runtime-dependent. Never generate its markup until registration is verified on the target environment. Do not use Custom HTML or Shortcode blocks to imitate an unavailable core block.

## 3. Establish The Design Contract

Inspect repo-local `DESIGN.md`. If absent or stale and the gap is durable, create or refresh it within the task only when scope permits; otherwise create a focused issue. Keep it concise and tokenized: content/max widths, spacing scale, alignment rules, typography, colors, radii, responsive breakpoints/behavior, block style/variation conventions, and intentional exceptions. Reuse `theme.json` tokens rather than maintaining competing values.

## 4. Prove Editable Content

For editor-managed pages, inspect saved `post_content` with `parse_blocks()` and verify expected block names, hierarchy, attributes, and absence of unintended `core/html` or `core/shortcode`. Render the saved content with `do_blocks()` in the correct WordPress context and verify the result rather than validating only a pattern/template source file.

Capture desktop and narrow/mobile screenshots of the frontend. When editor parity or editing ownership changed, also prove the relevant editor surface. Confirm that Pages > Edit, Site Editor, or the documented data source controls the visible content.

## 5. Reconcile Site Editor Overrides

File-based `/templates` and `/parts` may be shadowed by database `wp_template` or `wp_template_part` records, while user-origin `wp_global_styles` data may shadow `theme.json`. Their markup may also depend on database-only `wp_navigation` entities, synced-pattern references, or attachment IDs. Before diagnosing a file change as ineffective, inspect the resolved template, part, and Global Styles origins plus matching records and referenced entities for the active theme stylesheet. Record the record type, stable ID or slug, theme association, modified time, and a content/settings fingerprint; classify each override as intentional admin ownership, stale test data, or deployment drift.

Do not delete or overwrite database customizations silently. Preserve intentional owner changes; use explicit reset/migration/reconciliation only with approval and rollback evidence. Completion reports must identify whether the rendered source is a theme file or database override.

## 6. Promote Intentional Editor Changes

When Site Editor work is intended to become repo-owned theme design:

1. Freeze and back up the approved records and referenced Navigation, synced-pattern, and media entities before transformation. Map resolved `wp_template` content to `templates/{slug}.html`, `wp_template_part` content to `parts/{slug}.html`, and default user-origin Global Styles to `theme.json`. Preserve required `templateParts` metadata; use `styles/{slug}.json` only when a selectable variation is intentional and clean-install activation is defined.
2. Export or sync through Create Block Theme or the project's reviewed equivalent. Treat generated output as a draft, not trusted source.
3. Review the resulting JSON, block markup, template, part, pattern, and asset diff. Resolve nonportable `ref` and numeric IDs: remove Navigation refs when the theme owns portable menu markup, or define explicit setup/migration for required `wp_navigation`, synced patterns, and media. Remove incidental settings, generated noise, and environment URLs; package or deliberately source every required asset.
4. Build the release artifact from an identified commit and inspect that the expected files and assets are present.
5. Install that artifact on a clean database without importing the source site's `wp_template`, `wp_template_part`, or user-origin Global Styles. Verify the resolver uses the promoted files/theme-origin data, every required Navigation/pattern/media dependency exists or migrates deliberately, and the approved frontend renders without a hidden override or missing database entity.
6. Prove the author can locate, edit, save, reload, preview, and recover the intended template, part, and Global Styles surfaces.
7. For existing sites, inventory local overrides and rehearse an explicit, idempotent migration or reset plus rollback. Removing or replacing an override remains owner-gated.

Do not treat production database customization as source code, and do not overwrite it merely because repo files differ. The deployment contract must state whether repo files, an explicit migration, or retained user-level overrides win.

## Production-Ready Evidence

Do not call this done from source-site screenshots or a working-tree diff alone. Require:

- the before-state record inventory and recoverable export/backup,
- the reviewed repository diff, automated syntax/package results, commit identity, and inspected release artifact,
- clean-install source-resolution evidence naming the active `templates/*.html`, `parts/*.html`, and `theme.json` or intentional style-variation source, with no user-origin override required for the approved design,
- matched desktop and narrow frontend evidence plus Site Editor edit/save/reload proof,
- an existing-site migration dry run and rollback result, or a documented reason no existing-site reconciliation applies,
- explicit pass, fail, and skipped results with remaining visual, editing, asset, compatibility, and rollout risk.

## Output

Report the verified block inventory subset, core/custom mapping, `DESIGN.md` action, saved-content/render proof, desktop/mobile evidence, template/part/Global Styles source precedence, database-to-file promotion, release artifact identity, and migration/rollback status. State unavailable blocks and fallbacks explicitly.
