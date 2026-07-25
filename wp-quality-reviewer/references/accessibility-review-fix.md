# Accessibility Review And Fix

Use for WordPress frontend, admin, block editor, onboarding, settings, blocks, patterns, and interactive workflows. Target WCAG 2.2 Level AA for new and changed interfaces unless a stricter project requirement applies.

## Authoritative Anchors

- WordPress accessibility coding standard: https://make.wordpress.org/accessibility/handbook/which-questions-should-you-ask/
- WordPress block editor accessibility testing: https://developer.wordpress.org/block-editor/contributors/accessibility-testing/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WAI evaluation guidance: https://www.w3.org/WAI/test-evaluate/
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/

WCAG is normative; ARIA APG is implementation guidance, not a design system or conformance certificate. W3C states that no automated tool alone determines accessibility; knowledgeable human evaluation is required.

## Scope And Journey

Define:

- Exact revision/build, representative pages/screens, user roles, and critical tasks.
- Browser/device/input/assistive-technology combinations actually tested.
- Content authored by users versus fixed product UI.
- Target standard and exclusions. Do not claim site-wide WCAG conformance from a changed-component review.

For WordPress, test both the produced experience and the authoring experience when blocks, patterns, controls, templates, or editor-managed content change.

## Review Matrix

Inspect each relevant state: initial, hover, focus, active, selected, expanded, disabled, loading, empty, error, success, validation, modal/open, and responsive.

- Structure: language, title, landmarks, one logical heading outline, lists/tables, reading/DOM order, and skip navigation.
- Names and semantics: native controls, accessible names/descriptions, programmatic relationships, current/expanded/selected states, and status messages.
- Keyboard/focus: logical order, visible and unobscured focus, no traps/dead ends, correct modal entry/return, Escape behavior, and full operation without pointer.
- Forms: persistent labels, instructions, required state, autocomplete, grouped controls, error association, summary/focus, and retained input.
- Visual: contrast, non-color cues, 200% text resize, 320 CSS-pixel reflow, orientation, text spacing, zoom, forced colors, and reduced motion.
- Input: at least 24x24 CSS-pixel targets or a valid exception, single-pointer alternative for dragging, no hover-only action, and coarse-pointer/mobile support.
- Dynamic UI: announced results/errors/progress, stable focus, no surprise context change, and timeout/session recovery.
- Media/content: meaningful alt text, decorative handling, captions/transcripts, descriptive links/buttons, and understandable instructions.
- WordPress: admin bar/toolbar obstruction, notices, list tables, block toolbar/inspector/document panels, component labels/help, editor canvas, saved content, and frontend parity.

## Remediation Rules

- Fix semantics and DOM order before adding ARIA. Prefer native `button`, `a`, `input`, `select`, `details`, headings, lists, and tables.
- A clickable `div` is not repaired by adding only `role="button"`; implement the complete native-equivalent keyboard, focus, name, state, and disabled behavior or replace it.
- Use ARIA APG patterns only for genuinely complex widgets and implement their full keyboard/focus contract.
- Use real labels, `fieldset`/`legend`, error associations, and concise status/live regions. Avoid noisy announcements.
- Never use positive `tabindex`. Keep focus visible, restore it after dialogs, and prevent sticky UI from obscuring it.
- Preserve user font/zoom/color preferences, `prefers-reduced-motion`, forced-colors, and intrinsic mobile-first reflow.
- Prefer accessible WordPress components, but still validate their composition, labels, state, and surrounding workflow.
- Keep advanced controls organized and out of the basic path without hiding essential functionality from assistive technology.

## Proof Stack

Run only applicable layers, but never substitute automation for manual task proof:

1. Static/lint and automated browser scan such as axe or an existing equivalent.
2. Keyboard-only journey: Tab/Shift+Tab, arrows where the pattern requires them, Enter/Space, Escape, focus entry/return, and no dead ends.
3. Screen-reader smoke using an available supported pair, such as VoiceOver/Safari on macOS or NVDA/Firefox on Windows. Report the exact pair; do not invent coverage.
4. Responsive/reflow at narrow viewport and 200% zoom, plus contrast, reduced-motion, and forced-colors checks where relevant.
5. WordPress author workflow and saved frontend behavior for editor-managed output.

Record expected versus actual behavior and evidence for the affected states. Critical workflows require manual keyboard proof and assistive-technology proof or an explicit blocked gap.

## Completion And Claims

- Rerun the original failing state after the fix and add automated regression coverage where stable.
- A zero-violation automated scan is not an accessibility pass.
- Do not claim WCAG conformance without a defined representative sample, all applicable success criteria, manual evaluation, and documented exclusions.
- Unresolved keyboard traps, inaccessible authentication/checkout/setup, missing critical names/errors, or unusable editor workflows are release-blocking `P1` findings.
