# WP Expert Codex Skill Planning Report

## Objective

Create a Codex skill that helps future agents operate like a principal WordPress engineer with enterprise and WordPress VIP experience: fast context discovery, high-signal review, safe implementation, strong validation, and token-efficient use of deeper references.

## Design Principles

- Token-efficient by default: keep `SKILL.md` short and route deeper knowledge to references only when relevant.
- Evidence-first: require repository facts, runtime mapping, file/line findings, and validation commands.
- Enterprise-grade: include security, performance, async jobs, data migrations, multisite, cache strategy, observability, and release readiness.
- VIP-aware but not stale: encode stable platform principles and require current official-doc verification for exact VIP policy.
- Implementation-focused: guide Codex to make narrow durable changes, not generic advice or broad refactors.
- Safety-first: preserve local work, protect secrets/PII, avoid destructive DB/filesystem actions, and respect production boundaries.

## Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Compact hot-path `SKILL.md` | Yes | Add | Keeps future invocations fast while still enforcing senior engineering behavior. |
| Reference routing map | Yes | Add | Lets Codex load only the needed deep playbook, reducing token and memory waste. |
| Review checklist | Yes | Add | Produces sharper audits with concrete file/line impact instead of generic WordPress commentary. |
| Enterprise architecture playbook | Yes | Add | Captures principal-level design patterns for services, data, async, caching, migrations, and BC. |
| VIP scale playbook | Yes | Add | Encodes VIP-scale assumptions while pointing to official docs for drift-prone policies. |
| Implementation patterns | Yes | Add | Speeds safe code generation for REST, AJAX, SQL, async token jobs, cache, assets, and dynamic blocks. |
| Validation command reference | Yes | Add | Makes verification practical across WP-CLI, Studio, Composer, npm, and wp-load.php environments. |
| Read-only helper scripts | Yes | Add | Gives future agents deterministic repo discovery and lightweight validation without loading large instructions. |
| Massive WordPress encyclopedia | No | Skip | Would waste context and duplicate model knowledge. The skill should teach process and sharp heuristics, not generic docs. |
| Hard-coded current VIP rules only | No | Refine | VIP policies change. The skill uses stable principles and tells Codex to verify exact current rules. |

## Skill Structure

```text
wp-expert/
|-- SKILL.md
|-- agents/openai.yaml
|-- references/
|   |-- admin-ux-and-ui.md
|   |-- delivery-excellence.md
|   |-- enterprise-architecture.md
|   |-- implementation-patterns.md
|   |-- performance-and-security.md
|   |-- plugin-architecture.md
|   |-- standards-ci-github.md
|   |-- theme-and-block-editor.md
|   |-- vip-scale-playbook.md
|   `-- focused enterprise/VIP/UI/build/search/migration/reference modules
`-- scripts/
    |-- wp-context.sh
    `-- wp-validate.sh
