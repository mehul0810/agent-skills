# Godot 4: an editable scene and a runnable export

Choose Godot when an editable 2D or modest 3D scene, portable project files, and the team's target exporters fit better than building those systems in a renderer. Don't switch a working Unity or web project just to use it. Treat the pinned Godot 3 workflow separately; opening an old project in Godot 4 is a migration, not a diagnostic.

## Work on the project's version

Read `project.godot`, the main scene, Input Map, autoloads, renderer setting and `export_presets.cfg` where present. Resolve the editor version, standard vs .NET build, and required addons or GDExtension binaries against CI or the project's recorded toolchain; compare `godot --version`. The project format or a feature tag is not an exact patch identifier. Don't substitute a new editor or rewrite imported assets because local export templates are absent.

## Make an authored room playable

Keep a room or level in a scene, a reusable interactable in its own scene where useful, and let a signal notify the room when the objective changes. Example: use an Input Map action for a keyboard/gamepad-operated lift; enable it only while in range, show the floor change, then allow the player to retry. Don't introduce a global singleton just for one room's state. On scene reload, clear round state owned by any autoload and make sure one input still delivers one action.

Move a physics-controlled character in `_physics_process`, not by a fixed distance per draw. In Godot 4, [character velocity](https://docs.godotengine.org/en/stable/classes/class_characterbody3d.html) is in units per second; `move_and_slide()` uses the physics step internally. Apply delta to acceleration when updating velocity, not a second time to velocity passed through movement. For a paused scene, let the pause UI process while paused if it must still dismiss itself. Check collisions, short input presses and resume in play. See [pause processing](https://docs.godotengine.org/en/stable/tutorials/scripting/pausing_games.html).

## Choose the actual export

- Compare [Compatibility, Mobile and Forward+](https://docs.godotengine.org/en/stable/tutorials/rendering/renderers.html) on the target. The [Godot 4 Web export guide](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html) currently calls for WebAssembly, WebGL 2 and **Compatibility**; it does not support ordinary Godot 4 C# web export. Recheck for the pinned minor. A working Forward+ or C# desktop build isn't browser proof. For a hard conflict, keep the native target or offer an explicitly scoped alternative prototype, not an unapproved rewrite.
- For a compatible web project, check whether the selected preset and extensions need threads. A threaded export needs browser isolation; where supported from 4.3 on, a single-threaded export avoids that particular requirement but cannot run code that depends on threads. Serve the actual export and test the supported browser, input and audio after user interaction. Do not apply Unreal's web toolchain rules here.
- Use an exact named preset and matching export templates. For example, with a configured `Web` preset and an existing empty output directory outside the project: `godot --headless --path <project> --export-release "Web" <output>/index.html`. Headless project execution, a successful export, and playing the output are three different checks. See the [versioned CLI workflow](https://docs.godotengine.org/en/stable/tutorials/editor/command_line_tutorial.html).
- Verify the exported main scene, resources loaded by constructed paths, import filters and case-sensitive names on the destination. Save player progress under [`user://`, not `res://`](https://docs.godotengine.org/en/stable/tutorials/io/data_paths.html); check it after a fresh process/browser launch if persistence is promised. For native, play the exported executable outside the editor and confirm the same action, collision and restart with the promised controls.
