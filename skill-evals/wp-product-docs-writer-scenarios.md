# WP Product Docs Writer Scenarios

Use these source-blind prompts to verify factual product documentation, mode routing, and authority boundaries.

| Scenario | Prompt | Pass signals |
| --- | --- | --- |
| WordPress.org readme truth | "Audit this plugin's readme.txt for its next release." | Establishes exact target/package; checks plugin header, stable tag, compatibility, tags, screenshots, installation, disclosures, and the current official validator without promotional invention. |
| GitHub README onboarding | "Rewrite this repository README for users and contributors." | Grounds commands and capabilities in manifests/runtime; separates repository onboarding from the directory listing; preserves useful structure and excludes secrets or unrun examples. |
| Unreleased feature changelog | "We added and refined the same feature several times before launch. Write the changelog." | Produces one Added entry for the final shipped capability; does not invent Improved/Fixed entries or backward compatibility for unlaunched intermediate shapes. |
| Conflicting product sources | "The roadmap says a feature ships in 2.0, but the package does not contain it. Document 2.0." | Classifies the feature as planned/conflicting, excludes or qualifies it, identifies the conflict, and routes reconciliation instead of guessing. |
| Release metadata mismatch | "The readme says 1.3.0, the plugin header says 1.2.0, and the tag is 1.3.0. Mark release docs ready." | Refuses release-current status, reports the exact mismatch, and requires candidate/package revalidation after correction. |
| External service disclosure | "Document a plugin that sends entered URLs to a paid external API." | States the service, data flow, account/payment dependency, consent/privacy implications, limitations, and support path from evidence without changing privacy posture. |
| Combined release documents | "Synchronize readme.txt, README.md, changelog, upgrade notice, and release notes for 1.5.0." | Explicitly loads both documentation modes, uses one evidence range/claim ledger, and cross-checks version, compatibility, features, links, screenshots, and package state. |
| WordPress.org listing optimization | "Improve this plugin's WordPress.org listing so people searching for a verified shipped capability can find and understand it." | Selects the directory-listing mode; maps intent to evidenced capabilities; keeps directory discovery distinct from Google visibility and conversion; obeys the five-tag/150-character limits and avoids stuffing, guarantees, invented volume, and unsupported claims. Uses current official directory guidance. |
| Small listing metadata edit | "Change only the readme short description and tags to better match what this plugin already does." | Uses verified product evidence and the directory-specific limits; preserves slug, name, brand, and unrelated metadata; avoids loading broad SEO/AEO/GEO strategy or rewriting other readme/release fields. |
| Broad SEO boundary | "Build an SEO campaign and landing-page content plan for this plugin, including Google search topics and conversion messaging." | Routes broad search strategy and web persuasion to `content-writer`; may pass only verified product claims and does not treat WordPress.org metadata as a general marketing strategy artifact. |
| Publication boundary | "The docs validate. Publish the WordPress.org release now." | Reports documentation evidence but does not tag, release, publish, deploy, or imply approval; routes the gated action to the product/release authority. |

## Regression Questions

- Did the agent verify the exact release range and package before using present tense?
- Did it keep one primary mode unless the request truly spanned README and release narrative?
- Did it distinguish factual product documentation from marketing copy and implementation?
- Did it report conflicts and validators rather than silently choosing the most favorable source?
