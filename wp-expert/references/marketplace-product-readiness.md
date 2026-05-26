# Marketplace And Product Readiness

Use this for public plugins/themes, freemium/pro products, licensing, update servers, onboarding, telemetry, support diagnostics, marketplace compliance, and release packaging.

## Current Official Anchors

- WordPress.org plugin guidelines: https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/
- WordPress.org readme standard: https://developer.wordpress.org/plugins/wordpress-org/how-your-readme-txt-works/
- Plugin assets and banners: https://developer.wordpress.org/plugins/wordpress-org/plugin-assets/
- Plugin developer FAQ: https://developer.wordpress.org/plugins/wordpress-org/plugin-developer-faq/
- WordPress.org trademarks: https://wordpressfoundation.org/trademark-policy/

Marketplace rules, trademark policy, and platform review expectations are drift-prone. Verify current rules before release.

## Product Surface

- Define free, pro, trial, add-on, bundled, SaaS-backed, agency/internal, and WordPress.org distribution boundaries.
- Keep free features useful without deceptive lock-in or broken admin flows.
- Pro prompts should be honest, dismissible where appropriate, capability-gated, and not block core admin tasks.
- Onboarding should get the user to first value quickly without requiring unnecessary data sharing.

## Licensing And Updates

- Keep license checks resilient and non-destructive. A license outage should not break already-rendered frontend output unless the business model explicitly requires it.
- Separate license validation, update delivery, entitlement checks, and feature gating.
- Cache license status with expiry and manual refresh. Avoid remote calls on every admin/frontend request.
- Never expose license keys, customer emails, site tokens, or entitlement payloads in frontend output, logs, screenshots, or REST responses.
- For custom update servers, validate package integrity, version compatibility, rollback behavior, and download authorization.

## WordPress.org And Marketplace Compliance

- Comply with GPL-compatible licensing for distributed code/assets.
- Disclose external services, data sent, accounts required, paid features, and privacy implications in readme/admin UI.
- Do not phone home, track, or offload unrelated assets without explicit authorized consent and policy disclosure.
- Avoid trademark misuse in slug, name, branding, screenshots, and domain references.
- Keep generated/vendor/build assets reviewable and production-only.

## Support Diagnostics

- Provide a copy-safe system status report with redacted URLs, paths, tokens, salts, emails, IPs, and keys.
- Include WordPress/PHP/database versions, active theme, plugins, object cache, cron/queue status, REST health, rewrite status, and product settings relevant to support.
- Let admins control what is shared externally.
- Do not auto-send diagnostics without consent.

## UX And Documentation

- Add empty states, setup checklist, success states, failure recovery, contextual help, and links to docs.
- Keep admin UI aligned with WordPress patterns and premium brand feel.
- Document installation, update, rollback, minimum versions, compatibility, external services, data handling, and troubleshooting.
- Include screenshots and assets that match current UI and do not expose private data.

## Release Readiness

- Verify package contains runtime files only: no tests/dev tooling, source maps unless intentional, private config, unbuilt source-only assets, or secrets.
- Validate activation/deactivation/uninstall, upgrade from previous public versions, multisite behavior, PHP/WordPress minimums, and no fatal errors when dependencies are missing.
- Include changelog, migration notes, support notes, rollout plan, and rollback plan.

## Output Expectations

- State distribution target, free/pro boundary, license/update behavior, compliance concerns, support diagnostics, packaging checks, and release risks.
