# Exposed grids in a different brand

Tested design guidance: `6d33133efde961135f1d1f3922972ad0eaff4d93`. The
[frontend design reference](../shared/references/frontend-design-taste.md#3-compose-before-styling)
teaches an optional graphic treatment, not a site template. Its existing site,
theme and plugin routes and skill selection limits are unchanged.

## Decision evidence

The [blind packet](cases/live-reference-transfer/input.json) includes an
[original fictional print cover](cases/live-reference-transfer/artifacts/cover.svg).
It asks for a different brand's catalog treatment and, separately, a label-only
edit to a real inventory control. The scorer's [criteria](cases/live-reference-transfer/criteria.md)
stay outside performer packets. The cover is a static SVG, not another site's
branding or evidence of motion.

The initial run passed 21/27 registered checks (49/56 check/case pairs). The
catalog answer recognized the graphic details and preserved the solid wordmark,
but omitted a decoration-off test. The inventory answer preserved the real
button but did not identify a safe environment for testing its write action.
Other misses involved the design read, section composition, experimental
features, combobox relationships and the evidence for an animated reference.
Keep the initial judgments separate from any follow-up; these are development
scenarios, not a measured first-attempt success rate on unseen projects.

The follow-up used six concrete briefs against the same frozen guidance and
rubric. Seven replacement decisions passed; the other 49 kept their original
result and packet hashes. A performer reported using a scratch file outside its
assigned output directory. That follow-up was retained separately, not admitted.
A different fresh performer repeated the same inputs with a dedicated output
directory. The independent scorer graded its seven decisions anew: 27/27 checks
and 56/56 check/case pairs in the combined final receipt. Output confinement
and exposure are agent attestations, not an OS audit. Grade-bound preflight
verifies artifact identity, not semantic correctness or production readiness.

## Browser pilot

A separate performer used the frozen skill to build an offline letterpress
specimen page from a different brief, without the print-cover fixture or
scoring key. On the first render, the last specification extended to pixel 325
in a 320-pixel viewport. Wrapping the specification row and bounding its gap
fixed the cause; the original artifact and failed check were retained.

On the corrected HTML (SHA-256
`847b026a5cc0892636fb8821d401acd2914dc87fa6ef94f2d5b38346fa85e098`),
Chromium checked 320, 390, 768 and 1280 CSS pixels with decorative layers both
on and off. All eight states retained the specimen details and ordering of
accessible content, visible keyboard focus, the working printing-notes anchor,
and no horizontal page overflow with a longer heading. The phone layout omitted
crosshairs instead of squeezing them around the title. No HTTP requests were made.

This is static browser evidence, not a WordPress editor/save test, physical
device result, accessibility certification, or visitor study. Screen-reader and
narration checks were excluded by owner direction, not passed. Raw packets,
independent grades, pilot captures and receipts remain in the private
`exposed-grid-skills-20261123` evaluation folder.
