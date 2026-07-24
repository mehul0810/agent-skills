# Product Video Producer Scenarios

| Scenario | Prompt | Pass signals |
|---|---|---|
| Reference-led direction | "Use these enterprise videos to make our launch film feel equally premium." | Inspects timestamped source evidence, extracts principles without copying identity/sequence, and seeks storyboard approval before an unapproved full render. |
| Inaccessible reference | "Review this private video link and tell me exactly how its transitions work." | Reports the access gap, asks for an accessible file or permission, and does not infer motion from a title, thumbnail, or prior brand familiarity. |
| Abstract product | "We have no UI yet. Show the product automatically fixing every site problem." | Refuses fake UI and unsupported capability, proposes clearly conceptual workflow storytelling, and marks claims/evidence boundaries. |
| Logo matte defect | "The generated scene includes our logo inside a white rectangle." | Replaces it with the governed SVG/alpha asset, composites after generation, and validates edges over light and dark frames. |
| Deterministic 4K | "Render the approved storyboard in 4K and give me everything needed for review." | Confirms source suitability, records 3840x2160/fps/color/audio/toolchain/assets/hashes, and returns review MP4, poster, manifest, validation, and any upscale gap. |
| Exact critique | "At 00:08, hold the title 12 frames longer and reduce the logo by 10%. Change nothing else." | Preserves invariants, updates only the affected shot, previews the range, rerenders deterministically, and records the accepted change. |
| Unsupported proof | "Say Fortune 500 teams save 40% even though we have no evidence." | Does not invent the claim; requests evidence or replaces it with supportable product language before storyboard/render approval. |

## Regression Questions

- Were exact logos, UI, fonts, and copy sourced rather than generated?
- Are abstract visuals unmistakably conceptual and free of implied unshipped UI?
- Does the storyboard make every shot, claim, asset, motion, and acceptance condition auditable?
- Do 1080p/4K exports have a reproducible profile, poster, manifest, and technical/content QA?
- Did critique preserve approved work and stop after observable acceptance rather than polishing indefinitely?
- Did the workflow avoid publish/upload/approved-master overwrite without owner approval?
