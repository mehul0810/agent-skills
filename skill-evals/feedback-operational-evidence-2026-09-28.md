# Governance Evaluation Evidence - 2026-09-28

## Native Evaluation And Scoring

### Scope And Result

Fresh-agent forward evaluation of synthetic decision cases only. Four baselines were evaluated against source revision `5668c398440298ad8101c485e0b53b06e6659e08`; `owner-correction-learning` was evaluated separately against `11b23590d40c53d1c4d15875d13ccb2e5a4ead91`. The independent scorer mapped the native structured results to current required checks. All five registered baselines scored pass: product-development-governance 23/23, product-release-authority 21/21, owner-aligned-judgment 8/8, context-approach-continuity 7/7, and owner-correction-learning 7/7.

The four-baseline run was `2026-09-28T10:17:02Z` through `2026-09-28T10:20:44Z` (222,000 ms). The owner-correction run was `2026-09-28T10:25:02Z` through `2026-09-28T10:26:47Z` (105,000 ms). Host numeric telemetry was unavailable in both runs. No tokens, cost, model-quality equivalence, capacity telemetry, or runtime effectiveness are inferred.

## Revision And Contract Digests

Digests below are the exact current values emitted by `node scripts/behavior-evidence-audit.mjs --print`; source and full scenario contract were independently checked at each tested revision.

| Baseline | Tested revision | Source SHA-256 | Legacy scenario-anchor SHA-256 | Full scenario-contract SHA-256 |
| --- | --- | --- | --- | --- |
| `product-development-governance` | `5668c398440298ad8101c485e0b53b06e6659e08` | `9116465b1cec12250eb20a206da7c9609eab95e3749dfe28a9db69f19a25fd63` | `1a06905b2d6ada3db36c1ee36ad36aa798e3b04bebf04c033216d150fdc09db4` | `c821e7e6070b4fcd842964d7c2e1370e00396422202569d7c782f3eca7384f7d` |
| `product-release-authority` | `5668c398440298ad8101c485e0b53b06e6659e08` | `dae3a916808123e8eccac797bbea5d79b4217ab18b4bc907e2db3385e5ca2cf3` | `415eb151638237bf0c9a4cc09f6462e4f028386f88256125e0f3b8369c87f34e` | `7e839a84300f2037e63d753b33d65ee44f7fb75773df468c4543d2ff4126ab7d` |
| `owner-aligned-judgment` | `5668c398440298ad8101c485e0b53b06e6659e08` | `8298a22cf47050942e77d3d21a2f7e9ce0bb05885baf54c172e3d48a1d3a038a` | `54b4ae2bce4d363eecee4fad87a2b5e39ae29e0c98c722ac773dc9447afc6d02` | `197fb731be2f378d458344148128f87e37e9614e5782d28bdddd6921ed77d1b6` |
| `context-approach-continuity` | `5668c398440298ad8101c485e0b53b06e6659e08` | `efd4c9365622f80df8c353fdf4ba3350a1af65ac8e8a1ffe6776b975a72a2015` | `15fe8d6e1c98cd377d1f39af05b23b099aa0f20aaa7f06c0d3d7fe90ead13eae` | `311ab149b274f23b878c14280e03b7b3ada9aeef7fbe78d3b6023fb0443fcec4` |
| `owner-correction-learning` | `11b23590d40c53d1c4d15875d13ccb2e5a4ead91` | `378c0ed684c148f141a86cb6ec99ebb44ef2ed6440107187f30c2d01ecf134d1` | `b73d82e24abe107bee6eca83f4cfb99e0cb14d7bee22ea956c19d298093f7ca4` | `bc9eb442eb998afa47dfa7fca7a55d3519b55917a7e658d0268dc0870d6a4110` |

Runtime binding retained from the tested repository/harness: host `codex-desktop`, isolation `fresh-agent`, harness revision `fe1fe276ca5027b4407ef34334fd41317027c471`. No model identifier is recorded.

## Case Mapping And Private Artifacts

The four-baseline native result is `/private/tmp/feedback-governance-results.json` (SHA-256 `873ef91abf04533d9c379235c4f7061f38cb12b670d5fa9c62f977f5e3d8c069`). Frozen packet manifest SHA-256 values: `governance-contract-refresh` `102894b410547931af15b35fa1ce79d409e00cc213d0586a7108024c76805d96`; `governance-contract-refresh-supplement` `14f837f301f70d61b04a39bd411dc3a125152daf454f5c515d1b848a10a5620f`; `governance-contract-refresh-cto-supplement` `4cd8f2efcb6cae786bb3940d93a975fd108f4fb7399fe776e74d80d8e899060b`; `governance-context-final` `167c992d5af4a0ccdbf6005d1d23d1a2b6d27308be4e1af8ce7f5b711ddb0cce`. The compact per-check case mapping is retained in `/private/tmp/feedback-governance-scoring.json`; preflighted baseline receipts are `/private/tmp/feedback-governance-product-development-governance-draft-receipt.json`, `/private/tmp/feedback-governance-product-release-authority-draft-receipt.json`, `/private/tmp/feedback-governance-owner-aligned-judgment-draft-receipt.json`, and `/private/tmp/feedback-governance-context-approach-continuity-draft-receipt.json`.

The separate model-routing capacity scenario `additional-capacity-case/capacity-01` passed its conservative-default signals; it is not part of the four baseline check counts. Its result was in the same private native JSON. No dispatch or capacity measurement occurred.

## Owner Correction Learning

The owner-correction native result is `/private/tmp/feedback-learning-results.json` (SHA-256 `531cb7f113341ee994130113aaa9adc6e7fbe1a29f89d9e23369d3fefa33e41e`); frozen `outcome-ownership` packet manifest SHA-256 is `2f713dc86be140572b0731ee3be027cbab6cff6efcc0d4693b1e620d110cb269`. Required-check coverage uses only frozen packet cases `case-13` through `case-17` and `case-24`: correction/root cause, compact correction transfer, candidate-only routing, repeatability and dedupe, reviewed destination, decision-envelope continuity, and non-promotion of task/tool/previous-decision authority. The check-to-case mapping and native result hash are in `/private/tmp/feedback-governance-owner-correction-learning-draft-receipt.json`, which passed preflight with admission not performed. The extra `learning-01` response was scored separately from the same result JSON but is not part of the frozen baseline packet and is not used to satisfy any required check.

## Evidence Limits

These are synthetic scenario decisions, not product implementation or runtime tests. No WordPress site, package, release, protected branch, production action, operational learning ledger, or autonomous agent behavior was exercised. In particular, this evidence does not verify the ongoing runtime-agent pilot or prove that an accepted learning candidate changed behavior. Raw evaluator outputs remain private and were not copied into the repository. The superseded sanitized run records are preserved unchanged under `skill-evals/run-records/archive/2026-09-28-governance-contract-refresh/`.
