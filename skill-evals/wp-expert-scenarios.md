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
| Missing test coverage | "Review this PR and tell me if it is missing test coverage." | `test-coverage-discipline.md` | Identifies changed behavior, existing coverage, missing negative/failure scenarios, severity, and exact tests that should be added or explains why no new tests are needed. |
| Acceptance criteria | "Define done criteria for this REST API feature before implementation." | `enterprise-acceptance-criteria-templates.md` | Produces functional, security, data, performance, UX, compatibility, tests, validation, and rollback acceptance checks. |
| Exact CSS value | "Set the hero margin-top to 24px in the theme CSS. I will visually review it." | `planning-drift-control.md` | Applies exact value, confirms diff, avoids browser QA claim. |
| Brainstorming without overengineering | "Brainstorm implementation approaches for this feature, but keep it enterprise-grade and do not overengineer it." | `thinking-brainstorming-engineering-discipline.md` | Provides no more than 3 options, recommends one, rejects weaker paths, names validation/next step, and avoids broad reference loading unless a named risk requires it. |
| Plugin product architecture | "Design this plugin so add-ons can extend it safely without breaking upgrades." | `plugin-product-architecture.md` | Inventories public contracts, hooks/filters, add-on boundaries, feature flags, dependency detection, diagnostics, and upgrade rules. |
| Plugin supportability | "Add enterprise support diagnostics and safe recovery tools to this plugin." | `plugin-debuggability-supportability.md` | Covers Site Health, redacted support export, log levels, correlation IDs, recovery controls, permissions, and tests. |
| WooCommerce HPOS | "Review this WooCommerce extension for HPOS and Checkout Block readiness." | `woocommerce-commerce-engineering.md` | Checks CRUD usage, HPOS modes, Store API/block checkout, payments, refunds, and order data. |
| Headless preview | "Plan a Next.js frontend for WordPress with editor previews and cache invalidation." | `headless-decoupled-wordpress.md` | Defines API choice, preview auth, revalidation, SEO contracts, rollback. |
| Multisite migration | "We need to migrate settings across 2,000 subsites safely." | `advanced-multisite-network-engineering.md` | Uses batching, resume markers, blog IDs, cache keys, CLI/queues, rollback. |
| Technical SEO | "Audit a migration for canonicals, redirects, sitemaps, schema, and crawl risks." | `technical-seo-engineering.md` | Checks rendered output, redirect map, sitemap/indexing, structured data, post-launch monitoring. |
| Privacy review | "Review this plugin for consent, telemetry, and data erasure readiness." | `privacy-consent-data-governance.md` | Maps data inventory, consent, disclosures, exporters/erasers, retention, PII leaks. |
| Security threat model | "Threat model this REST route that uploads files and triggers an external webhook." | `security-threat-modeling-review.md` | Maps assets, actors, entry points, trust boundaries, capability/ownership checks, SSRF/upload risks, webhook replay, and negative tests. |
| Performance budget | "Profile this admin report and set scale budgets for a site with 500k posts." | `performance-profiling-scale-budgets.md` | Defines path/traffic/data model, baseline measurements, query/cache/admin latency budgets, structural fixes, and re-measurement plan. |
| Database table architecture | "Review these custom tables for performance, scalability, and maintainability." | `database-table-architecture-review.md` | Checks custom-table fit, schema ownership, query-to-index mapping, migrations, multisite, retention, privacy, concurrency, and repository/test boundaries. |
| Content model | "Should this feature use CPTs, taxonomies, blocks, post meta, or custom tables?" | `content-modeling-information-architecture.md` | Chooses by editorial workflow, query needs, lifecycle, permissions, scale. |
| Hybrid theme migration | "Plan a classic theme and page-builder site migration to a block theme without losing SEO." | `hybrid-theme-migration-modernization.md` | Audits current theme/builder/SEO/templates, selects phased strategy, separates plugin-owned data, validates parity, and defines rollback. |
| Theme frontend performance | "Review this block theme for Core Web Vitals, fonts, images, and asset bloat." | `theme-frontend-performance-quality-gate.md` | Checks LCP/CLS/INP risk, font loading, responsive images, asset scoping, block CSS bloat, editor/frontend CSS, and responsive quality. |
| UX strategy | "Review this product dashboard UX before implementation and identify what is missing from the flow." | `ux-product-strategy-design-qa.md` | Maps user, primary job, journey, IA, states, UX copy, premium/enterprise risks, and validation plan. |
| Conversion website | "Build a conversion-focused WordPress landing page with tracking and enterprise quality gates." | `conversion-focused-website-engineering.md` | Defines conversion goal, CTA path, trust proof, form friction, measurement, accessibility, SEO, performance, and validation. |
| Analytics measurement | "Implement GA4/GTM-style funnel tracking for this WordPress lead form without privacy issues." | `analytics-measurement-engineering.md` | Defines measurement plan, consent category, event source, data layer, duplicate prevention, PII boundaries, and validation. |
| Design image parity | "Implement this provided landing page screenshot in a WordPress block theme and make it pixel perfect." | `ux-product-strategy-design-qa.md` | Treats image as source of truth, extracts measurable visual details, maps to WordPress primitives, preserves accessibility/responsiveness/editability, and uses visual parity evidence. |
| Disaster recovery | "Create a release backout and restore plan for a high-traffic launch." | `disaster-recovery-business-continuity.md` | Defines RTO/RPO, backup surfaces, rollback, restore checks, approvals. |
| Launch readiness | "Run a go/no-go review for this VIP launch next week." | `vip-enterprise-launch-readiness.md` | Checks code, data, cache/CDN, search/SEO, performance, security/privacy, observability, rollback, support, and post-launch monitoring. |
| Advanced troubleshooting | "Production checkout is intermittently failing and cache behavior looks suspicious." | `advanced-troubleshooting-decision-tree.md` | Preserves evidence, maps symptom to probes, isolates cache/provider/conflict/race causes, mitigates first, and defines regression guard. |
| AI product | "Build an AI writing assistant inside wp-admin with streaming and provider fallback." | `ai-llm-wordpress-product-engineering.md` | Covers REST capabilities, secrets, privacy, cost limits, jobs, structured outputs, failure modes. |
| Marketplace product | "Prepare this freemium plugin for WordPress.org and pro update delivery." | `marketplace-product-readiness.md` | Covers free/pro boundary, license resilience, guidelines, readme, support diagnostics, packaging. |

