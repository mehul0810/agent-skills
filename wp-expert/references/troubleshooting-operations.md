# Troubleshooting And Operations

Use this for broken sites, conflicts, fatal errors, REST/AJAX, cron/queues, mail, media, cache, multisite, CI, and incidents. Add one advanced decision-tree or plugin-supportability reference only when the confirmed symptom requires it.

## Incident Discipline

- Stabilize before refactoring.
- Preserve evidence: exact error, URL, role, request payload, logs, recent changes, branch, active plugins/theme, PHP/WP versions.
- Reproduce locally or with a safe probe before changing code when feasible.
- Avoid destructive DB/filesystem operations without explicit approval.
- Prefer reversible mitigations: feature flag, disable integration, lower batch size, short-circuit failing remote call, rollback release.

## First Commands

```bash
pwd
git status --short --branch
git rev-parse --show-toplevel 2>/dev/null || true
find . -name wp-load.php -o -path '*/wp-content/plugins' -o -path '*/wp-content/themes'
rg -n "Fatal error|Parse error|register_rest_route|wp_ajax_|wp_schedule_|as_enqueue_|error_log|TODO|FIXME" .
```

Use `wp-cli-automation.md` and `validation-commands.md` for runtime probes.

## Fatal Error Or White Screen

- Inspect PHP error log and exact stack trace.
- Run `php -l` on recently changed PHP files.
- Check Composer autoload and missing class/function names.
- Verify plugin activation path and dependency guards.
- Compare changed file against `HEAD` before clever edits.
- If parse error comes from a botched edit, restore the minimal corrupted block from Git history, not the whole repo.

## REST/AJAX Failure

- Confirm route/action registration hook fires.
- Check nonce, cookies, application password, CORS, and capability checks.
- Distinguish 401/403 auth failures from 404 route registration failures and 500 callback failures.
- Inspect localized script data and REST root URL.
- Confirm public routes intentionally use public permission callbacks and leak no private data.

## Local HTTPS Browser Blocks

If a custom local domain such as `https://example.test`, `https://example.local`, or `https://site.wp.local` is blocked by the in-app browser, do not stop runtime validation immediately.

- Verify WordPress `home` and `siteurl` values.
- Verify DNS resolution and redirects.
- Use `curl -k` to confirm HTTPS reachability despite local certificate trust issues.
- Use `wp-local-https-check.sh` or a Playwright/Chromium runner with `ignoreHTTPSErrors` for screenshot and UI smoke checks.
- Report the difference between terminal reachability, browser rendering, and visual parity; do not claim a surface was visually validated unless it was loaded in a browser runner or real browser.

Read `local-https-testing.md` for the full workaround.

## Cron And Action Scheduler

- Check whether the event/action exists, args shape, recurrence, next run, attempts, claim state, and last error.
- Ensure handlers are registered on every request where queues may run.
- Jobs should tolerate duplicate execution and missing/deleted target records.
- Reduce batch size before optimizing if a queue is failing under load.
- Do not store secrets/PII in job args.

## Cache Bugs

Symptoms: stale frontend, user-specific data leaking, settings not updating, random behavior across servers.

- Identify page cache, object cache, browser cache, CDN, query cache, fragment cache, and transients separately.
- Check cache key dimensions: site, locale, user role, permissions, object version, feature flags.
- Confirm invalidation hooks fire on every write path.
- In multisite, include blog/network scope in keys.

## Media And Filesystem

- Use uploads APIs for persistent media and temp APIs for temporary files.
- Check permissions, object storage behavior, MIME validation, file size, offload plugin behavior, and cleanup.
- Do not assume local uploaded files exist on every web node.

## Mail And Webhooks

- Check provider credentials without exposing them.
- Inspect request timeout, response code, retry policy, webhook signature, idempotency key, and queue status.
- Move slow provider calls off hot paths when possible.
- Store delivery attempts and errors in bounded, redacted form.

## Multisite Issues

- Confirm current blog ID, network admin vs site admin context, option scope, table prefix, capabilities, and `switch_to_blog()` restore.
- Avoid network-wide loops in web requests.
- Validate activation/network activation separately.

## Troubleshooting Report Format

- Symptom and confirmed facts.
- Most likely cause with evidence.
- Minimal fix or mitigation.
- Validation performed.
- Remaining risks or follow-up hardening.
