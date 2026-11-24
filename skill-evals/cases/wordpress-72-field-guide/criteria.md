# WordPress 7.2 Field Guide scoring

Score the independent briefs as decisions, not executed product tests. Keep this file and previous answers out of the evaluator packet.

| Brief | Required distinction |
|---|---|
| 1. Plugin integration | All static capabilities precede object-specific checks; discovery is not execution. Retain the older-Core enforcement callback. Explicit permission checks first prepare input and stop on error, while normal execution prepares it itself. A number is a float; invalid values must not run. |
| 2. Plugin transport | Do not change raw PHP results for every caller. Prepare a successful result with its output schema at the JSON boundary; preserve nested object vs list and leave a permitted array in a mixed schema alone. Return errors separately. |
| 3. Theme | Distinguish block opt-in from theme presets and control placement from selected-state storage. Check base and hover after save/reopen, and parent-rendered Navigation Link CSS in editor and frontend. |
| 4. Site media | Neither upload success nor the separate HEIC path proves WASM ran. Check eligible isolated Chromium and server fallback on the actual screens; verify animation, sub-sizes and quota without weakening isolation or policy. |
| 5. Site operations | A VCS file in the path or its ancestors counts; identify expected updater behavior for all four update types and the responsible deployment process, rather than forcing updates. Multisite wrappers require runtime/table support; no built-in sites REST endpoint follows from registration. |
| 6. Contributor triage | Keep slashing at direct method ingress; don't unslash the 7.2 hook payload again. A successful named creation can already email the user. Use disposable data, a mail sink, version/path comparison and redaction; don't assume a Core defect or mute a genuine notification without evidence. |
| 7. Release intake | Identify 7.1.5 stable vs 7.2 RC2 as of the supplied date and distinguish the guide's historical diff. Test the packaged product on stable and candidate separately with Gutenberg off for Core claims. No jQuery 4, no 7.2 Secrets API, no React 19 Core claim; no release metadata/status change from this evidence. |
