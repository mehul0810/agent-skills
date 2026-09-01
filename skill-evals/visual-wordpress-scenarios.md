# Visual To WordPress Forward-Test Scenarios

Use these scenarios after changing design, theme, site, plugin UI, routing, or learning guidance. Evaluate the agent response or implementation artifact, not only whether expected phrases exist.

## Scorecard

For each scenario record:

```text
Route selected:
Skills loaded:
References loaded:
Avoidable loads:
Source inspected: yes/no
Required evidence present: yes/no
Forbidden behavior present: yes/no
Result: pass/fail
Failure routed to:
```

Pass requires the correct specialist, one primary reference plus at most one justified support reference, all required evidence, and no forbidden behavior.

## Scenarios

### Exact Screenshot To Editable FSE Page

Prompt: Implement the supplied desktop screenshot as an editable block-theme page.

Required: inspect the image; classify it `Exact`; distinguish supplied/measured/inferred values; map regions and reusable components to WordPress primitives; keep page-owned body in Post Content; provide mobile inference/decision; record a deterministic capture fingerprint; compare matched source/candidate screenshots; prove the primary visitor and author editing workflows.

Forbidden: template-only visible body, Custom HTML/Shortcode shortcut, invented mobile/interaction design presented as supplied, evidence-free pixel-perfect claim, or completion without editor/frontend workflow proof.

### Inspiration Image Requires Direction Before Build

Prompt: Use this website screenshot as inspiration and create a premium WordPress website from it.

Required: classify `Derive`, inspect the actual image, build the compact source model, separate influence from product/brand truth, create visual alternatives with the references actually attached, and wait for a selected direction before implementation.

Forbidden: treating the screenshot as an exact target, starting WordPress/CSS implementation immediately, returning only a prose moodboard, silently ignoring the supplied image, or claiming a reference was attached when it was not.

### Ambiguous Improve Request Audits First

Prompt: Make this existing WordPress page screenshot better and implement it.

Required: classify the request as audit plus redesign rather than exact reproduction; audit the current hierarchy, task, responsive and accessibility risks with evidence limits; convert findings into a brief and visual direction; select the target before implementation; preserve verified WordPress ownership and contracts.

Forbidden: arbitrary taste changes, immediate CSS patching, inventing product evidence, or skipping target selection because implementation was also requested.

### Growth-Led Redesign Before Image Generation

Prompt: Improve and redesign this existing product or service page to grow organic traffic and sales.

Required: inspect and audit the current rendered page before generating imagery; create a compact brief covering audience, journey/search intent, useful content, conversion/CTA, objections, friction, trust, mobile path, SEO/analytics/form/consent/performance contracts, available evidence, ranked hypotheses, and measurement; label assumptions; preserve valuable ranking content and verified contracts; generate alternatives from the reviewed brief and wait for selection before implementation.

Forbidden: immediate image generation, aesthetic-only redesign, invented proof or uplift, claiming a tactic is proven without applicable outcome evidence, keyword stuffing, dark patterns, deleting useful ranking content, or loading every SEO/conversion reference at once.

### Cropped Reference Cannot Prove A System

Prompt: Recreate the full responsive page exactly from this compressed desktop crop.

Required: inspect the actual file; record crop/resolution limits; model only observable hierarchy, layout, tokens, components, and assets; mark mobile, hidden states, interactions, off-canvas content, fonts, and dynamic data as inferred or unknown; ask only a material unresolved question and otherwise use reversible hypotheses with validation.

Forbidden: claiming exact full-page or mobile knowledge, inventing missing assets/states, using OCR or sampled pixels as unquestioned truth, or hiding ambiguity with generic responsive CSS.

### Existing Design Language Extension

Prompt: Add a new pricing page that matches these existing product screenshots.

Required: classify `Extend`; audit reusable tokens, components, hierarchy, layout relationships, content and interaction patterns; distinguish existing-system evidence from the new page's unchosen composition; create/select a representative target, then map it to editable WordPress ownership.

Forbidden: cloning one screenshot into a different page purpose, designing directly in CSS without a target, adding unverified pricing/claims, or creating a parallel component system.

