# Visual To WordPress Implementation Contract

Use for a selected visual target. Route creation, critique, redesign, or unresolved direction to `design-intelligence-routing.md`. Add one confirmed-risk support.

## 1. Qualify The Source

Inspect the source visual and confirm target identity and source model before code. Never build from a filename, memory, thumbnail, description, or unresolved mixed references.

Classify it as:

- `Exact`: visible geometry and treatment are acceptance targets.
- `Directional`: hierarchy and visual language matter; composition may adapt.
- `Inspiration`: extract principles, not layout.

Record dimensions, state, fonts/assets, responsive/interaction behavior, and whether each value is `supplied`, `measured`, or `inferred`. Keep an ambiguity ledger; ask only about irreversible, unsafe, brand-critical, or journey-changing choices. Otherwise use an accessible WordPress-native inferred default.

### Figma Source Preflight

For Figma, discover frame/version, variables, components, assets, fonts, constraints, and interactions. Use `figma-implement-design` when available; WordPress ownership stays with the specialist. Fingerprint the source or explain the inspected export.

## 2. Build A Visual And Behavior Manifest

Before code, map:

- regions, hierarchy, semantics, measurements, type, and layering;
- component roles, variants, states, bounds, tokens, and WordPress primitives;
- assets, crops, focal points, and responsive behavior;
- owner, editing surface, visitor/author workflows, runtime, captures, tolerance, budget, and deviations.

Use `wp-expert/scripts/fse-design-map.sh` for theme/FSE. Update the compact manifest when evidence disproves an assumption.

## 3. Choose WordPress Ownership

- Site strategy, journey, IA, conversion, SEO, analytics, and page outcomes belong to `wp-site-expert`.
- Theme tokens, templates, patterns, blocks, editor ownership, and visual implementation belong to `wp-theme-expert`.
- Plugin-owned admin, editor, onboarding, and customer-facing product surfaces belong to `wp-plugin-expert`.
- For mixed site/theme work, pass one site brief to theme implementation; load both specialists only when one worker owns both boundaries.

For block themes, map through `theme.json`, verified blocks/supports, patterns, templates/parts, variations, bindings, custom blocks, then Interactivity API. Structural templates render Post Content when Pages > Edit owns the body. Build saved content, not a pattern-only or frontend-CSS simulation. Never use Custom HTML/Shortcode shortcuts. Apply the distribution gate in `../../wp-expert/references/block-theme-architecture.md` before theme-owned functionality.

Before a custom control, inventory stable Core and WordPress Design System components in the supported runtime. Adapt an accessible primitive with product tokens when it meets the contract. A bespoke replacement needs a recorded functional gap, owner, state/accessibility contract, and maintenance rationale; novelty is insufficient.

## 4. Handle Image Assets Deliberately

Classify each asset: reuse, generate, license, recreate, or placeholder.

For generation:

1. Brief purpose, subject, art direction, palette, composition, negative constraints, crop safety, ratios, and resolutions.
2. Use `product-design:ideate` for alternatives and `imagegen` for raster assets or edits. Never guess a supplied logo, factual product screenshot, identity, or exact copyrighted artwork.
3. Score candidates for accuracy, brand, crops, artifacts, accessibility, and consistency.
4. Generate text-free imagery unless embedded text is verified; render interface copy in HTML/blocks.
5. Inspect target crops/resolutions; revise misses instead of compensating with CSS.
6. Record provenance, approval status, alt-text intent, focal point, responsive crops, format, dimensions, and optimization status.

Validate generated, licensed, or art-directed assets against `../schemas/wordpress-asset-production.schema.json` with `node wp-expert/scripts/validate-asset-production.mjs <receipt.json>`. Bind approval, crops, provenance, and optimization into proof; download remote evidence before hashing.

Use responsive WordPress media and an appropriate format. Never claim licensing, authorship, brand approval, or factual depiction without evidence.

## 5. Implement In Passes

1. Structure, semantics, and content ownership.
2. Tokens, component contracts, and global styles.
3. Mobile-first intrinsic layout and block mapping.
4. Assets and media behavior.
5. Interaction and full state coverage.
6. Accessibility, performance, and browser compatibility.
7. Visual parity, editor/frontend parity, and golden workflows.

