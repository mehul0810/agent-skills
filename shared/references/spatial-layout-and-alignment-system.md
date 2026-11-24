# Spatial Layout And Alignment System

Use only when spacing, alignment, grid, density, or responsive composition is a material risk. Keep the visual, editor, admin, or frontend reference primary and this as its single support. Skip bounded value-only edits without composition risk, low-risk copy, backend work, and uncustomized native screens.

## 1. Establish Spatial Authority

Inspect the rendered surface, source visual, `DESIGN.md`, `theme.json`, WPDS components, tokens, block supports, and CSS before proposing values. Mark consequential facts `supplied`, `measured`, or `derived`; framework defaults are not evidence.

A selected exact, directional, or inspiration target is at least `material` risk and needs responsive proof. Reserve `baseline` for bounded work without a selected visual target. Declare parent-layout risk before capture.

Before CSS, define:

- token owner, affected surface, regions, reading order, containers, and responsive transitions,
- semantic spacing roles: `inset` (inside a boundary), `inline` (same-line separation), `stack` (vertical sequence), `group` (related cluster), `section` (major transition), `gutter` (parallel tracks), and documented `optical` correction,
- alignment anchors: logical start/end, shared edge, text baseline, center axis, media edge, or deliberate optical anchor,
- invariants such as `related gap < group gap < section gap`, not unrelated numbers,
- content-first regions versus element-first controls and justified density modes.

Use the existing scale. A 4/8-pixel grid is fallback, not proof; do not snap mechanically or hide nudges in duplicate tokens. Optical exceptions need scope, reason, owner, and review trigger.

### Source-Calibrated Density

In the visual manifest, record source/actual/tolerance/confidence for container, header, hero, heading bounds/wraps, CTA, card inset/gap/media ratio, and section starts. Use ratios when viewport is unknown; record crop/rescale transforms. Generated images do not establish original CSS viewports. Set acceptance before rendering, never from the judged implementation.

Choose editorial, expressive marketing or productive interface density from the task and selected target. Enterprise quality is coherent hierarchy and usable controls, not universally large headings, tall heroes or generous padding. Preserve accessible hit areas when reducing visible bulk. Don't shrink the entire page with zoom or transforms.

Calibrate loaded font/weight before column width, size, line-height, tracking, and wrapping. Record substitutions; do not claim exact parity or force desktop breaks into mobile/translations. Fluid endpoints preserve hierarchy.

Give borders, radius, and shadows roles (separation, boundary, status, elevation); check contrast, nested radii, focus/hover/disabled, and whether a box is needed. Computed-style checks suffice; no parallel proof format.

## 2. Choose Layout By Relationship

### Visual Refinement Pass

When refining, inspect hierarchy, grouping, typography, surfaces, imagery, then details. Diagnose relationships before decoration; do not redesign an approved target.

- If a heading/action is lost, reduce competing weight, contrast, or boxing before enlarging it. Keep secondary text and interactive/focus boundaries readable; preserve strong navigation when needed.
- Keep labels with their controls; never replace visible form labels with placeholders. Combine summary values only when units/context/comparison and assistive reading remain clear; sortable data may need separate columns.
- Action importance and consequence are separate. A rare destructive action need not dominate the everyday screen, but its label, consequence and required confirmation remain explicit. Never hide danger to achieve visual restraint.
- Replace redundant borders with spacing/contrast only when grouping stays clear; retain table/input/forced-color boundaries. Elevation signals overlays, drag, or depth, not arbitrary cards.
- Inspect imagery at placement size; use truthful workflow crops, label illustrations, preserve factual context, size icons optically, and stress author-uploaded ratios/focal points without losing essential content.

Use original before/after examples with the same content and task. Preserve semantic headings, native controls, intentional density, and accessible contrast. These heuristics neither ban grids/borders nor prove usability or conversion lift.

