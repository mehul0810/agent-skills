# WP Expert Codex Skill Pack

This repository contains WordPress and organic-search-focused Codex skills:

- `wp-expert`: thin umbrella router for ambiguous WordPress engineering that points to the narrow specialist skill.
- `wp-plugin-expert`: enterprise WordPress plugin engineering for plugin architecture, admin screens, REST APIs, custom tables, WordPress.org releases, Composer/npm, tests, CI, security, performance, and troubleshooting.
- `wp-theme-expert`: enterprise WordPress theme, block theme, FSE, `theme.json`, custom block, design-to-theme, visual parity, and premium responsive theme engineering.
- `wp-site-expert`: enterprise WordPress site, UX, CRO, SEO/AEO/GEO, analytics, accessibility, content architecture, performance, and premium visitor/admin experience engineering.
- `wp-product-orchestrator`: autonomous WordPress product maintainer for plugin/theme issue triage, PR workflow, subagent coordination, live proof, and release readiness.
- `wp-contributor`: official WordPress project contribution workflows for Core, Meta, Gutenberg, Trac, GitHub PRs, patches, testing, docs, triage, releases, and contributor communication.
- `content-writer`: organic search content writing for SEO, AEO, GEO, AI Overviews, AI Mode, answer engines, AI tools, briefs, outlines, drafts, audits, and content refreshes.
- `shared/references/research-token-discipline.md`: reusable token-efficient reasoning, repo exploration, web search, validation, and output discipline used by both skills.
- `shared/references/session-continuity-pr-discipline.md`: reusable new-chat context rehydration, release-branch detection, explicit PR base selection, and branch/PR safety used by code-oriented skills.
- `shared/references/project-subagent-routing.md`: reusable project-level Codex subagent routing, model assignment, bounded parallel mapping/review, and efficient `gpt-5.3-codex-spark` usage used by code-oriented skills.
- `shared/references/product-autonomy-permissions.md`: reusable autonomy boundaries, permission levels, stop conditions, and owner-decision format for product/plugin/theme workflows.
- `shared/references/product-queue-triage.md`: reusable issue/PR queue triage, autonomous candidate selection, release-blocker detection, and owner-facing output format.
- `shared/references/live-proof-wordpress.md`: reusable WordPress live-proof gates for plugins, themes, FSE, REST, WP-CLI, admin, frontend, integrations, and releases.
- `shared/references/production-dependency-discipline.md`: reusable Composer/npm production dependency hygiene used by both skills.
- `shared/references/enterprise-code-quality-gate.md`: reusable enterprise/WPVIP-grade code creation and review gate for modularity, performance, security, maintainability, observability, and rare-scenario tests.

## Modular WordPress Expert Coverage

`wp-expert` is intentionally a router. Use the specialist skills directly when the task intent is clear:

- `wp-plugin-expert` for plugin/product implementation, review, debugging, release, and hardening work.
- `wp-theme-expert` for theme, FSE, block editor, design-to-theme, visual parity, and editor/frontend parity work.
- `wp-site-expert` for whole-site, landing page, UX, CRO, SEO/content, analytics, accessibility, and premium site polish work.

The detailed playbooks remain in `wp-expert/references/` and `shared/references/`; specialist skills load those references only when needed.

## WordPress Expertise Coverage

