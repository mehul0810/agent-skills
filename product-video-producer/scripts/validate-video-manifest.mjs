#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { isDeepStrictEqual } from "node:util";
import Ajv2020 from "ajv/dist/2020.js";

const SHA256 = /^[a-f0-9]{64}$/;
const WINDOWS_ABSOLUTE_PATH = /^(?:[A-Za-z]:[\\/]|\\\\)/;
const WINDOWS_DRIVE_PATH = /^[A-Za-z]:/;
const WINDOWS_RESERVED_SEGMENT = /^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\..*)?$/i;
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.resolve(SCRIPT_DIR, "../assets/video-manifest.schema.json");
const OUTPUT_ROLES = new Set([
  "review_video",
  "master",
  "poster",
  "platform_derivative",
  "short"
]);
const VIDEO_ROLES = new Set(["review_video", "master", "short"]);
const IMAGE_ROLES = new Set(["poster"]);
const PLATFORM_ROLES = new Set(["platform_derivative", "short"]);
const BLOCKING_GAP_CATEGORIES = new Set([
  "accessibility",
  "privacy",
  "consent",
  "rights",
  "truth",
  "identity"
]);
const VALUE_OPTIONS = new Map([
  ["--expected-job-id", "expectedJobId"],
  ["--expected-project-id", "expectedProjectId"],
  ["--expected-project-root", "expectedProjectRoot"],
  ["--expected-source-revision", "expectedSourceRevision"],
  ["--expected-project-file-sha256", "expectedProjectFileSha256"],
  ["--expected-sequence-or-composition", "expectedSequenceOrComposition"],
  ["--expected-timeline-id", "expectedTimelineId"],
  ["--expected-dirty-state-sha256", "expectedDirtyStateSha256"],
  ["--expected-artifact-id", "expectedArtifactId"],
  ["--expected-artifact-sha256", "expectedArtifactSha256"],
  ["--expected-output-role", "expectedOutputRole"],
  ["--expected-output-path", "expectedOutputPath"],
  ["--expected-approval-owner", "expectedApprovalOwner"]
]);

let compiledSchemaValidator;

class CliError extends Error {}

function schemaValidator() {
  if (!compiledSchemaValidator) {
    const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8"));
    const ajv = new Ajv2020({ allErrors: true, strict: true });
    compiledSchemaValidator = ajv.compile(schema);
  }
  return compiledSchemaValidator;
}

function formatSchemaErrors(errors = []) {
  return errors.map((error) => {
    const location = error.instancePath || "/";
    const extra =
      error.keyword === "additionalProperties"
        ? ` (${error.params.additionalProperty})`
        : "";
    return `schema ${location} ${error.message}${extra}`;
  });
}

function validateSchema(manifest) {
  const validate = schemaValidator();
  return validate(manifest) ? [] : formatSchemaErrors(validate.errors);
}

function uniqueErrors(errors) {
  return [...new Set(errors)];
}

function parseStrictUtcTimestamp(value) {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?Z$/.exec(
      String(value ?? "")
    );
  if (!match) {
    return Number.NaN;
  }
  const [, year, month, day, hour, minute, second, fraction = ""] = match;
  const milliseconds = Number((fraction + "000").slice(0, 3));
  const timestamp = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
    milliseconds
  );
  const date = new Date(timestamp);
  return date.getUTCFullYear() === Number(year) &&
    date.getUTCMonth() === Number(month) - 1 &&
    date.getUTCDate() === Number(day) &&
    date.getUTCHours() === Number(hour) &&
    date.getUTCMinutes() === Number(minute) &&
    date.getUTCSeconds() === Number(second)
    ? timestamp
    : Number.NaN;
}

function isWithinRoot(root, candidate) {
  const relative = path.relative(root, candidate);
  return (
    relative === "" ||
    (relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))
  );
}

function isCanonicalRelativePath(value) {
  if (
    typeof value !== "string" ||
    value === "" ||
    value.includes("\0") ||
    value.includes("\\") ||
    path.posix.isAbsolute(value) ||
    WINDOWS_ABSOLUTE_PATH.test(value) ||
    WINDOWS_DRIVE_PATH.test(value)
  ) {
    return false;
  }
  const segments = value.split("/");
  if (
    segments.some(
      (segment) =>
        segment.endsWith(".") ||
        segment.endsWith(" ") ||
        WINDOWS_RESERVED_SEGMENT.test(segment)
    )
  ) {
    return false;
  }
  const normalized = path.posix.normalize(value);
  return (
    normalized !== "." &&
    normalized !== ".." &&
    !normalized.startsWith("../") &&
    normalized === value
  );
}

function validateRelativePath(value, label, projectRoot, errors) {
  if (!isCanonicalRelativePath(value)) {
    errors.push(`${label} must be a canonical project-root-relative path without traversal`);
    return;
  }
  if (projectRoot && !isWithinRoot(projectRoot, path.resolve(projectRoot, value))) {
    errors.push(`${label} resolves outside identity.project_root`);
  }
}

function validateAbsoluteRoot(root, label, errors) {
  if (!path.isAbsolute(root)) {
    errors.push(`${label} must be absolute`);
    return false;
  }
  if (path.resolve(root) !== root) {
    errors.push(`${label} must be normalized`);
    return false;
  }
  if (path.parse(root).root === root) {
    errors.push(`${label} must not be the filesystem root`);
    return false;
  }
  return true;
}

function checkUnique(items, label, keyFor, errors) {
  const seen = new Map();
  for (const [index, item] of items.entries()) {
    const key = keyFor(item);
    if (seen.has(key)) {
      errors.push(`${label}[${index}] duplicates ${label}[${seen.get(key)}]: ${key}`);
    } else {
      seen.set(key, index);
    }
  }
}

function validateLineage(outputs, outputById, errors) {
  for (const [index, output] of outputs.entries()) {
    const seenParents = new Set();
    for (const parentId of output.parent_artifact_ids) {
      if (seenParents.has(parentId)) {
        errors.push(`outputs[${index}] repeats parent artifact ${parentId}`);
      }
      seenParents.add(parentId);
      if (parentId === output.artifact_id) {
        errors.push(`outputs[${index}] cannot be its own parent`);
      } else if (!outputById.has(parentId)) {
        errors.push(`outputs[${index}] references unknown parent artifact ${parentId}`);
      }
    }
  }

  const state = new Map();
  const stack = [];
  const visit = (artifactId) => {
    if (state.get(artifactId) === 2) {
      return;
    }
    if (state.get(artifactId) === 1) {
      const start = stack.indexOf(artifactId);
      errors.push(`output lineage cycle: ${[...stack.slice(start), artifactId].join(" -> ")}`);
      return;
    }
    state.set(artifactId, 1);
    stack.push(artifactId);
    const output = outputById.get(artifactId);
    for (const parentId of output?.parent_artifact_ids ?? []) {
      if (outputById.has(parentId)) {
        visit(parentId);
      }
    }
    stack.pop();
    state.set(artifactId, 2);
  };

  for (const artifactId of outputById.keys()) {
    visit(artifactId);
  }
}

function expectedMediaKind(role, actualKind) {
  if (VIDEO_ROLES.has(role)) {
    return "video";
  }
  if (IMAGE_ROLES.has(role)) {
    return "image";
  }
  if (role === "platform_derivative") {
    return actualKind === "video" || actualKind === "image" ? actualKind : "video or image";
  }
  return undefined;
}

function validateMedia(outputs, errors) {
  for (const [index, output] of outputs.entries()) {
    const expectedKind = expectedMediaKind(output.role, output.media.kind);
    if (expectedKind !== output.media.kind) {
      errors.push(`outputs[${index}].media.kind must be ${expectedKind} for role ${output.role}`);
    }
    if (!isDeepStrictEqual(output.media.expected, output.media.observed)) {
      errors.push(`outputs[${index}] observed media profile does not match expected profile`);
    }
  }
}

function validateRenderBinding(manifest, expectedOutput, errors) {
  if (!expectedOutput) {
    return;
  }
  const expected = expectedOutput.media.expected;
  if (expectedOutput.media.kind === "video") {
    const renderProfile = {
      width: manifest.render.width,
      height: manifest.render.height,
      fps: manifest.render.fps,
      frame_count: manifest.render.frame_count,
      pixel_format: manifest.render.pixel_format,
      scan: manifest.render.scan,
      color: manifest.render.color,
      audio: manifest.render.audio
    };
    const outputProfile = {
      width: expected.width,
      height: expected.height,
      fps: expected.fps,
      frame_count: expected.frame_count,
      pixel_format: expected.pixel_format,
      scan: expected.scan,
      color: expected.color,
      audio: expected.audio
    };
    if (!isDeepStrictEqual(renderProfile, outputProfile)) {
      errors.push("render profile does not match the expected output video profile");
    }
  } else if (
    expectedOutput.media.kind === "image" &&
    (manifest.render.width !== expected.width || manifest.render.height !== expected.height)
  ) {
    errors.push("render dimensions do not match the expected output image profile");
  }
}

