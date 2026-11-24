# Contributing to Agent Skills

Start with the [skill catalog](README.md#skills) and the [repository contract](AGENTS.md). A useful change fixes an observable problem: a request routes to the wrong skill, an example cannot be reproduced, a check accepts the wrong output, or a necessary action is missing.

## External contributors

Check existing issues and pull requests before starting. Open an issue with the skill or command, revision, smallest reproducible input, expected result and what actually happened. Use a disposable example; do not post client footage, private repositories, credentials, or sensitive logs. A small patch or before/after example helps a maintainer evaluate the change.

No upstream write access is needed. If a maintainer invites a pull request, work in your own fork and target the requested base. Include the tests you ran and what remains unverified. Do not push to upstream `main`, alter a live installation, publish media, or create a release on the project's behalf.

## Making a change

- Choose the skill that owns the outcome. Keep its `SKILL.md` short; put conditional detail in a directly reachable reference and repeatable operations in a tested script. Use `shared/` only when more than one skill needs the same contract. The WordPress routing map is not an index for every skill.
- For a new skill or a change to a trigger, give one realistic request that should select it and a nearby request that should not. Explain why an existing skill cannot own the work. Keep `agents/openai.yaml` consistent with the actual entrypoint; displaying a name does not prove a host used it.
- For a helper or installer, document inputs, outputs and side effects. Test both the intended result and a failure that must leave existing work untouched. Use disposable host homes for installer tests, not a personal installation.
- For public examples, provide a realistic brief, a repeatable command or prompt, the actual result, and a limit on what it proves. [Examples to try](README.md#try-a-task) show the format.

## Validation and publication

[TESTING.md](TESTING.md#full-gate) is the single validation checklist for contributors and maintainers. Use a focused test while iterating; a reference audit or one passing example is **not** the aggregate publication gate. Run `npm ci` with the declared toolchain, then `npm test` and the applicable separate syntax, skill and changed-behavior checks in that guide. Record the tested revision, actual results and any gaps. Follow the [evaluation protocol](skill-evals/README.md) where fresh scenarios are required.

**Authorized maintainers:** inspect the current branch, remote `main`, and overlapping work first. Publish scoped, validated changes directly to `main` only under the [standing repository policy](AGENTS.md). Do not create a branch or PR on the owner's behalf without an explicit exception or repository protection requiring it. Use the [commit and PR writing standard](shared/references/github-communication-protocol.md). A passing test or outside contribution grants no publication authority.

The pack uses rolling `main`. Tags, versioned releases, license changes, and deployment are separate owner decisions, not the last step of a contribution. See the [upgrade guide](UPGRADE.md) for how consumers update.
