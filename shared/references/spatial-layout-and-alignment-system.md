# Spatial Layout And Alignment System

Use only when spacing, alignment, grid, density, or responsive composition is a material risk. Keep the visual, editor, admin, or frontend reference primary and this as its single support. Skip bounded value-only edits without composition risk, low-risk copy, backend work, and uncustomized native screens.

## 1. Establish Spatial Authority

Inspect the rendered surface, source visual, `DESIGN.md`, `theme.json`, WPDS components, tokens, block supports, and CSS before proposing values. Mark consequential facts `supplied`, `measured`, or `derived`; framework defaults are not evidence.

A selected exact, directional, or inspiration target is at least `material` risk and needs responsive proof. Reserve `baseline` for bounded work without a selected visual target. Declare parent-layout risk before capture.

Define the smallest spatial contract before CSS:

- token owner, affected surface, regions, reading order, containers, and responsive transitions,
- semantic spacing roles: `inset` (inside a boundary), `inline` (same-line separation), `stack` (vertical sequence), `group` (related cluster), `section` (major transition), `gutter` (parallel tracks), and documented `optical` correction,
- alignment anchors: logical start/end, shared edge, text baseline, center axis, media edge, or deliberate optical anchor,
- invariants such as `related gap < group gap < section gap`, not unrelated numbers,
- content-first regions versus element-first controls and justified density modes.

Use a coherent existing scale. A 4/8-pixel grid is fallback, not proof; do not mechanically snap values or hide nudges in near-duplicate tokens. Optical exceptions need scope, reason, owner, and review trigger.

### Source-Calibrated Density

In the existing visual manifest, record source/actual/tolerance/confidence for container width, header height, hero proportion, heading bounds and wraps, CTA dimensions, card inset/gap/media ratio and major section starts. Measure ratios when the source viewport is unknown; crop or rescale comparisons only with recorded transforms. A generated image is not evidence of its original CSS viewport. Set acceptance before rendering, never derive the expected values from the implementation being judged.

Choose editorial, expressive marketing or productive interface density from the task and selected target. Enterprise quality is coherent hierarchy and usable controls, not universally large headings, tall heroes or generous padding. Preserve accessible hit areas when reducing visible bulk. Don't shrink the entire page with zoom or transforms.

Calibrate the loaded font/weight first, then text-column width, size, line-height, tracking and wrapping at the reference viewport. Record font substitution instead of claiming exact parity. Do not force desktop line breaks into mobile/translations; fluid endpoints must preserve the intended hierarchy.

Give borders, radius and shadows semantic roles: separation, interactive boundary, status or elevation. Check thickness/contrast, nested-radius consistency, focus/hover/disabled states and whether a box is needed. Generic computed-style checks can measure these; no new parallel proof format is needed.

## 2. Choose Layout By Relationship

- Use Grid for two-dimensional tracks, Flex/Row for one-dimensional distribution, and flow/Stack for reading sequences. Compose axes rather than overloading one primitive.
- Prefer `gap`, intrinsic sizing, `minmax()`, wrapping, logical properties, and block supports. Avoid negative margins, fixed variable-content heights, DOM-order tricks, and viewport offsets.
- Use subgrid when supported by the repository's browser policy and repeated child content must share parent tracks. Use container queries when a component responds to its available space rather than the viewport.
- Use `clamp()` only when endpoints and interpolation express an approved relationship. Verify support and fallback for newer features.
- Keep global values in `theme.json` or the token layer, variations in block styles/patterns/components, and exceptions in the narrowest owned stylesheet. Never patch CSS around a wrong block tree, template owner, or Site Editor override.

## 3. Design For Real Content And Direction

Treat spacing as a content and workflow constraint:

- test short, typical, long, translated, RTL/bidi, missing-media, extreme-media, validation, loading, empty, and permission states that can change geometry,
- preserve touch targets and grouping as dense workflows collapse; change density for task/information needs, not viewport alone,
- prefer logical inline/block properties and verify mirrored alignment rather than assuming left/right symmetry,
- keep editor/frontend behavior predictable for non-technical authors.

Repeated cards under varied content need shared anchors without brittle empty height. Parent Grid/Flex stretch can mimic child-padding defects; inspect both geometries before changing the child.

For WordPress, trace root/parent contentSize and wideSize, block gap, nested Group padding, margin and layout constraints, theme/block CSS, user Global Styles and saved template overrides. Identify the winning declaration before editing. Verify the same token and block composition in the editor and frontend; do not overwrite user customizations merely to make a screenshot pass.

## 4. Capture Browser Geometry

Screenshots show composition, not cause. For material work, capture a `wordpress-spatial-proof.schema.json` receipt and run `node wp-expert/scripts/validate-spatial-proof.mjs <receipt.json>` from the project root. Evidence paths must stay relative and local; escaping, remote-only, or oversized artifacts fail. Use `capture-spatial-measurements.mjs` where Playwright already exists or the project's browser harness. Incomplete proof is `blocked`/`FAIL`, never reduced risk.

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
