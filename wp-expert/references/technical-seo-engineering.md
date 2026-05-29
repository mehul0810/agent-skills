# Technical SEO Engineering

Use this for WordPress technical SEO implementation and review: canonicals, redirects, robots, sitemaps, structured data, crawl budget, Core Web Vitals, hreflang, feeds, pagination, archives, migrations, and headless SEO contracts. For conversion-focused website builds, also read `conversion-focused-website-engineering.md`. For analytics and measurement events, also read `analytics-measurement-engineering.md`.

## Current Official Anchors

- Google Search Central: https://developers.google.com/search/docs
- Canonicalization: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Robots meta tags: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Structured data: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Core Web Vitals: https://web.dev/vitals/
- WordPress sitemaps developer note: https://make.wordpress.org/core/2020/07/22/new-xml-sitemaps-functionality-in-wordpress-5-5/

Search behavior and eligibility are drift-prone. Verify official search docs before making exact claims.

## SEO Contract Surfaces

- URLs, permalinks, redirects, canonical URLs, pagination, archives, taxonomy pages, author pages, search pages, feeds, sitemaps, robots, metadata, Open Graph/Twitter cards, structured data, breadcrumbs, hreflang, and internal links.
- Headless sites must recreate these contracts outside the WordPress theme.
- SEO plugins are implementation collaborators, not a substitute for validating rendered output and crawl behavior.

## Architecture Rules

- Choose canonical URLs deliberately. Do not create competing canonicals through theme, SEO plugin, headless frontend, and CDN rules.
- Redirects should be server/CDN-level where possible for scale, with WordPress-level redirects only when dynamic context is required.
- Avoid redirect chains, loops, mixed trailing-slash rules, query-string loss, and http/https/domain mismatches.
- Sitemaps should include indexable canonical URLs only and exclude internal search, low-value filters, duplicate archives, private content, preview URLs, and staging.
- Robots controls should be environment-aware. Staging must not leak into public indexing; production must not inherit staging `noindex`.

## Structured Data

- Match schema to real visible content and business facts. Do not mark up unavailable, hidden, fake, or unsupported claims.
- Avoid duplicate/conflicting schema from theme, SEO plugin, blocks, and custom code.
- For articles/products/events/local business/FAQ/how-to, verify current eligibility and required properties before implementation.
- Keep structured data stable across cached/uncached views and headless rendering.

## Performance And Crawl Budget

- Core Web Vitals are product and SEO risk. Optimize LCP, INP, CLS, server response, render-blocking assets, image sizing, font loading, and third-party scripts.
- Prevent crawl traps from faceted navigation, calendar archives, internal search, infinite parameters, and duplicate pagination.
- For large sites, coordinate sitemaps, internal linking, archive strategy, canonicalization, and search/index offload.

## Migration SEO

- Inventory old URLs, canonical targets, high-value backlinks, organic landing pages, redirects, sitemaps, robots, hreflang, schema, analytics, and Search Console properties.
- Validate before and after launch: sample redirects, 404s, canonicals, noindex, sitemap status, robots, structured data, page speed, and top organic pages.
- Keep rollback and redirect rollback separate. Rolling back code should not accidentally remove migration redirects.

## Validation

- Use rendered HTML checks, `curl -I`, sitemap fetches, robots fetches, structured data tests, Lighthouse/PageSpeed where useful, Search Console after launch, and crawler exports for larger sites.
- Check logged-out production-like pages. Logged-in/admin previews are not SEO evidence.

## Output Expectations

- State SEO contract touched, canonical/redirect/indexing impact, validation run, and any search-console or post-launch monitoring needed.
- Never promise ranking, rich result, or AI Overview inclusion. State eligibility and risk.
