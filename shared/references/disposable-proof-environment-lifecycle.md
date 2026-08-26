# Proof Environment Selection And Lifecycle

Use this reference when a WordPress proof, package check, screenshot, OAuth flow, or release validation needs a temporary environment.

## Selection Preflight

Every implementation, Engineering Review, and Release Readiness task declares the runner, exact site/environment identity, mutation level, allowed fixtures, cleanup owner, and reason before execution. Ask in order:

1. Can the product's primary owner-provided Studio site prove the contract safely with read-only checks or reversible task-owned fixtures? Use it when yes, while protecting user data and existing state.
2. If isolation, compatibility, destructive fixtures, package installation, or fixture-heavy proof is needed, can WordPress Playground, `wp-proof`, `wp-env`, or a containerized non-Studio runner prove it? Use the cheapest sufficient disposable route.
3. If neither route is sufficient, request explicit owner approval before creating a new Studio site. State the missing capability and why both prior routes fail. Never create issue-number-named or single-proof Studio sites by default.

Proof from an unapproved temporary Studio site is a process/proof gap, not accepted Engineering Review or Release Readiness evidence.

## Studio policy gate

Without explicit owner creation approval plus a live lifecycle policy and policy-gated adapter, do not create an agent-managed Studio proof site. Never delete Studio sites without exact owner authorization for the identified targets. An existing owner-provided primary Studio site may be used under the selection preflight, but it remains owner-owned and report-only for lifecycle actions.

When such a policy exists, verify it live before creation and require it to define the managed root, registry, on-disk manifest schema, agent ownership marker, expiry semantics, proof holds, and cleanup adapter. Missing or conflicting fields fail closed. Expiry is a stale-resource review trigger, not deletion permission.

## Cleanup and protection

The creating worker owns cleanup evidence. At task exit, preserve only redacted proof evidence, remove task credentials and tokens, and report the environment state. Mark, stop, or delete an agent-managed Studio site only when the live policy authorizes the exact transition and the PO has reconciled proof.

Never delete a Studio site based on its name, `/private/tmp` path, age, or expiry alone. Existing temporary Studio sites are inventory/discovery only until the owner approves exact cleanup targets. Deny deletion when the lifecycle policy or adapter is unavailable; the site is owner-created, unmarked, pre-policy, pinned, active, proof-held, or outside the managed root; the registry and on-disk manifest disagree; or cleanup evidence is incomplete. Report those sites to the PO or owner instead.

The PO verifies cleanup during proof/release reconciliation. Loop Steward reports lifecycle drift but does not delete product proof sites.
