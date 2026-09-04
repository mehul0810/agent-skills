# Accessibility Review And Fix

Use for WordPress frontend/admin/editor and interactive workflows. Target WCAG 2.2 AA for changed interfaces unless stricter policy applies.

## Authoritative Anchors

- WordPress standards/testing: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/accessibility/ and https://developer.wordpress.org/block-editor/contributors/accessibility-testing/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WAI evaluation/APG: https://www.w3.org/WAI/test-evaluate/ and https://www.w3.org/WAI/ARIA/apg/

WCAG is normative; ARIA APG is implementation guidance, not a conformance certificate. No automated tool alone determines accessibility; knowledgeable human evaluation is required.

## Scope And Journey

Define exact revision/build, representative surfaces/roles/tasks, tested browser/device/input/assistive-technology pairs, authored versus fixed UI, target standard, and review boundary. A scoped sample is not site-wide conformance.

When editor-managed output changes, test both produced and authoring experience.

## Review Matrix

Inspect applicable initial, hover, focus, active, selected, expanded, disabled, loading, empty, error, success, validation, modal, and responsive states.

- Structure: language/title, landmarks/headings, lists/tables, reading/DOM order, and skip navigation.
- Names/semantics: native controls, names/descriptions, relationships, states, and status messages.
- Keyboard/focus: logical order, unobscured focus, no traps, modal entry/return/Escape, and pointer-free operation.
- Forms: persistent labels/instructions, required/autocomplete/grouping, associated errors, retained input, no needless re-entry, and consistent help.
- Visual: contrast, non-color cues, 200% text resize, 320 CSS-pixel reflow, orientation, text spacing, zoom, forced colors, and reduced motion.
- Input: pointer/voice/keyboard alternatives, target geometry, cancellation, and coarse-pointer/mobile support; apply the checks below.
- Dynamic UI: announced results/errors/progress, stable focus, no surprise context change, and recovery.
- Media/content: meaningful alt text, decorative handling, audio-only/video-only alternatives (`1.2.1`), prerecorded captions (`1.2.2`), live captions (`1.2.4`), and audio description (`1.2.5`) where applicable. A descriptive transcript alone cannot replace AA audio description for prerecorded synchronized video; no extra description is needed when the audio already conveys all important visuals. Test player keyboard controls, pause/stop/hide, audio control, and flash limits.
- WordPress: admin/toolbar obstruction, notices/list tables, block panels, component labels, editor canvas, saved content, and frontend parity.

## Remediation Rules

- Fix semantics/DOM order before ARIA. Prefer native controls and structural elements.
- A clickable `div` needs complete native-equivalent keyboard, focus, name, state, and disabled behavior, or replacement.
- Use ARIA APG patterns only for genuinely complex widgets and implement their full keyboard/focus contract.
- Use real labels, `fieldset`/`legend`, error associations, and concise status/live regions. Avoid noisy announcements.
- Never use positive `tabindex`. Keep focus visible, restore it after dialogs, and prevent sticky UI from obscuring it.
- Preserve font/zoom/color preferences, reduced motion, forced colors, and intrinsic reflow.
- Prefer WordPress components, but validate composition, labels, state, and workflow.
- Keep advanced controls organized and out of the basic path without hiding essential functionality from assistive technology.

## Easily Missed A And AA Checks

