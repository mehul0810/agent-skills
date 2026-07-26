---
name: wp-quality-reviewer
description: Use for focused WordPress security, performance, modularity/maintainability, or accessibility audits and fixes. Trigger on review, hardening, profiling, refactoring, remediation, or independent reassessment for plugins, themes, sites, blocks, UI, APIs, integrations, and release candidates.
---

# WP Quality Reviewer

Own the review, remediation, and proof loop. Do not depend on an external Codex plugin or scanner for judgment: optional tools supply evidence, while this skill determines risk, fixes root causes, and verifies outcomes.

## Select The Mode

Load only the primary mode that matches the requested outcome:

- Authorization, data flow, REST/admin actions, uploads, webhooks, secrets, dependencies, privacy, or abuse: `references/security-review-fix.md`.
- Queries, cache, options, requests, jobs, bundles, editor/admin speed, Core Web Vitals, or capacity: `references/performance-review-fix.md`.
- Duplication, coupling, boundaries, architecture, comments, testability, dead code, or maintainability: `references/modularity-review-fix.md`.
- WCAG, semantics, keyboard/focus, screen readers, forms, contrast, responsive reflow, motion, or WordPress editor/admin accessibility: `references/accessibility-review-fix.md`.

For a multi-domain enterprise/release audit, load `references/multi-domain-release-review.md` instead of all four detailed references. Load one detailed mode only when the compact pass confirms a material or ambiguous risk.

## Routing Boundary

- A focused quality review or remediation belongs here even when the artifact is a plugin, theme, or site.
- New feature delivery and routine implementation constraints stay with `wp-plugin-expert`, `wp-theme-expert`, or `wp-site-expert`. Hand non-trivial artifact-specific architecture changes back with a finding, fix contract, and required re-proof; make a direct fix only when it is narrow and lower risk than the handoff.
- For release readiness, this skill owns the technical quality evidence and gate dispositions; `wp-product-orchestrator` owns candidate coordination, product/release synthesis, and approval requests.
- Source-aware code review and source-blind runtime proof are different controls. Use a fresh source-aware reviewer for critical fixes, then a fresh `behavior-validator` for observable behavior when applicable.

## Review And Fix Loop

1. Rehydrate the exact Git root, revision/PR/diff, dirty state, runtime target, project policy, build/test commands, and affected WordPress surfaces.
2. State the mode, scope, user journey or trust boundary, target standard/budget, and exclusions. For changed-scope reviews, inspect enough call sites and consumers to avoid local-only conclusions.
3. Gather evidence before findings. Trace behavior from entry point through decision, data owner, side effect, and observable outcome. Label an unproved concern as a hypothesis, not a defect.
4. Report findings first, ordered by severity, with absolute file/line or runtime evidence, realistic impact, root cause, compatible remediation, and proof required.
5. When fixing is requested, protect current behavior with characterization or negative proof when practical, make the smallest root-cause change, and add proportional regression coverage. Do not suppress tools, weaken checks, or hide symptoms.
6. Rerun the narrowest reliable checks, then the affected integration/runtime path. Compare before/after evidence where the mode requires it.
7. For `P0`/`P1`, release-critical, migration, or public-contract fixes, require a fresh source-aware re-review of the changed code and evidence before passing the gate. Add separate source-blind behavior proof when the claim is observable at runtime.
8. Run a finish pass for adjacent risks, tests, docs, dead/debug code, and release impact. Preserve scope; route validated adjacent findings through the existing issue protocol.

## Evidence And Severity

- `P0`: active exploitation, destructive data loss, or production-wide availability failure.
- `P1`: credible privilege/data exposure, release-blocking regression, critical workflow inaccessibility, or scale failure.
- `P2`: material but bounded user, operational, maintainability, or compliance risk.
- `P3`: justified improvement with low immediate impact.

A finding needs an observable or code-path cause, not style preference. A fix is not complete until its original failure clause is rerun. Never claim “secure,” “fast,” “accessible,” or “maintainable” from a single tool score.

For release-critical or formal multi-mode work, materialize the compact JSON contract defined by `../shared/schemas/wp-quality-review.schema.json` and run:

```bash
node wp-quality-reviewer/scripts/validate-review-report.mjs path/to/quality-review.json
```

## Drift And Correction Guard

- At the start and end of every run, restate `Mode`, `Scope/revision`, `Target`, `Evidence`, `Disposition`, and `Proof gaps`.
- Do not silently switch from review to feature expansion, from a changed-scope review to a repo-wide claim, or from runtime evidence to code-only inference.
- If owner evidence contradicts a pass, reopen the exact failed clause, correct the cause, rerun proof, and add a regression scenario or durable project rule when repeatable. Do not stop at an apology.
- Product-specific truth belongs in repo docs/issues. Cross-product corrections require duplicate screening and the governed skill-learning path.
- Unresolved `P0`/`P1`, missing required identity, or an unverified claimed fix makes the result `fail` or `blocked`, never `pass`.

## Output

Reviews: findings first, then scope, checks performed, proof gaps, and recommended fix order.

Fixes: resolved findings, changed files, before/after or negative proof, validation results, residual risk, and any safely deferred issue.
