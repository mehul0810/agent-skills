# Design Intelligence Routing

Use this when a WordPress task has material user-facing design or workflow risk. Design understanding is proportional to risk; do not trigger a design pass for every issue.

## When To Use

Use this for admin UI, onboarding, settings screens, dashboards, docs/website UX, redesigns, visual regressions, release UI proof, and owner screenshot feedback.

Do not assume that a supplied image is an approved build target. Apply the source-visual intent gate below. Use `visual-to-wordpress-implementation.md` only after a target is selected.

Do not use this for low-risk backend fixes, release metadata, CI-only work, tiny copy/docs edits, or provider internals unless there is real user-facing UX risk.

## Router Rule

Use `product-design:index` as the router only. Then pick the narrowest Product Design skill for the need:

- `product-design:audit`: audit, review, critique, or compare an existing product experience, screenshot, or rendered implementation.
- `product-design:ideate`: explore directions when a redesign is needed and no chosen visual direction exists; first prepare a compact context brief from inspected product evidence.
- `product-design:image-to-code`: only after a source visual direction is selected.
- `imagegen`: generate or edit production raster assets after an asset brief exists; it does not replace WordPress implementation or visual QA.

For an audit with material grouping, alignment, density, competing emphasis or image-legibility risk, pass `spatial-layout-and-alignment-system.md` as the single support to the reviewer. Verify that it was loaded; naming Product Design alone does not carry local expertise. Skip it for nonvisual audits and bounded value-only edits.

When the material design risk is AI-generated/adaptive UI, personalization, voice, kinetic typography, guided scrolling, spatial/3D media, or trend-led composition, use `emerging-interface-design-contract.md` as the single support reference. It supplies the adoption, fallback, trust, and proof gate; do not treat a trend label as direction approval.

Classify the deliverable: concept image, editable design, interactive prototype, or production implementation. For native Figma/Pen creation or updates, switch primary to `native-design-authoring.md`; do not substitute image-to-code. For Figma implementation, obtain structured node/version, variables, components, assets, fonts, constraints, and interactions before coding; use an inspected export only when access fails, declaring the gap.

When a greenfield or redesigned frontend has no selected visual target, or a rendered result is coherent but still generic/template-like, use `frontend-design-taste.md` as the one supporting judgment reference. It provides a WordPress-native design read, expressiveness/motion/density/trust dials, anti-repetition review, and taste preflight. Do not stack it onto exact screenshot/Figma implementation, routine admin UX, or a second confirmed support risk.

Discover the named capability before relying on it. If unavailable, prepare the brief and report the blocked artifact; a different format requires agreement. Never invent tool execution.

Use design QA only after a prototype/build has both a source visual and a rendered implementation.

## Source-Visual Intent Gate

Inspect the actual image at readable resolution and classify the request before code:

- `Audit`: explain strengths, problems, hierarchy, UX, accessibility, and evidence limits. Use `product-design:audit`.
- `Derive`: create a new design from one or more references. Treat them as influence, not a target; extract constraints, prepare a compact brief, then use `product-design:ideate`. Use reversible creative discretion to choose a coherent direction unless alternatives or approval are requested, the change is brand-critical/major, or a material scope or brand decision remains unresolved.
- `Reproduce`: faithfully implement an explicitly selected screenshot, Figma frame, mockup, or generated result. Use `visual-to-wordpress-implementation.md`.
- `Extend`: add a new page/state/component to an existing design language. Audit the existing system first and model its reusable rules; for a material new composition, choose a missing target and seek owner/product-design selection only when requested or needed for a brand/scope decision.

Words such as `use this as inspiration`, `make something like this`, `improve`, `redesign`, or `create based on` do not authorize exact cloning or immediate implementation. Conversely, do not ideate away an exact approved target.

## Design Understanding Readiness

Before ideation or implementation, create a compact source model containing:

- image identity, dimensions, crop/quality limits, viewport, and target state;
- page/screen purpose, user job, hierarchy, reading order, and primary action;
- layout constraints: container, grid, alignment, grouping, rhythm, whitespace, and likely fixed/fluid/intrinsic relationships;
- typography roles, color roles, spacing/radius/elevation/icon/media language, components, variants, and visible states;
- real assets versus decoration, required crops, provenance, and missing-asset decisions;
- responsive hypotheses for reflow, wrap, stack, resize, crop, hide, or replacement, each marked observed or inferred;
- WordPress ownership and likely Core/plugin block, pattern, style, template, or custom-block mapping;
- unknown fonts, hidden states, interactions, mobile behavior, dynamic data, and claims, with confidence and validation path.