```

## Validation Plan

- Run `quick_validate.py` against the skill folder.
- Run both helper scripts against this repository to confirm safe execution.
- Review Git diff for accidental placeholder content or excess documentation inside the skill.

## Future Improvements

- Add project-specific reference packs for WooCommerce, multisite migrations, and block-theme architecture if repeated tasks justify the token cost.
- Forward-test the skill on real plugin review and implementation tasks after first use, then tighten weak instructions.

## Implemented Artifacts

- Created the installable `wp-expert` skill folder with valid Codex skill metadata.
- Added a compact operating workflow in `SKILL.md` to minimize token load on every invocation.
- Added five selective reference playbooks for reviews, enterprise architecture, VIP scale, implementation patterns, and validation commands.
- Added two read-only helper scripts for WordPress repo discovery and lightweight validation.
- Updated `README.md` with the skill purpose and invocation.

## Validation Results

- `quick_validate.py wp-expert`: passed.
- `bash -n wp-expert/scripts/wp-context.sh`: passed.
- `bash -n wp-expert/scripts/wp-validate.sh`: passed.
- `bash wp-expert/scripts/wp-context.sh .`: passed and confirmed the cloned GitHub repo context.
- `bash wp-expert/scripts/wp-validate.sh .`: passed; no PHP or JS files exist in this skill repo.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, and `wp-expert/`: passed.

## Source Anchors Checked

- WordPress VIP performance documentation: https://docs.wpvip.com/performance/
- WordPress VIP caching and object-cache documentation: https://docs.wpvip.com/caching/ and https://docs.wpvip.com/caching/object-cache/
- WordPress VIP file system documentation: https://docs.wpvip.com/vip-file-system/
- WordPress VIP PHPCS installed standards documentation: https://docs.wpvip.com/php_codesniffer/installed-standards/
- WordPress plugin security handbook: https://developer.wordpress.org/plugins/security/

## Expansion Iteration: Complete WP Expert Coverage

### New Objective

Expand the skill from strong plugin/VIP engineering coverage into an efficient all-around WordPress expert skill covering admin, performance, UI, UX, block editor, security, enterprise/VIP, troubleshooting, refactor, coding standards, linting, CI/CD, GitHub, GitHub Actions, WP-CLI, releases, and operational workflows.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Dedicated plugin architecture playbook | Yes | Add | Makes plugin creation/refactor work faster without overloading the core skill. |
| Dedicated theme/block editor playbook | Yes | Add | Gives block-compatible generation and theme work a first-class path. |
| Admin UX/UI playbook | Yes | Add | Covers settings UX, list tables, notices, onboarding, accessibility, and UI improvement. |
| Performance/security playbook | Yes | Add | Separates hardening and scale heuristics from review-only guidance. |
| Troubleshooting/operations playbook | Yes | Add | Speeds real-world debugging and incident triage. |
| Standards/CI/GitHub playbook | Yes | Add | Covers linting, WPCS/VIPCS, static analysis, GitHub Actions, PRs, and release flow. |
| WP-CLI automation playbook | Yes | Add | Improves runtime verification where admin/browser access is unavailable. |
| More scripts for every workflow | Not yet | Defer | Current read-only helpers are enough; more scripts should be added only after repeated tasks prove need. |
| Dump all knowledge into SKILL.md | No | Reject | Would make every invocation expensive and less focused. Reference routing remains the right design. |

### Added Artifacts

- `references/plugin-architecture.md`
- `references/theme-and-block-editor.md`
- `references/admin-ux-and-ui.md`
- `references/performance-and-security.md`
- `references/troubleshooting-operations.md`
- `references/standards-ci-github.md`
- `references/wp-cli-automation.md`

### Updated Artifacts

- `SKILL.md`: expanded trigger description, capability router, and validation ladder while keeping the body compact.
- `README.md`: documented the complete WordPress coverage.
- `agents/openai.yaml`: updated default prompt and short description.
- `scripts/wp-context.sh`: added CI, block, theme, and expanded package discovery.
- `scripts/wp-validate.sh`: added basic GitHub Actions workflow YAML parsing when Ruby is available.
- `references/validation-commands.md`: added GitHub Actions/CI validation commands.

### Additional Source Anchors Checked

- Block Editor Handbook: https://developer.wordpress.org/block-editor/
- Theme Handbook: https://developer.wordpress.org/themes/
- `theme.json` documentation: https://developer.wordpress.org/themes/global-settings-and-styles/introduction-to-theme-json/
- WordPress Coding Standards for PHP_CodeSniffer: https://github.com/WordPress/WordPress-Coding-Standards
- WP-CLI command reference: https://developer.wordpress.org/cli/commands/
- GitHub Actions workflow syntax: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax

### Expansion Validation Results

- `quick_validate.py wp-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wp-expert`: passed, confirming the installed symlink resolves correctly.
- `bash -n wp-expert/scripts/wp-context.sh`: passed.
- `bash -n wp-expert/scripts/wp-validate.sh`: passed.
- `bash wp-expert/scripts/wp-context.sh .`: passed.
- `bash wp-expert/scripts/wp-validate.sh .`: passed; no PHP/JS files or GitHub Actions workflows exist in this skill repo.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, and `wp-expert/`: passed.

## Monorepo Expert Addition

### Objective

Add monorepo expertise as a first-class WordPress expert capability covering shared Composer/npm tooling, multi-plugin/theme packages, generated artifacts, symlinked local development, path-filtered CI, and release engineering.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Dedicated monorepo playbook | Yes | Add | Monorepo work has unique WordPress discovery, artifact, symlink, and release failure modes that generic plugin guidance misses. |
| Add only a README bullet | No | Reject | The skill router must know when to load monorepo guidance. |
| Add heavy scripts now | Not yet | Defer | Deterministic monorepo scripts should be added only after repeated repo-specific workflows justify them. |

### Added Artifact

- `references/monorepo-engineering.md`

## Plugin Guidelines And Build Tooling Addition

### Objective

Add WordPress.org Plugin Directory guideline reviewer expertise plus webpack, Composer, and npm build/dependency tooling expertise as first-class skill routes.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Dedicated plugin guideline review playbook | Yes | Add | Directory submission and rejection remediation are policy reviews, not just code reviews. |
| Dedicated build tooling playbook | Yes | Add | Webpack/Composer/npm failures are common in modern WordPress plugins, blocks, themes, and monorepos. |
| Fold build tooling into CI docs only | No | Reject | Build debugging often happens outside CI and needs its own decision path. |
| Hard-code guidelines forever | No | Reject | Plugin guidelines change, so the skill must verify official docs for real submissions. |

### Added Artifacts

- `references/plugin-guidelines-review.md`
- `references/build-tooling.md`

### Additional Source Anchors Checked

- WordPress.org Detailed Plugin Guidelines: https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/
- WordPress.org Block Specific Plugin Guidelines: https://developer.wordpress.org/plugins/wordpress-org/block-specific-plugin-guidelines/
- Composer basic usage: https://getcomposer.org/doc/01-basic-usage.md
- Composer scripts: https://getcomposer.org/doc/articles/scripts.md
- npm ci documentation: https://docs.npmjs.com/cli/v8/commands/npm-ci/
- webpack concepts/configuration: https://webpack.js.org/concepts/ and https://webpack.js.org/configuration/
- WordPress dependency extraction webpack plugin: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-dependency-extraction-webpack-plugin/

## WordPress Design System Addition

### Objective

Add WordPress Design System support as a first-class skill route covering `@wordpress/components`, WordPress-native admin/editor UI patterns, design tokens, Figma-to-code translation, accessibility, and component selection.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Dedicated WordPress design system playbook | Yes | Add | It lets Codex translate UI/UX ideas into WordPress-native components instead of generic React/admin UI. |
| Put design guidance only in admin UX file | No | Reject | Design system work also spans block editor, Figma-to-code, theme tokens, and component APIs. |
| Hard-code component props | No | Reject | Component APIs change; the skill should require current official docs/Storybook checks for exact implementation details. |

### Added Artifact

- `references/wordpress-design-system.md`

### Additional Source Anchors Checked

- Make WordPress Design Handbook: https://make.wordpress.org/design/handbook/
- WordPress Design Foundations: https://make.wordpress.org/design/handbook/design-guide/foundations/
- Block Editor Component Reference: https://developer.wordpress.org/block-editor/reference-guides/components/
- Block Editor Reference Guides: https://developer.wordpress.org/block-editor/reference-guides/
- Gutenberg Storybook: https://wordpress.github.io/gutenberg/

## REST-First Endpoint Guidance Addition

### Objective

Add a durable guideline that new interactive WordPress endpoints should use REST API by default and should not use `admin-ajax.php` when REST can satisfy the same use case.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| REST-first hard rule | Yes | Add | It prevents new legacy AJAX surfaces and improves schemas, permissions, client integration, and testability. |
| Absolute ban on all AJAX | No | Refine | Existing public actions and legacy integrations sometimes require compatibility wrappers. |
| Migration wrapper pattern | Yes | Add | Gives Codex a safe path for legacy AJAX without duplicating business logic. |

### Updated Artifacts

- `SKILL.md`
- `references/plugin-architecture.md`
- `references/implementation-patterns.md`
- `references/review-checklists.md`
- `references/performance-and-security.md`

## UI/UX Pro And WPDS Fusion Addition

### Objective

Improve the WordPress UI/UX guidance by synthesizing product-grade UI/UX reasoning from `nextlevelbuilder/ui-ux-pro-max-skill` with WordPress-native WPDS guidance from `WordPress/agent-skills`.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Dedicated WordPress UI/UX pro reference | Yes | Add | It gives Codex a product UX quality bar without turning every UI task into generic design advice. |
| Fuse with WPDS rather than replace it | Yes | Add | Product-grade UX and WordPress-native components solve different parts of the problem. |
| Copy full UI/UX data tables | No | Reject | The data set is large and not WordPress-specific; a distilled decision framework is more token-efficient. |
| Introduce Tailwind/shadcn defaults | No | Reject | WordPress admin/editor UI should map to WPDS first unless the project already uses another app stack. |

### Added Artifact

- `references/ui-ux-pro-for-wordpress.md`

### Source Repositories Reviewed

- UI/UX Pro Max skill: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/
- WordPress agent skills WPDS skill: https://github.com/WordPress/agent-skills/tree/trunk/skills/wpds

## Editor UI Placement Addition

### Objective

Add guidance for choosing the right WordPress editor UI surface: meta boxes for classic editor post-edit metadata, document settings panels for block editor document-level settings, and inspector/block panels for block-specific controls.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Explicit editor surface rule | Yes | Add | It prevents generic admin UI from landing in the wrong editor surface and improves editor-native UX. |
| Always use meta boxes | No | Reject | Meta boxes are appropriate for classic editor and legacy compatibility, but block editor has better native panel surfaces. |
| Always use document panels | No | Reject | Block-specific settings belong with the block, not in the document sidebar. |

### Updated Artifacts

- `SKILL.md`
- `references/admin-ux-and-ui.md`
- `references/theme-and-block-editor.md`
- `references/ui-ux-pro-for-wordpress.md`
- `references/wordpress-design-system.md`

### Block Editor Meta Box Constraint

- New meta boxes should not be shown in the block editor.
- If post metadata UI is needed in the block editor, use a document settings panel for document-level data or a block inspector/panel for block-specific data.
- Keep meta boxes classic-editor-only unless an existing legacy integration requires compatibility.

## Delivery Excellence Optimization

### Objective

Consolidate delivery planning and execution expertise into one reference covering client requirements, PRDs, scope of work, technical estimates, milestones, Codex-aware buffers, mobile-first responsive architecture, token discipline, planning, confirmation gates, enterprise implementation choices, GitHub workflows, testing, and maintainable comments.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Dedicated delivery excellence reference | Yes | Add | Keeps requirements, estimates, execution discipline, testing, and GitHub workflow together instead of scattering them. |
| Mobile-first responsive architecture | Yes | Add | Frontend and customer-facing WordPress work must be designed from constrained viewports first. |
| Codex-aware estimation with buffer | Yes | Add | Gives realistic estimates that account for AI acceleration and remaining validation/review risk. |
| Confirmation before done | Yes | Add | Prevents premature completion claims by requiring evidence and known-gap reporting. |
| Enterprise GitHub workflow standards | Yes | Add | Issues, labels, milestones, PR descriptions, commits, review replies, and release notes should match enterprise delivery quality. |
| Always verbose comments | No | Refine | Comments should explain why and document contracts, not restate obvious code. |

### Added Artifact

- `references/delivery-excellence.md`

### Updated Artifacts

- `SKILL.md`
- `README.md`
- `agents/openai.yaml`
- `references/ui-ux-pro-for-wordpress.md`
- `references/standards-ci-github.md`
- `references/enterprise-architecture.md`

## Enterprise Operations And Hyper-Scale Additions

### Objective

Add the missing highest-priority enterprise/VIP operations expertise for WordPress properties serving very high traffic: observability and incident response, edge caching/CDN architecture, load testing/capacity planning, Enterprise Search/content scale, security operations/compliance, deployment/release resilience, content migration/editorial scale, and accessibility/i18n/global readiness.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Observability and incident response | Yes | Add | Million-visits-per-hour systems need SLOs, logs, metrics, traces, runbooks, and postmortems, not only code fixes. |
| Edge caching and CDN architecture | Yes | Add | Page cacheability and origin protection are core architectural requirements at VIP scale. |
| Load testing and capacity planning | Yes | Add | Launch readiness requires traffic models, realistic cache/origin assumptions, failure thresholds, and VIP coordination. |
| Enterprise Search and content scale | Yes | Add | Large content archives need search/index offload strategy instead of MySQL-heavy search/meta queries. |
| Security operations and compliance | Yes | Add | Enterprise clients need access governance, audit evidence, vulnerability handling, pen-test coordination, and privacy controls. |
| Deployment and release resilience | Yes | Add | High-traffic releases require artifacts, feature flags, rollback, migration safety, smoke checks, and communication discipline. |
| Content migration and editorial scale | Yes | Add | Large migrations need data integrity, redirects, media strategy, editorial workflow continuity, and cutover planning. |
| Accessibility, i18n, and global readiness | Yes | Add | Enterprise WordPress must support WCAG-aligned UX, translations, RTL, multilingual SEO, and locale-aware behavior. |
| One giant operations manual | No | Reject | A giant file would waste tokens. Focused references preserve the compact router model. |
| Hard-code all VIP limits forever | No | Refine | VIP policies and limits change; references include stable patterns and source anchors to verify current details. |

### Added Artifacts

- `references/observability-incident-response.md`
- `references/edge-caching-cdn-architecture.md`
- `references/load-testing-capacity-planning.md`
- `references/enterprise-search-content-scale.md`
- `references/security-operations-compliance.md`
- `references/deployment-release-resilience.md`
- `references/content-migration-editorial-scale.md`
- `references/accessibility-i18n-global-readiness.md`

### Updated Artifacts

- `SKILL.md`: added new enterprise/VIP routes while keeping the main skill as a compact router.
- `README.md`: documented the expanded coverage.
- `agents/openai.yaml`: refreshed user-facing metadata and default prompt.
- `PLANNING_REPORT.md`: recorded the add/skip rationale and current source anchors.

### Additional Source Anchors Checked

- VIP performance overview: https://docs.wpvip.com/performance/
- VIP Insights & Metrics: https://docs.wpvip.com/performance/insights-metrics/
- VIP New Relic: https://docs.wpvip.com/performance/new-relic/
- VIP logs overview: https://docs.wpvip.com/logs/
- VIP Runtime Logs: https://docs.wpvip.com/logs/runtime-logs/
- VIP Log Shipping: https://docs.wpvip.com/logs/log-shipping/
- VIP caching overview: https://docs.wpvip.com/technical-references/caching/
- VIP page cache: https://docs.wpvip.com/caching/page-cache/
- VIP object cache: https://docs.wpvip.com/caching/object-cache/
- VIP static asset caching: https://docs.wpvip.com/caching/static-asset-caching/
- VIP load testing: https://docs.wpvip.com/performance/load-testing/
- VIP Enterprise Search: https://docs.wpvip.com/guidebooks/upgrade-elasticsearch/prepare-new-index/
- VIP Enterprise Search activation: https://docs.wpvip.com/enterprise-search/enable/
- VIP Enterprise Search indexing: https://docs.wpvip.com/enterprise-search/index/
- VIP security overview: https://docs.wpvip.com/security/
- VIP penetration testing: https://docs.wpvip.com/security/penetration-testing/
- VIP build and deploy: https://docs.wpvip.com/code-deployment/default-deployment/build-and-deploy/
- VIP import command: https://docs.wpvip.com/vip-cli/commands/import/
- VIP database imports: https://docs.wpvip.com/databases/import/import-with-vip-cli/
- VIP custom WP-CLI commands at scale: https://docs.wpvip.com/vip-cli/wp-cli-with-vip-cli/cli-commands-at-scale/
- WordPress Accessibility Coding Standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/accessibility/
- WordPress theme internationalization: https://developer.wordpress.org/themes/advanced-topics/internationalization/

### Enterprise Ops Validation Results

- `quick_validate.py wp-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wp-expert`: passed, confirming the installed symlink resolves correctly.
- `bash -n wp-expert/scripts/wp-context.sh`: passed.
- `bash -n wp-expert/scripts/wp-validate.sh`: passed.
- `bash wp-expert/scripts/wp-context.sh .`: passed and confirmed the repo context plus changed/untracked files.
- `bash wp-expert/scripts/wp-validate.sh .`: passed; no PHP/JS files or GitHub Actions workflows exist in this skill repo.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, and `wp-expert/`: passed.

## React With WordPress Enterprise Standards Addition

### Objective

Add first-class expertise for using React inside WordPress with enterprise standards across admin apps, block editor UI, frontend interactive blocks, headless/decoupled boundaries, data stores, REST contracts, build tooling, accessibility, performance, security, testing, and release artifacts.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Dedicated React with WordPress playbook | Yes | Add | React in WordPress has unique runtime, dependency, REST, editor, and release-artifact constraints that generic React guidance misses. |
| WordPress-provided React/dependency extraction guidance | Yes | Add | Prevents duplicate React bundles, broken dependency handles, missing asset files, and inflated admin/editor payloads. |
| REST and `@wordpress/data` boundaries | Yes | Add | Enterprise React apps need stable server contracts, permission checks, pagination, errors, and scalable client state. |
| Interactivity API decision rule | Yes | Add | Frontend block interactivity should not default to a full React mount when WordPress-native interactivity is sufficient. |
| Accessibility/security/testing gates | Yes | Add | Enterprise React work must prove roles, a11y, build artifacts, dependency safety, and failure states, not only happy-path rendering. |
| Fold into build tooling only | No | Reject | Build tooling is necessary but not enough; React architecture spans UI, data, security, performance, and release review. |

### Added Artifact

- `references/react-wordpress-enterprise.md`

### Updated Artifacts

- `SKILL.md`: added React with WordPress to task classification and reference routing.
- `README.md`: documented enterprise React coverage.
- `agents/openai.yaml`: added React/admin app to the default invocation prompt.
- `PLANNING_REPORT.md`: recorded add/skip rationale and source anchors.

### Additional Source Anchors Checked

- WordPress package reference: https://developer.wordpress.org/block-editor/reference-guides/packages/
- `@wordpress/element`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-element/
- `@wordpress/components`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-components/
- `@wordpress/data`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/
- `@wordpress/api-fetch`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-api-fetch/
- `@wordpress/scripts`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/
- Dependency extraction webpack plugin: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-dependency-extraction-webpack-plugin/
- Interactivity API: https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/

### React WordPress Validation Results

- `quick_validate.py wp-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wp-expert`: passed, confirming the installed symlink resolves correctly.
- `bash -n wp-expert/scripts/wp-context.sh`: passed.
- `bash -n wp-expert/scripts/wp-validate.sh`: passed.
- `bash wp-expert/scripts/wp-validate.sh .`: passed; no PHP/JS files or GitHub Actions workflows exist in this skill repo.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, and `wp-expert/`: passed.

## Third-Party API Integration Expertise Addition

### Objective

Add first-class expertise for working with third-party APIs of any type by using current official documentation, user-provided specs, or discoverable API references. The skill should search for API docs when not provided and ask for docs/specs or missing contract details when reliable documentation cannot be found.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Dedicated third-party API integration playbook | Yes | Add | External integrations have provider-specific contracts, auth, rate limits, retries, webhooks, and operational failure modes that generic plugin guidance misses. |
| Documentation-first rule | Yes | Add | Prevents invented endpoints, stale assumptions, and unsafe implementations when provider APIs change. |
| Search-then-ask workflow | Yes | Add | Lets Codex find official docs when possible and ask the user for docs/specs when the API is private, missing, or ambiguous. |
| Protocol-agnostic coverage | Yes | Add | Enterprise WordPress work touches REST, GraphQL, SOAP/WSDL, XML-RPC, SDK-only APIs, webhooks, file/SFTP, and batch APIs. |
| Security and secret-handling gates | Yes | Add | API work often includes tokens, webhook secrets, PII, logs, cron args, and localized JS exposure risks. |
| Fold into performance/security only | No | Reject | Third-party integration needs its own route because docs discovery, auth flows, provider testing, and operational support are distinct workflows. |

### Added Artifact

- `references/third-party-api-integrations.md`

### Updated Artifacts

- `SKILL.md`: added third-party API integration to task classification and reference routing.
- `README.md`: documented third-party API coverage and default invocation.
- `agents/openai.yaml`: added third-party API integration to the default invocation prompt.
- `PLANNING_REPORT.md`: recorded add/skip rationale and source anchors.

### Additional Source Anchors Checked

- WordPress HTTP API: https://developer.wordpress.org/plugins/http-api/
- `wp_remote_request()`: https://developer.wordpress.org/reference/functions/wp_remote_request/
- WordPress REST API authentication: https://developer.wordpress.org/rest-api/using-the-rest-api/authentication/
- WordPress REST API global parameters: https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/
- OpenAPI Specification: https://spec.openapis.org/oas/latest.html
- OAuth 2.0 RFC 6749: https://www.rfc-editor.org/rfc/rfc6749
- GraphQL official docs: https://graphql.org/

### Third-Party API Validation Results

- `quick_validate.py wp-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wp-expert`: passed, confirming the installed symlink resolves correctly.
- `bash -n wp-expert/scripts/wp-context.sh`: passed.
- `bash -n wp-expert/scripts/wp-validate.sh`: passed.
- `bash wp-expert/scripts/wp-validate.sh .`: passed; no PHP/JS files or GitHub Actions workflows exist in this skill repo.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, and `wp-expert/`: passed.

## Runtime And Toolchain Version Policy Addition

### Objective

Add a durable rule that new minimum versions for PHP, Node, npm, Composer, databases, CI images, GitHub Actions, and other tools must be the lowest stable actively maintained non-EOL version that satisfies WordPress, host/VIP, dependency, and deployment constraints.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Dedicated runtime/toolchain version policy | Yes | Add | Version minimums affect security, supportability, CI reliability, hosting compatibility, and public-plugin backward compatibility. |
| Official lifecycle verification | Yes | Add | PHP, Node, database, npm, Composer, and action support windows change; the skill must verify current official lifecycle docs. |
| Lowest active stable baseline rule | Yes | Add | Avoids both obsolete/EOL versions and unnecessary bleeding-edge requirements. |
| Public-plugin migration caution | Yes | Add | Raising minimum versions can be a backward-compatibility break and should be planned, not silently shipped. |
| Update stale CI example versions | Yes | Add | Existing generic CI examples must not teach EOL Node/PHP choices. |
| Hard-code permanent version numbers only | No | Reject | Runtime lifecycles drift; permanent hard-coded versions would become incorrect. Use current examples plus verification instructions. |

### Added Artifact

- `references/runtime-toolchain-version-policy.md`

### Updated Artifacts

- `SKILL.md`: added runtime/toolchain version policy to classification, routing, and universal hard rules.
- `README.md`: documented version-policy coverage.
- `agents/openai.yaml`: added runtime/toolchain policy to the default invocation prompt.
- `references/build-tooling.md`: routed version decisions to the new policy.
- `references/standards-ci-github.md`: added version-policy guidance and refreshed CI example PHP/Node versions.
- `PLANNING_REPORT.md`: recorded add/skip rationale and source anchors.

### Additional Source Anchors Checked

- PHP supported versions: https://www.php.net/supported-versions.php
- Node.js releases: https://nodejs.org/en/about/previous-releases
- Node.js release schedule: https://github.com/nodejs/release#release-schedule
- WordPress requirements: https://wordpress.org/about/requirements/
- WordPress hosting server environment: https://make.wordpress.org/hosting/handbook/server-environment/
- Composer requirements: https://github.com/composer/composer#requirements
- npm support policy: https://github.com/npm/cli/wiki/Support-Policy
- MySQL Innovation and LTS releases: https://dev.mysql.com/doc/refman/9.7/en/mysql-releases.html
- MariaDB maintenance policy: https://mariadb.org/about/#maintenance-policy

### Runtime Version Policy Validation Results

- `quick_validate.py wp-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wp-expert`: passed, confirming the installed symlink resolves correctly.
- `bash -n wp-expert/scripts/wp-context.sh`: passed.
- `bash -n wp-expert/scripts/wp-validate.sh`: passed.
- `bash wp-expert/scripts/wp-validate.sh .`: passed; no PHP/JS files or GitHub Actions workflows exist in this skill repo.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, and `wp-expert/`: passed.

## Changelog And Release Notes Expertise Addition

### Objective

Add first-class expertise for writing WordPress/product changelogs and release notes, including the rule that fixes and improvements to unreleased features should be folded into the original `Added` entry instead of creating fake `Improved` or `Fixed` entries.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Dedicated changelog/release-notes playbook | Yes | Add | Changelog quality directly affects client communication, WordPress.org releases, GitHub releases, and upgrade confidence. |
| Unreleased feature aggregation rule | Yes | Add | Prevents noise and misleading fixed/improved entries for behavior users never received. |
| Release-state matrix | Yes | Add | Beta, client preview, feature flags, internal QA, and public release all need different treatment. |
| WordPress.org readme guidance | Yes | Add | WordPress plugin changelogs must account for readme parsing, stable tag behavior, validator usage, and readme size. |
| Audience-based categories | Yes | Add | WordPress products need user/admin/developer/operator/security/migration notes, not just raw commit types. |
| Dump git log into changelog | No | Reject | Changelogs should be outcome-based, verified from diffs/PRs/tags, and written for the release audience. |

### Added Artifact

- `references/changelog-release-notes.md`

### Updated Artifacts

- `SKILL.md`: added changelog/release notes to task classification and reference routing.
- `README.md`: documented changelog/release-notes coverage and default invocation.
- `agents/openai.yaml`: added changelog/release notes to the default invocation prompt.
- `references/plugin-guidelines-review.md`: corrected plugin readme anchor and linked changelog wording guidance.
- `references/standards-ci-github.md`: routed release workflow changelog work to the new reference.
- `references/delivery-excellence.md`: added changelog/release-note routing for delivery workflow.
- `PLANNING_REPORT.md`: recorded add/skip rationale and source anchors.

### Additional Source Anchors Checked

- WordPress plugin readmes: https://developer.wordpress.org/plugins/wordpress-org/how-your-readme-txt-works/
- WordPress plugin readme file standard: https://wordpress.org/plugins/developers/#readme
- Official WordPress readme validator: https://wordpress.org/plugins/developers/readme-validator/
- Keep a Changelog: https://keepachangelog.com/en/1.1.0/
- Semantic Versioning: https://semver.org/

### Changelog Release Notes Validation Results

- `quick_validate.py wp-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wp-expert`: passed, confirming the installed symlink resolves correctly.
- `bash -n wp-expert/scripts/wp-context.sh`: passed.
- `bash -n wp-expert/scripts/wp-validate.sh`: passed.
- `bash wp-expert/scripts/wp-validate.sh .`: passed; no PHP/JS files or GitHub Actions workflows exist in this skill repo.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, and `wp-expert/`: passed.

## Release Contract Compatibility Policy Addition

### Objective

Add expertise to prevent unnecessary backward-compatibility shims for unreleased in-progress feature shapes. Compatibility should protect launched/public contracts and real production/client data, not temporary implementation details created while a feature is being reworked before first launch or before the next release ships.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Dedicated release-contract compatibility playbook | Yes | Add | Prevents over-engineering shims, migrations, fallback reads, route aliases, and tests for draft feature shapes that users never received. |
| Release-state matrix | Yes | Add | Internal QA, private preview, public beta/RC, production feature flags, and stable releases require different compatibility decisions. |
| WordPress contract-surface checklist | Yes | Add | Options, meta keys, custom tables, REST routes, hooks, blocks, shortcodes, WP-CLI, template paths, asset handles, and docs can all become released contracts. |
| Cross-link from architecture and implementation references | Yes | Add | The broad "preserve backward compatibility" rule needs narrower release-contract context at implementation time. |
| Always preserve every previous local shape | No | Reject | Draft shapes from unlaunched features should be deleted or replaced cleanly before launch. |
| Always ignore preview/beta/flagged data | No | Reject | If real users, client preview environments, public testers, or production flags consumed it, compatibility or migration may be required. |

### Added Artifact

- `references/release-contract-compatibility.md`

### Updated Artifacts

- `SKILL.md`: added release contract/backward compatibility to task classification, reference routing, and hard rules.
- `README.md`: documented release-contract compatibility coverage and default invocation.
- `agents/openai.yaml`: added release compatibility policy to the default invocation prompt.
- `references/enterprise-architecture.md`: narrowed the principal compatibility default and routed compatibility decisions to the new reference.
- `references/implementation-patterns.md`: added a pre-pattern compatibility decision gate.
- `references/delivery-excellence.md`: added release-state checks to planning and implementation choice criteria.
- `references/changelog-release-notes.md`: connected unreleased feature changelog rules with compatibility-shim rules.
- `PLANNING_REPORT.md`: recorded add/skip rationale and validation results.

### Release Contract Compatibility Validation Results

- `quick_validate.py wp-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wp-expert`: passed, confirming the installed symlink resolves correctly.
- `bash -n wp-expert/scripts/wp-context.sh`: passed.
- `bash -n wp-expert/scripts/wp-validate.sh`: passed.
- `bash wp-expert/scripts/wp-validate.sh .`: passed; no PHP/JS files or GitHub Actions workflows exist in this skill repo.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, and `wp-expert/`: passed.

## Duplicate Code, Modularity, And Testability Review Addition

### Objective

Add first-class expertise for reviewing duplicate code and improving modularity, test coverage, simplicity, reliability, and maintainability in WordPress codebases.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Dedicated duplicate-code/modularity review playbook | Yes | Add | Duplicate logic drifts quickly across WordPress hooks, routes, settings, queries, provider clients, and tests. |
| WordPress duplication hotspots | Yes | Add | WordPress projects often repeat hooks, REST/AJAX paths, option/meta access, cache keys, block defaults, and provider clients. |
| Extraction decision rules | Yes | Add | Prevents over-abstraction while keeping real shared responsibilities testable and maintainable. |
| Test strategy for refactors | Yes | Add | Duplicate-code cleanup should increase behavior-level coverage and reduce brittle fixture drift. |
| Tooling guidance | Yes | Add | Uses existing tools first and recommends duplicate/complexity tooling only when signal is useful. |
| Refactor every similar block | No | Reject | Similar syntax is not enough; abstraction can hide domain differences and reduce simplicity. |

### Added Artifact

- `references/duplicate-code-modularity-review.md`

### Updated Artifacts

- `SKILL.md`
- `README.md`
- `agents/openai.yaml`
- `references/review-checklists.md`
- `references/implementation-patterns.md`
- `references/delivery-excellence.md`
- `references/standards-ci-github.md`
- `PLANNING_REPORT.md`

### Additional Source Anchors Checked

- WordPress PHP coding standards: https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/
- WordPress PHPUnit testing: https://make.wordpress.org/core/handbook/testing/automated-testing/phpunit/
- Writing WordPress PHPUnit tests: https://make.wordpress.org/core/handbook/testing/automated-testing/writing-phpunit-tests/
- PHP Mess Detector rules: https://phpmd.org/rules/index.html
- PHP Copy/Paste Detector: https://phpqa.io/projects/phpcpd.html
- jscpd duplicate detector: https://jscpd.dev/
- ESLint rules reference: https://eslint.org/docs/latest/rules/

### Duplicate Code Modularity Validation Results

- `SKILL.md` description length check: passed at 590 characters.
- `quick_validate.py wp-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wp-expert`: passed, confirming the installed symlink resolves correctly.
- `bash -n wp-expert/scripts/wp-context.sh`: passed.
- `bash -n wp-expert/scripts/wp-validate.sh`: passed.
- `bash wp-expert/scripts/wp-validate.sh .`: passed; no PHP/JS files or GitHub Actions workflows exist in this skill repo.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, and `wp-expert/`: passed.
- Reference count: 32 markdown reference files.
- Route search confirmed duplicate-code/modularity guidance is wired into `README.md`, `SKILL.md`, `agents/openai.yaml`, and relevant references.

## Skill Rename To wp-expert

### Objective

Rename the installed Codex skill identity to `wp-expert` so the folder name, frontmatter name, default invocation, helper script examples, and local symlink all use the shorter skill name.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Rename folder and frontmatter together | Yes | Add | Codex discovery should see one consistent skill identity instead of mismatched metadata and folder paths. |
| Update default invocation to `$wp-expert` | Yes | Add | The invocation users type should match the new skill name. |
| Update local symlink | Yes | Add | Local Codex usage should resolve immediately without depending on the old path. |
| Keep the old long-form symlink | No | Reject | Keeping both paths can create duplicate or confusing skill discovery. |

### Updated Artifacts

- `wp-expert/SKILL.md`
- `wp-expert/agents/openai.yaml`
- `wp-expert/references/validation-commands.md`
- `wp-expert/scripts/wp-context.sh`
- `README.md`
- `PLANNING_REPORT.md`
- Local symlink: `/Users/mehulgohil/.codex/skills/wp-expert`

### Validation Results

- `SKILL.md` frontmatter name check: passed with `name: wp-expert`.
- `SKILL.md` description length check: passed at 590 characters.
- `quick_validate.py wp-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wp-expert`: passed, confirming the installed symlink resolves correctly.
- `bash -n wp-expert/scripts/wp-context.sh`: passed.
- `bash -n wp-expert/scripts/wp-validate.sh`: passed.
- `bash wp-expert/scripts/wp-context.sh .`: passed and confirmed the renamed repo context.
- `bash wp-expert/scripts/wp-validate.sh .`: passed; no PHP/JS files or GitHub Actions workflows exist in this skill repo.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, and `wp-expert/`: passed.
- Stale skill slug scan: passed.
- Reference count: 32 markdown reference files.
- Local symlink now resolves at `/Users/mehulgohil/.codex/skills/wp-expert`; the old long-form symlink is absent.

## WP Contributor Skill Addition

### Objective

Add a second skill named `wp-contributor` for official WordPress project contribution work across Core, Meta, Gutenberg, Trac, GitHub PRs, patches, testing, docs, triage, release/backport work, and contributor communication.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Separate `wp-contributor` skill | Yes | Add | Official WordPress contribution has different source-of-truth, etiquette, patch, ticket, and release rules than client/plugin implementation work. |
| Compact router plus references | Yes | Add | Keeps invocation efficient while still covering Core, Meta, Gutenberg, Trac, testing, standards, docs, props, and release workflows. |
| Core workflow reference | Yes | Add | Core uses trunk-first patches, SVN-backed history, Core Trac, and GitHub PR linkage rules that generic WordPress engineering misses. |
| Meta workflow reference | Yes | Add | WordPress.org and WordCamp.org projects have distinct production, privacy, deployment, and environment constraints. |
| Gutenberg workflow reference | Yes | Add | Block editor work uses GitHub-first issue/PR practices and package-specific tests while still affecting Core release behavior. |
| Triage and communication playbook | Yes | Add | Maintainer-ready comments, reproduction evidence, keywords, labels, and patch refreshes are central to upstream acceptance. |
| Validation and standards references | Yes | Add | Contribution work needs repo-native tests, coding standards, inline docs, props, dev-note awareness, and accessibility/i18n/performance checks. |
| Security/release reference | Yes | Add | Public issue creation can be harmful for vulnerabilities, and release phase changes require special caution. |
| Bundle every handbook page into the skill | No | Reject | Official docs change. The skill should route to current official anchors instead of duplicating the whole handbook. |

### Added Artifacts

- `wp-contributor/SKILL.md`
- `wp-contributor/agents/openai.yaml`
- `wp-contributor/references/official-anchors.md`
- `wp-contributor/references/contribution-map.md`
- `wp-contributor/references/core-workflow.md`
- `wp-contributor/references/meta-workflow.md`
- `wp-contributor/references/gutenberg-workflow.md`
- `wp-contributor/references/trac-github-triage.md`
- `wp-contributor/references/testing-validation.md`
- `wp-contributor/references/standards-docs-props.md`
- `wp-contributor/references/release-backport-security.md`
- `wp-contributor/scripts/wp-contrib-context.sh`

### Updated Artifacts

- `README.md`
- `PLANNING_REPORT.md`
- Local symlink: `/Users/mehulgohil/.codex/skills/wp-contributor`

### Source Anchors Checked

- Core Contributor Handbook: https://make.wordpress.org/core/handbook/
- Contribute with Code: https://make.wordpress.org/core/handbook/contribute/
- Core Getting Started: https://make.wordpress.org/core/handbook/tutorials/getting-started/
- Core Git repository workflow: https://make.wordpress.org/core/handbook/contribute/git/
- Core GitHub PR workflow: https://make.wordpress.org/core/handbook/contribute/git/github-pull-requests-for-code-review/
- Core Trac: https://make.wordpress.org/core/handbook/contribute/trac/
- Trac workflow keywords: https://make.wordpress.org/core/handbook/contribute/trac/keywords/
- Core writing patches: https://make.wordpress.org/core/handbook/best-practices/writing-patches/
- Core commit messages: https://make.wordpress.org/core/handbook/best-practices/commit-messages/
- Core PHPUnit testing: https://make.wordpress.org/core/handbook/testing/automated-testing/phpunit/
- Meta Handbook: https://make.wordpress.org/meta/handbook/
- Meta Getting Started: https://make.wordpress.org/meta/handbook/getting-started/
- Meta setup: https://make.wordpress.org/meta/handbook/getting-started/contribute-with-code/setting-up-your-machine/
- Gutenberg Contributor Guide: https://developer.wordpress.org/block-editor/contributors/
- Gutenberg Code Contributions: https://developer.wordpress.org/block-editor/contributors/code/
- Security reporting: https://make.wordpress.org/core/handbook/testing/reporting-security-vulnerabilities/

### Validation Results

- `SKILL.md` frontmatter checks: passed for `wp-expert` and `wp-contributor`.
- `wp-contributor` description length check: passed at 492 characters.
- `quick_validate.py wp-contributor`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wp-contributor`: passed, confirming the installed symlink resolves correctly.
- `quick_validate.py wp-expert`: passed, confirming the existing skill remains valid.
- `bash -n wp-contributor/scripts/wp-contrib-context.sh`: passed.
- `bash wp-contributor/scripts/wp-contrib-context.sh .`: passed and safely reported this skill repo as an unknown contribution target.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, `wp-expert/`, and `wp-contributor/`: passed.
- `wp-contributor` reference count: 9 markdown reference files.
- Local symlink now resolves at `/Users/mehulgohil/.codex/skills/wp-contributor`.

