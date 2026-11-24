---
name: game-development
description: Build, improve, or review playable games and choose a stack for gameplay, platform, and hardware. Use for realistic game worlds, controls, performance, and Unreal Engine 5 projects (Blueprints, C++, packaging), not standalone illustrations, trailers, or ordinary websites.
---

# Game Development

For a new game, aim for a photographic, physically believable world, not a cartoon, unless the brief asks for a different style. Preserve the approved art direction of an existing game. A realism request changes how the *game* looks and feels; it does not mandate 3D, a particular engine, or a more complicated simulation.

## Deliver a playable first pass

1. Define the experience in one sentence: who the player is, what they do, what makes the choice or action interesting, and how the world responds. Read the existing project, target devices, asset rights, and delivery limits. Infer reversible details; ask only if a missing decision would materially change feasibility or violate a constraint.
2. If the technology is undecided or a requirement appears to invalidate it, use `references/stack-selection.md`. For a bounded change on a viable stack, keep it. If the project uses Unreal Engine or the brief specifically asks whether Unreal fits, use `references/unreal-engine.md` for the project pin, target, and playable-build checks. Other stacks do not need that reference.
3. For a realistic scene or a "looks like a toy" complaint, use `references/realism-in-play.md`. Choose one defining player view and one close interaction. If no suitable hero asset exists, make or source it within the brief before dressing the UI: a lit plate for a locked view, or a textured model for free movement. Don't wait for the owner to supply art you can legitimately produce. A graybox can prove mechanics; it is not finished art.
4. Build the smallest **complete loop** at the intended quality: enter, understand the goal, act, see/hear the consequence, finish or recover, and play again where appropriate. Wire real controls and world state before expanding scenery. Prefer one convincing room and one satisfying interaction to five unfinished levels. If the full brief exceeds one pass, identify the slice as a slice; do not present reduced scope as the whole game.
5. Open the delivered build from a clean launch. Operate the visible control with each promised input and observe the world change; a mock cannot show where a pointer lands or what receives keyboard focus. Inspect the player view at rest and in motion. When photography is the target and the main subject still looks illustrated, fix the art, not the UI. Repair the biggest observed mismatch and replay the same path in this pass. Keep critical cues legible with sound off, avoid compulsory camera shake, and name the weakest target actually tested.

For a build request, hand over the runnable entry point, controls and objective, the stack choice and its deciding constraint, and what was actually played, seen, and measured. Label untested devices and unfinished assets. A design brief, generated still, editor viewport, or trailer is not a playable build. A one-shot request means work through tests and repairs without routine check-ins, not skip them or guarantee production quality.