- Plugin development and refactoring.
- Plugin product architecture: add-ons/pro boundaries, public hooks/filters, extension contracts, feature flags, dependency detection, diagnostics contracts, and upgrade-safe public APIs.
- Plugin debuggability and supportability: Site Health checks, redacted support bundles, log levels, correlation IDs, safe recovery controls, and enterprise support exports.
- Third-party API integrations of any type using official documentation or user-provided specs: REST, GraphQL, SOAP/WSDL, XML-RPC, SDKs, webhooks, OAuth, API keys, rate limits, retries, idempotency, queues, and provider operations.
- Runtime and toolchain version policy: choose the minimum stable actively maintained non-EOL PHP, Node, npm, Composer, database, CI image, and tool versions that satisfy WordPress, host/VIP, dependency, and deployment constraints.
- Changelog and release notes expertise: public/internal changelogs, unreleased feature aggregation, WordPress.org `readme.txt` changelog rules, SemVer impact, security notes, migrations, and developer-facing API notes.
- Release contract and backward compatibility policy: preserve launched/public contracts and real production/client data, but avoid compatibility shims for abandoned intermediate shapes of unreleased features.
- Duplicate code, modularity, and maintainability review: find repeated logic, reduce drift, improve service boundaries, add better tests, and keep refactors simple and reliable.
- Enterprise code-quality gate: generated and reviewed code must be modular, performant, secure, maintainable, testable, and validated against relevant rare/failure scenarios.
- Test coverage discipline: every PR/change makes an explicit test decision, adds or updates coverage when behavior risk warrants it, and flags missing coverage as a concrete review finding.
- Planning drift control and risk-calibrated validation: scope guardrails, stop/ask triggers, and exact user-fed CSS/value changes that can be confirmed by diff without unnecessary visual verification.
- Thinking, brainstorming, and engineering discipline: bounded option generation, anti-overengineering gates, reference-loading budgets, premium polish stopping rules, and token-conscious planning.
- Requirements analysis, PRDs, scope of work, technical breakdowns, Codex-aware estimates, milestones, and delivery buffers.
- WooCommerce and commerce engineering: HPOS, Checkout Blocks, Store API, payment/shipping integrations, subscriptions, refunds, order operations, and high-scale store validation.
- Headless and decoupled WordPress: REST vs WPGraphQL, Next.js/React frontends, previews, cache revalidation, media, redirects, and editorial workflows.
- Advanced multisite and network engineering: network activation, domain mapping, cross-site data, tenant governance, provisioning, migrations, and cache boundaries.
- Technical SEO engineering: canonicals, redirects, robots, sitemaps, structured data, crawl budget, Core Web Vitals, hreflang, and migration SEO checks.
- Privacy, consent, and data governance: consent, telemetry, personal data export/erase, data retention, audit logs, PII minimization, and vendor disclosures.
- Content modeling and information architecture: CPTs, taxonomies, meta, custom tables, block-based content models, editorial workflows, and scalable admin/search behavior.
- Database table architecture review: custom table decisioning, schema design, query-to-index mapping, migrations, multisite ownership, retention, privacy, concurrency, and maintainability review.
- Disaster recovery and business continuity: RTO/RPO, backups, restore drills, rollback, queue/search/cache recovery, incident communication, and release backout planning.
- AI and LLM WordPress product engineering: provider abstraction, streaming UX, embeddings, structured outputs, cost controls, prompt safety, privacy, and auditability.
- Marketplace and product readiness: freemium/pro boundaries, licensing, update servers, support diagnostics, WordPress.org compliance, onboarding, and release packaging.
- WordPress.org Plugin Directory guideline review, block directory eligibility, readme policy, licensing, tracking, and trademark checks.
- WordPress.org release operations: SVN-first verification, `trunk/`, `tags/<version>/`, `assets/`, production `vendor/`, Plugin Check fallbacks, 10up deploy behavior, and GitHub ZIP workflows.
- Theme development, classic themes, block themes, and `theme.json`.
- Hybrid theme migration and modernization: classic-to-block migration, page-builder-to-block migration, child-theme modernization, WooCommerce template cleanup, and SEO/content preservation.
- Style guide, design pattern, and design token translation into WordPress-native primitives, including custom themes and custom child themes on top of existing parent themes.
- Block/FSE architecture decisioning: theme vs plugin ownership, content model, editor ownership, templates, parts, patterns, variations, bindings, custom blocks, dynamic rendering, and Interactivity API.
- Design-to-FSE custom block themes: map designs to `theme.json`, core blocks, patterns, template parts, block styles, and custom blocks only when necessary, without Custom HTML or Shortcode blocks.
- Block Bindings in block themes: map supported core block attributes to dynamic sources before creating custom blocks when native editability is sufficient.
- Ollie block theme and Ollie Pro expertise: Site Editor workflows, child themes, design tokens, Pro pattern library, setup wizard, starter sites, extensions, Menu Designer, WooCommerce layouts, and troubleshooting.
- Blocksy theme and Blocksy Pro expertise: Customizer workflows, Companion plugin, header/footer builders, Content Blocks, Dynamic Data, starter sites, Shop Extra/WooCommerce, Advanced Menu, Pro extensions, licensing, and troubleshooting.
- Block editor compatible code generation and dynamic/static block work.
- React with WordPress enterprise standards: admin/editor apps, frontend interactive blocks, headless boundaries, dependency extraction, REST contracts, `@wordpress/data`, `@wordpress/components`, testing, accessibility, and release artifacts.
- UX product strategy and design QA: discovery, user journeys, information architecture, UX writing, conversion flows, usability checks, design-system governance, and enterprise/premium quality scoring.
- Conversion-focused website engineering: landing pages, lead funnels, checkout/booking flows, offer clarity, CTA strategy, trust proof, form friction, CRO-safe experiments, and conversion-quality gates.
- Analytics and measurement engineering: GA4/GTM/data layer, consent-aware tracking, WooCommerce/lead funnel events, telemetry boundaries, duplicate-event prevention, and validation without production pollution.
- Product-grade UI/UX improvement: visual QA, interaction states, forms, dashboards, responsive polish, and conversion clarity.
- Premium and enterprise visual quality discipline: never settle for generic, inconsistent, or unfinished UI when the project requires a polished brand experience.
- Image/screenshot/mockup-to-implementation discipline: treat provided designs as the visual source of truth, target pixel-faithful parity, and document any accessibility, responsive, editability, performance, or WordPress-platform deviation.
- Visual parity regression workflow: deterministic screenshot/state checks across Site Editor, block editor canvas, and frontend surfaces.
- Theme/frontend performance quality gate: Core Web Vitals, fonts, images, asset scoping, CLS/LCP/INP, block CSS bloat, frontend/editor CSS separation, and responsive media validation.
- Local HTTPS testing support for custom WordPress development domains that are blocked by the in-app browser, using terminal probes and certificate-error-tolerant browser runners.
- Mobile-first responsive architecture for frontend/customer-facing flows and responsive-safe admin/editor interfaces.
- WordPress Design System support: `@wordpress/components`, design tokens, Figma-to-code mapping, and accessibility.
- Admin UX, settings screens, onboarding, list tables, notices, and frontend UI improvement.
- Performance, caching, database scale, security, privacy, secrets, and PII handling.
- Performance profiling and scale budgets: baseline/measure hot paths, query count, object-cache behavior, REST/admin/editor latency, Core Web Vitals, async backpressure, and high-traffic acceptance checks.
- Security threat modeling and review: assets, actors, trust boundaries, REST/admin/upload/webhook/OAuth/MCP entry points, capability/ownership checks, abuse cases, and negative security tests.
- Enterprise architecture, multisite, migrations, async jobs, observability, and rollout/backout planning.
- Observability and incident response: SLOs, VIP Insights, New Relic, logs, slow queries, runbooks, and postmortems.
- Edge caching and CDN architecture: page cache, object cache, static assets, personalization, purge strategy, and stampede protection.
- Load testing and capacity planning for launches, traffic spikes, high-origin-load scenarios, and VIP coordination.
- Enterprise Search and content-scale querying: indexing, search offload, relevance, admin search, and multisite boundaries.
- Security operations and compliance: access governance, penetration testing, audit evidence, privacy, dependency risk, and incident response.
- Deployment and release resilience: built artifacts, feature flags, rollback, smoke checks, cache/search impact, and release communication.
- Content migration and editorial scale: large imports, media migration, redirects, SEO preservation, roles, workflows, and launch cutovers.
- Accessibility, internationalization, localization, RTL, multilingual/global readiness, and WCAG-aligned UI validation.
- WordPress monorepos, multi-plugin/theme packages, shared tooling, generated artifacts, and release engineering.
- Production dependency hygiene for Composer and npm: development-only packages stay in source/CI and out of runtime artifacts.
- WordPress VIP readiness and high-traffic production constraints.
- VIP and enterprise launch readiness: go/no-go matrix, code/data/cache/search/CDN/redirects/observability/rollback/support checks, launch windows, and post-launch monitoring.
- Troubleshooting, incident triage, WP-CLI probes, activation checks, and operational debugging.
- Advanced troubleshooting decision trees: symptom-to-probe matrix, plugin/theme conflict isolation, REST nonce/auth debugging, object-cache/CDN debugging, production triage, and rollback-first mitigation.
- Coding standards, linting, static analysis, tests, GitHub Actions, CI/CD, PR workflows, and releases.
- Enterprise GitHub workflows: issue triage, labels, milestones, scoped commits, PR descriptions, review response discipline.
- New-chat and PR branch discipline: rehydrate repo context, check release/hotfix/support branches, explicitly pass PR base branches, and verify PR `baseRefName` before reporting success.
- Issue milestone to PR base discipline: when work belongs to an issue milestone, create PRs against the matching release/hotfix/support branch instead of defaulting to `main` or `trunk`.
- Project-level Codex subagent routing: use `.codex/agents/*.toml` profiles, skill-level reference lanes, bounded read-only mappers/reviewers, and `gpt-5.3-codex-spark` for lower-risk parallel WordPress work.
- Efficient tests and maintainable code comments/docblocks for onboarding and future regression prevention.
- Enterprise acceptance criteria templates: definition-of-done gates for plugin features, themes, REST APIs, migrations, performance fixes, security fixes, and conversion pages.
- Webpack, Composer, npm, dependency extraction, lockfiles, build scripts, and release artifact packaging.
- Small focused commits for separable validated changes, followed by pushing all task commits after completion when a remote is configured.

