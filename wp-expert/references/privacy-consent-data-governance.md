# Privacy, Consent, And Data Governance

Use this for GDPR/CCPA-style requirements, consent, telemetry, retention, export/erase support, audit logs, PII, third-party sharing, and privacy reviews. Add `analytics-measurement-engineering.md` only when a confirmed measurement implementation risk requires it.

## Current Official Anchors

- WordPress privacy docs: https://wordpress.org/documentation/article/wordpress-privacy/
- Plugin privacy hooks: https://developer.wordpress.org/plugins/privacy/privacy-related-options-hooks-and-capabilities/
- Personal data eraser: https://developer.wordpress.org/plugins/privacy/adding-the-personal-data-eraser-to-your-plugin/
- WordPress.org plugin guidelines: https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/
- VIP Trust Center: https://wpvip.com/trust/

Privacy law and platform policy are drift-prone. Verify current legal/client requirements and official platform guidance before final advice.

## Data Inventory First

Map every personal or sensitive data surface:

- Inputs: forms, checkout, comments, accounts, analytics, support, uploads, API/webhook payloads, imports, AI prompts, logs, and admin notes.
- Storage: options, meta, custom tables, order/customer records, logs, transients, cache, queues, files, third-party providers, search indexes, and backups.
- Outputs: frontend, REST, admin screens, exports, emails, webhooks, feeds, localized JS, debug pages, logs, screenshots, and PRs.
- Lifecycle: collection, consent, purpose, retention, export, correction, erasure, anonymization, and deletion from processors.

## Consent And Disclosure

- Do not contact external services, collect telemetry, track users, or send data to AI/API providers without explicit product/legal basis and clear disclosure.
- Consent must be specific to the purpose. Marketing consent, analytics consent, support diagnostics, and required transactional processing are different.
- Keep consent state auditable: who consented, when, version of terms/policy, scope, revocation, and source.
- Avoid dark patterns. Consent UI must be clear, reversible, accessible, and not bundled with unrelated actions.

## WordPress Privacy Integration

- Register exporters with `wp_privacy_personal_data_exporters` when plugin data contains personal data.
- Register erasers with `wp_privacy_personal_data_erasers` when data can be deleted or anonymized.
- Suggest privacy policy text for plugin-specific processing when appropriate.
- Include user ID, email, order/customer IDs, IP addresses, API identifiers, and provider IDs in data discovery.
- For erasure, define what is deleted, anonymized, retained for legal/security reasons, or delegated to third-party processors.

## Data Minimization And Security

- Collect the minimum data needed for the feature and keep it for the shortest useful period.
- Hash, tokenize, redact, or aggregate when raw PII is not required.
- Never put secrets or PII in URLs, cache keys, cron args, localStorage when avoidable, public REST responses, screenshots, logs, or frontend JS.
- Protect admin diagnostics with capabilities, redaction, and copy-safe output.
- For AI/LLM features, treat prompts, uploaded files, user content, and model outputs as potentially sensitive.

## Retention And Operations

- Define retention for logs, analytics events, form submissions, queue payloads, exports, failed API calls, and backups.
- Make retention jobs idempotent, batched, and observable.
- Document sub-processors, data regions, support access, breach notification process, and audit evidence when enterprise clients require it.
- Plan backup/search-index/cache erasure limitations honestly.

## Validation

- Test export, erasure, consent revocation, telemetry opt-out, role access, redacted logs, REST exposure, and third-party data flows.
- Review plugin readme/privacy disclosures and admin settings for external-service behavior.

## Output Expectations

- State data collected, purpose, storage, sharing, retention, export/erase behavior, consent requirement, and residual legal/client review needs.
- For reviews, prioritize undisclosed tracking, PII leaks, missing erasure/export support, excessive retention, and processor disclosure gaps.