### Globalized And Adaptive Interface

Prompt: Implement this WordPress website for English LTR and Arabic RTL audiences with light/dark/system preferences and a premium enterprise interface.

Required: classify locale, direction, color scheme, preference, role, viewport, and browser dimensions; use `dir`/bidi markup and logical CSS; keep mixed-direction values isolated; define translation ownership/fallback, locale-aware formatting, cache/SEO variation, semantic light/dark tokens, user/system preference precedence, editor/admin/frontend parity, and safe unsupported fallbacks; prove representative LTR/RTL, expansion-heavy/non-Latin content, each supported scheme, forced colors/reduced motion where relevant, keyboard behavior, and no-flash/contrast/state integrity with exact environment evidence.

Forbidden: copying an LTR layout and only changing `text-align`, assuming language implies direction, mirroring all icons/media, hard-coding translated strings or text in images, claiming `theme.json` alone supplies dark mode, using one English screenshot as global proof, or silently omitting unsupported modes/locales.

### WordPress Design System Package Transition

Prompt: Add a new admin control while the target WordPress/Gutenberg versions expose different `@wordpress/components`, `@wordpress/ui`, and `@wordpress/theme` packages.

Required: identify whether the package is bundled or externalized; verify the target runtime exports, styles, and document; use Design System MCP, the maintained recommendation allowlist/denylist, or component story status in that order; preserve semantics, keyboard behavior, compatibility, and generated dependency metadata; use the correct `--wpds-*` or `--wp--preset--*` token family; test iframe/portal overlays where relevant.

Forbidden: mechanically migrating packages, importing private source paths, treating Storybook or installed types as runtime proof, copying a stale token inventory, or claiming editor styles cover another document.

### Existing Tailwind Surface Must Preserve WordPress Ownership

Prompt: Recreate the approved onboarding screenshot in a plugin React panel that already compiles Tailwind. Make it feel like a high-end modern app.

Required: inspect the installed Tailwind version, actual CSS entrypoint, build/source discovery, generated artifact, token owner, and Preflight scope; treat Tailwind as implementation vocabulary rather than the visual direction; keep the approved screenshot and product/design brief authoritative; use WordPress-native semantics and WPDS where the panel intersects wp-admin/editor; keep utility CSS isolated; use finite reviewed variant maps instead of runtime class construction; prove packaged desktop, narrow, and admin/editor coexistence with no reset leakage or missing production classes.

Forbidden: asking image generation for a `Tailwind-like` design, adding Tailwind only for aesthetics, assuming v3/v4 configuration, globally injecting Preflight, duplicating React/WordPress packages, replacing `theme.json`/block ownership with frozen utility markup, or claiming a development build proves the release candidate.

### Custom Widget Interaction Contract

Prompt: Build a searchable combobox inside a React WordPress admin modal with a tabbed results view.

Required: prefer native/WordPress primitives; if a custom widget is necessary, apply the relevant APG semantics and keyboard model, accessible naming, focus entry/trap/return, Escape behavior, popup ownership, selected state, loading/error/no-results states, portal/inert handling, and actual browser/assistive-technology proof.

Forbidden: click-only behavior, ARIA added to non-semantic markup without a contract, focus loss after close, hover-only access, or treating an axe report/screenshot as task proof.

### Enterprise Form Recovery

Prompt: Add a settings save flow that must survive slow networks, retries, two browser tabs, and a partially failed multi-step update.

Required: classify consequence; preserve dirty input; prevent duplicate submission; use server idempotency for retryable remote writes; detect stale versions/ETags and surface conflicts; report partial success per step; define timeout/offline/cancel/refresh recovery; require review/confirmation for high-consequence actions; prove default, pending, error, retry, conflict, and recovery states.

Forbidden: silent last-write-wins, false global success after partial failure, discarded input, client-only authorization, or adding concurrency ceremony to a low-risk local-only control without evidence.

### Browser And Assistive Technology Matrix

Prompt: Declare this admin redesign enterprise-compatible after one passing Chromium screenshot.

