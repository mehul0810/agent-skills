# Changelog

All notable changes to the WP Expert skill pack are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- **Advanced Troubleshooting Decision Tree**: Added symptom-to-probe debugging, conflict isolation, REST/auth diagnosis, cache/CDN debugging, and rollback-first production triage guidance.
- **Analytics And Measurement Engineering**: Added consent-aware analytics, GA4/GTM/data layer, WooCommerce and lead-funnel events, duplicate-event prevention, privacy boundaries, and validation guidance.
- **Block/FSE Architecture Decisioning**: Dedicated guidance for theme vs plugin ownership, content/data contracts, editor ownership, templates, template parts, patterns, block styles, variations, bindings, custom blocks, dynamic rendering, and Interactivity API.
- **Conversion Focused Website Engineering**: Added landing page, lead funnel, checkout/booking funnel, CTA, trust proof, CRO experiment, measurement, accessibility, SEO, and performance guidance.
- **Content Writer Skill**: SEO, AEO, GEO, AI Overviews, AI Mode, answer-engine, and AI-tool-aware content strategy, briefs, drafts, audits, refreshes, schema-aware copy, and source-grounded editorial workflows.
- **Database Table Architecture Review**: Added wp-expert guidance for custom table decisioning, schema design, query-to-index mapping, migrations, multisite ownership, retention, privacy, concurrency, and maintainability review.
- **Enterprise Acceptance Criteria Templates**: Added definition-of-done gates for plugin features, themes, REST APIs, migrations, performance fixes, security fixes, and conversion pages.
- **Git Delivery Discipline**: wp-expert now explicitly prefers small focused commits for separable validated changes and pushing all task commits after completion when a remote is configured.
- **Hybrid Theme Migration And Modernization**: Added guidance for classic-to-block migration, page-builder migration, child-theme modernization, WooCommerce template cleanup, and SEO/content preservation.
- **Plugin Debuggability And Supportability**: Added Site Health, diagnostics, redacted support bundles, safe logs, correlation IDs, recovery controls, and enterprise support exports.
- **Plugin Product Architecture**: Added guidance for add-on/pro boundaries, extension contracts, public APIs, hooks/filters, feature flags, dependency detection, and upgrade-safe product architecture.
- **Session Continuity And PR Branch Discipline**: Shared guidance for rehydrating repo context in new chats, checking release/hotfix/support branches, explicitly setting PR bases, and verifying PR `baseRefName` before reporting success.
- **Style Guide And Theme Translation**: wp-expert now includes guidance for translating style guides, design patterns, and design tokens into WordPress-native custom themes, child themes, `theme.json`, patterns, template parts, block styles, and variations.
- **Theme Frontend Performance Quality Gate**: Added Core Web Vitals, fonts, images, responsive media, asset scoping, block CSS bloat, CLS/LCP/INP, and frontend/editor CSS quality guidance.
- **Test Coverage Discipline**: Added wp-expert guidance requiring every PR/change to make an explicit test decision, add or update coverage when behavior risk warrants it, and flag missing coverage as a concrete review finding.
- **UX Product Strategy And Pixel-Parity Design QA**: Added wp-expert guidance for UX discovery, user journeys, information architecture, UX writing, conversion UX, usability review, design-system governance, premium/enterprise design scoring, and image/screenshot/mockup matching.
- **VIP Enterprise Launch Readiness**: Added enterprise go/no-go matrix, code/data/cache/search/CDN/redirect/observability/rollback/support checks, launch window discipline, and post-launch monitoring guidance.
- **Local HTTPS Testing Workaround**: Added guidance and a helper script for validating custom local HTTPS WordPress domains when the in-app browser blocks self-signed certificates or local proxy routes.
- **Premium Enterprise UI Bar**: wp-expert now explicitly requires polished, brand-aligned, accessible, responsive UI quality for premium and enterprise WordPress work.
- **Performance Profiling And Scale Budgets**: Added deeper wp-expert guidance for baseline measurement, hot-path budgets, query/object-cache profiling, admin/editor speed, Core Web Vitals, async backpressure, and high-traffic acceptance checks.
- **Security Threat Modeling And Review**: Added deeper wp-expert guidance for assets, actors, trust boundaries, REST/admin/upload/webhook/OAuth/MCP entry points, abuse cases, capability/ownership checks, and negative security tests.
- **Enterprise Code Quality Gate**: Shared guidance for wp-expert and wp-contributor requiring modular, performant, secure, maintainable, test-backed code with rare/failure scenario coverage for creation, refactoring, and review.
- **Planning Drift Control**: wp-expert now includes scope guardrails, risk-calibrated validation levels, and exact user-fed CSS/value-change rules that use diff confirmation without unnecessary visual verification.
- **Enterprise WordPress Domain Playbooks**: Added wp-expert references for WooCommerce/commerce, headless/decoupled WordPress, advanced multisite, technical SEO, privacy/data governance, content modeling, disaster recovery, AI/LLM WordPress products, and marketplace/product readiness.
- **Skill Evaluation Scenarios**: Added lightweight wp-expert scenario prompts to verify routing and behavior across exact CSS edits, WooCommerce, headless, multisite, technical SEO, privacy, content modeling, disaster recovery, AI products, and marketplace readiness.
- **WordPress AI Contribution Guidelines**: wp-contributor now includes Make WordPress AI handbook guidance for AI-assisted contributions, disclosure, GPL compatibility, no-AI-slop quality, tests, documentation, issues, and maintainer expectations.