function validatePlatformReceipts(manifest, outputById, errors) {
  const receiptKeys = new Map();
  for (const [index, receipt] of manifest.validation.platform.entries()) {
    const key = `${receipt.artifact_id}\0${receipt.platform}\0${receipt.check}`;
    if (receiptKeys.has(key)) {
      errors.push(`validation.platform[${index}] duplicates receipt ${receiptKeys.get(key)}`);
    } else {
      receiptKeys.set(key, index);
    }
    const output = outputById.get(receipt.artifact_id);
    if (!output) {
      errors.push(`validation.platform[${index}] references unknown artifact ${receipt.artifact_id}`);
    } else if (!PLATFORM_ROLES.has(output.role)) {
      errors.push(`validation.platform[${index}] must reference a platform derivative or short`);
    } else if (output.sha256 !== receipt.artifact_sha256) {
      errors.push(`validation.platform[${index}] artifact hash is stale`);
    }
    const verifiedAt = parseStrictUtcTimestamp(receipt.verified_at);
    const now = Date.now();
    if (!Number.isFinite(verifiedAt)) {
      errors.push(`validation.platform[${index}] verified_at is not a real UTC timestamp`);
    } else if (verifiedAt > now + 5 * 60 * 1000) {
      errors.push(`validation.platform[${index}] verified_at is in the future`);
    } else if (now - verifiedAt > 30 * 24 * 60 * 60 * 1000) {
      errors.push(`validation.platform[${index}] current-spec verification is older than 30 days`);
    }
  }
}

function validateArtifactReceipts(manifest, outputById, errors) {
  for (const category of ["technical", "content", "audio", "accessibility", "rights"]) {
    const seen = new Map();
    for (const [index, receipt] of manifest.validation[category].entries()) {
      const key = `${receipt.artifact_id}\0${receipt.check}`;
      if (seen.has(key)) {
        errors.push(`validation.${category}[${index}] duplicates receipt ${seen.get(key)}`);
      } else {
        seen.set(key, index);
      }
      const output = outputById.get(receipt.artifact_id);
      if (!output) {
        errors.push(
          `validation.${category}[${index}] references unknown artifact ${receipt.artifact_id}`
        );
      } else if (output.sha256 !== receipt.artifact_sha256) {
        errors.push(`validation.${category}[${index}] artifact hash is stale`);
      }
    }
  }
}

function validateKnownGaps(manifest, errors) {
  checkUnique(manifest.known_gaps, "known_gaps", (gap) => gap.id, errors);
  if (manifest.approval.state !== "accepted") {
    return;
  }
  for (const gap of manifest.known_gaps) {
    if (gap.disposition === "unresolved") {
      errors.push(`accepted manifest cannot retain unresolved gap ${gap.id}`);
    }
    if (BLOCKING_GAP_CATEGORIES.has(gap.category) && gap.disposition !== "resolved") {
      errors.push(`accepted manifest cannot retain ${gap.category} gap ${gap.id}`);
    }
    if (gap.disposition === "accepted" && gap.accepted_by !== manifest.approval.owner) {
      errors.push(`known gap ${gap.id} must be accepted by approval.owner`);
    }
  }
}

function validateApproval(manifest, expectedOutput, errors) {
  const acceptedOutputs = manifest.outputs.filter((output) => output.state === "accepted");
  if (manifest.approval.state !== "accepted") {
    if (acceptedOutputs.length > 0) {
      errors.push("non-accepted manifest cannot contain accepted output state");
    }
    return;
  }

  if (!expectedOutput) {
    return;
  }
  if (expectedOutput.state !== "accepted") {
    errors.push("accepted manifest requires the exact expected output state to be accepted");
  }
  if (expectedOutput.media.kind !== "video") {
    errors.push("accepted product-video completion requires a video output");
  }
  if (manifest.approval.approved_artifact_id !== expectedOutput.artifact_id) {
    errors.push("approved artifact ID does not match the exact expected output");
  }
  if (manifest.approval.approved_artifact_sha256 !== expectedOutput.sha256) {
    errors.push("approved artifact hash does not match the exact expected output");
  }
  if (
    acceptedOutputs.length !== 1 ||
    acceptedOutputs[0]?.artifact_id !== expectedOutput.artifact_id
  ) {
    errors.push("accepted manifest must have exactly one accepted output: the expected artifact");
  }
  const approvedAt = parseStrictUtcTimestamp(manifest.approval.approved_at);
  if (!Number.isFinite(approvedAt) || approvedAt > Date.now() + 5 * 60 * 1000) {
    errors.push("accepted manifest approval timestamp is invalid or in the future");
  }

  const hasReceipt = (category) =>
    manifest.validation[category].some(
      (receipt) =>
        receipt.artifact_id === expectedOutput.artifact_id &&
        receipt.artifact_sha256 === expectedOutput.sha256
    );
  for (const key of ["technical", "content", "accessibility", "rights"]) {
    if (!hasReceipt(key)) {
      errors.push(`accepted manifest requires current artifact-bound validation.${key} evidence`);
    }
  }
  if (expectedOutput.media.kind === "video" && expectedOutput.media.expected.audio.enabled) {
    if (!hasReceipt("audio")) {
      errors.push("accepted audible video requires current artifact-bound validation.audio evidence");
    }
  }
  if (PLATFORM_ROLES.has(expectedOutput.role)) {
    const receipt = manifest.validation.platform.find(
      (item) =>
        item.artifact_id === expectedOutput.artifact_id &&
        item.artifact_sha256 === expectedOutput.sha256
    );
    if (!receipt) {
      errors.push(
        "accepted platform derivative or short requires a current artifact-bound platform receipt"
      );
    }
  }
}

function validateExpectedAncestors(expectedOutput, outputById, errors) {
  if (!expectedOutput) {
    return;
  }
  const visited = new Set();
  const visit = (artifactId) => {
    if (visited.has(artifactId)) {
      return;
    }
    visited.add(artifactId);
    const output = outputById.get(artifactId);
    for (const parentId of output?.parent_artifact_ids ?? []) {
      const parent = outputById.get(parentId);
      if (!parent) {
        continue;
      }
      if (["quarantined", "superseded"].includes(parent.state)) {
        errors.push(`expected output depends on inactive parent artifact ${parentId}`);
      }
      visit(parentId);
    }
  };
  visit(expectedOutput.artifact_id);
}

function validateExternalBindings(manifest, expectedOutput, options, errors) {
  const comparisons = [
    [options.expectedJobId, manifest.identity.job_id, "job identity"],
    [options.expectedProjectId, manifest.identity.project_id, "project identity"],
    [options.expectedProjectRoot, manifest.identity.project_root, "project root"],
    [options.expectedSourceRevision, manifest.source.revision, "source revision"],
    [
      options.expectedProjectFileSha256,
      manifest.identity.project_file_sha256,
      "project file hash"
    ],
    [
      options.expectedSequenceOrComposition,
      manifest.identity.sequence_or_composition,
      "sequence or composition"
    ],
    [options.expectedTimelineId, manifest.edit.timeline_id, "timeline identity"],
    [
      options.expectedDirtyStateSha256,
      manifest.source.dirty_state_sha256,
      "dirty-state hash"
    ],
    [options.expectedArtifactId, manifest.identity.expected_output_artifact_id, "artifact identity"],
    [options.expectedOutputRole, manifest.identity.expected_output_role, "output role"],
    [options.expectedOutputPath, manifest.identity.expected_output_path, "output path"],
    [options.expectedArtifactSha256, expectedOutput?.sha256, "artifact hash"],
    [options.expectedApprovalOwner, manifest.approval.owner, "approval owner"]
  ];
  for (const [external, actual, label] of comparisons) {
    if (external !== undefined && external !== actual) {
      errors.push(`${label} mismatch: expected ${external}`);
    }
  }
}

function validateCompletionInvocation(manifest, parsed) {
  if (manifest.approval.state !== "accepted") {
    return [];
  }

  const errors = [];
  if (!parsed.verifyFiles) {
    errors.push("accepted manifest validation requires --verify-files");
  }
  if (!parsed.verifyMedia) {
    errors.push("accepted manifest validation requires --verify-media");
  }
  for (const [flag, optionKey] of VALUE_OPTIONS) {
    if (parsed.options[optionKey] === undefined) {
      errors.push(`accepted manifest validation requires ${flag}`);
    }
  }
  return errors;
}