Required: locate or create the concise repo support matrix; name supported/best-effort/unsupported browser-engine and browser/assistive-technology cells, WordPress/editor surface, fallback, owner, and verification date; capture the packaged candidate for each affected supported cell and state skipped-cell risk.

Forbidden: inferring Firefox, WebKit, mobile, screen-reader, or editor compatibility from Chromium-only proof, or hiding unsupported cells in a generic pass claim.

### Token Integrity And Proof Provenance

Prompt: Add a premium case-study section with a product screenshot, security metric, and customer outcome.

Required: trace tokens/components from their canonical source to rendered output; classify each visual/proof element as real, controlled demo/fixture, or illustrative; record source owner, measurement window, audience/role, claim scope, and limitations; fail unowned token drift or unsupported enterprise claims.

Forbidden: near-duplicate raw tokens, invented scale/certification/customer identity, or using a polished fixture to imply production evidence.

### Missing Hero Artwork

Prompt: Match the supplied page design, but the hero artwork is unavailable.

Required: identify the missing asset; choose generate/source/placeholder explicitly; create an asset brief; use `imagegen` only for production raster generation; compare a small candidate set for material artwork; score composition, brand fit, artifact quality, and responsive crops; record provenance, approval, alt intent, responsive variants, and optimization.

Forbidden: silently inventing the asset, recreating a logo/product screenshot, embedding UI copy in generated imagery, or claiming approval/licensing without evidence.

### Directional Reference

Prompt: Use this screenshot as inspiration for a branded WordPress website.

Required: classify it `Inspiration` or `Directional`; extract principles without copying geometry; route site outcome/IA to `wp-site-expert` and theme implementation to `wp-theme-expert` through a compact brief when both are needed.

Forbidden: claiming pixel parity or loading both specialist contexts without a justified shared owner.

### Existing Site Screenshot To Editable Page

Prompt: Rebuild this approved screenshot inside the existing WordPress site so a non-technical editor can manage the page.

Required: route directly to `wp-site-expert` with the visual implementation contract; inspect the screenshot and active site/theme/plugin block inventory; map site outcome, theme structure, and page content ownership; build the complete saved block composition; prove matched visitor behavior and the intended author edit/save/reopen/preview workflow.

Forbidden: generic UX advice without implementation, an indirect broad-router detour, frontend-only CSS concealment, hard-coded page body, Custom HTML/Shortcode shortcuts, or screenshot proof without author proof.

### Native Block Boundary

Prompt: Recreate a complex repeated card interaction from the supplied design.

Required: test core blocks, styles, patterns, variations, bindings, and existing blocks before a custom block; document why a custom block is required if selected; preserve editing constraints and states.

Forbidden: one frozen custom block, raw HTML, shortcode, or a custom block solely for spacing/style.

### WordPress.org Theme Custom Block Boundary

Prompt: Publish this block theme to the WordPress.org Theme Directory and add a custom pricing block required by the design.

Required: classify the distribution target first; verify current directory rules; keep design presentation in the theme; move the custom block and durable content contract to a companion plugin; include Theme Check, theme-switch portability, and packaging validation.

Forbidden: shipping the custom block, shortcode, CPT, form, or plugin territory inside the directory theme because it is visually theme-specific.

### Exact Visual With Custom Block Architecture Risk

Prompt: Match this screenshot exactly as an editable FSE page; one interaction may require a custom block.

Required: use the visual contract as primary and either block architecture or detailed custom-FSE architecture as the single support reference, chosen for the confirmed risk; keep deterministic capture, parity, visitor, and author proof from the primary contract; justify the custom block and its ownership without loading visual parity as a second support reference.

Forbidden: skipping architecture or visual proof, loading both custom FSE and visual parity support references, or creating a frozen page-sized block.

### Enterprise Theme Content And Responsive Stress

Prompt: Approve this visually matched enterprise block theme after checking only 360px and 1440px screenshots.

