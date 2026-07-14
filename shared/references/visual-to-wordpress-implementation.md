# Visual To WordPress Implementation Contract

Use this as the single primary reference when translating a screenshot, image, Figma frame, mockup, or approved visual direction into a WordPress theme, page, pattern, block, admin screen, or website. Add at most one support reference for a confirmed architecture, conversion, accessibility, performance, vendor, or proof risk.

## 1. Qualify The Source

Inspect the actual source visual before planning. Never infer its contents from a filename, prompt summary, or prior chat.

Classify it as:

- `Exact`: visible geometry and treatment are acceptance targets.
- `Directional`: hierarchy and visual language matter; composition may adapt.
- `Inspiration`: extract principles, not layout.

Record source dimensions, intended viewport, page/screen state, known fonts/assets, and whether mobile or interaction behavior is supplied. Mark important values as `supplied`, `measured`, or `inferred`; never present an inference as a design fact.

Keep an ambiguity ledger when sources conflict or omit material behavior. Record the unknown, evidence, chosen reversible inference, and validation. Ask only when the decision is brand-critical, irreversible, unsafe, or changes the product journey; otherwise choose the strongest accessible WordPress-native default and label it inferred.

## 2. Build A Visual And Behavior Manifest

Before code, map:

- regions, hierarchy, exact visible copy, and semantic intent,
- measured widths, gaps, alignment, typography, colors, borders, radii, shadows, and layering,
- reusable component contracts: role, variants, states, content bounds, tokens, and WordPress primitive,
- source assets, missing assets, crops, focal points, and responsive variants,
- desktop-to-mobile and interaction behavior: supplied, safely inferred, or requiring a decision,
- content owner and editing surface,
- visitor golden workflow and author/editor golden workflow,
- target distribution and runtime: private/client/VIP, commercial, or WordPress.org Theme Directory; WordPress/Gutenberg versions and browser policy,
- parity tolerance, performance budget, and intentional deviations.

Use `wp-expert/scripts/fse-design-map.sh` for theme/FSE work. Keep the manifest compact and update it when implementation evidence disproves an assumption.

## 3. Choose WordPress Ownership

- Site strategy, journey, IA, conversion, SEO, analytics, and page outcomes belong to `wp-site-expert`.
- Theme tokens, templates, patterns, blocks, editor ownership, and visual implementation belong to `wp-theme-expert`.
- Plugin admin/editor product surfaces belong to `wp-plugin-expert`.
- For mixed site/theme work, produce one site outcome brief, then let theme implementation consume it; do not load both full specialist contexts unless one worker owns both boundaries.

For block themes, map in this order: `theme.json`, core blocks, block supports/styles, patterns, template parts/templates, block variations, block bindings, custom blocks, then Interactivity API. Templates remain structural and render Post Content when Pages > Edit owns the visible body. Do not use Custom HTML or Shortcode blocks as shortcuts. Before placing custom functionality in a theme, apply the distribution and portability gate in `../../wp-expert/references/block-theme-architecture.md`.

## 4. Handle Image Assets Deliberately

Inventory every visual asset and choose one outcome: reuse supplied asset, generate, source/license, recreate as CSS/SVG when appropriate, or use an explicitly temporary placeholder.

When generation is needed:

1. Create an asset brief covering purpose, subject, art direction, brand palette, composition, negative constraints, crop-safe area, aspect ratios, and required resolutions.
2. Use `product-design:ideate` for alternative directions and `imagegen` for production raster assets or edits. Do not guess a supplied logo, factual product screenshot, identity, or exact copyrighted artwork.
3. For material or identity-sensitive assets, compare a small candidate set against a weighted rubric: subject accuracy, brand fit, composition, responsive crop safety, artifact quality, and accessibility purpose. Keep asset-family style consistent.
4. Generate text-free imagery unless embedded text is intentional and verified; render interface copy in HTML/blocks.
5. Inspect every selected output at target crops and resolutions. If it misses the brief, revise and regenerate rather than compensating with fragile CSS.
6. Record provenance, approval status, alt-text intent, focal point, responsive crops, format, dimensions, and optimization status.

Prefer responsive WordPress media handling and appropriate WebP/AVIF/JPEG/PNG/SVG output. Do not claim licensing, authorship, brand approval, or factual depiction without evidence.

## 5. Implement In Passes

1. Structure, semantics, and content ownership.
2. Tokens, component contracts, and global styles.
3. Mobile-first intrinsic layout and block mapping.
4. Assets and media behavior.
5. Interaction and full state coverage.
6. Accessibility, performance, and browser compatibility.
7. Visual parity, editor/frontend parity, and golden workflows.

Do not start with cosmetic nudges before ownership, structure, fonts, and real assets are stable. Create a custom block only when native primitives cannot preserve the editing and design contract.

## 6. Prove The Result

For exact or regression-sensitive work with no competing architecture risk, use `../../wp-expert/references/visual-parity-regression.md` as the one supporting reference. If architecture, accessibility, performance, or vendor risk already consumes the support slot, keep the compact proof contract in this section and do not load a second support reference. Establish a capture fingerprint before comparison: committed/package build, WordPress/Gutenberg/theme version, browser engine/version, operating system, device-pixel ratio, viewport/zoom/scroll state, locale/timezone, color scheme/reduced motion, font and image readiness, and treatment of animation or volatile data.

Compare source and candidate by overlay or perceptual diff when available. Evaluate geometry, typography, color, asset crop, responsive behavior, interactions, and editing surfaces. Use project or region-specific tolerances. Without one, investigate hard-edge geometry deltas above 2 CSS px only after the capture environment is deterministic; treat font rasterization and anti-aliasing separately rather than forcing fragile compensation.

Use the smallest risk-based matrix. Typical page work starts with narrow/mobile and target desktop, plus an intermediate resize sweep. Add tablet, wide, alternate browser engines, real touch devices, long/translated content, missing media, or alternate roles when risk requires them. When no mobile visual exists, mobile proof covers accessible, coherent inferred behavior, not pixel parity.

Completion requires:

- intended content is editable from the documented WordPress surface and survives save/reload,
- the visitor completes the primary task and the author completes the primary editing task,
- no invented design facts, APIs, blocks, assets, behavior, or proof,
- source/candidate evidence exists for changed visual surfaces,
- generated assets pass the approved rubric and target-crop inspection,
- responsive, accessibility, browser, performance, content-stress, and editor/frontend checks pass or are explicit proof gaps,
- each meaningful difference is `accepted`, `platform/accessibility constraint`, or `unresolved`.

## Output

Report source classification, ambiguity decisions, ownership and component maps, assets, capture fingerprint, visitor/author workflows, validation surfaces, parity deviations, and unresolved decisions. Keep raw measurements and screenshot paths in the manifest rather than repeating them in chat.
