# WordPress 7.2 plugin readiness: November 27, 2026

The [shared version reference](../shared/references/wordpress-7-0-7-1-enterprise-compatibility.md#72-field-guide) links the Field Guide and all nine requested Core notes. It remains the compatibility route for plugin, theme, site, contribution and product orchestration. The [directory workflow](../wp-expert/references/wordpress-org-release-operations.md#a-compatibility-only-readme-change) owns the metadata decision. No generic worker, validator, decision engine, product readme or runtime floor changed.

## Source and distribution checks

The [Field Guide](https://make.wordpress.org/core/2026/11/20/wordpress-7-2-field-guide/) compares 7.1.4 with RC1. The [RC3 announcement](https://wordpress.org/news/2026/11/wordpress-7-2-release-candidate-3/) and [release archive](https://wordpress.org/download/releases/) establish a different November 27 test pair: 7.1.5 stable and 7.2-RC3, with December 8 scheduled. Core's [PHP 8.6 note](https://make.wordpress.org/core/2026/11/23/wordpress-and-php-8-6/) covers Core and its test library, not every plugin.

An initial capped download stopped before inspecting any archive. A separate bounded check retrieved the ZIP directories and three complete members from the official [7.1.5](https://wordpress.org/wordpress-7.1.5.zip) and [7.2-RC3](https://wordpress.org/wordpress-7.2-RC3.zip) distributions. HTTP ranges, decompressed lengths and member CRCs matched. Results:

| Declared build in `wp-includes/version.php` | `jquery.js` header | `jquery-migrate.js` header |
| --- | --- | --- |
| 7.1.5 | 3.7.1 | 3.4.1 |
| 7.2-RC3 | 3.7.1 | 3.6.0 |

These are **bundled file versions**. No script was loaded in a browser, no PHP 8.6 interpreter or product ZIP was run, and no plugin compatibility, public directory update or final Core behavior was verified.

## Behavior evidence

Fresh performers received only dated requests, fixtures and the frozen skills; separate scoring used the unchanged criteria for the [five readiness tickets](cases/wordpress-72-plugin-readiness/criteria.md) and [seven historical briefs](cases/wordpress-72-field-guide/criteria.md). No author criteria or earlier answers were part of performer packets.

- `87c701b669a7619d88d6ab1b8487542083f4e6d1`: 3/5 readiness and 6/7 historical decisions passed. The partials omitted readme/date boundaries, the own-draft autosave exception and an explicit historical stable version. The aggregate also rejected a 1,508-word reference against its 1,500-word limit.
- `a240c0a34ef4e7c7e40ab90712e674947029a46d`: 5/5 and 6/7 passed. The release brief still did not call for running the exact package on **current patched stable** independently of the candidate. The aggregate passed; earlier partial decisions were not relabeled.
- `424986661488ed3af6de145c8f4fe082f9f8d329`: after making the separate stable/RC rows explicit, two fresh readers answered both complete packets. Independent scoring: **5/5 readiness and 7/7 historical decisions passed**. The historical reader reported truncated listing/read output; scores cover its actual answers, not full reading of every listed file.

Final readiness and historical manifest SHA-256, respectively: `318d7e8215c52a6f82dec81d855c1781994d7b07b9251cc5dcac11d8e16a78a6`, `511e32c9afdf99e6ca689ae470a23978f9303aab593f678aa9db0263a40b4715`. Final independent grading artifact SHA-256: `757629fb3d0b175c7f6807a7730e63d24eddcd6136cb8fbeb9d342bc9793399c`.

The full Node 24 repository suite, tracked shell syntax and Skill Creator validation passed. The final shared reference uses 1,498/1,500 words; the plugin compatibility route uses 2,020/2,050. The prior limits and registered baselines are unchanged. Private evidence bundle: `wp72-plugin-readiness.N53v93dL` (initial, retest, release-retest, and package observations).