## Ollie Block Theme Expertise Addition

### Objective

Add first-class Ollie block theme and Ollie Pro expertise to `wp-expert`, covering free Ollie, Ollie Pro, Site Editor workflows, child themes, block theme structure, design tokens, Pro pattern library, setup wizard, starter sites, extensions, Menu Designer, WooCommerce use cases, authentication, local/staging behavior, and troubleshooting.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Dedicated Ollie reference | Yes | Add | Ollie has product-specific workflows, Pro plugin behavior, design tokens, pattern library decisions, and auth/licensing concerns that generic block theme guidance misses. |
| Free and Pro split | Yes | Add | Free Ollie is a block theme; Ollie Pro is a premium plugin with cloud patterns, setup wizard, starter sites, extensions, and account/auth behavior. |
| Child-theme and style-override guidance | Yes | Add | Ollie docs describe child-theme blank JSON overrides for disabling built-in styles, and parent theme edits would be fragile. |
| Pattern library decision rules | Yes | Add | Pro patterns can be inserted, copied, favorited, or downloaded into `/patterns`; each path has different maintenance and version-control implications. |
| Security guidance for Pro auth | Yes | Add | Site-wide authentication uses credentials in constants, so the skill must protect secrets and discourage committing credentials. |
| WooCommerce/Menu Designer coverage | Yes | Add | Ollie Pro increasingly targets WooCommerce and native block navigation workflows, which require accessibility, responsive, and conversion QA. |
| Hard-code all current style hex values | No | Reject | Active theme version/style variation can change; use current installed `theme.json` and docs instead of bloating the skill with volatile palettes. |

