# Reference Routing Map

Use this map to choose references with low context cost.

## Loading Discipline

- Choose one primary reference that matches the core deliverable.
- Add at most one supporting reference for confirmed cross-cutting risk.
- Exceed that budget only when a named acceptance risk cannot be handled safely with the current set.
- Stop loading more references when you already have enough to implement or review safely.

## Risk-Triggered Overlays

- Substantial implementation/review: load `architecture-decision-gate.md` when ownership, source of truth, public contract, release state, performance, security, or proof is unclear.
- Code change: apply enterprise and test principles from the active skill; load `enterprise-code-quality-gate.md` or `test-coverage-discipline.md` only when risk is non-trivial, ambiguous, or review-critical.
- Completion claim: load `live-proof-wordpress.md` only when runtime, editor, frontend, external integration, or release proof is material.
- Branch/PR/resumed-session work: load `session-continuity-pr-discipline.md` when branch base or PR target can drift.
- Package/deploy/artifact work: load `production-dependency-discipline.md` when Composer, npm, release ZIP/SVN, deploy, or production dependency boundaries matter.
- Web-heavy or current-policy lookup: load `research-token-discipline.md` when source selection or freshness can affect the answer.
- UI/theme/FSE/design work: keep premium/enterprise UX and editor ownership proof visible; load deeper design references only when the visual/editing contract is not obvious.

## Task To Reference Map