## wp-product-orchestrator Coverage

- Autonomous plugin/theme product workflow control plane: issue triage, PR repair, subagent coordination, validation, owner decisions, and release readiness.
- Product-aware autonomy boundaries: classify work as autonomous, needs owner, blocked, release blocker, or defer based on `PRODUCT.md`, milestones, release branches, and risk.
- Simplified plugin development workflow: one-issue-at-a-time root cause, implementation, tests, live proof, focused commit, and PR preparation using the narrowest specialist lane.
- Simplified theme/FSE workflow: concrete design-token, pattern, template, responsive, visual parity, editor/frontend parity, and premium polish work with clear escalation for broad design decisions.
- Project-level subagent orchestration: use `gpt-5.3-codex-spark` for bounded plugin/theme mappers, CI/test summarizers, and narrow fixers while reserving stronger models for final review/security/release decisions.
- WordPress live-proof gates: plugin activation, admin/settings, REST, WP-CLI, block editor, Site Editor, frontend, WooCommerce, external APIs, local HTTPS, package, and WordPress.org release proof.
- Product-repo starter kit in `templates/product-repo/` plus `scripts/install-product-agent-kit.sh` to install `AGENTS.md`, `PRODUCT.md`, `.codex/agents`, and workflow prompts into plugin/theme repositories.