## Regression Questions

- Did the agent avoid adding backward compatibility for unreleased intermediate work?
- Did the agent rehydrate repo context in new chats and avoid creating PRs against `main`/`trunk` unless that base was proven correct?
- Did the agent make an explicit test coverage decision for each code change or PR?
- Did the agent define acceptance criteria before substantial plugin, theme, API, migration, performance, security, or conversion work?
- Did the agent use bounded brainstorming, recommend a path, and avoid overengineering while preserving enterprise quality?
- Did the agent stop premium UI polish once the changed surface met agreed quality criteria and move subjective extras to backlog?
- Did the agent account for plugin public contracts, supportability, diagnostics, and upgrade-safe extension surfaces when building product-grade plugins?
- Did the agent flag missing coverage only when a concrete behavior/security/data/scale/editor/release regression risk exists?
- Did the agent avoid `admin-ajax.php` for new interactive endpoints when REST fits?
- Did the agent threat-model sensitive endpoints and require negative security tests?
- Did the agent measure or define budgets before claiming performance work is done?
- Did the agent map custom table queries to indexes, migrations, ownership, retention, and maintainability before approving the schema?
- Did the agent preserve premium/enterprise UI expectations?
- Did the agent use UX discovery, information architecture, state coverage, UX writing, and design QA before substantial UI implementation?
- Did the agent treat provided design images/screenshots/mockups as visual source of truth and pursue pixel-faithful parity without sacrificing accessibility, responsiveness, editability, performance, or maintainability?
- Did the agent preserve conversion goals, consent-aware measurement, accessibility, SEO, and Core Web Vitals for conversion-focused websites?
- Did the agent use launch readiness and advanced troubleshooting gates before claiming VIP/enterprise work is production-ready?
- Did the agent validate before completion and disclose any unrun checks?
- Did the agent keep token use low by loading only the needed references?
