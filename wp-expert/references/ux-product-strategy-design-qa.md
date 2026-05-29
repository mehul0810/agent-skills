# UX Product Strategy And Design QA

Use this when WordPress work needs more than component placement: UX discovery, product strategy, information architecture, UX writing, conversion flows, design critique, usability testing, enterprise/premium design QA, or pixel-faithful implementation from an image, screenshot, mockup, Figma frame, or visual reference.

Use alongside `ui-ux-pro-for-wordpress.md` for UI implementation, `conversion-focused-website-engineering.md` for landing pages and funnels, `analytics-measurement-engineering.md` for measurement, `wordpress-design-system.md` for wp-admin/editor components, `style-guide-theme-translation.md` for tokens and theme translation, and `visual-parity-regression.md` for screenshot evidence.

## Non-Negotiables

- Understand the user's job before implementing UI. A polished wrong workflow is still wrong.
- Never compromise on premium and enterprise feel when the project positioning requires it.
- If a design image, screenshot, Figma frame, or visual reference is provided, treat it as the visual source of truth unless the user says it is conceptual only.
- Match provided designs as closely as practical while preserving accessibility, responsive behavior, WordPress editability, performance, and maintainability.
- Do not invent generic AI-looking layouts when a brand, style guide, design system, or reference image exists.
- Do not use visual polish to hide unclear requirements, missing states, poor hierarchy, inaccessible contrast, or fragile implementation.

## Discovery Inputs

Before substantial UI/UX implementation or review, identify:

- Business objective: lead, sale, publish, configure, recover, monitor, approve, migrate, compare, learn, or support.
- Users and roles: anonymous visitor, customer, subscriber, author, editor, shop manager, admin, network admin, support team, developer, or compliance reviewer.
- Primary job: the one task the screen must make easier.
- Entry points: wp-admin menu, editor sidebar, Site Editor, frontend page, email link, dashboard widget, onboarding, search result, or external campaign.
- Success path: shortest safe path from entry to completion.
- Failure path: permission denied, empty state, invalid input, external API down, quota exceeded, slow job, missing data, abandoned checkout, or unsupported role.
- Source of truth: style guide, design tokens, Figma, screenshot, reference site, existing theme, parent theme, brand guide, component library, or WordPress core pattern.
- Constraints: WordPress version, editor mode, active theme, mobile breakpoints, localization, RTL, accessibility, performance budget, privacy, and enterprise approval workflow.

## Product UX Workflow

1. Define the problem in one sentence and reject scope drift that does not support it.
2. Map the user journey: trigger, screen sequence, decisions, system feedback, completion, and recovery.
3. Establish UX acceptance criteria before coding: task completion, states, responsive behavior, accessibility, performance, and visual fidelity.
4. Choose the WordPress surface: settings page, list table, dashboard, document panel, inspector panel, Site Editor template, pattern, block, frontend template, or plugin-owned app surface.
5. Build information architecture: navigation, grouping, headings, filters, breadcrumbs, progressive disclosure, and deep links.
6. Write UX copy: labels, helper text, empty states, error messages, success messages, confirmations, and onboarding copy.
7. Select the implementation layer: core components, WPDS, theme tokens, patterns, template parts, block supports, custom block, REST-backed React app, or server-rendered PHP.
8. Validate with the smallest reliable evidence set: diff, screenshot, keyboard path, responsive viewport, state matrix, or user/task walkthrough.

## Information Architecture

- Organize by user mental model, not database tables, classes, or plugin modules.
- Keep one clear primary action per screen or workflow step.
- Put dangerous/destructive actions in a separated danger zone with consequence copy and confirmation.
- Use progressive disclosure for advanced settings, diagnostics, developer tools, and rare recovery actions.
- For large admin data sets, provide search, filters, sorting, saved views, pagination, bulk actions, and export only when backed by efficient queries.
- For frontend sites, preserve wayfinding: clear navigation, active states, breadcrumbs where useful, search, related content, and predictable back paths.
- For block themes, map content hierarchy into templates, template parts, patterns, Query Loop surfaces, and reusable sections before styling.

## UX Writing And Content Design

- Labels must describe the user's action or data, not internal implementation.
- Helper text explains consequences, requirements, cost, privacy impact, cache impact, or irreversible behavior.
- Empty states answer: what this is, why it matters, and the next best action.
- Error messages should be specific, recoverable, and safe; never leak secrets, PII, stack traces, internal paths, or raw provider payloads.
- Success messages should confirm the result and next step, especially for async jobs, imports, exports, and external API actions.
- Confirmation copy for destructive actions should name the object, consequence, reversibility, and required permission.
- Keep strings concise and translatable. Avoid idioms and layout-dependent copy that breaks in localization.

## Premium And Enterprise Feel Rubric

Score every serious design or UI implementation against these dimensions:

