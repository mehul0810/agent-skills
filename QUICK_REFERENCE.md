# Quick Reference Guide

Fast lookup for common WordPress tasks and which references to use.

## Organic Search Content Tasks

Use `$content-writer` for SEO, AEO, GEO, AI Overviews, answer engines, AI tools, content briefs, outlines, drafts, audits, and refreshes.

**"I need an SEO/AEO/GEO content brief for a topic"**
- Skill: `content-writer`
- Load: `organic-search-content.md`

**"Write an organic-search-focused article, landing page, comparison page, or FAQ"**
- Skill: `content-writer`
- Load: `organic-search-content.md`

**"Audit or refresh existing content for AI Overview and organic search readiness"**
- Skill: `content-writer`
- Load: `organic-search-content.md`

## WordPress Contribution Tasks

Use `$wp-contributor` for Core, Meta, Gutenberg, WordPress.org, Trac, GitHub PR, patch, testing, docs, triage, and contributor communication work.

**"I used AI while preparing a WordPress contribution"**
- Skill: `wp-contributor`
- Load: `ai-guidelines.md`

**"Review an AI-assisted WordPress patch or PR"**
- Skill: `wp-contributor`
- Load: `ai-guidelines.md`
- Supporting: `standards-docs-props.md`, `testing-validation.md`

## Common WordPress Tasks

### Plugin Development & Architecture

**"I'm building a new WordPress plugin"**
- Load: `plugin-architecture.md`
- Then: `implementation-patterns.md`
- Also check: `standards-ci-github.md`

**"My plugin needs to integrate with an external API"**
- Load: `third-party-api-integrations.md`
- Supporting: `performance-and-security.md`

**"I'm building or reviewing WooCommerce checkout, HPOS, payments, or orders"**
- Load: `woocommerce-commerce-engineering.md`
- Supporting: `performance-and-security.md`, `privacy-consent-data-governance.md`

**"I need to refactor a plugin to reduce code duplication"**
- Load: `duplicate-code-modularity-review.md`
- Then: `implementation-patterns.md`

**"I need generated code or a review to meet enterprise/WPVIP standards"**
- Load: `../shared/references/enterprise-code-quality-gate.md`
- Supporting: `review-checklists.md`, `validation-commands.md`

**"I need planning that prevents implementation drift or calibrated validation"**
- Load: `planning-drift-control.md`
- Supporting: `delivery-excellence.md`, `validation-commands.md`

**"I need brainstorming, architecture options, or premium polish without overengineering"**
- Load: `thinking-brainstorming-engineering-discipline.md`
- Supporting: `planning-drift-control.md`, `delivery-excellence.md`

**"Should I add a custom REST endpoint?"**
- Load: `implementation-patterns.md` (REST section)
- Also check: `standards-ci-github.md`

**"I'm building an AI/LLM WordPress product or admin assistant"**
- Load: `ai-llm-wordpress-product-engineering.md`
- Supporting: `privacy-consent-data-governance.md`, `third-party-api-integrations.md`

**"I'm preparing a freemium/pro plugin or marketplace product"**
- Load: `marketplace-product-readiness.md`
- Supporting: `plugin-guidelines-review.md`, `../shared/references/production-dependency-discipline.md`

---

### Theme Development & Block Editor

**"I need to convert a design to a custom FSE theme"**
- Load: `block-theme-architecture.md`
- Supporting: `custom-block-theme-from-design.md`, `visual-parity-regression.md`

**"I need to implement a style guide, design tokens, or design patterns in a theme"**
- Load: `style-guide-theme-translation.md`
- Supporting: `block-theme-architecture.md`, `visual-parity-regression.md`

**"Should this be a custom theme or child theme on top of an existing theme?"**
- Load: `style-guide-theme-translation.md`
- Supporting: `theme-and-block-editor.md`

**"How do I implement a custom block?"**
- Load: `block-theme-architecture.md`
- Supporting: `theme-and-block-editor.md`, `wordpress-design-system.md` (if using WPDS)

**"Should this be a pattern, template part, block variation, binding, or custom block?"**
- Load: `block-theme-architecture.md`
- Supporting: `custom-block-theme-from-design.md`

**"I'm working with Ollie block theme"**
- Load: `ollie-block-theme.md`
- Supporting: `custom-block-theme-from-design.md`

**"I'm working with Blocksy theme"**
- Load: `blocksy-theme.md`
- Supporting: `theme-and-block-editor.md`

---

### React & JavaScript

**"I'm building a React component for WordPress"**
- Load: `react-wordpress-enterprise.md`
- Supporting: `wordpress-design-system.md`, `standards-ci-github.md`

