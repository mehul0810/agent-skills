# Change Delivery Discipline

Use before committing or pushing work on any platform, including WordPress, static sites, macOS apps, games and client repositories. This is the portable boundary; release/branch adapters add stricter requirements, never wider authority.

## Local Work Is Not Publication

- Within authorized implementation, keep committing the smallest coherent tested change. A unit should do one reviewable thing and leave the supported build/tests usable. Do not split into broken commits merely to make each diff tiny; keep a necessary code/test pair together.
- Validate the changed behavior before each commit, stage only intended files, inspect the staged diff, and preserve unrelated owner work. Report failed or unavailable checks rather than calling the change tested. A documented exploratory checkpoint is not delivery proof.
- Preserve stricter client, repository and upstream conventions for branch topology, review, signing, commit format and tests. The small-commit rule does not mandate Conventional Commits or a new branch strategy.
- A branch named `main`, green tests, public visibility, free CI, a parent-agent delegation or an older automation policy does not authorize pushing. Commit, push, PR, merge, release and deployment are separate actions.

## Push Gate

Default: hold local commits until the owner explicitly asks to push. Client work always requires an explicit request because a push may deploy. Honor current holds and stricter repository rules even if a broader historical policy exists.

The only standing exception is an open-source **plugin** push whose exact repository, remote, target ref and candidate have been checked and whose effects are verified not to trigger any CI, pipeline, deployment, publication or release. A public app, game, theme or `agent-*` repository is not a plugin exception. A successful/free pipeline is still a pipeline. Unknown or inaccessible trigger/integration evidence means hold the push, not assume no effects.

Before relying on that exception, inspect current workflow definitions and applicable integration/hosting rules for this target, including relevant path/ref filters and chained effects. Record evidence of absence, not just absence of a visible workflow file. Do not disable workflows, add skip markers, change filters, choose a different branch/remote or otherwise suppress triggers to manufacture eligibility. Explicit push permission likewise does not implicitly approve a production deploy or release outside the granted task.

The executable advisory gate lives in `agent-loop` at `policies/change-delivery-policy.json` and `scripts/change-delivery-lib.mjs`. Check the installed revision and actual supported interface rather than assuming a source edit activated a host hook. Policy/fixture booleans do not authenticate an owner request or execute Git commands.

## Completion Receipt

Keep the receipt proportional: what changed, local commit IDs, relevant checks and real proof, outstanding gaps, and whether any push was explicitly requested and actually verified. If a push is held, say so. For approved publication, verify the exact remote SHA and resulting required checks; a local success or accepted command alone is not remote delivery.
