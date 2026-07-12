# Theme Development And Block Editor

Use this for classic/child themes and block-editor compatibility. Use the theme router for block/FSE architecture, supplied visuals, migration, performance, Ollie, or Blocksy work; load only the selected primary plus one confirmed-risk support reference.

## Official Anchors

- Block Editor Handbook: https://developer.wordpress.org/block-editor/
- Theme Handbook: https://developer.wordpress.org/themes/
- `theme.json` introduction: https://developer.wordpress.org/themes/global-settings-and-styles/introduction-to-theme-json/
- Block Variations API: https://developer.wordpress.org/block-editor/reference-guides/block-api/block-variations/
- InnerBlocks: https://developer.wordpress.org/block-editor/how-to-guides/block-tutorial/nested-blocks-inner-blocks/
- Interactivity API: https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/
- WP-CLI block commands: https://developer.wordpress.org/cli/commands/block/

## Theme Runtime Map

Before editing theme behavior, inspect:

- Active parent and child themes.
- Style guide, design tokens, existing token variables, and parent theme design constraints.
- `functions.php`, `theme.json`, block templates, template parts, patterns, `style.css`, build source, and generated assets.
- Template hierarchy path for the page being fixed.
- Plugin hooks that alter theme queries, blocks, templates, or assets.
- Whether the site uses classic templates, block templates, Full Site Editing, or mixed architecture.

## Classic Theme Guidelines

- Preserve template hierarchy and child-theme overrides.
- Use `wp_enqueue_scripts` and dependency/version metadata instead of hardcoded assets.
- Keep business logic out of templates. Move reusable behavior into functions/classes/hooks.
- Escape template output late and preserve translation functions.
- Avoid global query mutations; use scoped `pre_get_posts` checks and reset state.

## Block Theme Guidelines

- Decide theme ownership vs plugin ownership before adding files. Theme code should own presentation; durable content/data/functionality should usually live in plugins.
- Treat `theme.json` as the first-class design contract for global settings/styles when possible.
- Keep `version`, `$schema`, settings, styles, template parts, patterns, and custom properties deliberate.
- Use templates and parts for structure, patterns for reusable content composition, and CSS for gaps `theme.json` cannot express.
- For normal pages/posts, keep visible body content in editable `post_content` or intentional data sources; page templates should render Post Content rather than replace Pages > Edit with hard-coded body markup.
- Prefer style engine/theme supports over custom CSS when it preserves editor/frontend parity.
- Do not fight the Site Editor. Build with core blocks, supports, patterns, and constrained custom blocks.
- For design-to-theme work, map the design through content model, `theme.json`, templates/parts, patterns, core blocks, block styles, variations, bindings, and then custom blocks.
- Do not use Custom HTML blocks or Shortcode blocks to implement new block theme design sections; create a proper pattern, template part, block style/variation, or custom block instead.

## Block Editor Development

Block work must preserve editor/frontend parity:

- Define block metadata in `block.json` when possible.
- Persist user-facing controls as attributes.
- Keep inspector controls meaningful; avoid dumping every CSS option into the sidebar.
- Use the correct editor surface: document-level settings belong in document settings panels; block-specific settings belong in inspector/block panels; legacy classic-editor fields belong in meta boxes.
- Do not expose newly implemented meta boxes in the block editor; use block-editor panels instead and keep meta boxes classic-only unless compatibility requires otherwise.
- Use block supports for spacing, color, typography, layout, borders, and alignment when core supports cover the need.
- For dynamic blocks, treat attributes as untrusted input and escape render output.
- For static blocks, maintain save markup compatibility and deprecations when markup changes.
- Use `useBlockProps`, `InnerBlocks`, allowed blocks, templates, and locking deliberately.
- Register editor/front-end assets through block metadata or precise enqueue logic.
- For interactive frontend behavior, consider the Interactivity API before adding isolated jQuery/vanilla scripts that may not cooperate with modern block rendering and client-side navigation.

## Query Loop And Layout Preservation

- Treat Query Loop markup as fragile user-controlled layout.
- Prefer behavior-only enhancements through query args, context, connection keys, or isolated frontend scripts.
- Do not replace native block markup to implement filters unless the layout itself is in scope.
- Validate both editor and frontend after Query Loop changes.

## UI And Frontend Quality

- Respect existing design system and theme constraints first.
- Do not compromise premium/enterprise feel. Preserve brand quality, alignment, typography, state coverage, and polish while staying WordPress-native.
- Improve hierarchy, spacing, states, focus, empty states, and error handling before decorative changes.
- Validate responsive behavior at real breakpoints used by the theme.
- Check keyboard navigation, focus visibility, color contrast, form labels, reduced motion, and semantic landmarks.
- Avoid generic component-library visuals in WordPress admin or block contexts; match WordPress patterns unless the product has its own established design language.

## Build And Assets

- Prefer `@wordpress/scripts`, project build tooling, or existing pipeline over new tooling.
- Use generated `.asset.php` files for dependencies and versions when available.
- Avoid loading editor-only packages on the frontend.
- Avoid loading frontend bundles globally when only a block/template needs them.
- Confirm generated files are committed or built in release/CI as the repo expects.
