# Theme Frontend Performance Quality Gate

Use this for WordPress theme, block theme, frontend, marketing-page, and conversion-page work where performance, Core Web Vitals, responsive quality, and enterprise polish matter.

Use alongside `theme-and-block-editor.md`, `block-theme-architecture.md`, `custom-block-theme-from-design.md`, `performance-profiling-scale-budgets.md`, `visual-parity-regression.md`, and `conversion-focused-website-engineering.md`.

## Frontend Performance Priorities

- LCP: fast hero/content render, optimized images, no render-blocking bloat.
- CLS: stable dimensions for media, embeds, ads, notices, headers, and dynamic blocks.
- INP: low JS execution, responsive controls, no heavy hydration on simple pages.
- Cacheability: public pages should remain edge/page-cache friendly where possible.
- Asset scope: load CSS/JS only on templates, blocks, or routes that need them.

## Theme Asset Checklist

- Use `wp_enqueue_scripts` with dependencies and versions, not hardcoded tags.
- Use generated asset metadata where the build pipeline supports it.
- Split editor-only, frontend-only, block-view, and admin assets.
- Avoid loading global CSS/JS for one block or template.
- Avoid bundling React, WordPress packages, icon libraries, sliders, or animation libraries when native/browser APIs are enough.
- Remove unused starter-theme CSS, duplicate resets, and global selectors that fight block output.

## Fonts

- Use the smallest needed font families, weights, and subsets.
- Prefer self-hosted or theme-managed fonts when privacy/performance requires it.
- Use `font-display` deliberately.
- Preload only truly critical fonts.
- Avoid layout shifts from late font swaps by matching fallback metrics when practical.

## Images And Media

- Use WordPress responsive image functions and correct `sizes`.
- Set width/height or aspect-ratio for all media that can affect CLS.
- Use appropriate formats and compression; avoid huge hero images on mobile.
- Preserve focal points and crops from the design.
- Lazy load below-fold media; do not lazy load the LCP image unless evidence says it helps.
- Validate missing image, long caption, and translated alt/text states.

## Block Theme Specifics

- Keep `theme.json` tokens and block styles intentional; do not generate broad CSS overrides for every section.
- Avoid excessive nested Groups/Columns when simpler layout primitives work.
- Check Global Styles output for duplicate or overly broad rules.
- Use block styles/variations/patterns to reduce custom CSS drift.
- Validate Site Editor canvas and frontend output; performance fixes must not break editor usability.

## JavaScript And Interaction

- Prefer CSS and native browser behavior for simple interactions.
- Use Interactivity API or scoped vanilla JS only when state is needed.
- Defer non-critical scripts and avoid blocking initial render.
- Keep third-party scripts consent-aware, async where safe, and isolated from critical interactions.
- Avoid carousels, animations, and modals that degrade keyboard, focus, INP, or CLS.

## Quality Gate

Before calling frontend/theme work done:

- Mobile, tablet, desktop, and wide layouts are checked for changed templates.
- LCP image/media sizing is deliberate.
- CLS-sensitive elements have dimensions/reserved space.
- Frontend and editor CSS are scoped correctly.
- Scripts/styles load only where needed.
- Keyboard focus, contrast, headings, landmarks, labels, and reduced motion are preserved.
- Visual parity is checked when design fidelity matters.
- If performance tooling is unavailable, the limitation is reported and cheaper checks are run.
