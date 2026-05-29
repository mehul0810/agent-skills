# WordPress Design System Support

Use this for WordPress-native UI design, admin/product interfaces, block editor controls, Figma-to-code translation, component selection, design tokens, accessibility, editor consistency, and visual QA against WordPress conventions. For product UX strategy, information architecture, content design, conversion UX, image/pixel parity, and premium enterprise QA, also read `ux-product-strategy-design-qa.md`. For product UI implementation, state coverage, and visual quality review, also read `ui-ux-pro-for-wordpress.md`.

## Official Anchors

- Make WordPress Design Handbook: https://make.wordpress.org/design/handbook/
- WordPress Design Foundations: https://make.wordpress.org/design/handbook/design-guide/foundations/
- Block Editor Component Reference: https://developer.wordpress.org/block-editor/reference-guides/components/
- Block Editor Reference Guides: https://developer.wordpress.org/block-editor/reference-guides/
- Gutenberg Storybook: https://wordpress.github.io/gutenberg/

WordPress UI patterns and component APIs evolve with Gutenberg and WordPress releases. Re-check official component docs and Storybook for exact props, deprecations, and examples before implementing non-trivial UI.

If a WPDS MCP server is available in the environment, prefer it for canonical component and token details before falling back to web docs or local package inspection.

## Design System Mental Model

WordPress UI work should usually start from existing primitives:

- `@wordpress/components` for common dashboard/editor UI elements.
- `@wordpress/icons` for WordPress-native iconography.
- `@wordpress/element`, `@wordpress/data`, `@wordpress/i18n`, `@wordpress/notices`, and editor packages for app behavior.
- `theme.json`, block supports, and global styles for site/editor design tokens.
- WordPress admin CSS variables/classes only when they are stable in the target context.

Do not invent a custom design system inside a plugin or block when WordPress components and patterns already solve the problem.

## Component Selection

Prefer WordPress components for admin/editor UIs:

- Actions: `Button`, `DropdownMenu`, `ToolbarButton`, `MenuItem`.
- Forms: `TextControl`, `TextareaControl`, `SelectControl`, `ToggleControl`, `CheckboxControl`, `RadioControl`, `FormTokenField`, `ComboboxControl` where available.
- Layout: `Flex`, `HStack`, `VStack`, `Grid`, `Panel`, `Card`/`Surface` patterns where supported by current packages.
- Feedback: `Notice`, `Snackbar`, `Spinner`, `ProgressBar`, `Placeholder`.
- Navigation: `TabPanel`, `Navigator`, `Navigation`, `MenuGroup`.
- Editor controls: `InspectorControls`, `PanelBody`, `ToolsPanel`, block supports, and SlotFills where appropriate.

Before using a component, confirm it exists and is stable in the installed WordPress/Gutenberg package version.

## Admin And Editor Consistency

- Match WordPress spacing, density, typography, button hierarchy, notices, and toolbar behavior.
- Use primary actions sparingly; not every save/test/export button is primary.
- Prefer WordPress notice patterns over custom banners.
- Keep settings and inspector controls grouped by user intent, not implementation class.
- Use progressive disclosure for advanced/destructive controls.
- Keep editor canvas controls and sidebar controls consistent with core block behavior.
- Match the editor surface to the data scope: classic-editor post metadata uses meta boxes; block-editor document metadata uses document settings panels; block attributes use inspector/block panels. Do not show newly implemented meta boxes inside the block editor unless maintaining a legacy compatibility contract.
- Avoid frontend marketing UI patterns inside wp-admin unless the product already has a deliberate branded app surface.

## Figma-To-Code Translation

When translating designs into WordPress UI:

- Map Figma components to WordPress components first, then fill gaps with minimal custom components.
- Convert colors, typography, spacing, radii, shadows, and layout values to existing `theme.json` presets, CSS custom properties, or WordPress component props when possible.
- Preserve component state coverage: default, hover, focus, active, disabled, loading, error, empty, selected, bulk-selected, and responsive.
- Do not hard-code design tokens if the plugin/theme already exposes token variables or `theme.json` presets.
- If the source is an image, screenshot, or approved mockup, preserve visual hierarchy and measurable spacing/typography/color intent while translating into WordPress-native components and tokens.
- Flag mismatches where the Figma design conflicts with WordPress conventions, accessibility, or editor behavior.

## Accessibility Requirements

- Every control has a visible label or accessible label.
- Error text is associated with the field it describes.
- Focus order follows task order and visible order.
- Keyboard users can reach and operate all controls.
- Modal/popover behavior traps and restores focus appropriately.
- Color is not the only indicator of state.
- Text contrast and focus visibility are checked in admin and editor contexts.
- Dynamic notices should be announced through WordPress notice/spoken-message patterns where applicable.

## Design Review Checklist

- Is there a core WordPress component or pattern for this UI?
- Does the UI behave consistently in admin, editor, site editor, and frontend contexts where it appears?
- Are loading, empty, error, success, disabled, and permission-denied states designed?
- Does the UI avoid global admin noise and unnecessary branding?
- Are strings translatable and concise?
- Are settings saved through real attributes/options and reflected in frontend output?
- Are tokens and spacing maintainable rather than one-off CSS values?
- Does the implementation avoid shipping duplicate component libraries or bundled WordPress packages?

## Implementation Notes

- Many `@wordpress/components` require the package stylesheet. In WordPress, ensure `wp-components` is a dependency of plugin/editor styles when needed.
- Use generated asset metadata or dependency extraction so WordPress package dependencies are enqueued correctly.
- Avoid bundling React, ReactDOM, WordPress packages, or large UI libraries into admin/editor bundles unless isolation is intentional.
- Keep custom CSS scoped to the plugin/block/admin page to avoid leaking styles into core screens.
