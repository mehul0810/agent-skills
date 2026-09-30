# Scope Guardrail Evidence - 2026-09-30 (Historical First Stage)

This note records the first-stage, pre-remediation uncommitted-source evaluation. Its no-commit and no-duplicate-source-rule statements apply only to that stage; they do not describe or validate the later Product Value Decision remediation. That follow-through requires its own exact source identity and fresh evidence.

## Change And Source Identity

At base `ca7fe795b01db15b305add7205d2d91a2189eeef`, the eight-file source/evaluation patch before this note was added had SHA-256 `3112d7b2464fd47bffc53d5eec9c8df78d780f4d8ee537dd10321d9f8c71d028`. It tightens CTO cadence and readiness authorization boundaries, requires supported-tool project-membership evidence, preserves owner-requested prefixes, and requires interrupted-worker status plus artifact/test reconciliation. Blind cases 02-05 cover those boundaries and a safe explicit-authorization counterexample; native-design cases 17-18 already cover wrong active-document refusal and a scoped API exception.

No product priorities, native Decisions adapter, automation changes, installs, commits, or pushes were made.

## Validation And Behavioral Evidence

`npm test` exited 1 because source/fixture freshness invalidated the four registered governance baselines; all 15 other aggregate gates passed. Log: `/private/tmp/scope-guardrail-skills-test-20260930.log` (SHA-256 `d53ee8be1c575661e72e875d96d8342355fe7237e1e09b44376baa20ec03cbc8`). Focused orchestration and routing audits and `git diff --check` passed.

Fresh uncommitted-source first run: 62/63 checks passed. The separate scorer receipts are:

- Product development governance, 23/23: `/private/tmp/dirty-source-product-development-governance-scoring-20260930.json` (SHA-256 `266530566b04e10e5d036f8581206dbf5af24e9e93c944cf1735c77683dc262c`).
- Product value decision, 10/11: `/private/tmp/dirty-source-product-value-decision-scoring-20260930.json` (SHA-256 `6142b287aba4a14ff6476bc04e490bd6418e7659666ee7e95732bae9f397d509`). `measurable-threshold-window` failed on the first run: the proposed test lacked a specific measurable threshold/window. Existing guidance already requires both (`shared/references/product-value-decision.md`, line 20); no duplicate source rule was added.
- Product release authority, 21/21: `/private/tmp/dirty-source-product-release-authority-scoring-20260930.json` (SHA-256 `b71feb93b299b6d9468a886dc1656d45c8236855b9367c79ebf47ffad5323816`).
- Owner-aligned judgment, 8/8: `/private/tmp/dirty-source-owner-aligned-judgment-scoring-20260930.json` (SHA-256 `d26160cde734d0e0d370ca789e06214bdc053c4316a769cc6380c8f9a7cc06f3`).

A separate fresh GPT-6.1 Sol escalation on the same value packet passed 11/11 required checks and 2/2 additional probes. It proposed a bounded cohort/window/threshold test for the missed value case. Receipt: `/private/tmp/dirty-source-product-value-decision-escalation-scoring-20260930.json` (SHA-256 `a70f4f6ecd76b1d4057b943aa0afb89d88fc7994faa59523b2cc420ee736d0c9`). This second pass does not erase the first-run failure or make the first four-receipt result an all-pass.

The earlier seven-case scorer passed 7/7 but is narrower and explicitly does not replace the four full evaluations: `/private/tmp/scope-guardrail-blind-scoring-20260930.json` (SHA-256 `65a1600efd2e5b3e1746a2a0f06416be1fa3ca111ac433be71ab540e6d016a8a`).

These are synthetic decision evaluations against an uncommitted source snapshot, not registry-admissible baseline evidence. The packet and evaluator outputs are in private, ephemeral `/private/tmp` locations. After any authorized commit, verify the exact clean HEAD and current source hashes, then run fresh committed-source evaluations before registry admission; do not reuse dirty-source receipts as clean-commit proof.

## Preserved Work And Retirement Review

Unrelated sibling work was preserved: `agent-loop` at HEAD `c2d7ce9d2438570f43094fc0cdfe2e7f990d1cff`, three-file patch SHA-256 `cf9c7c1851fb9e5d459678c565b5201d68b9959d7c77e7a02b4bd67f377f74f7`; `agent-decide` at HEAD `e8ba7f96af0a1a99e853ac8462aa5b0d81e9aacb`, two-file patch SHA-256 `96a9553a34415d631dbf14a77a9dce924b2ef9f06e58bb3e04dacbf22881c592`. A parent probe imported `agent-loop`'s `validateCanonicalCheckoutState` with the live `agent-decide` HEAD/status and returned `canonical_checkout_dirty`, with no ledger writes. Fixture coverage is in `agent-loop/tests/decide-workflow.test.mjs` only.

Retirement candidates for later review: legacy `figma` and `figma-implement-design` overlap the `figma:figma-design-to-code` plugin, but an explicit caller and routing audit still reference `figma-implement-design`; migrate and revalidate that route before removal. No invocation telemetry was available, and nothing was deleted. Retain `wp-expert`, `behavior-validator`, and Pen design support because their routing or native-artifact roles remain distinct.