## content-writer Coverage

- SEO, AEO, GEO, AI Overviews, AI Mode, answer-engine, and AI-tool-aware content planning and writing.
- Topic research, content briefs, outlines, drafts, landing pages, comparison pages, product/service pages, FAQs, metadata, content audits, and refresh plans.
- Helpful people-first content, E-E-A-T/trust signals, search intent mapping, entity coverage, schema-aware copy, internal-link guidance, and source-grounded fact handling.
- Organic search content for any topic, with stronger source standards for current, regulated, YMYL, technical, or high-stakes topics.

## wp-contributor Coverage

- WordPress Core contribution through `wordpress-develop`, Core Trac, SVN/Git patches, and linked GitHub PRs.
- WordPress Meta contribution using Meta Handbook workflows for WordPress.org, WordCamp.org, Make sites, developer.wordpress.org, directories, profiles, badges, Trac/GitHub/SVN paths, local environments, Slack escalation, and project infrastructure.
- Gutenberg and block editor contribution through `wordpress/gutenberg` guidelines, GitHub issues, PRs, labels, milestones, package boundaries, editor tests, accessibility, React Native parity, Storybook, and Core sync awareness.
- WordPress AI contribution guidelines: responsible AI-assisted contribution, disclosure, GPL compatibility, no-AI-slop quality bar, tests/QA, documentation, issue/support use, and maintainer expectations.
- Ticket triage, issue reproduction, component/milestone/keyword guidance, patch refreshes, review comments, and maintainer-ready summaries.
- Testing and validation strategy for Core, Meta, and Gutenberg using existing repo scripts first.
- Enterprise code-quality gate for upstream patches and reviews: modularity, performance, security, maintainability, and rare/failure scenario coverage framed as concrete acceptance risks.
- Production dependency hygiene for Composer and npm in contribution packaging, CI artifacts, release branches, and deploy checks.
- New-chat and PR branch discipline for contribution work: verify trunk/main versus release/backport branches, explicitly set PR bases, and avoid defaulting to the wrong upstream branch.
- Project-level Codex subagent routing for contribution work: use bounded mappers/reviewers for Core, Meta, Gutenberg, tests, docs, and backport surfaces while keeping PRs and final decisions parent-owned.
- WordPress coding standards, inline docs, i18n, accessibility, performance, privacy, security, dev-note, props, and commit-message guidance.
- Release phase, backport, RC/minor-release caution, and private security disclosure workflows.