| Task signal | Primary reference | Common supporting references |
| --- | --- | --- |
| Skill behavior audit, routing regression, eval scenarios, prompt drift after skill edits | `agent-behavior-eval-scenarios.md` | `architecture-decision-gate.md`, `reference-routing-map.md` |
| Architecture decision gate, ownership/source-of-truth choice, public contract, release state, validation proof, project policy precedence | `architecture-decision-gate.md` | `enterprise-code-quality-gate.md`, `live-proof-wordpress.md` |
| New chat/session continuity, branch creation, issue milestone to PR release branch, PR base selection, release branch drift | `session-continuity-pr-discipline.md` | `standards-ci-github.md`, `delivery-excellence.md` |
| Project-level Codex subagents, skill-level routing, model assignment, efficient `gpt-5.3-codex-spark` usage | `project-subagent-routing.md` | `reference-routing-map.md`, `thinking-brainstorming-engineering-discipline.md` |
| PRD, SOW, estimates, milestones, mobile-first planning | `delivery-excellence.md` | `review-checklists.md`, `runtime-toolchain-version-policy.md` |
| Enterprise acceptance criteria or definition of done for plugin/theme/API/migration/security/performance/conversion work | `enterprise-acceptance-criteria-templates.md` | `test-coverage-discipline.md`, `validation-commands.md` |
| Planning drift control, scope guard, exact CSS/value change, calibrated validation | `planning-drift-control.md` | `delivery-excellence.md`, `validation-commands.md` |
| Brainstorming convergence, anti-overengineering, premium polish stopping rule, thinking/token budget | `thinking-brainstorming-engineering-discipline.md` | `planning-drift-control.md`, `delivery-excellence.md` |
| Code creation/review quality gate, enterprise/WPVIP engineering bar | `enterprise-code-quality-gate.md` | `review-checklists.md`, `validation-commands.md` |
| Test coverage decision, missing coverage review, PR/change test plan | `test-coverage-discipline.md` | `validation-commands.md`, `review-checklists.md` |
| Plugin architecture, new feature, refactor, service boundaries | `plugin-architecture.md` | `implementation-patterns.md`, `enterprise-code-quality-gate.md` |
| Plugin product architecture, add-ons/pro, public hooks/filters, feature flags, diagnostics contracts | `plugin-product-architecture.md` | `plugin-architecture.md`, `release-contract-compatibility.md` |
| Plugin debuggability, support bundle, Site Health, recovery controls, support diagnostics | `plugin-debuggability-supportability.md` | `plugin-product-architecture.md`, `observability-incident-response.md` |
| Third-party API integration | `third-party-api-integrations.md` | `performance-and-security.md`, `implementation-patterns.md` |
| WooCommerce, commerce, checkout, HPOS, payments, subscriptions, order operations | `woocommerce-commerce-engineering.md` | `performance-and-security.md`, `privacy-consent-data-governance.md` |
| Headless WordPress, Next.js, WPGraphQL, decoupled previews, frontend cache revalidation | `headless-decoupled-wordpress.md` | `technical-seo-engineering.md`, `edge-caching-cdn-architecture.md` |
| Content modeling, information architecture, CPT/taxonomy/meta/custom-table decisions | `content-modeling-information-architecture.md` | `block-theme-architecture.md`, `enterprise-architecture.md` |
| Database table architecture review, custom table schema, indexes, migrations, maintainability | `database-table-architecture-review.md` | `performance-profiling-scale-budgets.md`, `content-modeling-information-architecture.md` |
| AI/LLM WordPress product, admin assistant, embeddings, provider abstraction | `ai-llm-wordpress-product-engineering.md` | `privacy-consent-data-governance.md`, `third-party-api-integrations.md` |
| Marketplace readiness, freemium/pro, licensing, update server, support diagnostics | `marketplace-product-readiness.md` | `plugin-guidelines-review.md`, `production-dependency-discipline.md` |
| WordPress.org plugin compliance review | `plugin-guidelines-review.md` | `changelog-release-notes.md`, `release-contract-compatibility.md` |
| WordPress.org release operations and deploy behavior | `wordpress-org-release-operations.md` | `deployment-release-resilience.md`, `build-tooling.md` |
| Release notes, changelog quality, version narrative | `changelog-release-notes.md` | `release-contract-compatibility.md`, `delivery-excellence.md` |
| Backward compatibility and launch-state decisions | `release-contract-compatibility.md` | `changelog-release-notes.md`, `plugin-architecture.md` |
| Technical SEO, canonicals, redirects, robots, sitemaps, structured data, crawl risk | `technical-seo-engineering.md` | `content-migration-editorial-scale.md`, `headless-decoupled-wordpress.md` |
| Style guide, design system, design tokens, custom theme, or child theme | `style-guide-theme-translation.md` | `block-theme-architecture.md`, `visual-parity-regression.md` |
| Design to custom FSE block theme | `block-theme-architecture.md` | `custom-block-theme-from-design.md`, `visual-parity-regression.md` |
| Classic-to-block theme migration, page-builder migration, child-theme modernization, WooCommerce template cleanup | `hybrid-theme-migration-modernization.md` | `theme-and-block-editor.md`, `technical-seo-engineering.md` |
| Theme/block editor behavior or block implementation | `block-theme-architecture.md` | `theme-and-block-editor.md`, `validation-commands.md` |
| Theme/frontend performance, Core Web Vitals, fonts/images/assets/CLS/INP/LCP quality gate | `theme-frontend-performance-quality-gate.md` | `performance-profiling-scale-budgets.md`, `visual-parity-regression.md` |
| React in WordPress (admin/editor/frontend/headless) | `react-wordpress-enterprise.md` | `wordpress-design-system.md`, `standards-ci-github.md` |
| UX discovery, product strategy, information architecture, UX writing, conversion UX, or image/pixel design QA | `ux-product-strategy-design-qa.md` | `ui-ux-pro-for-wordpress.md`, `visual-parity-regression.md` |
| Conversion-focused website, landing page, lead funnel, CRO, checkout/booking funnel | `conversion-focused-website-engineering.md` | `ux-product-strategy-design-qa.md`, `analytics-measurement-engineering.md` |
| Analytics, measurement, GA4/GTM/data layer, consent-aware tracking, funnel events | `analytics-measurement-engineering.md` | `privacy-consent-data-governance.md`, `conversion-focused-website-engineering.md` |
| UI/UX implementation, premium feel, or admin UX | `ui-ux-pro-for-wordpress.md` | `ux-product-strategy-design-qa.md`, `admin-ux-and-ui.md` |
| WordPress Design System implementation | `wordpress-design-system.md` | `admin-ux-and-ui.md`, `ui-ux-pro-for-wordpress.md` |
| Performance/security quick triage | `performance-and-security.md` | `performance-profiling-scale-budgets.md`, `security-threat-modeling-review.md` |
| Performance profiling, budgets, query/object-cache scale, Core Web Vitals, admin/editor speed | `performance-profiling-scale-budgets.md` | `edge-caching-cdn-architecture.md`, `load-testing-capacity-planning.md` |
| Security threat model, sensitive endpoint review, REST/admin/upload/webhook/OAuth/MCP risk | `security-threat-modeling-review.md` | `security-operations-compliance.md`, `privacy-consent-data-governance.md` |
| Privacy, consent, telemetry, PII, data retention, exporter/eraser support | `privacy-consent-data-governance.md` | `security-operations-compliance.md`, `plugin-guidelines-review.md` |
| VIP/high-scale architecture decisions | `vip-scale-playbook.md` | `edge-caching-cdn-architecture.md`, `load-testing-capacity-planning.md` |
| VIP/enterprise launch readiness, go/no-go review, launch matrix, post-launch checks | `vip-enterprise-launch-readiness.md` | `deployment-release-resilience.md`, `observability-incident-response.md` |
| Advanced multisite, network activation, domain mapping, cross-site data, tenant governance | `advanced-multisite-network-engineering.md` | `enterprise-architecture.md`, `content-migration-editorial-scale.md` |
| Incident, reliability, production debugging | `troubleshooting-operations.md` | `observability-incident-response.md`, `performance-and-security.md` |
| Advanced troubleshooting decision tree, conflict isolation, cache/CDN debugging, production triage | `advanced-troubleshooting-decision-tree.md` | `troubleshooting-operations.md`, `validation-commands.md` |
| Duplicate code, modularity, maintainability, shared behavior extraction | `duplicate-code-modularity-review.md` | `implementation-patterns.md`, `test-coverage-discipline.md` |
| Disaster recovery, business continuity, backups, restore drill, RPO/RTO, release backout | `disaster-recovery-business-continuity.md` | `deployment-release-resilience.md`, `observability-incident-response.md` |
| CI/CD, linting, standards, GitHub workflows | `standards-ci-github.md` | `build-tooling.md`, `validation-commands.md` |
| Monorepo structure and multi-package release flow | `monorepo-engineering.md` | `build-tooling.md`, `standards-ci-github.md` |
| Build tooling choices (webpack/composer/npm) | `build-tooling.md` | `runtime-toolchain-version-policy.md`, `production-dependency-discipline.md` |
| WP-CLI automation, runtime probes, scripted admin/data operations | `wp-cli-automation.md` | `validation-commands.md`, `troubleshooting-operations.md` |
| Migrations and editorial-scale launches | `content-migration-editorial-scale.md` | `deployment-release-resilience.md`, `enterprise-search-content-scale.md` |
| Accessibility, i18n, global readiness | `accessibility-i18n-global-readiness.md` | `ui-ux-pro-for-wordpress.md`, `validation-commands.md` |
| Local HTTPS domain blocked in browser | `local-https-testing.md` | `validation-commands.md`, `troubleshooting-operations.md` |

## Theme-Specific Overlays

- Ollie/Ollie Pro tasks: load `ollie-block-theme.md` as supporting context after choosing the primary task reference.
- Blocksy/Blocksy Pro tasks: load `blocksy-theme.md` as supporting context after choosing the primary task reference.

## Shared References

- Use `../shared/references/research-token-discipline.md` only for web-heavy, drift-prone, or broad discovery tasks.
- Use `../shared/references/session-continuity-pr-discipline.md` for new chats, resumed repo work, branch creation, release branch detection, and explicit PR base safety.
- Use `../shared/references/project-subagent-routing.md` for project-level Codex subagents, skill-level routing, bounded parallel mapping/review, and model routing.
- Use `../shared/references/production-dependency-discipline.md` for packaging, CI artifacts, release ZIP/SVN, and production dependency verification.
- Use `../shared/references/enterprise-code-quality-gate.md` for implementation, refactoring, and review tasks where generated or reviewed code must meet enterprise/WPVIP-grade engineering expectations.
- Use `../shared/references/live-proof-wordpress.md` before claiming WordPress runtime, editor, frontend, external, or release work is complete.
