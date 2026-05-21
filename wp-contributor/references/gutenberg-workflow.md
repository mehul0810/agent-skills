# Gutenberg Workflow

Use this for contributions to `wordpress/gutenberg`, the block editor, Site Editor, `@wordpress/*` packages, editor UI, package releases, block-editor docs, and Core-sync-sensitive editor work.

## Source Of Truth

- Gutenberg is a WordPress Core sub-project, but the repository workflow is GitHub-first for code, issues, PRs, labels, milestones, projects, reviews, and CI.
- Recheck the current `CONTRIBUTING.md`, contributor docs, repository-management docs, and `package.json` scripts before giving exact process or command guidance.
- Main repository: `https://github.com/WordPress/gutenberg`.
- Main development branch: `trunk` unless current docs or maintainers say otherwise.
- Development discussion commonly happens in Make/Core posts plus `#core-editor` and `#core-js` in Make WordPress Slack.

## Official Gutenberg Anchors

- Repository: `https://github.com/WordPress/gutenberg`
- Contributing guidelines: `https://github.com/WordPress/gutenberg/blob/trunk/CONTRIBUTING.md`
- Code contributions: `https://github.com/WordPress/gutenberg/blob/trunk/docs/contributors/code/README.md`
- Git workflow: `https://github.com/WordPress/gutenberg/blob/trunk/docs/contributors/code/git-workflow.md`
- Repository management: `https://github.com/WordPress/gutenberg/blob/trunk/docs/contributors/repository-management.md`
- Coding guidelines: `https://github.com/WordPress/gutenberg/blob/trunk/docs/contributors/code/coding-guidelines.md`
- Testing overview: `https://github.com/WordPress/gutenberg/blob/trunk/docs/contributors/code/testing-overview.md`
- Accessibility testing: `https://github.com/WordPress/gutenberg/blob/trunk/docs/contributors/accessibility-testing.md`

## First Pass

Identify:

- GitHub issue or PR, related discussion, current status, assignee, labels, milestone, project, and whether the item is actionable.
- Contribution type: bug, enhancement, feature/API, experimental work, build tooling, package work, docs, accessibility, design, performance, mobile, triage, review, release, or backport.
- Affected package, block, editor surface, data store, UI component, mobile surface, docs page, or package consumer.
- Whether the issue affects only the Gutenberg plugin, a future WordPress Core sync, bundled editor behavior in Core, React Native/mobile editor behavior, or downstream `@wordpress/*` package users.
- Whether a Core Trac ticket, Make post, dev note, release note, changelog entry, or package documentation update is also relevant.

## Local Setup And Branch Workflow

- Start from an up-to-date `trunk`; fork, clone, create a focused feature branch, implement, test, commit, push, and open a PR against `WordPress/gutenberg`.
- Use the repository's current setup instructions, `.nvmrc`, dependency files, and `package.json` scripts. Do not assume command names without checking the active checkout.
- Prefer small conceptual PRs. Non-trivial work should usually have a linked issue for problem definition and solution discussion before implementation.
- Use branch names with a clear type and short topic, such as `fix/block-copy-breakage` or `update/editor-sidebar-a11y`, unless maintainer guidance differs.
- Keep PR branches current by rebasing onto `trunk`; do not open a replacement PR just to address review feedback.
- Avoid unrelated formatting, mass refactors, dependency churn, generated artifact noise, or package changes outside the intended scope.

## Repository Management And PR Discipline

- Treat labels, milestones, and projects as maintainer workflow tools. Recommend or apply them only when current docs and permissions support it.
- Common signals to consider: `Good First Issue`, `Good First Review`, `Needs Accessibility Feedback`, `Needs Design Feedback`, `[Type] Bug`, `[Type] Enhancement`, `[Type] Experimental`, `[Type] New API`, `[Type] Build Tooling`, and `[Status] Needs More Info`.
- Issues must be relevant and actionable. For unclear reports, ask for reproduction details, environment, screenshots/video when useful, browser/device, theme/plugins, and exact editor path.
- PR titles should describe the user-facing bug or improvement, not just the implementation technique.
- PR bodies should link issues, describe what/why/how, include testing instructions, attach screenshots or videos for UI changes, and call out accessibility, mobile, package, docs, changelog, and Core sync impact.
- UI/design changes should request design review when relevant; accessibility-impacting changes should request accessibility feedback.
- A merge-ready PR generally needs a worthwhile scope, review by someone else, sufficient tests, edge-case coverage, proper changelog/release handling when required, and a clean rebase onto `trunk`.

