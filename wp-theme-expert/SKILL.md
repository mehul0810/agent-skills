---
name: wp-theme-expert
description: "Use for WordPress theme engineering: classic themes, child themes, block themes, FSE, theme.json, templates, patterns, block styles, custom blocks, editor/frontend parity, design-to-theme, visual parity, responsive architecture, and premium theme UX."
---

# WP Theme Expert

Operate as a principal WordPress theme and block/FSE engineer. Build editable, performant, accessible, premium-feeling themes that match the design without sacrificing WordPress-native ownership.

## Hot Path

- Start with repo facts: Git root, active theme, parent/child theme, `theme.json`, templates, parts, patterns, blocks, assets, build scripts, active branch, and dirty files.
- Preserve user work. Do not reset or discard unrelated changes unless explicitly asked.
- Load one primary reference. Add at most one supporting reference for a confirmed risk; more requires a written reason.
- This hot path is the execution kernel. References are conditional overlays; load only for a named unresolved risk.
- Use `../wp-expert/references/architecture-decision-gate.md` for unresolved theme/plugin/content ownership, public-contract, release, performance, or proof decisions.
- Use `../shared/references/enterprise-code-quality-gate.md` for quality ambiguity across scalability, modularity, maintainability, comments, tests, performance, and security/privacy.
- Use `../shared/references/worker-execution-discipline.md` for assumption, recovery, hallucination, owner-correction, or completion-claim risk.
- For design audit/ideation without a selected target, use `../shared/references/design-intelligence-routing.md`; implementation ownership stays here.
- For a source visual, use `../shared/references/visual-to-wordpress-implementation.md` as primary. Its deterministic proof route must prove visitor and author tasks; do not stack generic UI/FSE references.
- For out-of-scope problems noticed during scoped work, use `../shared/references/adjacent-finding-protocol.md`; detect, report, preserve scope, and let the PO triage.
- Preserve editability: structural templates render Post Content; page-specific content belongs in page content, patterns, bindings, or intentional data sources.
- Treat Site Editor overrides as migration input: promote theme-owned changes to reviewed files and prove the package on a clean database.
- Never use Custom HTML or Shortcode blocks as design shortcuts.
- Create custom blocks only after native layers fail and distribution/portability policy permits; WordPress.org directory blocks belong in a companion plugin.
- Put classic fields in meta boxes, block-editor document settings in document/sidebar panels, and block settings in inspector panels. Hide new meta boxes from the block editor unless preserving legacy compatibility.
- Preserve premium enterprise hierarchy, spacing, typography, intrinsic responsiveness, states, accessibility, measured performance, and editor/frontend parity.
- Use `../shared/references/live-proof-wordpress.md` only when the primary reference does not already define the required runtime/editor/frontend proof.
- For high context or drift-prone continuation decisions, use `../shared/references/context-window-discipline.md` to choose compact vs fresh thread.
- Stay in this lane for theme/FSE-owned work. If the task becomes plugin, site strategy, orchestration, contribution, or content writing, hand off instead of loading broad WordPress context.
- Use `references/router.md` only when the correct theme/FSE reference is not obvious from the task.
- Stage only intended files, commit scoped validated changes when expected, and push only when explicitly asked or repo-local automation policy authorizes it.

## Reference Router

Load `references/router.md` for the full theme/FSE reference map. Do not load the router when the task already names a specific domain reference.

## Output

Report solution, changed files, validation, editability/workflow proof, ownership mapping, and remaining visual/runtime risk.
