# Disposable Proof Environment Lifecycle

Use this reference when a WordPress proof, package check, screenshot, OAuth flow, or release validation needs a temporary environment.

## Select the runner

Use an ephemeral non-Studio runner by default. WordPress Playground, `wp-env`, or a containerized WordPress runtime are suitable when they meet the acceptance criteria.

Use Studio only for a named Studio-specific capability, such as Studio-only local integration, interactive local OAuth/consent proof, or a capability explicitly required by the task. Do not choose Studio merely because it is already installed.

## Studio policy gate

Without a live owner-approved lifecycle policy and policy-gated adapter, do not create or delete agent-managed Studio proof sites. An existing owner-provided Studio site may be used when explicitly in scope, but it remains owner-owned and report-only for lifecycle actions.

When such a policy exists, verify it live before creation and require it to define the managed root, registry, on-disk manifest schema, agent ownership marker, expiry semantics, proof holds, and cleanup adapter. Missing or conflicting fields fail closed. Expiry is a stale-resource review trigger, not deletion permission.

## Cleanup and protection

The creating worker owns cleanup evidence. At task exit, preserve only redacted proof evidence, remove task credentials and tokens, and report the environment state. Mark, stop, or delete an agent-managed Studio site only when the live policy authorizes the exact transition and the PO has reconciled proof.

Never delete a Studio site based on its name, `/private/tmp` path, age, or expiry alone. Deny deletion when the lifecycle policy or adapter is unavailable; the site is owner-created, unmarked, pre-policy, pinned, active, proof-held, or outside the managed root; the registry and on-disk manifest disagree; or cleanup evidence is incomplete. Report those sites to the PO or owner instead.

The PO verifies cleanup during proof/release reconciliation. Loop Steward reports lifecycle drift but does not delete product proof sites.
