#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

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

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateGraph(graph) {
  const errors = [];

  if (!isObject(graph)) {
    return ["graph must be a JSON object"];
  }
  if (graph.schemaVersion !== 1) {
    errors.push("schemaVersion must be 1");
  }
  if (typeof graph.task !== "string" || graph.task.trim() === "") {
    errors.push("task must be a non-empty string");
  }
  if (
    graph.assuranceLevel !== undefined &&
    !["baseline", "elevated"].includes(graph.assuranceLevel)
  ) {
    errors.push("assuranceLevel must be baseline or elevated");
  }
  if (!Array.isArray(graph.nodes) || graph.nodes.length === 0) {
    return [...errors, "nodes must be a non-empty array"];
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
        (evidence) => isObject(evidence.identity) && Object.keys(evidence.identity).length > 0,
      );
      if (!hasIdentity) {
        errors.push(`${node.id} regression proof lacks run identity`);
      }
    }
    if (node.critical && node.state === "verified" && node.evidence?.length === 0) {
      errors.push(`${node.id} is verified and critical but has no evidence`);
    }
    if (node.type === "proof" && node.critical && node.state === "verified") {
      const hasIdentity = node.evidence?.some(
        (evidence) => isObject(evidence.identity) && Object.keys(evidence.identity).length > 0,
      );
      if (!hasIdentity) {
        errors.push(`${node.id} is critical proof without commit/package/environment identity`);
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
  const valid = {
    schemaVersion: 1,
    task: "Prove a packaged settings workflow",
    assuranceLevel: "baseline",
    nodes: [
      {
        id: "intent.settings",
        type: "intent",
        owner: "issue",
        state: "verified",
        critical: true,
        dependsOn: [],
        evidence: [{ kind: "github", pointer: "issue-123" }],
      },
      {
        id: "proof.package",
        type: "proof",
        owner: "behavior-validator",
        state: "verified",
        critical: true,
        dependsOn: ["intent.settings"],
        evidence: [
          {
            kind: "package",
            pointer: "dist/plugin.zip",
            identity: { commit: "abc123", sha256: "example" },
          },
        ],
      },
      {
        id: "outcome.ready",
        type: "outcome",
        owner: "product-po",
        state: "verified",
        critical: true,
        dependsOn: ["proof.package"],
        evidence: [{ kind: "github", pointer: "release-brief" }],
      },
    ],
  };
  const failedCritical = structuredClone(valid);
  failedCritical.nodes[1].state = "failed";
  const missingIdentity = structuredClone(valid);
  missingIdentity.nodes[1].evidence[0].identity = {};
  const cyclic = structuredClone(valid);
  cyclic.nodes[1].dependsOn = ["outcome.ready"];
  const validLearning = {
    schemaVersion: 1,
    task: "Learn from a packaged settings regression",
    assuranceLevel: "elevated",
    nodes: [
      structuredClone(valid.nodes[0]),
      {
        id: "observation.settings-broken",
        type: "observation",
        owner: "behavior-validator",
        state: "failed",
        critical: false,
        dependsOn: ["intent.settings"],
        evidence: [{ kind: "browser", pointer: "artifacts/settings-broken.png" }],
      },
      {
        id: "correction.settings-owner",
        type: "correction",
        owner: "wp-plugin-expert",
        state: "verified",
        critical: false,
        dependsOn: ["observation.settings-broken"],
        evidence: [{ kind: "git", pointer: "commit:def456" }],
      },
      {
        id: "proof.settings-regression",
        type: "proof",
        proofKind: "regression",
        owner: "behavior-validator",
        state: "verified",
        critical: true,
        dependsOn: ["correction.settings-owner"],
        evidence: [
          {
            kind: "browser",
            pointer: "artifacts/settings-fixed.png",
            identity: { commit: "def456", packageSha256: "example" },
          },
        ],
      },
      {
        id: "learning.settings-regression",
        type: "learning",
        owner: "repo-doc",
        state: "verified",
        critical: false,
        dependsOn: ["proof.settings-regression"],
        promotion: {
          destination: {
            kind: "repo_doc",
            pointer: "TESTING.md#settings-regression",
          },
          status: "verified",
          reviewer: "product-po",
        },
        evidence: [{ kind: "repo", pointer: "TESTING.md#settings-regression" }],
      },
      {
        id: "outcome.ready",
        type: "outcome",
        owner: "product-po",
        state: "verified",
        critical: true,
        dependsOn: ["learning.settings-regression"],
        evidence: [{ kind: "github", pointer: "release-brief" }],
      },
    ],
  };
  const orphanLearning = structuredClone(validLearning);
  orphanLearning.nodes[4].dependsOn = [];
  const genericProof = structuredClone(validLearning);
  genericProof.nodes[3].proofKind = "verification";
  const learningWithoutCorrection = structuredClone(validLearning);
  learningWithoutCorrection.nodes[3].dependsOn = ["observation.settings-broken"];
  const learningWithoutFailure = structuredClone(validLearning);
  learningWithoutFailure.nodes[1].state = "verified";
  const learningWithoutClosure = structuredClone(validLearning);
  learningWithoutClosure.nodes[5].dependsOn = ["proof.settings-regression"];
  const learningWithoutEvidence = structuredClone(validLearning);
  learningWithoutEvidence.nodes[4].evidence = [];
  const learningWithoutDestination = structuredClone(validLearning);
  delete learningWithoutDestination.nodes[4].promotion.destination;
  const learningWithoutReviewer = structuredClone(validLearning);
  delete learningWithoutReviewer.nodes[4].promotion.reviewer;
  const learningWithoutVerifiedPromotion = structuredClone(validLearning);
  learningWithoutVerifiedPromotion.nodes[4].promotion.status = "implemented";
  const regressionWithoutEvidence = structuredClone(validLearning);
  regressionWithoutEvidence.nodes[3].evidence = [];
  const regressionWithoutIdentity = structuredClone(validLearning);
  delete regressionWithoutIdentity.nodes[3].evidence[0].identity;
  const failureWithoutEvidence = structuredClone(validLearning);
  failureWithoutEvidence.nodes[1].evidence = [];
  const correctionWithoutEvidence = structuredClone(validLearning);
  correctionWithoutEvidence.nodes[2].evidence = [];
  const learningDestinationMismatch = structuredClone(validLearning);
  learningDestinationMismatch.nodes[4].promotion.destination.pointer =
    "TESTING.md#different-regression";
  const outcomeWithoutEvidence = structuredClone(validLearning);
  outcomeWithoutEvidence.nodes[5].evidence = [];
  const outcomeNotVerified = structuredClone(validLearning);
  outcomeNotVerified.nodes[5].state = "provisional";

  const validErrors = validateGraph(valid);
  const failedErrors = validateGraph(failedCritical);
  const identityErrors = validateGraph(missingIdentity);
  const cycleErrors = validateGraph(cyclic);
  const validLearningErrors = validateGraph(validLearning);
  const orphanLearningErrors = validateGraph(orphanLearning);
  const genericProofErrors = validateGraph(genericProof);
  const learningWithoutCorrectionErrors = validateGraph(learningWithoutCorrection);
  const learningWithoutFailureErrors = validateGraph(learningWithoutFailure);
  const learningWithoutClosureErrors = validateGraph(learningWithoutClosure);
  const learningWithoutEvidenceErrors = validateGraph(learningWithoutEvidence);
  const learningWithoutDestinationErrors = validateGraph(learningWithoutDestination);
  const learningWithoutReviewerErrors = validateGraph(learningWithoutReviewer);
  const learningWithoutVerifiedPromotionErrors = validateGraph(
    learningWithoutVerifiedPromotion,
  );
  const regressionWithoutEvidenceErrors = validateGraph(regressionWithoutEvidence);
  const regressionWithoutIdentityErrors = validateGraph(regressionWithoutIdentity);
  const failureWithoutEvidenceErrors = validateGraph(failureWithoutEvidence);
  const correctionWithoutEvidenceErrors = validateGraph(correctionWithoutEvidence);
  const learningDestinationMismatchErrors = validateGraph(learningDestinationMismatch);
  const outcomeWithoutEvidenceErrors = validateGraph(outcomeWithoutEvidence);
  const outcomeNotVerifiedErrors = validateGraph(outcomeNotVerified);
  if (
    validErrors.length > 0 ||
    failedErrors.length === 0 ||
    identityErrors.length === 0 ||
    !cycleErrors.some((error) => error.startsWith("dependency cycle:")) ||
    validLearningErrors.length > 0 ||
    !orphanLearningErrors.some((error) => error.includes("is orphaned")) ||
    !genericProofErrors.some((error) => error.includes("lacks upstream verified regression proof")) ||
    !learningWithoutCorrectionErrors.some((error) =>
      error.includes("lacks failed-observation and verified-correction lineage")) ||
    !learningWithoutFailureErrors.some((error) =>
      error.includes("lacks failed-observation and verified-correction lineage")) ||
    !learningWithoutClosureErrors.some((error) => error.includes("not closed by a verified evidenced outcome")) ||
    !learningWithoutEvidenceErrors.some((error) => error.includes("has no durable evidence")) ||
    !learningWithoutDestinationErrors.some((error) => error.includes("lacks a durable destination")) ||
    !learningWithoutReviewerErrors.some((error) => error.includes("reviewer is missing")) ||
    !learningWithoutVerifiedPromotionErrors.some((error) =>
      error.includes("promotion is not verified")) ||
    !regressionWithoutEvidenceErrors.some((error) =>
      error.includes("regression proof has no evidence")) ||
    !regressionWithoutIdentityErrors.some((error) =>
      error.includes("regression proof lacks run identity")) ||
    !failureWithoutEvidenceErrors.some((error) =>
      error.includes("failed observation has no evidence")) ||
    !correctionWithoutEvidenceErrors.some((error) =>
      error.includes("verified correction has no evidence")) ||
    !learningDestinationMismatchErrors.some((error) =>
      error.includes("evidence does not verify its durable destination")) ||
    !outcomeWithoutEvidenceErrors.some((error) =>
      error.includes("not closed by a verified evidenced outcome")) ||
    !outcomeNotVerifiedErrors.some((error) =>
      error.includes("not closed by a verified evidenced outcome"))
  ) {
    console.error("engineering graph validator self-test failed", {
      validErrors,
      failedErrors,
      identityErrors,
      cycleErrors,
      validLearningErrors,
      orphanLearningErrors,
      genericProofErrors,
      learningWithoutCorrectionErrors,
      learningWithoutFailureErrors,
      learningWithoutClosureErrors,
      learningWithoutEvidenceErrors,
      learningWithoutDestinationErrors,
      learningWithoutReviewerErrors,
      learningWithoutVerifiedPromotionErrors,
      regressionWithoutEvidenceErrors,
      regressionWithoutIdentityErrors,
      failureWithoutEvidenceErrors,
      correctionWithoutEvidenceErrors,
      learningDestinationMismatchErrors,
      outcomeWithoutEvidenceErrors,
      outcomeNotVerifiedErrors,
    });
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

const errors = validateGraph(graph);
if (errors.length > 0) {
  for (const error of errors) {
    console.error(`ERROR: ${error}`);
  }
  process.exit(1);
}

console.log(`engineering graph valid: ${target}`);
