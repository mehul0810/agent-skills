# Visual To WordPress Implementation Contract

Use this as the single primary reference when translating a screenshot, image, Figma frame, mockup, or approved visual direction into a WordPress theme, page, pattern, block, admin screen, or website. Load one supporting reference only for a confirmed architecture, conversion, accessibility, performance, or vendor-specific risk.

## 1. Qualify The Source

Inspect the actual source visual before planning. Do not infer its contents from a filename, prompt summary, or prior chat.

Classify it as:

- `Exact`: visible geometry and treatment are acceptance targets.
- `Directional`: hierarchy and visual language matter; composition may adapt.
- `Inspiration`: extract principles, not layout.

Record source dimensions, intended viewport, page/screen state, known fonts/assets, and whether mobile or interaction behavior is supplied. Mark every important value as `supplied`, `measured`, or `inferred`; never present an inference as a design fact.

## 2. Build A Visual Evidence Manifest

Before code, map:

- regions and hierarchy,
- measured widths, gaps, alignment, typography, colors, borders, radii, shadows, and layering,
- source assets, missing assets, crops, focal points, and responsive variants,
- desktop-to-mobile behavior: supplied, safely inferred, or requiring a decision,
- content owner and editing surface,
- WordPress primitive for each region,
- parity tolerance and intentional deviations.

Use `wp-expert/scripts/fse-design-map.sh` for theme/FSE work. Keep the manifest compact and update it when implementation evidence disproves an assumption.

## 3. Choose WordPress Ownership

- Site strategy, journey, IA, conversion, SEO, analytics, and page outcomes belong to `wp-site-expert`.
- Theme tokens, templates, patterns, blocks, editor ownership, and visual implementation belong to `wp-theme-expert`.
- Plugin admin/editor product surfaces belong to `wp-plugin-expert`.
- For mixed site/theme work, produce one site outcome brief, then let theme implementation consume it; do not load both full specialist contexts unless one worker owns both boundaries.

For block themes, map in this order: `theme.json`, core blocks, block supports/styles, patterns, template parts/templates, block variations, block bindings, custom blocks, then Interactivity API. Templates remain structural and render Post Content when Pages > Edit owns the visible body. Do not use Custom HTML or Shortcode blocks as shortcuts.

## 4. Handle Image Assets Deliberately

Inventory every visual asset and choose one outcome: reuse supplied asset, generate, source/license, recreate as CSS/SVG when appropriate, or use an explicitly temporary placeholder.

When generation is needed:

1. Create an asset brief covering purpose, subject, art direction, brand palette, composition, negative constraints, crop-safe area, aspect ratios, and required resolutions.
2. Use `product-design:ideate` for alternative visual directions. Use `imagegen` for production raster assets or edits. Do not use image generation to guess a supplied logo, UI screenshot, factual product evidence, or exact copyrighted artwork.
3. Generate text-free imagery unless embedded text is intentionally required and verified; render real interface copy in HTML/blocks.
4. Review the result against the brief before integration. If it misses composition, brand, subject, or crop requirements, revise the brief and regenerate rather than compensating with fragile CSS.
5. Record provenance, approval status, alt-text intent, focal point, responsive crops, output format, dimensions, and optimization status.

Prefer responsive WordPress media handling and appropriate WebP/AVIF/JPEG/PNG/SVG output. Do not claim licensing, authorship, brand approval, or factual depiction without evidence.

## 5. Implement In Passes

1. Structure and content ownership.
2. Tokens and global styles.
3. Responsive layout and block mapping.
4. Assets and media behavior.
5. Interaction and full state coverage.
6. Accessibility and performance.
7. Visual parity and editor/frontend parity.

Do not start with cosmetic nudges before ownership, structure, fonts, and real assets are stable. Create a custom block only when native primitives cannot preserve the editing and design contract.

## 6. Prove The Result

Capture source and candidate at matched viewport, zoom, content, font state, and data state. Compare by overlay or perceptual diff when available. Evaluate geometry, typography, color, asset crop, responsive behavior, interactions, and editing surfaces. For an `Exact` target without a project tolerance, investigate geometry deltas above 2px at the target viewport and reject visible alignment, type, or crop mismatch; treat font rasterization noise separately rather than forcing fragile compensation.

Use the smallest risk-based matrix. For typical page work, start with narrow/mobile and target desktop; add tablet/wide only for known layout risk. When no mobile visual exists, mobile proof covers accessible, coherent inferred behavior, not pixel parity. Record each meaningful difference as `accepted`, `platform/accessibility constraint`, or `unresolved`.

Completion requires:

- intended content is editable from the documented WordPress surface,
- no invented design facts, APIs, blocks, assets, or proof,
- source/candidate evidence exists for changed visual surfaces,
- generated assets satisfy the approved brief and are optimized,
- accessibility, responsive behavior, performance, and editor/frontend parity are verified or reported as explicit proof gaps.

## Output

Report source classification, ownership map, block/component map, generated or reused assets, validation surfaces, parity deviations, and unresolved decisions. Keep raw measurements and screenshot paths in the manifest rather than repeating them in chat.