### Added Artifact

- `wp-expert/references/ollie-block-theme.md`

### Updated Artifacts

- `wp-expert/SKILL.md`
- `wp-expert/agents/openai.yaml`
- `wp-expert/references/theme-and-block-editor.md`
- `README.md`
- `PLANNING_REPORT.md`

### Source Anchors Checked

- Ollie Docs: https://olliewp.com/docs/
- Getting Started: https://olliewp.com/docs/ollie-block-theme/getting-started/
- WordPress Block Themes: https://olliewp.com/docs/ollie-block-theme/wordpress-block-theme/
- Block Theme Structure: https://olliewp.com/docs/ollie-block-theme/block-theme-structure/
- Ollie Color Palette: https://olliewp.com/docs/ollie-block-theme/ollie-color-palette/
- Disable Ollie Styles: https://olliewp.com/docs/ollie-block-theme/disable-ollie-styles/
- Ollie Pro intro: https://olliewp.com/docs/ollie-pro/
- Ollie Pro Dashboard: https://olliewp.com/docs/ollie-pro/ollie-pro-dashboard/
- Ollie Pro Pattern Library: https://olliewp.com/docs/ollie-pro/ollie-pro-pattern-library/
- Ollie Pro Extensions: https://olliewp.com/docs/ollie-pro/ollie-pro-extensions/
- Site-Wide Authentication: https://olliewp.com/docs/ollie-pro/site-wide-authentication/
- Ollie Pro Local/Staging: https://olliewp.com/docs/ollie-pro/using-ollie-pro-on-local-and-staging-sites/
- Ollie on WordPress.org: https://wordpress.org/themes/ollie/
- Ollie Pro page: https://olliewp.com/pro/
- Ollie WP vs Ollie Pro: https://olliewp.com/olliewp-vs-ollie-pro/
- Menu Designer: https://olliewp.com/menu-designer/
- Ollie for WooCommerce: https://olliewp.com/ollie-for-woocommerce
- New Ollie Pattern Library and Ollie AI: https://olliewp.com/introducing-the-new-and-improved-ollie-pattern-library/

