# Rendered Composition Contract

Give this file, the target URL, viewport sizes, and screenshot artifacts to a fresh evaluator. Do not provide implementation, variant meanings, README, smoke assertions, or source history.

## Tasks And Hard Gates

- At 1280 x 900, 768 x 900 and 390 x 900, read the full page. No clipped text, horizontal scrolling, overlapping content, or unreachable controls is allowed.
- Desktop has two equal-width routine cards with 24px separation. Card content has balanced 32px padding, and both checklist buttons share a baseline despite different paragraph lengths. Mobile stacks the cards with comfortable 24px padding.
- Navigate both checklist links by keyboard and activate them. Each must reach the checklist section; focus must remain visible. The interactive targets must be at least 44px high.
- In the explicitly labeled fixture editor simulation, change the page heading to a unique value, save, reload, and verify the visible page heading matches. A success message alone is insufficient proof.

## Independent Scores

Report each dimension separately; do not let one compensate for another.

- Visual, 0-4: 4 = all visual clauses met; 3 = minor cosmetic difference without violating a clause; 2 = one material spacing/alignment failure; 1 = multiple material failures; 0 = unreadable/unusable layout.
- Usability, 0-4: one point each for no overflow/clipping at every required width, keyboard link completion with visible focus, minimum target size, and saved heading surviving reload in visible output.
- WordPress ownership/runtime: `blocked` until a real WordPress import, native block editing, save/reopen, and frontend check are observed. The browser simulation cannot pass this gate.

Return clause statuses (pass/fail/blocked), visual/usability scores and fidelity verdict, viewport-specific reproduction steps, screenshot/evidence paths, and contamination status. Unexercised interactions remain blocked, not pass. Grade screenshots before requesting author diagnostics. This is a fixture benchmark, not evidence that an agent can independently repair a production theme.

## Source Fidelity

Also compare each candidate against supplied variant-a reference captures at 1280, 768 and 390 CSS pixels. Report fidelity separately from visual quality and usability. Check heading font/size/wrapping, top inset, section gap, border thickness/radius and intermediate overflow. Never normalize candidate scale to hide enlargement. No reference capture means fidelity is blocked. Interactive and native WordPress clauses still require actual execution.

Fidelity is a separate hard gate: any unexplained source mismatch fails it even if the layout score is 4. Screenshot-estimated target size is provisional, not an earned usability point; verify the actual interactive hitbox. Unexercised checks are blocked, not zero or pass. A failing intermediate viewport prevents overall acceptance regardless of endpoint scores.
