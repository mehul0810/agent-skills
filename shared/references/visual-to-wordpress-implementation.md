# Visual To WordPress Implementation Contract

Use for a selected visual target. Route creation, critique, redesign, or unresolved direction to `design-intelligence-routing.md`. Add one confirmed-risk support.

## 1. Qualify The Source

Inspect the source visual and confirm target identity; filename, memory, thumbnail, description, or mixed references are insufficient.

Classify it as:

- `Exact`: visible geometry and treatment are acceptance targets.
- `Directional`: hierarchy and visual language matter; composition may adapt.
- `Inspiration`: extract principles, not layout.

Record dimensions, state, fonts/assets, responsive/interaction behavior, and values are `supplied`, `measured`, or `inferred`. Record ambiguities; clarify consequential choices, otherwise label accessible native defaults.

Calibrate pixels to viewport, DPR, and crop/export scale; 2x images do not imply 2x CSS. For unknown scale, use confidence/normalized geometry. Preserve exact density; no arbitrary enlargement or whole-page transforms.

### Figma And Pen Source Preflight

For Figma, inspect frame/version, variables, components, assets, fonts, constraints, interactions. Use `figma-implement-design` when available; fingerprint source or explain export. WordPress ownership stays with specialist.

For Pen, inspect board IDs, revision/hash, constraints, tokens, assets, rendered boards. Respect access restrictions. Text extraction cannot prove appearance; disclose export gaps.

## 2. Build A Visual And Behavior Manifest

Map before code:

- regions, hierarchy, semantics, measurements, type, and layering;
- component roles, variants, states, bounds, tokens, and WordPress primitives;
- assets, crops, focal points, and responsive behavior;
- owner, editing surface, visitor/author workflows, runtime, captures, tolerance, budget, and deviations.

Use `wp-expert/scripts/fse-design-map.sh` for FSE; update manifest when disproved.

For exact pages, map complete section order, including header/footer, to active saved posts, parts, patterns, overrides. A matching hero/pattern does not prove saved content changed. Resolve retention/replacement before mutation; back up unrelated content.

## 3. Choose WordPress Ownership

- Site strategy and outcomes: `wp-site-expert` owns journey, IA, conversion, SEO, and analytics.
- `wp-theme-expert`: theme tokens, templates, patterns, blocks, editor ownership, visual implementation.
- `wp-plugin-expert`: plugin admin/editor/onboarding/customer surfaces. Route mixed briefs to theme; load both only for shared ownership.

For block themes, map `theme.json`, verified blocks/supports, patterns, templates/parts, variations, bindings, custom blocks, then Interactivity API. Templates render Post Content when Pages > Edit owns body. Build saved content, not frontend simulations; never use Custom HTML/Shortcode shortcuts. Apply `../../wp-expert/references/block-theme-architecture.md` distribution gate before theme functionality.

Inventory stable Core and WordPress Design System controls in runtime. Prefer accessible, tokenized primitives; bespoke controls need a functional gap, owner, state/accessibility contract, and maintenance rationale.

## 4. Handle Image Assets Deliberately

Classify assets: reuse, generate, license, recreate, placeholder.

For generation, brief purpose, subject, art direction, palette, composition, constraints, crop safety, ratios, and resolutions. Use `product-design:ideate` for alternatives and `imagegen` for raster work. Never guess logos, factual screenshots, identities, or copyrighted artwork. Score candidates for accuracy, brand, crops, artifacts, accessibility, and consistency. Keep image text-free unless verified; render UI copy in HTML/blocks. Inspect crops/resolutions, revise misses instead of using CSS, and record provenance, approval, alt intent, focal point, responsive crops, format, dimensions, and optimization.

Validate generated/licensed/art-directed assets with `../schemas/wordpress-asset-production.schema.json` and `node wp-expert/scripts/validate-asset-production.mjs <receipt.json>`. Bind approval, crops, provenance, optimization; download remote evidence before hashing.

Use responsive WordPress media/formats. Never claim licensing, authorship, brand approval, or factual depiction without evidence.

## 5. Implement In Passes

Structure/semantics/content ownership; tokens/components/global styles; intrinsic responsive layout/block mapping; assets/media; interactions/states; accessibility/performance/browser compatibility; then visual, editor/frontend, and workflow proof.

Stabilize ownership, structure, fonts/assets before nudges; custom blocks need a native-primitive gap. Before scaling, prove representative content/assets, editor controls, and responsive behavior. Reuse IDs across maps/receipts. Separate craft from usability.

