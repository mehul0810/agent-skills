# Security Threat Modeling And Review

Use this for high-risk WordPress security design, implementation, or review: public endpoints, admin actions, REST routes, uploads, webhooks, OAuth/API credentials, checkout/account flows, MCP/AI tools, imports, exports, privilege boundaries, and sensitive data handling.

## Official Anchors

- WordPress Plugin Security Handbook: https://developer.wordpress.org/plugins/security/
- WordPress Data Validation: https://developer.wordpress.org/apis/security/data-validation/
- WordPress Escaping: https://developer.wordpress.org/apis/security/escaping/
- WordPress Nonces: https://developer.wordpress.org/apis/security/nonces/
- WordPress REST API custom endpoints: https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/

Verify current official docs when exact policy, API behavior, vulnerability handling, or platform rules matter.

## Threat Model Contract

Before building or approving security-sensitive work, identify:

- Assets: content, user records, customer/order data, payment metadata, private media, API keys, OAuth tokens, logs, analytics, settings, generated files, and privileged actions.
- Actors: anonymous visitor, subscriber/customer, editor, shop manager, admin, network admin, integration, webhook sender, compromised account, malicious plugin/theme, insider, and automated abuse.
- Entry points: REST, admin-post, admin pages, legacy AJAX, forms, block editor panels, frontend scripts, webhooks, WP-CLI, cron/jobs, imports, uploads, feeds, XML-RPC, GraphQL, MCP/AI tools, shortcodes, and block render callbacks.
- Trust boundaries: browser to WordPress, WordPress to third-party API, editor to frontend, site to network, public to authenticated, user input to database, background job to external service, and AI/tool output to privileged action.
- Security invariants: who can do what, what data can be returned, which objects must be owned by the actor, what must never be logged/exposed, and which side effects require confirmation.

If the invariants cannot be stated clearly, stop and define them before coding.

## WordPress Authorization Rules

- Nonces are CSRF protection, not authorization.
- Menu visibility, hidden UI, disabled controls, or client-side checks do not authorize server actions.
- Every state-changing route, form, AJAX action, WP-CLI destructive command, webhook handler with side effects, and background action dispatcher needs an explicit capability or trust check.
- Check object ownership separately from global capability. A user allowed to edit posts is not automatically allowed to edit every post, order, attachment, term, option, user, or external account mapping.
- Use `current_user_can()` with object IDs where WordPress supports meta capabilities.
- For custom resources, map to a meaningful capability and enforce ownership/tenant boundaries in code.
- Multisite must distinguish site admin, network admin, current blog, target blog, and cross-site data access.

## Entry Point Review Matrix

REST routes:

- Every route has a meaningful `permission_callback`.
- Public routes return only intentionally public data and avoid leaking IDs that enable enumeration.
- Mutations validate capability, nonce/application password/OAuth context, object ownership, and request schema.
- Response schemas redact secrets, internal paths, private URLs, tokens, customer PII, and plugin internals.

Admin pages and forms:

- Every form mutation checks capability before nonce where possible, then validates nonce.
- Bulk actions validate each object, not only the list table screen capability.
- Settings saves validate option schema and reject unknown keys when strict ownership matters.

Legacy AJAX:

- Prefer REST for new interactive work.
- If AJAX is required for legacy compatibility, keep `wp_ajax_nopriv_*` rare, explicitly public, rate-limited when needed, and schema-validated.

Uploads and files:

- Use WordPress media/temp APIs where possible.
- Validate size, extension, MIME, path, image dimensions when relevant, and capability.
- Block path traversal, remote file surprises, executable uploads, SVG/script payloads unless a hardened sanitizer exists, and direct filesystem assumptions on cloud/VIP-style environments.

Webhooks and third-party callbacks:

- Verify signatures, timestamps, replay windows, event IDs, and source identity when the provider supports it.
- Make handlers idempotent and safe to retry.
- Never trust webhook object IDs without reconciling them to local records and ownership.

