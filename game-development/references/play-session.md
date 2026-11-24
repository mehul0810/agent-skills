# What happens when play is interrupted?

Use this for a game where pause, input loss, persistence or an online session is part of the brief or a reported failure. Test the smallest interruption that can damage the player's progress. Don't add accounts, cloud saves or a networking framework to a local puzzle.

## Time and input

Decide which clocks should advance: a solo simulation, a UI animation, an elapsed-time challenge and an online match may need different rules. On focus loss or controller disconnect, clear held buttons/axes and active pointer captures or gestures so a lost release cannot leave movement latched. Restore the intended input context on return, without replaying stale presses. Leave pause menus operable while simulation is paused; don't silently switch the player's chosen control scheme.

For a local fixed-step simulation, use elapsed time, cap catch-up work and reset the time baseline/accumulator on resume if suspended time shouldn't count. A browser may throttle or stop frame callbacks in the background; use [page visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API), not blur alone, to detect hidden tabs. A multiplayer client may pause its controls or menus, not everyone else's simulation; reconnect to authoritative time/state instead of fast-forwarding a hidden client. Test **hold input -> lose focus/disconnect -> release elsewhere -> resume with no input**, then perform the next action once. Compare slow and fast frame rates if timing changes the outcome.

## Saves and upgrades

Distinguish round reset (temporary state) from deleting progress or settings. For games that save, write a small versioned representation of player facts, not live engine objects. Validate before applying it. Migrate a supported old format on a copy before replacing it; keep the last known good save. Do not silently reset or overwrite a corrupt, unknown newer or read-only save. Offer an explicit separate recovery/new slot if useful, and don't say "saved" before the storage operation succeeds.

Use the platform's player-data location. Prefer transactions or atomic replacement **where the storage backend supports it**; a browser store is not a desktop filesystem. In IndexedDB a successful request is not a committed transaction: observe [transaction completion](https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction/complete_event) and abort/error, then verify by reopening. Test valid old data, truncated/newer data, storage failure and a fresh launch using disposable slots. If offline progress is promised, repeat while disconnected; never corrupt a real player's profile to test recovery.

## Shared sessions, only when requested

Name who owns the shared result and who is allowed to request an action. For example, if two players take the last puzzle token, the authority accepts it once; clients show the confirmed state, not two permanent rewards. A reconnect needs the current authoritative snapshot or revision and an unambiguous policy for pending actions; replay must not apply the same action twice. Preserve local feedback where appropriate, but don't claim readiness based on two views of the same in-process state. Exercise **two independent clients** with simultaneous input, disconnect/reconnect and a late or duplicated action. Label a local simulation as such; do not provision a paid service or deploy to prove a design decision.
