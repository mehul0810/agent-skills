# Independent Rendered Evaluation

Evaluator: fresh agent `/root/fresh_contract_eval`; screenshot-only, 2026-09-06 14:57:08-14:57:33 UTC. Inputs: CONTRACT.md and ten PNGs under `/private/tmp/frontend-benchmark-proof/`; no implementation, answer key, runner, or smoke results. Browser: Chrome 152.0.7977.76. Temporary artifacts can be regenerated with capture.cjs; this note does not make them permanently available.

| Variant | Visual / 4 | Observed result |
|---|---|---|
| a | 4 | No visible failure at either width |
| b | 1 | Excess top/insufficient bottom padding; mobile inset mismatch |
| c | 2 | Desktop button baseline differs by about 26px |
| d | 2 | Mobile content extends to about 870px in a 390px viewport |
| e | 4 | Indistinguishable from reference in static screenshots |

All three injected visible defects were identified. The hidden persistence defect was correctly left unknown by this screenshot-only evaluator; source-aware browser smoke separately detected it. Keyboard and native WordPress editing were not independently exercised. WordPress runtime remains blocked for every variant. This demonstrates defect discrimination, not autonomous repair, aesthetic superiority, or token savings.