### Validation Results

- `SKILL.md` frontmatter check: passed with `name: wp-expert`.
- `SKILL.md` description length check: passed at 619 characters.
- `quick_validate.py wp-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wp-expert`: passed, confirming the installed symlink resolves correctly.
- `quick_validate.py wp-contributor`: passed, confirming the additional repo skill remains valid.
- `bash -n wp-expert/scripts/wp-context.sh`: passed.
- `bash -n wp-expert/scripts/wp-validate.sh`: passed.
- `bash wp-expert/scripts/wp-validate.sh .`: passed; no PHP/JS files or GitHub Actions workflows exist in this skill repo.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, `wp-expert/`, and `wp-contributor/`: passed.
- `wp-expert` reference count: 33 markdown reference files.
- Route search confirmed Ollie guidance is wired into `README.md`, `SKILL.md`, `agents/openai.yaml`, and theme guidance.

## Blocksy Theme Expertise Addition

### Objective

Add first-class Blocksy theme and Blocksy Pro expertise to `wp-expert`, covering free Blocksy, Blocksy Companion, Blocksy Pro, Customizer workflows, header/footer builders, starter sites, Content Blocks, Dynamic Data, Post Types Extra, Shop Extra/WooCommerce, Advanced Menu, Pro extensions, licensing, local/staging, multisite, developer hooks, snippets, and troubleshooting.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Dedicated Blocksy reference | Yes | Add | Blocksy is Customizer/header-footer-builder centric and has product-specific Companion/Pro modules that generic theme guidance misses. |
| Free, Companion, and Pro split | Yes | Add | The theme, free companion plugin, and Companion Pro plugin have different responsibilities, dependencies, and licensing constraints. |
| Content Blocks and Dynamic Data guidance | Yes | Add | Blocksy Pro uses Content Blocks, hooks, conditions, Dynamic Data, and Post Types Extra for template-like and dynamic layouts. |
| Shop Extra/WooCommerce route | Yes | Add | Blocksy Pro has a deep WooCommerce module surface that needs conversion, accessibility, mobile, AJAX, and performance validation. |
| License/local/staging/multisite guidance | Yes | Add | Blocksy Pro licensing, development domains, and multisite seats can affect delivery and deployment planning. |
| Treat Blocksy as a pure block theme | No | Reject | Blocksy is Gutenberg-friendly but Customizer/theme-builder centric, so Site Editor assumptions would lead to wrong implementation choices. |
| Put all feature tables into SKILL.md | No | Reject | The details are product-specific and drift-prone; a focused reference keeps runtime context efficient. |

