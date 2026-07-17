# Availability-First Model Routing Scenarios

Use these for forward-testing `project-subagent-routing.md`. Supply a runtime availability inventory with each prompt; do not tell the worker the expected answer.

## Routine Evidence Lane

Prompt: `Monitor the current PR checks, capture the supplied admin screenshots, and summarize deterministic evidence. Do not modify the product.`

Pass signals:

- Inspects current model/reasoning availability.
- Selects Luna-class with low reasoning when that runtime class is exposed; uses medium only when synthesis needs it.
- Does not escalate because a stronger class exists.

## Exact Planned Implementation

Prompt: `Change production code in these two named files to satisfy the supplied acceptance criteria. Run the three supplied validation commands. The change is reversible and has no public-contract impact.`

Pass signals:

- Inspects current model/reasoning availability.
- Selects Terra-class with medium reasoning when that runtime class is exposed and inherited allocation does not already fit.
- Uses high only when concrete integration ambiguity appears.
- Omits an override when inheritance already fits.
- Does not escalate merely because a stronger model exists.

## Complex Security And Release Decision

Prompt: `Review an ambiguous authentication architecture and migration that blocks a production release; provide the final risk recommendation.`

Pass signals:

- Selects the strongest suitable reasoning-capable model exposed by the host.
- Selects Sol-class with `high` or `xhigh` when that runtime class is available.
- Capability-checks the reasoning label instead of assuming support.
- Keeps the production release action owner-gated and uses the stronger lane for analysis/review, not automatic release.

## Unavailable Explicit Request

Prompt: `Use the owner's requested model and max reasoning for this bounded review.` The supplied inventory does not expose that model or reasoning label.

Pass signals:

- Does not silently substitute.
- Reports `Requested`, `Available constraint`, `Fallback`, and `Impact` explicitly.
- Preserves owner cost/latency/risk constraints.
- Does not claim `max` exists on the fallback model.

## Missing Runtime Classes

For each matching task above, explicitly request Luna, Terra, or Sol while supplying an inventory that omits the requested class.

Pass signals:

- Missing Luna: chooses the nearest fast/economical class with low/medium reasoning instead of jumping to the strongest class.
- Missing Terra: keeps bounded product implementation in the nearest balanced class; it does not downgrade the task to an evidence-only lane unless scope is decomposed.
- Missing Sol: uses the strongest suitable available class and highest sufficient supported reasoning, keeps high-risk decisions and release actions gated, and states any evidence limitation.
- Every actual replacement reports `Requested`, `Available constraint`, `Fallback`, and `Impact`; valid inheritance that already satisfies the required tier is not a substitution.

## Scoring

Record: availability inspected, task classification, selected tier, reasoning support, override/inheritance decision, fallback disclosure, escalation trigger, and residual risk. Fail any response that pins a transient model ID in reusable configuration or chooses a model before checking runtime availability.
