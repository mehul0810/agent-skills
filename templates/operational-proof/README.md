# Reproducible Operational Proof

Adapt this template for an explicitly selected recurring product workflow, not
every task. Product scripts, fixtures and acceptance truth stay in that product;
the harness validates portable records. Do not create another memory store,
automation or public dashboard. Existing issue/task artifacts hold the run;
agent-book may link a durable cross-product decision, not copy its logs.

## Prepare One Workflow

Choose a real journey such as configuration -> save -> reload -> retained value.
Define named product-local states (empty, configured, failed save), allowed roles,
immutable fixture inputs and exact candidate/runtime identity. Use an isolated
disposable environment, never reseed a live site. Prefer existing setup commands.
Record the reviewed setup command and teardown ownership before execution;
destructive cleanup still requires its own authorization.

Readiness must be observable: expected data/build identity and settled application
state, with a bounded timeout and explicit failure. Sleeping for a fixed duration
does not establish readiness. Optional diagnostics must be read-only, restricted
to test/development environments, privacy-allowlisted and unavailable in production.
Do not add a diagnostics endpoint when existing evidence suffices.

Fixture setup is not journey proof. A configured fixture may test rendering, but
only normal UI controls can prove configure/save/reload. A readiness timeout is
blocked or failed evidence, never a successful skipped assertion. Include an
error/retry case and retain failed attempts alongside repaired results.

## One Linked Run

Use [the run worksheet](run.md) in the existing private task artifact directory.
Link originals rather than copying logs into prompts or agent-book. Summaries
must preserve failures, omissions, source hashes and retrieval paths. Do not
commit real credentials, customer data, approval text or private run artifacts.

Reuse harness schema v1: `runId`, `scenario`, measured `startedAt`/`durationMs`,
`checks`, `metrics`, `lineage` and `measurement`. In `lineage`, connect
`workItemId`, `decisionId`, `actionId`, `verificationId` and `artifactPointer`
only when real identities exist. Do not fabricate IDs to fill a form. Validate
the sanitized record with the owning project's pinned harness `validate-run`.
Record validation checks structure, not truth, authorization or actual runtime
adoption. Missing telemetry is unavailable, not fabricated zero usage.

The worksheet itself is the small evidence index. Keep one result pointer per
action, source/build identity and observation time. Distinguish observed facts,
interpretations and proposed next actions. Historical permission is never current
authorization. Recheck current owner direction and state before consequential work.

## Visual And Performance Variants

For substantial visual work, validate IA/block ownership and author editability
before fine styling. Preserve editable source and approved direction. Compare
structural views and finished captures; neither replaces the other. After asset
export or build, verify the destination representation and its real interactions.
Use cheap previews before expensive renders. Existing source-blind validation
still requires a separate actor and unexposed acceptance evidence.

Before/after measurements need the same fixture, environment, workload and sample
window with source/candidate identities. Record changed variables and unavailable
metrics. Headless/software-rendered timings are not hardware performance claims.
Use real-control journeys in addition to named starting states.

## Admission

Pilot one workflow before generalizing. Measure successful completion, missed
defects, false findings, repeated setup, retries and elapsed time where observed.
Keep the existing implementation if the added machinery costs more than it saves.
This template alone proves neither a native product workflow nor a speedup.
