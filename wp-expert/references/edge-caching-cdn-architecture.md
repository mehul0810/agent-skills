# Edge Caching And CDN Architecture

Use this for page cache, CDN behavior, static assets, object cache interaction, personalization, purge strategy, cache stampedes, and high-traffic anonymous delivery.

## Current Official Anchors

- VIP caching overview: https://docs.wpvip.com/technical-references/caching/
- VIP page cache: https://docs.wpvip.com/caching/page-cache/
- VIP default page-cache responses: https://docs.wpvip.com/caching/page-cache/default-responses/
- VIP cache-control headers: https://docs.wpvip.com/caching/page-cache/modify-max-age/
- VIP page-cache purging: https://docs.wpvip.com/caching/page-cache/purging/
- VIP object cache: https://docs.wpvip.com/caching/object-cache/
- VIP static asset caching: https://docs.wpvip.com/caching/static-asset-caching/

## Architecture Principle

For sites with millions of visits per hour, page cacheability is a product requirement. The fastest PHP request is the one that never reaches PHP.

Design public experiences as cacheable shells with targeted dynamic behavior:

- Keep anonymous GET pages free of unnecessary cookies, personalized HTML, random output, and no-cache headers.
- Move personalization to client-side REST calls, logged-in-only fragments, or bounded APIs when the full page can remain cacheable.
- Do not add tracking/session cookies from PHP unless the business value is worth the cache hit-rate loss.
- Separate editorial preview/admin/editor behavior from anonymous visitor behavior.
- Make cache key dimensions explicit: URL, host, blog ID, locale, device class if truly necessary, experiment variant, and permission boundary.

## Layered Cache Model

- Edge/page cache: first defense for anonymous traffic and static responses.
- Static asset cache/CDN: immutable built assets, media, CSS, JS, fonts, and images.
- Object cache: expensive computed data, query results, remote responses, and transient-style state.
- Query cache: platform-level help for some query shapes, but not a substitute for bounded queries and good indexes.
- Browser cache: long-lived assets with content hashes; careful HTML/no-store behavior where needed.

## WordPress Implementation Guidance

- Use hashed build filenames or versioned asset URLs for long-lived static assets.
- Load assets only where needed; avoid global admin/frontend enqueue bloat.
- Use REST `GET` routes for dynamic fragments when a page must remain cacheable; keep responses small and permission-aware.
- Avoid nonces in anonymous page HTML unless the page is intentionally uncacheable or the nonce is fetched separately.
- Do not render user-specific data into cacheable HTML.
- Keep `Vary` dimensions minimal; every variation reduces cache efficiency.
- Prefer targeted purges over global cache clears.
- Invalidate object-cache keys near the data owner on every write path.

## Stampede And Hot-Miss Protection

Use these when many requests can miss cache at once:

- Short lock with stale fallback for expensive regeneration.
- Async cache warming after deploy, publish, or import.
- Bounded TTL with jitter for many related keys.
- Request coalescing for remote calls and expensive reports.
- Precompute high-traffic pages, menus, navigation trees, related content, and search facets when possible.

## Cache Failure Review

Check for:

- Cookies or auth checks on public pages.
- Cache-control headers that accidentally bypass edge caching.
- Query parameters that create low-value cache variants.
- Personalized blocks, notices, experiments, or geolocation rendered server-side.
- Global purges triggered by small writes.
- Object-cache payloads over platform limits or cache keys missing site/locale/role dimensions.
- Slow cache misses caused by remote HTTP, broad queries, or multiple cache rebuilds.

## Acceptance Checks

- Anonymous critical pages are cacheable and do not set avoidable cookies.
- Logged-in/admin/editor flows still receive correct private data.
- Cache invalidation is targeted and covered by tests or smoke checks.
- Origin miss behavior remains fast enough under peak traffic assumptions.
- Monitoring exposes cache hit rate, origin request volume, slow misses, and purge activity where available.
