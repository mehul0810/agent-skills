# Design Intelligence Routing

Use this when a WordPress task has material user-facing design or workflow risk. Design understanding is proportional to risk; do not trigger a design pass for every issue.

## When To Use

Use this for admin UI, onboarding, settings screens, dashboards, docs/website UX, redesigns, visual regressions, release UI proof, and owner screenshot feedback.

Do not use this for low-risk backend fixes, release metadata, CI-only work, tiny copy/docs edits, or provider internals unless there is real user-facing UX risk.

## Router Rule

Use `product-design:index` as the router only. Then pick the narrowest Product Design skill for the need:

- `product-design:audit`: audit, review, critique, or compare an existing product experience, screenshot, or rendered implementation.
- `product-design:get-context` then `product-design:ideate`: explore directions when a redesign is needed and no chosen visual direction exists.
- `product-design:image-to-code`: only after a source visual direction is selected.

Use design QA only after a prototype/build has both a source visual and a rendered implementation.

## Workflow Rules

- CTO/PO decides whether a design pass is needed based on product risk and context, not by default.
- Use `product-experience-principles.md` as the quality lens for premium polish, plug-and-play defaults, onboarding simplicity, and advanced-user escape hatches.
- If UI changed, require screenshot proof.
- If layout, workflow quality, or UX clarity changed materially, add a design audit.
- If a large redesign has no chosen direction, ideate before implementation.
- Convert Product Design findings into actionable acceptance criteria, design QA checks, or adjacent findings for PO triage.

## Ownership Boundary

`wp-plugin-expert`, `wp-theme-expert`, and `wp-site-expert` still own implementation, tests, performance, security, WordPress correctness, and maintainability.

If a worker notices UX or design friction outside current scope, preserve PR scope and report it through `adjacent-finding-protocol.md`.
