# Analytics And Measurement Engineering

Use this for WordPress analytics, conversion tracking, event measurement, GA4/GTM/server-side tagging, WooCommerce funnels, lead attribution, privacy-safe telemetry, and validation of measurement without polluting production data.

Use alongside `conversion-focused-website-engineering.md`, `privacy-consent-data-governance.md`, `technical-seo-engineering.md`, `woocommerce-commerce-engineering.md`, and `ux-product-strategy-design-qa.md`.

## Measurement Principles

- Define the business question before adding tracking.
- Track events that support decisions, not every click.
- Respect consent, privacy law, platform policies, and client data contracts.
- Avoid PII in analytics payloads, URLs, data layer objects, logs, and debug screenshots.
- Validate events once per user action; duplicate events are worse than missing low-value events.
- Keep tracking resilient to theme changes, AJAX/REST flows, block rendering, and caching.

## Measurement Plan

```text
Business question:
Primary KPI:
Secondary metrics:
Guardrail metrics:
Events:
Properties/parameters:
Consent category:
Trigger source:
Validation method:
Owner:
```

## WordPress Implementation Patterns

- Prefer a small measurement abstraction or data layer helper over scattered inline scripts.
- Use block attributes, data attributes, or server-rendered event metadata only when safe and non-sensitive.
- Enqueue tracking only on relevant templates, blocks, forms, checkout steps, or admin/product surfaces.
- Do not make tracking scripts block rendering or critical interactions.
- Preserve page cacheability; avoid setting unnecessary cookies on public pages.
- For forms and checkouts, emit events from confirmed success states, not only button clicks.

## Consent And Privacy

- Classify events by consent purpose: essential, analytics, marketing, personalization, or support diagnostics.
- Do not fire analytics/marketing events before required consent.
- Keep consent state out of cache-unsafe server personalization when possible.
- Avoid sending email, phone, names, addresses, IP-derived precise location, raw order notes, or private content to analytics tools.
- Hashing PII does not automatically make it safe; verify client/legal policy.

## WooCommerce And Lead Funnel Events

Common event points:

- View item/list, select item, add to cart, remove from cart, view cart, begin checkout, add shipping, add payment, purchase, refund.
- Lead form view, field validation error, submit attempt, successful submit, duplicate submit blocked, booking confirmed, quote requested, demo scheduled.

Rules:

- Use stable item/order identifiers and totals allowed by the analytics policy.
- Avoid double-firing purchase events on reloads; use order meta or client guards where appropriate.
- Validate failed payment, abandoned form, and validation-error visibility when funnel diagnosis matters.

## Validation

- Use debug mode, test properties, staging containers, or preview tools when available.
- Confirm network requests, event names, parameters, consent state, and one-event-per-action behavior.
- Check logged-in/logged-out and cache-hit/cache-miss paths.
- Confirm blockers/ad-blockers degrade gracefully.
- Document any event that cannot be safely validated locally.

## Review Checklist

- Does every event answer a real business or UX question?
- Are consent and PII boundaries explicit?
- Are events fired from confirmed states rather than hopeful clicks?
- Are duplicate event risks handled?
- Does tracking preserve performance and cacheability?
- Is validation evidence included before declaring measurement complete?
