# UI/UX Pro For WordPress

Use this for UX strategy, UI improvement, visual QA, product flows, interaction design, responsive polish, conversion-oriented WordPress screens, admin/editor experiences, frontend feature pages, dashboards, onboarding, forms, tables, and design-to-code implementation.

This reference fuses product-grade UI/UX reasoning with WordPress-native design constraints. Use it alongside `wordpress-design-system.md` when the implementation should use WPDS or `@wordpress/components`. For estimates, milestones, and mobile-first delivery architecture, also read `delivery-excellence.md`.

## UX Triage

Before designing or changing UI, answer:

- Who is the user: site owner, editor, shop manager, developer, customer, subscriber, anonymous visitor, network admin?
- What is the task: configure, publish, recover, compare, buy, submit, filter, diagnose, approve, import, export, or monitor?
- How often: first-run, daily workflow, emergency-only, onboarding-only, one-time migration?
- What is at risk: data loss, privacy, money, SEO, deliverability, production downtime, accessibility, user trust?
- Where does it live: wp-admin, block editor sidebar/canvas, site editor, frontend, WooCommerce checkout, REST-powered app, mobile viewport?

Do not start with decoration. Start with task success, clarity, and safe recovery.

## Priority Ladder

Apply priorities in this order:

1. Accessibility: labels, keyboard, focus, contrast, semantic structure, screen reader behavior.
2. Interaction safety: target size, disabled/loading states, idempotent actions, confirmations for destructive work.
3. Performance: no layout shift, no heavy admin bundles, lazy media, fast input response, no blocking remote calls.
4. Information hierarchy: one primary action, clear headings, progressive disclosure, scannable groups.
5. Responsive layout: mobile-first where frontend/customer-facing; admin/editor layouts must handle narrow sidebars and small screens.
6. Typography and color: use tokens, readable sizes, semantic colors, no low-contrast gray-on-gray.
7. Motion: 150-300ms, meaningful, transform/opacity only, respects reduced motion.
8. Forms and feedback: visible labels, helper text, inline errors, success state, retry path.
9. Navigation: predictable back/close/cancel behavior, breadcrumbs/steps when needed, deep links for complex screens.
10. Data visualization: table/chart readability, legends, filters, accessible color and text labels.

## WordPress UI Contexts

### wp-admin screens

- Prefer WordPress conventions for routine settings, tools, list tables, and notices.
- Use branded product surfaces only when the plugin already has a coherent app-like admin experience.
- Avoid global admin notices for product marketing. Scope notices to relevant screens.
- Keep remote health checks explicit or cached; do not make every admin page wait on a third party.

### Block editor and site editor

- Controls should feel like core block controls.
- Prefer block supports, `ToolsPanel`, `PanelBody`, and inspector controls over custom sidebars unless the workflow requires them.
- Use document panels for document-level settings and inspector/block panels for block-specific settings.
- Keep classic-editor post fields in meta boxes when the site/editor context is still classic editor, or when maintaining a legacy meta box contract.
- Do not show newly implemented meta boxes in the block editor; migrate the UI into the relevant document or block panel.
- Persist user choices as attributes or settings that actually affect frontend output.
- Validate canvas, sidebar, preview, saved post, frontend, and invalid-block behavior.

### Frontend experiences

- Start mobile-first for customer-facing flows, then progressively enhance tablet and desktop layouts.
- Preserve theme design language unless the task is to redesign.
- Improve content hierarchy, states, spacing, and conversion clarity before adding visual effects.
- Avoid layout shifts, excessive animation, and heavy component libraries.
- Validate logged-in/logged-out, empty content, missing images, long strings, translated strings, and mobile navigation.

## Design Brief Template

For new or substantial UI work, build this brief first:

```text
User:
Primary job:
Current friction:
Desired outcome:
Success metric:
WordPress context:
Primary action:
Secondary actions:
Risk level:
State coverage:
Design system source:
Validation plan:
```

If the request is exploratory, return 2-3 design directions with tradeoffs and a recommended direction. If the request is implementation, use the brief internally and implement the most practical direction.

## Component And Token Strategy

- Map to WordPress components first: `@wordpress/components`, `@wordpress/icons`, editor SlotFills, block supports, `theme.json`, admin styles.
- Use a three-layer token model when custom design is needed: primitive values, semantic aliases, component tokens.
- Prefer semantic tokens such as `--color-surface`, `--color-text-muted`, `--color-danger`, `--space-control-gap` over raw values in components.
- Do not introduce Tailwind/shadcn/Radix or another UI stack into WordPress admin/editor unless the project already uses it or there is a clear isolated app surface.
- Avoid bundling duplicate React, WordPress packages, or large UI libraries into admin/editor assets.

## State Coverage Checklist

Every serious UI should cover:

- Empty: no records, no settings, no connected account, no search results.
- Loading: initial load, partial refresh, button-level async, long-running jobs.
- Success: saved, connected, imported, exported, queued, copied.
- Error: validation, permission, network, API quota, timeout, malformed data.
- Disabled: unavailable action with reason.
- Permission denied: role/capability limitations without exposing sensitive data.
- Destructive: confirmation, consequence, undo/backout if possible.
- Long content: long titles, translated strings, long URLs, high counts.
- Responsive: mobile, tablet, narrow editor sidebar, large desktop.

## Visual Quality Bar

Avoid generic AI-looking UI:

- Pick one visual direction and make spacing, type, borders, shadows, and states coherent.
- Do not default to purple gradients, dark mode, glassmorphism, or oversized bento cards unless the product context justifies it.
- Use contrast, spacing, and typography for hierarchy before decoration.
- Keep icon style consistent. Prefer WordPress icons in admin/editor contexts.
- Use whitespace to group related controls and separate sections.
- Prefer one primary action per screen or panel.
- Reduce chrome around content-heavy workflows.
- Make errors and recovery paths visually obvious without panic styling.

## Motion And Interaction

- Motion must explain cause and effect: opening, closing, saving, expanding, sorting, filtering, progressing.
- Keep common transitions between 150ms and 300ms.
- Use transform and opacity, not layout-changing properties.
- Respect `prefers-reduced-motion`.
- Provide immediate press/click feedback for async actions.
- Never block input only to finish a decorative animation.

## Forms And Settings

- Use visible labels; placeholders are examples, not labels.
- Put helper text under complex fields.
- Validate on submit or blur, not aggressively on every keystroke unless the field is clearly live-search.
- Show field-specific errors near the field and a top summary for large forms.
- Use progressive disclosure for advanced options.
- For API keys/secrets, show masked values, test connection, rotate/reset, and redacted diagnostics.
- For dangerous settings, explain consequence and provide confirmation.

## Tables, Dashboards, And Data UI

- Use tables for comparison and operations; cards for summaries and discovery.
- Provide search/filter/sort only when backed by efficient queries.
- Align numbers and use tabular figures where available.
- Show status, last updated, attempts, errors, and next action for operational records.
- Avoid color-only status. Use labels/icons/text.
- For charts, include legend, units, timeframe, empty/error state, and accessible text summary.

## UX Review Output

Return findings in this format:

```text
[P2] Primary action is visually equal to destructive secondary action
Context: Plugin settings screen
Impact: Users can trigger reset while intending to save, causing configuration loss.
Fix: Make Save the only primary button, move Reset into a danger zone with confirmation, and add explanatory helper text.
Validation: Keyboard tab order, screen reader label, destructive confirmation, mobile layout.
```

For brainstorming, return:

- Diagnosis.
- Recommended direction.
- Alternative directions and tradeoffs.
- WordPress implementation path.
- Validation checklist.
