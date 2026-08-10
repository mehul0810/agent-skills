#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.resolve(
  SCRIPT_DIR,
  "../../shared/schemas/wordpress-visual-proof.schema.json",
);
const REQUIRED_GATES = new Set([
  "responsive",
  "accessibility",
  "editor_frontend_parity",
  "workflow",
  "content_stress",
  "performance",
  "browser_compatibility",
]);
const SHA256_FINGERPRINT = /^sha256:[a-f0-9]{64}$/;
const FIGMA_FINGERPRINT = /^figma:[^:]+:[^:]+:.+$/;
const REVISION = /^(?:[a-f0-9]{40}|working-tree:sha256:[a-f0-9]{64})$/;
const LOCATOR = /(?:https?:\/\/|\/|\\|\.png$|\.webp$|\.jpe?g$|\.json$|\.zip$)/i;

let compiledSchema;

function schemaValidator() {
  if (!compiledSchema) {
    const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8"));
    compiledSchema = new Ajv2020({ allErrors: true, strict: true }).compile(schema);
  }
  return compiledSchema;
}

function schemaErrors(proof) {
  const validate = schemaValidator();
  if (validate(proof)) return [];
  return (validate.errors ?? []).map((error) => {
    const suffix = error.keyword === "additionalProperties"
      ? ` (${error.params.additionalProperty})`
      : "";
    return `schema ${error.instancePath || "/"} ${error.message}${suffix}`;
  });
}

function duplicateValues(values) {
  const seen = new Set();
  return values.filter((value) => seen.has(value) || !seen.add(value));
}

function validatesNotApplicable(item, label, errors) {
  if (item.result === "not_applicable" && !item.reason) {
    errors.push(`${label}.reason is required for not_applicable`);
  }
  if (item.result === "pass" && !item.evidence) {
    errors.push(`${label}.evidence is required for pass`);
  }
}

export function validateVisualProof(proof) {
  const errors = schemaErrors(proof);
  if (errors.length > 0) return errors;

  const sourceFingerprint = proof.source.fingerprint;
  if (proof.source.kind === "figma") {
    if (!FIGMA_FINGERPRINT.test(sourceFingerprint)) {
      errors.push("source.fingerprint must bind Figma file, node, and version as figma:<file>:<node>:<version>");
    }
  } else if (proof.source.kind !== "approved_direction" && !SHA256_FINGERPRINT.test(sourceFingerprint)) {
    errors.push("source.fingerprint must be sha256:<64 lowercase hex characters>");
  }
  if (!SHA256_FINGERPRINT.test(proof.candidate.fingerprint)) {
    errors.push("candidate.fingerprint must be sha256:<64 lowercase hex characters>");
  }
  if (!REVISION.test(proof.candidate.revision)) {
    errors.push("candidate.revision must be a full commit SHA or working-tree:sha256:<digest>");
  }
  if (!LOCATOR.test(proof.candidate.artifact)) {
    errors.push("candidate.artifact must be a concrete path or URL");
  }

  const captureIds = proof.captures.map((capture) => capture.id);
  for (const duplicate of duplicateValues(captureIds)) {
    errors.push(`captures contain duplicate id: ${duplicate}`);
  }
  for (const [index, capture] of proof.captures.entries()) {
    if (!proof.scope.surfaces.includes(capture.surface)) {
      errors.push(`captures[${index}].surface is outside scope.surfaces`);
    }
    if (capture.result === "accepted" && capture.deviations.length === 0) {
      errors.push(`captures[${index}].deviations is required for accepted result`);
    }
  }

  const gateNames = proof.gates.map((gate) => gate.name);
  for (const duplicate of duplicateValues(gateNames)) {
    errors.push(`gates contain duplicate name: ${duplicate}`);
  }
  for (const required of REQUIRED_GATES) {
    if (!gateNames.includes(required)) errors.push(`gates must include ${required}`);
  }
  for (const [index, gate] of proof.gates.entries()) {
    validatesNotApplicable(gate, `gates[${index}]`, errors);
  }
  for (const [index, workflow] of proof.workflows.entries()) {
    validatesNotApplicable(workflow, `workflows[${index}]`, errors);
  }

  for (const role of proof.scope.requiredWorkflowRoles) {
    const matching = proof.workflows.filter((workflow) => workflow.role === role);
    if (matching.length !== 1) {
      errors.push(`workflows must include exactly one required ${role} workflow`);
    } else if (proof.status === "pass" && matching[0].result !== "pass") {
      errors.push(`required ${role} workflow must pass when proof status is pass`);
    }
  }

  if (proof.scope.responsiveRequired && proof.status === "pass") {
    if (!proof.captures.some((capture) => capture.viewport.width <= 480)) {
      errors.push("responsive proof requires a narrow capture at 480 CSS pixels or below");
    }
    if (!proof.captures.some((capture) => capture.viewport.width >= 1024)) {
      errors.push("responsive proof requires a desktop capture at 1024 CSS pixels or above");
    }
  }

  if (
    proof.source.classification === "exact" &&
    proof.status === "pass" &&
    !proof.captures.some((capture) => ["overlay", "perceptual"].includes(capture.comparison))
  ) {
    errors.push("exact proof requires at least one overlay or perceptual comparison");
  }

  for (const [index, defect] of proof.defects.entries()) {
    if (defect.status === "fixed" && !defect.evidence) {
      errors.push(`defects[${index}].evidence is required for fixed status`);
    }
    if (defect.status === "accepted" && (!defect.evidence || !defect.rationale)) {
      errors.push(`defects[${index}] accepted status requires evidence and rationale`);
    }
  }

  if (proof.status === "pass") {
    if (proof.proofGaps.length > 0) errors.push("pass cannot contain proof gaps");
    if (proof.captures.some((capture) => ["fail", "blocked"].includes(capture.result))) {
      errors.push("pass cannot contain failed or blocked captures");
    }
    if (proof.workflows.some((workflow) => ["fail", "blocked"].includes(workflow.result))) {
      errors.push("pass cannot contain failed or blocked workflows");
    }
    if (proof.gates.some((gate) => ["fail", "blocked"].includes(gate.result))) {
      errors.push("pass cannot contain failed or blocked gates");
    }
    if (proof.defects.some((defect) => defect.status === "unresolved")) {
      errors.push("pass cannot contain unresolved defects");
    }
  }

  if (proof.status === "blocked" && proof.proofGaps.length === 0) {
    errors.push("blocked proof requires at least one proof gap");
  }
  if (
    proof.status === "fail" &&
    !proof.captures.some((capture) => capture.result === "fail") &&
    !proof.workflows.some((workflow) => workflow.result === "fail") &&
    !proof.gates.some((gate) => gate.result === "fail") &&
    !proof.defects.some((defect) => defect.status === "unresolved")
  ) {
    errors.push("fail must identify a failing capture, workflow, gate, or unresolved defect");
  }

  return [...new Set(errors)];
}

