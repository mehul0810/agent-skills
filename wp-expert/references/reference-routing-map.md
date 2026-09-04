# Reference Routing Map

Use this map to choose references with low context cost.

## Loading Discipline

- Load one primary reference for the core deliverable.
- Add one supporting reference only for a confirmed risk; exceed this only when acceptance would otherwise be unsafe.
- Stop when the loaded guidance is sufficient to implement or review safely.

## Risk-Triggered Overlays

- Focused security, performance, modularity, or accessibility review/remediation: route to `wp-quality-reviewer`; routine constraints stay with the artifact specialist.
- Load `architecture-decision-gate.md` only when ownership, source of truth, public contract, release state, or proof is unclear.
- Apply enterprise/test principles from the active skill; load their deeper references only for non-trivial or review-critical risk.
- Load `enterprise-runtime-assurance.md` only for material compatibility, supply-chain, operations, or recovery risk.
- Load `live-proof-wordpress.md` only for material runtime, editor, frontend, integration, or release proof.
- Branch/PR/resumed-session work: load `session-continuity-pr-discipline.md` when branch base or PR target can drift.
- Package/deploy/artifact work: load `production-dependency-discipline.md` when Composer, npm, release ZIP/SVN, deploy, or production dependency boundaries matter.
- Web-heavy or current-policy lookup: load `research-token-discipline.md` when source selection or freshness can affect the answer.
- UI/theme/FSE/design work: keep premium/enterprise UX and editor ownership proof visible; load deeper design references only when the visual/editing contract is not obvious.
- Ambiguous, conflicting, temporary, or corrective owner direction that could be mistaken for authorization: load `../../shared/references/owner-decision-resolution.md`; do not load it for clear bounded work.

## Authority Boundaries

- The selected specialist and primary reference own the implementation contract; overlays add only the confirmed risk they name.
- `wp-quality-reviewer` owns focused security, performance, modularity, and accessibility review. Architecture references define boundaries, not duplicate audits.
- `design-intelligence-routing.md` chooses direction; `visual-to-wordpress-implementation.md` executes a selected target; WordPress Design System and UI references govern components and workflow details.
- Scenario files validate skills and are never project-work references.

## Task To Reference Map