Required: reject insufficient proof; run an intermediate continuous resize sweep; select affected Theme Unit Test Data/template cases; test long/translated copy, missing media, query/error states, keyboard and touch/no-hover behavior, reflow, target browser risks, and repo-specific performance budgets.

Forbidden: equating two screenshots with mobile-first resilience, browser compatibility, WCAG 2.2 AA, or production readiness.

### Site Editor Design Promotion

Prompt: The approved header, template part, and Global Styles look correct in the Site Editor but exist only as database overrides; make the repository theme production-ready for clean installs.

Required: inventory and back up the resolved `wp_template`, `wp_template_part`, and `wp_global_styles` inputs plus referenced `wp_navigation`, synced-pattern, media, and other numeric IDs; map them to reviewed `templates/*.html`, `parts/*.html`, and default `theme.json` or an intentional style variation; resolve or migrate nonportable references; inspect a release artifact built from an identified commit; prove clean-install source resolution with no missing database entity, matched frontend rendering, and Site Editor edit/save/reload without a user-origin override supplying the design; preserve or migrate existing-site customizations through an owner-approved dry run and rollback path.

Forbidden: claiming production readiness while the source database still supplies the design, silently deleting overrides, trusting generated export output without review, or substituting source-site screenshots and a working-tree diff for packaged clean-install proof.

### Unavailable Design Capability

Prompt: Explore visual alternatives, but a named Product Design helper is unavailable.

Required: discover capabilities, inspect product evidence, create a compact context brief, and use the nearest available ideation route.

Forbidden: inventing `product-design:get-context`, claiming the design pass is impossible without recovery, or skipping evidence inspection.

### Hallucinated WordPress Contract

Prompt: Use a suggested WordPress hook or block support whose existence is uncertain.

Required: verify installed source or current official documentation; label unresolved uncertainty; choose a supported alternative when unverified.

Forbidden: fabricated hook/support/API, fabricated source link, or a compatibility claim without version evidence.

### Owner Correction Learning

Prompt: The owner says the visual implementation is wrong because page content is not editable.

Required: correct immediate ownership, classify the failure, dedupe existing guidance, route product-specific learning to repo docs or cross-product learning to the self-improvement loop, and add/update an eval only when repeatable.

Forbidden: chat-only apology, adding duplicate prose, or fixing output without testing Pages > Edit and frontend behavior.

### Broken Candidate Proof During Implementation

Prompt: The implementation screenshot visibly shows an overlapping header, clipped CTA, and broken mobile stack. The worker says the task is done but acknowledges the mistake and promises to fix it next.

Required: mark visual proof `FAIL`; keep the task open; classify the highest owning cause before editing; repair the source layer rather than adding screenshot-specific offsets; re-render the failed state; rerun the affected editor/frontend and viewport regression set; and report completion only after clean evidence. After two failed repair-and-proof cycles, recheck source assumptions, ownership, component constraints, and architecture before escalating an exact external blocker or material decision.

Forbidden: apology-only handoff, `done` or PR-ready claim, treating the observed defect as a proof gap, asking the owner to approve an ordinary reversible fix, blind CSS nudging, or showing only the repaired viewport without regression proof.

### Generic SaaS Composition Without A Target

Prompt: Build a premium landing page for a WordPress workflow product. No screenshot or chosen visual direction exists.

Required: route to `wp-site-expert`; inspect product, audience, brand, content, and existing assets; use `frontend-design-taste.md` as the one support reference; record a compact design read with expressiveness, motion, density, and trust; give each section a content-driven job and layout; implement with WordPress-native ownership; prove intermediate widths and visitor/author workflows.

Forbidden: default centered gradient hero plus three equal feature cards, invented customers/metrics/screenshots, installing a new frontend system for its aesthetic, or loading exact-parity guidance without a target.

### Preserve Redesign Without Contract Drift

Prompt: Modernize an established branded WordPress site while preserving recognition and current conversion behavior.

Required: classify `preserve redesign`; audit brand tokens, IA, copy voice, real assets, URLs, forms, analytics, SEO, consent, accessibility, and editor ownership before changes; improve typography, spacing, hierarchy, assets, then interaction; identify every intentionally changed contract; compare current and candidate behavior.

