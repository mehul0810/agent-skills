# Accessibility, I18n, And Global Readiness

Use this for WCAG/accessibility review, keyboard/screen-reader support, WordPress admin/editor accessibility, internationalization, localization, RTL, multilingual/global sites, and locale-aware performance. For a custom widget or consequential save/retry flow, load `../../shared/references/interaction-and-form-resilience.md` as the single support; do not load it for static or native controls.

## Current Official Anchors

- WordPress Accessibility Coding Standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/accessibility/
- WordPress plugin internationalization: https://developer.wordpress.org/plugins/internationalization/
- WordPress theme internationalization: https://developer.wordpress.org/themes/advanced-topics/internationalization/
- Block Editor components: https://developer.wordpress.org/block-editor/reference-guides/components/
- WordPress Design Handbook: https://make.wordpress.org/design/handbook/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WCAG 2.2 additions: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- W3C HTML bidi authoring practices: https://www.w3.org/International/docs/bp-html-bidi/
- WordPress light and dark mode block themes: https://developer.wordpress.org/news/2024/12/mastering-light-and-dark-mode-styling-in-block-themes/
- CSS `color-scheme`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme

## Accessibility Standard

For WordPress ecosystem work, target WCAG 2.2 Level AA for new and updated interfaces unless the client has a stricter standard.

Design and code for:

- Keyboard-only operation with visible focus and logical focus order.
- Semantic headings, landmarks, labels, descriptions, status messages, and form errors.
- Screen-reader usable dynamic updates with appropriate ARIA only when native semantics are insufficient.
- Color contrast, motion reduction, zoom/reflow, touch targets, and responsive layouts.
- Accessible media: alt text, captions, audio description where required, decorative handling, and meaningful links; transcripts alone do not satisfy AA video description.
- Admin/editor parity: components must work inside WordPress admin, block editor sidebars, modals, notices, and list tables.

Operationalize WCAG 2.2 AA where applicable:

- Keep focused controls at least partially visible when sticky headers, cookie banners, drawers, toolbars, or admin bars are present (`2.4.11 Focus Not Obscured`).
- Provide a single-pointer alternative for custom dragging interactions (`2.5.7 Dragging Movements`).
- Keep pointer targets at least `24x24` CSS pixels or satisfy the spacing/equivalent-control exceptions (`2.5.8 Target Size`).
- Keep repeated help mechanisms in a consistent relative order across a journey (`3.2.6 Consistent Help`).
- In a multi-step process, reuse or offer information already entered instead of requiring users to remember and retype it unless a documented exception applies (`3.3.7 Redundant Entry`).
- Support password managers/paste throughout login, OTP/MFA, and recovery; cognitive tests need a permitted alternative, assistance, or exception (`3.3.8 Accessible Authentication`).
- Require visible focus (`2.4.7`) and applicable non-text contrast. `2.4.13 Focus Appearance` is optional AAA, not AA.
- For legal, financial, permission, or other high-consequence data entry, provide review, confirmation, correction, or reversible recovery as applicable (`3.3.4 Error Prevention`).
- Treat these as acceptance checks, not wording-only compliance claims.

For an accessibility audit, use `../../wp-quality-reviewer/references/accessibility-review-fix.md` as the primary mode: it owns measurable contrast/reflow/text-spacing/target tests, speech/pointer/hover contracts, authentication exceptions, and formal AA evidence. A scoped change review or clean axe scan is not WCAG conformance.

## WordPress UI Guidance

- Prefer WordPress-native components for admin/editor UI when available.
- Use `BaseControl`, `TextControl`, `SelectControl`, `ToggleControl`, `Notice`, `Modal`, `PanelBody`, and related components with proper labels/help text.
- Classic editor metadata UI belongs in meta boxes.
- Block editor document-level metadata belongs in document/sidebar panels.
- Block-specific controls belong in inspector/block panels.
- Do not show newly implemented meta boxes in the block editor unless preserving an intentional legacy compatibility surface.

## Internationalization Rules

- Wrap user-facing PHP strings with the correct i18n function and project text domain.
- Escape translated output at the final boundary: `esc_html__()`, `esc_attr__()`, `esc_html_e()`, `esc_attr_e()`, or translate then escape when markup is involved.
- Use translator comments for placeholders and ambiguous strings.
- Use plural and context functions where needed: `_n()`, `_nx()`, `_x()`.
- Do not concatenate translatable sentence fragments that prevent correct grammar in other languages.
- For JavaScript, use `@wordpress/i18n` and ensure translation extraction/build tooling is configured.
- Keep text domains consistent with plugin/theme headers and language file generation.

## Global Readiness

- Support RTL layouts and avoid directional CSS assumptions.
- Use locale-aware dates, times, numbers, currency, collation, and sorting.
- Include locale/site/blog/language in cache keys when output varies by language or region.
- Validate multilingual routing, canonical URLs, hreflang, sitemaps, and translated slugs for SEO-sensitive projects.
- Account for regional privacy/consent requirements and data residency constraints when the client operates globally.
- Test on mobile-first layouts with translated strings that are longer than English.

