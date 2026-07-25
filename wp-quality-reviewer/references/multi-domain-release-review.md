# Compact Multi-Domain Release Review

Use this as the single primary reference when one candidate needs security, performance, modularity, and accessibility review. It is a risk triage and release-blocker gate, not four exhaustive audits.

## Candidate Contract

Establish once:

- Commit/package/build identity and target WordPress/PHP/browser/runtime.
- Changed files, entry points, user journeys, stored/public contracts, data volume, and exclusions.
- Existing project commands, baseline budgets, accessibility target, and release risk.

Inspect the diff plus enough owners/callers/runtime evidence to avoid local-only conclusions. Optional scanners are evidence, never the pass authority.

## Compact Matrix

| Area | Inspect | Release blocker | Minimum proof |
|---|---|---|---|
| Security | Auth/capability/ownership, nonces, validation/escaping, SQL/files/URLs, secrets/PII, webhooks/dependencies | Credible unauthorized access, injection, secret/data exposure, unsafe upload/SSRF, or missing sensitive negative proof | Boundary-specific negative tests and exact package/dependency evidence |
| Performance | Query/cache/options/remote/jobs, admin/editor bootstrap, assets and changed user path | Unbounded hot path, availability/queue risk, known severe regression, or claim without comparable evidence | Same-condition baseline/after or explicit blocked gap |
| Modularity | Entry point to business/data owner, duplicate invariants, coupling/cycles/globals, public contracts, comments/tests/dead code | Multiple owners for critical invariant, unsafe cycle/state, untestable release-critical change, or accidental public/data break | Characterization/behavior tests and evidence that ownership/coupling improved |
| Accessibility | Critical states, semantics/names, keyboard/focus, errors/status, contrast/reflow/motion, author and visitor flows | Keyboard trap, unusable critical task, missing critical name/error, or inaccessible editor/auth/setup flow | Automated scan plus manual keyboard and named AT/browser proof where applicable |

For each area, record `pass`, `fail`, `partial`, or `not applicable - reason`. Never omit a dimension.

## Escalate Deliberately

Load one detailed mode reference only when:

- A `P0`/`P1` or ambiguous trust/scale/accessibility boundary needs deeper analysis.
- Fixing the issue requires mode-specific remediation rules.
- The owner requested an exhaustive audit of that area.

After resolving that mode, return to this matrix. Do not load a second detailed mode unless another confirmed blocker cannot be judged safely from the compact contract.

## Output And Stop

Findings remain evidence-backed and severity ordered. For formal/release-critical work, materialize `shared/schemas/wp-quality-review.schema.json` and run the bundled validator.

Overall `pass` requires:

- No unresolved `P0`/`P1`.
- Every matrix area has a disposition and evidence or a justified non-applicable reason.
- Every claimed fix reran its original failure clause.
- No required proof gap remains.

Do not claim comprehensive security, capacity, maintainability, accessibility, or WCAG conformance from this compact review.
