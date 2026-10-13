# Security Review And Fix

Use for WordPress application-security review/remediation. This contract owns judgment; PHPCS/VIPCS, scanners and host tools are optional evidence.

## Authoritative Anchors

- WordPress security APIs: https://developer.wordpress.org/apis/security/
- WordPress Plugin Security: https://developer.wordpress.org/plugins/security/
- REST endpoint requirements: https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-custom-endpoints/
- WordPress VIP PHPCS errors and warnings: https://docs.wpvip.com/php_codesniffer/errors/ and https://docs.wpvip.com/php_codesniffer/warnings/
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- OWASP API Security: https://owasp.org/API-Security/editions/2023/en/0x11-t10/
- OWASP headers: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html; [sessions](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [logging](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html), [DoS](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)

Verify changing policy/standard versions officially; scope checklist to changed trust boundary.

## Security Model

Map before judging:

- Assets: content/settings, users/customer/order data, private media, tokens/secrets, generated files, logs, privileged actions, availability.
- Actors: anonymous, low-privilege/authors/managers/admins/network admins, integrations, compromised accounts, malicious extensions, insiders.
- Entry points: REST/admin-post/AJAX, forms/editor/render/shortcodes, webhooks/OAuth, uploads/imports, CLI/cron/queues, third-party responses.
- Boundaries/invariants: who may read/change what, what stays server-side, idempotent effects, cache/log permissions.

## Evidence Workflow

1. Inventory routes/actions/hooks and deployed package/runtime behavior.
2. Trace source through normalization, validation, authorization, persistence/effects and output sink.
3. Test server boundary directly; UI/client validation is not control.
4. Review the highest-risk classes:
   - Missing capability/tenant/object ownership (IDOR/BOLA); CSRF on authenticated mutations (nonces are not authorization).
   - Stored/reflected/DOM XSS, unsafe HTML or late escaping; SQL/command/path injection, unsafe identifiers, unserialization, traversal.
   - SSRF, redirects, unsafe uploads/archive/MIME; forged/replayed webhooks, weak OAuth state/redirect, token leakage/secret lifecycle.
   - Enumeration, brute force, expensive public actions/abuse controls; cross-user/site cache leaks, verbose errors, sensitive logs/exports/artifacts.
   - Vulnerable/abandoned dependencies, risky install scripts, dev tooling/secrets in production packages.
5. Establish actor, precondition, reachable path, affected data/action, exploitability and confidence; label speculation as hypothesis.

Broad audits record surface, boundary, source revision, evidence and reviewed/blocked/deferred/out-of-scope status. Prior passes cover only unchanged paths/conditions; leads are not coverage. Reserve verification time. Scoped fixes need no multi-wave hunt.

Before confirming material vulnerability, have an independent source-aware reviewer challenge reachability, attacker control and impact, including other controls. If another layer blocks attack, classify optional hardening, not vulnerability. Unresolved leads go in proof gaps with missing fact/next safe check, no severity; do not force into findings. Rejected claims need reason, not a fix.

## AI And Data Lifecycle Boundaries

Apply only when the product has these surfaces:

- For AI/tools, bind final normalized tool, args, resource, requester and executor to intent/approval; recheck queued, retried, resumed and batched effects. Generic permission does not authorize changed/duplicate actions.
- Trace untrusted retrieval/responses/memory to later readers and privileged sinks; verify tenant/ACL filtering and handler authorization. Prompt injection alone is not a finding: require unauthorized disclosure, authority or action. User-owned memory serving an intentional allowed request is a safe counterexample.
- Trace protected data through storage/cache/search/exports/jobs/backups. Test downgrade, deletion, revocation and restore against guarantees, including queued recreation. Use dummy principals; unavailable external retention policy is a gap, not violation.

## Potentially Hostile Target Execution

Source inspection may be read-only. Before running hostile builds/fixtures/processes, verify OS isolation: no external network; sanitized allowlisted env without ambient credentials; read-only source/toolchain, task-owned scratch; bounded CPU/memory/processes/disk/time. Temp dirs, loopback or safety instructions are insufficient. If unavailable, do not run target; report gap and safe plan. Keep evidence outside target writes; after stop, promote only bounded verified regular files, reject links/special files. Do not probe production or exhaust shared services. This does not impose a harness on trusted dev tests.

## Authorization And Abuse Contracts

For object/site/tenant or privileged reads/mutations, record a compact actor x action x resource matrix with expected/observed allow/deny and proof. Cover REST/admin/CLI/webhook/AI; test property/function authorization, not merely login.

For abuse-prone public/expensive/bulk/import/export/payment/email/AI paths, set quantitative limits for applicable payload/item/recursion/concurrency/time/retry/queue/cost. Prove over-limit response, actor/site/IP fairness, 429/safe backoff, dependency failure and no retry amplification. Edge limits do not replace app authorization/workload controls.

Maintain an inventory for public REST, GraphQL, Abilities, MCP, webhook, and legacy AJAX surfaces: owner, version, permission callback, schema, exposed data, lifecycle/deprecation and removal risk. Browser-check only owned responses/cookies (CSP/frame ancestors, HSTS, `Secure`/`HttpOnly`/`SameSite`, `Referrer-Policy`, content type); no blanket headers without host ownership/compatibility proof.

For new PII/logs/diagnostics/exports, record classification, retention, erase/export, access/alerts, injection handling, redaction and tamper monitoring. For multisite/concurrent mutations, prove blog restore, site-aware cache, mutation-time auth and race/TOCTOU. For auth/callbacks, record token expiry/audience/scope/storage/rotation/revocation and constant-time signature checks.

## WordPress Remediation Rules

- Authorize server-side at action/resource boundary with capability and ownership checks.
- Validate/reject shape, type, length, enum, range, IDs and relationships before sanitize; escape in final context.
- Use `$wpdb->prepare()` for values; allowlist identifiers, sort fields/directions, file types and redirects.
- REST routes need meaningful `permission_callback` and schema; prefer REST over new AJAX when suitable.
- Admin mutations require capability then nonce; validate each bulk object.
- For user URLs, use safe HTTP APIs plus business allowlist; reject bad schemes/credentials, local/private/link-local targets, redirect escapes and DNS rebinding.
- Use WP media/filesystem/temp APIs; enforce size, extension, MIME, dimensions, extraction path, executable-content and cleanup.
- Verify webhook signature, canonical payload, age, replay key, sender/account and idempotency before effects.
- Keep secrets server-side, least-privileged, rotatable/revocable. Redact logs/UI/analytics/screenshots/issues/PRs/cache/URLs/cron/client data.
- Preserve compatibility only if it does not preserve vulnerability; document migrations, revocation and rollback.
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

Use unit tests for validators/policies; WP integration for capabilities, REST, persistence, hooks and multisite; browser tests when UI state matters. Scanners cannot replace boundary-specific negative tests.

## Disclosure And Stop Rules

- Do not put exploitable details, payloads, customer data, or weaponized reproduction steps in public issues/comments.
- Sanitize public hardening PRs; use private security path for actionable vulnerabilities.
- Escalate active exploitation, exposed secrets, destructive data access or credible `P0`/`P1` release candidate.
- Scoped review cannot prove comprehensive security/compliance. State revision, surfaces, evidence, exclusions and residual risk.
