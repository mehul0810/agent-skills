# WordPress Engineering Graph

Use when plugin, theme, or site work crosses ownership, runtime, data, editor, proof, release, or public-claim boundaries; knowledge is missing/contradictory; or failure must become durable learning. Skip isolated, specified low-risk edits.

## Compact Graph

Model only needed nodes:

`intent -> owner -> artifact -> runtime state -> proof -> release or public outcome`

Failures loop through:

`failed edge -> owning cause -> correction -> regression proof -> durable learning`

| Node | Owner/source | Depends on | Invariant | Evidence | State |
|---|---|---|---|---|---|

States: `verified`, `provisional`, `unknown`, `failed`, or `not applicable - reason`. Bound the graph to changed and risk-adjacent nodes.

Common nodes are intent/acceptance; plugin/theme/page/pattern/block/data/service/workflow ownership; code/template/content/asset/schema/package/docs artifacts; actor/request/editor/state/failure/cache/environment runtime; static/test/editor/browser/accessibility/performance/security/package proof; and shipped behavior, claims, measurement, rollback, and acceptance outcomes. Specialists extend only their owned boundaries.

## Project Knowledge Gate

Inspect repo docs, code, Git/GitHub, runtime config, and proof before substantial work.

| Missing knowledge | Decision changed | Existing evidence | Required doc/equivalent | Blocking question |
|---|---|---|---|---|

Use equivalent existing docs; create only justified contracts:

- `AGENTS.md` workflow/authority/environment/validation; `PRODUCT.md` users/outcomes/principles/claims.
- `ARCHITECTURE.md`/ADRs owners/contracts/failures/migration; `DESIGN.md` tokens/components/states/responsive/accessibility/editor/brand.
- `CONTENT.md` IA/purpose/ownership/blocks/claims/search; `TESTING.md` commands/fixtures/environments/golden proof.
- `RELEASE.md` version/branch/package/approval/deploy/rollback; `COMPATIBILITY.md`, `SECURITY.md`, and `OPERATIONS.md` only when their risks are material.

Do not generate placeholder policy from guesses. Discover facts before asking. Use one decision brief with at most three unanswered questions, each with recommended answer, implementation impact, and safe default. Pause only at unresolved ownership, public contract, data/security/privacy, release, editing, design, or proof boundaries; continue safe discovery. Volatile contracts need owner, evidence, and last-verified condition. Tiny changes need no doc churn when evidence already closes the graph.

## Deterministic Manifest

For cross-boundary, migration, release-critical, or repeatedly failing work, create JSON against `shared/schemas/wordpress-engineering-graph.schema.json` and run:

```bash
node wp-expert/scripts/validate-engineering-graph.mjs <graph.json>
```

Schema v2 gives each acceptance criterion an intent and verified proof. Verified critical nodes use `sha256:` fingerprints and current dependency fingerprints; upstream changes invalidate downstream proof. Use typed identity such as revision, package digest, run ID, environment, actor, viewport, or fixture. Local-file fingerprints are byte-checked.

Every deterministic graph declares `assuranceLevel`: `baseline`, `elevated`, or `release`. Use `release` for release candidates and `elevated` for other high-risk work. Both require root source identity: repository, revision or package digest, environment, and observation time. Align critical proof to that source; critical regression proof also needs run ID/environment. The validator rejects absent assurance, missing/mismatched source identity, orphaned nodes, unresolved critical states, owner conflicts, stale dependencies, unproved acceptance, fabricated evidence, and outcomes without upstream proof. Store compact evidence pointers; a syntactically valid SHA/URL alone does not prove identity, freshness, trust, or privacy.

Graphs without a learning event need no learning node. A learning chain is `intent -> failed observation -> verified correction -> evidenced regression proof -> reviewed learning -> verified outcome`; learning depends on regression proof and names verified destination/reviewer. Passing checks or chat notes do not close it.

## Closure And Learning

The Closure Gate fails for missing intent/proof, owner conflicts, unresolved critical edges, wrong identity/environment, runtime-doc disagreement, or frontend CSS hiding an owning editor/visual failure. Map every acceptance criterion to proof; after upstream change rerun downstream proof rather than changing fingerprints to silence validation. Shared mutable ownership needs an evidenced coordination contract.

When proof or owner review exposes a mistake:

1. Identify the failed node/edge and highest owning cause.
2. Correct safe in-scope state and preserve failure evidence.
3. Add the smallest regression proof that would catch it.
4. Route adjacent work through `adjacent-finding-protocol.md`.
5. Put reusable project truth in repo docs/ADR and debt in a duplicate-screened issue.
6. Promote repeated cross-project gaps through `self-improvement-loop.md`, never silently from one occurrence.
7. Re-run closure and record the verified outcome.

Reconcile material runtime assurance with `enterprise-runtime-assurance.md`. Do not end at “I made a mistake” or retain learning only in chat.

## Output

Report graph, missing-doc decisions/questions, durable artifacts, failed/repaired edges, proof, unknowns, and next safe boundary.
