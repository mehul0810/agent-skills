# Native WordPress Calibration

`native-proof.cjs` boots an isolated in-memory WordPress 6.8 instance using
`@wp-playground/cli@3.1.53`, imports `blocks.html` as native blocks, edits a title
through the real editor UI, changes a heading/link through Gutenberg dispatch,
saves through Gutenberg `savePost`, reloads, and checks persisted content. It
checks frontend DOM, captures desktop/mobile screenshots, introduces a disposable
user Global Styles background override, verifies computed output, restores the
original REST styles exactly, and verifies the override no longer applies.
No existing Studio or product site is read or modified. The process shuts down
the browser/server in `finally`; temporary dependency/evidence files remain.

## Rerun

Install the pinned dependency in a task-owned temporary directory:

```sh
npm install --prefix /private/tmp/native-wp-calibration --no-audit --no-fund @wp-playground/cli@3.1.53
```

Supply installed Playwright and Chrome paths explicitly (network/browser approval
may be required). From this repository:

```sh
PLAYGROUND_MODULE=/private/tmp/native-wp-calibration/node_modules/@wp-playground/cli \
PLAYWRIGHT_MODULE=/absolute/path/to/node_modules/playwright \
CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
NATIVE_PROOF_OUTPUT=/private/tmp/native-wp-calibration/evidence-new \
node skill-evals/frontend-benchmark/native-proof.cjs
```

Port 9418 must be available. Use a new output directory per run. The resulting
`result.json` is produced only after all assertions pass. Screenshots before a
failure are partial evidence, not a pass. This is real WordPress, not a simulated
editor, but it is calibration on the default theme, not supplied-design fidelity.

## Limitations

- The title uses real UI entry. Heading/link edits and saving use the native
  Gutenberg data API, so a complete author pointer/keyboard save flow is not
  proven. A Save-button attempt on 2026-09-08 did not reach clean state within
  30 seconds; the successful route is explicitly programmatic save.
- Initial dashboard `wp.apiFetch` discovery failed; public REST discovery fixed
  that. Editor network-idle navigation timed out; DOM readiness fixed that.
- Global Styles are changed/restored only inside the task-owned disposable site.
- WordPress 6.8 and CLI 3.1.53 are pinned calibration versions, not claims about
  current supported or latest releases.

## Observed Run: 2026-09-08

Final bounded run exited 0. Native persistence and Global Styles calibration pass;
author UI-only workflow remains **not proven**. Evidence is at
`/private/tmp/native-wp-calibration/evidence-final/`: `result.json`,
`editor-reopened.png`, `frontend-desktop.png`, and `frontend-mobile.png`.
The JSON `status: passed` is scoped to this calibration's assertions, not overall
author workflow or visual fidelity. Original REST styles `{}` were restored
exactly; computed background changed from `rgb(241, 226, 211)` to white.

Visual inspection of the editor PNG shows its chrome and persisted title, but
canvas text is not visible although buttons appear. This is an unresolved editor
rendering/screenshot proof gap, not a visual editor pass. Native content validity
and persistence were checked through the actual Gutenberg store and frontend DOM.

Publication rerun: `/private/tmp/native-wp-calibration/evidence-publication/`, exit 0.
The script now refuses an existing output directory and emits explicit
`authorUiStatus: blocked` and `visualFidelityStatus: not evaluated` alongside the
narrow persistence/restoration result, preventing stale files or a generic pass
from implying author or design acceptance.
