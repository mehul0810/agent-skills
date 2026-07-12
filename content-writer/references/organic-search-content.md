# Organic Search Content

Use this reference for SEO, AEO, GEO, AI Overviews, AI Mode, answer engines, and AI-tool-aware content work.

## Official Anchors

- Google helpful people-first content: `https://developers.google.com/search/docs/fundamentals/creating-helpful-content`
- Google AI features and your website: `https://developers.google.com/search/docs/appearance/ai-features`
- Google structured data guidelines: `https://developers.google.com/search/docs/appearance/structured-data/sd-policies`
- Google guidance on AI-generated content: `https://developers.google.com/search/blog/2023/02/google-search-and-ai-content`

## Core Positioning

- Google says foundational SEO best practices remain relevant for AI features in Search, and there are no special AI Overview-only requirements.
- Content must still be crawlable, indexable, eligible for snippets, and useful to people.
- Structured data helps machines understand eligible visible content, but it must match the page and does not guarantee rich results.
- AI-assisted content is acceptable only when the result is original, useful, people-first, and not created primarily to manipulate rankings.

## Product Truth Gate

Before writing product, feature, comparison, release, integration, or landing-page claims:

1. Verify the current production release/tag and public package/listing when applicable.
2. Reconcile `PRODUCT.md`, `README`, public `readme.txt`, changelog/release notes, docs, and safe runtime/screenshots.
3. Classify each material claim as `shipped`, `verified limitation`, `planned/unreleased`, or `unknown`.
4. Use present-tense availability and schema only for shipped, evidenced behavior. Keep planned work explicitly future-facing and out of current feature/schema claims.
5. If sources conflict, stop the disputed claim and request product-PO/owner resolution rather than choosing the most favorable wording.

Keep a compact fact ledger for high-claim assets: `claim | status | source | freshness | confidence`. Do not paste it into the public draft unless citations are useful to readers.

## Search Intent Model

Classify the primary intent before drafting:

- Informational: explain, define, teach, compare, troubleshoot, or answer.
- Commercial: help evaluate vendors, products, approaches, pricing, risks, or alternatives.
- Transactional: convert with a clear offer, proof, friction removal, and next step.
- Navigational: help users reach a brand, product, docs, login, pricing, or support path.
- Local/geographic: include service area, local proof, contact path, reviews/testimonials policy, and location-specific constraints.

Then map secondary intents that AI systems may fan out into subquestions, comparisons, examples, risks, steps, and edge cases.

## Content Brief Template

```text
Topic:
Audience:
Business goal:
Primary search intent:
Secondary intents:
Funnel stage:
Geography/language:
Unique angle:
Required sources:
Primary entities:
Questions to answer:
Content type:
Recommended structure:
Internal-link targets:
External/source references:
Schema candidates:
Trust signals:
Conversion path:
Validation checklist:
```

## Answer-First Structure

For informational and answer-engine-focused content:

1. Open with a direct, concise answer.
2. Define key terms in plain language.
3. Explain when the answer changes by context.
4. Provide steps, examples, comparison criteria, or decision paths.
5. Include FAQs only when they answer real follow-up questions.
6. End with the practical next step, checklist, or decision summary.

Avoid long intros that delay the answer.

## GEO And AI Tool Visibility

Optimize for source-worthiness, not gimmicks:

- Use clear claims that can be quoted or summarized accurately.
- Include original analysis, experience, examples, methodology, or data when available.
- Make entity relationships explicit: who, what, where, use case, alternatives, constraints, and outcomes.
- Add comparison tables for options, tools, plans, risks, or criteria when useful.
- Use consistent names for brands, products, people, locations, features, and standards.
- Keep facts fresh and label time-sensitive information with a meaningful updated date.
- Cite primary sources for claims that AI tools may need to verify.

## Schema-Aware Copy

Recommend schema only when it represents visible page content and matches supported search features:

- `Article` or `BlogPosting` for editorial content.
- `FAQPage` only when visible FAQs are genuine page content and policy-appropriate.
- `HowTo` only when the page contains real step-by-step instructions.
- `Product`, `Review`, `LocalBusiness`, `Organization`, `Service`, `Event`, or `SoftwareApplication` only when the page content supports it.

Do not invent reviews, ratings, author credentials, availability, prices, or organization data for schema.

## On-Page Checklist

- One clear H1 that matches the page purpose.
- H2/H3 hierarchy follows user questions and decision flow.
- Title tag is specific, benefit-aware, and not clickbait.
- Meta description summarizes the value and next step.
- Important content is available as text, not only images, video, or scripts.
- Internal links use descriptive anchor text and support topical authority.
- Images/video recommendations include useful alt text, captions, and filenames where relevant.
- CTAs fit the intent and do not interrupt the answer.
- Content avoids keyword stuffing, generic filler, unsupported superlatives, and duplicate sections.

## Trust And E-E-A-T Signals

Use trust signals that are true for the publisher:

- Author, reviewer, or expert contributor where readers would expect it.
- Firsthand experience, screenshots, examples, original data, client-safe case studies, or methodology.
- Clear update notes for time-sensitive topics.
- Company/about context, contact path, editorial policy, or support path when relevant.
- Balanced tradeoffs and limitations instead of one-sided claims.

## Refresh And Pruning Rules

For existing content:

- Keep sections that still satisfy intent and have accurate facts.
- Update stale claims, screenshots, dates, pricing, UI names, regulations, and tool behavior.
- Merge overlapping pages that cannibalize the same intent.
- Prune thin sections that add no unique value.
- Redirect consolidated URLs only when a better canonical target exists.
- Preserve ranking URLs and internal links unless there is a clear consolidation or migration reason.

## Output Formats

Brief:

```text
Audience:
Intent:
Angle:
Outline:
Entities:
Questions:
Sources:
Schema:
Internal links:
Trust signals:
Acceptance checks:
```

Draft:

```text
Title:
Meta description:
Slug:
H1:
Body:
FAQ:
Schema candidates:
Source notes:
Revision assumptions:
```

Audit:

```text
Findings:
Intent gaps:
Content gaps:
Trust gaps:
Technical/content schema gaps:
Recommended fixes:
Validation:
```
