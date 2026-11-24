---
name: game-development
description: Build, improve, or review playable games and choose a stack for gameplay, platform, and hardware. Use for realistic worlds, controls, performance, Unreal Engine 5 (Blueprints/C++), Unity, Three.js, or Godot games; not standalone illustrations, trailers, or ordinary websites.
---

# Game Development

For a new game, aim for a photographic, physically believable world, not a cartoon, unless the brief asks for a different style. Preserve the approved art direction of an existing game. A realism request changes how the *game* looks and feels; it does not mandate 3D, a particular engine, or a more complicated simulation.

## Deliver a playable first pass

1. Define the experience in one sentence: who the player is, what they do, what makes the choice or action interesting, and how the world responds. Read the existing project, target devices, asset rights, and delivery limits. Infer reversible details; ask only if a missing decision would materially change feasibility or violate a constraint.
2. If the technology is undecided or a requirement appears to invalidate it, use `references/stack-selection.md`; keep a viable stack for a bounded change. For the chosen, existing, or explicitly requested technology, load **only its playbook**: Unreal Engine 5: `references/unreal-engine.md`; Unity: `references/unity.md`; Three.js: `references/three-js.md`; Godot 4: `references/godot.md`. Compare two only if the decision actually turns on their capabilities. A DOM or Canvas 2D game needs none of these.
3. For a realistic scene or a "looks like a toy" complaint, use `references/realism-in-play.md`. Choose one defining player view and one close interaction. If no suitable hero asset exists, make or source it within the brief before dressing the UI: a lit plate for a locked view, or a textured model for free movement. Don't wait for the owner to supply art you can legitimately produce. A graybox can prove mechanics; it is not finished art.
4. Build the smallest **complete loop** at the intended quality: enter, understand the goal, act, see/hear the consequence, finish or recover, and play again where appropriate. Wire real controls and world state before expanding scenery. For lost focus/input, suspend/resume, save compatibility or multiplayer reconnect, use `references/play-session.md`; do not add persistence or online services to a game that doesn't need them. Prefer one convincing room and one satisfying interaction to five unfinished levels. Label a slice as a slice.
5. Open the delivered build from a clean launch. Operate the visible control with each promised input and observe the world change; a mock cannot show where a pointer lands or what receives keyboard focus. Inspect the player view at rest and in motion. When photography is the target and the main subject still looks illustrated, fix the art, not the UI. Repair the biggest observed mismatch and replay the same path in this pass. Keep critical cues legible with sound off, avoid compulsory camera shake, and name the weakest target actually tested.

For a build request, hand over the runnable entry point, controls and objective, the stack choice and its deciding constraint, and what was actually played, seen, and measured. Label untested devices and unfinished assets. A design brief, generated still, editor viewport, or trailer is not a playable build. A one-shot request means work through tests and repairs without routine check-ins, not skip them or guarantee production quality.

For an export diagnosis, name the reproducible build inputs (pinned editor/package and its target profile, templates or loader as applicable), not just "test the build." For a frame-pacing fix, capture a **before** distribution and replay the same busy route **after** on the same device, resolution and quality. Compare the two distributions and hitches as well as the target budget; a new average or a passing threshold alone cannot show what improved.
