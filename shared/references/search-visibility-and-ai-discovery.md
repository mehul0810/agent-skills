# Search Visibility And AI Discovery

Use this reference for cross-provider SEO, AEO, GEO, AI SEO, crawler policy, AI-search measurement, and AI-assisted content decisions. Keep ordinary intent, on-page structure, and editorial drafting in `content-writer/references/organic-search-content.md`; keep WordPress implementation in `technical-seo-engineering.md` or `wp-site-expert`.

## Terminology And Provider Boundary

- **SEO** covers crawlability, rendering, indexing, serving, relevance, quality, links, and page experience.
- **AEO** (answer engine optimization) and **GEO** (generative engine optimization) are useful industry labels for making reliable answers easier to discover and cite. Google treats optimization for generative AI features as SEO, not a separate magic channel.
- **AI SEO** is an internal umbrella label, not a guaranteed ranking or citation system. Do not promise rankings, AI Overview/AI Mode inclusion, citations, traffic, or conversions.
- There is no universal AI schema, `llms.txt` requirement, ideal chunk length, keyword trick, or mention-building shortcut. Verify each provider's current documentation before recommending a directive or tactic.

## Eligibility And Source-Worthiness

Treat discovery as a chain, not a content-only score:

1. The intended URL is public, crawlable, renderable, canonical, and eligible for indexing/snippets.
2. Important meaning is present as accessible text and crawlable links; do not hide the answer in an image, canvas, client-only state, or login wall.
3. Mobile and desktop expose equivalent primary content, metadata, and structured data. Use distinct locale URLs and valid `hreflang` for multilingual pages; do not rely on automatic language redirects.
4. Structured data is accurate, current, relevant, and consistent with visible content. Validation indicates syntax/eligibility only; it does not guarantee a result.
5. The page earns source-worthiness through original analysis, firsthand experience, data or methodology, clear entities and relationships, limitations, author/reviewer accountability, and meaningful update dates.

For AI answer surfaces, map the primary intent plus likely follow-up questions, comparisons, constraints, and decision criteria (query fan-out). This improves completeness without writing unnatural passages for hypothetical prompts.

## Official Current Anchors

Re-check these live for drift-prone decisions:

- Google: [AI features](https://developers.google.com/search/docs/appearance/ai-features), [AI optimization](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), [Search Essentials](https://developers.google.com/search/docs/fundamentals/get-started), [crawling/indexing](https://developers.google.com/search/docs/crawling-indexing), [robots](https://developers.google.com/search/docs/crawling-indexing/robots/intro), [structured data](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), and [generative AI performance reporting](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports).
- Bing: [Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a), [AI Performance](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c), and [supported robots controls](https://www.bing.com/webmasters/help/robots-meta-tags-and-attributes-that-bing-supports-5198d240).
- OpenAI: [Publishers and Developers FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq), [ChatGPT Search](https://help.openai.com/en/articles/9237897-chatgpt-search), and [crawler guidance](https://help.openai.com/en/articles/20001243-advertiser-guidance-for-allowing-openai-web-crawlers).

## Crawler, Training, And Indexing Controls

Keep discovery, indexing, snippets, and training as separate decisions. `robots.txt` controls crawling and cannot by itself guarantee de-indexing; use `noindex` or authentication for exclusion, and ensure the crawler can read the directive. Provider names and semantics drift: verify the live policy rather than inventing a bot or copying another provider's syntax.

- Google: protect staging/private routes; do not block required rendering assets or canonical pages accidentally.
- Bing/Copilot: evaluate crawlable links, XML sitemaps, accurate `lastmod`, canonicalization, and IndexNow where useful; treat AI Performance as sampled grounding/citation evidence, not a ranking report.
- OpenAI/ChatGPT: distinguish `OAI-SearchBot` (search discovery) from `GPTBot` (potential training control); use `noindex` for pages that must not appear when the crawler can access it. Track referrals such as `utm_source=chatgpt.com` without exposing secrets, PII, private prompts, or staging data.

For any provider not listed, record the source URL, checked date, exact surface, and confidence. Never make a privacy or visibility promise from a third-party tool's unsupported score.

## Programmatic Content Quality Gate

AI may assist research, outlining, translation, or editing, but a named human/editor remains accountable for facts and publication. Before scaling pages, prove demand and unique user value, a source/fact ledger, editorial review, locale quality, canonical/hreflang correctness, duplicate and cannibalization checks, and a rollback/prune path. Reject scraped, synonym-spun, thin, mass auto-translated, or mass-generated pages that add little value; do not publish prompt-injected instructions, private data, or unsupported claims. Route security or privacy findings through the private process, not public content issues.

## AI Visibility Measurement

Define the page, topic, intent, provider, baseline window, and conversion event before changing content. Use available first-party evidence such as Google Search Console generative/Web reports, Bing AI Performance, server logs, and analytics referrals. Report citations/grounding, impressions, clicks, rankings, conversions, and support outcomes as separate measures with date, provider, sample, and limitations; do not infer causality from a single appearance or from a proprietary "AI score." Feed observed changes into a dated hypothesis and next test.

## WordPress Handoff

Keep answer-critical copy in native page/post blocks or server-rendered HTML, with one clear owner for titles, canonicals, hreflang, and schema. Validate logged-out rendered HTML, links, metadata, robots, sitemap, and structured data from the packaged/release-like build; a logged-in editor view is not search evidence. Hand implementation to `wp-site-expert`/technical SEO and hand factual WordPress.org artifacts to `wp-product-docs-writer`.

## Compact Output

Return only: sources and checked date; intent/entities and query-fan-out; eligibility and provider controls; content/privacy risks; measurement plan; confidence/freshness; and the WordPress implementation handoff. Mark unknowns instead of filling them with assumptions.
