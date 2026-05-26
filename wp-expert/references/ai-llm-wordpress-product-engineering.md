# AI And LLM WordPress Product Engineering

Use this for AI-powered WordPress plugins, admin assistants, content tools, chat/search, MCP or agent integrations, embeddings, provider abstractions, streaming UX, prompt safety, cost controls, and privacy-aware AI features.

## Current Official Anchors

- OpenAI API docs: https://platform.openai.com/docs
- OpenAI rate limits: https://platform.openai.com/docs/guides/rate-limits
- OpenAI structured outputs: https://platform.openai.com/docs/guides/structured-outputs
- WordPress REST API reference: https://developer.wordpress.org/rest-api/reference/
- WordPress privacy hooks: https://developer.wordpress.org/plugins/privacy/privacy-related-options-hooks-and-capabilities/

AI provider APIs change quickly. Verify current provider docs, model names, rate limits, pricing, data-retention terms, and safety constraints before implementation.

## Product Fit

- Define the user job and failure cost before adding AI.
- Prefer deterministic WordPress logic for permissions, data writes, billing, publishing, and destructive actions.
- AI should assist, draft, classify, summarize, search, or recommend unless explicit human approval and audit trails exist for actions.
- Keep premium UX: explain what the AI is doing, show progress, handle failures, allow edits, and avoid magical black boxes.

## Architecture

- Use a provider abstraction when the product needs fallback, customer-selected providers, test doubles, or future model changes.
- Keep prompts, schemas, tools, model config, timeout, retry, and safety policy versioned.
- Use background jobs for long tasks, bulk generation, embeddings, imports, and provider retries.
- Use streaming only when it improves UX; store final canonical output and errors intentionally.
- Keep structured outputs schema-driven and validate model output server-side before saving.

## WordPress Integration

- Expose internal UI operations through REST routes with capability checks and explicit schemas.
- Never put API keys or provider secrets in client JS, localized data, logs, screenshots, cache keys, or cron args.
- Store credentials in the safest available project pattern: environment variables, constants, secret manager, or protected options.
- Gate actions by actor and object ownership. AI features must not bypass WordPress capabilities.
- For editor integrations, preserve autosaves, revisions, undo behavior, and explicit publish/update control.

## Privacy And Safety

- Treat prompts, uploaded files, selected post content, comments, customer data, order data, and model outputs as sensitive.
- Disclose provider data sharing and retention. Get consent when sending personal data or site content to external AI services.
- Redact or minimize PII before provider calls when possible.
- Add abuse controls: rate limits, quotas, spending caps, job limits, content filters, and audit logs.
- Avoid using model output as executable code, SQL, shell commands, or privileged instructions without deterministic review.

## Embeddings And Retrieval

- Define what is indexed, how it is chunked, who can access it, how it updates, and how it is deleted.
- Include post status, site/blog ID, locale, capability visibility, and source URL in metadata.
- Reindex on publish/update/delete, privacy erase, permission changes, and migration.
- Prevent retrieval leaks across private content, multisite boundaries, customers, tenants, and roles.

## Testing And Operations

- Test provider outage, timeout, rate limit, malformed response, refusal, partial streaming response, duplicate job, cancelled job, and quota exceeded.
- Use fixtures/mocks for repeatable tests; reserve live provider tests for smoke checks.
- Log redacted diagnostics: request type, model, token/cost estimate, duration, status, error class, and job ID.
- Include cost monitoring and backpressure. AI features can create production bills and queue storms.

## Output Expectations

- State provider docs checked, data sent, permission model, cost controls, fallback behavior, tests, and privacy disclosures.
- For reviews, prioritize secret leaks, PII disclosure, capability bypass, unbounded costs, unsafe autonomous actions, and retrieval leaks.
