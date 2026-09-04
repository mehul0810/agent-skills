#!/usr/bin/env node

import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";

const allowedTypes = new Set([
  "intent",
  "owner",
  "artifact",
  "runtime",
  "observation",
  "correction",
  "proof",
  "outcome",
  "learning",
]);
const allowedStates = new Set([
  "verified",
  "provisional",
  "unknown",
  "failed",
  "not_applicable",
]);
const allowedEvidenceKinds = new Set([
  "repo",
  "git",
  "github",
  "runtime",
  "test",
  "browser",
  "editor",
  "package",
  "public",
  "owner",
]);
const allowedProofKinds = new Set(["verification", "regression"]);
const allowedPromotionDestinations = new Set([
  "repo_doc",
  "adr",
  "issue",
  "skill",
  "automation",
]);
const allowedIdentityKeys = new Set([
  "repository",
  "revision",
  "pullRequest",
  "issue",
  "tag",
  "packageSha256",
  "runId",
  "environment",
  "actor",
  "viewport",
  "dataFixture",
  "observedAt",
  "trustClass",
  "privacyClass",
]);
const fingerprintPattern = /^sha256:[a-f0-9]{64}$/;
const shaPattern = /^[a-f0-9]{40}$/;
const schemaPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../shared/schemas/wordpress-engineering-graph.schema.json");

