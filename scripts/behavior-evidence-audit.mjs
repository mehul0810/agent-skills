#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SHA256 = /^[a-f0-9]{64}$/;
const REVISION = /^[a-f0-9]{40}$/;
const DAY = 86_400_000;
const MANDATORY_BASELINES = [
  "automatic-specialist-routing",
  "design-experience-routing",
  "engineering-graph",
  "enterprise-runtime-assurance",
  "owner-correction-learning",
  "owner-aligned-judgment",
  "product-development-governance",
  "product-release-authority",
  "product-video-truth-and-assets",
  "source-blind-behavior-proof",
  "visual-evidence-assets",
  "wordpress-visual-execution",
  "wp-quality-reviewer",
];

function digest(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function digestFiles(root, files, errors, revision) {
  const hash = crypto.createHash("sha256");
  for (const relativePath of [...files].sort()) {
    try {
      const content = revision
        ? execFileSync("git", ["show", `${revision}:${relativePath}`], {
            cwd: root,
            stdio: ["ignore", "pipe", "pipe"],
          })
        : fs.readFileSync(path.join(root, relativePath));
      hash.update(relativePath);
      hash.update("\0");
      hash.update(String(content.length));
      hash.update("\0");
      hash.update(content);
      hash.update("\0");
    } catch {
      errors.push(`missing behavior source${revision ? ` at ${revision}` : ""}: ${relativePath}`);
    }
  }
  return hash.digest("hex");
}

function fileContent(root, relativePath, revision) {
  return revision
    ? execFileSync("git", ["show", `${revision}:${relativePath}`], {
        cwd: root,
        stdio: ["ignore", "pipe", "pipe"],
        encoding: "utf8",
      })
    : fs.readFileSync(path.join(root, relativePath), "utf8");
}

function digestScenario(root, scenario, anchors, errors, revision) {
  const hash = crypto.createHash("sha256");
  hash.update(scenario.id);
  hash.update("\0");
  for (const anchor of anchors) {
    const matches = [];
    for (const relativePath of [...scenario.files].sort()) {
      try {
        const lines = fileContent(root, relativePath, revision).split(/\r?\n/);
        lines.forEach((line, index) => {
          if (line.includes(anchor)) {
            matches.push({ relativePath, line, lineNumber: index + 1 });
          }
        });
      } catch {
        errors.push(`missing scenario source${revision ? ` at ${revision}` : ""}: ${relativePath}`);
      }
    }
    if (matches.length !== 1) {
      errors.push(
        `${scenario.id}: scenario anchor must match exactly once${revision ? ` at ${revision}` : ""}: ${anchor}`,
      );
      continue;
    }
    const match = matches[0];
    hash.update(anchor);
    hash.update("\0");
    hash.update(match.relativePath);
    hash.update("\0");
    hash.update(match.line);
    hash.update("\0");
  }
  return hash.digest("hex");
}

function stringSet(values, label, errors) {
  if (
    !Array.isArray(values) ||
    values.length === 0 ||
    values.some((value) => typeof value !== "string" || value.trim() === "")
  ) {
    errors.push(`${label} must be a non-empty string array`);
    return [];
  }
  const unique = [...new Set(values)].sort();
  if (unique.length !== values.length) {
    errors.push(`${label} contains duplicates`);
  }
  return unique;
}

function sameSet(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function harnessRevision(root, errors) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
    const packageLock = JSON.parse(fs.readFileSync(path.join(root, "package-lock.json"), "utf8"));
    const dependency = packageJson.devDependencies?.["@mehul0810/agent-harness"] ?? "";
    const match = dependency.match(
      /^https:\/\/github\.com\/mehul0810\/agent-harness\/archive\/([a-f0-9]{40})\.tar\.gz$/,
    );
    const lockedRoot = packageLock.packages?.[""]?.devDependencies?.["@mehul0810/agent-harness"];
    const lockedPackage = packageLock.packages?.["node_modules/@mehul0810/agent-harness"];
    const lockedLegacy = packageLock.dependencies?.["@mehul0810/agent-harness"];
    if (
      match &&
      lockedRoot === dependency &&
      lockedPackage?.resolved === dependency &&
      typeof lockedPackage.integrity === "string" &&
      lockedPackage.integrity.startsWith("sha512-") &&
      lockedLegacy?.version === dependency &&
      lockedLegacy?.integrity === lockedPackage.integrity
    ) {
      return match[1];
    }
  } catch {
    // Report the same actionable error for absent and malformed package metadata.
  }
  errors.push("package.json and package-lock.json must pin the same exact agent-harness revision and integrity");
  return null;
}

