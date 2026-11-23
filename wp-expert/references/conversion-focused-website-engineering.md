# Conversion Focused Website Engineering

Use for WordPress marketing, pricing, product, campaign, booking and checkout journeys. Preserve enterprise/VIP, accessibility, SEO, privacy and performance standards.

Use as primary; add at most one support reference for a confirmed risk.

## Conversion Engineering Principles

- Start with the visitor, offer, trust, speed and task completion. Set the outcome and guardrails before optimizing.
- Reject dark patterns, not just misleading scarcity, hidden costs or consent-hostile tracking. Make refusal understandable and usable; keep dialogs accessible.

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
- For enterprise buyers, organize by role or task; ground each claim in a relevant case, workflow or control and its outcome. Publish only supported proof, policies and guarantees.
- Resolve the actual objection: show payment/shipping terms, relevant evidence, or a clear help path rather than a generic FAQ.
- Mobile: primary CTA and form path must be usable without pinch/zoom or layout jumps.

## Choose The Right Element

- **Discover:** For a broad catalog, let people start with a known name or the job they need done. Pair recognizable thumbnails or icons with text. Show what matched, a useful no-match route and a way to clear filters. A short, stable list needs links, not a search application.
- **Compare:** Frame product views consistently so scale or crop does not imply a false difference. Align distinguishing attributes in the same units; show shared facts once. Pair selection color with a visible name or mark. On a phone, keep the option name with each value. Change a selection, resize and return; check the values as well as the control.
- **Understand:** For an invisible service, pair an example input with its verdict and explanation. For software, follow the same sample through the workflow. Distinguish a view-only illustration, a playable recording, a resettable sample and a live action; label and test only what is offered. Prefer a still when it answers the question.
- **Look up or recover:** Switch from a spacious product story to compact, labeled facts or steps. Let someone start from a symptom as well as a product name. Keep orientation when a desktop index becomes a mobile disclosure; provide a direct help or prerequisite path without forcing purchase.

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
- For rich marketing pages, distribute approved product or process evidence across the journey. Pair each visual with a visitor's question and next step. A hero illustration is not enough. If proof or access is missing, disclose it; use labeled concepts or truthful text, not invented customers, results or checkout states.
- For each requested animated section, name its trigger, starting state, visible change and result. A fabric swatch might update the same chair image and reveal its care instructions. Exercise the sequence; preserve its answer and action in static and reduced-motion states. Skip canned reveals and leave bounded static requests static.
- Tie typography, imagery, copy, and composition to the offering. If swapping the logo leaves the entire story equally plausible for an unrelated business, inspect missing specificity before adding visual effects. This is a diagnostic, not a ban on familiar patterns or restrained brands.
- Follow the primary CTA to its destination: compare its promise with the actual next step, required information, cost, and commitment. Distinguish free setup from paid activation, monthly equivalents from annual billing, and exploration from purchase when applicable.
- For inquiries, explain the next step and any verified response expectation; do not invent service-level promises. Offer a relevant lower-commitment path when it helps the visitor, not another competing button by default.
- Walk each tested width in reading order: when are the promise, evidence, price conditions and next action available? Exercise requested sequences there. Check that mobile comparisons retain meaning and sticky controls do not cover content or focus. Record missing evidence or destinations; a hero or plan is not implementation proof.
- Record inspected URL/artifact, viewport, state, CTA destination, result, and untested steps in the existing proof record. Screenshots prove visible states, not successful submission, user comprehension, or conversion uplift. Use synthetic safe journeys for forms; do not submit live inquiries just to test a reference site.

Test the actual next step with available tools. Hooks can check evidence fields and artifact identity, not taste. Report unrun steps; do not invent a harness.

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
