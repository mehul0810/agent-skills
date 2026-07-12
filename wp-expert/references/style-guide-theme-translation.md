# Style Guide To WordPress Theme Translation

Use this when implementing a design system, style/brand guide, design patterns/tokens, custom theme, block theme, or child theme. For a supplied visual target, use `../../shared/references/visual-to-wordpress-implementation.md` as primary and load this only for a confirmed style-system risk.

## Core Principle

Convert design intent into durable WordPress primitives first: `theme.json`, block supports, templates, template parts, patterns, block styles, block variations, scoped CSS, and existing theme extension points. Use custom blocks or heavy overrides only when the design system requires structured editing, dynamic data, or behavior that native layers cannot provide safely.

## Inputs To Extract

- Brand foundations: logo use, voice, imagery style, icon style, motion style, accessibility commitments.
- Design tokens: colors, typography, spacing, layout widths, radii, borders, shadows, z-index, breakpoints, motion, focus states.
- Design patterns: header, footer, navigation, hero, cards, feature grids, forms, tables, accordions, modals, CTAs, testimonials, pricing, search/filter, post grids.
- Component states: default, hover, focus, active, disabled, loading, success, warning, error, empty, permission denied.
- Content behavior: short/long copy, translated strings, missing media, dynamic content, editorial overrides.
- Platform constraints: parent theme, child theme, block theme/classic theme, theme.json support, builder/plugin dependencies, WooCommerce, multisite, VIP.

## Existing Theme Audit

Before implementing, inspect:

- Parent and child theme relationship.
- Existing `theme.json`, global styles, style variations, block styles, patterns, template parts, templates, and Customizer settings.
- Existing CSS custom properties, Sass variables, utility classes, design tokens, and build pipeline.
- Existing block registrations, block variations, block bindings, and allowed blocks.
- Existing header/footer builders, theme hooks, widget areas, nav locations, WooCommerce templates, and plugin-provided layout controls.
- Visual debt: one-off CSS, hard-coded colors, duplicated spacing, Custom HTML blocks, shortcodes used for layout, page-builder fragments.

## Custom Theme Or Child Theme

Choose a child theme when:

- The parent theme already provides the desired architecture, templates, hooks, and update path.
- The task is site-specific presentation, tokens, styles, patterns, template parts, or small template overrides.
- Preserving parent updates and ecosystem compatibility is valuable.

Choose a custom theme when:

- The design system requires a coherent token model, template architecture, and block/pattern library that the parent theme fights.
- The parent theme would require broad overrides, fragile CSS, or disabling core features.
- Long-term ownership, performance, accessibility, and maintainability are more important than inheriting parent theme UI.

Choose a plugin when:

- The feature owns durable data, CPTs, taxonomies, options, REST routes, business logic, or cross-theme blocks.
- The functionality must survive theme changes.

## Token Translation

Map tokens in this order:

1. Primitive tokens: raw values from the style guide.
2. Semantic tokens: role-based aliases such as `surface`, `text`, `muted`, `accent`, `danger`, `success`, `focus`, `control-border`.
3. Component tokens: button, card, form, nav, table, modal, and block-specific values.
4. WordPress implementation: `theme.json` presets/settings/styles, CSS custom properties, block styles, block variations, and component props.

Rules:

- Prefer `theme.json` presets and settings over hard-coded CSS where editor/frontend parity matters.
- Use semantic names that survive brand refreshes.
- Keep token names stable and avoid leaking design-tool naming quirks into public APIs.
- Do not duplicate the same color, spacing, radius, or shadow across many CSS files.
- Validate color contrast and focus states when translating palette tokens.

## Pattern And Component Translation

- Convert repeated page sections into patterns first.
- Convert alternate visual treatments into block styles when only CSS changes.
- Convert preset compositions into block variations when initial attributes or inner blocks are needed.
- Convert global reusable regions into template parts.
- Convert constrained structured editing into custom blocks with `InnerBlocks` and locking.
- Convert dynamic data or permission-aware output into dynamic blocks or plugin-rendered components.

## Premium And Enterprise Feel

Never ship an interface that feels generic, inconsistent, or unfinished when the user expects a premium or enterprise result.

- Typography must feel deliberate: hierarchy, rhythm, readable line length, and consistent scale.
- Spacing must be systematic, not manually nudged per section.
- Components must include full state coverage, not only the happy path.
- Interactions must be calm, fast, accessible, and reversible where risk exists.
- Visual polish must serve clarity: restrained elevation, crisp alignment, high-quality imagery, consistent iconography, and strong contrast.
- Admin/editor surfaces should feel WordPress-native unless the product has an established branded app surface.
- Frontend experiences should look custom to the brand, not like a copied starter template.

## Implementation Checklist

- Style guide tokens are represented in `theme.json` or scoped token files.
- Parent/child/custom theme decision is documented.
- Existing theme extension points are used before broad overrides.
- Patterns, template parts, block styles, and variations are preferred before custom blocks.
- Premium/enterprise visual quality is validated across responsive breakpoints.
- Editor and frontend output remain visually aligned.
- Accessibility states are included in the design translation.
- Release artifacts include built assets and exclude development-only dependencies.
