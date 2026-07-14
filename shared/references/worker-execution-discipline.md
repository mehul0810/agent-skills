# Worker Execution Discipline

Use this for direct specialist work in `wp-plugin-expert`, `wp-theme-expert`, and `wp-site-expert`. It closes the gap between high-level orchestration discipline and day-to-day worker execution.

## Goal

Make direct worker turns behave predictably: inspect the right thing first, choose the right proof level, recover from common blockers, avoid hidden assumptions, and finish with a bounded quality sweep instead of either scope creep or shallow completion claims.

Workers operate inside the task loop. They execute one bounded spec from the parent CTO or PO, gather validation/proof, and return a final summary. They do not own roadmap, milestone, release, pricing, licensing, privacy/security posture, public contract, merge, publish, issue-closure, or thread-cleanup decisions unless the parent explicitly granted a safe non-hard-gated action.

Before command or CI mutation, use `command-ci-approval-boundary.md`. Run safe inspection and quality checks without needless owner blocking, but treat runtime allowlists as capability only and preserve stricter parent/repository authority.

## Direct Task Decision Contract

Before implementing, reviewing, or answering:

1. Inspect the exact referenced artifact first: exact file, issue, PR, page, screenshot, route, branch, or error before broad repo scans.
2. Confirm the ownership boundary: plugin, theme/FSE, site, content, or orchestration.
3. State the changed boundary: code path, UI surface, data contract, release metadata, or runtime behavior.
4. Choose the cheapest proof level that reaches that boundary: diff, static, runtime, editor, frontend, external, or release.
5. If two or more materially different implementations are viable, stop and surface the contract decision instead of guessing.

## Assumption And Confidence Gate

Do not proceed on silent assumptions when any of these are true:

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

Never invent WordPress hooks, blocks, supports, REST behavior, package APIs, CLI flags, vendor features, issue/PR state, compatibility, design values, assets, links, screenshots, or validation results.

- Verify project behavior in current code, tests, configuration, or runtime evidence.
- Verify uncertain WordPress or vendor contracts in installed source or current official documentation.
- Label visual values as supplied, measured, or inferred.
- Separate confirmed fact, inference, and unresolved uncertainty in plans and reports.
- Match every completion claim to the proof actually gathered; an unrun check is a proof gap, not a pass.

## Owner Correction To Learning

When the owner says the result or process is wrong, fix the immediate scoped state when safe, classify the failure, and decide whether it reveals a repeatable missing gate. Route repeatable product-specific lessons to repo docs/issues and cross-product lessons through `self-improvement-loop.md`; add or update an eval. Do not add a new rule when existing guidance already covers the failure: correct routing or enforcement instead.

## Worker Recovery Ladder

If a direct task is blocked, recover in this order before declaring failure:

1. Recheck the exact artifact and changed boundary.
2. Switch to the cheapest proof that can still validate the claim safely.
3. Use read-only mapping of nearby files, tests, docs, routes, templates, or CI config to narrow the blocker.
4. Use the repo's available local validation instead of waiting for a broader unavailable gate.
5. If runtime/browser proof is blocked, gather the strongest safe fallback evidence and state the exact remaining proof gap.
6. If the blocker is real, report the exact blocker, impact, attempted recovery, and next safe action.

Do not stop at "blocked because tool X failed" when code mapping, static validation, targeted tests, release metadata review, or proof-gap reporting can still move the task forward.

## Finish Pass

Before calling direct worker work done, run a bounded finish pass around touched files and affected behavior:

- tests: missing happy-path, failure-path, permission, or regression coverage,
- docs or release metadata: readme, changelog, screenshots, or inline operator notes when relevant,
- dead or duplicate code: stale compatibility shims, commented-out code, repeated logic, debug helpers,
- UX/proof drift: screenshot/proof gap when the change is design-visible,
- adjacent findings: separate anything real but out of scope through `adjacent-finding-protocol.md`.

The finish pass is a narrow check around the changed boundary, not an excuse to broaden scope.

## Blocker Reporting

If work still cannot proceed, report blockers in owner-usable form:

```text
Blocker
- Exact blocker: <file/entity/tool/env decision>
- Impact: <what cannot be proven or changed>
- Attempted recovery: <steps already tried>
- Next safe action: <what Codex can still do or what decision/access is needed>
```

## Completion Rule

Do not say work is done until the direct-task contract, proof level, finish pass, and residual risk are all aligned with the actual evidence gathered.
