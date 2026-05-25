# Changelog

All notable changes to the WP Expert skill pack are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- **Content Writer Skill**: SEO, AEO, GEO, AI Overviews, AI Mode, answer-engine, and AI-tool-aware content strategy, briefs, drafts, audits, refreshes, schema-aware copy, and source-grounded editorial workflows.
- **Git Delivery Discipline**: wp-expert now explicitly prefers small focused commits for separable validated changes and pushing all task commits after completion when a remote is configured.

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
