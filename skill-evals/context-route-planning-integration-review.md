# Context Route Planning Integration Review

## Scope

This review binds the `agent-skills` consumer upgrade from the historical
`agent-harness` revisions `4fa28f5a6c646dedde4f616dec8ae533df42f5ee` and
`e99c9e29c1d58c23ff1ac656040e289ea321d493` to the merged revision
`fe1fe276ca5027b4407ef34334fd41317027c471`.

The upgrade adds the additive `plan-context` command and library export. Existing
configuration validation, run-record validation, initialization, exit codes, and
path-safety contracts remain in their owning harness test suite. Historical skill
behavior records retain their original harness revisions; the compatibility
receipts do not relabel or replace those runs.

The `context-approach-continuity` and `scoped-review-workflow` records predated
the explicit baseline-level `harnessContract` field. Their tested revisions pin
the same `e99c9e2` CLI validation runtime and their registered records already
pass its closed run-record contract. This migration labels that existing
dependency boundary as `cli-validation-v1`; it does not change their source,
scenario, checks, timestamps, result, or runtime revision.

## Consumer Proof

The installed validation dependency fingerprint is
`db6e466fd4fd9cc62c39d9ba79b89cfc6fcfe07d507220242ff94853e4e82319`.
It covers the closed `cli-validation-v1` file set defined by
`scripts/harness-runtime-fingerprint.mjs`.

The consumer exposes three bounded entry points:

- `npm run context:development` selects `Plugin architecture`.
- `npm run context:marketing` selects `Content research`.
- `npm run context:business` selects `Product value decision`.

Each command returns only ordered source paths, per-file word counts, total route
use, and headroom. Word counts are context-planning proxies, not measured token
savings. Additional files remain task-driven and are not authorized by the
manifest itself.

## Verification

The three consumer routes completed with these deterministic manifests:

- Development: 1,704/2,700 words across two files.
- Marketing: 2,295/2,900 words across three files.
- Business: 591/900 words across one file.

The repository full gate passed, including harness dependency compatibility,
references and domain audits, behavior records, evidence validation, quality
validation, and install-link proof. The focused behavior-evidence audit,
runtime-fingerprint regression, shell syntax validation, and Git whitespace
validation also passed. Existing low-headroom warnings remain warnings and are
not represented as token savings.
