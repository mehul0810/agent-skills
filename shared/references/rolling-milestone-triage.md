# Rolling Milestone Triage

Use this for dynamic milestone and release-train planning. Keep release trains explicit, but do not force planning into a rigid version ladder when issue type, release intent, or urgency say otherwise.

## Train Model

Maintain these lanes when product maturity warrants it:

- Current train: the active milestone being burned down now.
- Next train: the next milestone already triaged enough to prevent idle planning gaps.
- Horizon train: a third train for useful backlog shaping, not active implementation.
- Patch/hotfix train: a dynamic milestone inserted between planned trains when evidence shows an urgent fix is needed.

Keep 2-3 upcoming milestone trains triaged when useful. New milestone implementation should usually start once current-train work is complete, deferred, or owner-gated.

After verified production release and post-release reconciliation, create the next dated trains from current release intent:

- Patch `x.y.(z+1)`: only when shipped-feature fixes or release hardening are evidenced; set the exit date 3-4 calendar days out.
- Minor or major next SemVer: set the exit date 15 calendar days out. Choose minor versus major from roadmap and contract impact; do not manufacture a major train merely to fill the horizon.

The due date is the release exit date. At T-1, implementation must already be merged into `release/<version>`; freeze scope and admit only release-proof fixes. Never start a later train prerelease before the prior train reaches production.

## Issue Type Routing

- Patch/hotfix train: regressions, security/privacy fixes, support escalations, release blockers, broken packaging, urgent compatibility issues, or production incidents.
- Minor train: near-term features, UX improvements, docs, tooling, tests, refactors, and bounded product improvements.
- Major train: breaking architecture, public contract changes, migrations, pricing/packaging shifts, or broad positioning changes.
- Research lane: unproven ideas, exploratory spikes, or opportunities that need evidence before milestone commitment.

## PO Responsibilities

- Do not blindly drain every issue; decide the active train scope first.
- Triage the current train, next train, and horizon train when product maturity and backlog pressure justify it.
- Create patch/hotfix milestones only when regression, security, support, or release evidence supports urgency.
- Use issue type, release intent, urgency, and evidence to choose the right train instead of forcing every item into the next version number.
- Apply documented formulas and live release evidence to set or adjust milestone metadata when the choice is reversible and conflicts with no published commitment. Ask only when due date, scope, or release intent remains materially conflicting after bounded research, or changes an external commitment/hard gate.

## CTO Responsibilities

- Monitor products that have no next train, stale due dates, overloaded current trains, or too many untriaged issues.
- Challenge fixed-cadence milestone planning when dynamic need suggests a patch/hotfix train or a different release split.
- Expect product threads to keep future trains shaped enough that work does not stall after the active train closes.

## Practical Rules

- Do not open a dynamic patch/hotfix train without concrete evidence.
- Do not let horizon-train triage turn into premature implementation.
- Keep milestone names aligned to explicit release intent.
- If no future train is ready, shape the evidence-backed next train or research lane instead of silently draining random issues or waiting on the owner by default.
