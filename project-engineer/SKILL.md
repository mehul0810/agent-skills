---
name: project-engineer
description: "Implement and verify non-WordPress web, static-site, macOS and game projects with platform-specific ownership and proof. Use for runnable software or interactive prototypes, not standalone design files, WordPress-owned implementation, generic research or independent source-blind acceptance."
---

# Project Engineer

Deliver the requested runnable artifact without importing WordPress architecture or a fixed visual style. This skill owns the non-WordPress implementation/proof boundary, not a new general-purpose project-management process.

## Establish The Boundary

- Inspect the exact project and requested artifact; respect its existing stack, repository instructions and unrelated work. Identify platform, changed surface and available runtime before choosing tools. A browser mock of a macOS app is not a native app.
- For platform or stage selection, use `../shared/references/platform-workflow-profiles.md`. Start with the smallest sufficient stage; move directly to build for a selected target and to verify for an existing artifact. No mandatory explore-to-ship ceremony.
- Keep owner requirements, authorization, security, accessibility, truthful content, supported public contracts and asset rights distinct from revisable design/implementation hypotheses. Do not turn guesses about style into frozen requirements.
- Prefer one focused reference for the live decision. Add support only for a named risk the primary does not cover; correctness wins over an arbitrary reference count. Do not preload the other platforms or the entire WordPress pack.

## Conditional Work

- Open-ended or generic visual output: use `../shared/references/frontend-design-taste.md` for purposeful composition and representative directions. A selected target or tiny fix does not need alternatives.
- Reference interpretation or editable design versus implementation ambiguity: use `../shared/references/design-intelligence-routing.md`. Standalone Figma/Pen artifacts stay with their actual authoring capability; they do not replace running software.
- Before claiming user-visible success, use `../shared/references/observable-proof-contract.md`. Use a fresh `behavior-validator` for independent acceptance when the risk warrants it; static checks and simulated receipts do not prove runtime behavior or appearance.
- Before local commits or pushes, use `../shared/references/change-delivery-discipline.md`. Continue small coherent tested local commits; keep publication separately gated and preserve stricter client conventions.
- WordPress owns the requested blocks, plugins, theme or saved site composition: hand off to its existing `wp-*` specialist. A WordPress backend with a separate frontend has two explicit contracts, not one imposed stack.

## Finish Proportionally

Report the artifact and exact revision, what actually ran, visual/runtime evidence, local commits and remaining gaps. A missing runtime may block native acceptance while portable tests continue. Do not claim adoption, quality improvement, installation, signing, store submission, deployment or release from a passing plan or fixture.