Stabilize ownership, structure, fonts, and real assets before cosmetic nudges. Create a custom block only when native primitives cannot preserve the editing/design contract.

For immersive, adaptive, motion-led, or media-dependent behavior, define the static state, reduced-motion/data behavior, unsupported-browser/failed-media fallback, measurable value, cleanup, and rollback before implementation. Enhancement failure must preserve content, navigation, task completion, and authoring.

## 6. Prove The Result

For exact/regression work, use `../../wp-expert/references/visual-parity-regression.md` only when no other support risk owns the slot. Fingerprint build, runtime, browser/OS/DPR, viewport/zoom/scroll, locale, preferences, media/fonts, and volatile inputs.

For authenticated wp-admin/editor/Site Editor proof, prefer the product harness. The spatial adapter accepts a config-relative local `storageStatePath`; keep it outside version control, never echo its path or contents, and use a task-owned account for mutations.

For `Exact`, regression, release-critical, or failed work, use visual-proof schema v3 at `../schemas/wordpress-visual-proof.schema.json` and run `node wp-expert/scripts/validate-visual-proof.mjs <proof.json>` from the declared evidence root. Declare required capture, workflow, environment, and asset IDs before proof. Each scoped surface needs its own required workflow and capture in every required environment; do not reuse one candidate artifact across captures. For release-bound work, install the packaged ZIP/artifact and bind its digest, version/build identity, and environment to every candidate capture; working-tree or development-server screenshots are supplementary, not release proof. The receipt binds immutable evidence, per-surface coverage, risk-aware design/accessibility review, structured token lineage through a rendered layer, defects, and affected capture/workflow/environment reproof. Evidence locators stay relative to the root and cannot escape through traversal or symlinks. Validation proves receipt integrity, not aesthetic correctness.

Compare source and candidate by overlay or perceptual diff across geometry, type, color, crops, responsive behavior, interactions, and editing surfaces. Use project tolerances; otherwise investigate deterministic hard-edge geometry deltas above 2 CSS px. Treat font rasterization separately.

When spacing, alignment, grid, density, or responsive composition is a material risk, reserve the support slot for `spatial-layout-and-alignment-system.md`. Link its validated spatial receipt under design-quality evidence so screenshots and computed parent/child geometry agree; do not compensate for a wrong layout owner with child-level CSS.

Use the smallest risk matrix: narrow/mobile, target desktop, and an intermediate sweep; add engines, devices, locales, content, and roles only when warranted. Bind environments to captures and name the browser/assistive-technology task. Without a mobile target, prove accessible coherent inferred behavior, not pixel parity.

For multi-surface/elevated design-system changes, bind `DESIGN.md` or equivalent and trace semantic tokens through Figma/WPDS, `theme.json`, CSS variables, block styles, and output. A pass cannot retain token drift or unowned raw values; deviations need evidence.

### Failed Proof Recovery Gate

Any reproducible in-scope overlap, clipping, overflow, wrong hierarchy/asset, responsive failure, inaccessible interaction, or editor/frontend divergence sets visual proof to `FAIL` and reopens implementation. Do not stop at an apology while safe recovery exists.

Classify the owning cause first: asset/font/data readiness; ownership/block hierarchy; tokens/components; cascade, Global Styles, or Site Editor overrides; intrinsic layout/breakpoints; runtime state; or capture contamination. Fix that layer, not symptoms with page/viewport selectors, magic offsets, or frontend-only CSS.

Re-render the failure and smallest affected editor/frontend set. Keep observed and fixed evidence under one defect ID. P1/P2 defects cannot be accepted into a pass; only an approved, evidenced P3 deviation may remain. After two failed repair cycles, stop patching, reopen source, manifest, ownership, or architecture, and replace the contract and proof run before passing. Escalate only an external blocker or material design decision with evidence and the best recovery. Unavailable evidence cannot convert an observed failure into a pass.

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

Report source class, decisions, ownership/components, assets, capture fingerprint, workflows, validation, deviations, and unresolved items. Keep raw measurements and screenshot paths in the manifest.
