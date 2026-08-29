# Content Writer Router

Use this router after `content-writer` is selected. Load one primary reference, then at most one shared support reference when current research or context risk requires it.

## Primary Routes

- SEO, AEO, GEO, AI Overviews, content briefs, search intent, schema-aware copy, and content refreshes: `organic-search-content.md`.
- Provider AI-search controls, visibility, fan-out, or scale/privacy: `../../shared/references/search-visibility-and-ai-discovery.md`.
- Voice-preserving edits or evidence-based detection of generic AI-writing patterns: `human-writing-quality-gate.md`.
- Enterprise product pages, buyer-facing messaging, security/privacy copy, case studies, comparisons, and WordPress VIP positioning: `enterprise-product-writing.md`.

## Selection Rules

- Do not load the editorial gate during research-only work.
- Do not force enterprise tone onto founder writing, community support, ordinary documentation, or general informational content.
- For a mixed enterprise landing page, use enterprise product writing as primary and load the editorial gate only for a final pass when generic prose is a confirmed risk.
- Keep implementation in `wp-site-expert`; this skill owns the content artifact.
- Route factual WordPress.org `readme.txt`, repository `README.md`, changelog, release-note, upgrade-notice, and release-document synchronization to `wp-product-docs-writer`; do not turn release truth into marketing copy.
