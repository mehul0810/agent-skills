# Skill Evaluation Protocol

Scenario files are behavioral specifications, not executed tests. Grep-based audits only verify coverage exists.

For any change that alters authority, routing, release behavior, hallucination controls, design execution, or owner-correction learning:

1. Run structural validation.
2. Use a fresh agent with only the named skill and raw scenario artifacts.
3. Do not reveal the expected answer.
4. Record skill/references loaded, decision, evidence, token/context observations, and failure reason.
5. Require all changed-role scenarios to pass before merge, or document the exact accepted gap in the PR.

Prefer small representative scenario sets over repeatedly loading every skill. Add a regression scenario when an owner correction reveals repeatable behavior.
