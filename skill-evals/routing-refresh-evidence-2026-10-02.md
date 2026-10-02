# Routing refresh evidence — 2026-10-02

## Independent scoring

Frozen source: `14dd98a9c42942f092c15f4b713e3677225d188b`. Four packet manifests were frozen at `2026-10-02T11:10:30.427169Z` before the sealed evaluators were dispatched. Three fresh evaluators received only the allowlisted packets and named owning guidance. Author criteria, prior results and implementer diffs were excluded; owning Skills/router/reference guidance is permitted by the packet contract. Exposure flags are evaluator attestations, not authenticated runtime access logs.

Independent scorer `/root/baseline_scorer` separately read author criteria and scored the complete required-check contracts. All **59 required checks** have synthetic decision coverage: 23 development governance, 21 release authority, 8 owner judgment and 7 context continuity. Draft receipts passed byte/packet/row preflight before the four exact-bound records were registered. Preflight verifies structure and supplied local hashes; independent scoring supplies semantic review. It establishes neither authenticated authorship nor native behavior.

All **85 original raw cases** remain preserved privately. Case scoring retained **77 pass, 1 fail, 1 incomplete and 6 unscored**. This is not an unqualified pass for the full old governance packet. Partial original contributions remain partial; supplements provide substantive required-check coverage without relabeling those original contributions.

- `case-01` failed the original literal role/model criterion. That criterion conflicts with the task-authorized versioned assessment, and the raw request contained no owner model lock. The original verdict stays failed. Current conditional routing semantics are separately observed; active policy adoption is unproven.
- `case-supp-11` remains incomplete: the supplied artifacts do not identify the exact original release receipt or changed assumption. `case-supp-04` independently supplies the complete synthetic private-decision envelope for the associated required checks.
- Six product-value cases are outside these four baseline contracts and remain unscored; their original outputs were retained.

## Private artifact identities

Raw outputs and scorer details are intentionally excluded from Git. Governed local pointer: `routing-policy-work/evaluation-private/` in the October 2 task-2 workspace. Hashes below identify retained local bytes, not public/native artifacts.

| Artifact | SHA-256 |
| --- | --- |
| independent-baseline-score.json | `960bd40ec32acd34b51f9b7768a2e4e1811c725c8f432bbf1060c5b76dc17edc` |
| sealed-governance-first-preflight-view.json | `413a9a7e0f0ed647b1bfa58a9ffae6838d854eab1b2461d4646a46703c7c474b` |
| sealed-governance-first.json | `53682f2103898f73772077a8d6cbb8adf872760d1da51acc5373e6cb47e75cd8` |
| sealed-governance-second-preflight-view.json | `0ced233763ccb1c1a7f7091577e2fe294b7ac779ab405102becbb95e7e3042a3` |
| sealed-governance-second.json | `ab13b45360213b4af7ed09644e7ab93cebb4b531edac044d11b28f19af33dbb3` |
| sealed-governance-supplements-preflight-view.json | `294d09ae6011f0005a0b64db5a74363d3350dcc077df8fd77b0be37ea35e5aae` |
| sealed-governance-supplements.json | `23b927cea3f62f018ee15b4abdc52beffe8bc16b6d915d36b1606b77e56cacfc` |

| Frozen packet | Manifest SHA-256 |
| --- | --- |
| governance-contract-refresh | `d52ee018b4ac970da870360f4e1fdee3b80a8b1b23f8fc11a898b5c85d019b2f` |
| governance-contract-refresh-supplement | `e94c41af99c7953012e05ba01831c7284af78c7b7b880d171698598a14fb3267` |
| governance-contract-refresh-cto-supplement | `90b2bdf001eb122ad180df62a0824817437d5011793c1a604b0b11d02d99a43a` |
| governance-context-final | `d8f14c447337b6c36dabc81bd680f12fffcfa9dfe4f3534fe7ce2ac5d65f413e` |

