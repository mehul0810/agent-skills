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

## Common WordPress Tasks

### Plugin Development & Architecture

**"I'm building a new WordPress plugin"**
- Load: `plugin-architecture.md`
- Then: `implementation-patterns.md`
- Also check: `standards-ci-github.md`

**"My plugin needs to integrate with an external API"**
- Load: `third-party-api-integrations.md`
- Supporting: `performance-and-security.md`

**"I need to refactor a plugin to reduce code duplication"**
- Load: `duplicate-code-modularity-review.md`
- Then: `implementation-patterns.md`

**"Should I add a custom REST endpoint?"**
- Load: `implementation-patterns.md` (REST section)
- Also check: `standards-ci-github.md`

---

### Theme Development & Block Editor

**"I need to convert a design to a custom FSE theme"**
- Load: `custom-block-theme-from-design.md`
- Supporting: `theme-and-block-editor.md`, `visual-parity-regression.md`

**"How do I implement a custom block?"**
- Load: `theme-and-block-editor.md`
- Supporting: `wordpress-design-system.md` (if using WPDS)

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

---

### Admin & UI/UX

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

### Enterprise & Scale

**"We're architecting for 100K+ requests/day"**
- Load: `vip-scale-playbook.md`
- Supporting: `edge-caching-cdn-architecture.md`, `load-testing-capacity-planning.md`

**"I need to set up multisite correctly"**
- Load: `enterprise-architecture.md` (multisite section)
- Then: `vip-scale-playbook.md` if on VIP

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

---

### Troubleshooting

**"Something is broken in production, where do I look?"**
- Load: `troubleshooting-operations.md`
- Also: `wp-context.sh` script for repo discovery

**"I need to debug a WordPress configuration issue"**
- Load: `validation-commands.md`
- Run: Helper scripts (wp-context.sh, wp-validate.sh)

---

## Quick Task-to-Reference Matrix

| Task | Primary Reference | Quick Load Time |
|------|-------------------|-----------------|
| New plugin | plugin-architecture.md | 10 min |
| API integration | third-party-api-integrations.md | 10 min |
| Refactor code | duplicate-code-modularity-review.md | 8 min |
| Design to FSE | custom-block-theme-from-design.md | 12 min |
| Custom block | theme-and-block-editor.md | 10 min |
| React component | react-wordpress-enterprise.md | 12 min |
| Performance | performance-and-security.md | 10 min |
| Incident response | troubleshooting-operations.md | 8 min |
| Release plugin | wordpress-org-release-operations.md | 10 min |
| Release notes | changelog-release-notes.md | 8 min |
| Admin UI | admin-ux-and-ui.md | 8 min |
| Accessibility | accessibility-i18n-global-readiness.md | 10 min |
| VIP scale | vip-scale-playbook.md | 12 min |
| Migration | content-migration-editorial-scale.md | 12 min |
| Observability | observability-incident-response.md | 10 min |
| CI/CD setup | standards-ci-github.md | 10 min |
| Monorepo | monorepo-engineering.md | 10 min |
| Code review | review-checklists.md | 8 min |
| Plugin audit | plugin-guidelines-review.md | 8 min |
| Visual parity | visual-parity-regression.md | 8 min |

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
