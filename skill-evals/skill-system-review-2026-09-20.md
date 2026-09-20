# Skill System Review — 2026-09-20

## Scope And Method

Reviewed all thirteen existing `SKILL.md` files, their routers, reference fan-out, route budgets, scenario coverage, agent profiles, behavior-baseline bindings, and repository validation on `main` at `48e0ee31060ef47b55c74c1dc9300af4bd624482`.

The baseline completed without errors. It reported fifteen low-headroom references and fifteen route-budget warnings; these are capacity signals, not failed contracts. No baseline source file was rewritten here: such a change must have a new, genuinely fresh-agent behavior run rather than a changed digest or fabricated receipt.

## Per-Skill Decision

| Skill | Review result | Change now | Next evidence-gated improvement |
| --- | --- | --- | --- |
| `behavior-validator` | Clear source-blind boundary and independent proof output. | Keep unchanged. | Run a packaged-candidate pilot before extending probes. |
| `content-writer` | Strong claim, search, readability, and product-truth boundaries; no dedicated conversion-copy route. | Keep baseline behavior unchanged. | Add a conversion-writing reference plus fresh-agent scenarios for CTA/destination/measurement decisions. |
| `loop-steward` | Policy-first, fail-closed control plane with explicit review separation. | Keep unchanged. | Test an actual protected-branch exception before altering its direct-main policy language. |
| `product-video-producer` | Good stage router, asset truth, and delivery contract; its story/edit composite route is nearly full. | Keep baseline behavior unchanged. | Split post-production from programmatic-motion guidance after a fresh video production run proves the boundary. |
| `wp-contributor` | Appropriate upstream/process boundary and current-official-source rule. | Keep unchanged. | Add only an evidence-backed new contribution surface when it recurs. |
| `wp-expert` | Correctly thin; direct specialist routing avoids broad WordPress loading. | Keep unchanged. | Re-evaluate only if routing collision telemetry shows a new ambiguity. |
| `wp-plugin-expert` | Focused plugin ownership with a useful router; skill body is near its headroom threshold. | Keep unchanged. | Trim only after a fresh implementation pilot identifies a repeatable hot-path miss. |
| `wp-portfolio-cto` | Strong cross-product escalation boundary; avoids duplicating product execution. | Keep unchanged. | Split model/capacity routing from task-packet routing after fresh governance evidence. |
| `wp-product-docs-writer` | Clear factual-document boundary and compact claim ledger. | Keep unchanged. | Add new artifact types only when their source-of-truth differs from existing release docs. |
| `wp-product-orchestrator` | Covers product value, release, authority, and specialist handoff without owning implementation. | Keep unchanged. | Add product-growth specialization only if repeated work cannot stay in PO + content/site lanes. |
| `wp-quality-reviewer` | Focused modes and proof/review separation are sound. | Keep unchanged. | Split the security reference only if routine review repeatedly needs a smaller distinct workflow. |
| `wp-site-expert` | Correct site/CRO/SEO ownership; visual and frontend-taste routes are near capacity. | Keep unchanged. | Separate source qualification/ownership from visual proof only after fresh visual evidence. |
| `wp-theme-expert` | Strong native WordPress ownership and design-to-theme boundary. | Keep unchanged. | Use the same visual-boundary evidence before any split. |

## Implemented Improvement

Added `wp-service-business-development` for a distinct recurring gap: consulting/service qualification, paid discovery, outcome-led offer and scope design, estimate ranges, retainer boundary, and capacity tradeoffs. It deliberately stops before implementation, outreach, signing, invoicing, pricing changes, or legal/financial advice.

Its dedicated route is `npm run context:business:service`. Added precise development, marketing, and business context commands so the former broad aliases are explicit compatibility defaults rather than implying full-domain coverage.

## Recommendations, In Order

1. Pilot the new service skill on three real but bounded cases: one ambiguous inbound, one proposal/discovery decision, and one retainer or capacity decision. Record decision quality, owner corrections, preparation time, missing context, and outcome; do not claim revenue or token savings from one pass.
2. After a fresh-agent pilot, add the deferred `content-writer` conversion-writing route. It should require intent-to-offer alignment, CTA destination proof, claim ledger, friction/objection handling, measurement, and no invented uplift.
3. Then split `shared/references/project-subagent-routing.md` into model/capacity allocation and task-packet/context routing. It is a true two-stage concern and is currently 99% of its reference budget.
4. If visual work repeats, split `visual-to-wordpress-implementation.md` by source/ownership preflight versus implementation/proof. Do not fragment it before proving the additional routing cost is lower than the current one-reference load.
5. If video production repeats, separate post-production/delivery QA from programmatic motion production. Preserve the existing product-video validation manifest and run a fresh evidence scenario before promotion.

## Deliberate Non-Additions

No standalone product-growth skill was added: product prioritization already belongs to `wp-product-orchestrator`, marketing artifacts to `content-writer`, and website conversion implementation to `wp-site-expert`. A second business skill should be considered only after the new service lane produces three repeated, distinct workflows; likely split candidates would be proposal/discovery and retainer/client-success, not a broad catch-all sales skill.

## Verification Required For This Change

Run `npm test`, `npm run harness`, each new precise context command, the skill-creator validator for the new skill, and `git diff --check`. A passed static suite verifies contracts and routes; real pilots remain required to substantiate efficiency or commercial-effect claims.
