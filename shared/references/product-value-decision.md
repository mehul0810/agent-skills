# Product Value Decision

Use this reference when researching, recommending, prioritizing, or materially reshaping a WordPress plugin/theme feature, workflow, UX surface, integration, or product capability. Do not load it for an exact implementation task whose product decision is already approved.

## Classify First

- `Mandatory`: confirmed regression, security/privacy protection, data integrity, compatibility, accessibility blocker, contractual requirement, or release blocker. Explain affected users and avoided harm, but do not let a speculative revenue score defer required work.
- `Value bet`: evidence supports a user or business outcome strongly enough to recommend `Now`, `Next`, or `Later`.
- `Research`: the problem or value remains uncertain. Recommend the cheapest evidence-gathering step, not implementation disguised as research.
- `Reject`: weak fit, duplicated capability, disproportionate lifetime cost, or no credible outcome.

## Compact Value Case

Every non-trivial recommendation states:

1. **User value:** exact user/segment, job or pain, current workaround, frequency/severity, and observable better outcome.
2. **Business value:** the expected effect on activation, adoption, retention, conversion, expansion, support cost, operational risk, reputation/trust, strategic fit, or ecosystem visibility. Separate direct outcomes from proxy metrics.
3. **Evidence and confidence:** classify inputs as measured product data, repeated user/support evidence, observed workflow evidence, current market/ecosystem research, or assumption. Link the smallest useful evidence set and state `high|medium|low` confidence.
4. **Reach and cost:** affected audience and frequency; implementation effort plus ongoing maintenance, support, compatibility, performance, security/privacy, documentation, migration, and opportunity cost.
5. **Decision and measure:** `Now|Next|Later|Research|Reject`, rationale, smallest useful scope or test, success/guardrail metric, baseline if known, target or decision threshold, measurement window, and kill/revisit condition.

Reach, impact, confidence, and effort are decision inputs, not an automatic truth-producing score. Compare like-for-like candidates when useful, but let mandatory risk, strategy, dependencies, evidence quality, and one-way-door consequences override arithmetic. Never invent revenue, demand, conversion lift, retention, active-install, or competitive evidence.

## Evidence For WordPress Products

Prefer live product evidence: analytics and funnels; activation/retention and feature use; support topics and resolution patterns; reviews with reproducible themes; opt-in research/interviews; sales or churn reasons; issue/PR history; runtime behavior; WordPress.org usage/download/support signals; Search Console and conversion data; and current official ecosystem guidance. Public competitor information may shape private analysis, but public issues remain neutral and claims stay verifiable.

One signal is rarely proof of value. Downloads, active installs, ratings, search rank, or request volume can be useful proxies, but pair them with the user outcome and product context. Absence of analytics is a measurement gap, not permission to manufacture certainty.

## Routing And Lifecycle

- Planner adds the compact value case to the implementation-ready packet or returns a research decision.
- PO duplicate-screens, compares candidates within the active strategy/train, and carries the value case into the GitHub issue. Acceptance criteria prove behavior; outcome metrics prove whether the bet created value.
- Workers implement the approved scope and report adjacent value opportunities without expanding the PR.
- Engineering Review verifies implementation/proof, not market success.
- PO reviews the metric or qualitative decision threshold after release and records `validated|mixed|disproved|unmeasured`; then continue, revise, retire, or create a focused follow-up.

Keep this proportional: a small reversible improvement may need five concise lines; a costly, strategic, or irreversible bet needs stronger evidence. Product value never waives enterprise engineering, accessibility, privacy/security, release, or owner-authority gates.

## Research Basis

Checked 2026-08-26:

- Strategyzer Value Proposition Canvas: customer jobs, pains/gains, and adjustment from customer evidence: https://www.strategyzer.com/library/the-value-proposition-canvas
- Intercom RICE: reach, impact, confidence, and effort as prioritization inputs: https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/
- GOV.UK Service Manual measurement guidance: define and use performance measures to improve a service: https://www.gov.uk/service-manual/measuring-success
- WordPress Plugin Developer FAQ: support, reviews, usage history, and readme/search signals: https://developer.wordpress.org/plugins/wordpress-org/plugin-developer-faq/
