# Skill Evaluation Protocol

Scenario files are behavioral specifications, not executed tests. Grep-based audits only verify coverage exists.

For any change that alters authority, routing, release behavior, hallucination controls, design execution, or owner-correction learning:

1. Run structural validation.
2. Use a fresh agent with only the named skill and raw scenario artifacts.
3. Do not reveal the expected answer.
4. Record skill/references loaded, decision, evidence, host-reported token/context metrics, and failure reason.
5. Require all changed-role scenarios to pass before publication, or document the exact accepted gap in a durable evidence note.

Prefer small representative scenario sets over repeatedly loading every skill. Add a regression scenario when an owner correction reveals repeatable behavior.

## Sanitized Run Records

Use the `agent-harness` run-record schema for comparable fresh-agent results. Record only host-reported numeric metrics such as `input_tokens`, `cached_input_tokens`, `output_tokens`, `context_tokens_peak`, `tool_calls`, `retry_count`, and `checks_passed`; omit unavailable metrics rather than estimating them.

Do not store prompts, completions, hidden reasoning, model identifiers, secrets, private product payloads, or user content. Keep raw artifacts in their governed private location and use a pointer in the durable evidence note.