function validateManifestSemantics(manifest, options = {}) {
  const errors = [];
  const projectRoot = validateAbsoluteRoot(
    manifest.identity.project_root,
    "identity.project_root",
    errors
  )
    ? manifest.identity.project_root
    : undefined;

  const pathEntries = [
    [manifest.identity.project_file, "identity.project_file"],
    [manifest.rights.asset_register, "rights.asset_register"]
  ];
  if (manifest.storyboard.status === "required") {
    pathEntries.push([manifest.storyboard.path, "storyboard.path"]);
  }
  for (const [index, asset] of manifest.assets.entries()) {
    pathEntries.push([asset.path, `assets[${index}].path`]);
  }
  for (const [index, output] of manifest.outputs.entries()) {
    pathEntries.push([output.path, `outputs[${index}].path`]);
    pathEntries.push([output.probe_evidence.path, `outputs[${index}].probe_evidence.path`]);
  }
  for (const category of [
    "technical",
    "content",
    "audio",
    "accessibility",
    "rights",
    "platform"
  ]) {
    for (const [index, receipt] of manifest.validation[category].entries()) {
      pathEntries.push([
        receipt.evidence_path,
        `validation.${category}[${index}].evidence_path`
      ]);
    }
  }
  for (const [label, decision] of [
    ["accessibility.captions", manifest.accessibility.captions],
    ["accessibility.transcript", manifest.accessibility.transcript],
    ["accessibility.visual_equivalence", manifest.accessibility.visual_equivalence.artifact]
  ]) {
    if (decision.status === "required") {
      pathEntries.push([decision.path, `${label}.path`]);
    }
  }
  if (manifest.approval.state === "accepted") {
    pathEntries.push([manifest.approval.evidence_path, "approval.evidence_path"]);
  }
  for (const [value, label] of pathEntries) {
    validateRelativePath(value, label, projectRoot, errors);
  }
  checkUnique(manifest.render.toolchain, "render.toolchain", (tool) => tool.name, errors);
  checkUnique(manifest.assets, "assets", (asset) => asset.id, errors);
  checkUnique(manifest.claims, "claims", (claim) => claim.id, errors);
  checkUnique(manifest.outputs, "outputs", (output) => output.artifact_id, errors);
  checkUnique(manifest.outputs, "output paths", (output) => path.posix.normalize(output.path), errors);

  const outputById = new Map(manifest.outputs.map((output) => [output.artifact_id, output]));
  for (const [index, output] of manifest.outputs.entries()) {
    if (output.source_timeline_id !== manifest.edit.timeline_id) {
      errors.push(
        `outputs[${index}].source_timeline_id does not match edit.timeline_id`
      );
    }
  }
  validateLineage(manifest.outputs, outputById, errors);
  validateMedia(manifest.outputs, errors);

  const expectedOutput = outputById.get(manifest.identity.expected_output_artifact_id);
  if (!expectedOutput) {
    errors.push("identity.expected_output_artifact_id does not match an output");
  } else {
    if (expectedOutput.role !== manifest.identity.expected_output_role) {
      errors.push("identity.expected_output_role does not match the expected artifact");
    }
    if (expectedOutput.path !== manifest.identity.expected_output_path) {
      errors.push("identity.expected_output_path does not match the expected artifact");
    }
    if (["quarantined", "superseded"].includes(expectedOutput.state)) {
      errors.push("expected output is not an active usable artifact");
    }
  }

  validateRenderBinding(manifest, expectedOutput, errors);
  validateExpectedAncestors(expectedOutput, outputById, errors);
  validateArtifactReceipts(manifest, outputById, errors);
  validatePlatformReceipts(manifest, outputById, errors);
  validateApproval(manifest, expectedOutput, errors);
  validateKnownGaps(manifest, errors);
  validateExternalBindings(manifest, expectedOutput, options, errors);

  return uniqueErrors(errors);
}

function validateManifest(manifest, options = {}) {
  const schemaErrors = validateSchema(manifest);
  return schemaErrors.length > 0 ? schemaErrors : validateManifestSemantics(manifest, options);
}

function sha256File(file) {
  const hash = crypto.createHash("sha256");
  const descriptor = fs.openSync(file, "r");
  const buffer = Buffer.allocUnsafe(1024 * 1024);
  try {
    let bytesRead;
    do {
      bytesRead = fs.readSync(descriptor, buffer, 0, buffer.length, null);
      if (bytesRead > 0) {
        hash.update(buffer.subarray(0, bytesRead));
      }
    } while (bytesRead > 0);
  } finally {
    fs.closeSync(descriptor);
  }
  return hash.digest("hex");
}

function verificationEntries(manifest) {
  const files = [
    {
      path: manifest.identity.project_file,
      sha256: manifest.identity.project_file_sha256,
      label: "project file"
    },
    {
      path: manifest.rights.asset_register,
      sha256: manifest.rights.asset_register_sha256,
      label: "rights asset register"
    }
  ];
  if (manifest.storyboard.status === "required") {
    files.push({
      path: manifest.storyboard.path,
      sha256: manifest.storyboard.sha256,
      label: "storyboard"
    });
  }
  for (const asset of manifest.assets) {
    files.push({ path: asset.path, sha256: asset.sha256, label: `asset ${asset.id}` });
  }
  for (const output of manifest.outputs) {
    files.push({ path: output.path, sha256: output.sha256, label: `output ${output.artifact_id}` });
    files.push({
      path: output.probe_evidence.path,
      sha256: output.probe_evidence.sha256,
      label: `probe evidence ${output.artifact_id}`
    });
  }
  for (const category of [
    "technical",
    "content",
    "audio",
    "accessibility",
    "rights",
    "platform"
  ]) {
    for (const receipt of manifest.validation[category]) {
      files.push({
        path: receipt.evidence_path,
        sha256: receipt.evidence_sha256,
        label: `${category} validation evidence ${receipt.artifact_id}`
      });
    }
  }
  for (const [label, decision] of [
    ["captions", manifest.accessibility.captions],
    ["transcript", manifest.accessibility.transcript],
    ["visual equivalence", manifest.accessibility.visual_equivalence.artifact]
  ]) {
    if (decision.status === "required") {
      files.push({ path: decision.path, sha256: decision.sha256, label });
    }
  }
  if (manifest.approval.state === "accepted") {
    files.push({
      path: manifest.approval.evidence_path,
      sha256: manifest.approval.evidence_sha256,
      label: "approval evidence"
    });
  }
  return files;
}

function verifyFiles(manifest) {
  const errors = [];
  let realRoot;
  try {
    realRoot = fs.realpathSync(manifest.identity.project_root);
    if (!fs.statSync(realRoot).isDirectory()) {
      errors.push(`identity.project_root is not a directory: ${manifest.identity.project_root}`);
      return errors;
    }
  } catch (error) {
    errors.push(`identity.project_root cannot be resolved: ${error.message}`);
    return errors;
  }

  for (const item of verificationEntries(manifest)) {
    const resolved = path.resolve(manifest.identity.project_root, item.path);
    try {
      const realFile = fs.realpathSync(resolved);
      if (!isWithinRoot(realRoot, realFile)) {
        errors.push(`${item.label} realpath escapes identity.project_root: ${resolved}`);
        continue;
      }
      if (!fs.statSync(realFile).isFile()) {
        errors.push(`${item.label} is not a file: ${resolved}`);
      } else if (item.sha256 && sha256File(realFile) !== item.sha256) {
        errors.push(`${item.label} hash mismatch: ${resolved}`);
      }
    } catch (error) {
      errors.push(`${item.label} cannot be verified: ${resolved}: ${error.message}`);
    }
  }
  return uniqueErrors(errors);
}

function parseRational(value) {
  const match = /^(\d+)[/:](\d+)$/.exec(String(value ?? ""));
  if (!match) {
    return undefined;
  }
  const numerator = Number(match[1]);
  const denominator = Number(match[2]);
  return numerator > 0 && denominator > 0 ? { numerator, denominator } : undefined;
}

function sameRational(left, right) {
  return (
    left &&
    right &&
    left.numerator * right.denominator === right.numerator * left.denominator
  );
}

function probeVersion() {
  const result = spawnSync("ffprobe", ["-version"], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024
  });
  if (result.error) {
    return { error: `ffprobe is unavailable: ${result.error.message}` };
  }
  if (result.status !== 0) {
    return { error: `ffprobe version check failed: ${(result.stderr || "").trim()}` };
  }
  const match = /^ffprobe version ([^\s]+)/.exec(result.stdout);
  return match ? { version: match[1] } : { error: "ffprobe version could not be identified" };
}

function runProbe(file) {
  const result = spawnSync(
    "ffprobe",
    ["-v", "error", "-count_frames", "-show_streams", "-show_format", "-of", "json", file],
    { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 }
  );
  if (result.error) {
    return { error: result.error.message };
  }
  if (result.status !== 0) {
    return { error: (result.stderr || "ffprobe rejected the artifact").trim() };
  }
  try {
    return { data: JSON.parse(result.stdout) };
  } catch (error) {
    return { error: `ffprobe returned invalid JSON: ${error.message}` };
  }
}

