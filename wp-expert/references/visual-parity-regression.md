# Visual Parity And Enterprise Theme Proof

Use as the one support when theme, FSE, site, block, or UI work needs deterministic regression, browser evidence, content stress, or visitor/editor workflow proof. For a supplied target, keep `../../shared/references/visual-to-wordpress-implementation.md` primary.

Official anchors: `https://developer.wordpress.org/themes/advanced-topics/testing/` and `https://developer.wordpress.org/news/2026/05/getting-started-writing-wordpress-e2e-tests-with-playwright/`.

## Capture Fingerprint

Record exact commit/package; WordPress, Gutenberg, theme, PHP, and relevant plugins; browser/OS/DPR/viewport/zoom/scroll; locale/timezone/scheme/preferences/role/fixture; and font/media/network/animation stabilization. Freeze volatile inputs. A development checkout is not release-artifact proof.

## Baseline Governance

- Capture before editing for regression protection; an approved source visual is the baseline for new exact work.
- Name artifacts `{surface}-{state}-{viewport}-{engine}.png`; record masks, regional tolerances, and platform differences.
- Baseline updates are reviewed design decisions, not CI repairs. Reject a different profile, fixture, or build.

## Comparison And Workflows

Compare geometry, spacing, alignment, type, color, borders, shadows, stacking, crops, and states. Prefer overlays or perceptual/region diffs plus semantic/DOM assertions. Use strict hard-edge tolerances and perceptual tolerance for text, shadows, and decoding. Investigate differences; reject viewport-offset patches that break intrinsic layout, accessibility, editor controls, or maintainability.

Define:

- Visitor workflow: entry, primary action, feedback, completion, and recovery.
- Author workflow: locate, edit representative content/settings, reorder allowed areas, save, reload, preview, and recover through revisions/rollback where supported.

Use Playwright/Cypress for stable critical flows. Screenshots alone do not prove task success.

## Content And Responsive Stress

Use existing fixtures or selected WordPress Theme Unit Test Data cases: expanded/translated copy, missing/extreme media, tables/embeds, changed block supports; query empty/error/high-count; affected templates; and relevant roles/multisite. Do not run the whole matrix for a narrow change; state why omitted surfaces cannot regress.

- Start narrow and at target desktop, then resize continuously through the affected range.
- Prefer intrinsic layout, `minmax()`, `clamp()`, flex/grid wrapping, logical properties, and container queries; device names are not architecture.
- Test applicable orientation/safe-area/dynamic-viewport, zoom/reflow, localization, coarse pointer/no hover, keyboard, reduced motion, and on-screen keyboard risks.
- Follow the documented browser policy. Add WebKit/Firefox or real touch proof when CSS/input/sticky/forms/navigation/media risks make Chromium insufficient.
- Verify applicable WCAG 2.2 AA behavior: focus, target size, dragging alternatives, labels/errors, contrast, landmarks, and authentication.

For material UI, record supported, best-effort, and unsupported browser/assistive-technology cells, fallback, owner, and last verification in `COMPATIBILITY.md` or `DESIGN.md`. Capture affected supported cells from the packaged candidate and state gaps.

## Design-System Integrity And Proof Provenance

- Name each changed token/component's canonical source owner and trace it through `theme.json`, WordPress components, CSS variables, block styles, or assets to rendered proof.
- Prefer semantic tokens. Raw values require reason, scope, owner, and review trigger; reject near-duplicates and selector-hidden drift.
- Use the visual receipt's `aligned`, `intentional_deviation`, or `drift` disposition. Elevated work fails on unowned values or unexplained drift.
- For screenshots, metrics, use cases, or trust claims, record source owner, as-of window, audience/role, environment, `real`/`controlled demo`/`illustrative` status, scope, and limitations. A fixture cannot imply unevidenced scale, identity, certification, or outcomes.

## Performance, Release, And Output

Measure against repo-specific budgets: LCP/CLS/INP risk, CSS/JS/font/image weight, requests, critical rendering, and editor responsiveness. Separate lab from field evidence.

Before beta/production readiness, repeat critical proof against the packaged ZIP or release-branch build. Report fingerprint, provenance, surfaces/states/content/browsers, workflows, diff, performance, deviations, failed/skipped gaps, and release impact.
