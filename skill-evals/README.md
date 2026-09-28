# Skill Evaluation Protocol

Scenario files are behavioral specifications, not executed tests. Grep-based audits only verify coverage exists.

For fresh runs, use [packet-contract.md](packet-contract.md) to separate evaluator inputs from scoring criteria and freeze an allowlisted artifact manifest. Mixed scenario Markdown is author-side material, not a blind evaluator packet.

### Refresh Planning And Draft Receipts

Before dispatch, run the dependency planner against the committed range being evaluated:

```bash
node scripts/eval-feedback-loop.mjs plan --base origin/main --head HEAD
```

This compares committed `base...head` paths only; it does not include staged, unstaged, or untracked worktree files. Supply those paths explicitly with repeated `--file PATH` options, for example `node scripts/eval-feedback-loop.mjs plan --file wp-expert/SKILL.md --file skill-evals/new-cases.md`. Paths are repository-relative and may not contain `..`. The planner binds baseline dependencies from source files, scenario files and explicitly registered fixtures. It emits every `requiredChecks` entry for each affected baseline; it never proposes a subset. Changes not mapped to a baseline are listed as `unmapped` and invalidate selective planning. Changes to the baseline registry, evidence validator, runtime fingerprint, package lock or harness config invalidate every baseline. Regardless of planner output, `fullAggregateRequired` is always true for publication.

After dispatch and scoring, create a draft JSON receipt and preflight it without modifying the baseline registry:

```bash
node scripts/eval-feedback-loop.mjs preflight --receipt /absolute/path/to/draft-receipt.json
```

The receipt uses `schemaVersion: 1`, `status: "draft"`, `baseline`, and exact `testedRevision`. `evaluation.evaluator` and `.scorer` each record a distinct non-empty `identity`, explicit `exposedPaths`, and boolean `expectedAnswersExposed` / `candidateSourceExposed` attestations. The evaluator attestations must be false; scorer exposure is recorded as observed and is not inferred from filenames. Every required check appears exactly once with `result` equal to `pass`, `fail`, or `incomplete`, and at least one `cases` reference. Each case reference contains `packetId`, `caseId`, `packetPath`, `manifestSha256`, `resultPath`, and `resultSha256`. Packet integrity is verified against its manifest and its frozen hash; the result JSON must contain a non-empty `outcome` or `decision` row in `cases` matching the exact `packetId` and `caseId`. The check-to-case mapping lives in the receipt, so one evaluator result may support more than one required check. Result/packet files can remain in an ignored private runtime or temporary location; do not add raw evaluator outputs to Git. Relative paths must stay within the repository and symlink leaves are rejected. Absolute paths are supported for private runtime artifacts.

Preflight reports `complete`, `incomplete`, `failed`, or `invalid`, and always reports `admission: "not-performed"`. It authenticates local bytes against supplied SHA-256 values, not who created them, the truth of exposure attestations, a remote/native artifact, or semantic correctness. A complete draft is not baseline evidence: independently review/scoring must finish, sanitize the run record, run the existing evidence audit, and update the baseline through the established review workflow. Never use this command to bless a declared pass or rewrite historical evidence.

For any change that alters authority, routing, release behavior, hallucination controls, design execution, or owner-correction learning:

1. Run structural validation.
2. Use a fresh agent with only the named skill and raw scenario artifacts.
3. Do not reveal the expected answer.
4. Record skill/references loaded, decision, evidence, host-reported token/context metrics, and failure reason.
5. Require all changed-role scenarios to pass before publication, or document the exact accepted gap in a durable evidence note.

Prefer small representative scenario sets over repeatedly loading every skill. Add a regression scenario when an owner correction reveals repeatable behavior.

For behavior covered by `behavior-baselines.json`, the manifest binds the exact source set, registered scenario contract, required check set, sanitized run record, tested Git revision, runtime class, and harness revision. Any mismatch makes the evidence stale. Re-run the named fresh-agent scenario against the current revision, replace its sanitized record and evidence entry, then use `node scripts/behavior-evidence-audit.mjs --print` to obtain the current digests. Do not refresh a digest without rerunning the scenario.