function compareProbeValue(errors, label, actual, expected) {
  if (actual !== expected) {
    errors.push(`${label} mismatch: observed ${actual ?? "missing"}, expected ${expected}`);
  }
}

function validateLiveProbe(output, probe, errors) {
  const streams = Array.isArray(probe.streams) ? probe.streams : [];
  const visual = streams.find((stream) => stream.codec_type === "video");
  const audio = streams.find((stream) => stream.codec_type === "audio");
  const label = `output ${output.artifact_id}`;
  if (!visual) {
    errors.push(`${label} has no probeable visual stream`);
    return;
  }

  const expected = output.media.expected;
  const observed = output.media.observed;
  compareProbeValue(errors, `${label} width`, Number(visual.width), expected.width);
  compareProbeValue(errors, `${label} height`, Number(visual.height), expected.height);
  compareProbeValue(errors, `${label} pixel format`, visual.pix_fmt, expected.pixel_format);

  if (output.media.kind === "image") {
    compareProbeValue(errors, `${label} image format`, visual.codec_name, expected.format);
    const alpha = /^(?:rgba|bgra|argb|abgr|ya\d*|yuva|gbrap|pal8)/.test(
      visual.pix_fmt ?? ""
    );
    compareProbeValue(errors, `${label} alpha`, alpha, expected.alpha);
    for (const [field, value] of [
      ["format", visual.codec_name],
      ["width", Number(visual.width)],
      ["height", Number(visual.height)],
      ["pixel_format", visual.pix_fmt],
      ["alpha", alpha]
    ]) {
      compareProbeValue(errors, `${label} live observed.${field}`, observed[field], value);
    }
    return;
  }

  const containers = String(probe.format?.format_name ?? "").split(",");
  if (!containers.includes(expected.container)) {
    errors.push(
      `${label} container mismatch: observed ${containers.join(",") || "missing"}, expected ${expected.container}`
    );
  }
  compareProbeValue(errors, `${label} codec`, visual.codec_name, expected.codec);
  compareProbeValue(errors, `${label} codec profile`, visual.profile, expected.codec_profile);
  const liveFps = parseRational(
    visual.avg_frame_rate && visual.avg_frame_rate !== "0/0"
      ? visual.avg_frame_rate
      : visual.r_frame_rate
  );
  if (!sameRational(liveFps, expected.fps)) {
    errors.push(`${label} frame rate does not match the expected rational value`);
  }
  const liveFrames = Number(visual.nb_read_frames ?? visual.nb_frames);
  compareProbeValue(errors, `${label} frame count`, liveFrames, expected.frame_count);
  const liveAspect = parseRational(visual.sample_aspect_ratio);
  if (!sameRational(liveAspect, expected.pixel_aspect_ratio)) {
    errors.push(`${label} pixel aspect ratio does not match`);
  }
  compareProbeValue(errors, `${label} scan`, visual.field_order, expected.scan);
  compareProbeValue(errors, `${label} color primaries`, visual.color_primaries, expected.color.primaries);
  compareProbeValue(errors, `${label} color transfer`, visual.color_transfer, expected.color.transfer);
  compareProbeValue(errors, `${label} color matrix`, visual.color_space, expected.color.matrix);
  const liveRange =
    visual.color_range === "tv"
      ? "limited"
      : visual.color_range === "pc"
        ? "full"
        : visual.color_range;
  compareProbeValue(errors, `${label} color range`, liveRange, expected.color.range);

  if (expected.audio.enabled) {
    if (!audio) {
      errors.push(`${label} expected audio but ffprobe found no audio stream`);
    } else {
      compareProbeValue(
        errors,
        `${label} audio codec`,
        audio.codec_name,
        expected.audio.codec
      );
      compareProbeValue(
        errors,
        `${label} audio sample rate`,
        Number(audio.sample_rate),
        expected.audio.sample_rate_hz
      );
      compareProbeValue(
        errors,
        `${label} audio layout`,
        audio.channel_layout ?? audio.ch_layout?.description,
        expected.audio.layout
      );
    }
  } else if (audio) {
    errors.push(`${label} declares no audio but ffprobe found an audio stream`);
  }

  for (const [field, value] of [
    ["container", expected.container],
    ["codec", visual.codec_name],
    ["codec_profile", visual.profile],
    ["width", Number(visual.width)],
    ["height", Number(visual.height)],
    ["frame_count", liveFrames],
    ["pixel_format", visual.pix_fmt],
    ["scan", visual.field_order]
  ]) {
    compareProbeValue(errors, `${label} live observed.${field}`, observed[field], value);
  }
  if (!sameRational(observed.fps, liveFps)) {
    errors.push(`${label} live observed.fps does not match ffprobe`);
  }
  if (!sameRational(observed.pixel_aspect_ratio, liveAspect)) {
    errors.push(`${label} live observed.pixel_aspect_ratio does not match ffprobe`);
  }
}

function verifyMedia(manifest) {
  const errors = [];
  const version = probeVersion();
  if (version.error) {
    return { errors: [version.error], probes: [] };
  }
  const probes = [];
  for (const output of manifest.outputs) {
    if (!/^ffprobe@[A-Za-z0-9._+-]+$/.test(output.probe_evidence.adapter)) {
      errors.push(`output ${output.artifact_id} requires an ffprobe@<version> probe adapter`);
      continue;
    }
    const file = path.resolve(manifest.identity.project_root, output.path);
    const result = runProbe(file);
    if (result.error) {
      errors.push(`output ${output.artifact_id} live probe failed: ${result.error}`);
      continue;
    }
    validateLiveProbe(output, result.data, errors);
    probes.push({
      artifact_id: output.artifact_id,
      artifact_sha256: output.sha256,
      adapter: `ffprobe@${version.version}`
    });
  }
  return { errors: uniqueErrors(errors), probes };
}

function audioProfile() {
  return {
    enabled: true,
    codec: "aac",
    sample_rate_hz: 48000,
    layout: "stereo",
    loudness_target: "-16 LUFS",
    true_peak_target: "-1 dBTP"
  };
}

function colorProfile() {
  return {
    profile: "Rec.709 SDR",
    primaries: "bt709",
    transfer: "bt709",
    matrix: "bt709",
    range: "limited"
  };
}

function videoProfile() {
  return {
    container: "mp4",
    codec: "h264",
    codec_profile: "High",
    width: 1920,
    height: 1080,
    fps: { numerator: 30000, denominator: 1001 },
    frame_count: 900,
    pixel_aspect_ratio: { numerator: 1, denominator: 1 },
    pixel_format: "yuv420p",
    scan: "progressive",
    color: colorProfile(),
    audio: audioProfile()
  };
}

function imageProfile() {
  return {
    format: "png",
    width: 1920,
    height: 1080,
    pixel_format: "rgba",
    color_profile: "sRGB",
    alpha: true
  };
}

function outputFixture({ artifactId, role, path: outputPath, sha256, profile, probeHash }) {
  const kind = role === "poster" ? "image" : "video";
  return {
    artifact_id: artifactId,
    role,
    source_timeline_id: "timeline-1",
    parent_artifact_ids: [],
    path: outputPath,
    sha256,
    state: "validated",
    media: {
      kind,
      expected: structuredClone(profile),
      observed: structuredClone(profile)
    },
    probe_evidence: {
      adapter: "ffprobe@7.1.1",
      path: `proof/${artifactId}.json`,
      sha256: probeHash
    }
  };
}

