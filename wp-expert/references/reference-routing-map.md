# Reference Routing Map

Use this map to choose references with low context cost.

## Loading Discipline

- Choose one primary reference that matches the core deliverable.
- Add at most two supporting references for cross-cutting risk.
- Stop loading more references when you already have enough to implement or review safely.

## Task To Reference Map

| Task signal | Primary reference | Common supporting references |
| --- | --- | --- |
| PRD, SOW, estimates, milestones, mobile-first planning | `delivery-excellence.md` | `review-checklists.md`, `runtime-toolchain-version-policy.md` |
| Plugin architecture, new feature, refactor, service boundaries | `plugin-architecture.md` | `implementation-patterns.md`, `duplicate-code-modularity-review.md` |
| Third-party API integration | `third-party-api-integrations.md` | `performance-and-security.md`, `implementation-patterns.md` |
| WordPress.org plugin compliance review | `plugin-guidelines-review.md` | `changelog-release-notes.md`, `release-contract-compatibility.md` |
| WordPress.org release operations and deploy behavior | `wordpress-org-release-operations.md` | `deployment-release-resilience.md`, `build-tooling.md` |
| Release notes, changelog quality, version narrative | `changelog-release-notes.md` | `release-contract-compatibility.md`, `delivery-excellence.md` |
| Backward compatibility and launch-state decisions | `release-contract-compatibility.md` | `changelog-release-notes.md`, `plugin-architecture.md` |
| Design to custom FSE block theme | `custom-block-theme-from-design.md` | `theme-and-block-editor.md`, `visual-parity-regression.md` |
| Theme/block editor behavior or block implementation | `theme-and-block-editor.md` | `wordpress-design-system.md`, `validation-commands.md` |
| React in WordPress (admin/editor/frontend/headless) | `react-wordpress-enterprise.md` | `wordpress-design-system.md`, `standards-ci-github.md` |
| UI/UX improvement or admin UX | `ui-ux-pro-for-wordpress.md` | `admin-ux-and-ui.md`, `visual-parity-regression.md` |
| WordPress Design System implementation | `wordpress-design-system.md` | `admin-ux-and-ui.md`, `ui-ux-pro-for-wordpress.md` |
| Performance/security hardening | `performance-and-security.md` | `enterprise-architecture.md`, `vip-scale-playbook.md` |
| VIP/high-scale architecture decisions | `vip-scale-playbook.md` | `edge-caching-cdn-architecture.md`, `load-testing-capacity-planning.md` |
| Incident, reliability, production debugging | `troubleshooting-operations.md` | `observability-incident-response.md`, `performance-and-security.md` |
| CI/CD, linting, standards, GitHub workflows | `standards-ci-github.md` | `build-tooling.md`, `validation-commands.md` |
| Monorepo structure and multi-package release flow | `monorepo-engineering.md` | `build-tooling.md`, `standards-ci-github.md` |
| Build tooling choices (webpack/composer/npm) | `build-tooling.md` | `runtime-toolchain-version-policy.md`, `production-dependency-discipline.md` |
| Migrations and editorial-scale launches | `content-migration-editorial-scale.md` | `deployment-release-resilience.md`, `enterprise-search-content-scale.md` |
| Accessibility, i18n, global readiness | `accessibility-i18n-global-readiness.md` | `ui-ux-pro-for-wordpress.md`, `validation-commands.md` |

## Theme-Specific Overlays

- Ollie/Ollie Pro tasks: load `ollie-block-theme.md` as supporting context after choosing the primary task reference.
- Blocksy/Blocksy Pro tasks: load `blocksy-theme.md` as supporting context after choosing the primary task reference.

## Shared References

- Use `../shared/references/research-token-discipline.md` only for web-heavy, drift-prone, or broad discovery tasks.
- Use `../shared/references/production-dependency-discipline.md` for packaging, CI artifacts, release ZIP/SVN, and production dependency verification.