## Implementation Rules

- Follow WordPress Coding Standards plus Gutenberg-specific coding guidelines for JavaScript, TypeScript-aware JavaScript, JSX, CSS/SCSS, PHP, docs, and tests.
- Respect Gutenberg monorepo/package boundaries. Keep `@wordpress/*` package APIs intentional, documented, tested, and compatible with downstream consumers.
- Do not add public APIs, experimental flags, deprecations, package exports, selectors/actions, block attributes, markup, or serialized output casually.
- Keep block validation, serialization, deprecated block behavior, migration paths, and backwards compatibility visible in every block or parser change.
- Use WordPress i18n, escaping, permissions, privacy, and security practices. Review REST endpoints, data-store effects, permissions, and user-generated content carefully.
- Prefer existing editor components, data stores, hooks, patterns, and package utilities over new abstractions unless the new abstraction reduces duplication across a clear package boundary.
- Include Storybook, docs, examples, or package README updates when changing reusable components, public APIs, or developer-facing behavior.

## Testing And Validation

- Discover current commands from `package.json` and docs first. Common validation areas include unit tests, e2e tests, linting, type checks, PHP tests, build checks, Storybook/visual review, and manual editor flows.
- Use targeted tests first to conserve time and tokens, then run broader validation when the risk or repository conventions require it.
- For JS/React changes, test behavior from the user's perspective with Jest and React Testing Library conventions where applicable.
- For editor UI changes, include manual steps in the post editor and Site Editor as relevant, plus screenshots or video for visual changes.
- For package or public API changes, test direct package behavior and downstream package consumers when practical.
- For release-sensitive changes, verify changelog/release-note expectations from current repository docs before adding entries.

## Accessibility And Mobile Parity

- Accessibility is a first-class acceptance criterion. Test keyboard-only navigation, focus order, focus visibility, labels, landmarks, announcements, color contrast, reduced motion, and screen-reader behavior when UI is affected.
- Use the Gutenberg accessibility testing guide for keyboard and screen-reader checks; do not rely only on automated checks.
- If a change touches function, class, variable names, shared components, editor flows, or files that have native counterparts, check corresponding `.native.js` or React Native/mobile editor paths to avoid mobile regressions.
- For shared components and editor interactions, verify desktop, mobile-responsive behavior, and editor/frontend parity where the feature crosses those surfaces.

## Review Focus

Block editor changes should be checked for:

- Serialization and block validation regressions.
- Deprecated block behavior and migration paths.
- Keyboard navigation and screen-reader behavior.
- Visual regression in editor, Site Editor, frontend parity, and responsive/mobile editor contexts.
- Data store side effects, undo/redo behavior, selectors/actions, and async resolution.
- Package boundary, dependency, build, and release correctness.
- Performance impact in large posts, Site Editor, template browsing, inserter/search, synced patterns, navigation, and global styles.
- Security and permissions impact in REST, preferences, entity records, media, patterns, templates, and user-generated content.

## Maintainer-Ready Output

- Implementation: issue/PR link, concise summary, files/packages changed, tests run, manual validation, screenshots/video for UI, and risks or follow-ups.
- Triage: reproduction status, environment, actionable next step, likely labels, duplicate candidates, missing information, and whether support forums are more appropriate.
- Review: acceptance blockers first, then maintainability/test/docs/accessibility suggestions, then optional polish.
- Backport/Core sync: release target, risk, compatibility, testing evidence, and whether a Core Trac ticket or Make/Core update is needed.

## PR Summary Shape

```text
What
- [concise behavior change]

Why
- [issue/user impact]

How
- [implementation approach]

Testing
- [automated tests]
- [manual editor steps]

Notes
- [accessibility, mobile/native parity, compatibility, docs, changelog, package release, or Core sync concerns]
```
