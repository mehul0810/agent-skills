# WordPress Engineering Graph

Use this contract when plugin, theme, or site work crosses ownership, runtime, data, editor, proof, release, or public-claim boundaries; when project knowledge is missing or contradictory; or when a failure must become durable learning. Do not load it for an isolated, fully specified low-risk edit.

## Compact Graph

Model only the nodes needed for the task:

`intent -> owner -> artifact -> runtime state -> proof -> release or public outcome`

Failures loop back through:

`failed edge -> owning cause -> correction -> regression proof -> durable learning`

Use a compact table in the issue, plan, PR, or evidence artifact:

| Node | Owner/source | Depends on | Invariant | Evidence | State |
|---|---|---|---|---|---|

States are `verified`, `provisional`, `unknown`, `failed`, or `not applicable - reason`. Keep the graph bounded to changed and risk-adjacent nodes; do not inventory the whole product.

## Common Nodes

- Intent: user outcome, acceptance criteria, non-goals, release state.
- Ownership: plugin, theme, page/post content, pattern, block, Site Editor record, option/meta/table, external service, or workflow.
- Artifact: code, `theme.json`, template/part, saved block tree, content, asset, schema, configuration, package, or documentation.
- Runtime: actor/role, request or editor flow, state transition, failure path, cache, environment, active versions, and database overrides.
- Proof: static, unit, integration, editor, browser, accessibility, performance, security, package, or public verification.
- Outcome: shipped behavior, documentation, supportability, public claim, measurement, rollback, and owner acceptance.

Specialists extend the same graph:

- Plugin: bootstrap/hooks, service boundaries, REST/CLI/admin/editor surfaces, data contracts, dependencies, compatibility, and upgrade paths.
- Theme: design tokens, templates, parts, patterns, blocks, editor ownership, Global Styles/Site Editor precedence, responsive states, and frontend output.
- Site: journeys, pages, content sources, active theme/plugins, available blocks, forms, analytics/SEO, publishing workflow, environment, and conversion outcome.

## Project Knowledge Gate

Before substantial implementation, inspect existing repo docs, code, Git/GitHub state, runtime configuration, and current proof. Build a small doc-gap matrix:

| Missing knowledge | Decision it changes | Existing evidence | Required doc/equivalent | Blocking question |
|---|---|---|---|---|

Use an existing equivalent document instead of enforcing filenames. Create or update only the minimum durable contracts justified by the project:

- `AGENTS.md`: workflow, branch/base, authority, local environment, validation, and contribution rules.
- `PRODUCT.md`: users, outcomes, principles, boundaries, supported claims, and non-goals.
- `ARCHITECTURE.md` or ADRs: owners, dependencies, data/public contracts, state transitions, failure behavior, migrations, and rollback.
- `DESIGN.md`: design tokens, components, states, responsive/accessibility rules, editor experience, brand, screenshots, and visual non-goals.
- `CONTENT.md`: site IA, page purpose, editorial ownership, blocks/patterns, claims, SEO/AEO/GEO, links, and publishing workflow.
- `TESTING.md`: fast/full/package commands, fixtures, environments, golden workflows, evidence, and proof gaps.
- `RELEASE.md`: version/branch/package process, approval gates, metadata, deployment, rollback, and reconciliation.

Do not generate placeholder policy from guesses. Ask only the unanswered questions that can materially change implementation, with at most three grouped questions per batch. Prefer repository or runtime evidence over asking the owner to repeat discoverable facts. If an unanswered item changes ownership, public contracts, data/security/privacy, release behavior, editing surface, design direction, or acceptance proof, pause implementation at that boundary while continuing safe discovery. After answers, create or update the required docs through the repo's approved issue/PR/direct-change workflow, reconcile the graph, then proceed.

Tiny changes do not require documentation churn when existing evidence already closes the affected graph.

## Closure Gate

Work is not complete when:

- a changed node has no upstream intent or downstream proof;
- two mutable sources claim the same visible behavior or decision;
- a critical edge is `unknown`, `provisional`, or `failed`;
- proof came from the wrong commit, package, environment, role, viewport, or data state;
- diagnostics, documentation, or public claims describe behavior different from the runtime result;
- a visual or editor failure was hidden with frontend-only CSS instead of repairing its owning node.

Every acceptance criterion must map to proof. Re-run affected downstream proof after changing an upstream node.

## Learning Loop

When proof or owner review exposes a mistake:

1. Identify the exact failed node or edge and highest owning cause.
2. Correct safe in-scope state; preserve evidence of the failure.
3. Add the smallest regression proof that would have caught it.
4. Route adjacent work through `adjacent-finding-protocol.md`.
5. Put reusable project truth in the relevant repo doc or ADR; put actionable debt in a duplicate-screened issue.
6. Promote a repeated cross-project behavior gap through `self-improvement-loop.md`; do not silently mutate shared skills from one occurrence.
7. Re-run graph closure and record the verified outcome.

Do not end at “I made a mistake” or retain the lesson only in chat.

## Output

Report the compact graph, missing-doc decisions and questions, created or updated durable artifacts, failed/repaired edges, proof, remaining unknowns, and next safe boundary.
