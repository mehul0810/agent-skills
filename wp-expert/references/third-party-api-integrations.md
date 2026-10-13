# Third-Party API Integrations

Use for WordPress integration with external REST/GraphQL/SOAP/XML-RPC, webhooks, SDKs/specs, OAuth/API keys/JWT/mTLS, file, payment/shipping/CRM/marketing/search/AI or private APIs.

## Current Official Anchors

- WordPress HTTP API: https://developer.wordpress.org/plugins/http-api/
- `wp_remote_request()`: https://developer.wordpress.org/reference/functions/wp_remote_request/
- WordPress REST API authentication: https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/
- WordPress REST API global parameters: https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/
- OpenAPI Specification: https://spec.openapis.org/oas/latest.html
- OAuth 2.0 RFC 6749: https://www.rfc-editor.org/rfc/rfc6749
- GraphQL official docs: https://graphql.org/

## Documentation-First Rule

Never invent API behavior; use current docs and verified runtime responses.

1. Use supplied docs/spec first; otherwise find official portal, API reference/spec, Postman collection, SDK, changelog, status and deprecation policy.
2. Prefer official sources over blogs, examples, forums or snippets.
3. Confirm version, environment/base URLs, auth, limits, pagination, idempotency, signatures, errors, date/timezone and deprecation.
4. If docs/details are missing, request docs/link, sandbox path or contract before implementation. Never request secrets in chat; ask for env names, local config or safe setup.

## API Intake Checklist

Before coding, capture:

- Provider/product, API version, environment, protocol and auth flow.
- Scopes, token lifetime/refresh/revocation/rotation and tenant/account boundaries.
- Operations/schemas/errors, pagination/filters/sort/limits; idempotency, retries, timeouts, webhook verification/replay/delivery.
- Data sensitivity/PII, retention, deletion/export, logging and compliance; SDK license/maintenance/dependencies, WP/PHP compatibility and testability.

## WordPress Architecture

- Isolate provider communication in a client/service; keep hooks, controllers, UI and cron thin.
- Use WordPress HTTP API functions for PHP requests unless the project has a justified HTTP client abstraction.
- Prefer REST over `admin-ajax.php` for internal UI/API boundaries.
- Store credentials in the safest available project pattern: constants/env-backed config, encrypted secrets manager, VIP environment variables, or protected options with capability-gated admin screens.
- Never expose API secrets, refresh tokens, webhook secrets, private URLs, PII, or raw provider payloads in localized JS, HTML, REST responses, logs, cache keys, cron args, screenshots, or PR text.
- Normalize payloads into validated DTOs/arrays at boundary; raw responses stay inside client.
- Add filters/actions for enterprise customization only at stable boundaries: request args, normalized response, retry decision, and event processed.

## Request Design

- Set explicit timeouts: short for user paths, longer only in background.
- Fail closed for privileged actions and sensitive data.
- Use bounded retries with exponential backoff only for retry-safe failures: timeouts, 429, 503, selected 5xx, and documented transient codes.
- Respect `Retry-After`, rate-limit headers, provider backoff guidance, and account-level quotas.
- Use idempotency keys for create/update/payment/order/shipping operations when the API supports them.
- Abort/coalesce duplicate in-flight work.
- Cache safe deterministic reads with explicit TTL and invalidation; do not cache secrets or sensitive payloads.
- Avoid synchronous remote calls on page render, checkout/form submission, login, editor load, or admin bootstrap unless no async path is acceptable and failure behavior is defined.

## Auth Patterns

- API key: send in the documented header or signed request. Avoid query-string keys unless the provider requires it; they leak into logs and URLs.
- OAuth 2.0: implement authorization, callback, token exchange, refresh, scope checks, revocation/disconnect, and token expiry handling. Store refresh tokens server-side only.
- JWT/bearer: validate expiry and issuer/audience where applicable; refresh before expiry with locking to avoid token refresh stampedes.
- HMAC/webhook signatures: verify using raw request body, timestamp, tolerance window, constant-time comparison, and replay protection.
- mTLS/private key: use platform-supported secret storage and deployment-safe certificate rotation.
- SDK auth: inspect SDK source and docs. Wrap it so credential handling, retries, logging, and errors remain project-controlled.

## Webhooks And Inbound Events

- Register webhook REST routes with explicit methods and permission/signature checks.
- Verify signatures before parsing or acting on data.
- Store and check provider event IDs for idempotency and replay protection.
- Respond quickly; enqueue expensive processing.
- Redact and bound stored payloads. Keep raw payloads only when business/compliance requirements justify it.
- Provide safe admin/CLI replay tools.

