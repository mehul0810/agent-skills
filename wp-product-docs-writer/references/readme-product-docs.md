# README And Product Documentation

Use this for WordPress.org `readme.txt`, GitHub `README.md`, and factual documentation synchronization. Check current official WordPress.org guidance when directory behavior may have changed.

## Evidence Order

1. Published production release/tag and public package/listing.
2. Exact release-candidate diff, merged PRs, package metadata, and runtime proof.
3. Accepted `PRODUCT.md`, `DESIGN.md`, `RELEASE.md`, `TESTING.md`, architecture docs, and current source.
4. Existing README/docs.
5. Issues, roadmap, drafts, and chat, which cannot prove shipped behavior.

Record each material claim as `shipped`, `planned`, or `unknown/conflicting`. Use present tense only for shipped behavior. Planned work needs explicit future language or exclusion.

## WordPress.org `readme.txt`

The file controls the public plugin-directory page. Follow the current official standard and validator:

- https://developer.wordpress.org/plugins/wordpress-org/how-your-readme-txt-works/
- https://wordpress.org/plugins/developers/#readme
- https://wordpress.org/plugins/developers/readme-validator/

Verify:

- plugin name, case-sensitive WordPress.org contributors, license, and license URI;
- 1-5 useful tags, without competitor plugin names or keyword spam;
- short description no longer than 150 characters and without markup;
- `Stable tag`, plugin-header version, tagged package/SVN directory, and release target agree;
- `Tested up to` reflects actual current proof; requirements align with the main plugin header and package/toolchain policy;
- Description explains what the plugin does and how to use it, not an unsupported sales pitch;
- Installation includes only real setup; omit needless steps for plug-and-play products;
- FAQ answers observed questions; screenshots and captions match deployed assets and current UI;
- changelog/upgrade notice describe the target audience's released behavior without exploit detail or future-feature claims;
- external services, accounts, paid dependencies, data sent, consent/privacy implications, support path, and relevant limitations are disclosed accurately.

Keep the readme concise. Retain the current release changelog and move older history to `changelog.txt` when useful; route deep documentation to the product site. Do not use `Stable tag: trunk` for new releases. Remember that WordPress.org derives several requirements/version fields from the main plugin file, so validate the rendered listing/package rather than trusting readme headers alone.

## GitHub `README.md`

Treat the GitHub README as repository onboarding, not a copy of the WordPress.org listing. Use only sections the audience needs:

1. Product name and one-sentence verified purpose.
2. Current capabilities and explicit limitations/status.
3. Requirements and installation paths proven by manifests, headers, and release artifacts.
4. Minimal quick start with real commands or admin paths.
5. Configuration and common workflows, including defaults and failure/recovery behavior where material.
6. Screenshots or examples only when current and repository-safe.
7. Developer architecture, extension points, build/test commands, and contribution guidance when this is a source repository.
8. Documentation, support, security reporting, changelog/releases, license, and attribution links.

Do not add badges unless their target is live and useful. Do not expose secrets, internal hosts, private customer data, exploit reproduction, unshipped commands, or generated examples that have not been run.

## Synchronization Matrix

Cross-check only relevant surfaces:

| Fact | Sources that must agree |
| --- | --- |
| Version/release | plugin/theme header, package manifest, stable tag, changelog, release notes, tag |
| Compatibility | runtime headers, Composer/npm constraints, CI matrix, tested package, public docs |
| Installation | actual distribution path, build/vendor contents, activation/setup workflow |
| Features | shipped code/runtime, screenshots, README, `readme.txt`, docs, release notes |
| Data/external services | implementation, consent/privacy docs, admin UI, public disclosures |
| Support/security | repository/community policy and real contact/reporting path |

Conflicts are findings, not copy-edit opportunities. Do not silently choose the most promotional source.

## Editing And Validation

- Preserve useful headings, anchors, references, localization notes, and contributor credit.
- Prefer focused edits; reorganize only when users cannot find installation, first value, limitations, support, or developer setup.
- Check links, commands, paths, heading hierarchy, code fences, image alt text, and examples.
- Run the official readme validator for WordPress.org content when available; run repo lint/docs checks and `git diff --check` when editing files.
- For a release update, validate against the candidate package after every metadata change. Documentation approval does not authorize publish/release.

## Completion Evidence

Report artifact/audience, comparison range, claims excluded or qualified, metadata synchronization, commands/validators run, unresolved conflicts, and whether publication remains gated.
