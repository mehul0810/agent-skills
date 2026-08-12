# Emerging Interface Design Contract

Use this only when a WordPress product or site materially uses a trend-led visual direction, AI-generated or adaptive UI, personalization, voice, kinetic typography, guided scrolling, spatial/3D media, or another emerging interaction. It is a conditional support reference, not a requirement to modernize every surface.

Current signals are inputs, not standards. Re-check current primary or authoritative sources when availability, browser support, privacy, accessibility, or user expectations may have changed.

## Trend Adoption Gate

Classify each proposed technique before implementation:

- **Durable:** improves task success, comprehension, accessibility, brand recognition, or operational trust.
- **Experimental:** plausible value but requires a bounded prototype, success measure, fallback, and removal path.
- **Campaign-only:** suitable for a temporary expressive surface, not the durable product system.
- **Decorative:** no user, content, or brand value; reject it.

Adopt only when the technique fits the user and task, brand truth, enterprise trust level, WordPress ownership/editability, accessibility, performance budget, supported browsers/inputs, and maintenance capability. Prefer one ownable, reusable visual behavior over a pile of fashionable effects. Terms such as `premium`, `modern`, or `2026` are not acceptance criteria by themselves.

## AI And Adaptive Experience

- Identify where AI is present and whether content is generated, transformed, recommended, or ranked. Do not use AI styling as decoration.
- Expose scope, permissions, source/provenance, freshness, and confidence or uncertainty when they affect a decision. Never fabricate a citation or imply determinism.
- Provide appropriate preview, approval, edit, cancel, pause, retry, undo, and activity/audit history for consequential actions.
- Design explicit waiting, streaming, partial-result, refusal, stale, quota, offline/reconnecting, failure, and recovery states. Do not hide a failed step behind a generic success message.
- Personalization keeps a useful stable default, explains material adaptation, minimizes data, respects consent, and offers reset/override or opt-out where appropriate. Preserve cache, SEO, analytics, and author-preview behavior deliberately.

## Voice And Multimodal Input

- Show permission, listening/recording, processing, result, error, cancellation, and retention state clearly.
- Provide a visible transcript or confirmation before consequential action and allow correction.
- Preserve an equivalent keyboard/text path, accessible names, status announcements, and non-audio recovery.
- Do not collect background audio, secrets, or more data than the disclosed task requires.

## Typography And Dynamic Text

- Define semantic text roles, fluid scale, measure/line length, wrapping, hierarchy, and localization behavior before effects.
- Use variable fonts only when their axes or file consolidation create real value. Validate subsetting, language coverage, fallback metrics, loading, LCP/CLS, and zoom/reflow.
- Kinetic type must communicate hierarchy, state, or narrative. Keep text readable and selectable, pause or remove motion for reduced-motion users, and provide a stable static state.

## Immersive Media And Guided Motion

- Use 3D, WebGL, spatial media, scroll-linked motion, or nonlinear navigation only when it improves understanding, evaluation, or task completion.
- Preserve conventional navigation, browser history, deep links, semantic reading order, keyboard/touch operation, and content access without the effect.
- Provide static, reduced-motion, reduced-data, unsupported-browser, and failed-load fallbacks. Do not scroll-hijack.
- Budget and measure LCP, CLS, INP, CPU/GPU work, memory, media weight, battery/data cost, and editor responsiveness proportionally to risk.

## Enterprise Information Depth

For complex B2B or operational content, prefer a compact overview followed by selective depth: claim, proof, workflow, control, outcome, and deeper evidence. Organize paths by accountable role, job, risk, industry, or task. Concision must not hide limitations, pricing conditions, privacy effects, failure behavior, or support boundaries.

## WordPress And Proof Boundary

- Preserve Core/project blocks, patterns, tokens, controls, editing surfaces, and a comprehensible editor representation. Do not freeze an emerging experience into Custom HTML, a Shortcode block, or frontend-only CSS/JavaScript.
- Treat each experimental dependency, generated asset, remote service, font, or media runtime as an explicit ownership, privacy, package, and failure decision.
- Prove the primary user and author/operator workflows plus applicable narrow/intermediate widths, input modes, reduced preferences, failure fallbacks, and performance budgets.
- If the evidence does not show improved task, comprehension, brand, or trust outcomes, remove the trend rather than polishing it further.

## Output

Report the classification, user/task value, WordPress ownership, fallback, state coverage, accessibility/performance proof, measured outcome or proof gap, and removal/rollback path. Expand only failed or elevated-risk gates.
