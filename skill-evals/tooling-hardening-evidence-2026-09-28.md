# Eval Tooling Hardening Evidence

## Scope

This note records the eval feedback-loop receipt-cache, packet-reader, and config-planner hardening implemented on 2026-09-28. It does not refresh behavioral baseline source hashes or make runtime adoption claims.

## Findings And Changes

- Repeated receipt references reread and reverified identical packet/result files. The review finding recorded 250 reads for 50 repeated references. The feedback-loop regression now uses 50 references to one result and packet, verifies each unique packet once per invocation, hashes each result and packet component once, indexes result cases once, and caches bounded immutable-by-convention byte buffers only for that invocation. Every reference still compares its own result hash, packet manifest hash, packet id, case id, and packet revision against the snapshot.
- Cached verification failures are also scoped to one invocation. A later preflight rereads the files, so correcting a previously tampered packet is observed. Concurrent changes after a file's first read are intentionally observed by the next invocation, not midway through the current snapshot.
- Config-path changes previously invalidated every baseline. The path-only planner still does so. Only committed `--base/--head` planning may narrow config changes, after comparing exact merge-base and head bytes, validating both with the pinned harness config validator, and proving complete ownership through baseline file dependencies. Explicit config paths, global/unknown fields, invalid schema, and unmapped files fall back to every baseline.

## Reproducible Checks

Use Node.js 24, as required by `package.json`:

```bash
node scripts/test-eval-feedback-loop.mjs
node scripts/test-eval-packet.mjs
node scripts/test-validation-runner.mjs
node scripts/validate-behavior-run-records.mjs
git diff --check
```

The feedback-loop test creates a disposable Git repository under the OS temp directory. Its `main` branch diverges with a global config edit while `topic` changes a mapped route budget; the CLI must use the actual merge base and select only the mapped baseline. The same fixture verifies explicit `--file agent-harness.config.json`, global-field, unknown-schema, and unowned-file fallbacks. The test deletes its synthetic repository after completion.

The validation runner tests exercise process-group timeout escalation, an escaped
descendant that retains inherited pipes, final-drain failure reporting, bounded
output, invalid executables, and continuation after a thrown command error. The
escaped-process fixture records its own descendant PID and the test explicitly
SIGKILLs that test-owned process after checking that the runner reports cleanup
as unverified. No unrelated process is targeted.

The aggregate runner defaults are a 120-second command deadline, 16 MiB combined
stdout/stderr capture cap, 250 ms SIGTERM-to-SIGKILL grace, and 500 ms final
drain bound. On POSIX, only the validation command's process group is signaled;
processes that create a new session/group are not controlled. If streams remain
open after escalation, they are destroyed and the check fails with cleanup
unverified rather than hanging. The run-record batch calls the pinned harness
`validateRunFile` API before parsing a record for repository telemetry checks.

## Runner And Batch Measurement

Measured with Node v24.18.0 on the current 23 behavior run records. The CLI
comparison launched the pinned harness once per record, then parsed the same
record and applied the existing telemetry checks. The batch measurement called
the new validator once, which applies the same telemetry checks after each
successful `validateRunFile` result. Three sequential timings were:

| Method | Run 1 | Run 2 | Run 3 | Median |
| --- | ---: | ---: | ---: | ---: |
| CLI process per record | 968 ms | 874 ms | 884 ms | 884 ms |
| In-process batch API | 8 ms | 5 ms | 5 ms | 5 ms |

This is a local validation-throughput measurement for the existing fixture set,
not an end-to-end agent efficiency, quality, token, or user-outcome claim.

## Observed Operation Counts

The instrumented receipt fixture contains 50 references, one result file, one packet manifest, and two packet payload files. A successful preflight performs exactly 4 unique bounded file reads, 5 SHA-256 operations (result, raw packet-manifest receipt hash, packet digest, and two payloads), 1 packet verification, and 1 packet directory listing. Each unique path is read once. Mismatched per-reference result and packet-manifest hashes and packet ids still fail after the matching reference has populated the cache. Tamper-and-repair coverage confirms that a later invocation rereads and accepts corrected bytes.

The recorded pre-change review estimate was 250 reads over 50 repeated references. Static accounting for this regression's two-payload fixture gives 6 reads per reference before the cache (result hash, three packet reads, manifest hash read, result parse), or 300 reads; this is code-path accounting, not a separately instrumented before-run. The instrumented after-count above is measured by assertions in the reproducible test. No wall-clock, token, model-quality, or end-to-end savings claim is made.

## Review And Verification

- Independent source-aware adversarial review: completed. The final report is
  `/private/tmp/independent-eval-hardening-review.md` (SHA-256
  `9a87128c97cac6a622633db390aa91737a44bed075381af389900ffef1941834`). It
  reports the packet override, dirty-manifest provenance, and process-tree drain
  findings repaired, with adversarial probes passing for packet bounds, planner
  fallbacks/provenance, batch validation, and runner cleanup behavior.
- The Node 24 aggregate passed: `npm test`, with
  `PYTHON=/private/tmp/wp-expert-skills-py311/bin/python` (Python 3.11.16).
  All aggregate checks passed, including validation runner, eval packet, eval
  feedback planner/preflight, example and 23 behavior run records, evidence
  validator regression self-test, quality validator regression, and install
  links. `bash -n scripts/*.sh` and `git diff --check` also passed. Reference
  validation emitted route-budget and low-headroom warnings; they did not fail
  the gate. This aggregate does not refresh behavioral baseline hashes.
- Reviewer probe artifacts and SHA-256: packet
  `/private/tmp/independent-eval-hardening-packet-results.json`
  (`ccbfeef32505d883ca7196c245473badb95f1f243ffe90d22f57c6b8096a5c02`), runner
  `/private/tmp/independent-eval-hardening-runner-results.json`
  (`83777959117aca28442b325e7c1b3dcd255c4bbc113bb79b9a92da9e1877837d`), batch
  `/private/tmp/independent-eval-hardening-batch-results.json`
  (`268c4bcd1fc46e1454ba101eae0576ac54be53f1ec19cbec07cf09592d675d8b`), cache
  `/private/tmp/independent-eval-hardening-cache-results.json`
  (`77aa99cf36ded8e2f5e382e203472e7635b8ab60aaef5019e6c55d555bddc60f`), and
  planner `/private/tmp/independent-eval-hardening-planner-results.json`
  (`1f006c3540d563de4bfcb88fda78b16254c73982d2bee5e6f4de3426e5ff462b`).
- Fresh-agent behavior-quality evaluation: not run and not claimed.
- Behavioral baseline records and source hashes: unchanged; no runtime adoption claim.
