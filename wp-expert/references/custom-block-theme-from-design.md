# Custom Block Theme From Design

Use this only as supporting FSE architecture detail after `../../shared/references/visual-to-wordpress-implementation.md` identifies a real ownership, block-mapping, locking, or dynamic-data risk. Keep generic visual, responsive, asset, accessibility, performance, and proof rules in the primary visual contract; use `visual-parity-regression.md` instead only when deeper proof is the sole supporting risk.

## Official Anchors

- Theme Handbook: `https://developer.wordpress.org/themes/`
- `theme.json`: `https://developer.wordpress.org/block-editor/reference-guides/theme-json-reference/`
- Block Bindings: `https://developer.wordpress.org/block-editor/reference-guides/block-api/block-bindings/`
- Interactivity API: `https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/`

## Non-Negotiables

- Build around `theme.json`, registered core blocks, templates, parts, patterns, supports, styles, variations, and bindings before custom blocks.
- Keep page-owned visible content in `post_content` and render Post Content from structural templates.
- Give every region one owner and one documented editing surface.
- Use locks and constraints to protect design integrity without removing normal editorial control.
- Apply the distribution and portability gate in `block-theme-architecture.md`; a WordPress.org Theme Directory theme cannot ship custom blocks or plugin territory.
- Never use Custom HTML or Shortcode blocks as visual shortcuts.

## Design-To-Theme Audit

Record only decisions that change architecture:

- distribution target and supported runtime,
- theme/plugin/content/data ownership,
- tokens and repeated component contracts,
- template hierarchy and global parts,
- page-owned, global/synced, query-driven, and external-data regions,
- locking/editing expectations,
- missing states or runtime blocks,
- migration, portability, and Site Editor override risk.

## Image-To-WordPress Translation Loop

1. Use the primary visual contract to inspect/classify the source and build the visual/behavior manifest.
2. Classify each region by ownership and editing surface.
3. Verify registered blocks/supports on the target runtime.
4. Select the earliest safe layer in the block architecture decision stack.
5. Prove the saved editor content and rendered frontend, then use deterministic visual/workflow evidence.

## Surface Selection Matrix

| Need | Preferred layer |
| --- | --- |
| Global design tokens and editor choices | `theme.json` |
| Document structure | Template |
| Header, footer, global chrome | Template part |
| Page body managed in Pages > Edit | Template with Post Content plus editable blocks |
| Reusable section starter | Unsynced pattern |
| Content intentionally updated everywhere | Synced pattern |
| Existing block with alternate appearance | Block style |
| Existing block with preset structure/attributes | Block variation |
| Supported attribute from dynamic data | Block binding |
| Constrained composition | `InnerBlocks` custom block, when distribution permits |
| Server/query/permission/integration output | Dynamic plugin block |
| Stateful frontend behavior | Interactivity API after rendering ownership is settled |

## Custom Block Gate

Create a custom block only when registered core blocks, patterns, styles, variations, bindings, and existing blocks cannot preserve the content model, interaction semantics, or safe editing contract.

Before implementation, document:

- why native layers fail,
- plugin versus theme ownership and theme-switch behavior,
- static versus dynamic rendering,
- attributes versus meta/options/CPT/external data,
- allowed children, locking, parent/ancestor relationships,
- empty/loading/error/permission behavior,
- save-markup deprecation or migration path,
- editor/frontend asset and test strategy.

Do not create a frozen page-sized block or a custom block solely for spacing, color, radius, shadow, or responsive CSS.

## Admin Editability Model

- Pages > Edit owns page-specific copy, media, CTAs, and sections.
- Site Editor owns templates, parts, and intended global styles.
- Synced patterns own deliberately global reusable content; unsynced patterns are starters.
- Document settings belong in document/sidebar panels; block settings belong in inspector panels.
- Classic-only metadata may use meta boxes; do not expose new meta boxes in the block editor unless maintaining legacy compatibility.
- Detect database `wp_template`, `wp_template_part`, Global Styles, `wp_navigation`, synced-pattern, media, and other numeric-reference dependencies before assuming file changes render or will survive a clean install.

## Design-To-FSE Page Recipe

1. Define distribution, ownership, components, tokens, and editor tasks.
2. Build `theme.json`, minimum templates, and global parts.
3. Render Post Content from page templates that expose page-owned content.
4. Seed or insert editable core-block patterns into page content.
5. Add styles, variations, bindings, and only justified custom blocks.
6. Validate save/reload, revisions, editor/frontend parity, visitor/author workflows, intrinsic responsiveness, content stress, accessibility, performance, portability, and packaging.

## Validation Checklist

- Runtime block availability is verified; documented but unavailable blocks are not invented.
- Page-owned content is controlled from Pages > Edit and remains valid after save/reload.
- Templates, parts, patterns, and locks have clear editor-facing names and behavior.
- No unintended Site Editor database override shadows repo-owned files.
- Custom blocks satisfy the distribution gate and have migrations/tests proportional to risk.
- Query and dynamic surfaces handle empty, long, translated, missing-media, error, and permission states.
- Release artifacts contain built runtime assets and no development-only packages.