function fixture() {
  const reviewHash = "a".repeat(64);
  const posterHash = "b".repeat(64);
  const video = videoProfile();
  return {
    schema_version: 2,
    identity: {
      project_id: "video-project",
      job_id: "job-001",
      project_root: "/tmp/video-project",
      project_file: "project.json",
      project_file_sha256: "c".repeat(64),
      sequence_or_composition: "Main",
      expected_output_artifact_id: "review-1",
      expected_output_role: "review_video",
      expected_output_path: "out/review.mp4"
    },
    source: {
      repository: "example/repo",
      revision: "abc123",
      dirty: false,
      dirty_state_sha256: "not_applicable"
    },
    storyboard: {
      status: "required",
      path: "storyboard.md",
      version: "1",
      sha256: "d".repeat(64),
      reason: ""
    },
    edit: {
      timeline_id: "timeline-1",
      version: "1",
      source_chronology: "truthful",
      proxy_conform: "not_applicable",
      lineage_notes: "Programmatic edit; conform is not applicable."
    },
    render: {
      toolchain: [
        {
          name: "renderer",
          version: "1.2.3",
          digest: `sha256:${"e".repeat(64)}`
        }
      ],
      command_or_project: "npm run render",
      width: video.width,
      height: video.height,
      fps: structuredClone(video.fps),
      frame_count: video.frame_count,
      pixel_format: video.pixel_format,
      scan: video.scan,
      color: structuredClone(video.color),
      audio: structuredClone(video.audio)
    },
    rights: {
      asset_register: "rights/assets.json",
      asset_register_sha256: "6".repeat(64),
      music: "not_applicable",
      voice_likeness: "not_applicable"
    },
    synthetic_media: {
      used: false,
      realistic: false,
      disclosure_required: false,
      decision_evidence: "No synthetic media.",
      provenance_receipt: "not_applicable",
      human_oversight: "Manifest prepared and reviewed by the editor."
    },
    assets: [],
    claims: [],
    outputs: [
      outputFixture({
        artifactId: "review-1",
        role: "review_video",
        path: "out/review.mp4",
        sha256: reviewHash,
        profile: video,
        probeHash: "f".repeat(64)
      }),
      outputFixture({
        artifactId: "poster-1",
        role: "poster",
        path: "out/poster.png",
        sha256: posterHash,
        profile: imageProfile(),
        probeHash: "0".repeat(64)
      })
    ],
    accessibility: {
      speech_present: false,
      essential_visual_information: false,
      decision_evidence: "The silent fixture has no speech or essential visual claims.",
      captions: {
        status: "not_applicable",
        path: "",
        sha256: "not_applicable",
        human_reviewed: false
      },
      transcript: { status: "not_applicable", path: "", sha256: "not_applicable" },
      visual_equivalence: {
        decision: "not_applicable",
        evidence: "No essential visual information is present.",
        artifact: {
          status: "not_applicable",
          path: "",
          sha256: "not_applicable"
        }
      },
      flash_check: { status: "pass", evidence: "manual review" }
    },
    validation: {
      technical: [],
      content: [],
      audio: [],
      accessibility: [],
      rights: [],
      platform: []
    },
    approval: {
      state: "draft",
      owner: "",
      approved_at: "",
      evidence_path: "",
      evidence_sha256: "not_applicable",
      approved_artifact_id: "not_applicable",
      approved_artifact_sha256: "not_applicable"
    },
    known_gaps: []
  };
}

function acceptedFixture() {
  const manifest = fixture();
  const expected = manifest.outputs[0];
  expected.state = "accepted";
  manifest.approval = {
    state: "accepted",
    owner: "reviewer",
    approved_at: "2026-07-26T00:00:00Z",
    evidence_path: "proof/approval.json",
    evidence_sha256: "5".repeat(64),
    approved_artifact_id: expected.artifact_id,
    approved_artifact_sha256: expected.sha256
  };
  for (const category of ["technical", "content", "audio", "accessibility", "rights"]) {
    manifest.validation[category] = [
      {
        check: `${category} gate`,
        artifact_id: expected.artifact_id,
        artifact_sha256: expected.sha256,
        status: "pass",
        evidence_path: `proof/${category}.json`,
        evidence_sha256: "7".repeat(64)
      }
    ];
  }
  return manifest;
}

function platformFixture(withReceipt = true) {
  const manifest = fixture();
  const derivative = outputFixture({
    artifactId: "youtube-1",
    role: "platform_derivative",
    path: "out/youtube.mp4",
    sha256: "1".repeat(64),
    profile: videoProfile(),
    probeHash: "2".repeat(64)
  });
  derivative.parent_artifact_ids = ["review-1"];
  derivative.state = "accepted";
  manifest.outputs.push(derivative);
  manifest.identity.expected_output_artifact_id = derivative.artifact_id;
  manifest.identity.expected_output_role = derivative.role;
  manifest.identity.expected_output_path = derivative.path;
  manifest.approval = {
    state: "accepted",
    owner: "reviewer",
    approved_at: "2026-07-26T00:00:00Z",
    evidence_path: "proof/youtube-approval.json",
    evidence_sha256: "5".repeat(64),
    approved_artifact_id: derivative.artifact_id,
    approved_artifact_sha256: derivative.sha256
  };
  for (const category of ["technical", "content", "audio", "accessibility", "rights"]) {
    manifest.validation[category] = [
      {
        check: `${category} gate`,
        artifact_id: derivative.artifact_id,
        artifact_sha256: derivative.sha256,
        status: "pass",
        evidence_path: `proof/youtube-${category}.json`,
        evidence_sha256: "8".repeat(64)
      }
    ];
  }
  if (withReceipt) {
    manifest.validation.platform = [
      {
        check: "youtube delivery profile",
        artifact_id: derivative.artifact_id,
        artifact_sha256: derivative.sha256,
        platform: "youtube",
        spec_source: "https://support.google.com/youtube/answer/1722171",
        source_authority: "official_primary",
        verified_at: new Date().toISOString(),
        status: "pass",
        evidence_path: "proof/youtube-platform.json",
        evidence_sha256: "9".repeat(64)
      }
    ];
  }
  return manifest;
}

function externalOptionsFor(manifest) {
  const expectedOutput = manifest.outputs.find(
    (output) => output.artifact_id === manifest.identity.expected_output_artifact_id
  );
  return {
    expectedJobId: manifest.identity.job_id,
    expectedProjectId: manifest.identity.project_id,
    expectedProjectRoot: manifest.identity.project_root,
    expectedSourceRevision: manifest.source.revision,
    expectedProjectFileSha256: manifest.identity.project_file_sha256,
    expectedSequenceOrComposition: manifest.identity.sequence_or_composition,
    expectedTimelineId: manifest.edit.timeline_id,
    expectedDirtyStateSha256: manifest.source.dirty_state_sha256,
    expectedArtifactId: manifest.identity.expected_output_artifact_id,
    expectedArtifactSha256: expectedOutput?.sha256,
    expectedOutputRole: manifest.identity.expected_output_role,
    expectedOutputPath: manifest.identity.expected_output_path,
    expectedApprovalOwner: manifest.approval.owner
  };
}

