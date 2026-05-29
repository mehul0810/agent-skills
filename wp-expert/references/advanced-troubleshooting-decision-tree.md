# Advanced Troubleshooting Decision Tree

Use this for systematic WordPress debugging when symptoms are broad, production-impacting, intermittent, cache-related, or difficult to reproduce. Use alongside `troubleshooting-operations.md`, `validation-commands.md`, `wp-cli-automation.md`, `observability-incident-response.md`, and `local-https-testing.md`.

## Debugging Principles

- Stabilize first, diagnose second, refactor last.
- Preserve evidence before changing state: error text, request URL, role, payload, recent deploy, logs, active theme/plugins, cache state, and environment versions.
- Reproduce with the smallest safe probe before editing when feasible.
- Prefer reversible mitigations: feature flag, rollback, disable integration, reduce batch size, purge targeted cache, or pause queue.
- Never use destructive database/filesystem commands without explicit approval.

## Symptom To Probe Matrix

| Symptom | First probes | Likely areas |
| --- | --- | --- |
| White screen/fatal | PHP logs, `php -l`, recent diff, Composer autoload | syntax, missing class, dependency guard, activation path |
| REST 401/403/404/500 | route list, nonce/cookies, capability, callback logs | auth, permission callback, route registration, fatal in callback |
| Admin slow page | Query Monitor/New Relic, hooks, remote HTTP, autoload options | admin bootstrap, list table queries, dashboard widgets, provider calls |
| Frontend stale data | page cache, object cache key, invalidation hook, CDN purge | cache dimensions, missing invalidation, personalized output |
| Intermittent failures | logs by correlation ID, cache/server variation, race conditions | concurrency, object cache, cron overlap, external APIs |
| Queue stuck | Action Scheduler status, cron events, locks, last error | missing handler, fatal in job, claim deadlock, batch size |
| Editor invalid block | saved markup, block attributes, deprecations, console errors | static block migration, asset dependency, parser mismatch |
| Redirect loop | home/siteurl, canonical redirects, SSL/proxy headers, cache | URL config, host headers, plugin redirects, HSTS |
| Form/checkout drop | JS console, network tab, nonce, validation, provider timeout | frontend errors, REST/AJAX failure, payment/shipping integration |
| Media/file issue | upload paths, object storage, MIME, permissions, offload logs | filesystem assumptions, object store, file validation |

## Conflict Isolation

When plugin/theme conflict is plausible:

1. Confirm the baseline symptom and capture evidence.
2. Reproduce with the current stack.
3. Test a safe isolated environment if production cannot be touched.
4. Disable only the suspected integration first if evidence points there.
5. If unknown, use binary search across plugins on staging/local, not production.
6. Switch to a default theme only when theme involvement is plausible and safe.
7. Record the minimal conflict pair and trigger.
8. Fix the compatibility boundary, not just the symptom.

Do not claim a plugin conflict without a minimal reproduction pair.

## REST, Nonce, And Auth Debugging

- Confirm the route exists through `rest_get_server()->get_routes()`.
- Distinguish route registration failure from permission failure and callback failure.
- Verify nonce action/source, cookies, logged-in state, application password, CORS, and REST root URL.
- Check whether the route intentionally supports anonymous access.
- Validate object-level ownership after capability checks.
- Confirm localized script data points to the correct namespace, nonce, and root URL.

## Cache And CDN Debugging

- Identify every layer: browser, CDN, page cache, object cache, transients, query cache, fragment cache, service worker.
- Compare cache hit/miss responses with headers and bypass where safe.
- Check cache key dimensions: site, locale, role, permission, query args, feature flag, object version.
- Verify invalidation on every write path, not only the primary save action.
- Avoid global cache purges as the first fix; prefer targeted invalidation when possible.
- For personalized output, preserve page cacheability by moving dynamic parts to fragments, REST, or client hydration when appropriate.

## Production Debugging Workflow

1. Confirm impact, affected users, affected routes, start time, and recent changes.
2. Check logs and metrics before changing code.
3. Pick a reversible mitigation that reduces user impact.
4. Validate mitigation with a safe probe.
5. Root-cause in staging/local using captured evidence.
6. Add regression tests or monitoring around the failure mode.
7. Record postmortem notes if the incident was material.

## Output Format

```text
Symptom:
Confirmed facts:
Excluded causes:
Most likely cause:
Minimal mitigation:
Permanent fix:
Validation:
Regression guard:
Remaining risk:
```
