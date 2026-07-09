# WP Expert Skill Evaluation Scenarios

Use these lightweight scenarios to verify that `wp-expert` routes to the right specialist or reference and preserves the intended operating behavior. These are prompt-level checks, not automated correctness tests.

## Evaluation Rules

- Do not tell the agent which reference to load in the prompt.
- Passing output should identify the relevant primary reference or clearly follow its behavior.
- The agent should keep context tight, avoid broad reference loading, and state validation appropriate to risk.
- Record skills/references loaded and flag avoidable loads; use `visual-wordpress-scenarios.md` for design/image forward tests.
- If a scenario asks for a review, findings should come first.

## Scenarios

| Scenario | Prompt | Expected primary reference | Pass signals |
| --- | --- | --- | --- |
| Plugin specialist routing | "Build a plugin admin settings feature that saves through REST and needs tests." | `wp-plugin-expert` | Routes to the plugin specialist, then loads only the needed plugin/admin/REST/test references instead of broad theme/site guidance. |
| Theme specialist routing | "Implement this FSE block theme page from the provided screenshot and keep content editable." | `wp-theme-expert` | Routes to the theme specialist, preserves Post Content/page editability, avoids Custom HTML/Shortcode shortcuts, and loads only block/FSE/design references. |
| Site specialist routing | "Improve this landing page conversion flow, SEO structure, analytics, and mobile UX." | `wp-site-expert` | Routes to the site specialist, focuses on conversion/UX/SEO/analytics/mobile proof, and avoids plugin/theme internals unless a confirmed risk requires them. |
| Automatic specialist selection | "This is a plugin REST settings bug; fix it and add coverage." | `wp-plugin-expert` | Selects the plugin specialist directly from the task signal, does not load `wp-expert` broad references or `reference-routing-map.md`, and uses at most one supporting reference for a confirmed risk. |
| Release PR base | "Open a PR for this completed fix. It belongs to the 0.4.0 release." | `session-continuity-pr-discipline.md` | Checks repo/remote/current branch, fetches refs, looks for `release/0.4.0`, uses explicit `--base`, and verifies `baseRefName` after PR creation. |
| Issue milestone PR base | "Issue #123 is in milestone 0.5.0. Create a PR for the completed work." | `session-continuity-pr-discipline.md` | Inspects the issue milestone and related release branches, bases the PR on `release/0.5.0` when it exists, passes `--base` explicitly, and documents the base reason in the PR body. |
| Project subagents and Spark usage | "Configure project-level Codex subagents for a large WordPress plugin review and use gpt-5.3-codex-spark efficiently." | `project-subagent-routing.md` | Uses project `.codex/agents/*.toml`, assigns Spark to bounded mappers/fixers, reserves stronger model for high-risk review, keeps `max_depth` conservative, and avoids global hooks for dynamic skill routing. |
| Missing test coverage | "Review this PR and tell me if it is missing test coverage." | `test-coverage-discipline.md` | Identifies changed behavior, existing coverage, missing negative/failure scenarios, severity, and exact tests that should be added or explains why no new tests are needed. |
| Acceptance criteria | "Define done criteria for this REST API feature before implementation." | `enterprise-acceptance-criteria-templates.md` | Produces functional, security, data, performance, UX, compatibility, tests, validation, and rollback acceptance checks. |
| Exact CSS value | "Set the hero margin-top to 24px in the theme CSS. I will visually review it." | `planning-drift-control.md` | Applies exact value, confirms diff, avoids browser QA claim. |
| Exact artifact first | "Review PR #149 and tell me if it is merge-ready." | `worker-execution-discipline.md` | Inspects the exact referenced PR first, does not switch to unrelated open PRs, and reports if the referenced entity is closed/merged/not-open. |
| Blocked worker recovery | "The browser proof path failed for this admin UI change. Continue safely." | `worker-execution-discipline.md` | Rechecks the exact changed boundary, downgrades to the cheapest safe proof or fallback evidence, reports the remaining proof gap, and does not stop at a generic tool failure. |
| Assumption gate | "Implement whichever content ownership model seems best for this FSE page." | `worker-execution-discipline.md` | Stops to surface the contract choice when two materially different editability or ownership models would change the result. |
| Finish pass | "The scoped bug fix is done. Anything else?" | `worker-execution-discipline.md` | Runs a narrow finish pass over tests, docs/release metadata, dead/duplicate code, UI proof drift, and adjacent findings without broadening the PR. |
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
| Enterprise design judgment | "Review this enterprise AI workflow landing page and admin preview so it feels credible, governed, and buyer-ready instead of generic SaaS." | `ux-product-strategy-design-qa.md` | Uses enterprise design judgment for role-based IA, proof-led hierarchy, trust signals, governed workflow framing, screenshots/evidence, and failure behavior instead of vague AI novelty. |
| Conversion website | "Build a conversion-focused WordPress landing page with tracking and enterprise quality gates." | `conversion-focused-website-engineering.md` | Defines conversion goal, CTA path, trust proof, form friction, measurement, accessibility, SEO, performance, and validation. |
| Analytics measurement | "Implement GA4/GTM-style funnel tracking for this WordPress lead form without privacy issues." | `analytics-measurement-engineering.md` | Defines measurement plan, consent category, event source, data layer, duplicate prevention, PII boundaries, and validation. |
| Design image parity | "Implement this provided landing page screenshot in a WordPress block theme and make it pixel perfect." | `visual-to-wordpress-implementation.md` | Inspects and classifies the source, records supplied/measured/inferred details, maps WordPress ownership/primitives, preserves accessibility/responsiveness/editability, and uses matched parity evidence. |
| Visual asset generation | "Implement this WordPress page design, including missing hero artwork." | `visual-to-wordpress-implementation.md` | Inspects the source, inventories missing assets, creates an asset brief, uses image generation only for suitable raster assets, verifies crops/provenance/optimization, and keeps text/UI in real blocks. |
| Unavailable design tool | "Explore directions for this admin redesign; one suggested design helper is unavailable." | `design-intelligence-routing.md` | Discovers available capabilities, builds a compact evidence brief, uses a safe available route, and neither invents the tool nor stops without recovery. |
| Owner visual correction | "This screenshot implementation is wrong because editors cannot change the visible page from Pages > Edit." | `worker-execution-discipline.md` | Corrects ownership, classifies the repeatable failure, dedupes guidance, routes learning to the right durable artifact, and adds behavior coverage instead of leaving it in chat. |
| Disaster recovery | "Create a release backout and restore plan for a high-traffic launch." | `disaster-recovery-business-continuity.md` | Defines RTO/RPO, backup surfaces, rollback, restore checks, approvals. |
| Launch readiness | "Run a go/no-go review for this VIP launch next week." | `vip-enterprise-launch-readiness.md` | Checks code, data, cache/CDN, search/SEO, performance, security/privacy, observability, rollback, support, and post-launch monitoring. |
| Advanced troubleshooting | "Production checkout is intermittently failing and cache behavior looks suspicious." | `advanced-troubleshooting-decision-tree.md` | Preserves evidence, maps symptom to probes, isolates cache/provider/conflict/race causes, mitigates first, and defines regression guard. |
| AI product | "Build an AI writing assistant inside wp-admin with streaming and provider fallback." | `ai-llm-wordpress-product-engineering.md` | Covers REST capabilities, secrets, privacy, cost limits, jobs, structured outputs, failure modes. |
| Marketplace product | "Prepare this freemium plugin for WordPress.org and pro update delivery." | `marketplace-product-readiness.md` | Covers free/pro boundary, license resilience, guidelines, readme, support diagnostics, packaging. |

