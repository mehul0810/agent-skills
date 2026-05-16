# React With WordPress Enterprise Standards

Use this for React apps, admin screens, block editor UI, frontend interactive blocks, headless/decoupled UI, data stores, build tooling, and enterprise review of React shipped inside WordPress.

## Current Official Anchors

- WordPress package reference: https://developer.wordpress.org/block-editor/reference-guides/packages/
- `@wordpress/element`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-element/
- `@wordpress/components`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-components/
- `@wordpress/data`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/
- `@wordpress/api-fetch`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-api-fetch/
- `@wordpress/scripts`: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/
- Dependency extraction webpack plugin: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-dependency-extraction-webpack-plugin/
- Interactivity API: https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/

## First Decision: Where React Belongs

Pick the smallest React surface that solves the product problem.

- Block editor UI: use React through block `edit`, inspector controls, block supports, slots/fills, document panels, and `@wordpress/components`.
- Admin apps: use React for complex settings, dashboards, workflows, bulk tools, and onboarding where a normal PHP settings page becomes brittle.
- Frontend blocks: prefer static/dynamic block markup plus small behavior. Use the Interactivity API for block frontend interactions when WordPress version support and project constraints fit. Mount React on the frontend only when client state, routing, or app complexity justifies the bundle and hydration cost.
- Headless/decoupled frontends: treat WordPress as the content/API platform and own React versioning, routing, rendering, caching, auth, and deployment separately.
- Classic admin/editor: keep classic-editor metadata in meta boxes. Do not show newly implemented meta boxes in the block editor; use document/sidebar panels or inspector panels instead.

## Runtime And Dependency Rules

- In WordPress admin/editor bundles, do not ship duplicate React/ReactDOM copies. Use WordPress package dependencies and dependency extraction so shared scripts are loaded by WordPress.
- Prefer `@wordpress/element` for React-compatible primitives in WordPress-loaded bundles, including `createRoot`/`hydrateRoot` where supported.
- Generate and consume `*.asset.php` files for script dependencies and content-hash versions.
- Register/enqueue scripts with explicit dependencies, versions, and screen/block scoping. Never enqueue a React app globally across wp-admin or the frontend without need.
- Load `wp-components` styles when using `@wordpress/components`; keep plugin CSS dependent on it where load order matters.
- Avoid mixing manual webpack `externals` with dependency extraction unless the conflict is understood and tested.
- Treat WordPress script modules and Interactivity API support as version-sensitive; verify target WordPress/VIP version before adopting.

## Architecture Boundaries

- PHP owns capabilities, persistence, schema validation, sanitization, escaping, migrations, and REST contracts.
- React owns interaction state, view composition, optimistic UI, client-side validation hints, and accessible feedback.
- REST API is the default client/server boundary. Avoid new `admin-ajax.php` handlers when REST can satisfy the use case.
- Keep REST routes versioned or schema-stable, with meaningful `permission_callback`, `args` schemas, pagination, error codes, and cache semantics.
- Localize only public config needed at boot: REST root, nonce when required, feature flags, screen context, limits, and i18n data. Never localize secrets, private tokens, PII, or broad database records.
- Large datasets should be fetched incrementally with pagination, search, filters, and abortable requests; never preload unbounded data into the page.

## State Management

- Use local React state for component-only concerns.
- Use `@wordpress/data` when state is shared across panels, blocks, routes, or async resolvers.
- Use selectors and resolvers for server-backed data; keep state normalized by ID for large collections.
- Avoid global mutable objects and ad hoc event buses unless integrating with a legacy surface.
- Debounce high-frequency writes, abort stale requests, and show clear loading/error/saved states.
- For optimistic updates, define rollback behavior and reconcile with server truth.
- Keep editor data and frontend data separate unless a shared store is explicitly needed and tested.

## UI, UX, And Accessibility

- Prefer WordPress Design System primitives through `@wordpress/components` for wp-admin and block editor UI.
- Use semantic labels, help text, validation messages, focus management, keyboard paths, notices, and disabled/loading states.
- Keep mobile-first behavior for frontend React and responsive-safe behavior for admin/editor panels.
- Avoid generic SPA chrome inside wp-admin. Respect WordPress navigation, notices, layout density, color tokens, and accessibility expectations.
- For modals/popovers, verify focus trap, escape behavior, scroll locking, and screen-reader announcements.
- Keep translations in `@wordpress/i18n`; do not concatenate translatable sentence fragments.

## Performance And Scale

- Split entry points by surface: admin settings, editor block, frontend view, dashboard widget, or onboarding. Do not create one giant bundle.
- Lazy-load heavy modules only after user intent when it does not break accessibility or perceived performance.
- Keep REST responses compact and cacheable where possible; return IDs/DTOs, not full objects unless needed.
- Use server-side rendering/dynamic blocks for SEO-critical or cache-critical frontend output; hydrate only the interactive portion.
- Avoid synchronous remote calls from REST endpoints serving React UI; cache or queue expensive provider work.
- Measure bundle size, request count, editor load impact, REST latency, and cache behavior before calling a React feature enterprise-ready.

## Security And Compliance

- All privileged mutations require server-side capability/object ownership checks; nonces are not authorization.
- Validate and sanitize every REST input server-side, even if React validates it first.
- Escape server-rendered output and keep dangerous HTML out of React props unless passed through a strict allowlist.
- Do not expose secrets, tokens, private URLs, PII, customer records, or raw logs in localized JS, REST payloads, DOM attributes, source maps, or client errors.
- Redact telemetry and error reporting. Treat screenshots and browser console logs as potentially sensitive.
- Review npm dependencies, lockfiles, build actions, and transitive packages for supply-chain risk before enterprise release.

## Testing And Validation

- Unit-test reducers, selectors, transforms, utility functions, and REST contract adapters.
- Component-test critical UI states: loading, empty, error, permission denied, dirty form, saved, optimistic rollback, and validation failure.
- E2E-test editor/admin/frontend flows with realistic roles and data volume.
- Run lint/type/build gates: `wp-scripts lint-js`, `wp-scripts test-unit-js`, TypeScript if configured, `npm run build`, and project equivalents.
- Verify generated `*.asset.php` dependency lists, built files, source maps policy, and release artifact contents.
- Smoke-test with a lower-privilege role to prove the UI does not merely hide unauthorized actions while REST still blocks them.
- Validate accessibility with keyboard, screen reader smoke, reduced motion, zoom, RTL/translation, and automated checks where available.

## Review Checklist

- Is React necessary for this surface, or would PHP/block markup plus small behavior be simpler and faster?
- Is WordPress-owned React used instead of bundling duplicate React in admin/editor contexts?
- Are scripts scoped, versioned, dependency-extracted, and included in the release artifact?
- Are REST permissions, schemas, pagination, and error states complete?
- Does the UI use WPDS/components where appropriate and meet accessibility expectations?
- Are large data, remote calls, and expensive computations kept off initial render?
- Are tests covering roles, failures, build artifacts, and high-volume data states?
