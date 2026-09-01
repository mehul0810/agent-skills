# Spatial Layout And Alignment System

Use this reference only when spacing, alignment, grid, density, or responsive composition is a material implementation risk. Keep the selected visual-target, block-editor, admin-workflow, or frontend-direction reference primary and use this as its single support. Skip it for exact owner-supplied value changes, low-risk copy changes, backend work, and native WordPress screens whose layout is not being customized.

## 1. Establish Spatial Authority

Inspect the rendered surface, source visual or design file, `DESIGN.md`, `theme.json`, WordPress Design System components, product tokens, block supports, and existing CSS before proposing values. Record each consequential fact as `supplied`, `measured`, or `derived`; do not turn a familiar framework default into design evidence.

Define the smallest spatial contract before CSS:

- canonical token owner and affected surface,
- layout regions, reading order, container behavior, and responsive transitions,
- semantic spacing roles: `inset` (inside a boundary), `inline` (same-line separation), `stack` (vertical sequence), `group` (related cluster), `section` (major transition), `gutter` (parallel tracks), and documented `optical` correction,
- alignment anchors: logical start/end, shared edge, text baseline, center axis, media edge, or deliberate optical anchor,
- relationship invariants such as `related gap < group gap < section gap`, rather than a list of unrelated numbers,
- content-first regions versus element-first controls, plus default and dense modes when the workflow genuinely needs both.

Use the repository's existing scale when coherent. A 4/8-pixel grid is only a fallback heuristic, not proof of good hierarchy; do not snap every value mechanically or create near-duplicate tokens to hide arbitrary nudges. Optical exceptions need scope, reason, owner, and a review trigger.

## 2. Choose Layout By Relationship

- Use Grid for two-dimensional tracks and repeated peers; use Flex/Row for one-dimensional distribution; use normal flow/Stack for reading sequences. Compose axes instead of forcing one layout primitive to solve every relationship.
- Prefer `gap`, intrinsic sizing, `minmax()`, wrapping, logical properties, and content-owned block supports. Avoid negative-margin repairs, fixed heights for variable content, DOM-order tricks, and viewport-specific offsets.
- Use subgrid when supported by the repository's browser policy and repeated child content must share parent tracks. Use container queries when a component responds to its available space rather than the viewport.
- Use bounded fluid values such as `clamp()` only when the endpoints and interpolation express an approved relationship. Verify browser support and provide a responsible fallback when using newer platform features.
- In WordPress, keep durable global values in `theme.json` or the product's canonical token layer, reusable variations in block styles/patterns/components, and exceptional local layout in the narrowest owned stylesheet. Do not patch frontend CSS around a wrong block tree, template owner, or Site Editor override.

## 3. Design For Real Content And Direction

Treat spacing as a content and workflow constraint, not a screenshot decoration:

- test short, typical, long, translated, RTL/bidi, missing-media, extreme-media, validation, loading, empty, and permission states that can change geometry,
- preserve touch targets and readable grouping when a dense desktop workflow collapses,
- change density because task frequency and information volume require it, not merely because the viewport is smaller,
- prefer logical inline/block properties and verify mirrored alignment rather than assuming left/right symmetry,
- keep the editor representation understandable and close enough to the frontend that a non-technical author can predict the result.

Repeated cards with different title lengths, actions, media, and metadata must keep intentional shared anchors without reserving brittle empty height. A parent Grid or Flex stretch can create apparent child-padding defects; inspect parent and child computed geometry before changing the child.

## 4. Capture Browser Geometry

Screenshots communicate composition but do not prove the cause of a spatial defect. For material spatial work, capture a `wordpress-spatial-proof.schema.json` receipt and validate it with `node wp-expert/scripts/validate-spatial-proof.mjs <receipt.json>`. Use `capture-spatial-measurements.mjs` inside a project that already provides Playwright, or collect equivalent values with the project's browser harness.

Bind each assertion to a viewport/environment, semantic token or documented exception, expected source (`supplied`, `measured`, or `derived`), actual value, tolerance, and immutable report evidence. Measure only decision-bearing facts:

- bounding rectangles and shared-edge or center-axis deltas,
- computed `gap`, padding/inset, track, width, and height values,
- line count, wrap state, overflow, and scroll extent,
- the parent layout properties when stretching, distribution, or implicit tracks may explain the symptom.

Use narrow, intermediate, and desktop environments when the surface is responsive, plus the smallest content-stress set that can invalidate the contract. Exact visual targets use supplied or measured acceptance geometry; derived values cannot silently redefine exact parity. One screenshot at each endpoint is not evidence that intermediate layout is sound.

## 5. Independent Evaluation And Repair

For material or brand-critical layout work, the implementer must not be the sole design evaluator. Give an available Product Design audit capability or fresh independent reviewer the source/contract, rendered candidate, and evidence without the implementation rationale. Evaluate:

1. design coherence and hierarchy,
2. spatial craft: rhythm, anchors, density, typography, and responsive transitions,
3. functionality and state behavior,
4. WordPress ownership, editability, and editor/frontend predictability.

Convert findings into observable defects or acceptance criteria, not taste adjectives. Default to one focused repair and reproof. After two failed repair cycles, stop patching and reopen the spatial contract, ownership map, or selected direction; do not accumulate CSS compensations.

## 6. Targeted Modern-Web Research

When a confirmed platform question could change the implementation, retrieve only the relevant current primary guide. The preview `modern-web-guidance` catalog can be searched with `npx modern-web-guidance@latest search "<specific question>"`; retrieve one matching guide rather than loading the catalog. Verify browser support against the repository policy and an authoritative live source before adoption. Do not add a modern API merely to make the design feel contemporary.

Useful official anchors:

- WordPress layout support: <https://make.wordpress.org/core/2022/10/10/updated-editor-layout-support-in-6-1-after-refactor/>
- GoogleChrome modern web guidance: <https://github.com/GoogleChrome/modern-web-guidance>
- WordPress spacing-system proposal for historical fallback context, not current universal policy: <https://make.wordpress.org/design/2019/10/31/proposal-a-consistent-spacing-system-for-wordpress/>

## Output

Report the spatial authority, semantic roles and anchors, responsive/content invariants, browser measurements, independent evaluation result when required, fixed defect lineage, and remaining proof gaps. A known overlap, unexplained drift, broken hierarchy, or editor/frontend mismatch is `FAIL`, not acceptable visual variance.
