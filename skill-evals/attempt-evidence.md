# Attempt-aware draft evidence

Use `node scripts/eval-feedback-loop.mjs preflight --receipt PATH` with an opt-in
schema-v2 receipt for a new evaluation. Schema-v1 receipts and historical harness
records remain unchanged; their first-attempt history is **unavailable**, not an
inferred first-pass success. This extension never changes dependency pins, model
policy, runtime settings or baseline admission.

## Freeze before dispatch

Use the existing [blind packet contract](packet-contract.md). Freeze candidate
identity, packet manifest hashes, all required checks, and required capture
viewports/states before the performer starts. A separate author supplies a fresh
unseen brief for held-out work. Keep scoring criteria, earlier results and
implementation rationale outside the performer's context. Actual instruction
reads belong in the activation evidence; configured route manifests alone do not
prove loading. A performer may discover the owning reference rather than receive
all references preloaded.

Compare direct-tool, standalone-agent and target-harness execution with separate
receipts over the same frozen corpus and checks. Do not mix lanes or targets in
one attempt history. If the corpus, source revision or required checks change,
freeze a new receipt and retain its predecessor. Never overwrite a failed attempt.
A corrected identifier, extra prompt, retry, resume or repair after the first
response is a recovery attempt. If a held-out case informs a change, it becomes
development material; a replacement unseen case is needed for transfer claims.

## Receipt fields

Schema-v2 retains `status: "draft"`, `baseline`, exact `testedRevision`, and
`evaluation` from schema v1. Use `caseUsage: "development"` or `"held-out"`, an
explicit `requiredCaptures` array (empty for non-visual tasks), and `attempts`.
Checks live inside each attempt, not at the top level.

Each attempt has:

- `id`: unique within this receipt; `kind`: `initial` for the first, `recovery`
  thereafter. Array order is execution order.
- `checks`: the complete existing schema-v1 check/case mappings and hashes. Every
  attempt covers the same frozen check/case/packet-manifest set. Mark missing work
  `incomplete`; a focused recovery cannot erase earlier missing checks.
- `turnCount`: observed positive integer, or `null` when unavailable. A count is
  not token/cost telemetry. Optional `evaluation` overrides identity/exposure for
  a new performer/scorer while preserving the existing distinct-actor checks.
- `runtime`: `lane` (`direct-tool`, `standalone-agent`, `target-harness`), exact
  `targetId`, `activation`, `renders`, and `completion`.

An observation (`activation` or `renders`) has `status: "observed"` plus an
`evidence` file reference, or `status: "unavailable"`, `"unrun"`, or `"blocked"`
with a concrete `reason` and no evidence claim. A file reference is
`{"path":"/private/local/file","sha256":"<64 hex characters>"}`. Relative paths
stay within the repository; symlinks and missing files fail. File reads are bounded
and shared within one preflight snapshot, including packets and all attempts;
references are rechecked against their expected hashes.

Observed evidence is JSON with `kind`, `attemptId`, `targetId` and exact
`sourceRevision` matching the receipt/attempt:

- `kind: "skill-activation"`: `observer` is `host-trace` or `evaluator-log` and
  `loadedFiles` is an array of file references to the bytes actually
  read, and `trace` is a file reference to the non-empty raw tool/host log for
  independent inspection. An empty loaded-file list records observed non-activation. An
  evaluator reading a skill manually is useful evidence, but cannot satisfy
  target-harness activation. No host trace means unavailable native activation.
- `kind: "rendered-artifact"`: `captures` must cover every required capture
  exactly once for accepted completion; failed attempts may preserve partial
  captures. Each has `id`, viewport `width`/`height`, `state`, `artifact`
  (source file reference), and `image` (PNG file reference). `requiredCaptures`
  contains those first four fields. Include small-height desktop, mobile, and
  task-relevant interaction/recovery states. PNG header checks bind an image file;
  they do not decode the full image or establish render quality, truthful content,
  capture provenance, readable lower content, structural diversity or native authoring.
- `kind: "completion"`: `acceptedBy` must match the independently recorded scorer,
  `result` is `accepted`, and `artifacts` contains the final file references that
  were accepted. Every rendered source must appear with the same file identity and
  hash in this accepted set. Inspect those artifacts and the original result before signing
  this record; an agent's success message alone is not authoritative completion.

`completion` has `status: "accepted"` and an `evidence` reference to the completion
record. Acceptance requires all checks to pass and all required captures to be
present. A target-harness acceptance also requires host-trace activation evidence.
Otherwise use `rejected`, `incomplete`, `blocked` or `unrun`, with a reason and no
acceptance evidence. A lost acknowledgement or unresolved side effect remains
incomplete until the actual adapter reconciles it; this validator never retries
an action or claims exactly-once execution.

## Reading the result

Preflight returns the first and final attempt separately, every retained attempt,
`recoveryAssisted`, and observed `totalTurns` (null if any count is unavailable).
`heldOutTransferEligible` is only true for declared held-out, first-attempt accepted
work. It is an eligibility check, not proof of blindness or generalization. The
summary must still disclose sample size and what the independent scorer observed.

A `complete` v2 draft has target-bound accepted local artifact evidence; `failed`
and `incomplete` remain distinct. `admission` is always `not-performed`. Hashes
prove supplied local-byte identity, not the honesty of a host/scorer, true skill
activation, authorization, remote state, screenshot provenance or semantic quality.
Use existing visual/native proof contracts for stronger claims and the established
sanitized record workflow for baseline admission. Missing native tools, context
telemetry or real retry adapters remain blocked/unrun, never simulated passes.
