# Admin UX, Product UX, And UI Improvement

Use this for WordPress admin screens, settings pages, onboarding, dashboard widgets, list tables, plugin UX, editor controls, frontend UI critique, and UX-centric brainstorming. For UX discovery, information architecture, UX writing, conversion flows, premium/enterprise design QA, or image/screenshot matching, also read `ux-product-strategy-design-qa.md`. For deeper product-grade visual QA and interaction-state coverage, also read `ui-ux-pro-for-wordpress.md`. For WordPress-native component/token mapping, also read `wordpress-design-system.md`.

## UX Workflow

1. Identify the user role, task, frequency, and risk of the screen or flow.
2. Map current path: entry point, primary action, secondary actions, validation, errors, success, empty states, and recovery.
3. Remove friction before adding UI: fewer required fields, better defaults, progressive disclosure, clearer labels, safer flows.
4. Preserve WordPress conventions unless the product has a strong design system.
5. Validate accessibility, responsive behavior, interaction states, and failure states.

## Admin Screen Principles

- Use WordPress admin layout conventions for standard plugin settings and operational screens.
- Put the primary action where WordPress users expect it; do not invent patterns for routine settings.
- Group settings by mental model, not internal implementation classes.
- Use descriptions to explain consequences, not restate labels.
- Show validation errors near the field and summarize at the top when useful.
- Provide explicit success states after saving, testing connections, importing, exporting, or queueing jobs.
- Use confirmation for destructive or irreversible actions.
- Avoid surprise remote calls on page load; make checks explicit or cache them.

## Editor UI Placement

- Classic editor post-edit fields should use WordPress meta boxes when the UI belongs to a post, page, or custom post type edit screen.
- Block editor document-level settings should use the document settings sidebar or a relevant document panel, not a classic meta box, unless preserving legacy compatibility.
- Block-specific controls should live with the block through inspector controls, block supports, `ToolsPanel`, or an appropriate block panel.
- New meta boxes should not appear in the block editor. Register or render them only for classic-editor contexts, or hide/migrate them when the post type uses the block editor.
- Do not put global plugin settings inside post editor panels. Use a plugin settings screen when the setting affects the site or integration globally.
- Do not force a custom full-screen React app for simple post metadata controls; match the editor surface users already understand.

## Settings UX

- Use sensible defaults and explain when a setting affects performance, privacy, cost, email deliverability, indexing, or cacheability.
- Hide advanced settings behind disclosure when most users do not need them.
- Test credentials with a dedicated action and redacted output.
- Never echo stored secrets. Show masked tokens and rotation/reset controls.
- Keep option names and API contracts stable when changing UI labels.

## List Tables And Operational UX

- Paginate and index queries behind list tables.
- Add filters/search only when supported by efficient queries.
- Bulk actions require nonces, capability checks, and clear result messages.
- Show status, attempts, timestamps, and last error for jobs/messages/imports.
- Make retry/resend actions object-level and permission-checked.
- Export actions should warn about PII and scope.

## Onboarding And Empty States

- Empty states should answer: what is this, why does it matter, what should I do next?
- Offer the smallest setup path first, then advanced configuration.
- Detect missing dependencies and explain exact remediation.
- Avoid blocking the whole admin if an external API is down.

## Notices And Errors

- Notices should be actionable and dismissible when persistent state is not required.
- Do not show noisy global admin notices on unrelated screens.
- Error messages should expose enough to fix the problem without leaking secrets or PII.
- Log technical details server-side with redaction and stable correlation IDs.

## Accessibility Checklist

- Form controls have labels, descriptions, and error associations.
- Keyboard-only users can reach every interactive element.
- Focus order follows visual/task order.
- Color is not the only indicator of state.
- Contrast meets expected accessibility standards.
- Dynamic notices announce appropriately when using JS-heavy interfaces.
- Modals trap focus and return it to the trigger.

## Frontend UI Improvement

When improving UI inside a WordPress site:

- Preserve theme spacing, typography, breakpoints, and component language.
- Check real content lengths, missing images, empty results, logged-in/logged-out states, and mobile navigation.
- Improve information hierarchy and task completion before adding visual effects.
- Keep performance in mind: avoid layout shifts, large assets, blocking scripts, and unnecessary client rendering.
- Validate changes in frontend and editor if blocks/templates are involved.

## Brainstorming Output Format

For UX brainstorming, return:

- Diagnosis: current friction or opportunity.
- Recommended direction: the most practical improvement.
- Alternatives: 2-3 options with tradeoffs.
- Implementation notes: WordPress hooks/screens/blocks/assets likely involved.
- Validation: what to test with users or smoke-check locally.
