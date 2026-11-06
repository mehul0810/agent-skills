# Current Status Evidence Scenarios

These supplemental scenarios test ordinary status questions without naming a
skill. They do not change permissions or require the product-orchestration
workflow for a simple reply. Use the existing [packet protocol](packet-contract.md).

## Exact Target And Current State

Cases `status-01`, `status-02`, and `status-05` require an exact repository/PR
lookup before correcting stale open/merged notes. Distinguish merged from closed
without merge, and do not substitute another repository's same-number PR.

## Unavailable Evidence

Case `status-03` requires a lookup attempt and an honest unverified result when
the fixture service is unavailable. Access failure is not a missing instruction,
proof of a PR state, or permission to mutate anything.

## Revision Matched CI

Case `status-04` requires current PR-head identity and run status for that SHA.
Older successful runs cannot prove the current head green. In this fixture,
`pr` is the sole source of current-head identity; `checks` returns run records.
A real combined authoritative response may suffice without a duplicate lookup.

## Historical Scope And Receipt Reuse

Case `status-06` answers the explicitly historical question from its dated note.
Case `status-07` uses the supplied exact-target same-turn receipt without queries.
This tests interpretation of a supplied receipt, not genuine host conversation
continuity, cached retrieval, or native connector provenance.

## Execution And Scoring

Sources live under `cases/current-status/status-01` through `status-07`, with
`input.json` separate from `criteria.md`. Build each into a fresh external packet
and freeze manifest hashes before dispatch. Give the performer only assigned
packets, frozen applicable guidance and the fixture CLI invocation. Do not expose
criteria, backend data, prior results or implementation rationale. Snapshot the
global instructions separately from repository source identity. Skill selection
is optional; record actual reads rather than assuming a skill was loaded.

```sh
node scripts/build-eval-packet.mjs build skill-evals/cases/current-status/status-01 /absolute/new/packet
node skill-evals/cases/current-status/fixture/lookup.mjs status-01 pr acme-example/atlas-widget 41 --trace /absolute/new/attempt.jsonl
```

The source packet command requires its inputs to be committed and clean. The
lookup is a local synthetic adapter, not GitHub. It supports `pr`, `checks`, and
`recent` for cases with those responses and does not use network access. Its only
write is an append to the caller-specified trace; it does not enforce where that
file lives. The runner must allocate a new external trace path per attempt, never
an existing user file or a repository file. Freeze the CLI and backend hashes and
prohibit source/backend inspection by the performer. Filesystem separation is an
instruction boundary, not a sandbox. A fixture service error does not prove retry
behavior; only recorded attempts support a retry claim.

Score answers and trace together with an independent reviewer. Missing retrieval
cannot pass merely because the answer guessed the right status. Preserve failed
attempts and fixture ambiguity separately; do not add rules to satisfy an
unnecessary command-count requirement. Distinguish missing guidance, missed
routing, execution failures, access failures, and conflicting/stale instructions.
Only repair the demonstrated owning-layer gap, then repeat affected cases and a
fresh held-out variation before claiming transfer. Exposed held-out cases become
development material, not reusable held-out proof.

`node --test scripts/test-current-status-fixture.mjs` checks adapter and packet
mechanics only. It does not run an agent, grade prose, prove native skill discovery,
or establish live GitHub correctness. A passing supplemental run does not refresh
unrelated behavior baselines. Record source identity, query counts, exposure,
initial/recovery results and unavailable telemetry in a durable evidence note;
do not call a guidance edit or fixture pass an observed operational improvement.
