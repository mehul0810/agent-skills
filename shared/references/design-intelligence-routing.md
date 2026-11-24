# Design Intelligence Routing

Use when a WordPress task has user-facing design or workflow risk. Design understanding is proportional to risk; do not trigger a design pass for every issue.

## When To Use

Use this for admin UI, onboarding, settings screens, dashboards, docs/website UX, redesigns, visual regressions, release UI proof, and owner screenshot feedback.

A supplied image is not automatically an approved build target; apply the source-visual intent gate. Use `visual-to-wordpress-implementation.md` only after a target is selected.

Skip low-risk backend, release metadata, CI-only, tiny copy/docs, and provider internals unless real UX risk exists.

## Router Rule

Use `product-design:index` as the router only; choose the narrowest skill:

- `product-design:audit`: review or compare an existing experience, screenshot, or implementation.
- `product-design:ideate`: explore direction when redesign has no chosen direction; first brief inspected product evidence.
- `product-design:image-to-code`: only after a source visual direction is selected.
- `imagegen`: generate or edit production raster assets after an asset brief exists; it does not replace WordPress implementation or visual QA.

For material grouping, alignment, density, emphasis, or image-legibility risk, give the reviewer `spatial-layout-and-alignment-system.md` as the single support and verify it loaded. Skip nonvisual audits and bounded value-only edits.

For material AI/adaptive UI, personalization, voice, kinetic type, guided scrolling, spatial/3D media, or trend-led composition, use `emerging-interface-design-contract.md` as the single support for adoption, fallback, trust, and proof; a trend label is not approval.

Classify the deliverable as concept image, editable design, prototype, or production implementation. For native Figma/Pen work, switch primary to `native-design-authoring.md`, not image-to-code. Figma implementation requires node/version, variables, components, assets, fonts, constraints, and interactions; use an inspected export only if access fails and disclose the gap.

For greenfield/redesigned work without a selected target, or coherent but generic output, use `frontend-design-taste.md` as the one support for WordPress-native direction, experience dials, anti-repetition, and preflight. Do not stack it on exact screenshot/Figma work, routine admin UX, or another support risk.

Discover the named capability before relying on it. If unavailable, prepare the brief and report the blocked artifact; alternate format needs agreement. Never invent execution.

Use design QA only after a prototype/build has both a source visual and a rendered implementation.

## Source-Visual Intent Gate

Inspect the actual image at readable resolution and classify the request before code:

- `Audit`: explain strengths, problems, hierarchy, UX, accessibility, and evidence limits. Use `product-design:audit`.
- `Derive`: inspect references as influence, not exact targets; extract constraints and prepare a compact brief, then use `product-design:ideate` to establish a coherent direction.
- `Reproduce`: faithfully implement an explicitly selected screenshot, Figma frame, mockup, or generated result. Use `visual-to-wordpress-implementation.md`.
- `Extend`: audit the existing system's reusable rules, then select the missing page/state/component composition before implementation.

Inspiration/redesign require inspection and a brief, not cloning. Delegated direction may proceed reversibly; ask only when requested or brand/positioning/scope remains materially unresolved. Never ideate away an approved exact target.

## Design Understanding Readiness

Greenfield needs audience/job, outcome, truthful content, and constraints. Missing images are inapplicable, not blockers. Explore reversible concepts before fixing layout/mapping; label hypotheses and never invent assets/proof. Concept review cannot replace final fidelity, native-authoring, or implementation checks.

Inspect supplied visuals first. Before implementation, resolve:

- image identity, dimensions, crop/quality, viewport, and state; purpose, user job, hierarchy, reading order, and action;
- container/grid/alignment/grouping/rhythm and fixed, fluid, or intrinsic relationships;
- type, color, spacing, radius, elevation, icon/media language, components, variants, and visible states;
- real versus decorative assets, crops, provenance, missing-asset decisions, and observed/inferred responsive behavior;
- likely Core/plugin blocks, patterns, styles, templates, or custom-block ownership;
- unknown fonts, hidden states, interactions, mobile behavior, dynamic data, and claims, with confidence and validation path.

