# Three.js: make the scene playable in its actual host

Use Three.js when a browser game needs real camera movement, depth or relighting and the team can own the game loop. A rotating product model, a marketing site, or a noninteractive render is not a game. For one fixed view and a tight offline budget, keep a viable 2D stack.

## Pin the renderer and the delivery path

- Inspect the package manager lock, entry point, deployment base path, renderer, and loaders. For an existing app, keep its bundler or framework and render loop; don't add a second Three instance or a second animation loop. Use matching core and addons from **one revision and source** (for example `GLTFLoader` from `three/addons/loaders/GLTFLoader.js`). A CDN demo is not an offline build. See [installation choices](https://threejs.org/manual/pages/installation.html).
- For a WebGL 2 fleet, prefer the maintained [WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html); it does not provide a WebGL 1 fallback in modern releases. For an explicit WebGPU requirement, initialize the [WebGPURenderer](https://threejs.org/manual/pages/webgpurenderer), then verify the actual backend. Test WebGL 2 fallback separately if promised: initializing the renderer on both backends does not mean a custom shader, compute pass or postprocessing chain works on both. If neither is viable, show a usable unsupported state or offer a compatible design, not a blank canvas.
- Build the app with the project's locked dependencies, serve the **production output** at its intended subpath and open it from a cold browser session. Check model, texture, audio, optional decoder/transcoder and worker URLs all resolve there. A dev server may mask a bad path. A kiosk that must cold-start disconnected needs locally available dependencies and a delivery method that works then; a cached online visit is a different promise.

## Connect input to the world

Keep round state separate from render objects. A museum game might hit-test a valve, apply one legal turn to the puzzle state, animate its handle, then reveal the result; pointer and keyboard should invoke the same action. For a physics-driven game, use a bounded fixed-step simulation and render its current or interpolated state, not a movement increment per frame.

For [ray picking](https://threejs.org/manual/pages/picking.html), compute normalized device coordinates from the **displayed canvas**, not the window or the high-DPI drawing buffer. For an untransformed canvas with no border/padding, let `r = canvas.getBoundingClientRect()`:

```js
pointer.set(2 * (event.clientX - r.left) / r.width - 1,
            1 - 2 * (event.clientY - r.top) / r.height);
raycaster.setFromCamera(pointer, camera);
```

Skip a zero-size canvas and adjust for any letterbox or split viewport. Test the pictured control after scrolling, resizing and changing pixel density. Keep camera projection and the drawing buffer in sync with the displayed canvas; cap the rendering resolution to the measured device budget, not blindly to device pixel ratio. [Responsive sizing](https://threejs.org/manual/pages/responsive.html) explains the distinction.

## Check assets, lifecycle and delivery

For glTF, start with the standard loader and its material interpretation. When assigning textures manually, color images such as base color are generally sRGB; normal, roughness and metallic maps are data. Check the result under neutral light before changing the artwork; avoid applying output conversion twice in postprocessing. [Color management](https://threejs.org/manual/pages/color-management.html).

On teardown, stop the loop that this game owns, detach event listeners and controls, and release geometries, materials, textures and render targets when their last owner is finished. Removing a mesh or disposing its material does not free its textures. Don't dispose a shared texture another scene still uses. Compare warmed `renderer.info` counters across several play/reset cycles; a steady nonzero cache is not itself a leak. [Resource disposal](https://threejs.org/manual/pages/how-to-dispose-of-objects.html).

Play the served build: first load, pointer and keyboard actions on the actual object, consequence, retry and re-entry. Check a loading/failed-asset state, frame pacing and the most constrained promised browser/device. Record revision, build, browser, backend, resolution and inputs. A screenshot or headless software WebGL run can verify specific rendering/interaction behavior, not hardware speed or WebGPU compatibility.