For substantial image-to-page work, prove header, hero, CTA, section transition, and footer at source/narrow widths before scaling. Calibrate fonts/wrap before spacing. Report fidelity, design quality, and visitor/author usability separately; averages cannot hide failed gates.

For immersive/adaptive/motion/media, define static state, reduced-motion/data behavior, browser/media fallback, value, cleanup, rollback. Failure preserves content, navigation, tasks, and authoring.

## 6. Prove The Result

For exact/regression, use `../../wp-expert/references/visual-parity-regression.md` only if no other support risk owns the slot. Record the capture fingerprint: build/runtime, browser/OS/DPR, viewport, zoom, scroll position, locale/preferences, media/fonts, and volatile inputs.

For authenticated admin/editor proof, prefer the product harness. Spatial adapter `storageStatePath` is config-relative/local: keep it untracked, never echo its path or contents, and use a task-owned account for mutations.

For `Exact`, regression, release-critical, or failed work, use visual-proof schema v3 (`../schemas/wordpress-visual-proof.schema.json`) and run `node wp-expert/scripts/validate-visual-proof.mjs <proof.json>` from the declared evidence root. Declare required capture, workflow, environment, and asset IDs first. Each surface needs its own workflow/capture per environment; never reuse a candidate across captures. For release proof, install the packaged artifact; bind digest, version/build and environment to each capture; development screenshots are supplementary. Bind immutable evidence, coverage, design/accessibility review, token drift or unowned raw values, defects, and reproof. Paths cannot escape root through traversal/symlinks. Validation proves receipt integrity, not aesthetics.

Compare source/candidate by overlay or perceptual diff across geometry, type, color, crops, responsive behavior, interactions, and editing. Use project tolerances; otherwise investigate hard-edge geometry deltas above 2 CSS px. Treat font rasterization separately.

Verify CSS viewport, document width, DPR, and export scale; explain requested/actual discrepancies. Healthy routes, H1 counts, valid blocks, loaded assets, or no overflow are not fidelity. Candidate-only screenshots cannot pass exact parity.

For material spacing/alignment/grid/density/responsive risk, reserve the support slot for `spatial-layout-and-alignment-system.md`. Link its validated spatial receipt; do not compensate for wrong layout ownership with child CSS.

Use narrow, desktop, intermediate widths; add engines, devices, locales, content, roles as warranted. Bind environments to captures and name the browser/assistive-technology task. Without mobile target, prove accessible coherent inferred behavior, not pixel parity.

For elevated/multi-surface design-system changes, bind `DESIGN.md` and trace tokens through Figma/WPDS, `theme.json`, CSS, styles, output. No pass with token drift/unowned values; deviations need evidence.

### Failed Proof Recovery Gate

Any reproducible in-scope overlap, clipping, overflow, wrong hierarchy/asset, responsive failure, inaccessible interaction, or editor/frontend divergence sets visual proof to `FAIL` and reopens implementation. Do not stop at an apology while safe recovery exists.

Classify cause: asset/data; ownership/hierarchy; tokens/components; cascade/Global Styles/Site Editor overrides; intrinsic layout/breakpoints; runtime; capture contamination. Fix the owner, not symptoms with selectors, magic offsets, or frontend-only CSS.

Re-render failure and affected editor/frontend set; keep observed and fixed evidence under one defect ID. P1/P2 defects cannot be accepted into a pass; only an approved, evidenced P3 reclassified outside defects may remain. After two failed repairs, reopen source/manifest/ownership/architecture and replace contract and proof. Escalate external blockers or material decisions with recovery. Unavailable evidence cannot convert an observed failure into a pass.

Bind authoring proof to surface, operation and candidate: About persistence cannot pass Home/template editing. After content/chrome replacement, rerun affected visual and UI save/reopen proof; List View is insufficient. Retain unaffected proof with dependency rationale. Diagnose blank editors on a compatible surface. Reconcile manifest/receipt/final statuses; contradictions block completion.

Completion requires:

- documented WordPress content edits and survives reload; the visitor completes the primary task and the author completes the primary editing task;
- non-technical author creates/inserts and edits representative copy/media/links/layout without code;
- no invented facts/APIs/blocks/assets/behavior/proof; changed surfaces have source/candidate evidence;
- generated assets pass rubric and crop inspection; responsive, accessibility, browser, performance, content-stress, and editor/frontend gates pass;
- no reproducible in-scope defect remains; each difference is `accepted`, `platform/accessibility constraint`, or `unresolved`.

## Output

Report ownership, assets, proof, deviations, unresolved items; measurements in manifest.
