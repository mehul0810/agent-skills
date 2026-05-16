# Security Operations And Compliance

Use this for enterprise security operations, access governance, audit readiness, vulnerability management, penetration testing, dependency/supply-chain risk, privacy, and compliance deliverables.

## Current Official Anchors

- VIP security overview: https://docs.wpvip.com/security/
- VIP penetration testing: https://docs.wpvip.com/security/penetration-testing/
- VIP logs overview: https://docs.wpvip.com/logs/
- WordPress plugin security handbook: https://developer.wordpress.org/plugins/security/
- WordPress data validation: https://developer.wordpress.org/apis/security/data-validation/
- WordPress escaping: https://developer.wordpress.org/apis/security/escaping/

## Security Operating Model

Enterprise WordPress security is shared across platform, code, dependencies, operations, and people.

Always identify:

- Protected assets: user data, customer data, payment/order data, editorial content, secrets, API tokens, private media, analytics, logs, and admin actions.
- Actors: anonymous visitor, subscriber/customer, editor, admin, network admin, integration, compromised credential, malicious plugin, insider.
- Entry points: REST, admin-post, legacy AJAX, forms, uploads, webhooks, WP-CLI, cron/jobs, imports, feeds, XML-RPC, GraphQL, search, and third-party callbacks.
- Controls: capabilities, ownership checks, nonces, application passwords/OAuth, rate limiting, WAF/CDN, logging, alerting, and review gates.

## Access Governance

- Enforce least privilege for WordPress roles, VIP Dashboard, GitHub, CI secrets, package registries, DNS/CDN, analytics, and third-party services.
- Prefer SSO/MFA where available and remove stale users during offboarding.
- Separate production write access from day-to-day development access.
- Audit privileged actions through platform audit logs, GitHub audit logs, WP user changes, and WP-CLI command logs when available.
- Avoid shared admin accounts and long-lived personal tokens.

## Secure Delivery Gates

- Threat model new public endpoints, payment/account flows, uploads, webhooks, imports, and admin bulk actions.
- Require capability and object ownership checks for every sensitive action.
- Use REST routes with meaningful `permission_callback`; avoid new `admin-ajax.php` handlers unless legacy compatibility requires them.
- Sanitize/validate on ingress and escape at the final output boundary.
- Redact logs and error messages; never store secrets or PII in cron args, cache keys, URLs, localized JS, or PR text.
- Scan dependencies and lockfiles; review abandoned packages, postinstall scripts, typosquatting risk, and unpinned build actions.
- Confirm release artifacts do not include `.env`, local configs, tests with real credentials, node_modules unless required by platform, source maps with sensitive paths, or private keys.

## VIP Penetration Testing And Scans

For VIP-hosted environments, verify current VIP policy before scans. Current VIP docs require customers to create a Support ticket before penetration tests, security assessments, or scans, and to outline objectives and methodology. Testing scope is limited, platform infrastructure/services are out of scope, and DoS-style testing is not allowed.

## Compliance Deliverables

For enterprise clients, prepare lightweight but concrete artifacts:

- Data inventory: personal data, source, storage, retention, access, deletion/export process, processors.
- Security checklist: endpoints, auth, upload handling, secrets, logging, dependency status, backups, recovery.
- Audit evidence: commits, PR reviews, CI runs, scan results, access reviews, deployment records, incident notes.
- Privacy review: consent, tracking, cookies, data sharing, retention, regional handling, subject requests.
- Operational runbook: incident contacts, escalation, rotation, rollback, key revocation, emergency deploy path.

## Incident Response For Security Events

- Contain first: revoke keys, disable integration, force password resets, lock roles, block abusive route, or rollback.
- Preserve evidence without exposing sensitive data.
- Identify data exposure scope and legal/compliance notification requirements with the client.
- Rotate affected credentials and invalidate sessions/tokens.
- Patch root cause and add a regression test or monitoring rule.
- Document timeline, impact, controls that failed, and prevention tasks.