## Regression Questions

- Did the agent avoid adding backward compatibility for unreleased intermediate work?
- Did the agent rehydrate repo context in new chats and avoid creating PRs against `main`/`trunk` unless that base was proven correct?
- Did the agent inspect issue milestones and target matching release branches before creating issue-driven PRs?
- Did the agent use project-level subagents only when bounded routing saves time or reduces risk, with `gpt-5.3-codex-spark` assigned to appropriate lower-risk lanes?
- Did the agent make an explicit test coverage decision for each code change or PR?
- Did the agent define acceptance criteria before substantial plugin, theme, API, migration, performance, security, or conversion work?
- Did the agent use bounded brainstorming, recommend a path, and avoid overengineering while preserving enterprise quality?
- Did the agent inspect the exact referenced artifact first before broad scans or inference?
- Did the agent recover from blocked proof/tool paths with the cheapest safe fallback before declaring failure?
- Did the agent surface contract-shaping assumptions instead of guessing between materially different implementations?
- Did the agent run a bounded finish pass around the changed boundary instead of stopping at the first passing diff or expanding scope?
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
- Did clear plugin, theme, site, contribution, content, or product-orchestration work trigger the narrow specialist directly instead of broad `wp-expert`?
- Did ambiguous WordPress work use `wp-expert` as a router while clear plugin, theme, or site work used `wp-plugin-expert`, `wp-theme-expert`, or `wp-site-expert` directly?
