# Design Intelligence Routing

Use this when a WordPress task has material user-facing design or workflow risk. Design understanding is proportional to risk; do not trigger a design pass for every issue.

## When To Use

Use this for admin UI, onboarding, settings screens, dashboards, docs/website UX, redesigns, visual regressions, release UI proof, and owner screenshot feedback.

For implementation from a screenshot, image, Figma frame, mockup, or chosen visual direction, use `visual-to-wordpress-implementation.md` as the single primary execution contract.

Do not use this for low-risk backend fixes, release metadata, CI-only work, tiny copy/docs edits, or provider internals unless there is real user-facing UX risk.

## Router Rule

Use `product-design:index` as the router only. Then pick the narrowest Product Design skill for the need:

- `product-design:audit`: audit, review, critique, or compare an existing product experience, screenshot, or rendered implementation.
- `product-design:ideate`: explore directions when a redesign is needed and no chosen visual direction exists; first prepare a compact context brief from inspected product evidence.
- `product-design:image-to-code`: only after a source visual direction is selected.
- `imagegen`: generate or edit production raster assets after an asset brief exists; it does not replace WordPress implementation or visual QA.

For a Figma URL/file/node, discover the Figma context capability and obtain structured node, variable, component, asset, font, constraint, and interaction evidence before using image-to-code. Do not substitute a screenshot when live structured context is available; if access fails, use an inspected export and state the proof gap.

When a greenfield or redesigned frontend has no selected visual target, or a rendered result is coherent but still generic/template-like, use `frontend-design-taste.md` as the one supporting judgment reference. It provides a WordPress-native design read, expressiveness/motion/density/trust dials, anti-repetition review, and taste preflight. Do not stack it onto exact screenshot/Figma implementation, routine admin UX, or a second confirmed support risk.

Discover the named capability before relying on it. If unavailable, recover in order: inspect evidence and write the compact brief; perform a manual heuristic audit or text direction set; let the owning WordPress specialist implement the chosen direction; for missing raster assets use `imagegen`, licensed/supplied media, or an explicit placeholder. Do not invent a tool or stop without a safe fallback.

Use design QA only after a prototype/build has both a source visual and a rendered implementation.

## Workflow Rules

- CTO/PO decides whether a design pass is needed based on product risk and context, not by default.
- Apply the compact product-experience lens already present in the issue or product brief. Load `product-experience-principles.md` as the one support only when defaults, onboarding, or advanced-user controls remain a confirmed decision risk.
- Load `enterprise-design-judgment.md` as the one support only for a confirmed premium/enterprise, AI/workflow, buyer-facing, or governance risk. Never stack it with frontend taste or another support reference.
- If UI changed, require screenshot proof.
- If layout, workflow quality, or UX clarity changed materially, add a design audit.
- If a large redesign has no chosen direction, ideate before implementation.
- For brand-critical greenfield, major overhaul, or multi-page work, validate one representative direction artifact before scaling the design; do not require this gate for exact targets or bounded polish.
- For material onboarding, conversion, settings, publishing, or repeated operational journeys, use risk-tiered usability evidence before claiming excellent UX.
- Convert Product Design findings into actionable acceptance criteria, design QA checks, or adjacent findings for PO triage.

## Ownership Boundary

`wp-plugin-expert`, `wp-theme-expert`, and `wp-site-expert` still own implementation, tests, performance, security, WordPress correctness, and maintainability.

If a worker notices UX or design friction outside current scope, preserve PR scope and report it through `adjacent-finding-protocol.md`.
