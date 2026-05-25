# Visual Parity Regression

Use this when UI/UX, block editor, theme, or FSE work must match design intent across editor and frontend.

## Goals

- Keep Site Editor, post editor canvas, preview, and frontend visually and behaviorally aligned.
- Catch regression risk early: spacing drift, typography mismatch, interaction-state breakage, and responsive collapse.
- Produce deterministic evidence that a change is done.

## Surfaces To Compare

- Site Editor template view for affected templates/parts.
- Post editor canvas for affected blocks and dynamic content states.
- Frontend render for equivalent URLs and states.

## Baseline And Candidate Workflow

1. Capture baseline screenshots for each critical state before editing.
2. Implement change.
3. Capture candidate screenshots using the same viewport, zoom, locale, and data set.
4. Diff baseline and candidate.
5. Classify differences as expected design updates or regressions.
6. Fix regressions, then re-run capture and diff.

## State Matrix

Minimum states per affected component/page:

- Default state.
- Hover/focus/active for interactive elements.
- Validation states for forms (empty, invalid, valid, submit-in-progress, submit-failed).
- Data states (empty, loading, long text, missing media, translated copy where relevant).
- Permission states when admin/editor capabilities change visible controls.

## Breakpoint Matrix

- Mobile: `360x780`.
- Tablet: `768x1024`.
- Desktop: `1440x900`.
- Wide desktop: `1920x1080` when layout has wide/wrap risk.

Use the smallest matrix that still covers changed surfaces and known risk.

## Automation Guidance

- Prefer existing repo Playwright/Cypress visual workflows.
- If none exist, create focused temporary snapshots around changed screens instead of full-site crawls.
- Freeze volatile inputs where possible: dates, randomized content, ad slots, and external API data.
- Keep screenshot naming deterministic: `{surface}-{template-or-page}-{state}-{viewport}.png`.

## Acceptance Rules

- Approve only when differences are intentional and mapped to acceptance criteria.
- Reject if spacing rhythm, typography scale, contrast, layout stability, or interaction affordances regress.
- Reject if editor controls/panels differ from documented surface design (document panel vs inspector vs classic metabox policy).

## Accessibility Tie-In

- Verify keyboard focus order and visible focus styles on parity-critical flows.
- Verify heading structure and landmarks remain intact after layout changes.
- Verify contrast changes remain WCAG-compliant after theme token or style updates.

## Output Format

Report parity evidence with:

- Compared surfaces.
- States and breakpoints covered.
- Diff summary (intentional vs regression).
- Remaining risk and untested surfaces.
