# WordPress Expert Codex Skill Planning Report

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
wordpress-expert/
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

- Created the installable `wordpress-expert` skill folder with valid Codex skill metadata.
- Added a compact operating workflow in `SKILL.md` to minimize token load on every invocation.
- Added five selective reference playbooks for reviews, enterprise architecture, VIP scale, implementation patterns, and validation commands.
- Added two read-only helper scripts for WordPress repo discovery and lightweight validation.
- Updated `README.md` with the skill purpose and invocation.

## Validation Results

- `quick_validate.py wordpress-expert`: passed.
- `bash -n wordpress-expert/scripts/wp-context.sh`: passed.
- `bash -n wordpress-expert/scripts/wp-validate.sh`: passed.
- `bash wordpress-expert/scripts/wp-context.sh .`: passed and confirmed the cloned GitHub repo context.
- `bash wordpress-expert/scripts/wp-validate.sh .`: passed; no PHP or JS files exist in this skill repo.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, and `wordpress-expert/`: passed.

## Source Anchors Checked

- WordPress VIP performance documentation: https://docs.wpvip.com/performance/
- WordPress VIP caching and object-cache documentation: https://docs.wpvip.com/caching/ and https://docs.wpvip.com/caching/object-cache/
- WordPress VIP file system documentation: https://docs.wpvip.com/vip-file-system/
- WordPress VIP PHPCS installed standards documentation: https://docs.wpvip.com/php_codesniffer/installed-standards/
- WordPress plugin security handbook: https://developer.wordpress.org/plugins/security/

## Expansion Iteration: Complete WordPress Expert Coverage

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

- `quick_validate.py wordpress-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wordpress-expert`: passed, confirming the installed symlink resolves correctly.
- `bash -n wordpress-expert/scripts/wp-context.sh`: passed.
- `bash -n wordpress-expert/scripts/wp-validate.sh`: passed.
- `bash wordpress-expert/scripts/wp-context.sh .`: passed.
- `bash wordpress-expert/scripts/wp-validate.sh .`: passed; no PHP/JS files or GitHub Actions workflows exist in this skill repo.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, and `wordpress-expert/`: passed.

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

- `quick_validate.py wordpress-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wordpress-expert`: passed, confirming the installed symlink resolves correctly.
- `bash -n wordpress-expert/scripts/wp-context.sh`: passed.
- `bash -n wordpress-expert/scripts/wp-validate.sh`: passed.
- `bash wordpress-expert/scripts/wp-context.sh .`: passed and confirmed the repo context plus changed/untracked files.
- `bash wordpress-expert/scripts/wp-validate.sh .`: passed; no PHP/JS files or GitHub Actions workflows exist in this skill repo.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, and `wordpress-expert/`: passed.

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

- `quick_validate.py wordpress-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wordpress-expert`: passed, confirming the installed symlink resolves correctly.
- `bash -n wordpress-expert/scripts/wp-context.sh`: passed.
- `bash -n wordpress-expert/scripts/wp-validate.sh`: passed.
- `bash wordpress-expert/scripts/wp-validate.sh .`: passed; no PHP/JS files or GitHub Actions workflows exist in this skill repo.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, and `wordpress-expert/`: passed.

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

- `quick_validate.py wordpress-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wordpress-expert`: passed, confirming the installed symlink resolves correctly.
- `bash -n wordpress-expert/scripts/wp-context.sh`: passed.
- `bash -n wordpress-expert/scripts/wp-validate.sh`: passed.
- `bash wordpress-expert/scripts/wp-validate.sh .`: passed; no PHP/JS files or GitHub Actions workflows exist in this skill repo.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, and `wordpress-expert/`: passed.

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

- `quick_validate.py wordpress-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wordpress-expert`: passed, confirming the installed symlink resolves correctly.
- `bash -n wordpress-expert/scripts/wp-context.sh`: passed.
- `bash -n wordpress-expert/scripts/wp-validate.sh`: passed.
- `bash wordpress-expert/scripts/wp-validate.sh .`: passed; no PHP/JS files or GitHub Actions workflows exist in this skill repo.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, and `wordpress-expert/`: passed.

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

- `quick_validate.py wordpress-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wordpress-expert`: passed, confirming the installed symlink resolves correctly.
- `bash -n wordpress-expert/scripts/wp-context.sh`: passed.
- `bash -n wordpress-expert/scripts/wp-validate.sh`: passed.
- `bash wordpress-expert/scripts/wp-validate.sh .`: passed; no PHP/JS files or GitHub Actions workflows exist in this skill repo.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, and `wordpress-expert/`: passed.

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

- `quick_validate.py wordpress-expert`: passed.
- `quick_validate.py /Users/mehulgohil/.codex/skills/wordpress-expert`: passed, confirming the installed symlink resolves correctly.
- `bash -n wordpress-expert/scripts/wp-context.sh`: passed.
- `bash -n wordpress-expert/scripts/wp-validate.sh`: passed.
- `bash wordpress-expert/scripts/wp-validate.sh .`: passed; no PHP/JS files or GitHub Actions workflows exist in this skill repo.
- `git diff --check`: passed.
- ASCII scan across `README.md`, `PLANNING_REPORT.md`, and `wordpress-expert/`: passed.
