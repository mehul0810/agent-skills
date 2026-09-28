# CI Policy Evidence, 2026-09-28

## Scope And Result

Fresh-agent synthetic decision evaluation was scored against source revision
`df678758406d2ae3b7d850f445d07cdd371ecbef`. Independent scoring records 91/91
required checks passed across eight behavior baselines, with zero failures or
inconclusive checks. The eight sanitized run records in `run-records/` register
those results; superseded records remain unchanged in
`run-records/archive/2026-09-28-ci-policy-baseline-refresh/`.

The baseline set covers automatic specialist routing, engineering graph closure,
enterprise runtime assurance, owner-aligned judgment, owner-correction learning,
product-development governance, product-release authority, and product-value
decisions. The evaluation includes fixture/decision evidence only. It does not
prove native hosted CI execution, repository billing or cost savings, product
runtime behavior, release readiness, or publication.

## Baseline Results

### automatic-specialist-routing

Four of four required checks passed. See
`run-records/automatic-specialist-routing-2026-09-28-ci-policy-refresh.json`.

### engineering-graph

Twelve of twelve required checks passed. See
`run-records/engineering-graph-2026-09-28-ci-policy-refresh.json`.

### enterprise-runtime-assurance

Five of five required checks passed. See
`run-records/enterprise-runtime-assurance-2026-09-28-ci-policy-refresh.json`.

### owner-aligned-judgment

Eight of eight required checks passed. See
`run-records/owner-aligned-judgment-2026-09-28-ci-policy-refresh.json`.

### owner-correction-learning

Seven of seven required checks passed. See
`run-records/owner-correction-learning-2026-09-28-ci-policy-refresh.json`.

### product-development-governance

Twenty-three of twenty-three required checks passed. See
`run-records/product-development-governance-2026-09-28-ci-policy-refresh.json`.

### product-release-authority

Twenty-one of twenty-one required checks passed. See
`run-records/product-release-authority-2026-09-28-ci-policy-refresh.json`.

### product-value-decision

Eleven of eleven required checks passed. See
`run-records/product-value-decision-2026-09-28-ci-policy-refresh.json`.

## Independent Supplemental Decisions

- Three CI-policy cases passed: private-repository local-first gates, preserving
  useful public-repository PR checks while reducing redundant fan-out, and
  verifying visibility and required-status behavior before making a cost claim.
  These are recommendations, not observed GitHub configuration or billing
  evidence.
- Three model-policy observations passed: allocation to the designated available
  lane, stopping rather than substituting when a required lane is unavailable,
  and treating unknown context telemetry as unknown. They are policy decisions,
  not proof of live model availability or runtime settings.
- A separate installed-skill review scored 6/6 for its final policy case, and a
  separate loop-creator routing case scored 5/5. The loop-creator source was at
  local revision `a142838`; the reviewer note disclaims native runtime adoption.
  These do not add checks to the 91-check baseline total.

## Evidence Identity

- Frozen score: private `/private/tmp/ci-policy-scoring.json`, SHA-256
  `c2086ed2438dc4c239e94bdd4ded0e6e27c2dc04316491c8bc5ccdd9230af1de`.
- Source digests were generated for the exact tested revision and registered per
  baseline in `behavior-baselines.json`. The saved planner covers the seven
  baseline-owned paths supplied to it; it is not a complete source-diff coverage
  receipt. Workflow, documentation, audit, and CI scenario changes additionally
  require the full repository gate.
- Private evaluator outputs are retained outside Git. Their SHA-256 identities
  are: governance output `fec20563be48066892a145071caf049ffa3c3873d83962df01c43f265fba4b44`,
  extra blind output `0e003c6896e1f76bc21cec73812648c368c2b357404cc602e9bbacdc9e3a39e5`,
  supplemental output `6e13780f550619b9079daed3be86f7b16d1c8ec8821cf5aafb54e029ee66c8be`,
  exact-value output `ec385d5d563810abbc11e5460a8cbce9e46261c41329a3a8feca51ad1aef4f27`.
- The governance evaluator reported `2026-09-28T15:48:47Z` to
  `2026-09-28T15:54:30.043Z`. The extra blind task's native task event stream
  reported `2026-09-28T15:48:48.340Z` to `2026-09-28T15:51:46.744Z`; this is
  task wall-clock time, not model compute latency. Its private provenance is the
  native Codex session event stream (verified by an independent reviewer),
  events 1 (`task_started`) and 89 (`task_complete`). The supplemental evaluator
  reported `2026-09-28T15:52:16.693Z` to `2026-09-28T15:52:45.058Z`; the
  exact-value evaluator reported `2026-09-28T15:56:33.822Z` to
  `2026-09-28T15:56:56.103Z`. A record spanning multiple outputs uses the
  enclosing observed interval; intervals are shared and non-additive.
- Host token/context telemetry was unavailable and is recorded as unavailable,
  not estimated. No prompts, completions, provider identifiers, or raw evaluator
  outputs are stored in this repository.

The separate review source is private `/private/tmp/policy-review-20260928.md`;
the installed-skill result identity is `d94433c7992191105d9e9b35aec4fdd4333bfe2c34feaf48573c45d01dac1155`.
