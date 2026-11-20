# WordPress Quality Report Evidence

Tested source: `fc2316c2ce46f34fb2e684e89133c700cb13b7d9`. This revision changes the reviewer's report contract and the shared implementation trigger for a measured size breach. It does not change model routing, effort or route budgets, product policy, release authority or the owner's accessibility exclusions.

## Regression Evidence

The actual Node CLI ran on eight synthetic reports: A, E and H were valid passes; F was a valid **failure**; B, C, D and G were invalid. B reused another candidate's identity; C omitted declared risks and nested evidence. D combined a static authorization claim with an unrelated version test. E stayed at 180 ms against 250; F rose to 300 ms. G claimed p95 of 490 ms while recording 1,200; H recorded the same 490 ms in its summary and distribution without inventing p99.

On the prior source (`9f9cac5`), D and G were accepted, and E and F rejected. For the old percentile records the new statistic field was omitted; metric, unit, observations and target values were unchanged. The maintained self-test also exercises complete and missing three-metric ratchets, exception scope and exact changed-file coverage, clean and failed migrations, webhook-specific evidence, justified queue/fairness exclusions and their counterexamples. The schema check exercises the positive self-test records as JSON documents.

Independent source review found three remaining holes during implementation: unrelated webhook matrix/budget, omitted paths in finding-level legacy evidence, and rejected failed rollback records. A separate re-review verified all three corrections on the tested commit.

## Behavioral Evidence

Fresh evaluators received frozen raw packets and owning guidance, not the scoring keys or implementation source. The trusted report CLI was executed without inspecting its source. The seven cases in [the decision packet](cases/quality-report-decisions/input.json) passed independent scoring, including the changed-code implementation trigger and its ordinary label-edit counterexample.

| Baseline | Initial scoring | Final coverage |
|---|---|---|
| WordPress quality reviewer | 34 pass, 7 incomplete | 41/41 after focused follow-ups on authorization, dependency direction, phased migrations, formal accessibility evidence, authentication exceptions, AI action binding and retrieval isolation. |
| Enterprise runtime assurance | 4 pass, 1 fail | 5/5 after a new evaluator resolved the original package-inventory decision and distinguished it from separate contractual and internal-use cases. |

The first record evaluator placed D-H under its release-records answer rather than the separate comparison case. A second evaluator ran all five and recorded the named case; both attempts remain in the private evidence. Supplemental passes are recoveries, not first-attempt passes or transfer tests.

Private packets, manifests, results, initial/final scores and preflights: `codex-private:quality-contracts-improvement-20261120`. Superseded sanitized records are byte-preserved in `run-records/archive/2026-11-20-pre-quality-contracts/`. The 22 other baselines were unchanged. No host token or cost measurements were available.

These results establish skill decisions and report acceptance, not real product security, capacity, accessibility, artifact authenticity or inventory completeness. VoiceOver, substitute-reader checks and narration verification were not performed. WordPress's [measurement guidance](https://make.wordpress.org/performance/handbook/measuring-performance/best-practices-for-performance-measurement/) informs comparable setups and repeated observations; the validator's sample floors are local record checks, not WordPress standards or confidence guarantees.