## Skills

Install or reference the skill folders:

```text
wp-expert/
wp-plugin-expert/
wp-theme-expert/
wp-site-expert/
wp-product-orchestrator/
wp-contributor/
content-writer/
```

Default invocations:

```text
Use $wp-expert when the WordPress task is ambiguous and needs routing to the right specialist.

Use $wp-plugin-expert to review, implement, debug, harden, refactor, test, package, or release a WordPress plugin, plugin product architecture, REST/admin feature, custom table, third-party API integration, WooCommerce extension, WordPress.org plugin, or enterprise/VIP plugin codebase.

Use $wp-theme-expert to build, review, debug, or improve a WordPress theme, custom child theme, block/FSE theme, `theme.json`, templates, patterns, block styles, custom block, design-to-theme implementation, Ollie/Blocksy site, visual parity task, or editor/frontend parity issue.

Use $wp-site-expert to plan, build, review, or improve a WordPress website, landing page, conversion flow, UX/IA, content model, SEO/AEO/GEO surface, analytics/tracking setup, accessibility, performance, responsive polish, or premium enterprise site experience.

Use the relevant specialist skill with `shared/references/project-subagent-routing.md` when a WordPress app project needs Codex subagent profiles, skill-level routing, or efficient `gpt-5.3-codex-spark` usage; use $wp-expert only if the lane is ambiguous.

Use $wp-product-orchestrator to triage, plan, delegate, validate, commit, push, or prepare PRs for autonomous WordPress plugin/theme product work.

Use $wp-contributor to contribute to WordPress Core, Meta, Gutenberg, wordpress-develop, WordPress.org, WordCamp.org, Trac tickets, GitHub PRs, patches, tests, docs, standards, AI-assisted contribution guidelines, enterprise code-quality gates, triage, release/backport work, or contributor communication.

Use $wp-contributor with `shared/references/project-subagent-routing.md` when a contribution repo needs bounded Core/Meta/Gutenberg subagent mapping, review, or test triage.

Use $content-writer to research, brief, draft, rewrite, audit, or refresh organic-search-focused content for SEO, AEO, GEO, AI Overviews, answer engines, and AI tools.
```

## Quick Start

### Install Globally For Claude Code

Clone this repo and run the installer from the repo root:

```bash
git clone https://github.com/mehul0810/wp-expert-codex-skill.git
cd wp-expert-codex-skill

# Install all skills globally.
bash scripts/install-global-skill-links.sh
```

This symlinks the skills into `~/.claude/skills/`, where Claude Code discovers personal/global skills across projects:

```text
~/.claude/skills/wp-expert/SKILL.md
~/.claude/skills/wp-plugin-expert/SKILL.md
~/.claude/skills/wp-theme-expert/SKILL.md
~/.claude/skills/wp-site-expert/SKILL.md
~/.claude/skills/wp-product-orchestrator/SKILL.md
~/.claude/skills/wp-contributor/SKILL.md
~/.claude/skills/content-writer/SKILL.md
~/.claude/skills/shared/references/*.md
~/.claude/skills/templates/product-repo/*
```

Install selected skills only:

```bash
bash scripts/install-global-skill-links.sh wp-expert
bash scripts/install-global-skill-links.sh wp-plugin-expert wp-theme-expert wp-site-expert
bash scripts/install-global-skill-links.sh wp-expert wp-plugin-expert wp-theme-expert wp-site-expert wp-contributor
bash scripts/install-global-skill-links.sh content-writer
```

Replace existing non-symlink targets if needed:

```bash
bash scripts/install-global-skill-links.sh --force
```

Verify Claude can see the skill files on disk:

```bash
ls -la ~/.claude/skills
test -f ~/.claude/skills/wp-expert/SKILL.md && echo "wp-expert installed"
test -f ~/.claude/skills/wp-plugin-expert/SKILL.md && echo "wp-plugin-expert installed"
test -f ~/.claude/skills/wp-theme-expert/SKILL.md && echo "wp-theme-expert installed"
test -f ~/.claude/skills/wp-site-expert/SKILL.md && echo "wp-site-expert installed"
test -f ~/.claude/skills/wp-product-orchestrator/SKILL.md && echo "wp-product-orchestrator installed"
test -f ~/.claude/skills/wp-contributor/SKILL.md && echo "wp-contributor installed"
test -f ~/.claude/skills/content-writer/SKILL.md && echo "content-writer installed"
```