- Use Grid for 2D tracks, Flex/Row for 1D distribution, and flow/Stack for reading; compose axes. Prefer `gap`, intrinsic sizing, `minmax()`, wrapping, logical properties, and block supports; avoid negative margins, fixed variable heights, DOM tricks, and viewport offsets.
- Use subgrid when supported by the repository's browser policy and repeated child content must share parent tracks. Use container queries when a component responds to its available space rather than the viewport.
- Use `clamp()` only when endpoints and interpolation express an approved relationship. Verify support and fallback for newer features.
- Keep global values in `theme.json` or the token layer, variations in block styles/patterns/components, and exceptions in the narrowest owned stylesheet. Never patch CSS around a wrong block tree, template owner, or Site Editor override.

## 3. Design For Real Content And Direction

Treat spacing as a content/workflow constraint:

- test short, typical, long, translated, RTL/bidi, missing-media, extreme-media, validation, loading, empty, and permission states that can change geometry,
- preserve touch targets and grouping as dense workflows collapse; change density for task/information needs, not viewport alone,
- prefer logical inline/block properties and verify mirrored alignment rather than assuming left/right symmetry,
- keep editor/frontend behavior predictable for non-technical authors.

Repeated cards need shared anchors without brittle empty height. Parent Grid/Flex stretch can mimic child-padding defects; inspect both geometries before changing the child.

For WordPress, trace root/parent contentSize/wideSize, block gap, Group padding/margins, layout constraints, theme/block CSS, Global Styles, and saved overrides. Identify the winning declaration. Verify token/composition in editor and frontend; never overwrite user customizations for a screenshot.

## 4. Capture Browser Geometry

Screenshots show composition, not cause. Material work needs `wordpress-spatial-proof.schema.json` validated by `node wp-expert/scripts/validate-spatial-proof.mjs <receipt.json>`. Paths must be relative/local; escaping, remote-only, or oversized artifacts fail. Use `capture-spatial-measurements.mjs` when Playwright/project harness exists. Incomplete proof is `blocked`/`FAIL`, never reduced risk.

Bind assertions to environment, token/exception, source, actual, tolerance, and immutable evidence. Measure only decision-bearing facts:

- bounding rectangles and shared-edge or center-axis deltas,
- computed `gap`, padding/inset, track, width, and height values,
- line count, wrap state, overflow, and scroll extent,
- the parent layout properties when stretching, distribution, or implicit tracks may explain the symptom.

For responsive surfaces use narrow, intermediate, and desktop environments plus the smallest invalidating content stress. Exact targets use supplied/measured acceptance geometry; derived values cannot redefine parity. Endpoint screenshots do not prove intermediate layout.

## 5. Independent Evaluation And Repair

For material/brand-critical work, give Product Design audit or a fresh reviewer the contract, candidate, and evidence without implementation rationale. The implementer cannot be sole evaluator. Check:

1. design coherence and hierarchy,
2. spatial craft: rhythm, anchors, density, typography, and responsive transitions,
3. functionality and state behavior,
4. WordPress ownership, editability, and editor/frontend predictability.

Convert findings to observable defects/criteria, not taste. Record different implementer/evaluator identities. Default to one focused repair and reproof. After two failed cycles, reopen the contract, ownership, or direction; passing needs replacement contract and proof.

## 6. Targeted Modern-Web Research

For a confirmed platform question, retrieve one matching official `modern-web-guidance` guide or primary source, not the catalog. Verify browser support against repo policy and a live authority. Never install an unreviewed transient package or add an API for novelty.

Useful official anchors:

- WordPress layout support: <https://make.wordpress.org/core/2022/10/10/updated-editor-layout-support-in-6-1-after-refactor/>
- GoogleChrome modern web guidance: <https://github.com/GoogleChrome/modern-web-guidance>
- WordPress spacing-system proposal for historical fallback context, not current universal policy: <https://make.wordpress.org/design/2019/10/31/proposal-a-consistent-spacing-system-for-wordpress/>

## Output

Report authority, roles/anchors, responsive/content invariants, measurements, required independent result, defect lineage, and proof gaps. Known overlap, drift, broken hierarchy, or editor/frontend mismatch is `FAIL`.
