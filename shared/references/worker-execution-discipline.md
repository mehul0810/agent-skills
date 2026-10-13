# Worker Execution Discipline

Use for direct work in `wp-plugin-expert`, `wp-theme-expert`, and `wp-site-expert`.

## Goal

Workers inspect first, choose proportionate proof, recover blockers, surface assumptions, and finish with a bounded quality sweep, avoiding scope creep and shallow claims.

Direct specialists follow the user's scope; delegated workers follow the parent spec. Establish authorized outcome, exclusions, proof, and stop condition once. Direct work needs no parent task. Continue safe implementation/in-scope repair through validation, not just a first draft. Neither path grants roadmap, release, pricing, privacy/security, public-contract, merge, publication, or cleanup authority beyond current permissions.

Before command/CI mutation, use `command-ci-approval-boundary.md`. Run safe inspection/checks without needless blocking; allowlists grant capability only, and stricter parent/repo rules prevail.

## Direct Task Decision Contract

For implementation/consequential review:

1. Inspect the exact artifact (file, issue, PR, page, screenshot, route, branch, error) before broad scans.
2. Confirm ownership: plugin, theme/FSE, site, content, or orchestration.
3. Name changed boundary: code path, UI, data contract, release metadata, or runtime behavior.
4. Choose cheapest proof reaching it: diff, static, runtime, editor, frontend, external, or release.
5. Choose a reversible implementation within scope. Ask only if missing facts materially change scope, correctness, ownership, or contract; multiple viable approaches alone are not blockers.

Keep routine planning brief/internal; use outcome, constraints, AC, and proof, not examples as mandatory steps. Load unresolved domain guidance only and reuse existing plans/proof. Substantial architecture, data, security, release, and ambiguous visual work need explicit contracts.

### Material Approach Choice

For material choices, compare the smallest complete solution with a credible alternative, including no change. Consider user/business outcomes, constraints/authority, source confidence, ownership/dependencies, compatibility/migration, security/privacy, reliability/concurrency, performance, editor/accessibility, operations/rollback, maintenance, cost, and proof. Skip immaterial factors for tiny safe edits.

Use the cheapest check that can change the choice. Record tradeoff, rejected option/reason, failure/rollback path, and reversal evidence/trigger; preference is not evidence. Put this decision record in the checkpoint before expansion/handoff, not hidden reasoning. Revisit only when constraints, dependencies, failures, or source facts change.

## Assumption And Confidence Gate

Do not silently assume when:

- the source of truth is ambiguous,
- the current task references a specific entity that has not been inspected directly,
- the implementation choice changes a public contract, editing contract, data shape, release surface, or security posture,
- the requested "done" claim would exceed the proof actually gathered.

When uncertainty remains, say it explicitly in this shape:

```text
Assumption/risk
- <what is still assumed>
- Impact: <why it matters>
- Safe path: <what can still be done now>
```

## Claim And Evidence Gate

Never invent WordPress hooks/blocks/supports, REST/package APIs, CLI flags, vendor features, issue/PR state, compatibility, design values, assets/links/screenshots, or validation results.

- Verify project behavior in current code, tests, configuration, or runtime evidence.
- Verify uncertain WordPress or vendor contracts in installed source or current official documentation.
- Label visual values as supplied, measured, or inferred.
- Separate confirmed fact, inference, and unresolved uncertainty in plans and reports.
- Match every completion claim to the proof actually gathered; an unrun check is a proof gap, not a pass.

## Compact Communication

Compress filler, not meaning. Preserve negation, conditions, uncertainty, scope, units, versions, and failed/unrun checks. Keep commands, IDs, paths, and quoted errors exact; do not invent abbreviations or broken grammar.

Explain approvals, destructive actions, ordered steps, ambiguity, or repeated questions. State action, consequence, prerequisites; brevity grants no authority or converts inference to fact. Keep required updates useful, not suppressed.

Chat may be compact. Docs, comments, commits, issues, reviews, and contributor messages retain professional context/courtesy. State each fact once; keep safety-critical detail, not a mandatory terse template.

## Owner Correction To Learning

When the owner says the result or process is wrong, fix the immediate scoped state when safe and return a compact correction result: mismatch, fix, evidence, repeatability, dedupe, privacy, destination or no-artifact reason, reviewer, verification trigger, and status. A worker emits a candidate only; it does not mutate shared skills or policy. Route product-specific candidates to the PO and cross-product candidates to the CTO/Skill PO. Load `self-improvement-loop.md` only when a durable candidate is confirmed. If existing guidance already covers the failure, correct routing or enforcement instead of adding another rule.

## Worker Recovery Ladder

If blocked, recover in order before declaring failure:

1. Recheck the exact artifact and changed boundary.
2. Switch to the cheapest proof that can still validate the claim safely.
3. Use read-only mapping of nearby files, tests, docs, routes, templates, or CI config to narrow the blocker.
4. Use the repo's available local validation instead of waiting for a broader unavailable gate.
5. If runtime/browser proof is blocked, gather the strongest safe fallback evidence and state the exact remaining proof gap.
6. If the blocker is real, report the exact blocker, impact, attempted recovery, and next safe action.

Do not stop at "blocked because tool X failed" if code mapping, static checks, targeted tests, metadata review, or proof-gap reporting can advance work.

## Finish Pass

Before completion, run a bounded finish pass on touched files/behavior:

- tests: missing happy-path, failure-path, permission, or regression coverage,
- docs or release metadata: readme, changelog, screenshots, or inline operator notes when relevant,
- dead or duplicate code: stale compatibility shims, commented-out code, repeated logic, debug helpers,
- UX/proof drift: screenshot/proof gap when the change is design-visible,
- adjacent findings: separate anything real but out of scope through `adjacent-finding-protocol.md`.

The finish pass is narrow, not scope expansion.

Stop after required checks pass; broaden/repeat only for changed inputs, failures, or named risk. Do not test trivial substitutions. Preserve required editor/frontend, accessibility, security, compatibility, and release proof; concise reports must disclose failed/unrun checks.

## Failed Visual Evidence Recovery

When screenshot/browser/editor proof finds an in-scope broken layout/workflow, mark `FAIL`, find/repair owning root cause, rerun the same proof, and check the smallest affected viewport/workflow regressions. Do not hand off safe recoverable errors or relabel observed failures as proof gaps.

After two unsuccessful repair/proof cycles, stop cosmetic tweaks; recheck assumptions, ownership, component constraints, architecture. Escalate only the blocking external dependency, unsafe contract, or inaccessible environment with failed evidence, attempts, and next path.

## Review Convergence Gate

Before review edits, freeze behavior, owner boundary, files, proof level. Classify findings as in-scope blocker, adjacent follow-up, or contract/owner decision. After two review-triggered edit cycles without convergence, reclassify all remaining findings. Continue only bounded blockers with clear proof; route follow-ups via `adjacent-finding-protocol.md` and escalate contract changes, not reviewer chasing or scope expansion.

## Blocker Reporting

If work still cannot proceed, report blockers in owner-usable form:

```text
Blocker
- Exact blocker: <approval, evidence, environment, scope or instruction conflict; cite controlling rule/source>
- Impact: <what cannot be proven or changed>
- Attempted recovery: <steps already tried>
- Next safe action: <what Codex can still do or what decision/access is needed>
```

## Completion Rule

Do not say work is done until the direct-task contract, proof level, finish pass, and residual risk are all aligned with the actual evidence gathered.
