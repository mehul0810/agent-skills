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

Specialists extend it with plugin hooks/services/surfaces/data/upgrades; theme tokens/templates/patterns/blocks/editor precedence/responsive output; or site journeys/content/theme/plugins/forms/analytics/publishing/conversion.

## Project Knowledge Gate

Before substantial implementation, inspect existing repo docs, code, Git/GitHub state, runtime configuration, and current proof. Build a small doc-gap matrix:

| Missing knowledge | Decision it changes | Existing evidence | Required doc/equivalent | Blocking question |
|---|---|---|---|---|

Use equivalent existing documents instead of enforcing filenames. Create only justified contracts:

- `AGENTS.md`: workflow, authority, environment, validation; `PRODUCT.md`: users, outcomes, principles, claims, non-goals.
- `ARCHITECTURE.md`/ADRs: owners, dependencies, contracts, states, failure/migration/rollback.
- `DESIGN.md`: tokens, components/states, responsive/accessibility/editor/brand rules; `CONTENT.md`: IA, page purpose, ownership, blocks, claims, search, links, publishing.
- `TESTING.md`: commands, fixtures, environments, golden proof/gaps; `RELEASE.md`: version/branch/package/approval/deploy/rollback/reconciliation.
- `COMPATIBILITY.md`: material runtime/editor/integration matrix; `SECURITY.md`: disclosure, supported versions, sensitive handling, trust boundaries; `OPERATIONS.md`/`RUNBOOK.md`: critical signals, thresholds, observation, recovery, ownership.

Do not generate placeholder policy from guesses. Prefer repository or runtime evidence over asking the owner to repeat discoverable facts. Use one decision brief with at most three unanswered questions, and include the recommended answer, implementation impact, and safe default for each. Ask a second round only when the answer or new evidence exposes a new hard boundary.

Pause only at unanswered ownership, public contract, data/security/privacy, release, editing, design, or proof boundaries; continue safe discovery. After answers, update required docs through the approved workflow, reconcile, and proceed. Volatile compatibility/security/operations contracts need owner, evidence, and last-verified condition; supersede stale rules.

Tiny changes do not require documentation churn when existing evidence already closes the affected graph.

## Deterministic Manifest

For substantial cross-boundary, migration, release-critical, or repeatedly failing work, materialize the compact graph as JSON using the bundled `shared/schemas/wordpress-engineering-graph.schema.json` and run from the agent-skills root:

```bash
node wp-expert/scripts/validate-engineering-graph.mjs <graph.json>
```

Schema v2 makes acceptance and invalidation explicit. Give each acceptance criterion one intent node and one or more verified proof nodes. Verified critical nodes use a `sha256:` fingerprint and record the current fingerprint of every dependency; changing an upstream fingerprint invalidates downstream proof until it is rerun. Evidence identities use typed fields such as full `revision`, `packageSha256`, `runId`, `environment`, `actor`, `viewport`, or `dataFixture`, not arbitrary labels. When evidence points to a local immutable file and includes `fingerprint`, the validator checks the file bytes.

The validator first runs the canonical JSON schema, then semantic checks. For release/elevated graphs, add a root `source` (repository, revision/package when known, environment, and observed time) and make critical proof identities agree with it; critical proof also records observed time, trust, and privacy class, while critical regression proof includes a run ID and environment. Use `requiredNodeTypes` when the task needs an explicit owner/artifact/runtime chain. A syntactically valid SHA or URL is not proof of the right repository, candidate, package, environment, freshness, trust, or privacy class; verify those relationships from the live owning source and retain only compact pointers.

The validator rejects orphaned nodes, missing dependencies, critical unresolved states, conflicting exclusive owners for the same resource, stale dependency fingerprints, acceptance criteria without verified proof, fabricated identity fields, byte-mismatched local evidence, and verified outcomes without upstream proof. Keep the manifest in the issue/PR evidence path or a governed temporary artifact; do not commit one for every tiny change.

Graphs without a learning event need no learning node. A learning chain is `intent -> failed observation -> verified correction -> evidenced regression proof -> reviewed learning -> verified outcome`. Regression proof needs `proofKind: regression` and run identity; learning directly depends on it and records a verified destination and reviewer. Generic passing checks or chat notes do not close learning.

## Closure Gate

Work is not complete when a node lacks intent/proof; mutable owners conflict; a critical edge is unresolved; proof uses the wrong commit/package/environment/role/viewport/data; docs/claims disagree with runtime; or frontend-only CSS hides an owning visual/editor failure.

Every acceptance criterion must map to proof in `acceptanceCriteria`. Re-run affected downstream proof after changing an upstream node; update its fingerprint only from the newly verified artifact, never to silence the validator. One mutable resource has one exclusive owner unless shared ownership is explicit and its coordination contract is evidenced.

When `enterprise-code-quality-gate.md` classifies runtime assurance as material, reconcile the graph with `enterprise-runtime-assurance.md` before closure.

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