OCR, color sampling, and measurements are evidence aids, not authority. A cropped, compressed, composite, or single-state image cannot prove hidden behavior. Ask one focused question only when a brand-critical or journey-changing ambiguity cannot be resolved safely; otherwise use a reversible, labeled inference.

The build gate is a coherent direction plus sufficient source evidence. Obtain owner/product-design selection when requested or when a brand-critical/major direction or material scope decision needs approval; otherwise a reversible, labeled choice is sufficient. An approved existing design system, wireframe, or rendered WordPress prototype can resolve direction without another generated image; record what it establishes and remaining uncertainty. Exact image/Figma work still preserves the supplied target. If image creation is requested, produce that artifact. Attach supplied references when supported; never claim unused attachments.

## Redesign Growth Gate

### Task-Based UX Evidence

For material workflow changes, define the user's starting context, primary job, expected outcome, minimum steps and recovery path before visual alternatives. Audit one realistic journey with actual content, keyboard/touch and constrained width; distinguish heuristic findings from observed user research. An agent walkthrough cannot establish real-user usability or conversion lift.

In the existing brief, cover first-use, no-results, permission-denied, loading, partial/stale data, failure and success only where applicable. Each needs truthful status and a useful next action; never render a failed request as an empty dataset. Preserve entered data during recoverable errors, expose validation near the affected field, and verify focus/status announcements. Progressive disclosure must not hide prerequisites, costs or consequences. Drag operations also need a non-drag single-pointer alternative where WCAG requires it, not keyboard support alone.

Set one task-success measure and relevant guardrails (errors, recovery, accessibility, performance); if analytics/user testing are absent, label the outcome unverified. New design-system patterns earn reuse through representative rendered and authoring proof, not novelty or a generic premium score.

Checked 2026-09-08: [Carbon empty-state distinctions](https://carbondesignsystem.com/patterns/empty-states-pattern/) and [WCAG dragging alternatives](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html).

For `improve` or `redesign` work on a growth, product, or service page, do not generate a replacement image first. Audit the current rendered page and create a compact growth brief: audience and journey stage; search intent and useful content; primary conversion and CTA; offer, objections, friction, trust/proof, and mobile path; current URLs, headings, internal links, forms, analytics, consent, structured data, and performance contracts; and available analytics, Search Console, research, or user evidence.

Turn findings into ranked hypotheses for message, IA, content, proof, CTA, form, and layout changes. Label each as observed, evidence-backed hypothesis, or assumption; define the expected user/search/business effect and measurement. Preserve valuable ranking content and verified contracts unless the brief explicitly changes them. Never call a tactic or redesign `proven` without applicable experiment or outcome evidence, invent proof, keyword-stuff, add dark patterns, or trade page experience for conversion pressure.

Generate alternatives only from the reviewed brief. Get direction selection when requested or when a brand-critical/major decision needs approval; otherwise choose a reversible direction and proceed. Keep this reference primary for direction; hand the brief sequentially to `wp-site-expert` for conversion, SEO, analytics, content, and WordPress implementation. Do not load every growth reference at once.

## Workflow Rules

- CTO/PO decides whether a design pass is needed based on product risk and context, not by default.
- Apply the compact product-experience lens already present in the issue or product brief. Load `product-experience-principles.md` as the one support only when defaults, onboarding, or advanced-user controls remain a confirmed decision risk.
- Load `enterprise-design-judgment.md` as the one support only for a confirmed premium/enterprise, AI/workflow, buyer-facing, or governance risk. When frontend taste already owns the support slot, use its compact accountability read rather than stacking references.
- If UI changed, require screenshot proof.
- If layout, workflow quality, or UX clarity changed materially, add a design audit.
- For exact, regression, release-critical, or previously failed work, require the current visual-proof schema v3; generated or materially art-directed imagery also requires the asset-production receipt.
- If a large redesign has no chosen direction, ideate before implementation.
- For brand-critical greenfield, major overhaul, or multi-page work, validate one representative direction artifact before scaling the design; do not require this gate for exact targets or bounded polish.
- For material onboarding, conversion, settings, publishing, or repeated operational journeys, use risk-tiered usability evidence before claiming excellent UX.
- For a growth-led redesign, require the growth brief and measurement plan before visual generation; assess the candidate against visitor intent and conversion friction, not aesthetics alone.
- Convert Product Design findings into actionable acceptance criteria, design QA checks, or adjacent findings for PO triage.

## Ownership Boundary

`wp-plugin-expert`, `wp-theme-expert`, and `wp-site-expert` still own implementation, tests, performance, security, WordPress correctness, and maintainability.

If a worker notices UX or design friction outside current scope, preserve PR scope and report it through `adjacent-finding-protocol.md`.