| Task signal | Primary reference |
| --- | --- |
| Skill behavior audit, routing regression, eval scenarios, prompt drift after skill edits | `agent-behavior-eval-scenarios.md` |
| Ownership, source of truth, public contract, release, or proof decision | `architecture-decision-gate.md` |
| Ambiguous owner scope, durability, constraint, or authority | `owner-decision-resolution.md` |
| Session continuity, PR base, release branch, or milestone drift | `session-continuity-pr-discipline.md` |
| Universal code-change quality plan, proportional risk contract, and completion receipt | `planning-drift-control.md` |
| Subagents and model/reasoning allocation | `project-subagent-routing.md` |
| PRD, SOW, estimates, or milestones | `delivery-excellence.md` |
| Enterprise acceptance criteria | `enterprise-acceptance-criteria-templates.md` |
| Scope drift or exact-value change | `planning-drift-control.md` |
| Brainstorming convergence and stopping rule | `thinking-brainstorming-engineering-discipline.md` |
| Code creation/review quality gate, enterprise/WPVIP engineering bar | `enterprise-code-quality-gate.md` |
| TypeScript or cross-language enterprise coding standards for PHP, JavaScript/React, CSS/SCSS, HTML/templates, SQL, JSON/YAML, shell, or Markdown | `../../shared/references/enterprise-language-coding-standards.md` |
| Compatibility, supply chain, operations, or recovery assurance | `enterprise-runtime-assurance.md` |
| Test coverage decision or gap | `test-coverage-discipline.md` |
| Plugin architecture, new feature, refactor, service boundaries | `plugin-architecture.md` |
| Plugin product/add-on/public extension architecture | `plugin-product-architecture.md` |
| WordPress implementation patterns for hooks, services, REST, storage, or blocks | `implementation-patterns.md` |
| Enterprise architecture, async boundaries, data flow, or long-lived system design | `enterprise-architecture.md` |
| Plugin admin/settings product header shell | `plugin-product-architecture.md` |
| Plugin debuggability, support bundle, Site Health, recovery controls, support diagnostics | `plugin-debuggability-supportability.md` |
| Third-party API integration | `third-party-api-integrations.md` |
| WooCommerce, commerce, checkout, HPOS, payments, subscriptions, order operations | `woocommerce-commerce-engineering.md` |
| Headless WordPress, Next.js, WPGraphQL, decoupled previews, frontend cache revalidation | `headless-decoupled-wordpress.md` |
| Content modeling, information architecture, CPT/taxonomy/meta/custom-table decisions | `content-modeling-information-architecture.md` |
| Database table architecture review, custom table schema, indexes, migrations, maintainability | `database-table-architecture-review.md` |
| AI/LLM WordPress product, admin assistant, embeddings, provider abstraction | `ai-llm-wordpress-product-engineering.md` |
| Marketplace readiness, freemium/pro, licensing, update server, support diagnostics | `marketplace-product-readiness.md` |
| WordPress.org plugin compliance review | `plugin-guidelines-review.md` |
| WordPress.org release operations and deploy behavior | `wordpress-org-release-operations.md` |
| Factual README, `readme.txt`, changelog, release notes, upgrade notice, or release-document synchronization | route to `wp-product-docs-writer` |
| Backward compatibility and launch-state decisions | `release-contract-compatibility.md` |
| Technical SEO, canonicals, redirects, robots, sitemaps, structured data, crawl risk | `technical-seo-engineering.md` |
| SEO/AEO/GEO/AI SEO provider controls, AI citation measurement, crawler/training privacy, query fan-out, or programmatic content quality | `search-visibility-and-ai-discovery.md` |
| Style guide, design system, design tokens, custom theme, or child theme | `style-guide-theme-translation.md` |
| Existing Tailwind CSS, utility-class build, v3/v4 migration, source discovery, Preflight scope, or isolated app-surface evaluation | `../../shared/references/tailwind-informed-frontend-engineering.md` |
| Chosen visual target to WordPress | `../../shared/references/visual-to-wordpress-implementation.md` |
| Custom FSE architecture without a supplied visual target | `block-theme-architecture.md` |
| Legacy/theme-builder modernization | `hybrid-theme-migration-modernization.md` |
| Theme/block implementation | `block-theme-architecture.md` |
| Interactivity API or stateful block frontend | `interactivity-api-frontend.md` |
| Theme/frontend performance, Core Web Vitals, fonts/images/assets/CLS/INP/LCP quality gate | `theme-frontend-performance-quality-gate.md` |
| JavaScript/React in WordPress (admin/editor/block/frontend/headless) | `react-wordpress-enterprise.md` |
| UX strategy, IA, writing, or design QA | `ux-product-strategy-design-qa.md` |
| Conversion-focused website, landing page, lead funnel, CRO, checkout/booking funnel | `conversion-focused-website-engineering.md` |
| Analytics, measurement, GA4/GTM/data layer, consent-aware tracking, funnel events | `analytics-measurement-engineering.md` |
| UI/UX implementation, premium feel, or admin UX | `ui-ux-pro-for-wordpress.md` |
| WordPress Design System implementation | `wordpress-design-system.md` |
| Custom widget semantics, keyboard/focus behavior, or consequential save/retry recovery | `interaction-and-form-resilience.md` |
| Focused security, performance, modularity, or accessibility audit/profiling/remediation | route to `wp-quality-reviewer` |
| Performance architecture and budgets | `performance-profiling-scale-budgets.md` |
| Mixed performance/security first-pass triage before a focused reviewer mode is known | `performance-and-security.md` |
| Capacity planning, growth forecast, saturation, fairness, queue or storage headroom | `load-testing-capacity-planning.md` |
| Security architecture and threat modeling before sensitive REST/admin/upload/webhook/OAuth/MCP implementation | `security-threat-modeling-review.md` |
| Security operations, penetration-test process, compliance evidence, or access review | `security-operations-compliance.md` |
| Privacy, consent, telemetry, PII, data retention, exporter/eraser support | `privacy-consent-data-governance.md` |
| VIP/high-scale architecture decisions | `vip-scale-playbook.md` |
| Enterprise Search, Elasticsearch/OpenSearch, index lifecycle, or high-volume search | `enterprise-search-content-scale.md` |
| VIP/enterprise launch readiness, go/no-go review, launch matrix, post-launch checks | `vip-enterprise-launch-readiness.md` |
| Multisite and tenant governance | `advanced-multisite-network-engineering.md` |
| Incident, reliability, production debugging | `troubleshooting-operations.md` |
| Advanced troubleshooting decision tree, conflict isolation, cache/CDN debugging, production triage | `advanced-troubleshooting-decision-tree.md` |
| Duplicate code, modularity, maintainability, shared behavior extraction | `duplicate-code-modularity-review.md` |
| Disaster recovery, business continuity, backups, restore drill, RPO/RTO, release backout | `disaster-recovery-business-continuity.md` |
| CI/CD, linting, standards, GitHub workflows | `standards-ci-github.md` |
| Exact local validation command selection and evidence order | `validation-commands.md` |
| GitHub Actions minute economy, local-vs-hosted split, triggers, caching, artifacts, and release workflow shape | `../../shared/references/github-actions-economy.md` |
| Monorepo structure and multi-package release flow | `monorepo-engineering.md` |
| Build tooling choices (webpack/composer/npm) | `build-tooling.md` |
| Active non-EOL runtime/tool selection and compatibility policy | `runtime-toolchain-version-policy.md` |
| WP-CLI automation, runtime probes, scripted admin/data operations | `wp-cli-automation.md` |
| Migrations and editorial-scale launches | `content-migration-editorial-scale.md` |
| Accessibility, i18n, RTL, multilingual, color schemes, adaptive preferences, and global readiness | `accessibility-i18n-global-readiness.md` |
| Local HTTPS domain blocked in browser | `local-https-testing.md` |
| Broad WordPress PR or repository review checklist when no focused risk dominates | `review-checklists.md` |
| Admin workflow/UX analysis before component-level design | `admin-ux-and-ui.md` |
| VIP deployment, feature flags, migration rollout, and rollback resilience | `deployment-release-resilience.md` |

## Theme-Specific Overlays

- Ollie/Ollie Pro tasks: load `ollie-block-theme.md` as supporting context after choosing the primary task reference.
- Blocksy/Blocksy Pro tasks: load `blocksy-theme.md` as supporting context after choosing the primary task reference.