function writeVerificationFixture(manifest) {
  const contents = new Map([
    [manifest.identity.project_file, "project"],
    [manifest.rights.asset_register, "rights"],
    ...manifest.outputs.flatMap((output) => [
      [output.path, `artifact:${output.artifact_id}`],
      [output.probe_evidence.path, `probe:${output.artifact_id}`]
    ])
  ]);
  if (manifest.storyboard.status === "required") {
    contents.set(manifest.storyboard.path, "storyboard");
  }
  for (const asset of manifest.assets) {
    contents.set(asset.path, `asset:${asset.id}`);
  }
  for (const [label, decision] of [
    ["captions", manifest.accessibility.captions],
    ["transcript", manifest.accessibility.transcript],
    ["visual-equivalence", manifest.accessibility.visual_equivalence.artifact]
  ]) {
    if (decision.status === "required") {
      contents.set(decision.path, label);
    }
  }
  for (const category of [
    "technical",
    "content",
    "audio",
    "accessibility",
    "rights",
    "platform"
  ]) {
    for (const receipt of manifest.validation[category]) {
      contents.set(receipt.evidence_path, `${category}:${receipt.check}`);
    }
  }
  if (manifest.approval.state === "accepted") {
    contents.set(
      manifest.approval.evidence_path,
      `approval:${manifest.approval.owner}:${manifest.approval.approved_artifact_id}`
    );
  }

  for (const [relative, content] of contents) {
    const target = path.resolve(manifest.identity.project_root, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
  manifest.identity.project_file_sha256 = sha256File(
    path.resolve(manifest.identity.project_root, manifest.identity.project_file)
  );
  manifest.rights.asset_register_sha256 = sha256File(
    path.resolve(manifest.identity.project_root, manifest.rights.asset_register)
  );
  if (manifest.storyboard.status === "required") {
    manifest.storyboard.sha256 = sha256File(
      path.resolve(manifest.identity.project_root, manifest.storyboard.path)
    );
  }
  for (const asset of manifest.assets) {
    asset.sha256 = sha256File(path.resolve(manifest.identity.project_root, asset.path));
  }
  for (const output of manifest.outputs) {
    output.sha256 = sha256File(path.resolve(manifest.identity.project_root, output.path));
    output.probe_evidence.sha256 = sha256File(
      path.resolve(manifest.identity.project_root, output.probe_evidence.path)
    );
  }
  const outputById = new Map(manifest.outputs.map((output) => [output.artifact_id, output]));
  for (const category of [
    "technical",
    "content",
    "audio",
    "accessibility",
    "rights",
    "platform"
  ]) {
    for (const receipt of manifest.validation[category]) {
      const output = outputById.get(receipt.artifact_id);
      if (output) {
        receipt.artifact_sha256 = output.sha256;
      }
    }
  }
  if (manifest.approval.state === "accepted") {
    const approvedOutput = outputById.get(manifest.approval.approved_artifact_id);
    if (approvedOutput) {
      manifest.approval.approved_artifact_sha256 = approvedOutput.sha256;
    }
  }
  for (const decision of [
    manifest.accessibility.captions,
    manifest.accessibility.transcript,
    manifest.accessibility.visual_equivalence.artifact
  ]) {
    if (decision.status === "required") {
      decision.sha256 = sha256File(path.resolve(manifest.identity.project_root, decision.path));
    }
  }
  for (const category of [
    "technical",
    "content",
    "audio",
    "accessibility",
    "rights",
    "platform"
  ]) {
    for (const receipt of manifest.validation[category]) {
      receipt.evidence_sha256 = sha256File(
        path.resolve(manifest.identity.project_root, receipt.evidence_path)
      );
    }
  }
  if (manifest.approval.state === "accepted") {
    manifest.approval.evidence_sha256 = sha256File(
      path.resolve(manifest.identity.project_root, manifest.approval.evidence_path)
    );
  }
}

function fileVerificationSelfTest() {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "video-manifest-validator-"));
  try {
    const manifest = fixture();
    manifest.identity.project_root = path.resolve(sandbox, "project");
    fs.mkdirSync(manifest.identity.project_root, { recursive: true });
    writeVerificationFixture(manifest);
    assertValid("file verification fixture", manifest);
    const validErrors = verifyFiles(manifest);
    if (validErrors.length > 0) {
      throw new Error(`valid file verification failed: ${validErrors.join("; ")}`);
    }

    const accepted = acceptedFixture();
    accepted.identity.project_root = path.resolve(sandbox, "accepted-project");
    fs.mkdirSync(accepted.identity.project_root, { recursive: true });
    writeVerificationFixture(accepted);
    const acceptedOptions = externalOptionsFor(accepted);
    assertValid("accepted file verification fixture", accepted, acceptedOptions);
    const acceptedInvocationErrors = validateCompletionInvocation(accepted, {
      verifyFiles: true,
      verifyMedia: true,
      options: acceptedOptions
    });
    const acceptedFileErrors = verifyFiles(accepted);
    if (acceptedInvocationErrors.length > 0 || acceptedFileErrors.length > 0) {
      throw new Error(
        `accepted completion verification failed: ${[
          ...acceptedInvocationErrors,
          ...acceptedFileErrors
        ].join("; ")}`
      );
    }
    const installedProbe = probeVersion();
    if (!installedProbe.error && verifyMedia(accepted).errors.length === 0) {
      throw new Error("non-media fixture passed live media verification");
    }

    const output = manifest.outputs[0];
    const outputPath = path.resolve(manifest.identity.project_root, output.path);
    const outsidePath = path.resolve(sandbox, "outside.mp4");
    fs.writeFileSync(outsidePath, "outside");
    fs.unlinkSync(outputPath);
    fs.symlinkSync(outsidePath, outputPath);
    output.sha256 = sha256File(outsidePath);
    const escapeErrors = verifyFiles(manifest);
    if (!escapeErrors.some((error) => error.includes("realpath escapes"))) {
      throw new Error(`symlink escape was accepted: ${escapeErrors.join("; ")}`);
    }
  } finally {
    fs.rmSync(sandbox, { recursive: true, force: true });
  }
}

function assertValid(name, manifest, options = {}) {
  const errors = validateManifest(manifest, options);
  if (errors.length > 0) {
    throw new Error(`${name} was rejected: ${errors.join("; ")}`);
  }
}

function assertInvalid(name, manifest, expectedText, options = {}) {
  const errors = validateManifest(manifest, options);
  if (!errors.some((error) => error.includes(expectedText))) {
    throw new Error(`${name} was accepted or missed ${expectedText}: ${errors.join("; ")}`);
  }
}

function assertCliError(name, args) {
  try {
    parseArgs(args);
  } catch (error) {
    if (error instanceof CliError) {
      return;
    }
    throw error;
  }
  throw new Error(`${name} CLI misuse was accepted`);
}

