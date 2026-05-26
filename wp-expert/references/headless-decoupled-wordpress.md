# Headless And Decoupled WordPress

Use this for headless WordPress, Next.js/React frontends, WPGraphQL, REST API frontends, previews, ISR/cache invalidation, decoupled search, redirects, media, and editorial workflows.

## Current Official Anchors

- WordPress REST API reference: https://developer.wordpress.org/rest-api/reference/
- WordPress REST API authentication: https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/
- WPGraphQL docs: https://www.wpgraphql.com/docs/
- WPGraphQL vs REST: https://www.wpgraphql.com/docs/wpgraphql-vs-wp-rest-api
- Next.js preview mode: https://nextjs.org/docs/pages/guides/preview-mode
- Next.js data fetching and caching docs should be verified for the project's exact Next.js version.

Verify current framework docs before implementing cache, draft/preview, or deployment behavior.

## Architecture Decision

Do not choose headless by default. Confirm the reason:

- Needs frontend technology not practical in a WordPress theme.
- Needs multi-channel content delivery.
- Needs independent frontend deploys or edge rendering.
- Needs frontend performance/control that offsets editorial and operational complexity.

Prefer a WordPress theme or block theme when the requirement is mostly editable marketing pages, low operational complexity, plugin compatibility, or native editor preview.

## API Selection

- Use REST when the data shape is simple, native endpoints are enough, or custom endpoints can provide stable bounded responses.
- Use WPGraphQL when the frontend needs composable queries, typed schema, nested data, GraphQL tooling, or schema extensions.
- Use custom REST endpoints for productized frontend contracts when generic post endpoints would expose too much, require too many round trips, or create N+1 behavior.
- Keep API contracts versioned, documented, permissioned, cacheable where safe, and tested with real frontend queries.

## Editorial Preview

- Preview is not optional for enterprise editorial teams.
- Support draft, scheduled, password-protected, private, preview revisions, and preview links with expiring secrets.
- Do not expose unpublished content through public caches, unauthenticated APIs, sitemaps, search indexes, social metadata, or client bundles.
- Preview mode should bypass static caches deliberately and only for authorized preview sessions.
- Validate editor save -> preview -> publish -> frontend cache revalidation as one workflow.

## Cache And Revalidation

- Define cache ownership at each layer: WordPress object cache, API response cache, CDN, frontend framework cache, ISR/static generation, browser cache, and search index.
- Revalidate on meaningful content events: post publish/update/delete, taxonomy change, menu change, media change, author/profile change, global options, redirects, and SEO metadata.
- Avoid full-site rebuilds when targeted path or tag revalidation is available.
- Keep cache keys aware of locale, site/blog ID, preview state, auth state, device only when necessary, and personalization.
- Plan stale-content tolerance and emergency purge behavior.

## Frontend Contracts

- Preserve canonical URLs, redirects, breadcrumbs, hreflang, robots, structured data, pagination, archives, feeds, and media alt/caption semantics.
- Handle WordPress rendered HTML safely. Sanitize or constrain allowed blocks/HTML if rendering raw post content in React.
- Media should use responsive image metadata, alt text, sizes, focal points when available, and CDN transforms deliberately.
- Authentication should avoid leaking cookies/tokens across origins. Use server-side token handling where possible.

## Validation

- Test published page, draft preview, scheduled post, private content, 404, redirect, pagination, search, sitemap, canonical, social metadata, and cache revalidation.
- Load test the actual API query mix. Headless frontends can shift load from PHP templates to REST/GraphQL endpoints.
- Include rollback: frontend deploy rollback, WordPress API rollback, cache purge, preview disablement, and search index recovery.

## Output Expectations

- State why headless is justified, API choice, preview plan, cache/revalidation model, SEO contract, and operational tradeoffs.
- For reviews, prioritize preview leaks, stale frontend content, N+1 API load, SEO regressions, auth mistakes, and broken editorial workflows.
