# Conversion Focused Website Engineering

Use this for WordPress websites, landing pages, lead funnels, pricing pages, checkout flows, booking flows, product pages, campaign pages, and CRO improvements that must improve conversion while preserving enterprise, VIP, accessibility, SEO, privacy, and performance standards.

Use this as the primary conversion reference. Add only one support reference for a confirmed UX, SEO, privacy, performance, theme, commerce, or enterprise-proof risk; do not load the complete website stack by default.

## Conversion Engineering Principles

- Conversion starts with offer clarity, trust, speed, and task completion; decoration is secondary.
- Preserve accessibility, SEO, privacy, and performance while improving conversion.
- Avoid dark patterns, misleading scarcity, inaccessible modals, hidden costs, or consent-hostile tracking.
- Measure the right event before optimizing the layout.
- Optimize for the target visitor segment, not generic best practices.

## Conversion Brief

Before implementation, define:

```text
Business goal:
Primary conversion event:
Target visitor segment:
Traffic source:
Offer/value proposition:
Top objections:
Trust proof:
Primary CTA:
Secondary CTA:
Friction points:
Measurement plan:
Guardrail metrics:
```

## Page Architecture

Choose architecture for the visitor's decision, not a universal high-converting template:

- Above the fold: clear outcome, audience fit, primary CTA, proof signal, and no competing visual noise.
- Content hierarchy: select and order problem, promise, mechanism, proof, offer, objections, details, CTA, FAQ, and fallback path for the actual journey; not every page needs every section.
- CTAs: specific verbs, consistent destination, visible at natural decision points, and keyboard accessible.
- Forms: minimal fields, clear labels, inline errors, privacy expectation, success state, and recovery for failed submission.
- Trust: testimonials, logos, reviews, case studies, security/privacy statements, guarantees, transparent pricing, support expectations.
- For enterprise audiences, prefer proof-led hierarchy: claim, evidence, workflow/control, and outcome. Use role/use-case/task-based IA and real screenshots or customer evidence before decorative filler.
- Friction reducers: FAQs, comparison tables, social proof, payment/shipping clarity, no surprise costs, visible contact path.
- Mobile: primary CTA and form path must be usable without pinch/zoom or layout jumps.

## Business Model And Decision Path

Use these as conditional examples, not mandatory layouts. Preserve approved brand and information architecture; mixed businesses may need distinct entry paths rather than one overloaded homepage.

| Model | Decision to support | Useful progression |
| --- | --- | --- |
| SaaS | Is this useful, and what does starting commit me to? | Understand outcome, see workflow, evaluate trial/billing terms, activate. |
| Enterprise services | Can this team solve our problem with acceptable risk? | Establish buyer fit, show relevant case evidence, explain engagement, qualify inquiry. |
| Developer tools | Can I use this in my environment? | Explain capability, offer a working example, expose docs, support adoption; separate paid services when relevant. |
| Personal brand | Should I read, subscribe, learn, or hire? | Connect a consistent editorial subject to distinct audience needs and relevant offers, without forcing every reader into a sales funnel. |
| Creative studio | Is this the right craft and experience for our project? | Demonstrate work, expose relevant projects and services, provide direct contact; essential paths must not depend on immersive media finishing. |

## Demonstration And Expectation Continuity

- Select product media by the uncertainty it resolves. Show a meaningful input, action, and outcome where useful; a decorative dashboard crop is not workflow explanation. Apply the existing design-taste truth and asset rules; never invent customer proof or product states.
- Tie typography, imagery, copy, and composition to the offering. If swapping the logo leaves the entire story equally plausible for an unrelated business, inspect missing specificity before adding visual effects. This is a diagnostic, not a ban on familiar patterns or restrained brands.
- Follow the primary CTA to its destination: compare its promise with the actual next step, required information, cost, and commitment. Distinguish free setup from paid activation, monthly equivalents from annual billing, and exploration from purchase when applicable.
- For inquiries, explain the next step and any verified response expectation; do not invent service-level promises. Offer a relevant lower-commitment path when it helps the visitor, not another competing button by default.
- On mobile, review decision order as well as stacking: when the promise, evidence, price conditions, and action become available; whether comparisons remain understandable; and whether sticky controls obscure content or focus.
- Record inspected URL/artifact, viewport, state, CTA destination, result, and untested steps in the existing proof record. Screenshots prove visible states, not successful submission, user comprehension, or conversion uplift. Use synthetic safe journeys for forms; do not submit live inquiries just to test a reference site.

For materially changed journeys, test the visitor's actual next step with the project's available proof tooling. Deterministic checks can verify evidence fields and artifact identity, not subjective design quality; keep hooks out of taste scoring. Missing tooling or unrun steps remain explicit proof gaps, not prerequisites to invent a new harness.

## WordPress Implementation Rules

- Use block patterns, template parts, `theme.json`, and reusable blocks for editable marketing sections.
- Use custom blocks only for structured, dynamic, or constrained experiences that core blocks cannot maintain safely.
- Keep forms server-validated, nonce/capability appropriate, spam-protected, and privacy-aware.
- Avoid Custom HTML and shortcode blocks for new conversion sections when a native pattern/block/theme layer can preserve editability.
- Keep tracking code isolated, consent-aware, and documented.
- Do not add new analytics vendors, pixels, tag managers, experiments, telemetry, or conversion events unless requested, approved by the measurement plan, or already established by repo convention.
- Ensure landing page templates preserve canonical, schema, headings, and crawlable content.

## WooCommerce And Checkout

- Reduce checkout distractions without hiding required information.
- Preserve Checkout Blocks and Store API compatibility where applicable.
- Keep shipping, tax, payment, refund, subscription, and account behavior transparent.
- Treat payment, coupon, shipping-rate, and order-confirmation events as critical instrumentation points.
- Do not add synchronous remote calls to checkout without short timeouts and safe fallback.

## Measurement And Experimentation

- Define one primary metric and guardrails such as bounce, form error rate, checkout error rate, revenue, support tickets, CWV, and accessibility issues.
- For experiments, state hypothesis, audience, duration, sample risk, rollback, and data owner.
- Validate tracking in a safe environment or debug mode before production.
- Do not create duplicate events, PII leaks, or events that bypass consent.
- Do not declare a conversion win from local visual approval alone.
- Distinguish diagnostic clicks from the intended outcome, such as qualified inquiries, activation, completed tasks, or retained subscribers. Agent comprehension checks expose hypotheses; representative-user or product-outcome evidence is needed to establish actual comprehension or improvement.

## Enterprise Quality Gate

A conversion-focused build is not complete until:

- CTA path works for desktop and mobile.
- Forms cover validation, spam, error, success, duplicate submit, and privacy states.
- Tracking events fire once with consent respected.
- Page remains fast under expected traffic and preserves Core Web Vitals.
- SEO-critical content is crawlable and semantically structured.
- Accessibility checks cover keyboard, focus, labels, contrast, headings, and reduced motion.
- Rollback is clear for templates, scripts, tracking, and form integrations.