function isReachableCommit(root, revision) {
  try {
    execFileSync("git", ["cat-file", "-e", `${revision}^{commit}`], {
      cwd: root,
      stdio: "ignore",
    });
    execFileSync("git", ["merge-base", "--is-ancestor", revision, "HEAD"], {
      cwd: root,
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
}

function commitTimestamp(root, revision) {
  try {
    return Date.parse(
      execFileSync("git", ["show", "-s", "--format=%cI", revision], {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      }).trim(),
    );
  } catch {
    return Number.NaN;
  }
}

export function auditBehaviorEvidence({
  root = repoRoot,
  manifestFile = path.join(root, "skill-evals/behavior-baselines.json"),
  now = Date.now(),
  print = false,
  mandatoryBaselines = MANDATORY_BASELINES,
} = {}) {
  const errors = [];
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
  } catch {
    return { errors: ["behavior baseline manifest is missing or invalid JSON"], lines: [] };
  }

  if (manifest.schemaVersion !== 2 || !Array.isArray(manifest.baselines)) {
    return { errors: ["behavior baseline manifest must use schemaVersion 2"], lines: [] };
  }
  const maxAgeDays = manifest.defaults?.maxAgeDays;
  if (!Number.isInteger(maxAgeDays) || maxAgeDays < 1 || maxAgeDays > 365) {
    errors.push("defaults.maxAgeDays must be an integer from 1 to 365");
  }
  const requiredTags = stringSet(manifest.defaults?.requiredTags, "requiredTags", errors);
  const currentHarness = harnessRevision(root, errors);
  if (
    !REVISION.test(manifest.harnessRevision ?? "") ||
    manifest.harnessRevision !== currentHarness
  ) {
    errors.push("manifest harnessRevision must match package.json");
  }

  const names = new Set();
  const registeredRecords = new Set();
  const lines = [];

  for (const baseline of manifest.baselines) {
    if (
      !baseline.name ||
      names.has(baseline.name) ||
      !Array.isArray(baseline.files) ||
      baseline.files.length === 0
    ) {
      errors.push("each baseline needs a unique name and non-empty files");
      continue;
    }
    names.add(baseline.name);

    const sourceHash = digestFiles(root, baseline.files, errors);
    if (!SHA256.test(baseline.sha256 ?? "") || sourceHash !== baseline.sha256) {
      errors.push(`${baseline.name}: behavior changed; fresh evidence is required`);
    }

    const scenario = baseline.scenario;
    if (!scenario?.id || !Array.isArray(scenario.files) || scenario.files.length === 0) {
      errors.push(`${baseline.name}: registered scenario id and files are required`);
      continue;
    }
    const anchors = stringSet(scenario.anchors, `${baseline.name} scenario anchors`, errors);
    const scenarioHash = digestScenario(root, scenario, anchors, errors);
    if (!SHA256.test(scenario.sha256 ?? "") || scenarioHash !== scenario.sha256) {
      errors.push(`${baseline.name}: scenario changed; fresh evidence is required`);
    }

    const requiredChecks = stringSet(
      baseline.requiredChecks,
      `${baseline.name} requiredChecks`,
      errors,
    );
    if (!Array.isArray(baseline.evidence) || baseline.evidence.length === 0) {
      errors.push(`${baseline.name}: behavior evidence is required`);
      continue;
    }

    for (const evidence of baseline.evidence) {
      const relativePath = evidence.runRecord;
      if (typeof relativePath !== "string" || registeredRecords.has(relativePath)) {
        errors.push(`${baseline.name}: run record path is absent or duplicated`);
        continue;
      }
      registeredRecords.add(relativePath);
      const recordPath = path.join(root, relativePath);
      if (!fs.existsSync(recordPath)) {
        errors.push(`${baseline.name}: missing run record: ${relativePath}`);
        continue;
      }

      const recordBytes = fs.readFileSync(recordPath);
      if (!SHA256.test(evidence.sha256 ?? "") || digest(recordBytes) !== evidence.sha256) {
        errors.push(`${baseline.name}: run record changed after binding`);
      }
      let record;
      try {
        record = JSON.parse(recordBytes);
      } catch {
        errors.push(`${baseline.name}: run record is invalid JSON`);
        continue;
      }

      const actualChecks = stringSet(
        record.checks?.map((check) => check.name),
        `${baseline.name} run checks`,
        errors,
      );
      if (
        record.runId !== path.basename(relativePath, ".json") ||
        record.scenario !== scenario.id ||
        record.result !== "succeeded" ||
        !sameSet(requiredChecks, actualChecks) ||
        record.checks?.some((check) => check.result !== "pass") ||
        record.metrics?.checks_passed !== record.checks?.length
      ) {
        errors.push(`${baseline.name}: run record is not the exact registered clean pass`);
      }
      for (const tag of requiredTags) {
        if (!record.tags?.includes(tag)) {
          errors.push(`${baseline.name}: run record is missing tag ${tag}`);
        }
      }
      if (
        record.lineage?.verificationId !== record.runId ||
        typeof record.lineage?.artifactPointer !== "string" ||
        record.lineage.artifactPointer.trim() === "" ||
        typeof record.measurement?.summary !== "string" ||
        record.measurement.summary.trim() === "" ||
        record.measurement?.status !== "met"
      ) {
        errors.push(`${baseline.name}: verification lineage, evidence pointer, or measurement is incomplete`);
      }

      const startedAt = Date.parse(record.startedAt);
      const verifiedAt = Date.parse(record.measurement?.verifiedAt);
      const duration = record.durationMs;
      if (
        !Number.isFinite(startedAt) ||
        !Number.isFinite(verifiedAt) ||
        !Number.isInteger(duration) ||
        duration < 0 ||
        duration > DAY ||
        startedAt > now + 300_000 ||
        verifiedAt < startedAt ||
        verifiedAt > startedAt + duration + 300_000
      ) {
        errors.push(`${baseline.name}: run timestamps or duration are inconsistent`);
      }
      if (Number.isInteger(maxAgeDays) && now - startedAt > maxAgeDays * DAY) {
        errors.push(`${baseline.name}: evidence is older than ${maxAgeDays} days`);
      }

      if (!REVISION.test(evidence.testedRevision ?? "")) {
        errors.push(`${baseline.name}: exact testedRevision is required`);
      } else if (!isReachableCommit(root, evidence.testedRevision)) {
        errors.push(`${baseline.name}: testedRevision must be a commit reachable from HEAD`);
      } else {
        const revisionSource = digestFiles(root, baseline.files, errors, evidence.testedRevision);
        const revisionScenario = digestScenario(
          root,
          scenario,
          anchors,
          errors,
          evidence.testedRevision,
        );
        if (
          revisionSource !== evidence.testedSourceSha256 ||
          revisionScenario !== evidence.testedScenarioSha256
        ) {
          errors.push(`${baseline.name}: tested revision and tree digests disagree`);
        }
        const committedAt = commitTimestamp(root, evidence.testedRevision);
        if (!Number.isFinite(committedAt) || startedAt < committedAt) {
          errors.push(`${baseline.name}: behavior run predates the tested commit`);
        }
      }
      if (
        evidence.testedSourceSha256 !== baseline.sha256 ||
        evidence.testedScenarioSha256 !== scenario.sha256
      ) {
        errors.push(`${baseline.name}: evidence is stale for current source or scenario`);
      }
      if (
        evidence.runtime?.host !== "codex-desktop" ||
        evidence.runtime?.isolation !== "fresh-agent" ||
        evidence.runtime?.harnessRevision !== manifest.harnessRevision
      ) {
        errors.push(`${baseline.name}: current fresh-agent runtime binding is required`);
      }
      lines.push(
        `${baseline.name} source=${sourceHash} scenario=${scenarioHash} record=${digest(recordBytes)}`,
      );
    }
  }

  for (const requiredName of mandatoryBaselines) {
    if (!names.has(requiredName)) {
      errors.push(`missing mandatory behavior baseline: ${requiredName}`);
    }
  }

  const recordDirectory = path.join(root, "skill-evals/run-records");
  const discoveredRecords = fs.existsSync(recordDirectory)
    ? fs
        .readdirSync(recordDirectory)
        .filter((file) => file.endsWith(".json"))
        .map((file) => `skill-evals/run-records/${file}`)
    : [];
  for (const record of discoveredRecords) {
    if (!registeredRecords.has(record)) {
      errors.push(`unregistered behavior run record: ${record}`);
    }
  }
  for (const record of registeredRecords) {
    if (!discoveredRecords.includes(record)) {
      errors.push(`registered run record is outside skill-evals/run-records: ${record}`);
    }
  }

  return { errors, lines: print ? lines : [] };
}

function selfTest() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "behavior-evidence-"));
  fs.mkdirSync(path.join(root, "skill-evals/run-records"), { recursive: true });
  const revision = "a".repeat(40);
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      devDependencies: {
        "@mehul0810/agent-harness": `https://github.com/mehul0810/agent-harness/archive/${revision}.tar.gz`,
      },
    }),
  );
  const dependency = `https://github.com/mehul0810/agent-harness/archive/${revision}.tar.gz`;
  fs.writeFileSync(
    path.join(root, "package-lock.json"),
    JSON.stringify({
      packages: {
        "": { devDependencies: { "@mehul0810/agent-harness": dependency } },
        "node_modules/@mehul0810/agent-harness": {
          resolved: dependency,
          integrity: "sha512-fixture",
        },
      },
      dependencies: {
        "@mehul0810/agent-harness": {
          version: dependency,
          integrity: "sha512-fixture",
        },
      },
    }),
  );
  fs.writeFileSync(path.join(root, "source.md"), "stable\n");
  fs.writeFileSync(path.join(root, "skill-evals/scenarios.md"), "Scenario: exact route\n");
  const record = {
    schemaVersion: 1,
    runId: "exact-route",
    scenario: "exact-route",
    result: "succeeded",
    startedAt: "2026-07-26T00:00:00.000Z",
    durationMs: 1000,
    checks: [{ name: "correct-route", result: "pass" }],
    metrics: { checks_passed: 1 },
    lineage: { verificationId: "exact-route", artifactPointer: "sanitized:exact-route" },
    measurement: {
      status: "met",
      verifiedAt: "2026-07-26T00:00:01.000Z",
      summary: "Fresh agent selected the exact route and returned the required evidence.",
    },
    tags: ["fresh-agent", "sanitized"],
  };
  const recordFile = path.join(root, "skill-evals/run-records/exact-route.json");
  fs.writeFileSync(recordFile, JSON.stringify(record));
  execFileSync("git", ["init", "-q"], { cwd: root });
  execFileSync("git", ["add", "."], { cwd: root });
  execFileSync(
    "git",
    ["-c", "user.name=Audit", "-c", "user.email=audit@example.test", "commit", "-qm", "fixture"],
    {
      cwd: root,
      env: {
        ...process.env,
        GIT_AUTHOR_DATE: "2026-07-25T00:00:00.000Z",
        GIT_COMMITTER_DATE: "2026-07-25T00:00:00.000Z",
      },
    },
  );
  const testedRevision = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: root,
    encoding: "utf8",
  }).trim();
  const noErrors = [];
  const sourceHash = digestFiles(root, ["source.md"], noErrors, testedRevision);
  const scenarioHash = digestScenario(
    root,
    { id: "exact-route", files: ["skill-evals/scenarios.md"] },
    ["Scenario: exact route"],
    noErrors,
    testedRevision,
  );
  const manifest = {
    schemaVersion: 2,
    harnessRevision: revision,
    defaults: { maxAgeDays: 90, requiredTags: ["fresh-agent", "sanitized"] },
    baselines: [
      {
        name: "exact-route",
        files: ["source.md"],
        sha256: sourceHash,
        scenario: {
          id: "exact-route",
          files: ["skill-evals/scenarios.md"],
          anchors: ["Scenario: exact route"],
          sha256: scenarioHash,
        },
        requiredChecks: ["correct-route"],
        evidence: [
          {
            runRecord: "skill-evals/run-records/exact-route.json",
            sha256: digest(fs.readFileSync(recordFile)),
            testedRevision,
            testedSourceSha256: sourceHash,
            testedScenarioSha256: scenarioHash,
            runtime: { host: "codex-desktop", isolation: "fresh-agent", harnessRevision: revision },
          },
        ],
      },
    ],
  };
  const manifestFile = path.join(root, "skill-evals/behavior-baselines.json");
  const writeFixture = () => {
    manifest.baselines[0].evidence[0].sha256 = digest(fs.readFileSync(recordFile));
    fs.writeFileSync(manifestFile, JSON.stringify(manifest));
  };
  writeFixture();
  const run = (now = "2026-07-26T01:00:00.000Z") =>
    auditBehaviorEvidence({
      root,
      manifestFile,
      now: Date.parse(now),
      mandatoryBaselines: ["exact-route"],
    }).errors;

  if (noErrors.length || run().length) {
    throw new Error("valid evidence fixture failed");
  }
  fs.writeFileSync(path.join(root, "source.md"), "changed\n");
  if (!run().some((error) => error.includes("behavior changed"))) {
    throw new Error("source drift was accepted");
  }
  fs.writeFileSync(path.join(root, "source.md"), "stable\n");
  const changedRecord = structuredClone(record);
  changedRecord.checks[0].name = "wrong-check";
  fs.writeFileSync(recordFile, JSON.stringify(changedRecord));
  if (!run().some((error) => error.includes("exact registered clean pass"))) {
    throw new Error("wrong check set was accepted");
  }
  fs.writeFileSync(recordFile, JSON.stringify(record));
  if (!run("2026-11-01T00:00:00.000Z").some((error) => error.includes("older than"))) {
    throw new Error("expired evidence was accepted");
  }
  const missingPointer = structuredClone(record);
  delete missingPointer.lineage.artifactPointer;
  fs.writeFileSync(recordFile, JSON.stringify(missingPointer));
  if (!run().some((error) => error.includes("evidence pointer"))) {
    throw new Error("record without an evidence pointer was accepted");
  }
  fs.writeFileSync(recordFile, JSON.stringify(record));
  fs.writeFileSync(path.join(root, "skill-evals/run-records/orphan.json"), "{}");
  if (!run().some((error) => error.includes("unregistered behavior run record"))) {
    throw new Error("orphan record was accepted");
  }
  fs.rmSync(path.join(root, "skill-evals/run-records/orphan.json"));

  const prematureRecord = structuredClone(record);
  prematureRecord.startedAt = "2026-07-24T23:59:58.000Z";
  prematureRecord.measurement.verifiedAt = "2026-07-24T23:59:59.000Z";
  fs.writeFileSync(recordFile, JSON.stringify(prematureRecord));
  writeFixture();
  if (!run("2026-07-26T01:00:00.000Z").some((error) => error.includes("predates"))) {
    throw new Error("run predating its tested commit was accepted");
  }

  fs.writeFileSync(recordFile, JSON.stringify(record));
  writeFixture();
  const savedBaselines = manifest.baselines;
  manifest.baselines = [];
  fs.writeFileSync(manifestFile, JSON.stringify(manifest));
  if (!run().some((error) => error.includes("missing mandatory behavior baseline"))) {
    throw new Error("empty mandatory baseline inventory was accepted");
  }
  manifest.baselines = savedBaselines;
  writeFixture();

  const validPackage = fs.readFileSync(path.join(root, "package.json"), "utf8");
  const invalidDependency = `${dependency}-suffix`;
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      devDependencies: { "@mehul0810/agent-harness": invalidDependency },
    }),
  );
  if (!run().some((error) => error.includes("same exact agent-harness revision"))) {
    throw new Error("non-exact harness dependency was accepted");
  }
  fs.writeFileSync(path.join(root, "package.json"), validPackage);

  fs.rmSync(root, { recursive: true, force: true });
  console.log("behavior evidence audit self-test passed");
}

if (process.argv.includes("--self-test")) {
  selfTest();
} else {
  const result = auditBehaviorEvidence({ print: process.argv.includes("--print") });
  result.lines.forEach((line) => console.log(line));
  result.errors.forEach((error) => console.error(`ERROR: ${error}`));
  if (result.errors.length) {
    process.exit(1);
  }
  console.log("behavior evidence audit passed");
}
