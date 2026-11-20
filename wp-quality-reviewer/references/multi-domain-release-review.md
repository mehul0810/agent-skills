# Compact Multi-Domain Release Review

Use this as the single primary reference when one candidate needs security, performance, modularity, and accessibility review. It is a risk triage and release-blocker gate, not four exhaustive audits.

## Candidate Contract

Establish once:

- Commit/package/build identity and target WordPress/PHP/browser/runtime.
- `assuranceProfile`: standard, or elevated with explicit high-traffic, sensitive-data, storage/migration, API, queue/webhook, or multi-tenant risks.
- Changed files, entry points, user journeys, stored/public contracts, data volume, and exclusions.
- Existing project commands, baseline budgets, accessibility target, and release risk.

Inspect the diff plus enough owners/callers/runtime evidence to avoid local-only conclusions. Optional scanners are evidence, never the pass authority.

## Compact Matrix

| Area | Inspect | Release blocker | Minimum proof |
|---|---|---|---|
| Security | Auth/capability/ownership, nonces, validation/escaping, SQL/files/URLs, secrets/PII, webhooks/dependencies | Credible unauthorized access, injection, secret/data exposure, unsafe upload/SSRF, or missing sensitive negative proof | Boundary-specific negative tests and exact package/dependency evidence |
| Performance | Query/cache/options/remote/jobs, admin/editor bootstrap, assets and changed user path | Unbounded hot path, availability/queue risk, known severe regression, or claim without comparable evidence | Same-condition baseline/after; scale risks add a measured capacity envelope |
| Modularity | Entry point to business/data owner, duplicate invariants, coupling/cycles/globals, public contracts, comments/tests/dead code; apply the non-breaking checkpoint for launched contracts and migrations | Multiple owners for critical invariant, unsafe cycle/state, untestable release-critical change, or accidental public/data break | Characterization/behavior tests and evidence that ownership/coupling improved |
| Accessibility | Critical states, semantics/names, keyboard/focus, errors/status, contrast/reflow/motion, author and visitor flows | Keyboard trap, unusable critical task, missing critical name/error, or inaccessible editor/auth/setup flow | Candidate-bound automated scan plus manual keyboard and named AT/browser proof |

Derive assurance risks from scope. Give each area a disposition; a passing packaged multi-domain review cannot mark a whole domain inapplicable. Bind every release receipt to the target commit and package digest. For each claim, **the same receipt** must carry the permitted execution kind, passing outcome and supporting cases or measurement. A static `security_negative` record and an unrelated green test cannot prove authorization.

- Security: match actor, action and resource to the observed boundary outcome. For an external webhook, distinguish state-changing callbacks from read-only ones, and independently assess resource abuse. Require authorization and work-limit proof where each applies.
- Performance: bind `performance_comparable` to identical conditions, metric, unit and statistic. Compare the actual budgeted statistic, not a separately typed summary; runs are not requests. Record observations, variability and provenance for tail claims. Scale proof adds workload, headroom, saturation, storage/restore and failure results. Explain why a synchronous path has no queue or why tenant fairness does not apply; do not waive a real queue or multi-tenant boundary.
- Modularity: `modularity_behavior` covers the public entry point, consumer and before/after behavior. For touched legacy debt, compare file logical lines, oversized-method count and largest changed method on the same path. Bind any approved exception to its measure and limit. A clean review can attach the ratchet or staged migration evidence to the domain without inventing a fixed finding.
- Accessibility: use a digested scan and observed journey evidence, subject to the owner exclusion below. Code inspection supports a scoped source review, not a packaged release pass.

For applicable accessibility, set `accessibilityClaim: scoped_review`; a release review is not WCAG certification. Explicit AA conformance audits use the detailed accessibility mode and its formal evidence matrix instead.

For the formal report, bind `targetIdentity.commitSha` to an immutable 40-character commit and add the package path/digest when reviewing a build. `multi` mode includes all four domain dispositions; a focused mode includes only its named domain. An applicable domain needs concrete evidence, while `not_applicable` needs a specific reason. A fixed `P0`/`P1`, release-critical, migration, or public-contract finding needs a passing fresh source-aware review receipt for the same commit. The JSON schema defines the portable shape; the bundled validator also enforces cross-field, pass-only, and numeric semantics.

## Escalate Deliberately

Load one detailed mode reference only when:

- A `P0`/`P1` or ambiguous trust/scale/accessibility boundary needs deeper analysis.
- Fixing the issue requires mode-specific remediation rules.
- The owner requested an exhaustive audit of that area.

After resolving that mode, return to this matrix. Do not load a second detailed mode unless another confirmed blocker cannot be judged safely from the compact contract.

## Output And Stop

Findings remain evidence-backed and severity ordered. For formal/release-critical work, materialize `shared/schemas/wp-quality-review.schema.json` and run the bundled validator. Exit zero means the **report is valid**, not that the candidate passed. Read its conclusion: a stable in-budget result can pass a non-regression gate without being an optimization; a well-evidenced missed budget belongs in a valid non-passing report.

Use compact structured receipts, not “passed” prose: evidence records a kind, concrete pointer, observed fact, and runtime environment when relevant; validation records the exact command or journey, expected and observed result, disposition, environment, and artifact. Performance fixes state direction, numeric budget, identical structured before/after conditions, and elevated tail/overload evidence when triggered; a regression or missed budget is not a fix. Accessibility manual proof names a recognizable browser and assistive technology when tested. For excluded VoiceOver, record `voiceOverExclusion` (`status: excluded_by_owner`, `authority`, `reason`, `claims: not_verified`) ; packaged scoped reviews add `accessibility_keyboard` proof. Keep scans/other gates. No substitute reader or completion block for excluded proof; formal claims require evidence. The validator can reject malformed or semantically incomplete receipts, but a reviewer must still verify that the referenced artifacts exist and support the observation.

Overall `pass` requires:

- No unresolved `P0`/`P1`.
- Every matrix area has a disposition and evidence or a justified non-applicable reason.
- Every claimed fix reran its original failure clause.
- No required proof gap remains.

Do not claim comprehensive security, capacity, maintainability, accessibility, or WCAG conformance from this compact review.
