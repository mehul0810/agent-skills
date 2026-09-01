#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import {
  validateAssetProduction,
  verifyAssetEvidenceFiles,
} from "./validate-asset-production.mjs";
import {
  collectProofEvidence,
  isProofCliEntrypoint,
  resolveProofEvidenceFile,
  verifyProofEvidenceFiles,
} from "./proof-evidence-files.mjs";

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

export function verifyVisualEvidenceFiles(proof, proofPath, evidenceRoot = process.cwd()) {
  return verifyProofEvidenceFiles(proof, { evidenceRoot, pointer: "proof" });
}

function validateLinkedAssetReceipts(proof, proofPath, evidenceRoot = process.cwd()) {
  const errors = [];
  for (const [index, link] of proof.assetReceipts.entries()) {
    const resolved = resolveProofEvidenceFile(link.evidence.locator, evidenceRoot);
    if (resolved.error) continue;
    let receipt;
    try {
      receipt = JSON.parse(fs.readFileSync(resolved.path, "utf8"));
    } catch (error) {
      errors.push(`assetReceipts[${index}] is not valid JSON: ${error.message}`);
      continue;
    }
    for (const error of validateAssetProduction(receipt)) {
      errors.push(`assetReceipts[${index}]: ${error}`);
    }
    for (const error of verifyAssetEvidenceFiles(receipt, resolved.path, evidenceRoot)) {
      errors.push(`assetReceipts[${index}]: ${error}`);
    }
    if (receipt.assetId !== link.assetId || receipt.status !== link.result) {
      errors.push(`assetReceipts[${index}] identity or result does not match linked receipt`);
    }
  }
  return errors;
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

  for (const [pointer, evidence] of collectProofEvidence(proof, "proof")) {
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
  const requiredCaptures = proof.captures.filter((capture) =>
    proof.scope.requiredCaptureIds.includes(capture.id));
  for (const duplicate of duplicateValues(
    requiredCaptures.map((capture) => capture.candidateEvidence.locator),
  )) {
    errors.push(`required captures must bind distinct candidate artifact locators: ${duplicate}`);
  }
  for (const duplicate of duplicateValues(
    requiredCaptures.map((capture) => capture.candidateEvidence.fingerprint),
  )) {
    errors.push(`required captures must bind distinct candidate artifact fingerprints: ${duplicate}`);
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
    const requiredWorkflows = proof.workflows.filter(
      (workflow) => proof.scope.requiredWorkflowIds.includes(workflow.id) && workflow.surface === surface,
    );
    if (requiredWorkflows.length === 0) {
      errors.push(`scope surface lacks a required workflow: ${surface}`);
    }
    for (const environmentId of proof.scope.requiredEnvironmentIds) {
      if (!required.some((capture) => capture.environmentId === environmentId)) {
        errors.push(`scope surface ${surface} lacks a required capture for environment: ${environmentId}`);
      }
    }
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
  const tokenImplementationSurfaces = new Set();
  for (const [index, lineage] of proof.designSystem.lineage.entries()) {
    if (lineage.result === "intentional_deviation" && !lineage.rationale) {
      errors.push(`designSystem.lineage[${index}].rationale is required for intentional deviation`);
    }
    const implementationKeys = lineage.implementations.map(
      (implementation) => `${implementation.layer}\0${implementation.location}`,
    );
    const implementationValues = new Set(
      lineage.implementations.map((implementation) => implementation.value.trim()),
    );
    if (lineage.result === "aligned" && implementationValues.size > 1) {
      errors.push(`designSystem.lineage[${index}] aligned result disagrees with implementation values`);
    }
    for (const duplicate of duplicateValues(implementationKeys)) {
      errors.push(`designSystem.lineage[${index}] contains duplicate implementation layer/location: ${duplicate.replace("\0", "/")}`);
    }
    for (const [implementationIndex, implementation] of lineage.implementations.entries()) {
      if (implementation.evidence.kind !== "token_map") {
        errors.push(`designSystem.lineage[${index}].implementations[${implementationIndex}] must use token_map evidence`);
      }
      for (const surface of implementation.surfaces) {
        if (!proof.scope.surfaces.includes(surface)) {
          errors.push(`designSystem.lineage[${index}].implementations[${implementationIndex}] surface is outside scope: ${surface}`);
        } else {
          tokenImplementationSurfaces.add(surface);
        }
      }
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
      errors.push("elevated token lineage must bind at least two implementation layers per token");
    }
    for (const [index, lineage] of proof.designSystem.lineage.entries()) {
      const layers = new Set(lineage.implementations.map((implementation) => implementation.layer));
      if (layers.size < 2 || !layers.has("rendered")) {
        errors.push(`elevated token lineage[${index}] must bind a rendered layer and at least one source or implementation layer`);
      }
    }
    for (const surface of proof.scope.surfaces) {
      if (!tokenImplementationSurfaces.has(surface)) {
        errors.push(`elevated token lineage lacks an implementation binding for scoped surface: ${surface}`);
      }
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
    if (matching[0]?.evidence.kind !== "asset_receipt") {
      errors.push(`required asset receipt ${assetId} must use asset_receipt evidence`);
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
    if (defect.status === "fixed") {
      const affectedCaptureIds = defect.affectedCaptureIds ?? [];
      const affectedWorkflowIds = defect.affectedWorkflowIds ?? [];
      const affectedEnvironmentIds = defect.affectedEnvironmentIds ?? [];
      if (affectedCaptureIds.length === 0 || affectedWorkflowIds.length === 0 || affectedEnvironmentIds.length === 0) {
        errors.push(`defects[${index}] fixed status requires affected captures, workflows, and environments`);
      }
      const affectedCaptures = affectedCaptureIds.map((id) =>
        proof.captures.find((capture) => capture.id === id));
      const affectedWorkflows = affectedWorkflowIds.map((id) =>
        proof.workflows.find((workflow) => workflow.id === id));
      for (const id of affectedCaptureIds) {
        const capture = proof.captures.find((item) => item.id === id);
        if (!capture) errors.push(`defects[${index}] affected capture is undefined: ${id}`);
        else if (capture.result !== "pass") errors.push(`defects[${index}] affected capture did not pass reproof: ${id}`);
      }
      for (const id of affectedWorkflowIds) {
        const workflow = proof.workflows.find((item) => item.id === id);
        if (!workflow) errors.push(`defects[${index}] affected workflow is undefined: ${id}`);
        else if (workflow.result !== "pass") errors.push(`defects[${index}] affected workflow did not pass reproof: ${id}`);
      }
      for (const environmentId of affectedEnvironmentIds) {
        if (!affectedCaptures.some((capture) => capture?.environmentId === environmentId)) {
          errors.push(`defects[${index}] affected environment lacks a passing capture: ${environmentId}`);
        }
      }
      const currentFingerprints = new Set([
        ...affectedCaptures.flatMap((capture) => capture
          ? [capture.candidateEvidence.fingerprint, capture.comparisonEvidence?.fingerprint]
          : []),
        ...affectedWorkflows.map((workflow) => workflow?.evidence?.fingerprint),
      ].filter(Boolean));
      if (defect.fixedEvidence && !currentFingerprints.has(defect.fixedEvidence.fingerprint)) {
        errors.push(`defects[${index}] fixed evidence must bind an affected passing capture or workflow rerun`);
      }
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
  const comparisonEvidence = evidence("comparison", "artifacts/visual-proof/home-overlay.png", "5");
  const reportEvidence = evidence("report", "artifacts/visual-proof/report.json", "e");
  const accessibilityEvidence = evidence(
    "accessibility_report",
    "artifacts/visual-proof/accessibility.json",
    "f",
  );
  const passDisposition = { result: "pass", evidence: reportEvidence };
  return {
    schemaVersion: 3,
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
    ].map(([id, viewportClass, width, comparison], index) => ({
      id,
      surface: "home",
      state: "default",
      viewportClass,
      viewport: { width, height: 900, devicePixelRatio: 2 },
      environmentId: "chromium-macos",
      sourceEvidence,
      candidateEvidence: evidence(
        "screenshot",
        `artifacts/visual-proof/${id}.png`,
        ["6", "7", "8"][index],
      ),
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
    observedEvidence: {
      kind: "screenshot",
      locator: "artifacts/visual-proof/home-narrow-before.png",
      fingerprint: `sha256:${"0".repeat(64)}`,
    },
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
  const fixed = {
    ...unresolved,
    status: "fixed",
    fixedEvidence: valid.captures[0].candidateEvidence,
    affectedCaptureIds: ["home-narrow"],
    affectedWorkflowIds: ["visitor-cta"],
    affectedEnvironmentIds: ["chromium-macos"],
  };
  const tokenEvidence = {
    kind: "token_map",
    locator: "artifacts/visual-proof/tokens.json",
    fingerprint: `sha256:${"9".repeat(64)}`,
  };
  const elevated = {
    ...valid,
    scope: { ...valid.scope, tokenRisk: "elevated" },
    designSystem: {
      risk: "elevated",
      contractEvidence: tokenEvidence,
      lineage: [{
        token: "space.section",
        canonicalSource: "DESIGN.md#spacing",
        implementations: [
          { layer: "theme_json", location: "settings.spacing.spacingSizes.50", value: "48px", surfaces: ["home"], evidence: tokenEvidence },
          { layer: "rendered", location: "[data-proof=home-section]", value: "48px", surfaces: ["home"], evidence: tokenEvidence },
        ],
        result: "aligned",
        evidence: tokenEvidence,
      }],
      unownedValues: [],
    },
  };
  const cases = [
    ["valid proof", valid, true],
    ["fixed defect with affected reproof", { ...valid, defects: [fixed] }, true],
    ["unresolved defect", { ...valid, defects: [unresolved] }, false],
    ["accepted P2 defect", { ...valid, defects: [acceptedP2] }, false],
    ["fixed defect without reproof", { ...valid, defects: [{ ...unresolved, status: "fixed" }] }, false],
    ["fixed defect with unrelated evidence", { ...valid, defects: [{ ...fixed, fixedEvidence: valid.captures[1].candidateEvidence }] }, false],
    ["missing scoped surface", { ...valid, scope: { ...valid.scope, surfaces: ["home", "pricing"] } }, false],
    ["scoped surface without required workflow", {
      ...valid,
      scope: {
        ...valid.scope,
        surfaces: ["home", "pricing"],
        requiredStateCoverage: [...valid.scope.requiredStateCoverage, { surface: "pricing", states: ["default"] }],
        requiredCaptureIds: [...valid.scope.requiredCaptureIds, "pricing-narrow", "pricing-intermediate", "pricing-desktop"],
      },
      captures: [...valid.captures, ...valid.captures.map((capture, index) => ({
        ...capture,
        id: `pricing-${capture.viewportClass}`,
        surface: "pricing",
        candidateEvidence: { ...capture.candidateEvidence, locator: `artifacts/visual-proof/pricing-${capture.viewportClass}.png`, fingerprint: `sha256:${["1", "2", "3"][index].repeat(64)}` },
      }))],
    }, false],
    ["missing required state", { ...valid, scope: { ...valid.scope, requiredStateCoverage: [{ surface: "home", states: ["default", "error"] }] } }, false],
    ["missing intermediate capture", { ...valid, captures: valid.captures.filter((capture) => capture.viewportClass !== "intermediate") }, false],
    ["required capture not declared", { ...valid, scope: { ...valid.scope, requiredCaptureIds: ["home-narrow", "home-desktop"] } }, false],
    ["vague evidence locator", { ...valid, captures: [{ ...valid.captures[0], candidateEvidence: { ...valid.captures[0].candidateEvidence, locator: "looks good" } }, ...valid.captures.slice(1)] }, false],
    ["missing required environment", { ...valid, scope: { ...valid.scope, requiredEnvironmentIds: ["webkit-ios"] } }, false],
    ["reused candidate artifact", { ...valid, captures: valid.captures.map((capture) => ({ ...capture, candidateEvidence: valid.captures[0].candidateEvidence })) }, false],
    ["exact manual only", { ...valid, captures: valid.captures.map((capture) => ({ ...capture, comparison: "manual" })) }, false],
    ["material design without review", { ...valid, scope: { ...valid.scope, designRisk: "material" } }, false],
    ["elevated tokens without lineage", { ...valid, scope: { ...valid.scope, tokenRisk: "elevated" }, designSystem: { ...valid.designSystem, risk: "elevated" } }, false],
    ["valid elevated token lineage", elevated, true],
    ["token lineage with meaningless implementation surface", {
      ...elevated,
      designSystem: {
        ...elevated.designSystem,
        lineage: [{
          ...elevated.designSystem.lineage[0],
          implementations: elevated.designSystem.lineage[0].implementations.map((implementation) => ({ ...implementation, surfaces: ["not-a-scoped-surface"] })),
        }],
      },
    }, false],
    ["aligned token lineage with mismatched values", {
      ...elevated,
      designSystem: {
        ...elevated.designSystem,
        lineage: [{
          ...elevated.designSystem.lineage[0],
          implementations: elevated.designSystem.lineage[0].implementations.map((implementation, index) => ({
            ...implementation,
            value: index === 0 ? "48px" : "200px",
          })),
        }],
      },
    }, false],
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
  const evidenceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "visual-proof-"));
  const hydrated = structuredClone(valid);
  const seen = new WeakSet();
  let index = 0;
  for (const [, evidence] of collectProofEvidence(hydrated, "proof")) {
    if (seen.has(evidence)) continue;
    seen.add(evidence);
    const bytes = Buffer.from(`visual-evidence-${index}`);
    const locator = `evidence-${index}.json`;
    fs.writeFileSync(path.join(evidenceRoot, locator), bytes);
    evidence.locator = locator;
    evidence.fingerprint = `sha256:${crypto.createHash("sha256").update(bytes).digest("hex")}`;
    index += 1;
  }
  hydrated.candidate.fingerprint = hydrated.candidate.artifact.fingerprint;
  if (verifyVisualEvidenceFiles(hydrated, path.join(evidenceRoot, "proof.json"), evidenceRoot).length > 0) {
    throw new Error("valid local visual evidence failed byte verification");
  }
  fs.writeFileSync(path.join(evidenceRoot, hydrated.captures[0].candidateEvidence.locator), "changed");
  if (!verifyVisualEvidenceFiles(hydrated, path.join(evidenceRoot, "proof.json"), evidenceRoot).some((error) => error.includes("does not match"))) {
    throw new Error("changed local visual evidence was accepted");
  }
  const outsideRoot = fs.mkdtempSync(path.join(os.tmpdir(), "visual-proof-outside-"));
  const outsideFile = path.join(outsideRoot, "outside.json");
  fs.writeFileSync(outsideFile, "outside");
  const escaped = structuredClone(hydrated);
  escaped.captures[0].candidateEvidence.locator = path.relative(evidenceRoot, outsideFile);
  if (!verifyVisualEvidenceFiles(escaped, path.join(evidenceRoot, "proof.json"), evidenceRoot).some((error) => error.includes("remain inside"))) {
    throw new Error("visual evidence traversal outside the declared root was accepted");
  }
  const absolute = structuredClone(hydrated);
  absolute.captures[0].candidateEvidence.locator = outsideFile;
  if (!verifyVisualEvidenceFiles(absolute, path.join(evidenceRoot, "proof.json"), evidenceRoot).some((error) => error.includes("relative"))) {
    throw new Error("absolute visual evidence locator was accepted");
  }
  const symlink = path.join(evidenceRoot, "outside-link.json");
  fs.symlinkSync(outsideFile, symlink);
  const linked = structuredClone(hydrated);
  linked.captures[0].candidateEvidence.locator = path.basename(symlink);
  if (!verifyVisualEvidenceFiles(linked, path.join(evidenceRoot, "proof.json"), evidenceRoot).some((error) => error.includes("symlink"))) {
    throw new Error("visual evidence symlink escape was accepted");
  }
  const oversizedFile = path.join(evidenceRoot, "oversized.bin");
  fs.writeFileSync(oversizedFile, "x");
  fs.truncateSync(oversizedFile, 100 * 1024 * 1024 + 1);
  const oversized = structuredClone(hydrated);
  oversized.captures[0].candidateEvidence.locator = path.basename(oversizedFile);
  if (!verifyVisualEvidenceFiles(oversized, path.join(evidenceRoot, "proof.json"), evidenceRoot).some((error) => error.includes("100 MiB"))) {
    throw new Error("oversized visual evidence was accepted");
  }
  fs.rmSync(outsideRoot, { recursive: true, force: true });
  fs.rmSync(evidenceRoot, { recursive: true, force: true });
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
  const errors = [
    ...validateVisualProof(proof),
    ...verifyVisualEvidenceFiles(proof, argument),
    ...validateLinkedAssetReceipts(proof, argument),
  ];
  if (errors.length > 0) {
    for (const error of errors) console.error(`ERROR: ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`visual proof valid: ${argument}`);
}

if (isProofCliEntrypoint(import.meta.url)) await main();