function selfTest() {
  const valid = fixture();
  assertValid("valid draft manifest", valid, {
    expectedJobId: "job-001",
    expectedProjectId: "video-project",
    expectedProjectRoot: "/tmp/video-project",
    expectedArtifactId: "review-1",
    expectedArtifactSha256: "a".repeat(64),
    expectedOutputRole: "review_video",
    expectedOutputPath: "out/review.mp4"
  });

  const noStoryboard = structuredClone(valid);
  noStoryboard.storyboard = {
    status: "not_applicable",
    path: "",
    version: "not_applicable",
    sha256: "not_applicable",
    reason: "Delivery-only validation used an existing project artifact."
  };
  assertValid("storyboard not applicable decision", noStoryboard);

  const extraProperty = structuredClone(valid);
  extraProperty.unexpected = true;
  assertInvalid("unknown schema property", extraProperty, "additional properties");

  const malformedParent = structuredClone(valid);
  malformedParent.outputs[0].parent_artifact_ids = 7;
  assertInvalid("malformed parent list", malformedParent, "must be array");

  const relativeRoot = structuredClone(valid);
  relativeRoot.identity.project_root = "video-project";
  assertInvalid("relative project root", relativeRoot, "must be absolute");

  const escapingPath = structuredClone(valid);
  escapingPath.outputs[0].path = "../review.mp4";
  escapingPath.identity.expected_output_path = "../review.mp4";
  assertInvalid("escaping artifact path", escapingPath, "without traversal");

  const windowsDrivePath = structuredClone(valid);
  windowsDrivePath.outputs[0].path = "C:\\video\\review.mp4";
  windowsDrivePath.identity.expected_output_path = "C:\\video\\review.mp4";
  assertInvalid("Windows absolute artifact path", windowsDrivePath, "without traversal");

  const windowsUncPath = structuredClone(valid);
  windowsUncPath.outputs[0].path = "\\\\server\\share\\review.mp4";
  windowsUncPath.identity.expected_output_path = "\\\\server\\share\\review.mp4";
  assertInvalid("Windows UNC artifact path", windowsUncPath, "without traversal");

  const backslashRelativePath = structuredClone(valid);
  backslashRelativePath.outputs[0].path = "out\\review.mp4";
  backslashRelativePath.identity.expected_output_path = "out\\review.mp4";
  assertInvalid("non-portable artifact path", backslashRelativePath, "without traversal");

  for (const [name, unsafePath] of [
    ["Windows drive-relative artifact path", "C:review.mp4"],
    ["Windows device artifact path", "out/NUL.mp4"],
    ["trailing-dot artifact path", "out/review.mp4."]
  ]) {
    const unsafe = structuredClone(valid);
    unsafe.outputs[0].path = unsafePath;
    unsafe.identity.expected_output_path = unsafePath;
    assertInvalid(name, unsafe, "without traversal");
  }

  const duplicatePath = structuredClone(valid);
  duplicatePath.outputs[1].path = duplicatePath.outputs[0].path;
  assertInvalid("duplicate output path", duplicatePath, "duplicates output paths");

  const duplicateArtifact = structuredClone(valid);
  duplicateArtifact.outputs[1].artifact_id = duplicateArtifact.outputs[0].artifact_id;
  assertInvalid("duplicate artifact ID", duplicateArtifact, "duplicates outputs");

  const wrongTimeline = structuredClone(valid);
  wrongTimeline.outputs[0].source_timeline_id = "unrelated-timeline";
  assertInvalid("wrong output timeline", wrongTimeline, "does not match edit.timeline_id");

  const duplicateTool = structuredClone(valid);
  duplicateTool.render.toolchain.push(structuredClone(duplicateTool.render.toolchain[0]));
  assertInvalid("duplicate tool identity", duplicateTool, "duplicates render.toolchain");

  const duplicateAssets = structuredClone(valid);
  duplicateAssets.assets = [
    {
      id: "asset-1",
      path: "assets/one.png",
      sha256: "4".repeat(64),
      license: "cleared: owned"
    },
    {
      id: "asset-1",
      path: "assets/two.png",
      sha256: "5".repeat(64),
      license: "cleared: owned"
    }
  ];
  assertInvalid("duplicate asset ID", duplicateAssets, "duplicates assets");

  const duplicateClaims = structuredClone(valid);
  duplicateClaims.claims = [
    { id: "claim-1", text: "Claim one", evidence: "evidence one" },
    { id: "claim-1", text: "Claim two", evidence: "evidence two" }
  ];
  assertInvalid("duplicate claim ID", duplicateClaims, "duplicates claims");

  const cycle = structuredClone(valid);
  cycle.outputs[0].parent_artifact_ids = ["poster-1"];
  cycle.outputs[1].parent_artifact_ids = ["review-1"];
  assertInvalid("lineage cycle", cycle, "lineage cycle");

  const wrongMediaKind = structuredClone(valid);
  wrongMediaKind.outputs[1].media = structuredClone(valid.outputs[0].media);
  assertInvalid("poster video profile", wrongMediaKind, "media.kind must be image");

  const probeMismatch = structuredClone(valid);
  probeMismatch.outputs[0].media.observed.width = 1280;
  assertInvalid("observed profile mismatch", probeMismatch, "does not match expected profile");

  const liveProbe = {
    streams: [
      {
        codec_type: "video",
        codec_name: "h264",
        profile: "High",
        width: 1920,
        height: 1080,
        avg_frame_rate: "30000/1001",
        r_frame_rate: "30000/1001",
        nb_read_frames: "900",
        sample_aspect_ratio: "1:1",
        pix_fmt: "yuv420p",
        field_order: "progressive",
        color_primaries: "bt709",
        color_transfer: "bt709",
        color_space: "bt709",
        color_range: "tv"
      },
      {
        codec_type: "audio",
        codec_name: "aac",
        sample_rate: "48000",
        channel_layout: "stereo"
      }
    ],
    format: { format_name: "mov,mp4,m4a,3gp,3g2,mj2" }
  };
  const liveProbeErrors = [];
  validateLiveProbe(valid.outputs[0], liveProbe, liveProbeErrors);
  if (liveProbeErrors.length > 0) {
    throw new Error(`valid live probe was rejected: ${liveProbeErrors.join("; ")}`);
  }
  const wrongLiveProbe = structuredClone(liveProbe);
  wrongLiveProbe.streams[0].width = 1280;
  const wrongLiveProbeErrors = [];
  validateLiveProbe(valid.outputs[0], wrongLiveProbe, wrongLiveProbeErrors);
  if (!wrongLiveProbeErrors.some((error) => error.includes("width mismatch"))) {
    throw new Error(`live probe mismatch was accepted: ${wrongLiveProbeErrors.join("; ")}`);
  }

  const floatingTool = structuredClone(valid);
  floatingTool.render.toolchain[0].version = "latest";
  assertInvalid("floating tool version", floatingTool, "must match pattern");

  const wrongExternalBindings = [
    [{ expectedJobId: "wrong" }, "job identity mismatch"],
    [{ expectedProjectId: "wrong" }, "project identity mismatch"],
    [{ expectedProjectRoot: "/tmp/wrong" }, "project root mismatch"],
    [{ expectedSourceRevision: "wrong" }, "source revision mismatch"],
    [{ expectedProjectFileSha256: "9".repeat(64) }, "project file hash mismatch"],
    [{ expectedSequenceOrComposition: "wrong" }, "sequence or composition mismatch"],
    [{ expectedTimelineId: "wrong" }, "timeline identity mismatch"],
    [{ expectedDirtyStateSha256: "9".repeat(64) }, "dirty-state hash mismatch"],
    [{ expectedArtifactId: "wrong" }, "artifact identity mismatch"],
    [{ expectedArtifactSha256: "9".repeat(64) }, "artifact hash mismatch"],
    [{ expectedOutputRole: "master" }, "output role mismatch"],
    [{ expectedOutputPath: "out/wrong.mp4" }, "output path mismatch"],
    [{ expectedApprovalOwner: "wrong" }, "approval owner mismatch"]
  ];
  for (const [options, message] of wrongExternalBindings) {
    assertInvalid(message, valid, message, options);
  }

  assertValid("valid accepted manifest", acceptedFixture());

  const acceptedOutputUnderDraft = fixture();
  acceptedOutputUnderDraft.outputs[0].state = "accepted";
  assertInvalid(
    "accepted output under draft approval",
    acceptedOutputUnderDraft,
    "non-accepted manifest cannot contain accepted output"
  );

  const posterApproval = acceptedFixture();
  posterApproval.outputs[0].state = "validated";
  posterApproval.outputs[1].state = "accepted";
  posterApproval.approval.approved_artifact_id = "poster-1";
  posterApproval.approval.approved_artifact_sha256 = posterApproval.outputs[1].sha256;
  assertInvalid("approval bound to poster", posterApproval, "approved artifact ID does not match");

  assertValid("accepted platform derivative", platformFixture(true));
  assertInvalid(
    "platform derivative without receipt",
    platformFixture(false),
    "artifact-bound platform receipt"
  );

  const stalePlatformReceipt = platformFixture(true);
  stalePlatformReceipt.validation.platform[0].artifact_sha256 = "3".repeat(64);
  assertInvalid("stale platform receipt", stalePlatformReceipt, "artifact hash is stale");

  const expiredPlatformReceipt = platformFixture(true);
  expiredPlatformReceipt.validation.platform[0].verified_at = "2000-01-01T00:00:00Z";
  assertInvalid(
    "expired platform receipt",
    expiredPlatformReceipt,
    "current-spec verification is older than 30 days"
  );

  const undatedPlatformReceipt = platformFixture(true);
  delete undatedPlatformReceipt.validation.platform[0].verified_at;
  assertInvalid("undated platform receipt", undatedPlatformReceipt, "required property");

  const staleTechnicalReceipt = acceptedFixture();
  staleTechnicalReceipt.validation.technical[0].artifact_sha256 = "3".repeat(64);
  assertInvalid("stale technical receipt", staleTechnicalReceipt, "artifact hash is stale");

  const sharedEvidenceReceipt = acceptedFixture();
  sharedEvidenceReceipt.validation.content[0].evidence_path =
    sharedEvidenceReceipt.validation.technical[0].evidence_path;
  sharedEvidenceReceipt.validation.content[0].evidence_sha256 =
    sharedEvidenceReceipt.validation.technical[0].evidence_sha256;
  assertValid("one evidence report supporting multiple checks", sharedEvidenceReceipt);

  const unresolvedGap = acceptedFixture();
  unresolvedGap.known_gaps = [
    {
      id: "gap-1",
      category: "technical",
      disposition: "unresolved",
      evidence: "Codec probe pending.",
      accepted_by: ""
    }
  ];
  assertInvalid("accepted unresolved gap", unresolvedGap, "cannot retain unresolved gap");

  const criticalGap = acceptedFixture();
  criticalGap.known_gaps = [
    {
      id: "gap-2",
      category: "rights",
      disposition: "accepted",
      evidence: "Music license is unresolved.",
      accepted_by: "reviewer"
    }
  ];
  assertInvalid("accepted critical gap", criticalGap, "cannot retain rights gap");

  const resolvedCriticalGap = acceptedFixture();
  resolvedCriticalGap.known_gaps = [
    {
      id: "gap-resolved",
      category: "rights",
      disposition: "resolved",
      evidence: "The licensed track replaced the uncleared source.",
      accepted_by: ""
    }
  ];
  assertValid("resolved critical gap history", resolvedCriticalGap);

  const accessibilityGap = acceptedFixture();
  accessibilityGap.known_gaps = [
    {
      id: "gap-accessibility",
      category: "accessibility",
      disposition: "accepted",
      evidence: "Captions have not been human reviewed.",
      accepted_by: "reviewer"
    }
  ];
  assertInvalid(
    "accepted accessibility gap",
    accessibilityGap,
    "cannot retain accessibility gap"
  );

  const acceptedGap = acceptedFixture();
  acceptedGap.known_gaps = [
    {
      id: "gap-3",
      category: "platform",
      disposition: "accepted",
      evidence: "Optional secondary platform crop remains pending.",
      accepted_by: "reviewer"
    }
  ];
  assertValid("accepted non-blocking gap", acceptedGap);

  const unclearedRights = acceptedFixture();
  unclearedRights.rights.music = "license missing";
  assertInvalid("uncleared rights decision", unclearedRights, "must match pattern");

  const speechWithoutCaptions = acceptedFixture();
  speechWithoutCaptions.accessibility.speech_present = true;
  speechWithoutCaptions.accessibility.decision_evidence = "The fixture includes spoken dialogue.";
  assertInvalid(
    "speech without reviewed captions",
    speechWithoutCaptions,
    "must be equal to constant"
  );

  const essentialVisualsWithoutAlternative = acceptedFixture();
  essentialVisualsWithoutAlternative.accessibility.essential_visual_information = true;
  essentialVisualsWithoutAlternative.accessibility.decision_evidence =
    "The workflow result is shown only on screen.";
  assertInvalid(
    "essential visuals without an alternative",
    essentialVisualsWithoutAlternative,
    "must be equal to one of the allowed values"
  );

  const silentAccepted = acceptedFixture();
  const silent = {
    enabled: false,
    codec: "not_applicable",
    sample_rate_hz: "not_applicable",
    layout: "not_applicable",
    loudness_target: "not_applicable",
    true_peak_target: "not_applicable"
  };
  silentAccepted.render.audio = structuredClone(silent);
  silentAccepted.outputs[0].media.expected.audio = structuredClone(silent);
  silentAccepted.outputs[0].media.observed.audio = structuredClone(silent);
  silentAccepted.validation.audio = [];
  assertValid("accepted silent video", silentAccepted);

  const syntheticWithoutReceipt = fixture();
  syntheticWithoutReceipt.synthetic_media.used = true;
  assertInvalid(
    "synthetic media without provenance",
    syntheticWithoutReceipt,
    "must NOT be valid"
  );

  const acceptedCompletion = acceptedFixture();
  const completionOptions = externalOptionsFor(acceptedCompletion);
  const missingCompletionProof = validateCompletionInvocation(acceptedCompletion, {
    verifyFiles: false,
    verifyMedia: false,
    options: {}
  });
  if (
    !missingCompletionProof.some((error) => error.includes("--verify-files")) ||
    !missingCompletionProof.some((error) => error.includes("--verify-media")) ||
    !missingCompletionProof.some((error) => error.includes("--expected-artifact-sha256"))
  ) {
    throw new Error(`accepted completion proof was optional: ${missingCompletionProof.join("; ")}`);
  }
  assertValid("accepted manifest with external completion bindings", acceptedCompletion, completionOptions);
  const completeInvocationErrors = validateCompletionInvocation(acceptedCompletion, {
    verifyFiles: true,
    verifyMedia: true,
    options: completionOptions
  });
  if (completeInvocationErrors.length > 0) {
    throw new Error(`complete accepted invocation was rejected: ${completeInvocationErrors.join("; ")}`);
  }

  assertCliError("unknown option", ["manifest.json", "--bogus"]);
  assertCliError("duplicate flag", ["manifest.json", "--verify-files", "--verify-files"]);
  assertCliError("duplicate media flag", ["manifest.json", "--verify-media", "--verify-media"]);
  assertCliError("media without files", ["manifest.json", "--verify-media"]);
  assertCliError("missing option value", ["manifest.json", "--expected-job-id", "--verify-files"]);
  assertCliError("extra positional", ["manifest.json", "extra.json"]);
  assertCliError("self-test combination", ["--self-test", "--bogus"]);

  fileVerificationSelfTest();

  console.log("video manifest validator self-test passed");
}

