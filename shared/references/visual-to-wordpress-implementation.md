# Visual To WordPress Implementation Contract

Use this as primary for translating an approved visual into a WordPress theme, page, pattern, block, plugin surface, or site. Add one support only for a confirmed architecture, conversion, accessibility, performance, vendor, interaction, or proof risk.

## 1. Qualify The Source

Inspect the actual source visual; never infer it from a filename, summary, or chat memory.

Classify it as:

- `Exact`: visible geometry and treatment are acceptance targets.
- `Directional`: hierarchy and visual language matter; composition may adapt.
- `Inspiration`: extract principles, not layout.

Record dimensions, viewport/state, fonts/assets, and supplied responsive/interaction behavior. Mark important values `supplied`, `measured`, or `inferred`; never present inference as fact.

Keep an ambiguity ledger: unknown, evidence, reversible inference, and validation. Ask only for brand-critical, irreversible, unsafe, or journey-changing decisions; otherwise use the strongest accessible WordPress-native default and label it inferred.

### Figma Source Preflight

For Figma, discover structured context before using a screenshot: file/frame/node/version, variables, components, assets, fonts, constraints, and interactions. Use `figma-implement-design` when available; WordPress ownership stays with the specialist. Fingerprint the source. If access fails, declare it and inspect an owner-supplied export; never invent hidden values.

## 2. Build A Visual And Behavior Manifest

Before code, map:

- regions, hierarchy, copy, semantics, measurements, typography, treatment, and layering,
- reusable component contracts: role, variants, states, bounds, tokens, and WordPress primitive,
- assets, crops, focal points, responsive variants, and supplied/inferred interaction behavior,
- content owner, editing surface, visitor and author golden workflows,
- distribution, WordPress/Gutenberg/browser targets, required surface/state/environment captures and workflows, parity tolerance, performance budget, and deviations.

Use `wp-expert/scripts/fse-design-map.sh` for theme/FSE work. Keep the manifest compact and update it when implementation evidence disproves an assumption.

## 3. Choose WordPress Ownership

- Site strategy, journey, IA, conversion, SEO, analytics, and page outcomes belong to `wp-site-expert`.
- Theme tokens, templates, patterns, blocks, editor ownership, and visual implementation belong to `wp-theme-expert`.
- Plugin-owned admin, editor, onboarding, and customer-facing product surfaces belong to `wp-plugin-expert`.
- For mixed site/theme work, produce one site brief for theme implementation; do not load both specialist contexts unless one worker owns both boundaries.

For block themes, map through `theme.json`, verified blocks/supports, patterns, templates/parts, variations, bindings, custom blocks, then Interactivity API. Structural templates render Post Content when Pages > Edit owns the body. Build saved content, not a pattern-only or frontend-CSS simulation. Never use Custom HTML/Shortcode shortcuts. Apply the distribution gate in `../../wp-expert/references/block-theme-architecture.md` before theme-owned functionality.

## 4. Handle Image Assets Deliberately

Inventory each asset: reuse, generate, source/license, recreate appropriately, or mark a temporary placeholder.

When generation is needed:

1. Brief purpose, subject, art direction, palette, composition, negative constraints, crop safety, ratios, and resolutions.
2. Use `product-design:ideate` for alternative directions and `imagegen` for production raster assets or edits. Do not guess a supplied logo, factual product screenshot, identity, or exact copyrighted artwork.
3. Score a small candidate set for accuracy, brand, composition/crops, artifacts, accessibility, and family consistency.
4. Generate text-free imagery unless embedded text is intentional and verified; render interface copy in HTML/blocks.
5. Inspect target crops/resolutions; revise a miss instead of compensating with CSS.
6. Record provenance, approval status, alt-text intent, focal point, responsive crops, format, dimensions, and optimization status.

For generated, licensed, or materially art-directed assets, write `../schemas/wordpress-asset-production.schema.json` and run `node wp-expert/scripts/validate-asset-production.mjs <receipt.json>`. Bind each required asset receipt into the visual proof; approval, target crops, provenance, and optimization must be evidence, not prose claims.

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

