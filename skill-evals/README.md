# Skill Evaluation Protocol

Scenario files are behavioral specifications, not executed tests. Grep-based audits only verify coverage exists.

For any change that alters authority, routing, release behavior, hallucination controls, design execution, or owner-correction learning:

1. Run structural validation.
2. Use a fresh agent with only the named skill and raw scenario artifacts.
3. Do not reveal the expected answer.
4. Record skill/references loaded, decision, evidence, host-reported token/context metrics, and failure reason.
5. Require all changed-role scenarios to pass before publication, or document the exact accepted gap in a durable evidence note.

Prefer small representative scenario sets over repeatedly loading every skill. Add a regression scenario when an owner correction reveals repeatable behavior.

For behavior covered by `behavior-baselines.json`, the manifest binds the exact source set, registered scenario contract, required check set, sanitized run record, tested Git revision, runtime class, and harness revision. Any mismatch makes the evidence stale. Re-run the named fresh-agent scenario against the current revision, replace its sanitized record and evidence entry, then use `node scripts/behavior-evidence-audit.mjs --print` to obtain the current digests. Do not refresh a digest without rerunning the scenario.

## Sanitized Run Records

Use the `agent-harness` run-record schema for comparable fresh-agent results. Record only host-reported numeric metrics such as `input_tokens`, `cached_input_tokens`, `output_tokens`, `context_tokens_peak`, `tool_calls`, `retry_count`, and `checks_passed`; omit unavailable metrics rather than estimating them.

Do not store prompts, completions, hidden reasoning, model identifiers, secrets, private product payloads, or user content. Keep raw artifacts in their governed private location and use a pointer in the durable evidence note.

Keep every behavior record in `skill-evals/run-records/` and register it exactly once in the baseline manifest. The validator discovers the directory automatically, rejects orphan or duplicate records, and expires records after the manifest freshness window. `npm run run-record:behavior` schema-validates the discovered set; no hardcoded filename list should be maintained.
