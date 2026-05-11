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
|   |-- enterprise-architecture.md
|   |-- implementation-patterns.md
|   |-- review-checklists.md
|   |-- validation-commands.md
|   `-- vip-scale-playbook.md
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
