# Gutenberg Workflow

Use this for Gutenberg, block editor, Site Editor, `@wordpress/*` packages, editor UI, package releases, and block editor documentation.

## Source Of Truth

- Gutenberg is a Core sub-project.
- The Gutenberg project uses GitHub for code and issue tracking.
- The main repository is `https://github.com/WordPress/gutenberg`.
- Development discussion commonly happens in `#core-editor` and `#core-js`.

## First Pass

Identify:

- GitHub issue or PR.
- Labels, milestone/project, package, affected block/editor surface, and release impact.
- Whether the issue affects the Gutenberg plugin only, Core bundled editor behavior, mobile editor, or package consumers.
- Whether a Core Trac ticket or Make post is also relevant.

## Implementation Rules

- Follow Gutenberg contributing guidelines and package conventions from the repository.
- Use existing scripts from `package.json`; do not assume script names without checking.
- Keep package public APIs, deprecations, block validation, serialization, and backwards compatibility visible.
- Add tests for editor state, UI behavior, accessibility states, data stores, package APIs, and block deprecations when relevant.
- Include Storybook or docs updates when changing reusable components or developer-facing APIs.

## Review Focus

Block editor changes should be checked for:

- Serialization and block validation regressions.
- Deprecated block behavior and migration paths.
- Keyboard navigation and screen reader behavior.
- Visual regression in editor and frontend parity.
- Data store side effects and undo/redo behavior.
- Package boundary and dependency correctness.
- Performance impact in large posts, Site Editor, and template browsing.

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
- [accessibility, compatibility, docs, package release, or Core sync concerns]
```