### Changed

- Validation tooling now discovers top-level skill directories dynamically so new skills are covered by reference and script checks.

## [1.0.0] - 2026-05-25

### Added

#### WP Expert Skill
- **Plugin Architecture**: Core patterns for plugin structure, hooks, and extension points
- **Third-Party API Integrations**: REST, GraphQL, SOAP, webhooks, OAuth, and SDK patterns
- **Custom Block Themes & FSE**: Design-to-FSE conversion, theme.json, patterns, and block binding guidance
- **Block Editor Compatibility**: Block implementation patterns, dynamic blocks, and editor integration
- **React in WordPress**: Admin apps, editor integration, headless workflows, and testing patterns
- **UI/UX & Admin**: Admin screen design, form patterns, responsive architecture, and visual parity QA
- **WordPress Design System**: @wordpress/components integration and design token guidance
- **Performance & Security**: Caching strategies, database optimization, VIP readiness, and security hardening
- **Enterprise Architecture**: Multisite, migrations, async jobs, observability, and incident response
- **VIP Scale Playbook**: High-traffic optimization, edge caching, CDN architecture, and load testing
- **Release Operations**: WordPress.org publishing, SVN workflows, changelog discipline, and backward compatibility
- **CI/CD & GitHub**: GitHub Actions, linting, standards, and deployment workflows
- **Monorepo Engineering**: Multi-package structure, shared tooling, and release coordination
- **Migrations & Content Scale**: Large imports, media migration, editorial workflows, and cutover planning
- **Accessibility & i18n**: WCAG compliance, internationalization, RTL support, and global readiness
- **Blocksy Theme Expertise**: Customizer workflows, builder patterns, and plugin integration
- **Ollie Block Theme Expertise**: Site Editor patterns, child themes, and Pro extensions
- **Troubleshooting & Debugging**: WP-CLI, activation checks, incident triage, and production debugging
- **Review Checklists**: Code review frameworks for security, performance, and architectural risks

#### WP Contributor Skill
- **Core Contribution Workflow**: Trac tickets, patches, SVN workflows, and review process
- **Meta Contribution**: WordPress.org, WordCamp.org, Make sites, and community infrastructure
- **Gutenberg Contribution**: GitHub PRs, package boundaries, block editor tests, and Core sync
- **Ticket Triage**: Component guidance, reproduction validation, and maintainer-ready summaries
- **Testing & Validation**: Core test suite, meta environments, and validation strategy
- **Standards & Props**: WordPress coding standards, inline docs, commit messages, and props attribution
- **Release & Backport**: Release phase awareness, RC caution, and backport procedures
- **Security Disclosure**: Private vulnerability reporting and disclosure workflows

#### Shared References
- **Production Dependency Discipline**: Composer/npm hygiene, dev-only separation, and artifact validation
- **Research Token Discipline**: Token-efficient exploration, source selection, and validation patterns

#### Helper Scripts
- **wp-context.sh**: Fast WordPress repository discovery and bootstrap mapping
- **wp-validate.sh**: Syntax and standards validation for PHP and JavaScript
- **fse-design-map.sh**: FSE theme.json generation from design maps
- **wporg-release-verify.sh**: WordPress.org release artifact verification
- **wp-contrib-context.sh**: WordPress contribution repository context discovery

### Infrastructure
- Global skill installation system for Claude Code and Codex
- Symlink-based installation for easy updates without duplication
- Reference routing map for intelligent context selection
- OpenAI agent configuration for Claude integration
- Comprehensive README with installation and usage instructions

---

## Version History Notes

### 1.0.0 Release Highlights
- Launched as a comprehensive principal-grade WordPress engineering skill
- Covers the full lifecycle from plugin development to enterprise deployments
- Includes specialized expertise for VIP, Ollie, and Blocksy ecosystems
- Built for token efficiency with selective reference loading
- Production-tested workflows for real WordPress challenges

---

## Upgrade Path

Users upgrading from earlier development versions should:
1. Reinstall using the updated installer: `bash scripts/install-global-skill-links.sh --force`
2. Restart Claude Code to load the new skill version
3. See [UPGRADE.md](UPGRADE.md) for detailed migration notes

---

## Future Roadmap

Planned improvements for future releases:
- WooCommerce specialized guidance and integration patterns
- Advanced multisite and network admin patterns
- Headless WordPress decoupling strategies
- API versioning and compatibility patterns
- Automated validation test suite
- Enhanced discoverability with reference tagging
