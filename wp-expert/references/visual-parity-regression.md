# Visual Parity And Enterprise Theme Proof

Use this as the one supporting reference when theme, FSE, site, block, or UI work needs deterministic visual regression, browser evidence, content stress, or proven visitor/editor workflows. For a supplied visual target, keep `../../shared/references/visual-to-wordpress-implementation.md` primary.

Official anchors: `https://developer.wordpress.org/themes/advanced-topics/testing/` and `https://developer.wordpress.org/news/2026/05/getting-started-writing-wordpress-e2e-tests-with-playwright/`.

## Capture Fingerprint

Before baseline or candidate capture, record:

- exact commit and packaged/build artifact,
- WordPress, Gutenberg, active theme/child theme, PHP, and relevant plugin versions,
- browser engine/version, operating system, device-pixel ratio, viewport, zoom, scroll position, and scrollbar behavior,
- locale, timezone, color scheme, reduced-motion preference, permissions/role, and data fixture,
- loaded font files/weights, image readiness, network-settle rule, and animation/caret/clock/random-data treatment.

Wait for fonts and critical media. Freeze dates, randomized content, external API data, transitions, animations, carets, and other volatile inputs where possible. Never compare a development checkout against a release artifact while calling the result release proof.

## Baseline Governance

- Capture baseline before editing when regression protection is the goal; use the approved source visual as baseline for new exact work.
- Store deterministic names such as `{surface}-{state}-{viewport}-{engine}.png` with the related artifact or CI output.
- A baseline update is a reviewed design decision, not a way to make CI green.
- Record expected masks, region tolerances, and intentional platform differences.
- Reject stale baselines from another browser profile, content fixture, or build.

## Visual Comparison

Compare geometry, spacing, alignment, typography, colors, borders, shadows, stacking, asset crop, and visible state treatment. Prefer overlays or perceptual/region diffs over memory. Use semantic or DOM assertions alongside screenshots for headings, landmarks, controls, and block structure.

Apply region-specific tolerance. Hard edges and alignment can be strict; text rasterization, shadows, and image decoding require perceptual tolerance. Investigate unexplained differences instead of adding viewport-specific offsets. Reject fixes that improve one screenshot while breaking intrinsic layout, accessibility, editor controls, or maintainability.

## Golden Workflow Proof

Every substantial theme/page implementation defines:

- Visitor workflow: entry, primary action, feedback, completion, and recovery/failure path.
- Author workflow: locate the content, edit text/media/settings, reorder only allowed areas, save, reload, preview, and recover through revisions or rollback where supported.

Use Playwright/Cypress for stable critical flows when available. Keep the suite focused; screenshots alone do not prove task success.

## Content And Template Stress

Use existing fixtures or WordPress Theme Unit Test Data when broad theme behavior matters. Select affected cases from:

- long/short/translated titles and body copy, missing or extreme media, captions, galleries, embeds, tables, and every changed core block support,
- query empty/loading/error/high-count states, sticky and password-protected content,
- home, singular, page, archive, taxonomy, author, search, 404, pagination, comments, and navigation,
- logged-out, author/editor, administrator, permission-limited, and multisite states when relevant.

Do not run the full matrix for a one-line scoped change. Record why omitted surfaces cannot regress.

## Responsive, Input, Browser, And Accessibility Matrix

- Start at the narrow supported width and target desktop, then resize continuously through the affected range to catch intermediate collapse.
- Prefer intrinsic layout, `minmax()`, `clamp()`, flex/grid wrapping, logical properties, and container queries when component context matters; do not encode device names as architecture.
- Test portrait/landscape, safe areas, dynamic viewport units, zoom/reflow, long localization, coarse pointer, hover absence, keyboard, reduced motion, and on-screen keyboard risk when applicable.
- Use the documented browser support policy. Add WebKit/Firefox or a real touch device when CSS, input, sticky positioning, forms, navigation, or media behavior makes Chromium-only proof insufficient.
- Verify WCAG 2.2 AA criteria relevant to the change, including focus not obscured, target size, pointer alternatives to dragging, labels/errors, contrast, landmarks, and accessible authentication.

## Performance And Release Evidence

Measure against repo-specific budgets from `DESIGN.md`, `TESTING.md`, or the issue: LCP/CLS/INP risk, CSS/JS/font/image weight, request count, critical rendering, and editor responsiveness where relevant. Lab evidence is not field evidence; report RUM separately when available.

Before beta/production readiness, repeat critical proof against the packaged ZIP or release-branch build. Report exact environment, passed/failed/skipped workflows, visual deviations, browser gaps, performance gaps, and whether any gap is acceptable for release.

## Output

Report capture fingerprint, baseline provenance, surfaces/states/content/browsers covered, visitor and author workflow results, diff summary, performance evidence, intentional deviations, and remaining risk.
