# Prepare a draft from actual grades

Use this for a single schema-v1 evaluation that has already been independently scored. It replaces hand-computing receipt hashes and aggregating case results; it does not generate answers, supply a grade, approve an artifact, or admit a baseline. For initial and recovery comparisons keep separate original evidence or use the [attempt-aware format](attempt-evidence.md). Do not flatten multiple attempts into one successful run.

1. **Before dispatch**, freeze the packet, manifest SHA-256, tested revision, and which cases each required check must cover. Keep the author mapping away from the performer. Use the existing [packet contract](packet-contract.md).
2. **After the run**, keep the actual performer result JSON with `cases` rows containing `packetId`, `id`, and `outcome` or `decision`. A separate scorer records a decision for each assigned check/case, binding the exact result and frozen manifest it inspected. Retain the observed evaluator and scorer exposure declarations; never fill these from defaults.
3. **Prepare and preflight** in a new private output directory. Nothing in this command writes or updates the public registry. Check the reported `state`, not just the command exit code: a valid draft can accurately report `failed` or `incomplete`.

```sh
out=$(mktemp -d) || exit 1
npm run --silent eval:prepare -- --descriptor /absolute/private/run/descriptor.json > "$out/draft.json" &&
  npm run --silent eval:preflight -- --receipt "$out/draft.json" --require-grade
```

### Input shape

The following is a shape illustration, **not** evidence or a runnable claim. Replace placeholders with the frozen identities and observed data; include every check required by the actual baseline. Give each artifact group a short alias so paths and packet hashes are written once, even if a case supports multiple checks. Paths are absolute, or relative to the repository root (not the descriptor file).

```json
{
  "schemaVersion": 1,
  "baseline": "<registered baseline>",
  "testedRevision": "<40-character tested revision>",
  "evaluation": {
    "evaluator": {"identity": "<performer>", "exposedPaths": ["<actual inputs>"], "expectedAnswersExposed": false, "candidateSourceExposed": false},
    "scorer": {"identity": "<independent scorer>", "exposedPaths": ["<actual inputs and criteria>"], "expectedAnswersExposed": true, "candidateSourceExposed": true}
  },
  "gradePath": "/absolute/private/run/grade.json",
  "groups": [{"alias": "capture", "packetId": "video-computer-use", "packetPath": "/absolute/private/run/frozen", "manifestSha256": "<frozen SHA-256>", "resultPath": "/absolute/private/run/performer.json"}],
  "checks": [{"name": "continuous-input-and-encoded-app-motion", "cases": [{"group": "capture", "caseId": "M"}]}]
}
```

The independent grade has this shape:

```json
{"schemaVersion":1,"scorerIdentity":"<independent scorer>","decisions":[{"check":"continuous-input-and-encoded-app-motion","packetId":"video-computer-use","caseId":"M","result":"<pass|fail|incomplete>","resultSha256":"<hash of actual performer result>","manifestSha256":"<frozen manifest SHA-256>"}]}
```

The helper caches repeated reads and hashes, checks result rows and independently recorded digests, derives each check from its explicit grades (fail, then incomplete, then pass), and runs the existing receipt preflight. `--require-grade` rechecks the grade bytes **and** their mapping and rejects a receipt whose grade binding was stripped. Missing, contradictory or extra decisions are errors. The preparer allows up to 512 case references per receipt. Ordinary preflight remains available for legacy and attempt-aware receipts. Hashes cannot authenticate a scorer, validate a dishonest exposure declaration, detect cases omitted from the original author assignment, or turn synthetic decisions into real product proof. Retain the frozen assignment for independent review; baseline admission still requires the [existing review and audit](README.md#sanitized-run-records).
