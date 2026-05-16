# Accessibility, I18n, And Global Readiness

Use this for WCAG/accessibility review, keyboard/screen-reader support, WordPress admin/editor accessibility, internationalization, localization, RTL, multilingual/global sites, and locale-aware performance.

## Current Official Anchors

- WordPress Accessibility Coding Standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/accessibility/
- WordPress plugin internationalization: https://developer.wordpress.org/plugins/internationalization/
- WordPress theme internationalization: https://developer.wordpress.org/themes/advanced-topics/internationalization/
- Block Editor components: https://developer.wordpress.org/block-editor/reference-guides/components/
- WordPress Design Handbook: https://make.wordpress.org/design/handbook/

## Accessibility Standard

For WordPress ecosystem work, target WCAG 2.2 Level AA for new and updated interfaces unless the client has a stricter standard.

Design and code for:

- Keyboard-only operation with visible focus and logical focus order.
- Semantic headings, landmarks, labels, descriptions, status messages, and form errors.
- Screen-reader usable dynamic updates with appropriate ARIA only when native semantics are insufficient.
- Color contrast, motion reduction, zoom/reflow, touch targets, and responsive layouts.
- Accessible media: alt text, captions/transcripts, decorative image handling, and meaningful link text.
- Admin/editor parity: components must work inside WordPress admin, block editor sidebars, modals, notices, and list tables.

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

## Validation

- Keyboard pass: tab order, focus trap, escape behavior, and no keyboard dead ends.
- Screen-reader smoke: labels, names, roles, status announcements, and modal behavior.
- Automated checks: axe/Playwright, pa11y, eslint-jsx-a11y, or project equivalent where available.
- WordPress checks: PHPCS accessibility rules when configured, WPCS escaping/i18n sniffs, JS i18n extraction.
- RTL and translation smoke: enable RTL locale, long strings, plural forms, and non-Latin content.
- Responsive checks: mobile, tablet, desktop, zoom at 200%, and reduced motion.