- Typography: deliberate scale, hierarchy, rhythm, readable line length, consistent weights, and no accidental browser/default feel.
- Spacing: systematic vertical rhythm, aligned edges, consistent gutters, touch-safe targets, and no arbitrary nudging.
- Layout: strong composition, clear scan path, responsive behavior, stable alignment, and no awkward orphan elements.
- Visual density: enough information for expert users without crowding; enough whitespace for clarity without looking empty.
- Color: semantic use, accessible contrast, restrained palette, clear affordances, and no unjustified purple/dark/glass defaults.
- Components: consistent borders, radii, elevation, icons, focus states, hover states, disabled states, loading states, and error states.
- Motion: meaningful cause/effect, 150-300ms for common transitions, transform/opacity preferred, and reduced-motion support.
- Brand fidelity: matches the project's visual language, imagery, tone, and design-token model.
- WordPress fit: admin/editor surfaces feel native unless a branded app surface is intentional and isolated.
- Engineering fit: tokenized, scoped, performant, accessible, maintainable, and not dependent on fragile one-off CSS.

If any dimension is weak, either fix it or report the gap instead of claiming the design is complete.

## Image, Screenshot, And Mockup Matching

When the user provides a design image or screenshot:

1. Identify the image's role: exact target, inspiration, rough wireframe, style reference, or bug screenshot.
2. Extract measurable details: canvas size, grid, breakpoints, spacing rhythm, content width, typography, colors, radii, shadows, borders, icons, imagery ratios, and interaction states visible in the image.
3. Map visual elements to WordPress primitives before custom code: `theme.json`, core blocks, WPDS components, patterns, template parts, block styles, variations, or scoped CSS.
4. Preserve the design's hierarchy, alignment, spacing, typography, and component states unless accessibility or responsive constraints require a documented adjustment.
5. Use pixel-perfect as the default target for static visual states, but do not sacrifice accessibility, responsive behavior, editor editability, performance, or semantic markup to chase brittle coordinates.
6. For raster-only images, infer missing states and breakpoints explicitly; do not pretend the image defines hover, focus, mobile, error, empty, or loading states unless visible or specified.
7. Capture candidate screenshots at matching viewport and zoom. Compare against the reference and classify differences as intentional, constrained, or regression.
8. If exact visual matching cannot be verified, state what was implemented, what evidence exists, and what remains user-review-only.

Pixel-parity checklist:

- Viewport, zoom, font loading, and content are aligned with the reference.
- Colors and typography are tokenized or otherwise traceable.
- Spacing, alignment, and dimensions are matched at the visible breakpoint.
- Images preserve crop, focal point, aspect ratio, and responsive behavior.
- Interactive elements include accessible hover, focus, active, disabled, loading, and error states even if the static image omits them.
- Editor and frontend parity is checked when blocks, patterns, templates, or Site Editor surfaces are involved.

## Conversion And Funnel UX

Use this for marketing pages, lead generation, checkout, onboarding, sign-up, upgrade, pricing, demo request, or account flows.

- Identify the conversion event and user intent before changing design.
- Remove unnecessary fields, steps, choices, and distractions before adding new UI.
- Use trust signals where they reduce real anxiety: security, privacy, refund policy, testimonials, logos, guarantees, transparent pricing, support expectations, and delivery timing.
- Make primary CTAs clear, specific, and repeated only where helpful.
- Preserve SEO and accessibility while optimizing for conversion; do not hide content in inaccessible widgets.
- For experiments, define hypothesis, success metric, guardrail metric, duration, and rollback before implementation.

## Usability Testing And Heuristic Review

For UX review, evaluate:

- Can the target user complete the primary task without documentation?
- Does the UI explain what changed after every action?
- Are errors recoverable without data loss?
- Is the keyboard path complete and predictable?
- Are empty, loading, permission-denied, and external-failure states useful?
- Does mobile preserve the same task success path as desktop?
- Does the design scale to real content, translated strings, long names, missing media, and high counts?

Severity guide:

- P1: user cannot complete the primary task, loses data, triggers irreversible action, or cannot use the UI with assistive technology.
- P2: task is confusing, slow, error-prone, inaccessible in a common state, or visually inconsistent enough to reduce trust.
- P3: polish, microcopy, layout consistency, minor state coverage, or documentation gap.

## Design System Governance

- Treat design tokens as contracts. Prefer semantic tokens and stable names over raw design-tool labels.
- Keep component variants purposeful and documented: default, primary, secondary, destructive, compact, loading, disabled, selected, and error where needed.
- Prevent drift between Figma, `theme.json`, CSS variables, block styles, WPDS components, and rendered output.
- Avoid one-off component forks when a token, block style, or variation solves the need.
- Document intentional deviations from WordPress core patterns, especially in admin/editor contexts.
- Keep patterns and template parts named for editors, not developers.

## Output Formats

For planning:

```text
Problem:
Target user:
Primary job:
Source of truth:
Acceptance criteria:
IA/navigation:
State matrix:
Premium/enterprise risks:
WordPress implementation layer:
Validation plan:
```

For design QA:

```text
[P2] Hero spacing diverges from the provided design at tablet width
Context: Frontend landing page, 768px viewport
Impact: The visual hierarchy collapses and the CTA loses prominence compared with the approved mockup.
Fix: Map the section gap to the semantic spacing token and adjust the tablet container rule, preserving mobile-first flow.
Validation: Compare reference and candidate screenshots at 360px, 768px, and 1440px; check keyboard focus and heading order.
```
