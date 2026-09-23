# Vector motion starter

An original, illustrative 20-second 4K/30 fps four-beat studio reel: reveal, workflow, evidence layout, close. It is not real product UI or a claim about a product. Change the four copy lines and four palette colors to make a different direction; obtain product truth, brand assets, rights, and approval separately. This is proof infrastructure, not a production template or an accepted master.

The scene is frame-driven SVG with no random state or network assets. The renderer needs Node 24, an explicitly supplied Playwright module path with a working Chromium installation, and explicit `ffmpeg` and `ffprobe` paths. Nothing is installed by the script. Output directories must not exist; partial failures are left for inspection. `receipt.json` records source/config/tool identity, range, frame count, and probe output. It is *not* the skill's accepted video manifest or human playback QA.

```
node --test product-video-producer/assets/motion-starter/scene.test.mjs
node product-video-producer/scripts/render-motion-starter.mjs --help
node product-video-producer/scripts/render-motion-starter.mjs --playwright /absolute/path/to/playwright/index.mjs --ffmpeg /opt/homebrew/bin/ffmpeg --ffprobe /opt/homebrew/bin/ffprobe --font /absolute/path/to/licensed-font.ttf --output /private/tmp/motion-preview-01 --profile preview
```

Use `--profile full` for 3840x2160, `--mode clean|shorttitlehold|inconsistent-easing|competing-focals|crop-legibility|transition-jump|audio-offset|logo-matte`, `--start-frame N --end-frame N` for inclusive-exclusive range, and `--poster-frame N` for a still. Set `--config /absolute/file.json` for `copy`, `palette`, `duration`, or `fps`. The preview is 960x540 and defaults to 30 fps. Pass a licensed local TTF/OTF/WOFF font to make the title typography repeatable; without one the Iowan Old Style/Georgia fallback is platform-dependent. Titles wrap and fit inside the text column or fail closed. Audio is a generated 48 kHz sine cue on the exact workflow transition frame, not music; `audio-offset` deliberately shifts it by 0.45 seconds. The FFmpeg filter converts assumed browser sRGB PNG to limited-range BT.709 YUV; display grading remains unverified. Calibration defects are artificial. Review clips blind against the clean control; don't infer the defect solely from a passing test.
