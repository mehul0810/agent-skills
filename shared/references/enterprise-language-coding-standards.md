# Enterprise Language Coding Standards

Use this when writing or reviewing TypeScript or when a WordPress change spans language-specific standards. Apply repository rules first, then the official language/platform standard and this enterprise overlay. Do not reformat vendor, generated, or unrelated legacy code.

## Shared Enterprise Contract

For every supported language:

- Keep ownership, inputs, outputs, side effects, errors, compatibility, and public contracts explicit. Prefer cohesive modules and clear names over cleverness or speculative abstraction.
- Treat external, persisted, user, network, environment, and cross-language data as untrusted. Static types do not replace runtime validation, authorization, sanitization, escaping, or schema checks.
- Bound hot paths, collections, recursion, retries, concurrency, I/O, payloads, and memory. Make state transitions deterministic, observable, idempotent where retried, and safe to roll back.
- Add useful comments for non-obvious intent, invariants, security, compatibility, performance, or platform constraints. Remove narration, stale TODOs, debug residue, and commented-out code.
- Use the repository's formatter, linter, static analysis, tests, and production build. Add tooling only when its signal exceeds its maintenance cost. Record justified exceptions rather than weakening rules silently.
- Test observable success, failure, boundary, permission, malformed-input, lifecycle, and scale behavior proportional to risk. Review generated artifacts separately from source.

## TypeScript Standard

- For new TypeScript packages or substantial isolated modules, enable `strict`; consider `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and `noImplicitOverride` when the repository and dependency types can sustain them. Adopt stricter flags incrementally in legacy code and document narrow exceptions.
- Prefer `unknown` plus narrowing at untrusted boundaries. Avoid `any`, unchecked casts, non-null assertions, `@ts-ignore`, and empty catch blocks as shortcuts; localize and explain the rare unavoidable escape hatch.
- Model finite states and async workflows with discriminated unions. Use readonly inputs/data where mutation is not part of the contract, exhaustive `never` checks for critical unions, and branded/opaque identifiers only when mixing IDs is a demonstrated risk.
- Types disappear at runtime. Validate REST responses, localized boot data, block attributes, storage, JSON, postMessage, third-party SDK output, and environment values before converting them into domain types.
- Keep TypeScript contracts aligned with PHP REST schemas, `block.json`, JSON Schema, persisted formats, and public package APIs. Generate from one source only when generation is deterministic and reviewed; otherwise add contract tests that detect drift.
- Use type-only imports/exports where supported and avoid global declaration merging unless integrating a real platform global. Do not expose internal utility types as public API accidentally.
- Type React props, events, refs, context defaults, async states, and custom Hooks without weakening the Rules of React. Verify installed `@wordpress/*` and React type versions against the target WordPress/runtime; do not code to newer declarations than production provides.
- Run a separate no-emit type gate (`tsc --noEmit` or repository equivalent), ESLint, unit/component tests, and the real production build. A transpiler succeeding does not prove type safety. Publish declarations and API reports only for packages whose consumers need them.
- Migrate JavaScript incrementally using checked JSDoc, `allowJs`/`checkJs`, or bounded file conversion when useful. Do not combine a broad migration with unrelated behavior unless the migration is the approved task.

Official anchors: [TypeScript `strict`](https://www.typescriptlang.org/tsconfig/strict), [Gutenberg coding guidelines](https://developer.wordpress.org/block-editor/contributors/code/coding-guidelines/), and [`@wordpress/eslint-plugin`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-eslint-plugin/).

## Supported Language Matrix

| Language/surface | Required standard and enterprise checks |
| --- | --- |
| PHP | Repository PHP floor; WordPress PHP and documentation standards; PHPCS/WordPressCS and PHPStan/Psalm where configured; typed/domain boundaries, capability/ownership checks, sanitized ingress, late escaping, lifecycle and compatibility tests. Do not impose `strict_types` on WordPress-integrated files without compatibility evidence. |
| JavaScript, JSX, React | WordPress JavaScript/JSDoc standards, `@wordpress/eslint-plugin`, verified browser/build targets, pure React/Hooks, explicit async cleanup, accessible states, scoped dependencies, unit/component/runtime proof. Use `react-wordpress-enterprise.md` for the full surface contract. |
| TypeScript, TSX | The TypeScript standard above plus React/WordPress runtime compatibility, strictness evidence, runtime boundary validation, cross-language schema alignment, no-emit typecheck, tests, and production build. |
| CSS, SCSS | WordPress CSS standards and repo Stylelint; semantic tokens, logical properties/RTL, controlled cascade and specificity, responsive/container behavior, reduced motion, forced colors, browser support, performance, and editor/frontend parity. |
| HTML, JSX markup, PHP templates | WordPress HTML and accessibility standards; semantic structure, valid nesting, contextual escaping, keyboard/focus behavior, translatable text, no unsafe raw HTML, and rendered DOM/browser proof. |
| SQL | WordPress database APIs; prepared values and whitelisted identifiers/order; bounded/selective queries, query-to-index evidence, deterministic migrations, concurrency/rollback/data-retention handling, and representative-volume tests. |
| JSON, JSON Schema, `theme.json`, `block.json`, YAML | Parse/schema validation, stable documented keys, least-privilege workflow permissions, no secrets, deterministic formatting/generation, compatibility/version checks, and consumer/build validation. Types or schemas must not claim fields the runtime does not validate. |
| Shell/Bash and command scripts | Repository shell target and ShellCheck where configured; quoted variables, explicit failure handling, bounded inputs, safe temporary files, idempotency, no secret echoing, no unreviewed download-to-shell, and dry-run/fixture tests for destructive or release-sensitive paths. |
| Markdown and product/developer docs | Repository style; evidence-backed commands/claims, accessible links/headings, correct code-fence language, version/branch/package accuracy, no secrets, and validation of referenced paths or commands where material. |

WordPress anchors: [Coding Standards Handbook](https://developer.wordpress.org/coding-standards/), [PHP](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/), [JavaScript](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/), [CSS](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/), [HTML](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/html/), and [accessibility](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/accessibility/).

## Completion

Report the languages changed, standards/tooling run, runtime or schema boundaries checked, tests/proof, generated artifacts reviewed, and residual exceptions. Do not call a multi-language change enterprise-ready when one changed language was skipped.
