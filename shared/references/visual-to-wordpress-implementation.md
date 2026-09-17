# Visual To WordPress Implementation Contract

Use for a selected visual target. Route creation, critique, redesign, or unresolved direction to `design-intelligence-routing.md`. Add one confirmed-risk support.

## 1. Qualify The Source

Inspect the source visual before code; confirm target identity/model. Filename, memory, thumbnail, description or mixed references are insufficient.

Classify it as:

- `Exact`: visible geometry and treatment are acceptance targets.
- `Directional`: hierarchy and visual language matter; composition may adapt.
- `Inspiration`: extract principles, not layout.

Record dimensions, state, fonts/assets, responsive/interaction behavior, and whether each value is `supplied`, `measured`, or `inferred`. Record ambiguities; clarify consequential choices, otherwise label accessible native defaults.

Calibrate pixels against CSS viewport, DPR, crop/export resizing; 2x images do not imply 2x CSS sizes. Unknown scale needs confidence/normalized geometry. Preserve exact-target density; no arbitrary enlargement or whole-page zoom/transform correction.

### Figma And Pen Source Preflight

For Figma, discover frame/version, variables, components, assets, fonts, constraints, and interactions. Use `figma-implement-design` when available; WordPress ownership stays with the specialist. Fingerprint the source or explain the inspected export.

For Pen, inspect board/node IDs, revision or export hash, native constraints, tokens, assets and rendered boards through supported tooling. Respect access restrictions. Text extraction cannot prove appearance; fallback exports must disclose structural/interaction gaps.

## 2. Build A Visual And Behavior Manifest

Before code, map:

- regions, hierarchy, semantics, measurements, type, and layering;
- component roles, variants, states, bounds, tokens, and WordPress primitives;
- assets, crops, focal points, and responsive behavior;
- owner, editing surface, visitor/author workflows, runtime, captures, tolerance, budget, and deviations.

Use `wp-expert/scripts/fse-design-map.sh` for theme/FSE. Update the compact manifest when evidence disproves an assumption.

For exact pages, map complete section order, including header/footer, to active saved posts, parts, patterns and overrides. A matching hero or changed pattern does not prove saved content changed. Resolve legacy retention versus replacement before authorized mutation; preserve unrelated content with guarded backups.

## 3. Choose WordPress Ownership

- Site strategy, journey, IA, conversion, SEO, analytics, and page outcomes belong to `wp-site-expert`.
- Theme tokens, templates, patterns, blocks, editor ownership, and visual implementation belong to `wp-theme-expert`.
- Plugin-owned admin, editor, onboarding, and customer-facing product surfaces belong to `wp-plugin-expert`.
- Pass mixed-work briefs to theme implementation; load both specialists only for shared ownership.

For block themes, map through `theme.json`, verified blocks/supports, patterns, templates/parts, variations, bindings, custom blocks, then Interactivity API. Structural templates render Post Content when Pages > Edit owns the body. Build saved content, not a pattern-only or frontend-CSS simulation. Never use Custom HTML/Shortcode shortcuts. Apply the distribution gate in `../../wp-expert/references/block-theme-architecture.md` before theme-owned functionality.

Inventory stable Core and WordPress Design System controls in the supported runtime. Prefer accessible primitives with product tokens. Bespoke controls require a functional gap, owner, state/accessibility contract and maintenance rationale, not novelty.

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

Stabilize ownership, structure, fonts/assets before cosmetic nudges. Custom blocks require a native-primitive gap. Before scaling multi-page/system work, prove representative content, fonts/assets, editor controls and narrow/intermediate/desktop behavior. Reuse component/token/source IDs across maps and receipts, not duplicate briefs. Separate craft from usability.

For every substantial image-to-page task, first prove header, hero, CTA, next-section transition and shared footer at source and narrow widths. Calibrate loaded fonts and wrapping before spacing. Do not propagate failing proportions. Report fidelity, design quality and visitor/author usability separately; an average cannot conceal a failed gate.

For immersive, adaptive, motion-led, or media-dependent behavior, define the static state, reduced-motion/data behavior, unsupported-browser/failed-media fallback, measurable value, cleanup, and rollback before implementation. Enhancement failure must preserve content, navigation, task completion, and authoring.

## 6. Prove The Result

For exact/regression work, use `../../wp-expert/references/visual-parity-regression.md` only when no other support risk owns the slot. Fingerprint build, runtime, browser/OS/DPR, viewport/zoom/scroll, locale, preferences, media/fonts, and volatile inputs.

