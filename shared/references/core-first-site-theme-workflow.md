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

File-based `/templates` and `/parts` may be shadowed by database `wp_template` or `wp_template_part` records. Before diagnosing a file change as ineffective, inspect the resolved template/part and matching database posts for the active theme stylesheet. Classify each override as intentional admin ownership, stale test data, or deployment drift.

Do not delete or overwrite database customizations silently. Preserve intentional owner changes; use explicit reset/migration/reconciliation only with approval and rollback evidence. Completion reports must identify whether the rendered source is a theme file or database override.

## Output

Report the verified block inventory subset, core/custom mapping, `DESIGN.md` action, saved-content/render proof, desktop/mobile evidence, and template/part source precedence. State unavailable blocks and fallbacks explicitly.
