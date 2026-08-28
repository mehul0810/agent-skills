# Security Review And Fix

Use for WordPress application-security review and remediation. This contract owns the judgment; PHPCS, VIPCS, dependency scanners, dynamic scanners, and host tooling are optional evidence sources.

## Authoritative Anchors

- WordPress security APIs: https://developer.wordpress.org/apis/security/
- WordPress Plugin Security: https://developer.wordpress.org/plugins/security/
- REST endpoint requirements: https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/
- WordPress VIP PHPCS errors and warnings: https://docs.wpvip.com/php_codesniffer/errors/ and https://docs.wpvip.com/php_codesniffer/warnings/
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- OWASP API Security: https://owasp.org/API-Security/editions/2023/en/0x11-t10/
- OWASP headers, sessions, logging, and denial of service: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html, https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html, https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html, and https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html

Verify drift-prone platform policy or standard versions from official sources. Do not copy an entire generic checklist when the changed trust boundary is smaller.

## Security Model

Map before judging:

- Assets: content, settings, users, customer/order data, private media, tokens, secrets, generated files, logs, privileged actions, and availability.
- Actors: anonymous, authenticated low-privilege, content author, manager, admin, network admin, integration, compromised account, malicious extension, and insider.
- Entry points: REST, admin-post, legacy AJAX, forms, block/editor panels, render callbacks, shortcodes, webhooks, OAuth callbacks, uploads, imports, CLI, cron/queues, and third-party responses.
- Trust boundaries and invariants: who may read/change which object, what must never leave the server, which side effects must be idempotent, and what may be cached or logged.

## Evidence Workflow

1. Inventory registered routes/actions/hooks and deployed package/runtime behavior.
2. Trace each relevant source through normalization, validation, authorization, persistence/side effect, and output sink.
3. Test the server boundary directly; hidden UI and client validation are not controls.
4. Review the highest-risk classes:
   - Missing capability, tenant, or object-ownership checks; IDOR/BOLA.
   - Missing CSRF protection on authenticated mutations. Nonces do not grant authorization.
   - Stored/reflected/DOM XSS, unsafe HTML, and missing context-specific late escaping.
   - SQL/command/path injection, unsafe identifiers, unserialization, and file traversal.
   - SSRF, open redirects, unsafe uploads, archive extraction, and MIME confusion.
   - Forged/replayed webhooks, OAuth state/redirect weaknesses, token leakage, and weak secret lifecycle.
   - Enumeration, brute force, unbounded expensive public actions, and missing abuse controls.
   - Cross-user/site cache leakage, verbose errors, sensitive logs, exports, and release artifacts.
   - Vulnerable/abandoned dependencies, risky install scripts, and production packages containing dev tooling or secrets.
5. Establish actor, precondition, reachable path, affected data/action, exploitability, and confidence. Keep speculative items labeled as hypotheses.

## Authorization And Abuse Contracts

For a route or action that reads or mutates objects, sites, tenants, or privileged functions, record a compact actor x action x resource matrix with expected and observed allow/deny decisions and concrete proof. Cover REST, admin, CLI, webhook, and AI/tool surfaces; test object-property and function-level authorization, not only whether a user is logged in.

For public, expensive, bulk, import/export, payment, email, AI/provider, or otherwise abuse-prone paths, define quantitative limits for payload, items, recursion, concurrency, execution time, retries, queue depth, and cost as applicable. Prove over-limit behavior, per-actor/site/IP fairness, 429 or safe rejection/backoff, dependency failure handling, and no retry amplification. Platform edge limits do not replace application authorization or workload controls.

Maintain an inventory for public REST, GraphQL, Abilities, MCP, webhook, and legacy AJAX surfaces: owner, version, permission callback, schema, exposed data, lifecycle/deprecation state, and removal risk. Use conditional browser checks for responses or cookies the product actually owns: CSP/frame ancestors, HSTS, `Secure`/`HttpOnly`/`SameSite`, `Referrer-Policy`, and content-type protections; do not add blanket headers without host ownership and compatibility proof.

When introducing PII, audit logs, diagnostics, or exports, record classification, retention, erase/export behavior, access and alerting, log-injection handling, redaction, and tamper/access monitoring. For multisite or concurrent mutations, prove blog switching/restoration, site-aware cache keys, authorization recheck at mutation time, and race/TOCTOU behavior. For auth or signed callbacks, record token expiry/audience/scope/storage/rotation/revocation and constant-time signature comparison where relevant.

## WordPress Remediation Rules

- Authorize at the server-side action and resource boundary with meaningful capabilities and ownership checks.
- Validate/reject shape, type, length, enum, range, identifiers, and relationships before sanitizing. Escape at the final output context.
- Use `$wpdb->prepare()` for values and allowlists for identifiers, sort columns, directions, file types, and redirects.
- Give every REST route a meaningful `permission_callback` and schema. Prefer REST over new `admin-ajax.php` handlers when the interaction fits REST.
- Check capability and then nonce for admin mutations; validate every object in bulk actions.
- Use WordPress HTTP safe-request APIs plus a business allowlist for user-influenced URLs; reject unsupported schemes, credentials, loopback/private/link-local destinations, redirect escapes, and DNS-rebinding outcomes.
- Use WordPress media/filesystem/temp APIs where appropriate. Enforce size, extension, MIME, dimensions, extraction destination, executable-content, and cleanup rules.
- Verify webhook signature, canonical payload, timestamp/age, replay key, sender/account binding, and idempotency before side effects.
- Store secrets server-side with least privilege and rotation/revocation paths. Redact logs, UI, analytics, screenshots, issue/PR text, cache keys, URLs, cron args, and client data.
- Preserve public compatibility only when it does not preserve the vulnerability. Document migrations, revocations, and rollback.
- For elevated dependency/package work, reuse `../../shared/references/enterprise-runtime-assurance.md` for lockfiles, provenance/SBOM, artifact contents, and production-only dependencies.

## Proof

Every fixed security finding needs the smallest relevant negative proof:

- Missing/invalid authentication or nonce.
- Lower capability and wrong-object/tenant access.
- Malformed, oversized, unexpected-key, injection, traversal, or private-network input.
- Forged, stale, and replayed webhook/OAuth callback.
- Unsafe upload or archive member.
- Secret/PII redaction from response, log, cache, error, export, and release package.
- Dependency/package scan against the exact candidate.
- Authorization matrix decisions and resource-budget/over-limit behavior when those contracts apply.

Use unit tests for validators and policies; WordPress integration tests for capabilities, REST, persistence, hooks, and multisite; browser tests only where UI state matters. A scanner pass cannot replace boundary-specific negative tests.

## Disclosure And Stop Rules

- Do not put exploitable details, payloads, customer data, or weaponized reproduction steps in public issues/comments.
- Sanitize public hardening PRs and use the repository's private security path for actionable vulnerabilities.
- Stop and escalate immediately for active exploitation, exposed secrets, destructive data access, or a release candidate with a credible `P0`/`P1`.
- Do not claim comprehensive security or compliance from a scoped review. State the reviewed revision, surfaces, evidence, exclusions, and residual risk.
