# Third-Party API Integrations

Use this for integrating any external API with WordPress: REST, GraphQL, SOAP/WSDL, XML-RPC, webhooks, SDKs, OpenAPI/Swagger specs, Postman collections, OAuth, API keys, JWT, mTLS, file APIs, payment/shipping/CRM/marketing/search/AI providers, and private client APIs.

## Current Official Anchors

- WordPress HTTP API: https://developer.wordpress.org/plugins/http-api/
- `wp_remote_request()`: https://developer.wordpress.org/reference/functions/wp_remote_request/
- WordPress REST API authentication: https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/
- WordPress REST API global parameters: https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/
- OpenAPI Specification: https://spec.openapis.org/oas/latest.html
- OAuth 2.0 RFC 6749: https://www.rfc-editor.org/rfc/rfc6749
- GraphQL official docs: https://graphql.org/

## Documentation-First Rule

Never invent API behavior. Build from current documentation and verified runtime responses.

1. Use the user-provided docs/spec first when available.
2. If no docs are provided, search the web for the official developer portal, API reference, OpenAPI/Swagger spec, Postman collection, SDK repository, changelog, status page, and deprecation policy.
3. Prefer official docs over blog posts, examples, Stack Overflow, or copied snippets.
4. Confirm API version, environment base URLs, auth method, rate limits, pagination, idempotency, webhook signatures, error format, date/timezone rules, and deprecation dates.
5. If official docs cannot be found or critical details are missing, ask the user for the docs/spec/link, sandbox access path, or missing contract details before implementing.
6. Do not ask the user to paste secrets into chat. Ask for environment variable names, local config location, or a safe credential setup path.

## API Intake Checklist

Capture these facts before coding:

- Provider, product, API version, environment: sandbox, staging, production.
- Protocol: REST, GraphQL, SOAP/WSDL, XML-RPC, SDK-only, file/SFTP, webhook-only, event stream.
- Auth: API key, bearer/JWT, OAuth 2.0 flow, HMAC signature, basic auth, mTLS, application password, session token.
- Required scopes, token lifetime, refresh behavior, revocation, rotation, and tenant/account boundaries.
- Endpoints/operations, request schema, response schema, errors, pagination/cursors, filters, sorting, and rate limits.
- Idempotency keys, retry rules, timeout guidance, webhooks, callback verification, replay windows, and delivery retries.
- Data sensitivity, PII, retention, deletion/export requirements, logging restrictions, and compliance constraints.
- SDK license, maintenance status, dependency footprint, WordPress/PHP version compatibility, and testability.

## WordPress Architecture

- Put provider communication behind a dedicated client/service layer; keep hooks, controllers, admin UI, and cron callbacks thin.
- Use WordPress HTTP API functions for PHP requests unless the project has a justified HTTP client abstraction.
- For internal UI/API boundaries, expose WordPress REST routes instead of `admin-ajax.php` when possible.
- Store credentials in the safest available project pattern: constants/env-backed config, encrypted secrets manager, VIP environment variables, or protected options with capability-gated admin screens.
- Never expose API secrets, refresh tokens, webhook secrets, private URLs, PII, or raw provider payloads in localized JS, HTML, REST responses, logs, cache keys, cron args, screenshots, or PR text.
- Model provider payloads into validated DTOs/arrays at the boundary. Do not let raw provider responses leak across the plugin/theme.
- Add filters/actions for enterprise customization only at stable boundaries: request args, normalized response, retry decision, and event processed.

## Request Design

- Use explicit timeouts, usually short on user-facing paths and longer only in background jobs.
- Fail closed for privileged actions and sensitive data.
- Use bounded retries with exponential backoff only for retry-safe failures: timeouts, 429, 503, selected 5xx, and documented transient codes.
- Respect `Retry-After`, rate-limit headers, provider backoff guidance, and account-level quotas.
- Use idempotency keys for create/update/payment/order/shipping operations when the API supports them.
- Abort or coalesce duplicate in-flight work where possible.
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

- Register webhook endpoints as REST routes with explicit methods and permission/signature checks.
- Verify signatures before parsing or acting on data.
- Store and check provider event IDs for idempotency and replay protection.
- Respond quickly, then enqueue expensive processing through Action Scheduler, cron, queue, or WP-CLI.
- Redact and bound stored payloads. Keep raw payloads only when business/compliance requirements justify it.
- Provide admin/CLI tools to replay failed events safely.

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