- Authentication (`3.3.8`): test login, OTP/MFA, and recovery. Support password managers and paste, including full-code paste into segmented OTP inputs. Cognitive tests need an allowed alternative/assistance/exception; exceptions do not waive other criteria or excuse blocked assistance as security policy.
- Speech/input: the accessible name contains the visible text label (`2.5.3`). Character-only shortcuts can be disabled, remapped with a non-character key, or active only on the focused component (`2.1.4`).
- Pointer: avoid down-event activation; provide abort/undo/reversal unless essential (`2.5.2`). Provide single-pointer alternatives to multipoint/path gestures (`2.5.1`) and dragging (`2.5.7`); motion actions need UI alternatives and disable controls where required (`2.5.4`).
- Hover/focus content (`1.4.13`): prove dismissible without moving focus/pointer, hoverable, and persistent until dismissal, trigger removal, or invalidation. Apply documented exceptions; keyboard access alone does not prove this.
- Contrast: normal text `4.5:1`, large text `3:1` (`18pt`, or `14pt` bold); necessary component/state boundaries and graphical objects `3:1` against adjacent colors. Record applicable logo, incidental, inactive, or unmodified-native exceptions rather than rounding a failure up.
- Test `200%` text resize (`1.4.4`) separately from reflow (`1.4.10`) at `320` CSS-pixel width or `256` height for vertical writing. A `1280px` viewport at `400%` zoom exercises horizontal reflow; `200%` zoom alone does not. Exceptions cover genuinely two-dimensional content, not its page.
- Text spacing (`1.4.12`): simultaneously override line height to `1.5`, paragraph spacing to `2em`, letter spacing to `0.12em`, word spacing to `0.16em`; verify no lost content/function. These are user-override tests, not mandatory default typography; account for scripts without a given spacing property.
- Targets (`2.5.8`): at least `24x24` CSS pixels, or prove an exception. For spacing, `24px`-diameter circles centered on undersized target bounds must not intersect another target or another undersized target's circle. Other exceptions: same-page equivalent, inline, unmodified user-agent control, essential/legal presentation.
- AA focus requires visibility (`2.4.7`) and no complete author-created obstruction (`2.4.11`), with applicable non-text contrast. `2.4.13 Focus Appearance` is AAA, an optional stronger design goal, not an AA failure by itself.

## Proof Stack

Run only applicable layers, but never substitute automation for manual task proof:

1. Static/lint and automated browser scan such as axe or an existing equivalent.
2. Keyboard-only journey: Tab/Shift+Tab, arrows where the pattern requires them, Enter/Space, Escape, focus entry/return, and no dead ends.
3. Screen-reader smoke using an available supported pair, such as VoiceOver/Safari on macOS or NVDA/Firefox on Windows. Report the exact pair; do not invent coverage.
4. Separate text-resize, reflow, spacing-override, and contrast checks above; add reduced-motion and forced-colors checks where relevant.
5. WordPress author workflow and saved frontend behavior for editor-managed output.

Record expected versus actual behavior and evidence for the affected states. Critical workflows require manual keyboard proof and assistive-technology proof or an explicit blocked gap.

## Completion And Claims

- Rerun the original failing state after the fix and add automated regression coverage where stable.
- A zero-violation automated scan is not an accessibility pass.
- Reports with an applicable accessibility domain require explicit `accessibilityClaim`: `scoped_review` or `wcag22_aa_conformance`. `qualityTarget` states the goal, not the achieved claim. Legacy ambiguous reports must be clarified, never grandfathered as conformance.
- Formal audits require `accessibilityAudit`: all 55 A/AA criteria exactly once (`4.1.1` is obsolete; AAA is separate), with status, rationale, and reusable check IDs. The ledger includes `fullPages`, `completeProcesses`, `accessibilitySupport`, `nonInterference`, `keyboard`, and `assistiveTechnology`; reuse evidence pointers rather than logs. Missing tests are `blocked`, not `not_applicable`.
- Record full-page scope and complete processes, accessibility-supported technologies, and non-interference, including third-party content. Include manual keyboard and named browser/screen-reader receipts. Sampling supports evaluation but cannot turn a component sample into a site-wide claim; constrain the claim to the proved full pages/processes.
- No conformance pass with failed/blocked criteria, unresolved A/AA findings, missing proof, or excluded fragments/steps of claimed pages/processes. Owner risk acceptance does not waive WCAG. Optional AAA-only advice may be a `P3` finding with `aaaAdvisoryCriteria`; never label an A/AA defect advisory to bypass the gate. Ordinary scoped reviews omit the formal matrix and label their conclusion scoped, never certified/conformant.
- Record `evaluatedOn`; any published claim also identifies WCAG's dated specification/URL, AA level, exact full-page/process scope, and technologies relied on. An evidence record is not publication approval.
- The validator checks evidence structure and consistency, not the truth of receipts or a certification; inspect the linked artifacts independently.
- Unresolved keyboard traps, inaccessible authentication/checkout/setup, missing critical names/errors, or unusable editor workflows are release-blocking `P1` findings.