The raw evaluator format used `caseId` and, for supplemental decisions, structured objects. The existing preflight expects `id` and a string. Private `*-preflight-view.json` files are lossless structural projections: caseId is copied to id; string decisions are unchanged; objects are serialized with every key retained. Original raw files were not modified. Receipt references bind both original and projected SHA-256 values. No evidence-validator rule was weakened. Earlier unsealed diagnostic attempts are excluded from registered admission.

## Timing and limits

The shared measured batch window is `2026-10-02T11:11:32.000Z` through `2026-10-02T11:31:10.317Z` (1178317 ms), including independent scoring. Scorer start records the first timed evidence read; initial filename discovery preceded it. Each registered record uses this same shared window. These durations are not independent task throughput measurements. Numeric host token/context/tool/retry telemetry was unavailable; unavailable values are omitted, with `host_telemetry_available: 0`. No model quality comparison, held-out generalization, business outcome or token/cost savings is claimed.

This is synthetic decision proof only. It does not establish installed Skills, native hooks, model setters, production permissions, Loop policy adoption, automatic Decide adapters or live product execution. Loop retry reviews remain unverified without a separately trusted verifier; inventory capability does not expand authority.

## Historical preservation

- product-development-governance: superseded record moved byte-for-byte to `skill-evals/run-records/archive/2026-10-02/product-development-governance-2026-09-28-ci-policy-refresh.json` (SHA-256 `82aeb4ad0b3821abc9b1dde2c14c384469c5228764045d0c770c08d0068d266e`).
- product-release-authority: superseded record moved byte-for-byte to `skill-evals/run-records/archive/2026-10-02/product-release-authority-2026-09-29-closed-loop.json` (SHA-256 `4781347e6bb1f43f9f979ebde2abe73d579d1dc23cff01a75ae75267afe8b1b8`).
- owner-aligned-judgment: superseded record moved byte-for-byte to `skill-evals/run-records/archive/2026-10-02/owner-aligned-judgment-2026-09-29-closed-loop.json` (SHA-256 `4cf9179569e815b13c29ce37481b50b939f083d31ebe97524df545a859828ac8`).
- context-approach-continuity: superseded record moved byte-for-byte to `skill-evals/run-records/archive/2026-10-02/context-approach-continuity-2026-09-28-governance-contract-refresh.json` (SHA-256 `e23c3ba4560347d978318ffc9a437164501d89cac82bfc72b9e282da9360d84b`).

Original criterion file SHA-256: `c44695ecca59d65bc4ced8f3250f02541aab3e7d641793722005c3456f142df8`. Revised future-scoring criterion SHA-256: `fa9a15d594fdd154b706d08abcd313fad9e14e346c8b4e8847a5f186061984b3`. Original immutable criteria remain at tested revision `14dd98a9c42942f092c15f4b713e3677225d188b` and in the private scorer snapshot; original verdicts are not recomputed.

The initial six runtime-binding errors were task-local dependency symlink artifacts. The validator correctly rejected external realpaths. Copying the already-installed exact locked dependency files resolved them; the exact original main branch passed the audit. Historical runtime identities and security checks were preserved. Only the four source-changed baselines were refreshed.

## Additional routing checks

Eight independent blind routing decisions (R1–R8) additionally covered deterministic low effort, consequential low effort, complex higher effort, explicit unavailable locks, feasibility before capacity, unverified retry/access holds, proportional delegation and a necessary five-source context bundle. They exposed contradictory escalation prose; the canonical Loop policy now names both reasoning failure and exceptional complexity. This small synthetic set supplements the registered proof and establishes no live model change or savings. Read-only implementation review passed 43 focused tests including CLI fixtures and found no remaining material issue after corrections.

An existing unpublished `mg/sol-6-1-routing` branch was duplicate-screened. Its earlier fixed role/model proposal was neither merged nor deleted; this versioned proposal is the review candidate.
