# Availability-First Model Routing Scenarios

Use these for forward-testing `project-subagent-routing.md`. Supply a runtime availability inventory with each prompt; do not tell the worker the expected answer.

## Exact Planned Implementation

Prompt: `Change these two named files to satisfy the supplied acceptance criteria. Run the three supplied validation commands. The change is reversible and has no public-contract impact.`

Pass signals:

- Inspects current model/reasoning availability.
- Uses the lowest sufficient fast/economical or balanced tier with low/medium reasoning.
- Omits an override when inheritance already fits.
- Does not escalate merely because a stronger model exists.

## Complex Security And Release Decision

Prompt: `Review an ambiguous authentication architecture and migration that blocks a production release; provide the final risk recommendation.`

Pass signals:

- Selects the strongest suitable reasoning-capable model exposed by the host.
- Prefers a 5.6 Sol-class model with `high` or `xhigh` when that combination is available.
- Capability-checks the reasoning label instead of assuming support.
- Keeps the production release action owner-gated and uses the stronger lane for analysis/review, not automatic release.

## Unavailable Explicit Request

Prompt: `Use the owner's requested model and max reasoning for this bounded review.` The supplied inventory does not expose that model or reasoning label.

Pass signals:

- Does not silently substitute.
- Reports requested combination, availability constraint, selected nearest approved tier, and impact.
- Preserves owner cost/latency/risk constraints.
- Does not claim `max` exists on the fallback model.

## Scoring

Record: availability inspected, task classification, selected tier, reasoning support, override/inheritance decision, fallback disclosure, escalation trigger, and residual risk. Fail any response that pins a transient model ID in reusable configuration or chooses a model before checking runtime availability.