Forbidden: silent route/nav/form/analytics changes, replacing the brand with a preferred aesthetic, rewriting content without scope, or treating existing assets and tokens as optional.

### Operational Dashboard Rejects Marketing Taste

Prompt: Make a frequently used WordPress queue operations dashboard feel premium and less generic.

Required: keep `ui-ux-pro-for-wordpress.md` primary; prioritize scanability, density, status, filters, permissions, failure/retry, keyboard use, and query performance; use existing WordPress/product components; apply only compatible coherence and anti-repetition checks.

Forbidden: routing the whole task through `frontend-design-taste.md`, replacing tables with marketing cards, adding cinematic motion, hiding operational detail for visual minimalism, or changing workflow semantics for novelty.

### Motion Proposal Needs A Contract

Prompt: Add premium scroll animation and magnetic buttons to a WordPress product page.

Required: state what each proposed animation communicates; inspect existing product motion tokens and the performance budget; reject unjustified effects; choose evidence-based durations rather than a universal range; provide keyboard, touch/no-hover, reduced-motion, cleanup, and interruption behavior; prove input response and layout stability.

Forbidden: motion because it looks expensive, default scroll hijacking, continuous React state updates, adding multiple animation libraries, or completion without reduced-motion and touch evidence.

### Packaged Immersive UI Uses Stable Components

Prompt: Approve this immersive plugin onboarding redesign from development screenshots; it replaces standard controls with custom ones and the release ZIP has not been installed.

Required: inventory stable Core/WPDS components before bespoke controls; require a functional and maintenance rationale for each custom replacement; define meaningful static, reduced-motion, reduced-data, unsupported-browser, and failed-media behavior plus lifecycle cleanup and removal/rollback; install the packaged ZIP and bind its digest/version/environment to the visual receipt and candidate captures.

Forbidden: custom controls for novelty alone, animation/media as the only path to content or task completion, development-server screenshots as release proof, or a package path with no digest-bound installed-candidate evidence.

### Sparse Brief Cannot Create Proof

Prompt: Create a visually rich new product page. No logo, screenshots, customer list, testimonial, or metrics were supplied.

Required: distinguish known content from missing assets; use truthful product evidence; choose reuse, generation, licensed sourcing, suitable non-factual geometry, or labeled placeholders per asset; keep claims and fixtures explicit; ask one focused question only if direction materially diverges.

Forbidden: invented customer logos, generated factual product screenshots, fabricated testimonials or metrics, fake precision, or presenting fixtures as production proof.

### Polished But Repetitive Candidate

Prompt: Approve a responsive page whose eight sections all use floating cards, eyebrow labels, and alternating image/text splits.

Required: fail taste preflight; map each section's content job; retain familiar patterns where meaningful; recompose repeated sections into a coherent but varied hierarchy; rerun intermediate-width, content-stress, visitor, and author proof.

Forbidden: approving because spacing and colors are polished, applying a mechanical ban without reading content, or adding decoration instead of correcting composition.

### Exact Target Must Not Be Reinterpreted

Prompt: Match this approved Figma frame exactly, but make it look less templated using the design-taste rules.

Required: keep `visual-to-wordpress-implementation.md` primary; treat the approved target as design authority subject to accessibility, responsiveness, and WordPress ownership; use taste guidance only to flag an adjacent concern, not reinterpret geometry or brand; measure and compare source/candidate evidence.

Forbidden: changing the target's centered hero, typography, palette, or composition because of generic anti-pattern guidance; stacking unrelated references; or claiming improvement instead of parity.

### Taste Proof Across Intermediate Widths

Prompt: The new premium WordPress page passes screenshots at 375px and 1440px. Approve it.

Required: reject endpoint-only proof; resize continuously through affected ranges; test long and translated copy, CTA wrapping, navigation, missing/extreme media, zoom/reflow, touch/no-hover, and reduced motion; prove editor/frontend parity and primary workflows.

Forbidden: equating two polished screenshots with robust composition, using device-specific offsets, or treating visible overlap/clipping as subjective taste.

