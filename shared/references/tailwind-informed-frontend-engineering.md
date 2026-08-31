# Tailwind-Informed Frontend Engineering

Use this reference only when the repository already uses Tailwind, a task explicitly requests Tailwind, or an isolated React/app surface is being evaluated for it. Tailwind is an implementation vocabulary, not a visual direction, a premium-design shortcut, or a default WordPress dependency.

Do not load this merely because a task asks for a modern, premium, image-led, or responsive interface. First choose the visual direction and WordPress ownership through the normal design, visual, block, or WordPress Design System route.

## Preflight

Establish facts before changing markup, CSS, or tooling:

- Detect the installed major version from the lockfile and actual CSS entrypoint. Do not infer v3 or v4 from class syntax alone. v3 commonly uses JavaScript configuration; v4 is CSS-first and can define theme variables with `@theme`.
- Inspect the build command, source/content discovery, generated CSS location, existing prefix or scoping, custom utilities/variants, and production artifact path.
- Map the existing token source: `theme.json`, WordPress Design System tokens, project CSS variables, Tailwind theme variables, or another established system. Assign one owner per token/property.
- Classify the surface: block theme/site frontend, classic/child theme, wp-admin/editor, or an intentionally isolated React app. The classification determines whether Tailwind is a compatible existing implementation detail or the wrong layer.

If these facts are absent, inspect the repository before adding Tailwind configuration, arbitrary utilities, a prefix, a reset, or a new build dependency.

## Design And Image Boundary

Use Tailwind concepts to make implementation coherent: a deliberate spacing and type scale, semantic colors, layout relationships, component states, mobile-first changes, container-aware composition, and reduced-motion/color-scheme behavior.

Do not make generated imagery or a visual brief `Tailwind-like`. A framework name does not establish a brand, buyer trust, product proof, hierarchy, content model, or enterprise visual direction. Describe the actual composition, copy-safe area, density, typography character, brand palette, truthful assets, primary task, and responsive crop instead. Do not recreate Tailwind marketing, component-library, or starter-dashboard geometry as a substitute for an approved target.

For a supplied image or Figma target, keep `visual-to-wordpress-implementation.md` primary. Use this reference only as the one support reference when existing utility CSS or build behavior is the confirmed risk.

## WordPress Boundary

- **Block themes and editable sites:** Prefer `theme.json`, Core/plugin blocks, patterns, block styles, variations, and scoped theme CSS. Tailwind must not replace editor-visible token ownership or turn page content into frozen utility-markup structures.
- **Plugin admin and editor surfaces:** Prefer `@wordpress/components`, `@wordpress/icons`, and the WordPress Design System. Use existing Tailwind only inside a proven isolated surface; do not let it override native admin/editor chrome or ship duplicate React/WordPress packages.
- **Isolated React/app surfaces:** Tailwind can be appropriate when the project already supports it or the explicit architecture decision justifies it. Preserve semantic HTML, WordPress capability/nonce/data boundaries, accessibility, and an owned component API rather than scattering one-off utility strings.
- **New WordPress projects:** Do not add Tailwind only to make the UI feel modern. Start with the native token/component system. Introduce it only after a measured architecture decision shows that an isolated app surface needs it and has a sustainable build, scope, and ownership model.

Treat Tailwind Preflight as a deliberate integration decision, not a default. Its base styles are opinionated and can reset margins, borders, and other assumptions. Do not globally inject Preflight into wp-admin, the block editor, or an existing theme. If an existing integration includes it, prove its scope and cascade impact before changing it; omit or isolate it when it conflicts with WordPress or third-party styles.

## Implementation And Build Discipline

- Keep utility usage semantic and repeatable. Extract a project-owned component, pattern, block style, or stable class contract when a utility bundle repeats or becomes hard to review.
- Never construct class names from runtime or user-controlled data. Use a finite, reviewed map for variants and verify that the configured source discovery includes every emitted class.
- Prefer existing semantic tokens over arbitrary values. A one-off value needs a visual or compatibility reason; recurring values become a semantic token at the correct owner layer.
- Preserve the repository's major-version conventions. Do not mix v3 configuration assumptions into v4 CSS-first configuration, or vice versa. Do not upgrade Tailwind as part of a visual task unless version migration is explicitly in scope.
- Build the production artifact and inspect generated CSS size, class coverage, source maps if shipped, dependency contents, and cache behavior. Do not ship development packages or unexplained broad source globs.
- Keep utility CSS scoped to its owning surface. Do not solve a conflict by raising specificity or adding global `!important` rules.

## Proof

Before completion, verify the changed surface in the packaged/build candidate:

- intended desktop, narrow, and intermediate/container-constrained layouts;
- keyboard/focus, reduced motion, light/dark or system behavior when supported, and content/translation stress;
- editor/admin, frontend, and Global Styles or third-party-component coexistence for affected WordPress surfaces;
- production build output and class discovery, with no missing dynamic variants or unexpected global reset;
- visitor and author/operator workflow proof required by the primary reference.

An observed cascade leak, missing production class, broken editor style, generic framework aesthetic, or visual regression is a failed implementation. Fix the owning token, component, scope, or build input and rerun the smallest affected proof set.

## Official References

- [Tailwind theme variables](https://tailwindcss.com/docs/theme)
- [Tailwind responsive design and container queries](https://tailwindcss.com/docs/responsive-design)
- [Tailwind Preflight](https://tailwindcss.com/docs/preflight)
- [Tailwind v4 upgrade guidance](https://tailwindcss.com/docs/upgrade-guide)
