# Reference Routing Map

Use this map to choose references with low context cost.

## Loading Discipline

- Choose one primary reference that matches the core deliverable.
- Add at most two supporting references for cross-cutting risk.
- Stop loading more references when you already have enough to implement or review safely.

## Task To Reference Map

| Task signal | Primary reference | Common supporting references |
| --- | --- | --- |
| New chat/session continuity, branch creation, PR base selection, release branch drift | `session-continuity-pr-discipline.md` | `standards-ci-github.md`, `delivery-excellence.md` |
| PRD, SOW, estimates, milestones, mobile-first planning | `delivery-excellence.md` | `review-checklists.md`, `runtime-toolchain-version-policy.md` |
| Planning drift control, scope guard, exact CSS/value change, calibrated validation | `planning-drift-control.md` | `delivery-excellence.md`, `validation-commands.md` |
| Code creation/review quality gate, enterprise/WPVIP engineering bar | `enterprise-code-quality-gate.md` | `review-checklists.md`, `validation-commands.md` |
| Plugin architecture, new feature, refactor, service boundaries | `plugin-architecture.md` | `implementation-patterns.md`, `enterprise-code-quality-gate.md` |
| Third-party API integration | `third-party-api-integrations.md` | `performance-and-security.md`, `implementation-patterns.md` |
| WooCommerce, commerce, checkout, HPOS, payments, subscriptions, order operations | `woocommerce-commerce-engineering.md` | `performance-and-security.md`, `privacy-consent-data-governance.md` |
| Headless WordPress, Next.js, WPGraphQL, decoupled previews, frontend cache revalidation | `headless-decoupled-wordpress.md` | `technical-seo-engineering.md`, `edge-caching-cdn-architecture.md` |
| Content modeling, information architecture, CPT/taxonomy/meta/custom-table decisions | `content-modeling-information-architecture.md` | `block-theme-architecture.md`, `enterprise-architecture.md` |
| AI/LLM WordPress product, admin assistant, embeddings, provider abstraction | `ai-llm-wordpress-product-engineering.md` | `privacy-consent-data-governance.md`, `third-party-api-integrations.md` |
| Marketplace readiness, freemium/pro, licensing, update server, support diagnostics | `marketplace-product-readiness.md` | `plugin-guidelines-review.md`, `production-dependency-discipline.md` |
| WordPress.org plugin compliance review | `plugin-guidelines-review.md` | `changelog-release-notes.md`, `release-contract-compatibility.md` |
| WordPress.org release operations and deploy behavior | `wordpress-org-release-operations.md` | `deployment-release-resilience.md`, `build-tooling.md` |
| Release notes, changelog quality, version narrative | `changelog-release-notes.md` | `release-contract-compatibility.md`, `delivery-excellence.md` |
| Backward compatibility and launch-state decisions | `release-contract-compatibility.md` | `changelog-release-notes.md`, `plugin-architecture.md` |
| Technical SEO, canonicals, redirects, robots, sitemaps, structured data, crawl risk | `technical-seo-engineering.md` | `content-migration-editorial-scale.md`, `headless-decoupled-wordpress.md` |
| Style guide, design system, design tokens, custom theme, or child theme | `style-guide-theme-translation.md` | `block-theme-architecture.md`, `visual-parity-regression.md` |
| Design to custom FSE block theme | `block-theme-architecture.md` | `custom-block-theme-from-design.md`, `visual-parity-regression.md` |
| Theme/block editor behavior or block implementation | `block-theme-architecture.md` | `theme-and-block-editor.md`, `validation-commands.md` |
| React in WordPress (admin/editor/frontend/headless) | `react-wordpress-enterprise.md` | `wordpress-design-system.md`, `standards-ci-github.md` |
| UI/UX improvement, premium feel, or admin UX | `ui-ux-pro-for-wordpress.md` | `admin-ux-and-ui.md`, `visual-parity-regression.md` |
| WordPress Design System implementation | `wordpress-design-system.md` | `admin-ux-and-ui.md`, `ui-ux-pro-for-wordpress.md` |
| Performance/security quick triage | `performance-and-security.md` | `performance-profiling-scale-budgets.md`, `security-threat-modeling-review.md` |
| Performance profiling, budgets, query/object-cache scale, Core Web Vitals, admin/editor speed | `performance-profiling-scale-budgets.md` | `edge-caching-cdn-architecture.md`, `load-testing-capacity-planning.md` |
| Security threat model, sensitive endpoint review, REST/admin/upload/webhook/OAuth/MCP risk | `security-threat-modeling-review.md` | `security-operations-compliance.md`, `privacy-consent-data-governance.md` |
| Privacy, consent, telemetry, PII, data retention, exporter/eraser support | `privacy-consent-data-governance.md` | `security-operations-compliance.md`, `plugin-guidelines-review.md` |
| VIP/high-scale architecture decisions | `vip-scale-playbook.md` | `edge-caching-cdn-architecture.md`, `load-testing-capacity-planning.md` |
| Advanced multisite, network activation, domain mapping, cross-site data, tenant governance | `advanced-multisite-network-engineering.md` | `enterprise-architecture.md`, `content-migration-editorial-scale.md` |
| Incident, reliability, production debugging | `troubleshooting-operations.md` | `observability-incident-response.md`, `performance-and-security.md` |
| Disaster recovery, business continuity, backups, restore drill, RPO/RTO, release backout | `disaster-recovery-business-continuity.md` | `deployment-release-resilience.md`, `observability-incident-response.md` |
| CI/CD, linting, standards, GitHub workflows | `standards-ci-github.md` | `build-tooling.md`, `validation-commands.md` |
| Monorepo structure and multi-package release flow | `monorepo-engineering.md` | `build-tooling.md`, `standards-ci-github.md` |
| Build tooling choices (webpack/composer/npm) | `build-tooling.md` | `runtime-toolchain-version-policy.md`, `production-dependency-discipline.md` |
| Migrations and editorial-scale launches | `content-migration-editorial-scale.md` | `deployment-release-resilience.md`, `enterprise-search-content-scale.md` |
| Accessibility, i18n, global readiness | `accessibility-i18n-global-readiness.md` | `ui-ux-pro-for-wordpress.md`, `validation-commands.md` |
| Local HTTPS domain blocked in browser | `local-https-testing.md` | `validation-commands.md`, `troubleshooting-operations.md` |

## Theme-Specific Overlays

- Ollie/Ollie Pro tasks: load `ollie-block-theme.md` as supporting context after choosing the primary task reference.
- Blocksy/Blocksy Pro tasks: load `blocksy-theme.md` as supporting context after choosing the primary task reference.

## Shared References

- Use `../shared/references/research-token-discipline.md` only for web-heavy, drift-prone, or broad discovery tasks.
- Use `../shared/references/session-continuity-pr-discipline.md` for new chats, resumed repo work, branch creation, release branch detection, and explicit PR base safety.
- Use `../shared/references/production-dependency-discipline.md` for packaging, CI artifacts, release ZIP/SVN, and production dependency verification.
- Use `../shared/references/enterprise-code-quality-gate.md` for implementation, refactoring, and review tasks where generated or reviewed code must meet enterprise/WPVIP-grade engineering expectations.