### Plugin-Owned Product Surface Routing

Prompt: Build a premium onboarding and settings experience plus a customer-facing results view inside this plugin. No design target exists.

Required: keep ownership in `wp-plugin-expert`; separate admin/editor and customer-facing artifacts; use `ui-ux-pro-for-wordpress.md` for the admin workflow with `wordpress-design-system.md` only for a confirmed component risk; use `frontend-design-taste.md` for the customer-facing direction in a separate stage; preserve one compact product/design brief and prove both workflows.

Forbidden: routing plugin-owned UI to site/theme ownership, loading all design references together, applying marketing composition to operational settings, or creating custom admin components before checking WordPress primitives.

### Excellent UX Requires Outcome Evidence

Prompt: The onboarding looks polished and its Playwright flow passes. Call it excellent UX and approve it.

Required: separate implementation proof from usability proof; classify the journey risk; for material onboarding observe representative users or a valid proxy on realistic tasks and record completion, wrong turns, assistance, errors/recovery, and time-to-value; add trustworthy support, funnel, or rollout signals for high-consequence work; otherwise state the exact usability proof gap.

Forbidden: treating screenshots, parity, accessibility automation, or an engineer walkthrough as proof of excellent UX; inventing research or analytics; or demanding an exhaustive research program for a low-risk familiar pattern.

### Material Greenfield Direction Checkpoint

Prompt: Build the entire new enterprise WordPress marketing site from this sparse brief and choose the visual direction yourself.

Required: inspect truthful product, audience, brand, content, and asset evidence; record the design read; create the smallest representative style frame, key section, or critical-flow prototype using intended WordPress primitives; test brand, narrow-width, and task fit; obtain accountable direction acceptance before scaling the visual system and full implementation.

Forbidden: building every page before validating direction, inventing proof to fill the sparse brief, treating a generated aesthetic as brand approval, or imposing the checkpoint on exact approved targets and bounded polish.

### Exact Plugin Customer Surface

Prompt: Implement this approved screenshot as a plugin-owned customer results view and matching admin configuration screen.

Required: route to `wp-plugin-expert` with `visual-to-wordpress-implementation.md` primary; inspect the actual source; preserve plugin ownership for both surfaces; map admin controls to WordPress-native components and the customer view to the product design system; bind exact source/candidate evidence; prove operator and customer workflows.

Forbidden: routing the customer surface to site/theme ownership, using frontend taste to reinterpret the approved target, or skipping exact visual proof because the UI is plugin-owned.

### Structured Figma Source

Prompt: Implement the selected Figma node exactly in an editable WordPress page.

Required: discover the available Figma context capability; retrieve exact file/node/version, variables, components, assets, fonts, constraints, and interaction evidence before implementation; record a Figma source fingerprint; keep WordPress block/content ownership with the specialist; use an inspected export with a declared limitation only when structured access is unavailable.

Forbidden: treating the Figma URL as a filename, implementing from memory or a thumbnail when structured context is available, inventing hidden tokens, or letting a generic image-to-code result bypass WordPress editability.

### Visual Receipt Rejects Broken Candidate

Prompt: An exact page has desktop and mobile screenshots, but mobile overlap remains and the author workflow was not tested. Mark the visual proof complete.

Required: write the structured visual proof receipt; bind source/candidate fingerprints, captures, required roles, and all gate dispositions; record the overlap as unresolved and the missing author workflow as blocked; run `validate-visual-proof.mjs`; return `FAIL` or `blocked`, repair, then regenerate evidence before any pass.

Forbidden: prose-only pass, empty screenshot paths, mutable candidate identity, accepted deviation without rationale/evidence, or changing the manifest merely to make validation green.

### Interactive Block Client Navigation

Prompt: Add an interactive filter block that persists state while navigating between router regions.

Required: verify supported runtime capabilities; keep semantic server-rendered fallback and server authority; define namespace/context/actions and all async states; prove hydration, duplicate-instance isolation, stale-request handling, Back/Forward, refresh, deep links, region asset lifecycle, focus/announcements, no-JS behavior, editor save/reload, and INP/script budgets.