For exact/regression work, use `../../wp-expert/references/visual-parity-regression.md` only when no other confirmed support risk owns the support slot. Establish a capture fingerprint: build, runtime, browser/OS/DPR, viewport/zoom/scroll, locale, preferences, loaded media/fonts, and volatile-input treatment.

For `Exact`, regression, release-critical, or failed work, use visual-proof schema v2 at `../schemas/wordpress-visual-proof.schema.json` and run `node wp-expert/scripts/validate-visual-proof.mjs <proof.json>`. Declare required capture, workflow, environment, and asset IDs before proof. It binds immutable evidence, per-surface coverage, risk-aware design/accessibility review, token lineage, defects, and reproof. Validation proves receipt integrity, not aesthetic correctness.

Compare source and candidate by overlay or perceptual diff when available. Evaluate geometry, typography, color, asset crop, responsive behavior, interactions, and editing surfaces. Use project or region-specific tolerances. Without one, investigate hard-edge geometry deltas above 2 CSS px only after the capture environment is deterministic; treat font rasterization and anti-aliasing separately rather than forcing fragile compensation.

Use the smallest declared risk matrix: narrow/mobile, target desktop, and intermediate resize sweep for every changed surface; add browser engines, real devices, locales, content, and roles only when support/risk evidence requires them. Bind every required environment to a capture. Material accessibility names the tested browser/assistive-technology task. When no mobile visual exists, mobile proof covers accessible, coherent inferred behavior, not pixel parity.

For multi-surface or elevated design-system changes, bind `DESIGN.md` or the equivalent contract and trace affected semantic tokens through Figma/WPDS, `theme.json`, CSS variables, block styles, and rendered output. A pass cannot retain token drift or unowned raw values; intentional deviations need evidence and rationale.

### Failed Proof Recovery Gate

Visual proof is an executable test. Any reproducible in-scope candidate defect, including overlap, clipping, overflow, wrong hierarchy or assets, broken responsiveness, inaccessible interaction, or editor/frontend divergence, sets the work to `FAIL` and reopens implementation. Do not declare completion or return an apology plus a promise while safe recovery exists.

Classify the highest owning cause before more code: asset/font/data readiness; WordPress ownership or block hierarchy; tokens or component constraints; cascade, Global Styles, or Site Editor overrides; intrinsic layout or breakpoints; runtime state; or capture contamination. Fix that layer, not symptoms with page/viewport selectors, magic offsets, or frontend-only CSS.

Re-render the failing state and smallest affected editor/frontend regression set. Record observed and fixed evidence under one defect ID so the receipt proves reproof, not replacement. P1/P2 defects cannot be accepted into a pass; only an explicitly approved, evidenced P3 deviation may remain. After two repair-and-proof cycles without convergence, stop tweaking and recheck source classification, manifest, ownership, and architecture. Escalate only a genuine external blocker or material design decision, with failed evidence and the best recovery path. Unavailable evidence may be a proof gap; it cannot convert an observed failure into a pass.

Completion requires:

- intended content is editable from the documented WordPress surface and survives save/reload,
- the visitor completes the primary task and the author completes the primary editing task,
- the non-technical author can create/insert it and edit representative copy, media, links, and allowed layout without code,
- no invented design facts, APIs, blocks, assets, behavior, or proof,
- source/candidate evidence exists for changed visual surfaces,
- generated assets pass the approved rubric and target-crop inspection,
- responsive, accessibility, browser, performance, content-stress, and editor/frontend checks pass or are explicit proof gaps,
- no known reproducible in-scope visual defect remains,
- each meaningful difference is `accepted`, `platform/accessibility constraint`, or `unresolved`.

## Output

Report source classification, ambiguity decisions, ownership and component maps, assets, capture fingerprint, visitor/author workflows, validation surfaces, parity deviations, and unresolved decisions. Keep raw measurements and screenshot paths in the manifest rather than repeating them in chat.