## Direction, Locale, And Color-Scheme Contract

Treat direction, locale, and color scheme as independent runtime dimensions. Do not infer direction only from a language label.

- Set the document base direction with `dir="rtl"` on the `html` element when the document is RTL. Use `dir="auto"` or `bdi` for unknown or mixed-direction values; do not use CSS or Unicode control characters to establish the document direction.
- Prefer logical CSS (`margin-inline`, `padding-block`, `inset-inline`, `text-align: start/end`, flow-relative borders and transforms). Mirror directional affordances such as arrows, drawers, breadcrumbs, and progress indicators only when their meaning is directional; do not mirror logos, branded artwork, charts, or data whose meaning would change.
- Isolate mixed-direction usernames, IDs, domains, URLs, code, numbers, dates, and currency with appropriate markup and formatting. Verify tables, forms, validation messages, menus, sticky regions, dialogs, charts, and keyboard/focus order in both directions.
- Define translation ownership, supported locales, fallback behavior, plural/context rules, and how translated block attributes, patterns, slugs, media text, errors, and emails are updated. Never leave a partially translated critical flow or place essential copy only in an image.
- Exercise short and expanded strings, non-Latin/CJK scripts, plural and grammatical variants, locale time zones, number/date/currency formats, sorting, search, forms, and language switching. Include locale and direction in cache, preview, analytics, and API variation keys when output differs.
- Decide explicitly whether a surface supports `light`, `dark`, `system`, or a documented single scheme. Use semantic token pairs for surfaces, text, borders, links, focus, status, controls, code, media, and shadows; validate contrast and state distinctions in every supported scheme.
- If both schemes are supported, expose `color-scheme`/`prefers-color-scheme` or an equivalent product preference without a flash of the wrong theme, define preference precedence (user choice, then system, then product default), persist it safely, and keep editor, admin, frontend, embeds, and third-party controls coherent. Verify target WordPress/Gutenberg support; `theme.json` alone does not guarantee a mode switch.

## Adaptive Enterprise Matrix

For material user-facing work, record only the applicable dimensions and their supported, degraded, or unavailable behavior: LTR/RTL, locale/script, light/dark/system, forced colors/high contrast, reduced motion/data/transparency, zoom/text reflow, viewport/orientation/safe area, coarse pointer/no hover, browser/assistive technology, role/tenant/multisite, network/offline, and content density. Define a safe fallback and owner for each unsupported dimension. Use `Not applicable - reason` rather than silently omitting a dimension; do not expand a low-risk change into an exhaustive matrix without evidence.

## Browser And Assistive-Technology Support Matrix

For a material interface, own a concise support matrix in `COMPATIBILITY.md` or `DESIGN.md`: browser engine/version, operating system/device/input mode, browser/assistive-technology pair, WordPress/Gutenberg/editor surface, and any required locale or color scheme. Mark each cell `supported`, `best-effort`, or `unsupported` with its fallback, owner, and last verification. A Chromium screenshot or automated scan is one evidence cell, not a cross-browser or task-usability claim. Test the packaged/release candidate on every supported cell affected by the change; report skipped or unsupported cells explicitly.

## Validation

- Keyboard pass: tab order, focus trap, escape behavior, and no keyboard dead ends.
- Screen-reader smoke: labels, names, roles, status announcements, and modal behavior; report the actual supported browser/assistive-technology pair rather than an unspecified pass.
- Automated checks: axe/Playwright, pa11y, eslint-jsx-a11y, or project equivalent where available.
- WordPress checks: PHPCS accessibility rules when configured, WPCS escaping/i18n sniffs, JS i18n extraction.
- RTL and translation smoke: enable an RTL locale, mixed-direction values, long strings, plural/context forms, non-Latin/CJK content, translated slugs/routes, and locale-specific dates/numbers/currency.
- Color and preference smoke: capture each supported light/dark/system mode plus forced-colors/high-contrast and reduced-motion/data behavior where relevant; check editor/admin/frontend parity, no theme flash, focus, controls, status, charts, images, embeds, and user override persistence.
- Responsive checks: 200% text resize, reflow at 320 CSS pixels without two-dimensional scrolling except essential content, orientation changes, and no keyboard obstruction.
- Input checks: keyboard, touch/coarse pointer, no-hover operation, dragging alternative, target size, visible unobscured focus, autofill/autocomplete, retained multi-step input, and consistent help when applicable.
- Visual adaptation: reduced motion, forced-colors/high-contrast mode, user color/spacing overrides where relevant, and no information conveyed by color alone.
- Manual assistive-technology smoke remains required for critical journeys; automated tools cannot prove task usability.

For a material global or mode change, the compact proof receipt names the exact WordPress/theme/plugin build, locale/direction, color scheme, preference flags, browser/assistive-technology pair, viewport, fixtures, and unsupported dimensions. Capture at least one representative LTR and RTL state, one expansion-heavy locale/script, and every supported color scheme; a non-supported dimension must carry its reason and fallback. Do not claim global readiness from a stylesheet, translation extraction, or automated scan alone.
