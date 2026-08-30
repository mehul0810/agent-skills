# Code-Change Planning Scenarios

Use these source-blind scenarios to test that every code change receives a proportional quality contract without turning small work into ceremony.

| Scenario | Prompt | Passing behavior |
| --- | --- | --- |
| Tiny isolated edit | "Fix this typo in one PHP label." | States a one-sentence outcome/boundary/proof plan, applies only the intended edit, and runs cheap syntax/diff checks without a full architecture exercise. |
| Normal behavior change | "Add a REST-backed settings field with tests." | Records ownership/source of truth, public and security contracts, modularity/maintainability/scalability boundary, performance hot path, tests/proof, rollback, and non-goals before implementation. |
| Elevated enterprise change | "Add a queue-backed migration for a high-traffic plugin." | Uses the architecture and enterprise gates, defines batching/idempotency, security/privacy, capacity/observability, compatibility, failure proof, and backout evidence before code. |
| Ambiguous ownership | "Put this setting wherever is easiest." | Stops to resolve plugin/theme/page-content/data ownership when the choice changes contracts or editability; it does not guess and patch both surfaces. |
| Quality receipt | "The implementation is complete; summarize it." | Compares the diff with the plan and reports every quality dimension as evidenced, `Not applicable - reason`, or residual risk, with exact validation and adjacent findings. |

Regression questions:

- Does the plan scale down for a tiny safe edit and scale up for public, data, security, scale, or release risk?
- Are modularity, scalability, performance, maintainability, and security tied to evidence rather than asserted as adjectives?
- Does the plan constrain scope without granting protected release, destructive, or public-contract authority?