**"I'm building a headless WordPress frontend"**
- Load: `headless-decoupled-wordpress.md`
- Supporting: `technical-seo-engineering.md`, `edge-caching-cdn-architecture.md`

**"I need to test my WordPress React code"**
- Load: `react-wordpress-enterprise.md` (testing section)
- Also check: `validation-commands.md`

---

### Performance & Security

**"My site is slow. Where do I start?"**
- Load: `performance-and-security.md`
- Then: `enterprise-architecture.md` (caching/architecture sections)
- If VIP: `vip-scale-playbook.md`

**"I need to harden a WordPress installation"**
- Load: `performance-and-security.md`
- Also: `security-operations-compliance.md`

**"We're dealing with a production incident"**
- Load: `troubleshooting-operations.md`
- Then: `observability-incident-response.md`

---

### Releases & Deployment

**"I'm releasing a WordPress.org plugin"**
- Load: `wordpress-org-release-operations.md`
- Supporting: `changelog-release-notes.md`, `plugin-guidelines-review.md`

**"I need to write better changelog/release notes"**
- Load: `changelog-release-notes.md`
- Supporting: `release-contract-compatibility.md`

**"I'm deploying code to production and want to be safe"**
- Load: `deployment-release-resilience.md`
- Supporting: `release-contract-compatibility.md`

**"I need a disaster recovery, restore, or business continuity plan"**
- Load: `disaster-recovery-business-continuity.md`
- Supporting: `deployment-release-resilience.md`, `observability-incident-response.md`

---

### Admin & UI/UX

**"I need acceptance criteria before implementation"**
- Load: `enterprise-acceptance-criteria-templates.md`
- Supporting: `test-coverage-discipline.md`, `validation-commands.md`

**"I need to plan or review the UX before implementation"**
- Load: `ux-product-strategy-design-qa.md`
- Supporting: `ui-ux-pro-for-wordpress.md`, `wordpress-design-system.md`

**"I need to build or improve a conversion-focused website or landing page"**
- Load: `conversion-focused-website-engineering.md`
- Supporting: `ux-product-strategy-design-qa.md`, `analytics-measurement-engineering.md`

**"I need analytics or conversion tracking implemented correctly"**
- Load: `analytics-measurement-engineering.md`
- Supporting: `privacy-consent-data-governance.md`, `conversion-focused-website-engineering.md`

**"I provided a design image or screenshot and need the implementation to match it"**
- Load: `ux-product-strategy-design-qa.md`
- Supporting: `visual-parity-regression.md`, `style-guide-theme-translation.md`

**"I need to improve the WordPress admin experience"**
- Load: `admin-ux-and-ui.md`
- Supporting: `ui-ux-pro-for-wordpress.md`

**"I'm building a product dashboard in WordPress"**
- Load: `ui-ux-pro-for-wordpress.md`
- Supporting: `wordpress-design-system.md`, `admin-ux-and-ui.md`

**"I need to check visual parity across site editor/frontend"**
- Load: `visual-parity-regression.md`
- Supporting: `theme-and-block-editor.md`

---

### Accessibility & Internationalization

**"I need to make my WordPress site accessible (WCAG)"**
- Load: `accessibility-i18n-global-readiness.md`
- Supporting: `ui-ux-pro-for-wordpress.md`, `wordpress-design-system.md`

**"I need to prepare a site for multiple languages"**
- Load: `accessibility-i18n-global-readiness.md` (i18n section)
- Also check: `standards-docs-props.md` (if contributing upstream)

---

### SEO, Privacy & Content Architecture

**"I need technical SEO implementation or review"**
- Load: `technical-seo-engineering.md`
- Supporting: `content-migration-editorial-scale.md`, `headless-decoupled-wordpress.md`

**"I need to handle privacy, consent, telemetry, PII, export, or erasure"**
- Load: `privacy-consent-data-governance.md`
- Supporting: `security-operations-compliance.md`, `plugin-guidelines-review.md`

**"Should this be a CPT, taxonomy, meta, custom table, pattern, block, or option?"**
- Load: `content-modeling-information-architecture.md`
- Supporting: `block-theme-architecture.md`, `enterprise-architecture.md`

---

### Enterprise & Scale

**"We're architecting for 100K+ requests/day"**
- Load: `vip-scale-playbook.md`
- Supporting: `edge-caching-cdn-architecture.md`, `load-testing-capacity-planning.md`

**"I need to set up multisite correctly"**
- Load: `advanced-multisite-network-engineering.md`
- Supporting: `enterprise-architecture.md`, `content-migration-editorial-scale.md`

**"We need to migrate a large amount of content"**
- Load: `content-migration-editorial-scale.md`
- Supporting: `deployment-release-resilience.md`