For authenticated wp-admin/editor/Site Editor proof, prefer the product harness. The spatial adapter accepts a config-relative local `storageStatePath`; keep it outside version control, never echo its path or contents, and use a task-owned account for mutations.

For `Exact`, regression, release-critical, or failed work, use visual-proof schema v3 at `../schemas/wordpress-visual-proof.schema.json` and run `node wp-expert/scripts/validate-visual-proof.mjs <proof.json>` from the declared evidence root. Declare required capture, workflow, environment, and asset IDs before proof. Each scoped surface needs its own required workflow and capture in every required environment; do not reuse one candidate artifact across captures. For release proof, install the packaged artifact; bind digest, version/build and environment to each candidate capture. Development screenshots are supplementary. Bind immutable evidence, surface coverage, design/accessibility review, rendered token lineage, defects and affected capture/workflow/environment reproof. Evidence locators cannot escape the root through traversal or symlinks. Validation proves receipt integrity, not aesthetic correctness.

Compare source and candidate by overlay or perceptual diff across geometry, type, color, crops, responsive behavior, interactions, and editing surfaces. Use project tolerances; otherwise investigate deterministic hard-edge geometry deltas above 2 CSS px. Treat font rasterization separately.

Verify actual CSS viewport, document width, DPR and export scale; explain requested/actual discrepancies before comparison. Healthy routes, H1 counts, valid blocks, loaded assets and no overflow are technical checks, not fidelity. Candidate-only screenshots cannot pass exact parity.

When spacing, alignment, grid, density, or responsive composition is a material risk, reserve the support slot for `spatial-layout-and-alignment-system.md`. Link its validated spatial receipt under design-quality evidence so screenshots and computed parent/child geometry agree; do not compensate for a wrong layout owner with child-level CSS.

Use the smallest risk matrix: narrow/mobile, target desktop, and an intermediate sweep; add engines, devices, locales, content, and roles only when warranted. Bind environments to captures and name the browser/assistive-technology task. Without a mobile target, prove accessible coherent inferred behavior, not pixel parity.

For multi-surface/elevated design-system changes, bind `DESIGN.md` or equivalent and trace semantic tokens through Figma/WPDS, `theme.json`, CSS variables, block styles, and output. A pass cannot retain token drift or unowned raw values; deviations need evidence.

### Failed Proof Recovery Gate

Any reproducible in-scope overlap, clipping, overflow, wrong hierarchy/asset, responsive failure, inaccessible interaction, or editor/frontend divergence sets visual proof to `FAIL` and reopens implementation. Do not stop at an apology while safe recovery exists.

Classify the owning cause first: asset/font/data readiness; ownership/block hierarchy; tokens/components; cascade, Global Styles, or Site Editor overrides; intrinsic layout/breakpoints; runtime state; or capture contamination. Fix that layer, not symptoms with page/viewport selectors, magic offsets, or frontend-only CSS.

Re-render the failure and smallest affected editor/frontend set. Keep observed and fixed evidence under one defect ID. P1/P2 defects cannot be accepted into a pass; only an approved, evidenced P3 deviation reclassified outside the defect set may remain. After two failed repair cycles, stop patching, reopen source, manifest, ownership, or architecture, and replace the contract and proof run before passing. Escalate only an external blocker or material design decision with evidence and the best recovery. Unavailable evidence cannot convert an observed failure into a pass.

Bind authoring proof to surface, operation and candidate: About paragraph persistence cannot pass Home or template-part editing. After content/chrome replacement, rerun affected visual and UI-only save/reopen proof; List View is insufficient. Retain unaffected proof with dependency rationale. Diagnose blank editors on a compatible authorized surface before generalizing browser failure to WordPress. Reconcile manifest, receipt and final gate statuses; contradictions block completion, not trigger unrelated health-check loops.

Completion requires:

- intended content is editable from the documented WordPress surface and survives save/reload,
- the visitor completes the primary task and the author completes the primary editing task,
- the non-technical author can create/insert it and edit representative copy, media, links, and allowed layout without code,
- no invented design facts, APIs, blocks, assets, behavior, or proof,
- source/candidate evidence exists for changed visual surfaces,
- generated assets pass the approved rubric and target-crop inspection,
- required responsive, accessibility, browser, performance, content-stress, and editor/frontend gates pass; gaps can be reported but cannot establish completion,
- no known reproducible in-scope visual defect remains,
- each meaningful difference is `accepted`, `platform/accessibility constraint`, or `unresolved`.

## Output

Report source class, decisions, ownership/components, assets, capture fingerprint, workflows, validation, deviations, and unresolved items. Keep measurements/captures in the manifest.
