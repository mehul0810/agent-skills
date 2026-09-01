# WordPress Typography System

Use this when a site, theme, editorial experience, landing page, or customer-facing product surface needs a new or materially changed typography system. Do not load it for tiny copy edits, routine native wp-admin typography, or an exact approved target whose type decisions are already fixed unless font behavior is a confirmed implementation risk.

Keep the owning specialist primary. This reference supplies the typography decision and proof contract; it does not replace visual direction, WordPress ownership, accessibility review, or exact-target parity.

## 1. Start With Content And Runtime Facts

Inspect the actual content and font assets before choosing sizes or families:

- audience, reading task, content density, hierarchy, and editorial versus operational use;
- real headings, paragraphs, labels, buttons, navigation, numbers, punctuation, code, and error text;
- brand-approved families, available files/axes/weights, license and redistribution rights, loading path, and fallback stack;
- required languages, scripts, diacritics, numerals, symbols, RTL/bidi behavior, and browser/editor surfaces.

Do not choose a typeface from its name, a specimen headline, or placeholder text alone. Inspect body copy and ambiguous glyphs such as `I`, `l`, `1`, `O`, and `0`; evaluate x-height, apertures, punctuation, numeric alignment, and language coverage in the contexts that will ship. A large x-height or any particular classification is evidence to evaluate, not a universal quality score.

## 2. Define One Owned Type System

Create semantic roles before CSS values: display, page title, section heading, body, lead, UI label, caption/meta, code/data, and any product-specific role that has a distinct job. Use the fewest roles that preserve hierarchy.

- Build a coherent scale from the base reading size and content hierarchy. A modular ratio is a starting aid, not a rule; optical correction and responsive bounds may differ by role.
- Prefer one capable family when weights, widths, styles, and language coverage provide enough contrast. If a second family is justified, use an evidenced pairing or compatible superfamily and record each family's job.
- Limit shipped families, weights, axes, and subsets to what the design uses. Do not synthesize unavailable bold/italic faces or add a font merely for novelty.
- Store canonical roles in `DESIGN.md` or the established design-token owner. Reject scattered raw sizes, near-duplicate roles, and component-local overrides without a documented reason.

For themes and site presentation, expose the supported scale through `theme.json` font-family and font-size presets, including bounded fluid sizes when appropriate. Apply semantic defaults through Global Styles, block styles, or scoped presentation layers so the editor and frontend share the system. Preserve user Global Styles precedence unless the product explicitly owns a locked presentation contract.

For plugin wp-admin/editor UI, keep WordPress Design System and native admin typography as the default. Do not impose a global product font on WordPress chrome. A plugin-owned customer surface or isolated app may use product typography within its verified scope.

Give non-technical authors useful named presets, not an unbounded palette of arbitrary sizes. Prove that allowed choices preserve hierarchy and that a saved editor selection reopens and renders consistently.

## 3. Tune Measure, Leading, And Tracking Together

Judge font size, line length, and line height as one reading system.

- For long-form single-column body copy, `45-75ch` is a useful starting range, with the final measure verified against the actual typeface, size, language, viewport, and content. It is not a universal limit for navigation, forms, dashboards, tables, code, or compact UI.
- Tune line height against x-height, width, size, script, and reading context. Body copy generally needs more separation than display type, but never encode one ratio or an x-height shortcut for every font and breakpoint.
- Apply heading letter-spacing only as a small optical correction supported by the rendered face. Do not apply blanket negative tracking to body text, translated strings, or scripts whose shaping/legibility it harms.
- Use intrinsic widths and relative units so zoom, user font preferences, translations, and container changes reflow rather than clip.

Typography must express hierarchy without relying only on visual size or color. Preserve semantic heading order, landmarks, and meaningful emphasis in the saved WordPress content.

## 4. Loading, Fallback, And Accessibility

- Choose `font-display`, preload, subsetting, and variable-font axes deliberately; measure font bytes, requests, render delay, and text/layout shift.
- Match fallback metrics where practical and test both fallback and loaded states. Never hide text indefinitely while a font loads.
- Test 200% text resize, 320 CSS-pixel reflow, browser/user font overrides, long words, untranslated strings, and every supported locale/direction.
- WCAG 2.2 SC 1.4.12 does not require authored text to use its override values. It requires no content or functionality loss when users apply the specified line, paragraph, letter, and word spacing. Test all four overrides together.
- Verify contrast and state distinctions for every supported color scheme; thin weights and small text do not earn a contrast exception because they look refined.

Current implementation anchors:

- WordPress Theme Handbook typography and fluid presets: https://developer.wordpress.org/themes/global-settings-and-styles/settings/typography/
- WordPress Global Settings and Styles: https://developer.wordpress.org/block-editor/how-to-guides/themes/global-settings-and-styles/
- Web.dev responsive typography: https://web.dev/learn/design/typography/
- WCAG 2.2 text spacing: https://www.w3.org/WAI/WCAG22/Understanding/text-spacing

## 5. Proof

Use real content, not a specimen-only page. For a material type-system change, record:

- canonical roles and token/preset lineage from design owner through `theme.json` or product tokens to computed output;
- font files, weights/axes, fallback stack, license/source, loading strategy, and measured asset/layout-shift impact;
- desktop, intermediate, and narrow captures using short and long headings, long-form copy, labels/actions, numbers, and failure text;
- supported language/script, RTL, fallback-font, 200% resize, 320px reflow, and WCAG text-spacing-override results;
- editor/frontend parity: named presets, save/reopen, representative author choice, and rendered result;
- intentional deviations, unsupported glyph/script coverage, and the safe fallback.

An attractive desktop screenshot is not proof of a sound type system. Fail completion for clipped/overlapping text, unreadable measure, missing glyphs, unowned raw values, editor/frontend divergence, font-induced layout shift beyond budget, or typography that loses semantic hierarchy.

## Output

Report the content/type read, selected families and jobs, semantic scale, measure/leading/tracking decisions, WordPress ownership, author controls, loading/performance behavior, proof matrix, and unresolved risks. Keep raw computed-style measurements and screenshots in the design or proof artifact rather than chat.
