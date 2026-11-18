# Weekly WordPress Ecosystem Intelligence

Use this reference for recurring WordPress ecosystem research that informs product strategy, compatibility, security, release, or roadmap decisions.

Use `../source-freshness.json` for the small set of drift-prone upstream contracts with deterministic review windows. Update `checkedAt` only after reading the live primary source, then run `node scripts/source-freshness-audit.mjs`; do not turn it into an exhaustive link checker.

## Weekly WordPress Ecosystem Intelligence

Every week, check relevant WordPress ecosystem sources and store a concise durable summary so future product prompts use current knowledge instead of stale assumptions.

Useful sources include:

- `wordpress.org/news`.
- `make.wordpress.org/core`.
- `make.wordpress.org/plugins`.
- `make.wordpress.org/themes`.
- WordPress Developer Blog.
- Gutenberg release notes.
- WordPress Core field guide and dev notes.
- WordPress.org plugin/theme guideline updates.
- PHP and WordPress minimum version changes.
- WordPress security releases.

Use web search or direct official URLs when the topic is drift-prone. Do not use stale WordPress ecosystem knowledge for architecture or release decisions when current policy or version state may have changed.

For upgrade decisions, use `wordpress-7-0-7-1-enterprise-compatibility.md` for the stable baseline and separate 7.2 candidate checks. Compare the release archive, versioned Core dev notes, and Developer Blog: a Gutenberg plugin feature in the monthly roundup is not evidence that Core ships it.

## Storage Location

Choose the smallest durable location:

- Cross-product intelligence: shared skill/reference or automation memory.
- Product-specific impact: repo issue, `AGENTS.md`, `ROADMAP.md`, or `docs/research/`.
- Architecture or product decisions: ADR.

Do not create repo docs automatically unless there is a real durable gap.

## Summary Format

Capture:

- Date checked.
- Sources checked.
- Relevant changes.
- Product impact.
- Recommended issues or no-action rationale.
- Confidence/freshness.
