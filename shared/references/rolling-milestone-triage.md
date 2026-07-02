# Rolling Milestone Triage

Use this for dynamic milestone and release-train planning. Keep release trains explicit, but do not force planning into a rigid version ladder when issue type, release intent, or urgency say otherwise.

## Train Model

Maintain these lanes when product maturity warrants it:

- Current train: the active milestone being burned down now.
- Next train: the next milestone already triaged enough to prevent idle planning gaps.
- Horizon train: a third train for useful backlog shaping, not active implementation.
- Patch/hotfix train: a dynamic milestone inserted between planned trains when evidence shows an urgent fix is needed.

Keep 2-3 upcoming milestone trains triaged when useful. New milestone implementation should usually start once current-train work is complete, deferred, or owner-gated.

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
- Surface owner decisions when due dates, scope, or release intent are ambiguous.

## CTO Responsibilities

- Monitor products that have no next train, stale due dates, overloaded current trains, or too many untriaged issues.
- Challenge fixed-cadence milestone planning when dynamic need suggests a patch/hotfix train or a different release split.
- Expect product threads to keep future trains shaped enough that work does not stall after the active train closes.

## Practical Rules

- Do not open a dynamic patch/hotfix train without concrete evidence.
- Do not let horizon-train triage turn into premature implementation.
- Keep milestone names aligned to explicit release intent.
- If no future train is ready, report the planning gap instead of silently draining random issues.