Forbidden: global page hydration for one block, click-only navigation, duplicated listeners after region replacement, client-side permission decisions, experimental full-page routing without support evidence, or Chromium happy-path proof only.

### Multi-Step WCAG Flow

Prompt: Approve a three-step plugin onboarding flow that asks for the site URL twice and moves support help between steps.

Required: apply WCAG 2.2 Consistent Help and Redundant Entry where applicable; retain or offer previously entered data; keep repeated help in a consistent relative order; prove labels/errors/focus with keyboard and a named supported browser/assistive-technology pair; test narrow viewport and recovery.

Forbidden: treating repeated entry as harmless, reporting an unspecified screen-reader pass, or approving from axe output alone.

### Multi-Surface Coverage Cannot Be Inferred

Prompt: Approve an exact plugin redesign containing onboarding, settings, and customer results. The receipt has mobile onboarding, desktop settings, and no customer-results capture.

Required: declare every changed surface plus required capture, workflow, and environment IDs before proof; require narrow, intermediate, and desktop coverage for each responsive surface; bind every required environment; reject the receipt until customer-results evidence and all required surface/state coverage exist.

Forbidden: treating unrelated endpoint captures as one responsive pair, inferring an uncaptured surface from shared CSS, dropping a scoped surface to make validation pass, or accepting a browser-compatibility claim without its declared environment evidence.

### Vague Evidence Cannot Pass

Prompt: The visual receipt says screenshots, accessibility, browser compatibility, and workflows "look good" but provides no artifact paths, URLs, or fingerprints. Mark it complete.

Required: reject non-locatable evidence; bind each screenshot, comparison, report, trace, manual record, package, and gate to a local immutable artifact plus SHA-256 fingerprint of its actual bytes; download remote evidence before validation; keep source, candidate artifact, and revision identities immutable; validate nested asset receipts and rerun the receipt validator.

Forbidden: accepting prose assertions, empty or mutable links, fabricated or stale digests, a package path without candidate binding, a linked asset receipt whose identity/result disagrees with its contents, or treating schema shape alone as aesthetic proof.

### Generated Asset Receipt Rejects A Near Miss

Prompt: Use the generated hero image even though it misses the requested text-safe crop, contains accidental lettering, and has no approval or provenance record.

Required: keep the asset-generation brief and source/tool version; compare a small candidate set; reject the near miss; bind selected/rejected reasons, target crops, deliverables, provenance, rights, optimization, and accountable approval in the asset-production receipt; link the passing receipt from visual proof before completion.

Forbidden: compensating with CSS crop offsets, silently editing the brief after generation, claiming approval or licensing, embedding unverified text, or marking an undersized/failing crop as pass.

### Elevated Design Token Drift

Prompt: Approve a multi-surface redesign where Figma, theme.json, CSS variables, and block styles use different spacing and color values, but each screenshot looks acceptable by itself.

Required: classify elevated token risk; bind the repo design contract; trace affected semantic tokens from canonical source through every implementation surface; distinguish aligned values from evidenced intentional deviations; fail unowned values or drift and repair the owning token layer before reproof.

Forbidden: approving screenshot-by-screenshot inconsistency, copying raw Figma labels into production, adding duplicate tokens, or marking a deviation intentional without evidence and rationale.

### Fixed Defect Requires Reproof

Prompt: A P2 mobile overlap was reported and the CSS changed. Mark it fixed without preserving the failed screenshot or rerunning the affected workflow and viewport matrix.

Required: keep one defect ID with severity, observed evidence, and fixed evidence; rerender the failed state and the smallest affected surface/workflow/environment matrix; prohibit P1/P2 acceptance into a pass; allow only an explicitly approved, evidenced P3 deviation.

Forbidden: deleting failure history, replacing the receipt with only the final screenshot, accepting P1/P2 defects, claiming a CSS diff proves behavior, or asking the owner to waive an ordinary repairable defect.

### Editable WordPress Typography System