OCR, color sampling, and measurements are evidence aids, not authority. Cropped, compressed, composite, or single-state images cannot prove hidden behavior. Ask only when an unresolvable ambiguity changes brand or journey; otherwise label a reversible inference.

Build only from coherent, evidence-backed direction. Resolve brand/positioning/scope or choose reversibly when delegated. Existing design systems, wireframes, or rendered WordPress prototypes can establish direction; record evidence/uncertainty. Preserve exact targets. If image creation is requested, produce that artifact. Attach references only when supported.

## Redesign Growth Gate

### Task-Based UX Evidence

For material workflow changes, define starting context, job, outcome, steps, and recovery. Audit a realistic journey using actual content, keyboard/touch, and constrained width. Heuristics and agent walkthroughs are not user research or conversion evidence.

Cover applicable first-use, empty, denied, loading, stale, failure, and success states truthfully with a next action; failed requests are not empty data. Preserve recoverable input, validate near fields, announce status/focus, disclose costs/consequences, and provide required non-drag pointer alternatives.

Set a task-success measure and error, recovery, accessibility, and performance guardrails. Without analytics/testing, label outcomes unverified. New patterns earn reuse through representative rendered and authoring proof, not novelty or a premium score.

Reference: [Carbon empty states](https://carbondesignsystem.com/patterns/empty-states-pattern/) and [WCAG dragging alternatives](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html).

For growth-page `improve`/`redesign`, audit rendered page before image generation. Brief audience/journey, search intent/content, conversion/CTA, offer/friction/trust, mobile path, URL/content/form and analytics/consent/schema/performance contracts, and available outcome evidence.

Rank message, IA, content, proof, CTA, form, and layout hypotheses; label observed fact, evidence-backed hypothesis, or assumption and define expected effect and measurement. Preserve valuable ranking content and verified contracts unless explicitly changed. Never call a tactic or redesign `proven` without applicable experiment or outcome evidence, invent proof, keyword-stuff, add dark patterns, or trade page experience for conversion pressure.

Generate alternatives only from the reviewed brief. Request selection for requested or materially unresolved brand/positioning/scope decisions; otherwise choose reversibly when delegated. Keep this reference primary, then hand the brief to `wp-site-expert` for conversion, SEO, analytics, content, and implementation. Do not load every growth reference at once.

## Workflow Rules

- CTO/PO decides whether a design pass is warranted from risk/context, not by default. Use the product-experience lens in the brief; load `product-experience-principles.md` only for a confirmed defaults, onboarding, or advanced-control risk.
- Load `enterprise-design-judgment.md` only for confirmed enterprise, AI/workflow, buyer, or governance risk. If frontend taste owns support, use its accountability read instead of stacking references.
- If UI changed, require screenshot proof; material layout/workflow/clarity changes also need a design audit.
- Exact, regression, release-critical, or failed work requires current visual-proof schema v3; generated/materially art-directed imagery also needs the asset-production receipt.
- Ideate before a large redesign without direction. For brand-critical greenfield, major overhaul, or multi-page work, validate a representative artifact before scaling; delegated choice needs no owner approval. Skip for exact targets/bounded polish.
- Material journeys need risk-tiered usability evidence before claiming excellent UX. Growth redesigns need the growth brief and measurement plan before image generation and evaluation against intent/friction, not aesthetics alone.
- Convert Product Design findings into actionable acceptance criteria, design QA checks, or adjacent findings for PO triage.

## Ownership Boundary

`wp-plugin-expert`, `wp-theme-expert`, and `wp-site-expert` own implementation, tests, performance, security, WordPress correctness, and maintainability.

If a worker notices UX or design friction outside current scope, preserve PR scope and report it through `adjacent-finding-protocol.md`.
