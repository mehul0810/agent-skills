# Interactivity API Frontend Engineering

Use this as primary for stateful WordPress block or frontend behavior using the Interactivity API, script modules, or client-side navigation. Keep a visual, architecture, accessibility, or performance reference as the one support only when that risk is confirmed.

Official anchors:

- Interactivity API: `https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/`
- Client-side navigation: `https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/core-concepts/client-side-navigation/`
- Client-side navigation compatibility: `https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/core-concepts/client-side-navigation/client-side-navigation-compatibility/`

## Preflight

- Verify the supported WordPress/Gutenberg versions and the live Interactivity API, directive, script-module, and router capabilities. Treat examples from newer documentation as unavailable until runtime evidence proves otherwise.
- Define the semantic server-rendered HTML, durable data owner, store namespace, local context, derived state, actions, async effects, and failure behavior before client code.
- Prefer progressive enhancement. Primary content, links, forms, and recovery must remain understandable without hydration unless the documented product contract requires an application runtime.
- Scope scripts and styles to the owning block/surface; do not hydrate an entire page for one local interaction.

## State And Lifecycle Contract

- Keep authoritative permissions, validation, and durable writes on the server. Client state never grants authority.
- Use context for instance-local state, global state only for a proven shared concern, and derived state instead of duplicated mutable values.
- Model initial, pending, success, empty, error, retry, interrupted, stale, and permission-denied states. Prevent double submission and stale response races; abort or ignore obsolete requests.
- Preserve native link, form, history, focus, and browser behavior. Do not turn semantic navigation into click handlers without a measurable benefit and a complete fallback.
- Avoid duplicate listeners, repeated store initialization, leaked observers, or stale DOM references when a region rerenders or navigation replaces content.

## Client-Side Navigation

When router regions or navigation actions are used, prove:

- source and destination expose compatible, stable region identities,
- Back, Forward, direct URL entry, refresh, modified-click, open-in-new-tab, hash, query, and failed navigation behavior remain correct where applicable,
- required styles and script modules load once and new-region behavior initializes without duplicate side effects,
- global and local state persistence or reset matches the product contract,
- document title, focus, loading/result announcements, and primary landmarks remain understandable to assistive technology,
- analytics, consent, caches, forms, and third-party integrations do not double-fire or silently miss navigation,
- experimental full-page navigation is not adopted without explicit version/support evidence and a rollback path.

## Accessibility And Performance

- Use native controls and names first; directives do not repair invalid semantics.
- Prove keyboard, touch/no-hover, reduced motion, focus visibility/return, live announcements, and no-JS behavior for critical tasks.
- Keep action work below the repo's INP/long-task budget. Avoid broad subscriptions, unnecessary reactive reads, large initial state, layout-thrashing effects, and route-global bundles.
- Announce meaningful async outcomes without noisy live regions. Preserve user input and recovery after validation, network, permission, or timeout failures.

## Validation

Use the smallest applicable matrix:

1. Server render and no-JS fallback.
2. Hydration with no console errors, duplicate effects, or visible state flash.
3. Every applicable state and race/retry path.
4. Keyboard, assistive-technology, touch/no-hover, and reduced-motion proof.
5. Client navigation, Back/Forward, refresh, deep link, and asset lifecycle when routing is enabled.
6. Multiple block instances, removed/reinserted blocks, editor save/reload, and frontend render.
7. Supported WordPress/Gutenberg versions plus browser engines required by repo policy.
8. INP, script weight, request count, and failure telemetry proportional to risk.

Report exact versions, namespace/region ownership, states and navigation paths exercised, evidence, fallbacks, performance result, and remaining compatibility risk.
