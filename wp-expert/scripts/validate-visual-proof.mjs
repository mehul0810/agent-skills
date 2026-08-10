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
  "design_quality",
  "asset_quality",
]);
const ALWAYS_REQUIRED_PASS_GATES = new Set([
  "accessibility",
  "workflow",
  "content_stress",
  "performance",
  "browser_compatibility",
]);
const SHA256_FINGERPRINT = /^sha256:[a-f0-9]{64}$/;
const FIGMA_FINGERPRINT = /^figma:[^:]+:[^:]+:.+$/;
const REVISION = /^(?:[a-f0-9]{40}|working-tree:sha256:[a-f0-9]{64})$/;
const LOCATOR = /(?:https?:\/\/|\/|\\|\.(?:png|webp|jpe?g|json|zip|md|html|xml|txt|log|trace|mp4|webm)$)/i;

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

function evidenceObjects(value, pointer = "proof", output = []) {
  if (!value || typeof value !== "object") return output;
  if (
    !Array.isArray(value) &&
    Object.hasOwn(value, "kind") &&
    Object.hasOwn(value, "locator") &&
    Object.hasOwn(value, "fingerprint")
  ) {
    output.push([pointer, value]);
  }
  for (const [key, child] of Object.entries(value)) {
    if (child && typeof child === "object") evidenceObjects(child, `${pointer}.${key}`, output);
  }
  return output;
}

function validateDisposition(item, label, errors) {
  if (item.result === "not_applicable" && !item.reason) {
    errors.push(`${label}.reason is required for not_applicable`);
  }
  if (item.result === "pass" && !item.evidence) {
    errors.push(`${label}.evidence is required for pass`);
  }
  if (["fail", "blocked"].includes(item.result) && !item.reason) {
    errors.push(`${label}.reason is required for ${item.result}`);
  }
}

function matchingRequired(items, requiredIds, label, status, errors) {
  for (const id of requiredIds) {
    const matching = items.filter((item) => item.id === id);
    if (matching.length !== 1) {
      errors.push(`${label} must include exactly one required id: ${id}`);
    } else if (status === "pass" && matching[0].result !== "pass") {
      errors.push(`required ${label} ${id} must pass when proof status is pass`);
    }
  }
}

function gateByName(proof, name) {
  return proof.gates.find((gate) => gate.name === name);
}