Scenario identity includes the selected full Markdown contract and explicitly listed `fixtureFiles` bytes (32 MiB maximum per file, current and historical). An empty fixture list means the author reviewed that no file fixture is part of that contract; linked assets are not discovered automatically. Preserve historical anchor-only hashes labeled `legacy-anchor-line`. A supplemental full-contract digest may be derived without a rerun only when the validator proves current selected bytes equal the immutable tested commit; retain original record, revision and legacy hashes. Any content difference requires fresh evidence, not a migration exception. This comparison strengthens identity, not the quality or independence of historical execution.

## Sanitized Run Records

Use the `agent-harness` run-record schema for comparable fresh-agent results. Record only host-reported numeric metrics such as `input_tokens`, `cached_input_tokens`, `output_tokens`, `context_tokens_peak`, `tool_calls`, `retry_count`, and `checks_passed`; omit unavailable metrics rather than estimating them.

For runs starting 2026-09-04 or later, measure a non-zero wall-clock `durationMs` and record numeric `host_telemetry_available` as `1` or `0`. When it is `1`, include at least one portable host metric; when it is `0`, do not estimate tokens or tool counts. This distinguishes missing telemetry from zero usage.

The scenario inventory in `agent-harness.config.json` provides structural coverage. `behavior-baselines.json` is the stricter admission tier for authority, routing, release, proof, correction, and other high-drift contracts; not every structural scenario needs a baseline. Add a baseline when stale behavior could authorize unsafe work, lose specialist routing, or falsely pass material evidence.

Do not store prompts, completions, hidden reasoning, model identifiers, secrets, private product payloads, or user content. Keep raw artifacts in their governed private location and use a pointer in the durable evidence note.

Keep every current behavior record directly in `skill-evals/run-records/` and register it exactly once in the baseline manifest. Move superseded sanitized records to a dated `run-records/archive/` directory so they remain historical evidence without being treated as current. The validator discovers only the current directory, rejects orphan or duplicate current records, and expires records after the manifest freshness window. `npm run run-record:behavior` schema-validates the discovered set; no hardcoded filename list should be maintained.

## Cost-Aware Evidence Refresh

The opt-in `cli-validation-v1` baseline contract permits an older harness runtime
binding only with a reviewed old/new dependency-fingerprint receipt. The audit
checks the immutable tested commit's pin and lock, exact target pin, and installed
CLI-validation closure. Unknown contracts, changed dependencies or source/scenario
drift require fresh evidence. Continuity/API behavior is not covered by this CLI
contract. Preserve historical runtime identities; never relabel an old run as new.

Before dispatch, compute the changed source/scenario-to-baseline dependency set. Run only invalidated baselines, but cover every required check in each. Reuse one independent run across overlapping baselines only when its explicit results cover their complete contracts; register a separate exact-bound record for each. Do not reread unrelated skills or rerun unchanged validators during iteration. Keep one full aggregate publication gate.

Split a broad baseline only after a dependency audit demonstrates separable behavior and an integration scenario still protects cross-route ownership/authority. File churn alone is not grounds to reduce coverage. Research citations are rationale, decision scenarios are policy evidence, rendered artifacts are visual evidence, and native runtime/user outcomes are separate evidence classes; never substitute one for another.

## Measured Optimization

Compare baseline and candidate on the same immutable task/artifact and acceptance checks. Keep development cases separate from held-out cases that the optimizer cannot inspect; the independent evaluator owns their private artifacts. Cover representative plugin behavior, editable theme/site UI, review and release judgment without running every lane on each task. If a held-out case informs a fix, retire it into development and replace it before claiming generalization.

Change one instruction/model/effort variable at a time initially. Preserve quality and authority checks; reject cheaper runs that miss a defect or acceptance criterion. Compare total observed tokens/cost, elapsed time, retries, tool calls and owner corrections per accepted task. Cached input is part of total input, not an additional token total; missing telemetry is unavailable, never zero. Report sample size and uncertainty; one simulation is not a cost benchmark.

Audit prompts after model migrations or repeated friction: identify contradictory authority, duplicated verification, compulsory planning templates, emphasis boosters and obsolete examples. Retire only the redundant clause, retain its protected outcome, and test the changed boundary. Keep stable instructions stable and send deltas; provider-specific cache controls belong in the actual API adapter, not speculative Codex settings. Do not add an automation, prewarm requests or change reasoning merely to chase cache hits.

Custom agent files require a native discovery/dispatch smoke before claiming activation. Distinguish configured model/sandbox from observed effective settings; a fallback prompt is not proof that a named role loaded. Use disposable synthetic artifacts first, then a separately scoped product task for implementation and runtime evidence.
