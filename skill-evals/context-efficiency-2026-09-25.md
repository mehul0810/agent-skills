# Context And Validation Efficiency

## Scope And Boundaries

Starting skills revision: `09347763ab32359286de6f6379c6be380a47de01`.
This change targets repeated validation I/O and duplicate context manifests,
not model reasoning, authority, skill expertise, or quality thresholds.

Historical scenario blobs may be reused only inside one audit invocation after
their existing type, path and size checks. Cache storage is bounded; current
working-tree files and subsequent audits are read afresh. Evidence decisions,
freshness, commit reachability and source/record identities remain checked.

The context bundle uses the installed harness's existing `planContext` API.
Explicit selected routes retain their individual diagnostics and budgets, with
one shared file manifest and route provenance. Any failed route makes the bundle
incomplete. Word-count deduplication is not measured token savings, automatic
context loading, a combined context-window guarantee, or native model behavior.

## Cross-Repository Review

Read-only inspection covered `agent-loop` at `cff5cd1`, `agent-book` at `afb1163`,
`agent-decide` at `f7b85a5`, and harness source at `3326bf0`. No sufficiently
evidenced efficiency fix was found in the loop/book/decide paths reviewed.
Removing their freshness, attention or validation checks would weaken quality.
Potential GraphQL query consolidation needs its own measured equivalence proof.
Those repositories, the installed harness pin, global policy and model allocation
are unchanged by this work. Shared tooling is reused rather than copied there.

The separate harness-runtime migration and native-artifact/live-feedback proof
remain outside these deterministic efficiency claims. No historical behavior
record is relabeled to justify an optimization.

## Context Manifest Checks

On the current checkout, `Product video editing` plus `Product video story and
editing` totals 5413 words by separate route sums but 3237 words across three
unique files: 2176 overlapping words. `Site native design authoring` plus `Site
frontend taste` totals 5172 versus 4547 words across four unique files: 625
overlapping words. These are deterministic manifest counts, not observed model
consumption. Combined files still need task-appropriate selection and actual
runtime headroom; passing individual route budgets does not create a combined
context-window guarantee.

Eleven fixture tests cover deduplication, invalid inputs, unsafe/missing paths,
budget failures, mixed successful/failed routes, changed files, independent
roots, consistency and output boundaries. The new check is in the aggregate.
Independent review also ran the existing evidence/scenario regression checks
and found no blocking issue. The manifest is intentionally not an atomic
filesystem snapshot and cannot detect all concurrent content mutations.

## Audit Measurement

A same-checkout comparison with a PATH Git-call wrapper measured 1351 subprocesses
for the starting implementation versus 364 for the optimized auditor (987 fewer,
73.1%). Historical scenario-read commands fell from 1077 to 90. Both runs passed.
No separate wall-clock or model-token saving was measured. Repeated raw source
reads remain deliberately unchanged to preserve their existing buffer/type behavior.
An independent parent comparison deep-compared complete old/new audit results at
one fixed observation time: all 24 evidence lines matched exactly, with no errors.

The cache has a 64 MiB retained-byte limit and a 256-entry limit. Regression checks
exercise repeated historical reads, current worktree changes, different commits,
repository isolation and rejection of a foreign read context. The public digest
function retains its original four-argument interface.

The full local aggregate passed. After adding config-path provenance, the affected
bundle suite passed all 11 tests; unrelated aggregate evidence was retained.
