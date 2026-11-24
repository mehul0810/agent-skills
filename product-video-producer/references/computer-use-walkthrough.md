# Record A Walkthrough

An actual walkthrough is continuous footage of the real app responding to input. Never build it from screenshots, a contact sheet, animated stills or a replayed cursor. A labeled fixture proves the recorder, not another product.

## Direct The Take

Take card: **build/role/viewport/fixture | starting screen | viewer's question | visible action | result/hold | stop before**. Example: compare the proofs, drag the divider to inspect the paper, hold on "Not sent." No permission to send is implied.

Rehearse off-record. Start at the task, not login. Show the approach, press, action and release; hold on the consequence. Film the real gesture the task calls for: a shape growing during a drag, a list moving under a scroll, letters appearing as typed, or keyboard focus reaching a control. Don't add filler movement to a simple click. The default recording cue follows actual browser input; it is not the hardware cursor. Use `--no-pointer` for undecorated footage. Never animate a cursor afterward to imply a gesture. Keep meaningful waits and use ordinary language ("We're checking the proof, not sending it").

## Control And Capture

Bind the controller and recorder to the same isolated tab or exact window. Disable microphone, camera and system audio unless cleared. Use a disposable profile and sanitized data; never film a personal desktop, notifications, clipboard, credentials or unrelated windows. Even a local mirror may send mail or change live data. Stop on unexpected data, ambiguity, new windows, permission prompts or send/pay/publish boundaries. Keep failed takes separate and private.

**Guided take.** From a project with Node 24, a pinned Playwright installation and its matching Chromium already installed:

```sh
# VIDEO_SKILL is the absolute path to this installed skill; OUT is a new directory.
node "$VIDEO_SKILL/scripts/record-walkthrough.mjs" --demo --guided --out "$OUT"
```

Bind computer use to the new isolated browser window. Check its title and starting state, act from visible controls, then observe each result. Press Enter in the recorder terminal after the final hold. For your approved local app, replace `--demo` with `--url http://127.0.0.1:4173/proofs`. Only same-origin GET/HEAD is allowed; the adapter is not a sandbox for untrusted apps. For native software, use a separately permitted exact-window recorder such as [OBS window capture on macOS](https://obsproject.com/kb/macos-screen-capture-source). If the surface cannot be isolated, stop. Do not substitute a storyboard or slideshow for a requested recording.

Extra pages and JavaScript dialogs invalidate the take. The browser recorder cannot reliably detect or include native permission prompts or file choosers. If one appears, interrupt the take rather than pressing Enter or broadening capture.

**Automated retake.** `--demo --out "$OUT"` records the offline example. To repeat a real local workflow, use `--url ... --plan reviewed-take.json --out "$OUT"` instead of guided mode. Copy the shape of [the example plan](../assets/walkthrough-starter/compare.json), not its product labels. Each step names one exact accessible control, newly visible result text and reading hold. No scripts, selectors, passwords or arbitrary keystrokes. A changed screen fails the take rather than guessing a click. Use guided recording for branching, text entry, or recovery. [Playwright actionability](https://playwright.dev/docs/actionability) checks whether an action can run, not whether a viewer can follow it.

## Hand Off The Recording

Keep the raw take; [Playwright finalizes video on context close](https://playwright.dev/docs/videos). Verify hash, streams, duration and full decode. For a drag or scroll, inspect several encoded instants **inside** the gesture: the app content must change in order, away from the pointer or captions. Before/after frames alone can conceal a hard cut. Check normal-speed pacing separately. If the take still reads as slides, recapture the interaction; if no recorder is available, say so. Record controller, edits, shortened waits and unverified claims. The browser starter is silent; captioning is not narration. Publication is separate.
