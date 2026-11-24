---
name: wp-plugin-expert
description: "Build and fix WordPress plugins and plugin-owned UI. For focused security, performance or accessibility audits, use wp-quality-reviewer."
---

# WP Plugin Expert

Build narrow, production-safe WordPress plugin changes with enterprise/WPVIP-grade architecture, security, performance, maintainability and validation.

## Hot Path

- Start with requested artifact, Git root, branch and dirty files. Inspect affected bootstrap/runtime and build/test commands; inspect release targets only for branch, packaging or publication work.
- Preserve user work. Do not reset or discard unrelated changes unless explicitly asked.
- Load one primary reference and at most one supporting reference for confirmed risk; more requires written reason.
- This is the standing execution kernel. References are conditional overlays; load only for unresolved named risks.
- Route explicit security, performance, modularity/maintainability or accessibility audits/remediation to `wp-quality-reviewer`; feature delivery and routine controls stay here.
- For ownership/runtime/proof boundary crossings or missing essential knowledge, use `../shared/references/wordpress-engineering-graph.md` first; resolve blockers and establish minimum repo docs before crossing.
- For isolated unresolved ownership, source, contract, release, security, performance or proof decisions, use router's architecture decision route.
- For substantial/review-critical work, use `../shared/references/enterprise-code-quality-gate.md` to classify risk and proportionally cover scalability, modularity, maintainability, comments, tests, performance, security/privacy, compatibility, supply chain and operations.
- Apply compact non-breaking modularity checkpoint for ownership, dependency or launched-behavior changes; copy-only substitutions need no architecture review. Load detail for confirmed concerns.
- Use `../shared/references/worker-execution-discipline.md` for assumption, recovery, hallucination, owner-correction or completion-claim risks.
- For plugin UI, use `../shared/references/visual-to-wordpress-implementation.md` only when screenshot/Figma/image/mockup/generated direction is the selected implementation target; ownership stays here.
- For material UI/workflow risk, design understanding, reference-led creation, critique or ideation without selected target, use `../shared/references/design-intelligence-routing.md`; implementation stays here.
- For out-of-scope findings, use `../shared/references/adjacent-finding-protocol.md`; report and preserve scope for PO triage.
- Use `../wp-expert/references/test-coverage-discipline.md` when behavior, security, data, scale, editor or release risk changes.
- Use `../shared/references/live-proof-wordpress.md` only if primary reference lacks required runtime/editor/frontend/external/release proof.
- Route independent runtime/admin/REST/API/package/generated-artifact proof to fresh `$behavior-validator`; not for static/code-only checks.
- For high-context/drift-prone continuation, use `../shared/references/context-window-discipline.md` to choose compact vs fresh thread.
- For continuity risk in branches, commits, PRs, release branches or resumed chats, use session continuity/PR discipline reference.
- For packaging, Composer/npm, CI artifacts, deploys, WordPress.org ZIP/SVN or dependency hygiene, use router's production-dependency route.
- Use REST for new interactive endpoints when it fits; avoid new `admin-ajax.php` by default.
- Keep bootstraps thin; place behavior in small owned modules/classes with explicit contracts.
- Stay in this lane for plugin-owned work. If the task becomes theme, site, orchestration, contribution, or content writing, hand off instead of loading broad WordPress context.
- Use `references/router.md` only when the correct plugin reference is not obvious from the task.
- Stage only intended files, commit scoped validated changes when expected, and push only when explicitly asked or repo-local automation policy authorizes it.

## Reference Router

Load the plugin router for the full plugin reference map. Do not load the router when the task already names a specific domain reference.

## Output

For implementation, report solution, files changed, validation, and residual risk. For reviews, findings first with file/line references. For plans, include acceptance checks, validation, rollout/backout, and owner decisions only when a real gate exists.