### Added Artifact

- `wp-expert/references/blocksy-theme.md`

### Updated Artifacts

- `wp-expert/SKILL.md`
- `wp-expert/agents/openai.yaml`
- `wp-expert/references/theme-and-block-editor.md`
- `README.md`
- `PLANNING_REPORT.md`

### Source Anchors Checked

- Blocksy docs: https://creativethemes.com/blocksy/docs/
- Installing Blocksy: https://creativethemes.com/blocksy/docs/general/install-blocksy-theme/
- Theme Options intro: https://creativethemes.com/blocksy/docs/theme-options/theme-options-intro/
- Blocksy Dashboard: https://creativethemes.com/blocksy/docs/getting-started/blocksy-dashboard/
- Manage Options: https://creativethemes.com/blocksy/docs/general-options/manage-options/
- Blocksy Companion: https://creativethemes.com/blocksy/companion/
- Starter Sites: https://creativethemes.com/blocksy/starter-sites/
- Premium features: https://creativethemes.com/blocksy/premium/
- Upgrade to Blocksy Pro: https://creativethemes.com/blocksy/docs/general/install-activate-blocksy-companion-pro/
- Blocksy Pro Plans: https://creativethemes.com/blocksy/docs/general/blocksy-pro-plans-comparison/
- Licence Utilisation: https://creativethemes.com/blocksy/docs/general/licence-utilisation/
- Header Builder elements: https://creativethemes.com/blocksy/docs/header-elements/header-builder-elements/
- Footer introduction: https://creativethemes.com/blocksy/docs/footer-elements/footer-introduction/
- Extensions overview: https://creativethemes.com/blocksy/docs/extensions/extensions-general/
- Content Blocks Hooks: https://creativethemes.com/blocksy/docs/modules/content-blocks/
- Conditional Module: https://creativethemes.com/blocksy/docs/modules/conditions-module/
- Theme Blocks intro: https://creativethemes.com/blocksy/docs/theme-blocks/theme-blocks-getting-started/
- Dynamic Data: https://creativethemes.com/blocksy/docs/theme-blocks/dynamic-data/
- Post Types Extra: https://creativethemes.com/blocksy/docs/extensions/post-types-extra/
- Shop Extra: https://creativethemes.com/blocksy/docs/extensions/woocommerce-extra/
- Quick View: https://creativethemes.com/blocksy/docs/woocommerce/quick-view/
- Floating Cart: https://creativethemes.com/blocksy/docs/woocommerce/floating-cart/
- Filters Canvas: https://creativethemes.com/blocksy/docs/woocommerce/off-canvas-filter/
- Custom Code Snippets: https://creativethemes.com/blocksy/docs/extensions/custom-code-snippets/
- Blocksy on WordPress.org: https://wordpress.org/themes/blocksy/

### Validation Results

- `SKILL.md` frontmatter check: passed with `name: wp-expert`.
- `SKILL.md` description length check: passed at 646 characters.
- `quick_validate.py wp-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wp-expert`: passed, confirming the installed symlink resolves correctly.
- `quick_validate.py wp-contributor`: passed, confirming the additional repo skill remains valid.
- `bash -n wp-expert/scripts/wp-context.sh`: passed.
- `bash -n wp-expert/scripts/wp-validate.sh`: passed.
- `bash wp-expert/scripts/wp-validate.sh .`: passed; no PHP/JS files or GitHub Actions workflows exist in this skill repo.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, `wp-expert/`, and `wp-contributor/`: passed.
- `wp-expert` reference count: 34 markdown reference files.
- Route search confirmed Blocksy guidance is wired into `README.md`, `SKILL.md`, `agents/openai.yaml`, and theme guidance.

## Gutenberg Project Contribution Guidelines Addition

### Objective

Strengthen `wp-contributor` for `wordpress/gutenberg` contribution work so Codex follows Gutenberg's current contribution guidelines, repository-management expectations, branch/rebase workflow, PR discipline, testing strategy, accessibility requirements, React Native/mobile parity checks, and package-boundary rules.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Dedicated Gutenberg contribution guideline expansion | Yes | Add | Gutenberg uses GitHub-first issue, PR, label, milestone, review, package, and CI workflows that differ from Core Trac-first contribution work. |
| Official anchor expansion | Yes | Add | Current `CONTRIBUTING.md`, code contribution, git workflow, repository management, coding, testing, accessibility, and React Native docs are the right process anchors. |
| Branch/rebase and PR discipline guidance | Yes | Add | Gutenberg expects focused feature branches, PR updates on the same branch, and rebasing onto `trunk` for merge readiness. |
| Label, milestone, and triage guidance | Yes | Add | Issues and PRs rely on actionable scope, current labels, milestones, and project context; the skill should recommend these without overclaiming permissions. |
| Package-boundary and public API rules | Yes | Add | Gutenberg is a monorepo with `@wordpress/*` packages, downstream consumers, public APIs, deprecations, and release implications. |
| Accessibility and React Native parity checks | Yes | Add | Official guidelines call out accessibility testing and native-file parity when changes affect shared names or mobile editor behavior. |
| Hard-code exact npm commands as permanent truth | No | Reject | Scripts and tool versions drift; the skill now directs Codex to inspect current `package.json`, `.nvmrc`, and docs before giving exact commands. |
| Duplicate the entire Gutenberg handbook | No | Reject | Full handbook duplication would waste tokens and become stale; focused guidance plus official anchors is more durable and efficient. |

### Updated Artifacts

- `wp-contributor/SKILL.md`
- `wp-contributor/agents/openai.yaml`
- `wp-contributor/references/gutenberg-workflow.md`
- `wp-contributor/references/official-anchors.md`
- `README.md`
- `PLANNING_REPORT.md`

### Source Anchors Checked

- Gutenberg repository: https://github.com/WordPress/gutenberg
- Gutenberg contributing guidelines: https://github.com/WordPress/gutenberg/blob/trunk/CONTRIBUTING.md
- Gutenberg code contribution docs: https://github.com/WordPress/gutenberg/blob/trunk/docs/contributors/code/README.md
- Gutenberg Git workflow: https://github.com/WordPress/gutenberg/blob/trunk/docs/contributors/code/git-workflow.md
- Gutenberg repository management: https://github.com/WordPress/gutenberg/blob/trunk/docs/contributors/repository-management.md
- Gutenberg coding guidelines: https://github.com/WordPress/gutenberg/blob/trunk/docs/contributors/code/coding-guidelines.md
- Gutenberg testing overview: https://github.com/WordPress/gutenberg/blob/trunk/docs/contributors/code/testing-overview.md
- Gutenberg accessibility testing: https://github.com/WordPress/gutenberg/blob/trunk/docs/contributors/accessibility-testing.md
- Gutenberg React Native mobile editor docs: https://github.com/WordPress/gutenberg/tree/trunk/docs/contributors/code/react-native

### Validation Results