## Protocol Notes

- REST: prefer OpenAPI specs, typed request/response models, pagination, sparse fields, and provider error codes.
- GraphQL: use schema/introspection/docs to generate or validate queries. Keep queries bounded, avoid overbroad nested selections, handle partial errors, and version persisted queries when used.
- SOAP/WSDL: generate or hand-map clients carefully, validate XML, set timeouts, disable unsafe XML features, and isolate legacy complexity behind a service class.
- File/SFTP/batch APIs: make transfers resumable, checksummed, idempotent, and observable. Never process unbounded files in a web request.
- SDK-only APIs: do not blindly trust SDK defaults for timeouts, logging, retries, or dependency versions. Wrap and test the SDK boundary.

## Testing And Validation

- Contract tests: request shape, response parsing, error mapping, pagination, auth expiry, rate limits, idempotency, and webhooks.
- Unit tests: client normalization, retry decisions, signature verification, DTO validation, cache keys, and redaction.
- Integration tests: sandbox calls only when credentials are available and safe.
- Failure tests: 400, 401/403, 404, 409, 422, 429, 500/503, timeout, malformed JSON/XML, expired token, duplicate webhook, replayed webhook.
- Runtime probes: WP-CLI command, admin connection test, REST route probe, queue status, and redacted diagnostic report.
- Release checks: credential setup docs, scopes, callback URLs, webhook subscriptions, rate-limit expectations, support contact, provider status page, and rollback behavior.

## Review Checklist

- Were official/current docs or user-provided specs used, and are version/base URL/auth assumptions recorded?
- If docs were not found, did Codex ask for them instead of guessing?
- Are secrets stored and transmitted safely, with no exposure in frontend, logs, cron args, cache keys, or PR text?
- Are remote calls kept off hot paths or made fail-safe with timeouts and fallbacks?
- Are rate limits, retries, idempotency, pagination, and error mapping handled?
- Are webhook signatures, replay protection, and idempotent processing implemented?
- Are provider-specific payloads normalized before entering business logic?
- Are tests covering success, provider failure, auth expiry, duplicate events, and data redaction?

## Automattic WordPress Product Ecosystem

Use this section only for a concrete Automattic-maintained WordPress product/service. Recheck the exact slug, version, edition/plan, activation/connection, modules, blocks, APIs, release notes, and official docs; `https://automattic.com/products/` changes over time. The 2026-09-08 WooCommerce release index showed 11.1.0 as latest stable and warns only the latest version is fully secure; verify `https://developer.woocommerce.com/releases/` live rather than retaining that version as policy.

- WooCommerce: inspect Product Collection/catalog/filter/product-template blocks; Cart, Checkout, Mini Cart, Order Confirmation and all states; Store API/Blocks extensibility; HPOS CRUD; payments, shipping, tax, refunds, subscriptions, webhooks, Action Scheduler, privacy, templates, designated pages, and extension matrix. Prefer Product Collection recipes/context over legacy product grids; never mutate transactional DOM or assume classic checkout hooks affect block checkout.
- Jetpack/VaultPress/VideoPress/Search/Boost/Protect: verify WordPress.com connection, module/plan, registered blocks, remote data flow, CDN/cache/index/backup behavior, host/VIP overlap, consent, outage, and disconnect behavior.
- Akismet: verify key/plan, submitted fields, disclosure, false-positive/recovery flow, form/comment integration, and unavailable-service behavior.
- Sensei/Pro: verify course/lesson/quiz hierarchy, learner/teacher capabilities, progress, required registered blocks, plan-only interactions, Learning Mode/templates, accessible learner proof, migrations, and WooCommerce paid-course integration.
- MailPoet, WP Job Manager, Parse.ly, Newspack, ActivityPub, Gravatar, Crowdsignal: verify the exact plugin/service contract, blocks/APIs, roles, data leaving the site, queues/webhooks/cache, plan limits, privacy, accessibility, and graceful degradation.
- WordPress.com, Studio, Pressable, WP Cloud, VIP: verify platform restrictions, source/deployment authority, environments, cache/CDN, filesystem/database access, domains/HTTPS, logs, backups, secrets, and supported-plugin proof.

Before selecting a product block/API, record version and dependencies, free/paid/connection state, registration and public stability, value over Core, data/render ownership, accessibility/mobile/RTL/i18n/performance/privacy/security, and deactivation/downgrade/license-expiry/outage fallback. Use official integration points; do not invent plan capability, copy internals, expose credentials, or create avoidable content lock-in. Products without a concrete WordPress integration are out of scope.
