# Visual To WordPress Implementation Contract

Use for approved visual-to-WordPress work. Add one support only for a confirmed architecture, conversion, accessibility, performance, interaction, or proof risk.

## 1. Qualify The Source

Inspect the actual source visual; never infer it from a filename, summary, or chat memory.

Classify it as:

- `Exact`: visible geometry and treatment are acceptance targets.
- `Directional`: hierarchy and visual language matter; composition may adapt.
- `Inspiration`: extract principles, not layout.

Record dimensions, viewport/state, fonts/assets, and supplied responsive/interaction behavior. Mark important values `supplied`, `measured`, or `inferred`; never present inference as fact.

Keep an ambiguity ledger: unknown, evidence, reversible inference, and validation. Ask only about brand-critical, irreversible, unsafe, or journey-changing choices; otherwise use an accessible WordPress-native default and label it inferred.

### Figma Source Preflight

For Figma, discover file/frame/node/version, variables, components, assets, fonts, constraints, and interactions before using a screenshot. Use `figma-implement-design` when available; ownership stays with the WordPress specialist. Fingerprint the source. If access fails, inspect an owner-supplied export and declare the gap; never invent values.

## 2. Build A Visual And Behavior Manifest

Before code, map:

- regions, hierarchy, copy, semantics, measurements, type, and layering,
- reusable component contracts: role, variants, states, bounds, tokens, and WordPress primitive,
- assets, crops, focal points, responsive variants, and supplied/inferred behavior,
- owner, editing surface, visitor and author workflows,
- distribution/runtime targets, required captures/workflows, parity tolerance, performance budget, and deviations.

Use `wp-expert/scripts/fse-design-map.sh` for theme/FSE work. Keep the manifest compact and update it when implementation evidence disproves an assumption.

## 3. Choose WordPress Ownership

- Site strategy, journey, IA, conversion, SEO, analytics, and page outcomes belong to `wp-site-expert`.
- Theme tokens, templates, patterns, blocks, editor ownership, and visual implementation belong to `wp-theme-expert`.
- Plugin-owned admin, editor, onboarding, and customer-facing product surfaces belong to `wp-plugin-expert`.
- For mixed site/theme work, produce one site brief for theme implementation; do not load both specialist contexts unless one worker owns both boundaries.

For block themes, map through `theme.json`, verified blocks/supports, patterns, templates/parts, variations, bindings, custom blocks, then Interactivity API. Structural templates render Post Content when Pages > Edit owns the body. Build saved content, not a pattern-only or frontend-CSS simulation. Never use Custom HTML/Shortcode shortcuts. Apply the distribution gate in `../../wp-expert/references/block-theme-architecture.md` before theme-owned functionality.

Before designing a custom control, inventory stable Core and WordPress Design System components in the supported runtime. Reuse the accessible primitive and adapt it with product tokens when it meets the interaction contract. A bespoke replacement needs a recorded functional gap, ownership, state/accessibility contract, and maintenance rationale; visual novelty alone is insufficient.

## 4. Handle Image Assets Deliberately

Inventory each asset: reuse, generate, source/license, recreate appropriately, or mark a temporary placeholder.

When generation is needed:

1. Brief purpose, subject, art direction, palette, composition, negative constraints, crop safety, ratios, and resolutions.
2. Use `product-design:ideate` for alternative directions and `imagegen` for production raster assets or edits. Do not guess a supplied logo, factual product screenshot, identity, or exact copyrighted artwork.
3. Score a small candidate set for accuracy, brand, composition/crops, artifacts, accessibility, and family consistency.
4. Generate text-free imagery unless embedded text is intentional and verified; render interface copy in HTML/blocks.
5. Inspect target crops/resolutions; revise a miss instead of compensating with CSS.
6. Record provenance, approval status, alt-text intent, focal point, responsive crops, format, dimensions, and optimization status.

For generated, licensed, or art-directed assets, write `../schemas/wordpress-asset-production.schema.json` and run `node wp-expert/scripts/validate-asset-production.mjs <receipt.json>`. Bind each receipt into visual proof with evidenced approval, crops, provenance, and optimization. Keep proof artifacts local; download remote evidence before byte hashing.

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

For immersive, adaptive, motion-led, or media-dependent behavior, define the meaningful static state, reduced-motion and reduced-data behavior, unsupported-browser and failed-media fallback, measurable user value, lifecycle cleanup, and removal/rollback path before implementation. Failure of enhancement must preserve content, navigation, task completion, and authoring.

## 6. Prove The Result

For exact/regression work, use `../../wp-expert/references/visual-parity-regression.md` only when no other confirmed support risk owns the support slot. Establish a capture fingerprint: build, runtime, browser/OS/DPR, viewport/zoom/scroll, locale, preferences, loaded media/fonts, and volatile-input treatment.

For `Exact`, regression, release-critical, or failed work, use visual-proof schema v2 at `../schemas/wordpress-visual-proof.schema.json` and run `node wp-expert/scripts/validate-visual-proof.mjs <proof.json>`. Declare required capture, workflow, environment, and asset IDs before proof. For release-bound work, install the packaged ZIP/artifact and bind its digest, version/build identity, and environment to every candidate capture; working-tree or development-server screenshots are supplementary, not release proof. The receipt binds immutable evidence, per-surface coverage, risk-aware design/accessibility review, token lineage, defects, and reproof. Validation proves receipt integrity, not aesthetic correctness.

Compare source and candidate by overlay or perceptual diff when available across geometry, type, color, crops, responsive behavior, interactions, and editing surfaces. Use project tolerances; otherwise investigate hard-edge geometry deltas above 2 CSS px after capture is deterministic. Treat font rasterization separately instead of adding fragile compensation.

Use the smallest risk matrix: narrow/mobile, target desktop, and an intermediate resize sweep; add engines, devices, locales, content, and roles only when evidence warrants them. Bind required environments to captures. Material accessibility names the tested browser/assistive-technology task. Without a mobile target, mobile proof covers accessible, coherent inferred behavior, not pixel parity.

For multi-surface or elevated design-system changes, bind `DESIGN.md` or the equivalent contract and trace affected semantic tokens through Figma/WPDS, `theme.json`, CSS variables, block styles, and rendered output. A pass cannot retain token drift or unowned raw values; intentional deviations need evidence and rationale.

### Failed Proof Recovery Gate

Visual proof is executable. Any reproducible in-scope overlap, clipping, overflow, wrong hierarchy/asset, responsive failure, inaccessible interaction, or editor/frontend divergence sets the work to `FAIL` and reopens implementation. Do not declare completion or return only an apology while safe recovery exists.

Classify the owning cause first: asset/font/data readiness; ownership/block hierarchy; tokens/components; cascade, Global Styles, or Site Editor overrides; intrinsic layout/breakpoints; runtime state; or capture contamination. Fix that layer, not symptoms with page/viewport selectors, magic offsets, or frontend-only CSS.

Re-render the failure and smallest affected editor/frontend set. Keep observed and fixed evidence under one defect ID. P1/P2 defects cannot be accepted into a pass; only an approved, evidenced P3 deviation may remain. After two failed repair cycles, recheck source, manifest, ownership, and architecture. Escalate only an external blocker or material design decision with evidence and the best recovery. Unavailable evidence cannot convert an observed failure into a pass.

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
