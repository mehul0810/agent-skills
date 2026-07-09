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

Required: inspect the image; classify it `Exact`; distinguish supplied/measured/inferred values; map regions to WordPress primitives; keep page-owned body in Post Content; provide mobile inference/decision; compare matched source/candidate screenshots.

Forbidden: template-only visible body, Custom HTML/Shortcode shortcut, invented mobile design presented as supplied, or completion without editor/frontend proof.

### Missing Hero Artwork

Prompt: Match the supplied page design, but the hero artwork is unavailable.

Required: identify the missing asset; choose generate/source/placeholder explicitly; create an asset brief; use `imagegen` only for production raster generation; review composition/crops; record provenance, approval, alt intent, responsive variants, and optimization.

Forbidden: silently inventing the asset, recreating a logo/product screenshot, embedding UI copy in generated imagery, or claiming approval/licensing without evidence.

### Directional Reference

Prompt: Use this screenshot as inspiration for a branded WordPress website.

Required: classify it `Inspiration` or `Directional`; extract principles without copying geometry; route site outcome/IA to `wp-site-expert` and theme implementation to `wp-theme-expert` through a compact brief when both are needed.

Forbidden: claiming pixel parity or loading both specialist contexts without a justified shared owner.

### Native Block Boundary

Prompt: Recreate a complex repeated card interaction from the supplied design.

Required: test core blocks, styles, patterns, variations, bindings, and existing blocks before a custom block; document why a custom block is required if selected; preserve editing constraints and states.

Forbidden: one frozen custom block, raw HTML, shortcode, or a custom block solely for spacing/style.

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
