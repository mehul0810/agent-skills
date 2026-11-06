# Synthetic Private Release Decision

This exercise-only record belongs to case-supp-11. The separate local-versus-hosted
decision in private-principles.md belongs to case-supp-04. Neither is live authority.

## Decision At The Time

- Product/candidate: Forms Lab 1.4.0, candidate `f104abc`.
- Class: reversible release-scope decision with material compatibility uncertainty.
- Options considered: include the new editor adapter now; defer the adapter and
  retain the existing native editor path; delay the whole release pending proof.
- Chosen path: defer the adapter and retain the native path while preparing the
  remaining release scope. This was a preparation decision, not release approval.
- Basis: one staging workflow passed; the adapter's supported-version runtime
  matrix was incomplete. No production demand or latency measurement was available.
- Relevant private principles: 1 (customer data/editor ownership), 2 (reliable
  native behavior), and 4 (reversibility). IDs refer to private-principles.md.
- Confidence: medium for the bounded scope decision; compatibility unverified.
- Rollback: leave the adapter feature flag disabled and restore the native path
  if the staging experiment changes behavior; no production migration is planned.
- Expected outcome: preserve editor serialization while obtaining missing runtime
  evidence. This is an expectation, not a measured result.
- Review trigger: after the adapter's supported-version matrix completes, or if
  the existing native path fails the exact-candidate workflow.

## Later Owner Disposition

- The owner accepts the deferral for now, but changes the assumption that the
  oldest supported WordPress version is low priority: a customer depends on it.
- Revisit after the next release, including that version in the runtime matrix.
- No general policy change, production release approval, or live verification
  was supplied. Actual post-release outcome and independent verifier are unknown.