MCP, AI tools, and automation:

- Treat tool execution as a privileged integration surface.
- Require allowlists, explicit capability gates, narrow schemas, redaction, audit logs, rate limits, and safe dry-run/confirmation flows for destructive actions.
- Never let model-generated text become code, SQL, shell, file paths, redirects, or privileged action arguments without validation and allowlists.

## Common High-Impact WordPress Bugs

- IDOR/BOLA: route accepts a post/order/user/media ID without ownership or capability checks.
- Privilege escalation: lower role can update settings, roles, capabilities, templates, webhooks, or integration tokens.
- Stored XSS: unsanitized HTML or block attributes are stored and later rendered in admin or frontend.
- Reflected XSS: request data is echoed in notices, admin screens, redirects, or REST error messages.
- CSRF: admin mutation trusts logged-in cookies without nonce verification.
- SSRF: user-controlled URL can hit private network, metadata services, localhost, or privileged internal endpoints.
- SQL injection: dynamic identifiers, order clauses, `LIKE`, or table names are not whitelisted.
- Path traversal: import/export/download/delete endpoints accept paths or filenames too broadly.
- Insecure direct download: private media, logs, exports, backups, or generated reports are web-accessible.
- Secret exposure: keys appear in localized JS, REST responses, HTML, logs, screenshots, cache keys, cron args, or PR text.
- Unsafe deserialization: untrusted payloads reach `unserialize()` or object injection paths.
- Open redirect: destination is user-controlled without `wp_safe_redirect()` or allowlist.

## Secure Implementation Requirements

For any new sensitive feature, include:

- Capability and ownership checks close to the side effect.
- Schema validation for every request field: type, length, enum, range, format, object existence, and ownership.
- Explicit sanitization on ingress and escaping at the final output boundary.
- Least-privilege data responses.
- Redacted logging and audit events for privileged actions.
- Rate limiting or abuse controls when endpoints can trigger email, payments, external calls, imports, exports, AI cost, or heavy computation.
- Idempotency keys or duplicate-submit protection for side effects.
- Test coverage for denied permissions, malformed input, missing objects, ownership mismatch, replay/duplicate calls, and redaction.

## Review Procedure

1. Map entry points and trust boundaries with `rg` for routes, actions, forms, block render callbacks, webhooks, CLI commands, uploads, cron, and option saves.
2. Identify the actor for each action and the minimum capability needed.
3. Trace request data from ingress to persistence, external calls, logs, cache, background jobs, and output.
4. Check object ownership and tenant/multisite boundaries.
5. Check negative paths before happy paths: unauthorized, wrong owner, malformed, replayed, deleted dependency, stale nonce, external API failure.
6. Verify secrets/PII never cross public or semi-public surfaces.
7. Recommend the smallest compatible fix and tests.

## Security Test Recipes

- REST permission test: unauthenticated, subscriber/customer, editor/shop manager, admin, wrong-object owner, correct-object owner.
- Nonce/CSRF test: missing nonce, wrong nonce, valid nonce without capability, valid nonce with capability.
- Schema test: missing required field, wrong type, too long, invalid enum, invalid ID, deleted object, cross-site ID.
- Upload test: oversized file, wrong extension, mismatched MIME, path traversal filename, duplicate filename, failed media API call.
- Webhook test: missing signature, bad signature, old timestamp, duplicate event ID, unknown local object, provider retry.
- Redaction test: REST response, localized JS, logs, notices, exports, cache keys, scheduled args, and PR/debug output.

## Finding Template

```text
[P1] REST endpoint allows cross-account order access
Actor: authenticated customer
Entry point: GET /wp-json/example/v1/orders/{id}
Impact: A customer can read another customer's order metadata by changing the ID.
Evidence: permission callback only checks is_user_logged_in() and does not verify order ownership.
Fix: Require the appropriate capability or compare the order customer ID to get_current_user_id(), and add denied/wrong-owner tests.
```
