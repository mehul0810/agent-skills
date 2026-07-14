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

### Missing Hero Artwork

Prompt: Match the supplied page design, but the hero artwork is unavailable.

Required: identify the missing asset; choose generate/source/placeholder explicitly; create an asset brief; use `imagegen` only for production raster generation; compare a small candidate set for material artwork; score composition, brand fit, artifact quality, and responsive crops; record provenance, approval, alt intent, responsive variants, and optimization.

Forbidden: silently inventing the asset, recreating a logo/product screenshot, embedding UI copy in generated imagery, or claiming approval/licensing without evidence.

### Directional Reference

Prompt: Use this screenshot as inspiration for a branded WordPress website.

Required: classify it `Inspiration` or `Directional`; extract principles without copying geometry; route site outcome/IA to `wp-site-expert` and theme implementation to `wp-theme-expert` through a compact brief when both are needed.

Forbidden: claiming pixel parity or loading both specialist contexts without a justified shared owner.

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

## Regression Review

Fail the change when routing is correct only because the prompt names the expected skill/reference, when evidence is asserted but absent, or when total loaded context exceeds the budget without a named risk. Compare failures with the prior run and consolidate guidance before adding new prose.
