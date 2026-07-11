# Disposable Proof Environment Lifecycle

Use this reference when a WordPress proof, package check, screenshot, OAuth flow, or release validation needs a temporary environment.

## Select the runner

Use an ephemeral non-Studio runner by default. WordPress Playground, `wp-env`, or a containerized WordPress runtime are suitable when they meet the acceptance criteria.

Use Studio only for a named Studio-specific capability, such as Studio-only local integration, interactive local OAuth/consent proof, or a capability explicitly required by the task. Do not choose Studio merely because it is already installed.

## Create a Studio proof environment

Before creating a Studio site, create a manifest and registry entry with: worker/task owner, issue or PR/work-item link, purpose, tool, exact path, created time, expiry, `agent_created_disposable` ownership, and proof-hold state.

For Studio, use only the agent-managed root from `agent-loop/policies/proof-environment-policy.json` and write the matching `.agent-loop-proof-environment.json` manifest in the site path. Default expiry is 24 hours; release proof may use 72 hours. Any longer retention needs an explicit owner-approved reason and expiry.

## Cleanup and protection

The creating worker owns cleanup. At task exit, preserve only redacted proof evidence, remove ephemeral credentials and tokens, mark the registry item `ready_for_cleanup`, stop the site, and delete it through the policy-gated adapter.

Never delete a Studio site based on its name, `/private/tmp` path, or age alone. Deny deletion when the site is owner-created, unmarked, pre-policy, pinned, active, proof-held, outside the managed root, or when the registry and on-disk manifest do not match. Report those sites to the PO or owner instead.

The PO verifies cleanup during proof/release reconciliation. Loop Steward reports lifecycle drift but does not delete product proof sites.
