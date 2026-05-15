# Changelog And Release Notes Expertise

Use this for public changelogs, internal release notes, WordPress.org `readme.txt` changelog entries, GitHub releases, client release summaries, SemVer impact classification, and deciding what belongs in Added/Improved/Changed/Fixed/Security/Developer categories.

## Current Official Anchors

- WordPress plugin readmes: https://developer.wordpress.org/plugins/wordpress-org/how-your-readme-txt-works/
- WordPress plugin readme file standard: https://wordpress.org/plugins/developers/#readme
- Official WordPress readme validator: https://wordpress.org/plugins/developers/readme-validator/
- Keep a Changelog: https://keepachangelog.com/en/1.1.0/
- Semantic Versioning: https://semver.org/

## Core Principle

A changelog is not a commit log. It is a release communication artifact for the audience receiving the release.

Write entries from verified changes, not memory:

- Compare actual commits, PRs, issue links, milestone, tags, package artifact, and release branch diff.
- Group related implementation work into outcome-based entries.
- Mention user-visible, admin-visible, editor-visible, developer-visible, security, migration, compatibility, and operational changes.
- Exclude internal churn unless it affects behavior, compatibility, performance, security, extensibility, or maintainability in a meaningful way.
- Do not say the changelog is complete until the release diff/source of truth has been checked.

## Unreleased Feature Aggregation Rule

If a product, version, or feature is not publicly released yet, fixes and improvements to that same unreleased feature should be folded into the original `Added` entry, not split into `Improved` or `Fixed`.

Correct:

```md
### Added
- Added the onboarding wizard with step validation, retry handling, and improved empty states.
```

Avoid for unreleased work:

```md
### Added
- Added the onboarding wizard.

### Improved
- Improved onboarding wizard empty states.

### Fixed
- Fixed onboarding wizard validation.
```

Use `Fixed` only when the bug existed in a released version the target audience could access. Use `Improved` only when improving behavior already released to that audience.

## Release State Matrix

Classify against the audience receiving notes:

- Internal-only QA/dev branch: not released. Fold fixes/improvements into the feature entry.
- Private client preview: released for that client if they receive notes; fixed/improved entries may be appropriate for preview regressions.
- Public beta/RC: released to testers; fixed/improved entries are valid when tester-facing behavior changed.
- Feature flag enabled for real users: released for that cohort; fixed/improved entries are valid for that cohort.
- Public stable release: normal changelog rules apply.

When unsure, state the release audience and treat unreleased work as a single outcome entry.

## Recommended Categories

Use the smallest set that fits the release. Prefer these headings:

```md
### Added
### Improved
### Changed
### Fixed
### Security
### Deprecated
### Removed
### Developer
```

Category rules:

- `Added`: new user/admin/editor/developer capability.
- `Improved`: better behavior for an already released capability.
- `Changed`: behavior, defaults, UI, workflow, compatibility, or contract changes users must understand.
- `Fixed`: bug fix for a released defect.
- `Security`: vulnerability or hardening with user impact; avoid exploit-level detail.
- `Deprecated`: still available but scheduled for removal or replacement.
- `Removed`: removed behavior, API, hook, setting, file, compatibility, or support.
- `Developer`: hooks, filters, REST routes, WP-CLI commands, block APIs, template contracts, internal APIs, schemas, or extension points.

## WordPress-Specific Entries

Call out these changes when present:

- Plugin/theme version, stable tag, tested-up-to, requires-at-least, requires PHP, and minimum runtime/toolchain changes.
- Database migrations, option/meta schema changes, custom table changes, cron/action scheduler changes, and data cleanup.
- REST endpoints, permissions, nonces, capabilities, hooks, filters, shortcodes, blocks, block attributes, WP-CLI commands, and template overrides.
- Admin/editor UX changes, settings defaults, onboarding changes, notices, and role/capability behavior.
- Performance, caching, query, index, background queue, observability, deployment, rollback, and compatibility changes.
- Security and privacy changes, including consent, tracking, external services, PII handling, and credential storage.
- WordPress.org `readme.txt` changelogs should stay concise. Keep the current release in `readme.txt` and move older history to `changelog.txt` when the readme grows large.

## SemVer And Release Impact

Use SemVer where the product or package has a public API contract. For applications/plugins that do not strictly use SemVer, still classify release risk:

- Patch: compatible fixes, security hardening, small safe improvements.
- Minor: new compatible features, new optional APIs, compatible UX additions.
- Major: breaking changes, removed APIs, schema changes requiring migration, dropped runtime support, changed defaults with material behavior impact.
- Pre-release: alpha/beta/RC notes should clearly identify incomplete or test-only features.

Do not rely on version number alone. If the diff contains a breaking change, flag it even if the planned version is minor or patch.

## Writing Style

- Write for the affected audience, not for the implementer.
- Start each bullet with a clear verb and concrete object.
- Prefer outcomes over mechanics: say what changed and why users/admins/developers care.
- Keep bullets short; split only when one bullet hides multiple unrelated impacts.
- Avoid vague entries such as "bug fixes", "misc improvements", "updated code", or "refactoring" unless they are backed by specific impact.
- Do not overclaim performance, security, compatibility, or compliance. State measurable or scoped outcomes.
- Include issue/PR IDs only when useful for traceability or the repo convention expects them.

## Evidence Workflow

1. Identify release target: WordPress.org, GitHub release, client handoff, internal deployment, beta/RC, or hotfix.
2. Identify comparison range: previous tag to release tag, release branch diff, milestone PRs, or package artifact.
3. List raw changes, then collapse by user-facing outcome.
4. Apply the release-state matrix to avoid fake `Fixed`/`Improved` entries for unreleased work.
5. Classify categories and SemVer/risk impact.
6. Check WordPress-specific metadata and runtime minimums.
7. Verify no secrets, exploit details, private client names, or sensitive payloads appear in notes.
8. Validate `readme.txt` with the official validator for WordPress.org releases when applicable.

## Templates

Public changelog:

```md
## [1.4.0] - 2026-05-15

### Added
- Added ...

### Improved
- Improved ...

### Fixed
- Fixed ...

### Developer
- Added ...
```

Client release note:

```md
Release: 1.4.0
Date: 2026-05-15
Audience: Client admins and editors
Summary:
Highlights:
Operational notes:
Validation:
Known follow-ups:
```

Hotfix note:

```md
## [1.4.1] - 2026-05-15

### Fixed
- Fixed ...

### Security
- Hardened ...
```

## Review Checklist

- Was the changelog generated from the real diff, PR list, milestone, or tag range?
- Are unreleased feature fixes/improvements folded into the original `Added` entry?
- Does every `Fixed` entry correspond to a defect in a released version for the target audience?
- Does every `Improved` entry improve behavior that was already released for the target audience?
- Are breaking changes, migrations, dropped version support, and compatibility risks clearly called out?
- Are WordPress.org readme/stable tag/version implications checked where relevant?
- Are security notes useful without disclosing exploit details?
- Are internal-only refactors excluded unless they create meaningful user/developer/operator impact?