**"I need to implement observability/monitoring"**
- Load: `observability-incident-response.md`
- Supporting: `performance-and-security.md`

---

### Code Standards & CI/CD

**"What are WordPress coding standards?"**
- Load: `standards-ci-github.md`
- Also check: `review-checklists.md`

**"I need to set up GitHub Actions for my project"**
- Load: `standards-ci-github.md` (CI/CD section)
- Supporting: `build-tooling.md`

**"Open a PR for this release-scoped fix"**
- Load: `../shared/references/session-continuity-pr-discipline.md`
- Supporting: `standards-ci-github.md`

**"I need to manage a monorepo of WordPress plugins"**
- Load: `monorepo-engineering.md`
- Supporting: `build-tooling.md`, `standards-ci-github.md`

---

### Code Reviews & Audits

**"I need to review a plugin for quality/risks"**
- Load: `review-checklists.md`
- Supporting: Varies by findings (see routing map)

**"I'm reviewing a plugin for WordPress.org guidelines"**
- Load: `plugin-guidelines-review.md`
- Supporting: `changelog-release-notes.md`

**"I need to check if this plugin will work on VIP"**
- Load: `vip-scale-playbook.md`
- Supporting: `performance-and-security.md`, `security-operations-compliance.md`

**"I need a go/no-go launch readiness review"**
- Load: `vip-enterprise-launch-readiness.md`
- Supporting: `deployment-release-resilience.md`, `observability-incident-response.md`

**"Threat model this REST/admin/upload/webhook feature"**
- Load: `security-threat-modeling-review.md`
- Supporting: `security-operations-compliance.md`

**"Profile this hot path and set performance budgets"**
- Load: `performance-profiling-scale-budgets.md`
- Supporting: `edge-caching-cdn-architecture.md`, `load-testing-capacity-planning.md`

**"Review this custom database table architecture"**
- Load: `database-table-architecture-review.md`
- Supporting: `performance-profiling-scale-budgets.md`, `content-modeling-information-architecture.md`

**"Review whether this PR is missing test coverage"**
- Load: `test-coverage-discipline.md`
- Supporting: `review-checklists.md`, `validation-commands.md`

---

### Troubleshooting

**"Something is broken in production, where do I look?"**
- Load: `troubleshooting-operations.md`
- Also: `wp-context.sh` script for repo discovery

**"I need a systematic debugging decision tree"**
- Load: `advanced-troubleshooting-decision-tree.md`
- Supporting: `troubleshooting-operations.md`, `validation-commands.md`

**"I need plugin support diagnostics or Site Health checks"**
- Load: `plugin-debuggability-supportability.md`
- Supporting: `plugin-product-architecture.md`, `observability-incident-response.md`

**"I need to debug a WordPress configuration issue"**
- Load: `validation-commands.md`
- Run: Helper scripts (wp-context.sh, wp-validate.sh)

**"The in-app browser blocks my local HTTPS WordPress domain"**
- Load: `local-https-testing.md`
- Run: `wp-local-https-check.sh`

---

## Quick Task-to-Reference Matrix

