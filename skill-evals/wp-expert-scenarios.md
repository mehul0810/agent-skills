# WP Expert Skill Evaluation Scenarios

Use these lightweight scenarios to verify that `wp-expert` routes to the right references and preserves the intended operating behavior. These are prompt-level checks, not automated correctness tests.

## Evaluation Rules

- Do not tell the agent which reference to load in the prompt.
- Passing output should identify the relevant primary reference or clearly follow its behavior.
- The agent should keep context tight, avoid broad reference loading, and state validation appropriate to risk.
- If a scenario asks for a review, findings should come first.

## Scenarios

| Scenario | Prompt | Expected primary reference | Pass signals |
| --- | --- | --- | --- |
| Release PR base | "Open a PR for this completed fix. It belongs to the 0.4.0 release." | `session-continuity-pr-discipline.md` | Checks repo/remote/current branch, fetches refs, looks for `release/0.4.0`, uses explicit `--base`, and verifies `baseRefName` after PR creation. |
| Exact CSS value | "Set the hero margin-top to 24px in the theme CSS. I will visually review it." | `planning-drift-control.md` | Applies exact value, confirms diff, avoids browser QA claim. |
| WooCommerce HPOS | "Review this WooCommerce extension for HPOS and Checkout Block readiness." | `woocommerce-commerce-engineering.md` | Checks CRUD usage, HPOS modes, Store API/block checkout, payments, refunds, and order data. |
| Headless preview | "Plan a Next.js frontend for WordPress with editor previews and cache invalidation." | `headless-decoupled-wordpress.md` | Defines API choice, preview auth, revalidation, SEO contracts, rollback. |
| Multisite migration | "We need to migrate settings across 2,000 subsites safely." | `advanced-multisite-network-engineering.md` | Uses batching, resume markers, blog IDs, cache keys, CLI/queues, rollback. |
| Technical SEO | "Audit a migration for canonicals, redirects, sitemaps, schema, and crawl risks." | `technical-seo-engineering.md` | Checks rendered output, redirect map, sitemap/indexing, structured data, post-launch monitoring. |
| Privacy review | "Review this plugin for consent, telemetry, and data erasure readiness." | `privacy-consent-data-governance.md` | Maps data inventory, consent, disclosures, exporters/erasers, retention, PII leaks. |
| Content model | "Should this feature use CPTs, taxonomies, blocks, post meta, or custom tables?" | `content-modeling-information-architecture.md` | Chooses by editorial workflow, query needs, lifecycle, permissions, scale. |
| Disaster recovery | "Create a release backout and restore plan for a high-traffic launch." | `disaster-recovery-business-continuity.md` | Defines RTO/RPO, backup surfaces, rollback, restore checks, approvals. |
| AI product | "Build an AI writing assistant inside wp-admin with streaming and provider fallback." | `ai-llm-wordpress-product-engineering.md` | Covers REST capabilities, secrets, privacy, cost limits, jobs, structured outputs, failure modes. |
| Marketplace product | "Prepare this freemium plugin for WordPress.org and pro update delivery." | `marketplace-product-readiness.md` | Covers free/pro boundary, license resilience, guidelines, readme, support diagnostics, packaging. |

## Regression Questions

- Did the agent avoid adding backward compatibility for unreleased intermediate work?
- Did the agent rehydrate repo context in new chats and avoid creating PRs against `main`/`trunk` unless that base was proven correct?
- Did the agent avoid `admin-ajax.php` for new interactive endpoints when REST fits?
- Did the agent preserve premium/enterprise UI expectations?
- Did the agent validate before completion and disclose any unrun checks?
- Did the agent keep token use low by loading only the needed references?
