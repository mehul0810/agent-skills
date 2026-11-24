# Production Change Review: Pilot And Regression Evidence

The [shared guide](../shared/references/production-change-review.md) is a general diff-review route, not a new worker, release gate or certification. The question was whether reviewers could identify the affected caller, security boundary and workload, without prescribing needless refactors. No model, effort or budget limits changed.

## Controlled Comparison

At `d246dfab4a6968bf4ad81a3114af6c8728575b18`, two separate read-only, ephemeral Codex CLI sessions received identical [raw cases](cases/production-change-review/input.json), request and output schema. Both ran GPT-6.1 Terra at high effort in the same neutral directory outside any checkout. The project document limit was zero for these test sessions only. A prompt diagnostic showed no review-guide pointer in the ambient instructions. Only the guided input appended the guide. The event streams showed a completed turn and no reviewer tool actions in either arm; unrelated connector startup notices were not reviewer evidence.

The [ordinary handoff](results/production-change-review-2026-11-22/ordinary.json) was labeled Ibis and the [guided handoff](results/production-change-review-2026-11-22/guided.json) Aster for an independent [blind score](results/production-change-review-2026-11-22/blind-grade.json). Neither reviewer received the scoring key. Both caught all three seeded problems and neither invented a defect in the clean case.

| Synthetic diff | What both reviewers found |
| --- | --- |
| WordPress availability | REST and the dashboard disagree at the exact expiry second. Block the change and test equality through both consumers. The history display has a distinct contract. |
| Export service and digest | Block a change that substitutes authentication for workspace membership. Follow up on a separately provable increase to as many as 500 settings reads; latency was not measured. |
| Help link | No material finding. The unchanged destination and better label do not prove a deployed link works. |

The guided arm prescribed a common helper more strongly than necessary. Restoring identical availability behavior is required; extracting a helper is a design choice. Similar syntax in the history view is not grounds to share it. The results do not justify a mandatory second reviewer or a claim of improved detection. The first desktop pilot at `3d9d598` also tied, but auto-loaded instructions were not independently ruled out there; it is descriptive only.

The final packet digest was `10669cb239652bc8e19191d4d9e947f837580efb09c8366d99013184ab9065ce`; the committed-revision manifest SHA-256 was `f7a4cee2cf7991edef604bfe11e5d82aa202837f78ecb332b14b8e5fbe748a57`. The ordinary and guided input hashes were `642ded69d9da9bd100f3aa5f4cc3adacbdebc77b828e3d45568a38098b9618ce` and `cfa35e0083466827f61bb494cbeba65f34b44857d818104a1806b58e9313cba1`. Each invocation took about 15 seconds including startup. CLI-reported input/output tokens were 27,220/517 and 27,762/521, respectively, with no cached input. These are two individual observations, not estimates of time, cost or quality in other repositories.

## Workflow Regression

On the final source the initial scoped-review grade passed 14 of 15 checks. One answer correctly refused a publication retry but did not distinguish staging-only authority from release authority. A separate case with the actual approval scope yielded the missing distinction. The accepted set is 14 unchanged passes and one retest, not 15 first-attempt passes. This is synthetic decision evidence, not native hook activation or permission to publish a product.

## WordPress Regression

The existing quality role was frozen at `3d9d598533059abb09750a70acf9b777d91699f8`. Its registered source set and scenario are byte-identical at the final guide revision; the new general guide is bound separately by the workflow baseline. A fresh performer handled 21 role prompts and seven maintainer briefs. A separate scorer graded 72 case-to-check mappings across all 41 existing checks. The raw historical prompts were reconstructed from their source, not previous answers or grades. Supplemental packets were new synthetic cases, not product fixtures from the tested Git commit.

| Attempt | Passing mappings | What was missing |
| --- | ---: | --- |
| First | 55/72 | Evidence-limited decisions and omissions in modularity, accessibility and release handling. The frozen validator initially could not load its locked dependency. |
| First recovery | 64/72 | Direct fixture tests and the restored validator ran, but illustrative report pointers did not identify a tested release candidate; some threshold and evidence decisions remained incomplete. |
| Final accepted set | 72/72 | Kept the 64 passes; independently graded eight replacements using specific dependency-direction, dated keyboard-evidence and immutable callback cases. This is 41/41 decision checks, not 41 executed product tests. |

For the final local callback, two ZIP builds of synthetic commit `bdabb627c2f4624272e1a847e88fe3657c62815c` had SHA-256 `561bec25c27d60a0fec5837cd7c8173bff586199b2662e41261c8ecea04e0acf`. The independent reviewer inspected the archive bytes, source and receipts. The safe baseline passed; the packaged candidate failed its authorization assertion. The validator accepted a truthful scoped **failure** report and rejected both a contradictory record and a release report missing domain evidence. The P1 remained open in that fixture. No live WordPress, deployment, performance profile, accessibility conformance, screen-reader or narration verification is implied. The last two checks were excluded by owner direction, not passed.

The grade-bound draft preflights verified complete coverage before the two active records were separately bound by the repository evidence audit. Previous active run records were archived unchanged. The full-batch elapsed intervals include coordination and retries, not per-reviewer runtime or cost. The version-5 to version-6 kit staging test preserved the existing active reviewer and supplied the new template as a reviewable candidate; no product checkout was changed.