export function validateVisualProof(proof) {
  const errors = schemaErrors(proof);
  if (errors.length > 0) return errors;

  if (proof.source.kind === "figma") {
    if (!FIGMA_FINGERPRINT.test(proof.source.fingerprint)) {
      errors.push("source.fingerprint must bind Figma file, node, and version as figma:<file>:<node>:<version>");
    }
  } else if (!SHA256_FINGERPRINT.test(proof.source.fingerprint)) {
    errors.push("non-Figma source.fingerprint must be sha256:<64 lowercase hex characters>");
  }
  if (!REVISION.test(proof.candidate.revision)) {
    errors.push("candidate.revision must be a full commit SHA or working-tree:sha256:<digest>");
  }
  if (proof.candidate.fingerprint !== proof.candidate.artifact.fingerprint) {
    errors.push("candidate fingerprint must match the bound artifact fingerprint");
  }

  for (const [pointer, evidence] of evidenceObjects(proof)) {
    if (!LOCATOR.test(evidence.locator)) {
      errors.push(`${pointer}.locator must be a concrete path or URL`);
    }
  }

  const environmentIds = proof.candidate.environments.map((environment) => environment.id);
  for (const duplicate of duplicateValues(environmentIds)) {
    errors.push(`candidate.environments contain duplicate id: ${duplicate}`);
  }
  for (const environmentId of proof.scope.requiredEnvironmentIds) {
    if (!environmentIds.includes(environmentId)) {
      errors.push(`required environment is not defined: ${environmentId}`);
    }
  }

  const captureIds = proof.captures.map((capture) => capture.id);
  for (const duplicate of duplicateValues(captureIds)) {
    errors.push(`captures contain duplicate id: ${duplicate}`);
  }
  matchingRequired(proof.captures, proof.scope.requiredCaptureIds, "capture", proof.status, errors);
  for (const [index, capture] of proof.captures.entries()) {
    if (!proof.scope.surfaces.includes(capture.surface)) {
      errors.push(`captures[${index}].surface is outside scope.surfaces`);
    }
    if (!environmentIds.includes(capture.environmentId)) {
      errors.push(`captures[${index}].environmentId is not defined`);
    }
    if (["overlay", "perceptual"].includes(capture.comparison)) {
      if (!capture.comparisonEvidence) {
        errors.push(`captures[${index}].comparisonEvidence is required for ${capture.comparison}`);
      }
      if (
        capture.sourceEvidence.fingerprint === capture.candidateEvidence.fingerprint ||
        capture.sourceEvidence.locator === capture.candidateEvidence.locator
      ) {
        errors.push(`captures[${index}] exact comparison must bind distinct source and candidate evidence`);
      }
    }
    if (capture.viewportClass === "narrow" && capture.viewport.width > 480) {
      errors.push(`captures[${index}] narrow viewport must be 480 CSS pixels or below`);
    }
    if (
      capture.viewportClass === "intermediate" &&
      (capture.viewport.width <= 480 || capture.viewport.width >= 1024)
    ) {
      errors.push(`captures[${index}] intermediate viewport must be between 480 and 1024 CSS pixels`);
    }
    if (capture.viewportClass === "desktop" && capture.viewport.width < 1024) {
      errors.push(`captures[${index}] desktop viewport must be 1024 CSS pixels or above`);
    }
  }
  for (const surface of proof.scope.surfaces) {
    const stateCoverage = proof.scope.requiredStateCoverage.filter((entry) => entry.surface === surface);
    if (stateCoverage.length !== 1) {
      errors.push(`scope.requiredStateCoverage must define exactly one entry for surface: ${surface}`);
    }
    const required = proof.captures.filter(
      (capture) => proof.scope.requiredCaptureIds.includes(capture.id) && capture.surface === surface,
    );
    if (required.length === 0) errors.push(`scope surface lacks a required capture: ${surface}`);
    for (const state of stateCoverage[0]?.states ?? []) {
      if (!required.some((capture) => capture.state === state)) {
        errors.push(`required state ${surface}/${state} lacks a required capture`);
      }
    }
    if (proof.scope.responsiveRequired) {
      for (const viewportClass of ["narrow", "intermediate", "desktop"]) {
        if (!required.some((capture) => capture.viewportClass === viewportClass)) {
          errors.push(`responsive surface ${surface} lacks required ${viewportClass} capture`);
        }
      }
    }
    if (
      proof.source.classification === "exact" &&
      proof.status === "pass" &&
      !required.some((capture) => ["overlay", "perceptual"].includes(capture.comparison))
    ) {
      errors.push(`exact surface ${surface} requires an overlay or perceptual comparison`);
    }
  }
  for (const entry of proof.scope.requiredStateCoverage) {
    if (!proof.scope.surfaces.includes(entry.surface)) {
      errors.push(`requiredStateCoverage surface is outside scope.surfaces: ${entry.surface}`);
    }
  }
  for (const environmentId of proof.scope.requiredEnvironmentIds) {
    if (!proof.captures.some(
      (capture) => proof.scope.requiredCaptureIds.includes(capture.id) && capture.environmentId === environmentId,
    )) {
      errors.push(`required environment lacks a required capture: ${environmentId}`);
    }
  }

  const workflowIds = proof.workflows.map((workflow) => workflow.id);
  for (const duplicate of duplicateValues(workflowIds)) {
    errors.push(`workflows contain duplicate id: ${duplicate}`);
  }
  matchingRequired(proof.workflows, proof.scope.requiredWorkflowIds, "workflow", proof.status, errors);
  for (const [index, workflow] of proof.workflows.entries()) {
    if (!proof.scope.surfaces.includes(workflow.surface)) {
      errors.push(`workflows[${index}].surface is outside scope.surfaces`);
    }
    validateDisposition(workflow, `workflows[${index}]`, errors);
  }

  const gateNames = proof.gates.map((gate) => gate.name);
  for (const duplicate of duplicateValues(gateNames)) {
    errors.push(`gates contain duplicate name: ${duplicate}`);
  }
  for (const required of REQUIRED_GATES) {
    if (!gateNames.includes(required)) errors.push(`gates must include ${required}`);
  }
  for (const [index, gate] of proof.gates.entries()) {
    validateDisposition(gate, `gates[${index}]`, errors);
  }

  const designReviewRequired = ["material", "brand_critical"].includes(proof.scope.designRisk);
  if (proof.designReview.required !== designReviewRequired) {
    errors.push("designReview.required must match scope.designRisk");
  }
  validateDisposition(proof.designReview, "designReview", errors);
  if (designReviewRequired && proof.status === "pass") {
    if (proof.designReview.result !== "pass" || !proof.designReview.reviewer) {
      errors.push("material or brand-critical design requires a passing identified design review");
    }
  }

  if (proof.designSystem.risk !== proof.scope.tokenRisk) {
    errors.push("designSystem.risk must match scope.tokenRisk");
  }
  for (const [index, lineage] of proof.designSystem.lineage.entries()) {
    if (lineage.result === "intentional_deviation" && !lineage.rationale) {
      errors.push(`designSystem.lineage[${index}].rationale is required for intentional deviation`);
    }
  }
  if (proof.scope.tokenRisk === "elevated") {
    if (!proof.designSystem.contractEvidence || proof.designSystem.lineage.length === 0) {
      errors.push("elevated token risk requires contract evidence and token lineage");
    }
    if (proof.status === "pass" && proof.designSystem.lineage.some((item) => item.result === "drift")) {
      errors.push("pass cannot contain design-token drift");
    }
    if (proof.status === "pass" && proof.designSystem.unownedValues.length > 0) {
      errors.push("pass cannot contain unowned design values under elevated token risk");
    }
    if (proof.designSystem.lineage.some((item) => item.implementations.length < 2)) {
      errors.push("elevated token lineage must bind at least two implementation surfaces per token");
    }
  }

  for (const key of ["keyboard", "contrast", "zoomReflow", "forcedColors", "reducedMotion"]) {
    validateDisposition(proof.accessibility[key], `accessibility.${key}`, errors);
  }
  if (proof.status === "pass") {
    for (const key of ["keyboard", "contrast", "zoomReflow"]) {
      if (proof.accessibility[key].result !== "pass") {
        errors.push(`accessibility.${key} must pass when proof status is pass`);
      }
    }
  }
  for (const [index, check] of proof.accessibility.assistiveTechnology.entries()) {
    validateDisposition(check, `accessibility.assistiveTechnology[${index}]`, errors);
  }
  if (proof.accessibility.risk === "material" && proof.status === "pass") {
    if (
      proof.accessibility.assistiveTechnology.length === 0 ||
      proof.accessibility.assistiveTechnology.some((check) => check.result !== "pass")
    ) {
      errors.push("material accessibility risk requires a passing named browser/assistive-technology task");
    }
  }

  const assetIds = proof.assetReceipts.map((asset) => asset.assetId);
  for (const duplicate of duplicateValues(assetIds)) {
    errors.push(`assetReceipts contain duplicate assetId: ${duplicate}`);
  }
  for (const assetId of proof.scope.requiredAssetIds) {
    const matching = proof.assetReceipts.filter((asset) => asset.assetId === assetId);
    if (matching.length !== 1) {
      errors.push(`assetReceipts must include exactly one required assetId: ${assetId}`);
    } else if (proof.status === "pass" && matching[0].result !== "pass") {
      errors.push(`required asset receipt ${assetId} must pass when proof status is pass`);
    }
  }

  const defectIds = proof.defects.map((defect) => defect.id);
  for (const duplicate of duplicateValues(defectIds)) {
    errors.push(`defects contain duplicate id: ${duplicate}`);
  }
  for (const [index, defect] of proof.defects.entries()) {
    if (defect.status === "fixed" && !defect.fixedEvidence) {
      errors.push(`defects[${index}].fixedEvidence is required for fixed status`);
    }
    if (
      defect.status === "fixed" &&
      defect.fixedEvidence?.fingerprint === defect.observedEvidence.fingerprint
    ) {
      errors.push(`defects[${index}] fixed evidence must differ from observed evidence`);
    }
    if (defect.status === "accepted") {
      if (defect.severity !== "P3") errors.push(`defects[${index}] only P3 may be accepted`);
      if (!defect.acceptance) errors.push(`defects[${index}].acceptance is required for accepted status`);
    }
  }

  if (proof.status === "pass") {
    if (proof.proofGaps.length > 0) errors.push("pass cannot contain proof gaps");
    if (proof.captures.some((capture) => ["fail", "blocked"].includes(capture.result))) {
      errors.push("pass cannot contain failed or blocked captures");
    }
    if (proof.workflows.some((workflow) => ["fail", "blocked", "not_applicable"].includes(workflow.result))) {
      errors.push("pass cannot contain failed, blocked, or not-applicable workflows");
    }
    if (proof.gates.some((gate) => ["fail", "blocked"].includes(gate.result))) {
      errors.push("pass cannot contain failed or blocked gates");
    }
    if (proof.defects.some((defect) => defect.status === "unresolved")) {
      errors.push("pass cannot contain unresolved defects");
    }
    for (const gateName of ALWAYS_REQUIRED_PASS_GATES) {
      if (gateByName(proof, gateName)?.result !== "pass") {
        errors.push(`${gateName} gate must pass for a passing visual receipt`);
      }
    }
    const conditionalGates = [
      ["responsive", proof.scope.responsiveRequired],
      ["editor_frontend_parity", proof.workflows.some((workflow) => workflow.role === "author")],
      ["design_quality", designReviewRequired],
      ["asset_quality", proof.scope.requiredAssetIds.length > 0],
    ];
    for (const [gateName, required] of conditionalGates) {
      const result = gateByName(proof, gateName)?.result;
      if (required && result !== "pass") errors.push(`${gateName} gate must pass for this scope`);
      if (!required && !["pass", "not_applicable"].includes(result)) {
        errors.push(`${gateName} gate must pass or be not applicable for this scope`);
      }
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
  const fingerprint = (character) => `sha256:${character.repeat(64)}`;
  const evidence = (kind, locator, character = "d") => ({
    kind,
    locator,
    fingerprint: fingerprint(character),
  });
  const sourceEvidence = evidence("screenshot", "design/home-desktop.png", "4");
  const candidateEvidence = evidence("screenshot", "artifacts/visual-proof/home.png", "d");
  const comparisonEvidence = evidence("comparison", "artifacts/visual-proof/home-overlay.png", "5");
  const reportEvidence = evidence("report", "artifacts/visual-proof/report.json", "e");
  const accessibilityEvidence = evidence(
    "accessibility_report",
    "artifacts/visual-proof/accessibility.json",
    "f",
  );
  const passDisposition = { result: "pass", evidence: reportEvidence };
  return {
    schemaVersion: 2,
    proofId: "home-page-visual-proof",
    status: "pass",
    surfaceKind: "site",
    source: {
      kind: "screenshot",
      classification: "exact",
      identity: "design/home-desktop.png at 1440x1200",
      fingerprint: fingerprint("a"),
    },
    candidate: {
      revision: "b".repeat(40),
      artifact: evidence("package", "artifacts/site-release.zip", "c"),
      fingerprint: fingerprint("c"),
      environments: [
        {
          id: "chromium-macos",
          wordpress: "7.0",
          product: "Example Theme 1.0.0",
          browser: "Chromium 140",
          operatingSystem: "macOS",
          locale: "en_US",
        },
      ],
    },
    scope: {
      surfaces: ["home"],
      requiredStateCoverage: [{ surface: "home", states: ["default"] }],
      requiredCaptureIds: ["home-narrow", "home-intermediate", "home-desktop"],
      requiredWorkflowIds: ["visitor-cta", "author-hero"],
      requiredEnvironmentIds: ["chromium-macos"],
      requiredAssetIds: [],
      responsiveRequired: true,
      designRisk: "baseline",
      tokenRisk: "baseline",
    },
    designReview: {
      required: false,
      result: "not_applicable",
      reason: "Exact approved source controls design quality.",
    },
    designSystem: {
      risk: "baseline",
      lineage: [],
      unownedValues: [],
      reason: "No design-system contract changed.",
    },
    accessibility: {
      risk: "baseline",
      keyboard: { result: "pass", evidence: accessibilityEvidence },
      contrast: { result: "pass", evidence: accessibilityEvidence },
      zoomReflow: { result: "pass", evidence: accessibilityEvidence },
      forcedColors: { result: "pass", evidence: accessibilityEvidence },
      reducedMotion: { result: "pass", evidence: accessibilityEvidence },
      assistiveTechnology: [],
    },
    assetReceipts: [],
    captures: [
      ["home-narrow", "narrow", 375, "manual"],
      ["home-intermediate", "intermediate", 768, "manual"],
      ["home-desktop", "desktop", 1440, "overlay"],
    ].map(([id, viewportClass, width, comparison]) => ({
      id,
      surface: "home",
      state: "default",
      viewportClass,
      viewport: { width, height: 900, devicePixelRatio: 2 },
      environmentId: "chromium-macos",
      sourceEvidence,
      candidateEvidence,
      ...(comparison === "overlay" ? { comparisonEvidence } : {}),
      comparison,
      result: "pass",
      deviations: [],
    })),
    workflows: [
      {
        id: "visitor-cta",
        role: "visitor",
        surface: "home",
        task: "Follow the primary call to action",
        result: "pass",
        evidence: reportEvidence,
      },
      {
        id: "author-hero",
        role: "author",
        surface: "home",
        task: "Edit hero copy and image, save, reload, and preview",
        result: "pass",
        evidence: reportEvidence,
      },
    ],
    gates: [...REQUIRED_GATES].map((name) => {
      if (["design_quality", "asset_quality"].includes(name)) {
        return { name, result: "not_applicable", reason: `${name} is not required for this exact baseline scope.` };
      }
      return { name, ...passDisposition };
    }),
    defects: [],
    proofGaps: [],
  };
}

function selfTest() {
  const valid = exampleProof();
  const unresolved = {
    id: "hero-overlap",
    severity: "P2",
    description: "Hero overlaps navigation",
    status: "unresolved",
    observedEvidence: valid.captures[0].candidateEvidence,
  };
  const acceptedP2 = {
    ...unresolved,
    status: "accepted",
    acceptance: {
      approvedBy: "owner",
      rationale: "Ship anyway",
      decisionEvidence: valid.captures[0].candidateEvidence,
    },
  };
  const cases = [
    ["valid proof", valid, true],
    ["unresolved defect", { ...valid, defects: [unresolved] }, false],
    ["accepted P2 defect", { ...valid, defects: [acceptedP2] }, false],
    ["fixed defect without reproof", { ...valid, defects: [{ ...unresolved, status: "fixed" }] }, false],
    ["missing scoped surface", { ...valid, scope: { ...valid.scope, surfaces: ["home", "pricing"] } }, false],
    ["missing required state", { ...valid, scope: { ...valid.scope, requiredStateCoverage: [{ surface: "home", states: ["default", "error"] }] } }, false],
    ["missing intermediate capture", { ...valid, captures: valid.captures.filter((capture) => capture.viewportClass !== "intermediate") }, false],
    ["required capture not declared", { ...valid, scope: { ...valid.scope, requiredCaptureIds: ["home-narrow", "home-desktop"] } }, false],
    ["vague evidence locator", { ...valid, captures: [{ ...valid.captures[0], candidateEvidence: { ...valid.captures[0].candidateEvidence, locator: "looks good" } }, ...valid.captures.slice(1)] }, false],
    ["missing required environment", { ...valid, scope: { ...valid.scope, requiredEnvironmentIds: ["webkit-ios"] } }, false],
    ["exact manual only", { ...valid, captures: valid.captures.map((capture) => ({ ...capture, comparison: "manual" })) }, false],
    ["material design without review", { ...valid, scope: { ...valid.scope, designRisk: "material" } }, false],
    ["elevated tokens without lineage", { ...valid, scope: { ...valid.scope, tokenRisk: "elevated" }, designSystem: { ...valid.designSystem, risk: "elevated" } }, false],
    ["material accessibility without AT", { ...valid, accessibility: { ...valid.accessibility, risk: "material" } }, false],
    ["required asset missing", { ...valid, scope: { ...valid.scope, requiredAssetIds: ["hero"] } }, false],
    ["browser gate not applicable", { ...valid, gates: valid.gates.map((gate) => gate.name === "browser_compatibility" ? { name: gate.name, result: "not_applicable", reason: "Not checked" } : gate) }, false],
    ["blocked without gap", { ...valid, status: "blocked" }, false],
    ["exact comparison without comparison artifact", { ...valid, captures: valid.captures.map((capture) => capture.comparison === "overlay" ? { ...capture, comparisonEvidence: undefined } : capture) }, false],
    ["exact comparison reuses candidate", { ...valid, captures: valid.captures.map((capture) => capture.comparison === "overlay" ? { ...capture, sourceEvidence: capture.candidateEvidence } : capture) }, false],
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
