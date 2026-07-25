#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const allowedTypes = new Set([
  "intent",
  "owner",
  "artifact",
  "runtime",
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
    if (node.type !== "intent" && node.type !== "learning" && node.dependsOn?.length === 0) {
      errors.push(`${node.id} is orphaned; non-intent nodes need an upstream dependency`);
    }
    if (node.critical && ["provisional", "unknown", "failed"].includes(node.state)) {
      errors.push(`${node.id} is critical but ${node.state}`);
    }
    if (node.state === "not_applicable" && !node.notApplicableReason?.trim()) {
      errors.push(`${node.id} needs notApplicableReason`);
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

  const validErrors = validateGraph(valid);
  const failedErrors = validateGraph(failedCritical);
  const identityErrors = validateGraph(missingIdentity);
  const cycleErrors = validateGraph(cyclic);
  if (
    validErrors.length > 0 ||
    failedErrors.length === 0 ||
    identityErrors.length === 0 ||
    !cycleErrors.some((error) => error.startsWith("dependency cycle:"))
  ) {
    console.error("engineering graph validator self-test failed", {
      validErrors,
      failedErrors,
      identityErrors,
      cycleErrors,
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