- `SKILL.md` frontmatter checks: passed for `wp-contributor` and `wp-expert`.
- `wp-contributor` description length check: passed at 492 characters.
- `wp-expert` description length check: passed at 646 characters.
- `quick_validate.py wp-contributor`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wp-contributor`: passed, confirming the installed symlink resolves correctly.
- `quick_validate.py wp-expert`: passed, confirming the existing skill remains valid.
- `bash -n wp-contributor/scripts/wp-contrib-context.sh`: passed.
- `bash wp-contributor/scripts/wp-contrib-context.sh .`: passed and safely reported this skill repo as an unknown contribution target.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, `wp-expert/`, and `wp-contributor/`: passed.
- Route search confirmed Gutenberg guidance is wired into `README.md`, `SKILL.md`, `agents/openai.yaml`, `official-anchors.md`, and `gutenberg-workflow.md`.

## Shared Research Token Discipline Addition

### Objective

Add a focused reusable reference that makes token-efficient reasoning, repository exploration, web search, source selection, validation, and output discipline explicit for both `wp-expert` and `wp-contributor`.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Shared `research-token-discipline.md` reference | Yes | Add | Both skills need the same research discipline, and a shared file avoids duplicated guidance drifting apart. |
| Router entries in both skills | Yes | Add | The behavior must be discoverable when either skill is active, without loading the reference unless the task needs research discipline. |
| Frontmatter trigger wording | Yes | Add | Adding token-efficient research/web search to both skill descriptions makes the behavior explicit to Codex skill selection. |
| Search budget defaults | Yes | Add | Concrete budgets help Codex stop researching after enough primary evidence and spend more context on implementation and validation. |
| Repo exploration discipline | Yes | Add | WordPress tasks frequently waste tokens on broad file dumps; targeted `rg`, small reads, and repo scripts are more efficient. |
| Validation and output discipline | Yes | Add | Token savings should not reduce correctness; the reference requires evidence before saying work is done. |
| Duplicate the same reference inside each skill | No | Reject | Duplication would increase maintenance cost and risk inconsistent behavior between `wp-expert` and `wp-contributor`. |
| Hard-code a universal web-search count for every task | No | Reject | Correct budget depends on risk, drift, source quality, and whether local repo facts already answer the question. |

### Added Artifact

- `shared/references/research-token-discipline.md`

### Updated Artifacts

- `wp-expert/SKILL.md`
- `wp-contributor/SKILL.md`
- `README.md`
- `PLANNING_REPORT.md`

### Validation Results

- `SKILL.md` frontmatter checks: passed for `wp-expert` and `wp-contributor`.
- `wp-expert` description length check: passed at 683 characters.
- `wp-contributor` description length check: passed at 529 characters.
- Shared reference path resolution from `wp-expert`: passed.
- Shared reference path resolution from `wp-contributor`: passed.
- Shared reference path resolution from installed `/Users/mehulgohil/.codex/skills/wp-expert`: passed.
- Shared reference path resolution from installed `/Users/mehulgohil/.codex/skills/wp-contributor`: passed.
- `quick_validate.py wp-expert`: passed.
- `quick_validate.py wp-contributor`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wp-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wp-contributor`: passed.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, `wp-expert/`, `wp-contributor/`, and `shared/`: passed.
- Route search confirmed `research-token-discipline.md` is wired into both skill routers and documented in `README.md`.

## Meta Handbook Expertise Addition

### Objective

Strengthen `wp-contributor` with focused Meta Handbook expertise for WordPress.org, WordCamp.org, Make sites, project routing, Meta Trac, project-specific GitHub repositories, SVN/Git patch flow, local environments, Slack escalation, contributor-day work, docs/testing contribution paths, privacy, cache, and admin/access boundaries.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Expanded Meta workflow reference | Yes | Add | Meta contribution work spans WordPress.org properties, WordCamp.org, Make sites, directories, profiles, badges, handbooks, and infrastructure with different rules than Core or Gutenberg. |
| Official Meta Handbook anchors | Yes | Add | The handbook is the current source for scope, projects, setup, Git, SVN, Slack, and access guidance. |
| Project routing checklist | Yes | Add | Meta work can live in Meta Trac, project GitHub repos, SVN/Git mirrors, handbook pages, or project-specific environments. |
| Local environment guidance | Yes | Add | The handbook covers older VVV/WordPress Meta Environment paths, newer project-bundled environments, and Dockerized project environments; the skill must not assume one setup fits all projects. |
| Git/SVN patch discipline | Yes | Add | Meta projects are historically SVN-backed and often use Git locally with Trac patches, so patch root, `trunk`, and comment etiquette matter. |
| Access/admin boundaries | Yes | Add | GitHub organization, SVN, Slack, and app/admin changes require documented permissions and should be routed rather than promised. |
| Privacy/cache/deployment review points | Yes | Add | WordPress.org properties include profiles, badges, event data, moderation data, directories, search, navigation, and caches with public impact. |
| Copy the whole Meta Handbook | No | Reject | The handbook changes; the skill should provide a compact playbook and official anchors rather than duplicate full pages. |

### Updated Artifacts

- `wp-contributor/SKILL.md`
- `wp-contributor/references/meta-workflow.md`
- `wp-contributor/references/official-anchors.md`
- `wp-contributor/references/contribution-map.md`
- `wp-contributor/references/testing-validation.md`
- `wp-contributor/references/trac-github-triage.md`
- `README.md`
- `PLANNING_REPORT.md`

### Source Anchors Checked

- Meta Handbook: https://make.wordpress.org/meta/handbook/
- About the Meta Team: https://make.wordpress.org/meta/handbook/about/
- Meta Projects: https://make.wordpress.org/meta/handbook/about/projects/
- Meta Getting Started: https://make.wordpress.org/meta/handbook/getting-started/
- Meta Contribute with Code: https://make.wordpress.org/meta/handbook/getting-started/contribute-with-code/
- Meta Setup: https://make.wordpress.org/meta/handbook/getting-started/contribute-with-code/setting-up-your-machine/
- Meta Contribute with Testing: https://make.wordpress.org/meta/handbook/getting-started/contribute-with-testing/
- Meta Contribute with Docs: https://make.wordpress.org/meta/handbook/getting-started/contribute-with-docs/
- Meta Contributing with Git: https://make.wordpress.org/meta/handbook/tutorials-guides/contributing-with-git/
- Meta GitHub administration: https://make.wordpress.org/meta/handbook/tutorials-guides/github/
- Meta Slack guide: https://make.wordpress.org/meta/handbook/tutorials-guides/slack/
- Meta Subversion access: https://make.wordpress.org/meta/handbook/tutorials-guides/svn-access/

### Validation Results

- `SKILL.md` frontmatter checks: passed for `wp-contributor` and `wp-expert`.
- `wp-contributor` description length check: passed at 529 characters.
- `wp-expert` description length check: passed at 683 characters.
- `quick_validate.py wp-contributor`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wp-contributor`: passed.
- `quick_validate.py wp-expert`: passed.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, `wp-expert/`, `wp-contributor/`, and `shared/`: passed.
- Route search confirmed Meta Handbook guidance is wired into `README.md`, `SKILL.md`, `meta-workflow.md`, `official-anchors.md`, `contribution-map.md`, `testing-validation.md`, and `trac-github-triage.md`.

## Production Dependency Discipline Addition

### Objective

Add explicit shared expertise so both `wp-expert` and `wp-contributor` never ship development-specific Composer or npm packages to production while still allowing dev dependencies in source manifests, lockfiles, local environments, and CI build/test stages.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Shared production dependency reference | Yes | Add | Composer/npm production artifact rules apply to both client/product delivery and official contribution work, so shared guidance prevents drift. |
| Composer `require-dev` boundary | Yes | Add | Production `vendor/` must be created from `composer install --no-dev`; dev tools must not be runtime dependencies. |
| npm `devDependencies` boundary | Yes | Add | WordPress plugin/theme artifacts should ship built JS/CSS, not build/test tooling or `node_modules` unless explicitly required. |
| Runtime artifact checklist | Yes | Add | The rule must be validated at packaging/deploy time, not just stated in dependency manifests. |
| Skill router wiring in both skills | Yes | Add | Codex needs to load the same reference from either WordPress engineering or WordPress contribution mode. |
| Build/deploy and contribution validation reminders | Yes | Add | The rule is most likely to be missed in release, CI, deployment, and upstream packaging reviews. |
| Delete dev dependencies from source manifests | No | Reject | Dev dependencies are correct for local development and CI; the risk is shipping them in runtime artifacts. |
| Ban lockfiles because they mention dev packages | No | Reject | Lockfiles support reproducible builds and may record dev packages without installing them in production artifacts. |

### Added Artifact

- `shared/references/production-dependency-discipline.md`

### Updated Artifacts

- `wp-expert/SKILL.md`
- `wp-expert/agents/openai.yaml`
- `wp-expert/references/build-tooling.md`
- `wp-expert/references/deployment-release-resilience.md`
- `wp-contributor/SKILL.md`
- `wp-contributor/agents/openai.yaml`
- `wp-contributor/references/testing-validation.md`
- `README.md`
- `PLANNING_REPORT.md`

### Validation Results

- `SKILL.md` frontmatter checks: passed for `wp-expert` and `wp-contributor`.
- `wp-expert` description length check: passed at 714 characters.
- `wp-contributor` description length check: passed at 560 characters.
- Shared production dependency reference path resolution from repo and installed symlink paths: passed for both skills.
- `quick_validate.py wp-expert`: passed.
- `quick_validate.py wp-contributor`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wp-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wp-contributor`: passed.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, `wp-expert/`, `wp-contributor/`, and `shared/`: passed.
- Route search confirmed production dependency hygiene is wired into both skill routers, agent prompts, build/deploy references, contributor validation, README, and the shared reference.

## WordPress.org Release Operations Lessons Addition

### Objective