function canonicalSchemaErrors(graph) {
  try {
    const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
    const validator = new Ajv({
      allErrors: true,
      strict: false,
      formats: {
        "date-time": (value) => typeof value === "string" && Number.isFinite(Date.parse(value)),
      },
    }).compile(schema);
    if (validator(graph)) return [];
    return (validator.errors ?? []).map((error) => `schema: ${error.instancePath || "graph"} ${error.message}`);
  } catch (error) {
    return [`schema validator unavailable: ${error.message}`];
  }
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateGraph(graph, { graphPath = null } = {}) {
  const errors = [];

  if (!isObject(graph)) {
    return ["graph must be a JSON object"];
  }
  errors.push(...canonicalSchemaErrors(graph));
  if (graph.schemaVersion !== 2) {
    errors.push("schemaVersion must be 2");
  }
  if (typeof graph.task !== "string" || graph.task.trim() === "") {
    errors.push("task must be a non-empty string");
  }
  if (
    graph.assuranceLevel !== undefined &&
    !["baseline", "elevated", "release"].includes(graph.assuranceLevel)
  ) {
    errors.push("assuranceLevel must be baseline, elevated, or release");
  }
  if (["elevated", "release"].includes(graph.assuranceLevel)) {
    if (!isObject(graph.source)) {
      errors.push(`${graph.assuranceLevel} graph requires root source identity`);
    } else {
      if (!graph.source.revision && !graph.source.packageSha256) {
        errors.push("root source identity requires revision or package digest");
      }
      if (typeof graph.source.environment !== "string" || !graph.source.environment.trim()) {
        errors.push("root source identity requires environment");
      }
      if (!Number.isFinite(Date.parse(graph.source.observedAt))) {
        errors.push("root source identity requires observed-at time");
      }
    }
  }
  if (!Array.isArray(graph.nodes) || graph.nodes.length === 0) {
    return [...errors, "nodes must be a non-empty array"];
  }
  if (!Array.isArray(graph.acceptanceCriteria) || graph.acceptanceCriteria.length === 0) {
    errors.push("acceptanceCriteria must be a non-empty array");
  }
  if (graph.source !== undefined) {
    if (!isObject(graph.source) || typeof graph.source.repository !== "string" || !graph.source.repository.trim()) {
      errors.push("source must identify a repository when present");
    } else {
      if (graph.source.revision !== undefined && !shaPattern.test(graph.source.revision)) errors.push("source.revision must be a full commit SHA");
      if (graph.source.packageSha256 !== undefined && !fingerprintPattern.test(graph.source.packageSha256)) errors.push("source.packageSha256 must be sha256:<64 lowercase hex>");
      if (graph.source.observedAt !== undefined && !Number.isFinite(Date.parse(graph.source.observedAt))) errors.push("source.observedAt must be an ISO date-time");
    }
  }
  if (graph.requiredNodeTypes !== undefined && (!Array.isArray(graph.requiredNodeTypes) || graph.requiredNodeTypes.some((type) => !allowedTypes.has(type)))) {
    errors.push("requiredNodeTypes must contain only known graph node types");
  }

  const ids = new Set();
  const byId = new Map();

  for (const [index, node] of graph.nodes.entries()) {
    const label = `nodes[${index}]`;
    if (!isObject(node)) {
      errors.push(`${label} must be an object`);
      continue;
    }
    if (typeof node.id !== "string" || !/^[a-z0-9][a-z0-9._-]*$/.test(node.id)) {
      errors.push(`${label}.id must use lowercase letters, digits, dots, underscores, or hyphens`);
    } else if (ids.has(node.id)) {
      errors.push(`${label}.id duplicates ${node.id}`);
    } else {
      ids.add(node.id);
      byId.set(node.id, node);
    }
    if (!allowedTypes.has(node.type)) {
      errors.push(`${label}.type is invalid`);
    }
    if (typeof node.owner !== "string" || node.owner.trim() === "") {
      errors.push(`${label}.owner must be non-empty`);
    }
    if (node.fingerprint !== undefined && !fingerprintPattern.test(node.fingerprint)) {
      errors.push(`${label}.fingerprint must be sha256:<64 lowercase hex>`);
    }
    if (node.dependencyFingerprints !== undefined && !isObject(node.dependencyFingerprints)) {
      errors.push(`${label}.dependencyFingerprints must be an object`);
    }
    if (!allowedStates.has(node.state)) {
      errors.push(`${label}.state is invalid`);
    }
    if (typeof node.critical !== "boolean") {
      errors.push(`${label}.critical must be boolean`);
    }
    if (!Array.isArray(node.dependsOn)) {
      errors.push(`${label}.dependsOn must be an array`);
    } else if (new Set(node.dependsOn).size !== node.dependsOn.length) {
      errors.push(`${label}.dependsOn must not contain duplicates`);
    }
    if (!Array.isArray(node.evidence)) {
      errors.push(`${label}.evidence must be an array`);
      continue;
    }
    for (const [evidenceIndex, evidence] of node.evidence.entries()) {
      const evidenceLabel = `${label}.evidence[${evidenceIndex}]`;
      if (!isObject(evidence)) {
        errors.push(`${evidenceLabel} must be an object`);
        continue;
      }
      if (!allowedEvidenceKinds.has(evidence.kind)) {
        errors.push(`${evidenceLabel}.kind is invalid`);
      }
      if (typeof evidence.pointer !== "string" || evidence.pointer.trim() === "") {
        errors.push(`${evidenceLabel}.pointer must be non-empty`);
      }
      if (
        evidence.identity !== undefined &&
        (!isObject(evidence.identity) || Object.keys(evidence.identity).length === 0)
      ) {
        errors.push(`${evidenceLabel}.identity must be a non-empty object when present`);
      }
      if (isObject(evidence.identity)) {
        for (const key of Object.keys(evidence.identity)) {
          if (!allowedIdentityKeys.has(key)) errors.push(`${evidenceLabel}.identity uses unsupported key ${key}`);
        }
        if (evidence.identity.revision !== undefined && !shaPattern.test(evidence.identity.revision)) errors.push(`${evidenceLabel}.identity.revision must be a full commit SHA`);
        if (evidence.identity.packageSha256 !== undefined && !fingerprintPattern.test(evidence.identity.packageSha256)) errors.push(`${evidenceLabel}.identity.packageSha256 must be sha256:<64 lowercase hex>`);
        if (evidence.identity.observedAt !== undefined && !Number.isFinite(Date.parse(evidence.identity.observedAt))) errors.push(`${evidenceLabel}.identity.observedAt must be an ISO date-time`);
        if (evidence.identity.trustClass !== undefined && !["instruction-authority", "trusted-data", "untrusted-data", "mixed"].includes(evidence.identity.trustClass)) errors.push(`${evidenceLabel}.identity.trustClass is invalid`);
        if (evidence.identity.privacyClass !== undefined && !["public", "internal", "restricted"].includes(evidence.identity.privacyClass)) errors.push(`${evidenceLabel}.identity.privacyClass is invalid`);
        if (graph.source) {
          for (const key of ["repository", "revision", "packageSha256", "environment"]) {
            if (graph.source[key] !== undefined && evidence.identity[key] !== undefined && graph.source[key] !== evidence.identity[key]) {
              errors.push(`${evidenceLabel}.identity.${key} does not match graph source`);
            }
          }
        }
      }
      if (evidence.fingerprint !== undefined) {
        if (!fingerprintPattern.test(evidence.fingerprint)) {
          errors.push(`${evidenceLabel}.fingerprint must be sha256:<64 lowercase hex>`);
        } else if (/^[a-z]+:\/\//i.test(evidence.pointer)) {
          errors.push(`${evidenceLabel} cannot byte-verify a remote pointer; materialize immutable local evidence`);
        } else if (graphPath) {
          const evidencePath = path.resolve(path.dirname(graphPath), evidence.pointer);
          if (!fs.existsSync(evidencePath) || !fs.statSync(evidencePath).isFile()) {
            errors.push(`${evidenceLabel} local evidence file is missing`);
          } else {
            const actual = `sha256:${crypto.createHash("sha256").update(fs.readFileSync(evidencePath)).digest("hex")}`;
            if (actual !== evidence.fingerprint) errors.push(`${evidenceLabel} fingerprint does not match local evidence bytes`);
          }
        }
      }
    }
  }

  for (const requiredType of graph.requiredNodeTypes ?? []) {
    if (!graph.nodes.some((node) => isObject(node) && node.type === requiredType)) {
      errors.push(`required node type missing: ${requiredType}`);
    }
  }

  for (const node of graph.nodes) {
    if (!isObject(node) || typeof node.id !== "string") {
      continue;
    }
    for (const dependency of Array.isArray(node.dependsOn) ? node.dependsOn : []) {
      if (!byId.has(dependency)) {
        errors.push(`${node.id} depends on missing node ${dependency}`);
      }
    }
    if (node.type !== "intent" && node.dependsOn?.length === 0) {
      errors.push(`${node.id} is orphaned; non-intent nodes need an upstream dependency`);
    }
    if (node.critical && ["provisional", "unknown", "failed"].includes(node.state)) {
      errors.push(`${node.id} is critical but ${node.state}`);
    }
    if (node.state === "not_applicable" && !node.notApplicableReason?.trim()) {
      errors.push(`${node.id} needs notApplicableReason`);
    }
    if (node.proofKind !== undefined) {
      if (node.type !== "proof") {
        errors.push(`${node.id} has proofKind but is not a proof`);
      } else if (!allowedProofKinds.has(node.proofKind)) {
        errors.push(`${node.id}.proofKind is invalid`);
      }
    }
    if (node.promotion !== undefined && node.type !== "learning") {
      errors.push(`${node.id} has promotion metadata but is not a learning`);
    }
    if (node.type === "learning") {
      const promotion = node.promotion;
      if (!isObject(promotion)) {
        errors.push(`${node.id} learning lacks structured promotion metadata`);
      } else {
        if (!isObject(promotion.destination)) {
          errors.push(`${node.id} learning lacks a durable destination`);
        } else {
          if (!allowedPromotionDestinations.has(promotion.destination.kind)) {
            errors.push(`${node.id} learning destination kind is invalid`);
          }
          if (
            typeof promotion.destination.pointer !== "string"
            || promotion.destination.pointer.trim() === ""
          ) {
            errors.push(`${node.id} learning destination pointer is missing`);
          }
        }
        if (promotion.status !== "verified") {
          errors.push(`${node.id} learning promotion is not verified`);
        }
        if (typeof promotion.reviewer !== "string" || promotion.reviewer.trim() === "") {
          errors.push(`${node.id} learning reviewer is missing`);
        }
      }
    }
    if (
      node.type === "observation"
      && node.state === "failed"
      && node.evidence?.length === 0
    ) {
      errors.push(`${node.id} failed observation has no evidence`);
    }
    if (
      node.type === "correction"
      && node.state === "verified"
      && node.evidence?.length === 0
    ) {
      errors.push(`${node.id} verified correction has no evidence`);
    }
    if (
      node.type === "proof"
      && node.proofKind === "regression"
      && node.evidence?.length === 0
    ) {
      errors.push(`${node.id} regression proof has no evidence`);
    }
    if (node.type === "proof" && node.proofKind === "regression") {
      if (node.state !== "verified") {
        errors.push(`${node.id} regression proof is not verified`);
      }
      const hasIdentity = node.evidence?.some(
        (evidence) => isObject(evidence.identity) && Object.keys(evidence.identity).some((key) => allowedIdentityKeys.has(key)),
      );
      if (!hasIdentity) {
        errors.push(`${node.id} regression proof lacks run identity`);
      }
    }
    if (node.critical && node.state === "verified" && node.evidence?.length === 0) {
      errors.push(`${node.id} is verified and critical but has no evidence`);
    }
    if (node.critical && node.state === "verified") {
      if (!fingerprintPattern.test(node.fingerprint ?? "")) errors.push(`${node.id} verified critical node lacks a typed fingerprint`);
      if (!isObject(node.dependencyFingerprints)) {
        errors.push(`${node.id} verified critical node lacks dependency fingerprints`);
      } else {
        const actualDependencies = [...(node.dependsOn ?? [])].sort();
        const recordedDependencies = Object.keys(node.dependencyFingerprints).sort();
        if (JSON.stringify(actualDependencies) !== JSON.stringify(recordedDependencies)) errors.push(`${node.id} dependency fingerprints do not match its dependency set`);
        for (const dependency of actualDependencies) {
          const parent = byId.get(dependency);
          if (!parent?.fingerprint || node.dependencyFingerprints[dependency] !== parent.fingerprint) errors.push(`${node.id} has stale dependency fingerprint for ${dependency}`);
        }
      }
    }
    if (node.type === "proof" && node.critical && node.state === "verified") {
      const identities = node.evidence?.map((evidence) => evidence.identity).filter(isObject) ?? [];
      const hasIdentity = identities.some((identity) => Object.keys(identity).some((key) => allowedIdentityKeys.has(key)));
      if (!hasIdentity) {
        errors.push(`${node.id} is critical proof without commit/package/environment identity`);
      } else {
        const hasRevisionOrTag = identities.some((identity) => identity.revision || identity.tag);
        const hasEnvironment = identities.some((identity) => identity.environment);
        const hasRun = identities.some((identity) => identity.runId);
        const hasObservedAt = identities.some((identity) => identity.observedAt);
        const hasTrust = identities.some((identity) => identity.trustClass);
        const hasPrivacy = identities.some((identity) => identity.privacyClass);
        if (!hasRevisionOrTag) errors.push(`${node.id} critical proof lacks revision or tag identity`);
        if (!hasEnvironment) errors.push(`${node.id} critical proof lacks environment identity`);
        if (!hasObservedAt) errors.push(`${node.id} critical proof lacks observed-at identity`);
        if (!hasTrust) errors.push(`${node.id} critical proof lacks trust identity`);
        if (!hasPrivacy) errors.push(`${node.id} critical proof lacks privacy identity`);
        if (node.proofKind === "regression" && !hasRun) errors.push(`${node.id} regression proof lacks run identity`);
        if (["elevated", "release"].includes(graph.assuranceLevel) && node.evidence.some((evidence) => evidence.kind === "package")
          && !identities.some((identity) => identity.packageSha256)) {
          errors.push(`${node.id} elevated package proof lacks package identity`);
        }
      }
    }
  }

  const visited = new Set();
  const active = new Set();

  function visitDependencies(node, trail = []) {
    if (active.has(node.id)) {
      errors.push(`dependency cycle: ${[...trail, node.id].join(" -> ")}`);
      return;
    }
    if (visited.has(node.id)) {
      return;
    }
    active.add(node.id);
    for (const dependency of node.dependsOn ?? []) {
      const parent = byId.get(dependency);
      if (parent) {
        visitDependencies(parent, [...trail, node.id]);
      }
    }
    active.delete(node.id);
    visited.add(node.id);
  }

  for (const node of graph.nodes) {
    if (isObject(node) && typeof node.id === "string") {
      visitDependencies(node);
    }
  }

  const exclusiveOwners = new Map();
  for (const node of graph.nodes) {
    if (!isObject(node) || node.type !== "owner" || node.state !== "verified" || !node.resource || node.ownershipMode === "shared") continue;
    const previous = exclusiveOwners.get(node.resource);
    if (previous && previous !== node.id) errors.push(`resource ${node.resource} has conflicting exclusive owners ${previous} and ${node.id}`);
    exclusiveOwners.set(node.resource, node.id);
  }

  function hasAncestorType(node, expectedType, visiting = new Set()) {
    if (visiting.has(node.id)) {
      return false;
    }
    visiting.add(node.id);
    for (const dependency of node.dependsOn ?? []) {
      const parent = byId.get(dependency);
      if (!parent) {
        continue;
      }
      if (parent.type === expectedType || hasAncestorType(parent, expectedType, new Set(visiting))) {
        return true;
      }
    }
    return false;
  }

  function hasAncestorNode(node, predicate, visiting = new Set()) {
    if (visiting.has(node.id)) {
      return false;
    }
    visiting.add(node.id);
    for (const dependency of node.dependsOn ?? []) {
      const parent = byId.get(dependency);
      if (!parent) {
        continue;
      }
      if (predicate(parent) || hasAncestorNode(parent, predicate, new Set(visiting))) {
        return true;
      }
    }
    return false;
  }

  function hasAncestorId(node, expectedId) {
    return hasAncestorNode(node, (candidate) => candidate.id === expectedId);
  }

  for (const node of graph.nodes) {
    if (!isObject(node) || !node.critical) {
      continue;
    }
    if (node.type !== "intent" && !hasAncestorType(node, "intent")) {
      errors.push(`${node.id} has no path to an intent node`);
    }
    if (node.type === "outcome" && !hasAncestorType(node, "proof")) {
      errors.push(`${node.id} is an outcome without upstream proof`);
    }
  }

  for (const node of graph.nodes) {
    if (isObject(node) && node.type === "outcome" && node.state === "verified" && !hasAncestorType(node, "proof")) {
      errors.push(`${node.id} verified outcome is missing upstream proof`);
    }
  }

  const criterionIds = new Set();
  for (const [index, criterion] of (graph.acceptanceCriteria ?? []).entries()) {
    const label = `acceptanceCriteria[${index}]`;
    if (!isObject(criterion) || typeof criterion.id !== "string" || !criterion.id.trim()) {
      errors.push(`${label}.id must be non-empty`);
      continue;
    }
    if (criterionIds.has(criterion.id)) errors.push(`${label}.id duplicates ${criterion.id}`);
    criterionIds.add(criterion.id);
    if (typeof criterion.statement !== "string" || !criterion.statement.trim()) errors.push(`${label}.statement must be non-empty`);
    const intent = byId.get(criterion.intentNodeId);
    if (!intent || intent.type !== "intent") errors.push(`${criterion.id} references a missing or non-intent node`);
    if (!Array.isArray(criterion.proofNodeIds) || criterion.proofNodeIds.length === 0) {
      errors.push(`${criterion.id} needs at least one proof node`);
      continue;
    }
    for (const proofId of criterion.proofNodeIds) {
      const proof = byId.get(proofId);
      if (!proof || proof.type !== "proof" || proof.state !== "verified") {
        errors.push(`${criterion.id} references unverified or missing proof ${proofId}`);
      } else if (intent && !hasAncestorId(proof, intent.id)) {
        errors.push(`${criterion.id} proof ${proofId} has no path to intent ${intent.id}`);
      }
    }
  }

  for (const node of graph.nodes) {
    if (!isObject(node) || node.type !== "learning") {
      continue;
    }
    if (node.state !== "verified") {
      errors.push(`${node.id} learning is not verified`);
    }
    if (!hasAncestorType(node, "intent")) {
      errors.push(`${node.id} learning has no path to an intent node`);
    }
    const regressionProofs = (node.dependsOn ?? [])
      .map((dependency) => byId.get(dependency))
      .filter(
        (candidate) => candidate
          && candidate.type === "proof"
          && candidate.proofKind === "regression"
          && candidate.state === "verified"
          && Array.isArray(candidate.evidence)
          && candidate.evidence.length > 0
          && candidate.evidence.some(
            (evidence) => isObject(evidence.identity)
              && Object.keys(evidence.identity).length > 0,
          ),
      );
    if (regressionProofs.length === 0) {
      errors.push(`${node.id} learning lacks upstream verified regression proof`);
    }
    const hasFailureCorrectionLineage = regressionProofs.some((proof) =>
      hasAncestorNode(
        proof,
        (candidate) =>
          candidate.type === "correction"
          && candidate.state === "verified"
          && Array.isArray(candidate.evidence)
          && candidate.evidence.length > 0
          && hasAncestorNode(
            candidate,
            (ancestor) =>
              ancestor.type === "observation"
              && ancestor.state === "failed"
              && Array.isArray(ancestor.evidence)
              && ancestor.evidence.length > 0,
          ),
      ));
    if (regressionProofs.length > 0 && !hasFailureCorrectionLineage) {
      errors.push(`${node.id} learning lacks failed-observation and verified-correction lineage`);
    }
    if (!Array.isArray(node.evidence) || node.evidence.length === 0) {
      errors.push(`${node.id} verified learning has no durable evidence`);
    }
    if (isObject(node.promotion)) {
      const destinationPointer = node.promotion.destination?.pointer;
      if (
        typeof destinationPointer === "string"
        && !node.evidence?.some((evidence) => evidence.pointer === destinationPointer)
      ) {
        errors.push(`${node.id} learning evidence does not verify its durable destination`);
      }
    }
    const hasVerifiedClosure = graph.nodes.some(
      (candidate) => isObject(candidate)
        && candidate.type === "outcome"
        && candidate.state === "verified"
        && Array.isArray(candidate.evidence)
        && candidate.evidence.length > 0
        && hasAncestorId(candidate, node.id),
    );
    if (!hasVerifiedClosure) {
      errors.push(`${node.id} learning is not closed by a verified evidenced outcome`);
    }
  }

  return [...new Set(errors)];
}

function selfTest() {
  const temp = fs.mkdtempSync(path.join(process.env.TMPDIR ?? "/tmp", "engineering-graph-"));
  const graphPath = path.join(temp, "graph.json");
  const proofFile = path.join(temp, "proof.txt");
  fs.writeFileSync(proofFile, "verified proof\n");
  const fp = (value) => `sha256:${value.repeat(64)}`;
  const proofBytes = `sha256:${crypto.createHash("sha256").update(fs.readFileSync(proofFile)).digest("hex")}`;
  const valid = {
    schemaVersion: 2,
    task: "Prove a packaged settings workflow",
    assuranceLevel: "baseline",
    source: { repository: "example/repo", revision: "c".repeat(40), environment: "wp-proof", observedAt: "2026-07-17T00:00:00Z" },
    acceptanceCriteria: [{
      id: "ac.settings",
      statement: "The packaged settings workflow passes.",
      intentNodeId: "intent.settings",
      proofNodeIds: ["proof.package"],
    }],
    nodes: [
      {
        id: "intent.settings", type: "intent", owner: "issue", state: "verified", critical: true,
        dependsOn: [], fingerprint: fp("a"), dependencyFingerprints: {},
        evidence: [{ kind: "github", pointer: "issue-123", identity: { issue: 123 } }],
      },
      {
        id: "proof.package", type: "proof", proofKind: "verification", owner: "behavior-validator",
        state: "verified", critical: true, dependsOn: ["intent.settings"], fingerprint: fp("b"),
        dependencyFingerprints: { "intent.settings": fp("a") },
        evidence: [{
          kind: "package", pointer: "proof.txt", fingerprint: proofBytes,
          identity: { repository: "example/repo", revision: "c".repeat(40), packageSha256: fp("d"), environment: "wp-proof", observedAt: "2026-07-17T00:00:00Z", trustClass: "trusted-data", privacyClass: "internal" },
        }],
      },
      {
        id: "outcome.ready", type: "outcome", owner: "product-po", state: "verified", critical: true,
        dependsOn: ["proof.package"], fingerprint: fp("e"),
        dependencyFingerprints: { "proof.package": fp("b") },
        evidence: [{ kind: "github", pointer: "release-brief", identity: { revision: "c".repeat(40) } }],
      },
    ],
  };

  const validLearning = structuredClone(valid);
  validLearning.task = "Learn from a settings regression";
  delete validLearning.source;
  validLearning.acceptanceCriteria[0].proofNodeIds = ["proof.settings-regression"];
  validLearning.nodes = [validLearning.nodes[0],
    {
      id: "observation.settings-broken", type: "observation", owner: "behavior-validator",
      state: "failed", critical: false, dependsOn: ["intent.settings"], fingerprint: fp("f"),
      evidence: [{ kind: "browser", pointer: "broken.png", identity: { viewport: "1280x900" } }],
    },
    {
      id: "correction.settings-owner", type: "correction", owner: "wp-plugin-expert",
      state: "verified", critical: false, dependsOn: ["observation.settings-broken"], fingerprint: fp("1"),
      evidence: [{ kind: "git", pointer: "commit", identity: { revision: "2".repeat(40) } }],
    },
    {
      id: "proof.settings-regression", type: "proof", proofKind: "regression", owner: "behavior-validator",
      state: "verified", critical: true, dependsOn: ["correction.settings-owner"], fingerprint: fp("3"),
      dependencyFingerprints: { "correction.settings-owner": fp("1") },
      evidence: [{ kind: "browser", pointer: "fixed.png", identity: { revision: "2".repeat(40), runId: "settings-regression", environment: "wp-proof", observedAt: "2026-07-17T00:00:00Z", trustClass: "trusted-data", privacyClass: "internal" } }],
    },
    {
      id: "learning.settings-regression", type: "learning", owner: "repo-doc", state: "verified",
      critical: false, dependsOn: ["proof.settings-regression"], fingerprint: fp("4"),
      promotion: { destination: { kind: "repo_doc", pointer: "TESTING.md#settings" }, status: "verified", reviewer: "product-po" },
      evidence: [{ kind: "repo", pointer: "TESTING.md#settings", identity: { revision: "2".repeat(40) } }],
    },
    {
      id: "outcome.ready", type: "outcome", owner: "product-po", state: "verified", critical: true,
      dependsOn: ["learning.settings-regression"], fingerprint: fp("5"),
      dependencyFingerprints: { "learning.settings-regression": fp("4") },
      evidence: [{ kind: "github", pointer: "release-brief", identity: { revision: "2".repeat(40) } }],
    },
  ];

  const cases = [];
  cases.push(["valid", valid, (errors) => errors.length === 0]);
  cases.push(["valid learning", validLearning, (errors) => errors.length === 0]);
  const stale = structuredClone(valid); stale.nodes[1].dependencyFingerprints["intent.settings"] = fp("9");
  cases.push(["stale dependency", stale, (errors) => errors.some((error) => error.includes("stale dependency fingerprint"))]);
  const fakeIdentity = structuredClone(valid); fakeIdentity.nodes[1].evidence[0].identity = { commit: "abc123" };
  cases.push(["fake identity", fakeIdentity, (errors) => errors.some((error) => error.includes("unsupported key"))]);
  const noCriterionProof = structuredClone(valid); noCriterionProof.nodes[1].state = "failed";
  cases.push(["unverified criterion", noCriterionProof, (errors) => errors.some((error) => error.includes("unverified or missing proof"))]);
  const cycle = structuredClone(valid); cycle.nodes[1].dependsOn = ["outcome.ready"];
  cases.push(["cycle", cycle, (errors) => errors.some((error) => error.startsWith("dependency cycle:"))]);
  const noLearningClosure = structuredClone(validLearning); noLearningClosure.nodes[5].dependsOn = ["proof.settings-regression"];
  cases.push(["learning closure", noLearningClosure, (errors) => errors.some((error) => error.includes("learning is not closed by a verified evidenced outcome"))]);
  const noLearningLineage = structuredClone(validLearning); noLearningLineage.nodes[3].dependsOn = ["observation.settings-broken"];
  cases.push(["learning lineage", noLearningLineage, (errors) => errors.some((error) => error.includes("learning lacks failed-observation and verified-correction lineage"))]);
  const conflictingOwner = structuredClone(valid);
  conflictingOwner.nodes.splice(1, 0,
    { id: "owner.one", type: "owner", owner: "theme", resource: "header", state: "verified", critical: false, dependsOn: ["intent.settings"], evidence: [] },
    { id: "owner.two", type: "owner", owner: "page", resource: "header", state: "verified", critical: false, dependsOn: ["intent.settings"], evidence: [] },
  );
  cases.push(["ownership conflict", conflictingOwner, (errors) => errors.some((error) => error.includes("conflicting exclusive owners"))]);
  const badBytes = structuredClone(valid); badBytes.nodes[1].evidence[0].fingerprint = fp("8");
  cases.push(["local byte mismatch", badBytes, (errors) => errors.some((error) => error.includes("does not match local evidence bytes"))]);
  const mismatchedSource = structuredClone(valid); mismatchedSource.nodes[1].evidence[0].identity.revision = "d".repeat(40);
  cases.push(["source identity mismatch", mismatchedSource, (errors) => errors.some((error) => error.includes("does not match graph source"))]);
  const elevatedWithoutSource = structuredClone(valid); elevatedWithoutSource.assuranceLevel = "elevated"; delete elevatedWithoutSource.source;
  cases.push(["elevated source required", elevatedWithoutSource, (errors) => errors.some((error) => error.includes("requires root source identity"))]);
  const releaseWithoutIdentity = structuredClone(valid); releaseWithoutIdentity.assuranceLevel = "release"; delete releaseWithoutIdentity.source.revision;
  cases.push(["release source identity required", releaseWithoutIdentity, (errors) => errors.some((error) => error.includes("requires revision or package digest"))]);
  const releaseWithoutEnvironment = structuredClone(valid); releaseWithoutEnvironment.assuranceLevel = "release"; delete releaseWithoutEnvironment.source.environment;
  cases.push(["release source environment required", releaseWithoutEnvironment, (errors) => errors.some((error) => error.includes("requires environment"))]);
  const missingTrust = structuredClone(valid); delete missingTrust.nodes[1].evidence[0].identity.trustClass;
  cases.push(["proof trust metadata", missingTrust, (errors) => errors.some((error) => error.includes("lacks trust identity"))]);

  const failures = [];
  for (const [name, graph, expected] of cases) {
    const errors = validateGraph(graph, { graphPath });
    if (!expected(errors)) failures.push({ name, errors });
  }
  fs.rmSync(temp, { recursive: true, force: true });
  if (failures.length) {
    console.error("engineering graph validator self-test failed", failures);
    process.exit(1);
  }
  console.log("engineering graph validator self-test passed");
}

if (process.argv[2] === "--self-test") {
  selfTest();
  process.exit(0);
}

if (process.argv.length !== 3) {
  console.error("usage: validate-engineering-graph.mjs <graph.json>");
  process.exit(2);
}

const target = path.resolve(process.argv[2]);
let graph;
try {
  graph = JSON.parse(fs.readFileSync(target, "utf8"));
} catch (error) {
  console.error(`cannot read graph: ${error.message}`);
  process.exit(2);
}

const errors = validateGraph(graph, { graphPath: target });
if (errors.length > 0) {
  for (const error of errors) {
    console.error(`ERROR: ${error}`);
  }
  process.exit(1);
}

console.log(`engineering graph valid: ${target}`);
