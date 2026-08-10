# Frontend Design Taste

Use this as the one supporting reference when a WordPress site, theme, landing page, or product surface is functionally sound but needs a distinctive visual direction or an anti-template composition review. It is a judgment overlay, not a framework, component library, or substitute for source-visual parity.

Do not load it for tiny polish, exact screenshot/Figma implementation, routine wp-admin conventions, or dense operational UI. With a supplied target, keep `visual-to-wordpress-implementation.md` primary. For admin workflows, keep `ui-ux-pro-for-wordpress.md` primary. Never add a design system or animation dependency only to obtain an aesthetic.

## 1. Establish The Design Read

Before code, state a compact internal design read:

```text
Surface and mode: <site/theme/product surface>; <greenfield/preserve redesign/overhaul>
User and job: <primary user>; <task or decision>
Audience and trust: <buyer/visitor/operator>; <promotional/transactional/regulated>
Existing language: <tokens, type, assets, patterns, WordPress primitives>
Direction: <plain-language visual character>
Experience dials: expressiveness <1-10>; motion <1-10>; density <1-10>; trust <1-10>
```

Treat the dials as reasoning aids, not user-facing configuration or mechanical style generators:

- **Expressiveness:** restrained and conventional to experimental and asymmetric.
- **Motion:** static feedback to choreographed storytelling.
- **Density:** editorial and spacious to operational and information-rich.
- **Trust:** low-consequence promotion to accountable, permissioned, or regulated workflow.

Audience, accessibility, brand truth, task frequency, and operational risk override aesthetic preference. If two materially different readings remain plausible, ask one focused question. Otherwise proceed without a questionnaire.

For premium enterprise work, include one accountability read without loading another design reference: responsible role, operational risk reduced, governed workflow, proof shown, and failure/recovery behavior. A polished surface without those answers is not enterprise evidence.

For a brand-critical greenfield surface, major overhaul, or multi-page system, do not spend the full implementation budget on an untested direction. First produce the smallest representative direction artifact: a style frame, key section, or critical-flow prototype using truthful content and the intended WordPress primitives. Check it against the design read, brand, narrow-width behavior, and primary task. Obtain acceptance from the accountable product/design reviewer before scaling that direction. Skip this checkpoint for bounded preserve redesigns, exact approved targets, and low-risk polish.

## 2. Audit Before Redesign

For an existing surface, inspect before proposing:

- brand and semantic tokens, typography, radii, icon family, and real media,
- information architecture, primary journey, conversion or task path, and content ownership,
- signature patterns and language worth preserving,
- repeated or generic composition, weak hierarchy, dead space, filler, and performance traps,
- URL, navigation, form, analytics, SEO, consent, and editor contracts that cannot change silently.

Classify the work:

- **Preserve redesign:** keep brand, IA, content voice, and contracts; improve type, spacing, hierarchy, assets, and interaction in that order.
- **Overhaul:** a new visual language is approved, but content, data, URLs, permissions, analytics, and editing contracts still remain explicit decisions.
- **Greenfield:** derive the direction from audience, product evidence, content, and available assets rather than an agent-default aesthetic.

## 3. Compose Before Styling

Give every section or panel one job. Plan hierarchy, primary action, content, real asset, layout family, and narrow-width behavior before cosmetic treatment.

Check for agent-default repetition:

- centered hero plus generic supporting copy without a subject or product signal,
- three equal feature cards used without comparative meaning,
- every section using an eyebrow label, floating card, or identical split layout,
- nested cards, decorative pills, status dots, gradients, or borders that carry no semantics,
- fake dashboards, fake screenshots, invented customer marks, metrics, testimonials, or precision,
- marketing composition applied to repeated operational work,
- decorative motion that does not explain hierarchy, feedback, progress, or state.

These are diagnostic signals, not universal bans. Keep a familiar pattern when it fits the content, product conventions, accessibility, or measured task success. Correct generic output by returning to the content model and composition, not by adding novelty.

## 4. Preserve WordPress Ownership

Use the active project's tokens and components first. For WordPress surfaces, prefer Core blocks, verified plugin blocks, patterns, styles, variations, `theme.json`, `@wordpress/components`, `@wordpress/icons`, and existing project primitives before custom abstractions.

Site strategy and journey belong to `wp-site-expert`; theme tokens, templates, patterns, and editor/frontend presentation belong to `wp-theme-expert`; plugin admin/editor workflows belong to `wp-plugin-expert`. Visual polish never justifies frozen page markup, Custom HTML/Shortcode shortcuts, global admin CSS, duplicate React, or an unrelated frontend stack.

Real product screenshots and supplied or approved assets outrank decorative imagery. When an asset is missing, explicitly choose reuse, generation, sourcing/licensing, CSS/SVG for suitable non-factual geometry, or a labeled placeholder. Never fabricate brands, product states, customer proof, or factual screenshots.

## 5. Motion And Interaction Contract

For every material animation, record what it communicates: hierarchy, feedback, progress, spatial relationship, or narrative sequence. If no purpose is clear, remove it.

- Prefer the existing stack, then CSS or the smallest suitable dependency.
- Animate transform and opacity where practical; avoid layout thrash and continuous React state updates.
- Provide keyboard, touch/no-hover, reduced-motion, interrupted-state, and cleanup behavior.
- Do not use scroll hijacking, magnetic input, parallax, or perpetual loops as defaults.
- Preserve focus, reading order, input responsiveness, and browser navigation.

## 6. Taste Preflight And Proof

Before completion, verify:

- the design read and dials match the actual user, task, brand, and risk,
- hierarchy and primary action are obvious without decorative explanation,
- repeated layouts, cards, labels, and visual effects have content-driven reasons,
- type, spacing, color, radii, icons, and assets form one coherent language,
- all visible copy, metrics, logos, screenshots, and testimonials are truthful or clearly fixtures,
- empty, loading, error, disabled, permission, success, destructive, and long-content states are covered where applicable,
- mobile collapse is explicit and intermediate widths do not overlap, clip, wrap incoherently, or hide the next action,
- keyboard, focus, contrast, zoom/reflow, touch, and reduced motion pass for the changed surface,
- performance and asset behavior meet repository budgets,
- the visitor completes the primary task and the intended author/operator completes the editing or operational task,
- source and candidate screenshots, measurements, or browser evidence support every visual completion claim.

Visual and browser proof establish implementation quality, not excellent usability by themselves. For material onboarding, conversion, account, settings, publishing, or repeated operational journeys, apply the risk-tiered usability evidence in `ux-product-strategy-design-qa.md`. Without representative-user, product-signal, or equivalent outcome evidence, report the usability claim as unverified rather than upgrading a polished implementation to proven excellent UX.

An observed overlap, clipping, broken hierarchy, generic placeholder asset, inaccessible interaction, or editor/frontend divergence is a failed implementation, not a subjective proof gap. Fix the owning layer and rerun the smallest affected visual and workflow matrix.

## Output

Report the design read, preservation decisions, composition direction, WordPress ownership, changed visual system, proof surfaces, intentional deviations, and unresolved design decisions. Keep dial values and raw visual measurements in the implementation record rather than turning the user response into design-process narration.