Add focused `wp-expert` expertise from the WordPress.org release lessons: SVN-first verification, production-only Composer vendor handling, first SVN commit timeout behavior, Plugin Check workflow fallback, 10up deploy rerun behavior, GitHub ZIP continuation, workflow modernization backlog, and `.wordpress-org` asset verification.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Dedicated WordPress.org release operations reference | Yes | Add | These lessons are operational and release-specific; a focused reference avoids bloating generic deployment or plugin-guideline files. |
| SVN-first release verification | Yes | Add | GitHub Actions can fail after the server-side SVN commit completed, so direct SVN checks prevent false rollback or retag decisions. |
| Verify `trunk/`, `tags/<version>/`, and `assets/` | Yes | Add | WordPress.org release state spans current trunk, immutable version tags, and plugin directory assets. |
| Production `vendor/` nuance | Yes | Add | WordPress.org users will not run Composer, so runtime Composer dependencies must ship, but only from production install boundaries. |
| First SVN commit timeout guidance | Yes | Add | Initial releases can add trunk, tag, assets, built files, and production vendor at once; timeout after data transfer is inconclusive. |
| 10up deploy rerun behavior | Yes | Add | If the tag already exists after a timeout, rerunning may no-op deploy and continue later release steps like GitHub ZIP upload. |
| Plugin Check explicit fallback | Yes | Add | `wordpress/plugin-check-action@v1` was unstable in the observed runner/Node setup; explicit Plugin Check with Node `24.15.0` and `@wordpress/env@11.6.0` is recorded as a proven fallback. |
| Workflow modernization backlog | Yes | Add | Deprecated `actions/upload-release-asset@v1` and nested action warnings should be tracked without blocking a verified release. |
| Treat observed Node/action versions as permanent global truth | No | Reject | They are project-proven release lessons, but future workflow modernization should revalidate current maintained versions. |

### Added Artifact

- `wp-expert/references/wordpress-org-release-operations.md`

### Updated Artifacts

- `wp-expert/SKILL.md`
- `wp-expert/agents/openai.yaml`
- `wp-expert/references/plugin-guidelines-review.md`
- `wp-expert/references/deployment-release-resilience.md`
- `shared/references/production-dependency-discipline.md`
- `README.md`
- `PLANNING_REPORT.md`

### Validation Results

- `SKILL.md` frontmatter checks: passed for `wp-expert` and `wp-contributor`.
- `wp-expert` description length check: passed at 748 characters.
- `wp-contributor` description length check: passed at 560 characters.
- `wordpress-org-release-operations.md` path resolution from repo and installed symlink paths: passed.
- `quick_validate.py wp-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wp-expert`: passed.
- `quick_validate.py wp-contributor`: passed.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, `wp-expert/`, `wp-contributor/`, and `shared/`: passed.
- Route search confirmed WordPress.org release operations are wired into `README.md`, `SKILL.md`, `agents/openai.yaml`, `plugin-guidelines-review.md`, `deployment-release-resilience.md`, `production-dependency-discipline.md`, and the new reference.

## Design-To-FSE Custom Block Theme Addition

### Objective

Strengthen `wp-expert` for building custom block-based Full Site Editing themes from provided designs, with modular admin-editable architecture, core-block-first mapping, no Custom HTML/Shortcode blocks for new design implementation, and clear rules for when a custom block is actually necessary.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Dedicated design-to-FSE reference | Yes | Add | The existing theme guidance lacked a concrete workflow for translating visual designs into editable block theme architecture. |
| Design-to-theme audit | Yes | Add | A successful FSE build needs templates, parts, patterns, tokens, content model, and interactions mapped before implementation. |
| Block mapping ladder | Yes | Add | Core blocks, `theme.json`, patterns, template parts, block styles, and variations should be exhausted before creating custom blocks. |
| No Custom HTML/Shortcode blocks rule | Yes | Add | These blocks undermine admin editability, validation, accessibility, and maintainability for new design implementation. |
| Custom block decision matrix | Yes | Add | Custom blocks are still needed for structured editing, dynamic data, interactions, constrained repeaters, and stable semantics. |
| Admin editability model | Yes | Add | The skill now distinguishes templates, template parts, patterns, synced patterns, locking, allowed blocks, and inspector/document settings. |
| Theme file architecture and validation checklist | Yes | Add | Durable FSE builds need clear file locations, editor/frontend parity checks, responsive QA, a11y checks, and release packaging checks. |
| Force every unique design section into a custom block | No | Reject | Many sections should be patterns or block styles so editors can keep using native WordPress controls. |
| Allow raw HTML or shortcodes for speed | No | Reject | It may appear faster, but it creates brittle, non-native, less editable themes and defeats the FSE goal. |

### Added Artifact

- `wp-expert/references/custom-block-theme-from-design.md`

### Updated Artifacts

- `wp-expert/SKILL.md`
- `wp-expert/agents/openai.yaml`
- `wp-expert/references/theme-and-block-editor.md`
- `README.md`
- `PLANNING_REPORT.md`

### Source Anchors Checked

- Theme Handbook: https://developer.wordpress.org/themes/
- Global Settings and Styles: https://developer.wordpress.org/themes/global-settings-and-styles/
- Global Settings and Styles overview: https://developer.wordpress.org/themes/core-concepts/global-settings-and-styles/
- Theme styles: https://developer.wordpress.org/themes/global-settings-and-styles/styles/
- Template parts: https://developer.wordpress.org/themes/templates/template-parts/
- Style variations: https://developer.wordpress.org/themes/global-settings-and-styles/style-variations/
- Block style variations: https://developer.wordpress.org/themes/features/block-style-variations/
- theme.json reference: https://developer.wordpress.org/block-editor/reference-guides/theme-json-reference/
- Create Block: https://developer.wordpress.org/block-editor/getting-started/devenv/get-started-with-create-block/

### Validation Results

- `SKILL.md` frontmatter checks: passed for `wp-expert` and `wp-contributor`.
- `wp-expert` description length check: passed at 776 characters.
- `wp-contributor` description length check: passed at 560 characters.
- `custom-block-theme-from-design.md` path resolution from repo and installed symlink paths: passed.
- `quick_validate.py wp-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wp-expert`: passed.
- `quick_validate.py wp-contributor`: passed.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, `wp-expert/`, `wp-contributor/`, and `shared/`: passed.
- Route search confirmed design-to-FSE guidance is wired into `README.md`, `SKILL.md`, `agents/openai.yaml`, `theme-and-block-editor.md`, and the new reference.

## Security And Performance Expertise Expansion

### Objective

Deepen `wp-expert` security and performance behavior for enterprise and WP VIP-style projects where sensitive endpoints, high-traffic pages, admin/editor performance, and production reliability require explicit threat models, measurable budgets, and negative tests.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Dedicated security threat-modeling reference | Yes | Add | The existing hardening checklist was useful but too compressed for high-risk REST/admin/upload/webhook/OAuth/MCP work. |
| Dedicated performance profiling and budgets reference | Yes | Add | Enterprise performance work needs baseline, budget, measurement, hot-path profiling, and re-measurement discipline. |
| Keep `performance-and-security.md` as quick triage | Yes | Keep and route | This preserves token efficiency while giving agents a deeper path when risk requires it. |
| Add test recipes for negative security cases | Yes | Add | Security work is not complete if denied, malformed, wrong-owner, replay, and redaction cases are untested. |
| Add performance review output template | Yes | Add | Performance findings need path, trigger, evidence, impact, fix, and BC risk rather than generic "optimize" advice. |
| Add hard-coded universal performance SLA values | No | Reject | Budgets must be calibrated to route, host, data volume, and project goals; the reference uses review triggers and measurement workflow. |

### Added Artifacts

- `wp-expert/references/security-threat-modeling-review.md`
- `wp-expert/references/performance-profiling-scale-budgets.md`

### Updated Artifacts

- `wp-expert/SKILL.md`
- `wp-expert/references/performance-and-security.md`
- `wp-expert/references/reference-routing-map.md`
- `wp-expert/references/review-checklists.md`
- `README.md`
- `QUICK_REFERENCE.md`
- `CHANGELOG.md`
- `skill-evals/wp-expert-scenarios.md`

## Database Table Architecture Review Addition

### Objective

Add focused `wp-expert` expertise for reviewing custom database table architecture from performance, scalability, maintainability, WordPress portability, migration, multisite, retention, privacy, and data-integrity standpoints.

### Standout Decision Review

| Addition | Will it stand out? | Decision | Reason |
| --- | --- | --- | --- |
| Dedicated custom table architecture reference | Yes | Add | Table review is broader than query performance; it needs schema ownership, lifecycle, migrations, retention, and maintainability guidance. |
| Query-to-index mapping checklist | Yes | Add | Enterprise review must prove indexes match real read paths rather than guessed columns. |
| Migration and lifecycle guidance | Yes | Add | Activation, upgrades, backfills, uninstall, and launched schema compatibility are common production failure points. |
| Multisite and `$wpdb->prefix` guidance | Yes | Add | Per-site vs network/global table choices are expensive to change later and affect cache keys, unique keys, exports, and repair commands. |
| Repository/query layer maintainability rules | Yes | Add | Custom table code becomes hard to maintain when raw SQL is scattered across controllers, cron, REST, and templates. |
| Force every custom table to use database foreign keys | No | Reject | WordPress portability and core table behavior make application-level integrity, cleanup hooks, and repair tooling safer by default. |

### Added Artifact

- `wp-expert/references/database-table-architecture-review.md`

### Updated Artifacts

- `wp-expert/SKILL.md`
- `wp-expert/references/reference-routing-map.md`
- `wp-expert/references/content-modeling-information-architecture.md`
- `wp-expert/references/performance-profiling-scale-budgets.md`
- `wp-expert/references/review-checklists.md`
- `README.md`
- `QUICK_REFERENCE.md`
- `CHANGELOG.md`
- `skill-evals/wp-expert-scenarios.md`