function exampleProof() {
  const evidence = "artifacts/visual-proof/home-desktop.png";
  return {
    schemaVersion: 1,
    proofId: "home-page-visual-proof",
    status: "pass",
    surfaceKind: "site",
    source: {
      kind: "screenshot",
      classification: "exact",
      identity: "design/home-desktop.png at 1440x1200",
      fingerprint: `sha256:${"a".repeat(64)}`,
    },
    candidate: {
      revision: "b".repeat(40),
      artifact: "artifacts/site-release.zip",
      fingerprint: `sha256:${"c".repeat(64)}`,
      environment: {
        wordpress: "7.0",
        product: "Example Theme 1.0.0",
        browser: "Chromium 140",
        operatingSystem: "macOS",
        locale: "en_US",
      },
    },
    scope: {
      surfaces: ["home"],
      requiredWorkflowRoles: ["visitor", "author"],
      responsiveRequired: true,
    },
    captures: [
      {
        id: "home-mobile",
        surface: "home",
        state: "default",
        viewport: { width: 375, height: 812, devicePixelRatio: 2 },
        browser: "Chromium 140",
        sourceEvidence: "source has no mobile target; behavior is an explicit inference",
        candidateEvidence: "artifacts/visual-proof/home-mobile.png",
        comparison: "manual",
        result: "pass",
        deviations: [],
      },
      {
        id: "home-desktop",
        surface: "home",
        state: "default",
        viewport: { width: 1440, height: 1200, devicePixelRatio: 2 },
        browser: "Chromium 140",
        sourceEvidence: "design/home-desktop.png",
        candidateEvidence: evidence,
        comparison: "overlay",
        result: "pass",
        deviations: [],
      },
    ],
    workflows: [
      { role: "visitor", task: "Follow the primary call to action", result: "pass", evidence },
      { role: "author", task: "Edit hero copy and image, save, reload, and preview", result: "pass", evidence },
    ],
    gates: [...REQUIRED_GATES].map((name) => ({ name, result: "pass", evidence })),
    defects: [],
    proofGaps: [],
  };
}

function selfTest() {
  const valid = exampleProof();
  const cases = [
    ["valid proof", valid, true],
    ["unresolved defect", { ...valid, defects: [{ description: "Hero overlaps navigation", status: "unresolved" }] }, false],
    ["missing required role", { ...valid, workflows: valid.workflows.filter((workflow) => workflow.role !== "author") }, false],
    ["exact manual only", { ...valid, captures: valid.captures.map((capture) => ({ ...capture, comparison: "manual" })) }, false],
    ["missing gate", { ...valid, gates: valid.gates.filter((gate) => gate.name !== "performance") }, false],
    ["blocked without gap", { ...valid, status: "blocked" }, false],
    ["accepted capture without deviation", { ...valid, captures: [{ ...valid.captures[0], result: "accepted" }, valid.captures[1]] }, false],
    ["mutable candidate identity", { ...valid, candidate: { ...valid.candidate, revision: "working-tree" } }, false],
  ];

  for (const [name, proof, expected] of cases) {
    const passed = validateVisualProof(proof).length === 0;
    if (passed !== expected) {
      throw new Error(`visual proof self-test failed: ${name}: ${validateVisualProof(proof).join("; ")}`);
    }
  }
  console.log("visual proof validator self-test passed");
}

async function main() {
  const argument = process.argv[2];
  if (argument === "--self-test") return selfTest();
  if (argument === "--example") {
    process.stdout.write(`${JSON.stringify(exampleProof(), null, 2)}\n`);
    return;
  }
  if (!argument) {
    console.error("usage: validate-visual-proof.mjs <proof.json> | --example | --self-test");
    process.exitCode = 2;
    return;
  }

  let proof;
  try {
    proof = JSON.parse(fs.readFileSync(argument, "utf8"));
  } catch (error) {
    console.error(`ERROR: cannot read valid JSON from ${argument}: ${error.message}`);
    process.exitCode = 1;
    return;
  }
  const errors = validateVisualProof(proof);
  if (errors.length > 0) {
    for (const error of errors) console.error(`ERROR: ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`visual proof valid: ${argument}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