Prompt: Make this editorial WordPress site feel premium. Pick two fashionable Google Fonts, add arbitrary fixed heading sizes, stretch paragraphs across the container, tighten all letter spacing, and fix the frontend with CSS; authors do not need matching editor presets.

Required: route to the site/theme owner with `wordpress-typography-system.md` for the confirmed type-system risk; inspect real content, actual font files/rights, supported scripts, ambiguous glyphs, and runtime ownership; define a minimal semantic scale and justified family roles; expose named bounded presets through `theme.json` or the canonical product token owner; tune measure, leading, and heading tracking against the rendered face rather than universal ratios; preserve semantic hierarchy; prove font/fallback loading, intermediate/mobile reflow, long and translated content, RTL where supported, 200% resize, all WCAG text-spacing overrides together, and editor save/reopen/frontend parity.

Forbidden: choosing from placeholder text or fashion alone, treating `45-75ch`, a modular ratio, x-height, or negative tracking as a universal pass rule, loading unnecessary families/weights, global font overrides of wp-admin, frontend-only typography, hiding arbitrary values behind near-duplicate tokens, or claiming quality from one desktop screenshot.

### Parent Stretch Is Not Child Padding

Prompt: These card insets match the design token, but the text still looks vertically misaligned. Keep reducing child padding until the screenshot looks right.

Required: route the confirmed spatial risk to `spatial-layout-and-alignment-system.md`; inspect the parent and child computed geometry; identify Grid/Flex stretch, track sizing, baseline, or distribution before changing the child; define the intended anchor and semantic inset/group relationship; preserve the canonical WordPress token owner; capture parent layout plus edge/baseline measurements; reprove varied card content at narrow, intermediate, and desktop widths.

Forbidden: repeated child-padding nudges, negative margins, fixed heights, endpoint screenshots without computed parent evidence, or declaring the token wrong when the parent layout causes the symptom.

### Spatial Hierarchy Is Not A Mechanical Grid

Prompt: Make this block-based pricing section enterprise-grade by forcing every gap to the nearest multiple of eight and using the same spacing between all elements.

Required: treat 4/8 as a fallback heuristic only; derive semantic `inset`, `inline`, `stack`, `group`, `section`, and `gutter` roles from content relationships; preserve `related gap < group gap < section gap`; choose layout primitives by relationship; test short/long/translated/RTL content, missing media, action wrapping, and compact workflow states; retrieve only one targeted current modern-web guide when a confirmed CSS platform question remains and verify browser policy/fallback.

Forbidden: equalizing every relationship, importing a utility framework aesthetic, loading a whole skills/catalog corpus, using new CSS merely for novelty, creating near-duplicate tokens, or fixing a wrong block/template tree with frontend-only CSS.

### Independent Spatial Proof Rejects A Polished Near Miss

Prompt: I implemented the selected homepage image and the desktop screenshot looks polished. Approve it from my own visual review even though intermediate width was not measured and repeated cards use different left edges.

Required: keep the selected-target implementation route primary and use the spatial system as the single support; bind target, candidate revision, implementer, semantic roles, anchors, parent-layout risk, environments, expected authority, actual values, tolerances, and contained immutable evidence in `wordpress-spatial-proof.schema.json`; run `validate-spatial-proof.mjs`; keep selected-target risk at least material and responsive; require narrow/intermediate/desktop measurements, measured hierarchy values, alignment anchors, and content stress; use a different independent evaluator for material work; record the edge drift as `FAIL`, repair once, and reprove. After two failed repair cycles, record and execute `reopen_contract` instead of stacking CSS.

Forbidden: implementer-only approval, self-downgrading risk or responsive scope, derived geometry redefining an exact target, meaningless boolean hierarchy proof, screenshot-only evidence, false `pass` values, absolute/path-traversing evidence locators, treating an unexplained alignment delta as subjective variance, or continuing patch cycles without revisiting the contract.

## Regression Review

Fail the change when routing is correct only because the prompt names the expected skill/reference, when evidence is asserted but absent, or when total loaded context exceeds the budget without a named risk. Compare failures with the prior run and consolidate guidance before adding new prose.
