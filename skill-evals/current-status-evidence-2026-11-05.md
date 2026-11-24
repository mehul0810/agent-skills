# Current Status Regression Evidence

## Scope And Decision

Added seven replayable synthetic status cases, a local lookup fixture with query
traces, packet/adapter tests, and scenario-inventory/aggregate registration.
No skill kernel, shared behavior reference, global instruction, custom rule,
permission, model policy, schedule, or product state was changed. The recommendation
was tested before adding instructions; no unsafe status-reporting defect was
established by these cases. This is not a diagnosis of the reported real incident.

Guidance source: `0fb941ee8123e283f24796894c521454794f2151`.
The separately frozen global instruction file has SHA-256
`8618eee0b275ef51b09fb071776b35d8f2793cc13e3f22a82211ef7b9b323201`.
The guidance manifest hash is
`42f2f2633fae35f25d921a8aa99deebecbb06aa4e13a234172d2f4c51b1640cb`.
This identifies supplied guidance, not automatic host loading or enforcement.

## Initial And Corrected Attempts

An independent author prepared seven development cases and three held-out cases.
Before dispatch, neutral IDs replaced answer-revealing IDs, and the reuse control
received a full prior-observation fixture. Criteria and backend responses stayed
outside performer packets. The author saw existing scenario snippets and a memory
registry search, but no performer outputs. These were packet-design corrections,
not hidden performer retries.

Two fresh performers completed the development and held-out sets against unchanged
guidance. An independent scorer checked answers, exact-target query traces, packet
hashes and exposure reports. Original scores remain **6/7 development and 2/3
held-out**. The two CI cases failed their frozen requirement for separate PR and
checks lookups; both answers nevertheless declined to call pending CI green.

Review found ambiguity in the fixture, not proof of a missing rule: the checks
response included a root `headSha` without defining whether it was the authoritative
current PR head. A combined authoritative read could legitimately avoid a second
lookup. The original failures are retained; they are not relabeled as passes.

One new frozen CI attempt removed current-head identity from the checks response,
leaving PR metadata as its sole source. A third fresh performer queried PR metadata
and checks, matched the queued run to the current head, rejected the older success,
and passed independent scoring. It also made one unsupported `recent` lookup;
that extra call is retained and is not an efficiency improvement. Guidance did not
change. This is fixture correction and supplemental coverage, not a before/after
model improvement or a fresh held-out transfer claim.

The first performer reported loading the optional product-orchestrator kernel;
the held-out and corrected-CI performers did not. Correct answers therefore cannot
be attributed uniformly to that skill. The exact-target supplied-receipt cases
made zero queries, but do not prove genuine same-turn host continuity or caching.

## Evidence Identity And Limits

Private evidence is retained under `codex-private:current-status-20261105` in the
owner's local artifact storage, including packets, source snapshots, distinct
attempt traces, original scores, corrected scores and validation logs. The original
packet-hash index SHA-256 is
`88753b5149df222d63c33524edbee95ca5d8c36729b73cc24cc1a3966053ce1a`.

| Artifact | SHA-256 |
| --- | --- |
| Initial development result | `df54a1e0dac2022a4e2c83af208b3ccd8adeac060616d139855e3496dac9b7e2` |
| Initial held-out result | `be9391ccb7b6f5d4b962cfa11a2bc2cdcffd0055706dcd0fc98cb85eacdab8cf` |
| Original independent score | `2b8081892a458b39cfb4582fc1d91d5aecef50141d8c13c79ffc9b7b697e5956` |
| Corrected CI result | `5d4adf1cb6b125ef07b1c12479fc520ba3858aab9c55c79ba431a5545d17523e` |
| Corrected CI query trace | `4e9559aa99fa3c2c400d856a0c59adfd3cef0ede2f6e760946828faa38e202ed` |

The repository fixture candidate differs from the original runtime: checks no
longer disclose current-head identity, the trace argument is portable, and an
unsupported claim that the unavailable response followed a bounded retry was
removed. The corrected-CI runtime already had the first two changes; the later
error-message correction does not change its successful endpoint responses.
Original raw files and hashes were not rewritten. Only observed query rows count
as attempts; the old error text does not prove retries.

These are synthetic decisions and fixture mechanics, not native GitHub access,
automatic skill discovery, production state, deployed behavior, or an end-to-end
reliability/cost benchmark. Host token/cost metrics and per-agent elapsed times
were unavailable; no estimates or zero-cost claims are substituted. VoiceOver and
narration checks were excluded by owner direction, not passed.

## Validation And Publication Gate

The seven deterministic fixture/packet tests passed. They cover status distinctions,
unavailable responses, current-head/run separation, exact repository identity,
unsupported requests, caller-selected append-only traces, and blind packet
construction. They do not grade agent prose or run agents inside `npm test`.

Independent source review found an overbroad no-write claim and the unsupported
retry phrase. The guide now documents the caller-selected trace as the sole write,
requires a new external attempt path, and explicitly disclaims sandbox enforcement;
an append/source-preservation test covers that contract. The retry phrase was
removed rather than treating a fixture message as execution evidence.

The path-only dependency planner conservatively selected all 24 registered
baselines for the additive harness-config entry. No existing baseline definition,
source file, scenario or evidence record was edited or refreshed. Direct hashing
proved all 24 baseline source sets equal their committed `0fb941e` bytes. Five
already differ from their registered evidence hashes at that commit:

- `design-experience-routing`
- `wordpress-visual-execution`
- `visual-evidence-assets`
- `native-design-authoring`
- `content-migration-integrity`

The evidence audit fails on those five pre-existing mismatches. They are not passes
or accepted fresh proof; unrelated baselines were not rerun and digests were not
replaced. These stale baselines must be resolved through their owning fresh-agent
contracts before publication under the repository's full-gate policy.

The candidate source index, excluding this subsequently completed evidence note,
has SHA-256 `9389f48da157bd9455338d59748297e052fabeb6a8a2d03c33b297c69064f8e7`.
It binds all 22 changed source/config/scenario files to the tested working tree.

Full `PYTHON=/opt/homebrew/bin/python3.11 npm test` on Node 24.18.0 and Python
3.11.17 returned exit 1: **18 of 20 aggregate commands passed**. The failures were:

- `Attempt evidence regression`: `attempt 1: activation: unsafe evidence path`.
  The existing fixture uses the host's `/var/folders/...` temporary-path alias,
  while its evidence validator rejects noncanonical paths. With `TMPDIR` resolved
  through `pwd -P` to `/private/var/folders/...`, a focused retry of
  `node scripts/test-eval-attempt-evidence.mjs` passed all 47 cases. No validator,
  test source or safeguard was changed. The initial aggregate failure remains in
  `npm-test.log`; recovery is separate in `attempt-evidence-recovery.log`.
- `References and domain audits`: the five baseline mismatches above, plus the
  expired `wordpress-current-developer-guidance` entry in the unchanged
  `shared/source-freshness.json`. Its last check was 2026-09-04 with a 45-day window.
  This run did not reverify that external source or reset its date.

`git diff --check`, `git show --check --oneline --no-renames HEAD`, shell syntax
checks and the seven new fixture tests passed. The full aggregate was not rerun
after the focused environment recovery because the independent freshness blockers
remain. No Skill Creator folder check applies: no skill folder was changed.

**Publication held:** task changes remain local and uncommitted; no branch, PR,
push, release or deployment was created. Complete the unrelated baseline refresh
and authoritative source recheck, then rerun the full gate before publishing. Do
not treat the successful status regression as approval to bypass those gates.