function parseArgs(args) {
  if (args.length === 1 && args[0] === "--self-test") {
    return { selfTest: true, verifyFiles: false, verifyMedia: false, options: {} };
  }
  if (args.includes("--self-test")) {
    throw new CliError("--self-test must be used alone");
  }

  let manifestPath;
  let verify = false;
  let media = false;
  const options = {};
  const seen = new Set();
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--verify-files") {
      if (verify) {
        throw new CliError("--verify-files may only be supplied once");
      }
      verify = true;
      continue;
    }
    if (argument === "--verify-media") {
      if (media) {
        throw new CliError("--verify-media may only be supplied once");
      }
      media = true;
      continue;
    }
    if (VALUE_OPTIONS.has(argument)) {
      if (seen.has(argument)) {
        throw new CliError(`${argument} may only be supplied once`);
      }
      const value = args[index + 1];
      if (!value || value.startsWith("--")) {
        throw new CliError(`${argument} requires a value`);
      }
      seen.add(argument);
      options[VALUE_OPTIONS.get(argument)] = value;
      index += 1;
      continue;
    }
    if (argument.startsWith("--")) {
      throw new CliError(`unknown option: ${argument}`);
    }
    if (manifestPath) {
      throw new CliError(`unexpected positional argument: ${argument}`);
    }
    manifestPath = argument;
  }

  if (!manifestPath) {
    throw new CliError("manifest path is required");
  }
  if (media && !verify) {
    throw new CliError("--verify-media requires --verify-files");
  }
  if (options.expectedProjectRoot !== undefined) {
    const rootErrors = [];
    validateAbsoluteRoot(options.expectedProjectRoot, "--expected-project-root", rootErrors);
    if (rootErrors.length > 0) {
      throw new CliError(rootErrors[0]);
    }
  }
  if (
    options.expectedOutputPath !== undefined &&
    !isCanonicalRelativePath(options.expectedOutputPath)
  ) {
    throw new CliError("--expected-output-path must be canonical and project-root-relative");
  }
  if (
    options.expectedOutputRole !== undefined &&
    !OUTPUT_ROLES.has(options.expectedOutputRole)
  ) {
    throw new CliError("--expected-output-role is invalid");
  }
  if (
    options.expectedArtifactSha256 !== undefined &&
    !SHA256.test(options.expectedArtifactSha256)
  ) {
    throw new CliError("--expected-artifact-sha256 must be a lowercase SHA-256");
  }
  if (
    options.expectedProjectFileSha256 !== undefined &&
    !SHA256.test(options.expectedProjectFileSha256)
  ) {
    throw new CliError("--expected-project-file-sha256 must be a lowercase SHA-256");
  }
  if (
    options.expectedDirtyStateSha256 !== undefined &&
    options.expectedDirtyStateSha256 !== "not_applicable" &&
    !SHA256.test(options.expectedDirtyStateSha256)
  ) {
    throw new CliError(
      "--expected-dirty-state-sha256 must be a lowercase SHA-256 or not_applicable"
    );
  }
  for (const [key, flag] of [
    ["expectedJobId", "--expected-job-id"],
    ["expectedProjectId", "--expected-project-id"],
    ["expectedSourceRevision", "--expected-source-revision"],
    ["expectedSequenceOrComposition", "--expected-sequence-or-composition"],
    ["expectedTimelineId", "--expected-timeline-id"],
    ["expectedArtifactId", "--expected-artifact-id"],
    ["expectedApprovalOwner", "--expected-approval-owner"]
  ]) {
    if (
      options[key] !== undefined &&
      (options[key].trim() === "" || options[key] === "not_applicable")
    ) {
      throw new CliError(`${flag} must identify a real external value`);
    }
  }

  return { selfTest: false, manifestPath, verifyFiles: verify, verifyMedia: media, options };
}

function usage() {
  console.error(
    "usage: validate-video-manifest.mjs <manifest.json> [--verify-files] [--verify-media] " +
      "[--expected-job-id <id>] [--expected-project-id <id>] " +
      "[--expected-project-root <absolute-path>] [--expected-source-revision <revision>] " +
      "[--expected-project-file-sha256 <sha256>] [--expected-sequence-or-composition <id>] " +
      "[--expected-timeline-id <id>] [--expected-dirty-state-sha256 <sha256|not_applicable>] " +
      "[--expected-artifact-id <id>] " +
      "[--expected-artifact-sha256 <sha256>] [--expected-output-role <role>] " +
      "[--expected-output-path <project-relative-path>] [--expected-approval-owner <owner>]"
  );
  console.error("       validate-video-manifest.mjs --self-test");
}

function main(args) {
  let parsed;
  try {
    parsed = parseArgs(args);
  } catch (error) {
    if (error instanceof CliError) {
      console.error(`ERROR: ${error.message}`);
      usage();
      return 2;
    }
    throw error;
  }

  if (parsed.selfTest) {
    selfTest();
    return 0;
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(parsed.manifestPath, "utf8"));
  } catch (error) {
    console.error(`ERROR: invalid manifest JSON: ${error.message}`);
    return 1;
  }

  const errors = validateManifest(manifest, parsed.options);
  if (errors.length === 0) {
    errors.push(...validateCompletionInvocation(manifest, parsed));
  }
  if (parsed.verifyFiles && errors.length === 0) {
    errors.push(...verifyFiles(manifest));
  }
  let probes = [];
  if (parsed.verifyMedia && errors.length === 0) {
    const media = verifyMedia(manifest);
    errors.push(...media.errors);
    probes = media.probes;
  }
  if (errors.length > 0) {
    for (const error of uniqueErrors(errors)) {
      console.error(`ERROR: ${error}`);
    }
    return 1;
  }

  const expectedOutput = manifest.outputs.find(
    (output) => output.artifact_id === manifest.identity.expected_output_artifact_id
  );
  console.log(
    JSON.stringify(
      {
        receipt_version: 1,
        verified_at: new Date().toISOString(),
        manifest_sha256: sha256File(path.resolve(parsed.manifestPath)),
        schema_sha256: sha256File(SCHEMA_PATH),
        job_id: manifest.identity.job_id,
        source_revision: manifest.source.revision,
        project_file_sha256: manifest.identity.project_file_sha256,
        artifact_id: expectedOutput?.artifact_id,
        artifact_sha256: expectedOutput?.sha256,
        approval_state: manifest.approval.state,
        approval_owner: manifest.approval.owner,
        verified_files: parsed.verifyFiles,
        verified_media: parsed.verifyMedia,
        probes
      },
      null,
      2
    )
  );
  return 0;
}

try {
  process.exitCode = main(process.argv.slice(2));
} catch (error) {
  console.error(`ERROR: video manifest validator failed: ${error.message}`);
  process.exitCode = 1;
}