After first install, fully restart Claude Code if the skills do not appear immediately. Then run `/help` or explicitly ask Claude Code to use `wp-expert`, `wp-plugin-expert`, `wp-theme-expert`, `wp-site-expert`, `wp-contributor`, or `content-writer`.

### Install Globally For Codex

The same installer also symlinks skills into Codex's global skills directory:

```text
~/.codex/skills/wp-expert/SKILL.md
~/.codex/skills/wp-plugin-expert/SKILL.md
~/.codex/skills/wp-theme-expert/SKILL.md
~/.codex/skills/wp-site-expert/SKILL.md
~/.codex/skills/wp-product-orchestrator/SKILL.md
~/.codex/skills/wp-contributor/SKILL.md
~/.codex/skills/content-writer/SKILL.md
~/.codex/skills/shared/references/*.md
~/.codex/skills/templates/product-repo/*
```

If `CODEX_HOME` or `CLAUDE_HOME` is set, the installer uses those locations instead of `~/.codex` or `~/.claude`.

## Global Symlink Installer

This repo uses Agent Skills format (`SKILL.md`) so the same skill folders work in both Codex and Claude Code.

What it does:

- Validates each skill folder has compatible frontmatter (`name`, `description`) and naming.
- Symlinks skills to Codex global path: `${CODEX_HOME:-~/.codex}/skills/<skill-name>`.
- Symlinks skills to Claude global path: `${CLAUDE_HOME:-~/.claude}/skills/<skill-name>`.
- Symlinks shared references to both skill roots as `shared/` so `../shared/references/*.md` resolves consistently from symlinked skill folders.
- Symlinks product repo templates to both skill roots as `templates/` so starter-kit paths are available from global installs.

## Product Repo Autonomy Kit

Install the starter kit into a WordPress plugin/theme repo:

```bash
bash /path/to/wp-expert-codex-skill/scripts/install-product-agent-kit.sh /path/to/product-repo
```

This copies `AGENTS.md`, `PRODUCT.md`, `.codex/config.toml`, `.codex/agents/*.toml`, and `.codex/prompts/*.md`. Existing files are skipped unless `--force` is passed.

## Design

The skills are intentionally token-efficient:

- Each `SKILL.md` contains the core operating workflow and reference router.
- Each `references/` directory contains deeper playbooks loaded only when relevant.
- Clear plugin, theme, site, product, contribution, and content tasks should trigger the specialist directly; `wp-expert` is only the ambiguous-task router.
- Skill frontmatter descriptions and default prompts are intentionally short because they affect baseline skill-selection context.
- The shared `research-token-discipline.md` reference keeps web/research behavior explicit without duplicating guidance across skills.
- The shared `session-continuity-pr-discipline.md` reference keeps new-chat context recovery and PR base-branch safety explicit across code-oriented skills.
- The shared `project-subagent-routing.md` reference keeps project-level subagent/model routing explicit without bloating hot-path skill instructions.
- The shared product autonomy, queue triage, and live-proof references keep autonomous plugin/theme work explicit without bloating `wp-expert`.
- The shared `production-dependency-discipline.md` reference keeps Composer/npm production-artifact hygiene consistent across both skills.
- The shared `enterprise-code-quality-gate.md` reference keeps modular, secure, performant, maintainable, test-backed engineering expectations consistent across code-oriented skills.
- The `wp-expert/references/thinking-brainstorming-engineering-discipline.md` reference keeps brainstorming convergence, anti-overengineering, reference budgets, and premium polish stopping rules explicit without bloating the core skill.
- The `wp-expert/references/ux-product-strategy-design-qa.md` reference keeps premium UI/UX strategy, image parity, and design QA explicit without bloating the core skill.
- Focused `wp-expert/references/` playbooks keep plugin product architecture, troubleshooting, conversion engineering, frontend performance, launch readiness, hybrid migration, supportability, analytics, and acceptance criteria loadable only when needed.
- Each `scripts/` directory contains lightweight discovery, validation, and workflow helpers.
- `scripts/skill-token-audit.sh` guards frontmatter, `SKILL.md`, prompt, and reference word budgets so future improvements do not quietly increase token usage.
- `skill-evals/wp-expert-scenarios.md` contains lightweight scenario prompts for checking routing and behavior after skill changes.

See `PLANNING_REPORT.md` for the planning rationale and validation history.
