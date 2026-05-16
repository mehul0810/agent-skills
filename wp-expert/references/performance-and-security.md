# Performance And Security Hardening

Use this for speed, scalability, caching, database, secure coding, privacy, secrets, PII, and production hardening.

## Performance Triage

Prioritize paths by traffic and cost:

- Public page render and cache-miss behavior.
- REST/AJAX endpoints hit by editor, frontend, checkout, forms, or integrations.
- Admin bootstrap, dashboard widgets, plugin list, list tables, Site Health.
- Cron/action queues, imports, exports, sync jobs, webhooks.
- Search, archive, Query Loop, reports, analytics, and any meta-query-heavy screens.

## Database Rules

- Avoid unbounded queries and N+1 loops.
- Use `fields => 'ids'` when object hydration is not needed.
- Use `no_found_rows => true` when total counts are not needed.
- Add explicit limits and pagination to admin lists and APIs.
- Whitelist sort columns and directions.
- Use custom tables for high-volume operational data with real indexes.
- Avoid leading wildcard searches and sorting/filtering on unindexed meta values at scale.

## Options And Autoload

- Autoload only small config needed on most requests.
- Do not autoload logs, caches, provider state, import/export state, or large arrays.
- Avoid frequent writes to autoloaded options because they churn shared cache.
- Use schema validation for structured options.

## Cache Strategy

- Cache expensive deterministic reads only when invalidation is known or TTL is acceptable.
- Include blog ID, locale, user segment, permission boundary, and feature state in keys when output varies.
- Keep payloads small; store IDs or compact DTOs instead of full objects when possible.
- Invalidate on writes close to the data owner.
- For high-traffic misses, consider locks, stale fallback, async warming, or request coalescing.

## Remote Calls

- Set explicit timeouts and handle errors.
- Avoid synchronous remote calls on page render, form submission, checkout, login, editor load, or admin bootstrap unless there is no acceptable async path.
- Cache or queue remote health checks.
- Redact request/response logs.

## Security Hardening

- Authorization: capability and object ownership checks for every sensitive action.
- CSRF: nonces for admin/form/AJAX mutations.
- REST: meaningful `permission_callback` for every route.
- Endpoint design: avoid new `admin-ajax.php` handlers when REST can provide the same behavior with clearer schemas, permissions, cache/debug tooling, and client integration.
- Input: sanitize, validate, enforce type/length/enum/range/ownership.
- Output: escape at the final output boundary.
- SQL: `$wpdb->prepare()` for values and manual whitelists for identifiers.
- Uploads: validate type, size, extension, MIME, path, and permissions.
- SSRF: restrict protocols and internal/private IP ranges when accepting URLs.
- Redirects: use `wp_safe_redirect()` or allowlists.
- Unserialization: never `unserialize()` untrusted input.

## Secrets And PII

Never expose secrets or PII in:

- Client JS or localized data.
- HTML attributes or comments.
- Logs, debug notices, screenshots, PR bodies, analytics events.
- Cron/action args or queue payloads.
- Cache keys, transient names, option names, URLs.
- REST responses or admin screens without explicit authorization and redaction.

Use opaque tokens plus private short-lived storage for async payloads when sensitive data must cross request boundaries.

## Security Review Output

For every security issue, include:

- Actor and required access.
- Entry point and vulnerable check.
- Exploit path or realistic abuse.
- Data/action affected.
- Compatible fix.
