# Plugin Debuggability And Supportability

Use this when building or reviewing plugins that need safe diagnostics, support workflows, health checks, log visibility, recovery controls, and enterprise operations without exposing secrets or PII.

Use alongside `plugin-product-architecture.md`, `troubleshooting-operations.md`, `observability-incident-response.md`, `privacy-consent-data-governance.md`, and `security-operations-compliance.md`.

## Supportability Goals

A supportable plugin lets maintainers answer:

- Is the plugin active, configured, and compatible with the environment?
- Are required dependencies available?
- Are cron/queues/REST/providers working?
- What failed, when, how often, and with which safe correlation ID?
- Can support export useful diagnostics without leaking secrets or PII?
- Can admins recover from common failures without direct database edits?

## Diagnostics Surfaces

Use the lightest useful surface:

- Site Health tests for environment, REST, cron, queue, database, object cache, filesystem, and provider availability.
- Admin diagnostics panel for plugin-specific status and recovery actions.
- Redacted support bundle export for version, settings shape, enabled modules, feature flags, queue counts, recent safe errors, and environment facts.
- WP-CLI diagnostics for enterprise support and automation.
- Log viewer only when logs are redacted, scoped, permission-checked, and bounded.

## Logging Rules

- Log stable event codes, correlation IDs, object IDs, provider status, retry count, and safe error messages.
- Do not log secrets, tokens, passwords, customer PII, full payloads, private URLs, raw headers, or full stack traces in admin-visible output.
- Use log levels: debug, info, warning, error, critical.
- Keep logs bounded with retention and cleanup.
- Add context at the logger boundary so future call sites cannot leak accidentally.

## Recovery Controls

Useful controls can include:

- Test connection with redacted provider response.
- Retry failed job or batch.
- Pause/resume queue or integration.
- Clear plugin-owned safe cache.
- Regenerate webhook secret or reconnect account.
- Re-run a specific migration step after safety checks.
- Export diagnostics for support.

Every recovery action needs capability checks, nonce/CSRF protection, audit trail when sensitive, and clear success/error messaging.

## Enterprise Support Export

A support export may include:

- WordPress/PHP/database versions, multisite status, active theme, relevant plugins, and object cache presence.
- Plugin version, module list, feature flags, schema version, queue counts, last successful provider sync, and recent redacted errors.
- REST route availability, cron schedule status, and file/media environment facts.
- Configuration shape with values redacted or summarized.

A support export must not include secrets, raw PII, private content, full access tokens, salts, cookies, or full request payloads.

## Review Checklist

- Can support diagnose the top expected failures without shell access?
- Are diagnostics permission-checked and redacted?
- Are recovery controls safe, bounded, and auditable?
- Are logs retained and cleaned up?
- Are correlation IDs surfaced to users/admins for support tickets?
- Does Site Health report actionable status instead of vague failure?
- Are tests covering redaction and denied access to diagnostics?