| Task | Primary Reference | Quick Load Time |
|------|-------------------|-----------------|
| New plugin | plugin-architecture.md | 10 min |
| Plugin product architecture | plugin-product-architecture.md | 10 min |
| Plugin supportability | plugin-debuggability-supportability.md | 8 min |
| Enterprise code quality | enterprise-code-quality-gate.md | 6 min |
| Enterprise acceptance criteria | enterprise-acceptance-criteria-templates.md | 6 min |
| Test coverage decision | test-coverage-discipline.md | 8 min |
| Planning drift control | planning-drift-control.md | 6 min |
| Brainstorming/anti-overengineering | thinking-brainstorming-engineering-discipline.md | 6 min |
| API integration | third-party-api-integrations.md | 10 min |
| WooCommerce commerce | woocommerce-commerce-engineering.md | 10 min |
| Headless WordPress | headless-decoupled-wordpress.md | 10 min |
| Technical SEO | technical-seo-engineering.md | 8 min |
| Privacy/data governance | privacy-consent-data-governance.md | 8 min |
| Content modeling | content-modeling-information-architecture.md | 8 min |
| Database table architecture | database-table-architecture-review.md | 10 min |
| AI/LLM product | ai-llm-wordpress-product-engineering.md | 10 min |
| Marketplace readiness | marketplace-product-readiness.md | 8 min |
| Refactor code | duplicate-code-modularity-review.md | 8 min |
| Style guide/tokens | style-guide-theme-translation.md | 8 min |
| Design to FSE | custom-block-theme-from-design.md | 12 min |
| Hybrid theme migration | hybrid-theme-migration-modernization.md | 12 min |
| Theme frontend performance | theme-frontend-performance-quality-gate.md | 10 min |
| UX strategy/design QA | ux-product-strategy-design-qa.md | 10 min |
| Conversion website | conversion-focused-website-engineering.md | 10 min |
| Analytics/measurement | analytics-measurement-engineering.md | 8 min |
| Custom block | theme-and-block-editor.md | 10 min |
| React component | react-wordpress-enterprise.md | 12 min |
| Performance | performance-and-security.md | 10 min |
| Performance profiling/budgets | performance-profiling-scale-budgets.md | 10 min |
| Security threat model | security-threat-modeling-review.md | 10 min |
| Incident response | troubleshooting-operations.md | 8 min |
| Advanced troubleshooting | advanced-troubleshooting-decision-tree.md | 8 min |
| PR base/release branch safety | session-continuity-pr-discipline.md | 5 min |
| Release plugin | wordpress-org-release-operations.md | 10 min |
| Release notes | changelog-release-notes.md | 8 min |
| Admin UI | admin-ux-and-ui.md | 8 min |
| Accessibility | accessibility-i18n-global-readiness.md | 10 min |
| VIP scale | vip-scale-playbook.md | 12 min |
| Launch readiness | vip-enterprise-launch-readiness.md | 10 min |
| Advanced multisite | advanced-multisite-network-engineering.md | 10 min |
| Disaster recovery | disaster-recovery-business-continuity.md | 8 min |
| Migration | content-migration-editorial-scale.md | 12 min |
| Observability | observability-incident-response.md | 10 min |
| CI/CD setup | standards-ci-github.md | 10 min |
| Monorepo | monorepo-engineering.md | 10 min |
| Code review | review-checklists.md | 8 min |
| Plugin audit | plugin-guidelines-review.md | 8 min |
| Visual parity | visual-parity-regression.md | 8 min |
| Local HTTPS blocked | local-https-testing.md | 6 min |

---

## Helper Scripts

Quick access to discovery and validation:

```bash
# Find WordPress bootstrap files and structure
bash wp-expert/scripts/wp-context.sh /path/to/repo

# Validate PHP/JS syntax and standards
bash wp-expert/scripts/wp-validate.sh /path/to/repo

# Generate FSE theme.json from design map
bash wp-expert/scripts/fse-design-map.sh design-map.md

# Verify WordPress.org release artifacts
bash wp-expert/scripts/wporg-release-verify.sh /path/to/svn 1.0.0

# Check custom local HTTPS domains and capture screenshot when Playwright is available
bash wp-expert/scripts/wp-local-https-check.sh https://example.test/ /tmp/example-home.png

# Discover contribution repo structure
bash wp-contributor/scripts/wp-contrib-context.sh /path/to/wordpress-develop
```

---

## Theme-Specific Quick Links

**Working with Ollie?**
- Always load `ollie-block-theme.md` after choosing primary reference
- Common tasks: Site Editor workflows, child themes, Pro extensions

**Working with Blocksy?**
- Always load `blocksy-theme.md` after choosing primary reference
- Common tasks: Customizer workflows, Companion plugin, WooCommerce

---

## Shared References

Use these for **any** task:

**Research & Exploration**
- Load: `../shared/references/research-token-discipline.md`
- When: Web-heavy, drift-prone, or broad exploration tasks
- Time: 5 min read

**Production Dependencies**
- Load: `../shared/references/production-dependency-discipline.md`
- When: Composer/npm, CI artifacts, releases
- Time: 5 min read

**Session Continuity & PR Branch Safety**
- Load: `../shared/references/session-continuity-pr-discipline.md`
- When: New chats, resumed repo work, branch creation, release branches, PR creation
- Time: 5 min read

**Enterprise Code Quality**
- Load: `../shared/references/enterprise-code-quality-gate.md`
- When: Code creation, refactoring, reviews, tests, rare/failure scenarios
- Time: 6 min read

---

## Getting More Help

- **Full reference descriptions**: See `reference-routing-map.md`
- **Setup & installation**: See [README.md](README.md)
- **Contributing improvements**: See [CONTRIBUTING.md](CONTRIBUTING.md)
- **System requirements**: See [SYSTEM_REQUIREMENTS.md](SYSTEM_REQUIREMENTS.md)

---

## Pro Tips

1. **Start with the reference routing map** if you're not sure which reference to load
2. **Load one primary reference first**, then add supporting references if gaps remain
3. **Use helper scripts** before loading references for quick repo discovery
4. **Check theme overlays** if you're working with Ollie or Blocksy
5. **Share this quick reference** with your team to accelerate WordPress engineering decisions

Good luck! 🚀
