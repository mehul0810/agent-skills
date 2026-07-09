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

For high-converting pages:

- Above the fold: clear outcome, audience fit, primary CTA, proof signal, and no competing visual noise.
- Content hierarchy: problem, promise, mechanism, proof, offer, objections, details, CTA, FAQ, fallback path.
- CTAs: specific verbs, consistent destination, visible at natural decision points, and keyboard accessible.
- Forms: minimal fields, clear labels, inline errors, privacy expectation, success state, and recovery for failed submission.
- Trust: testimonials, logos, reviews, case studies, security/privacy statements, guarantees, transparent pricing, support expectations.
- For enterprise audiences, prefer proof-led hierarchy: claim, evidence, workflow/control, and outcome. Use role/use-case/task-based IA and real screenshots or customer evidence before decorative filler.
- Friction reducers: FAQs, comparison tables, social proof, payment/shipping clarity, no surprise costs, visible contact path.
- Mobile: primary CTA and form path must be usable without pinch/zoom or layout jumps.

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

## Enterprise Quality Gate

A conversion-focused build is not complete until:

- CTA path works for desktop and mobile.
- Forms cover validation, spam, error, success, duplicate submit, and privacy states.
- Tracking events fire once with consent respected.
- Page remains fast under expected traffic and preserves Core Web Vitals.
- SEO-critical content is crawlable and semantically structured.
- Accessibility checks cover keyboard, focus, labels, contrast, headings, and reduced motion.
- Rollback is clear for templates, scripts, tracking, and form integrations.
