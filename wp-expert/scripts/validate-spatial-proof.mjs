#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import {
  evaluateSpatialExpectation,
  SPATIAL_ALIGNMENT_KINDS,
  SPATIAL_MEASUREMENT_KINDS,
  SPATIAL_TOKEN_KINDS,
  spatialExpectationErrors,
} from "./spatial-proof-contract.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.resolve(
  SCRIPT_DIR,
  "../../shared/schemas/wordpress-spatial-proof.schema.json",
);
const REVISION = /^(?:[a-f0-9]{40}|working-tree:sha256:[a-f0-9]{64})$/;
const LOCATOR = /(?:https?:\/\/|\/|\\|\.(?:png|webp|jpe?g|json|zip|md|html|txt|log|trace)$)/i;
const DESIGN_CRITERIA = new Set([
  "design_coherence",
  "spatial_craft",
  "functionality",
  "wordpress_ownership",
]);
const ANCHOR_MEASUREMENT_KINDS = new Map([
  ["logical_start", new Set(["edge_alignment"])],
  ["logical_end", new Set(["edge_alignment"])],
  ["shared_edge", new Set(["edge_alignment"])],
  ["media_edge", new Set(["edge_alignment"])],
  ["text_baseline", new Set(["baseline_alignment"])],
  ["center_axis", new Set(["center_alignment"])],
  ["optical", SPATIAL_ALIGNMENT_KINDS],
]);
const MAX_EVIDENCE_BYTES = 100 * 1024 * 1024;

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

function isInside(root, candidate) {
  return candidate === root || candidate.startsWith(`${root}${path.sep}`);
}

function hashFile(file) {
  const hash = crypto.createHash("sha256");
  const descriptor = fs.openSync(file, "r");
  const buffer = Buffer.allocUnsafe(1024 * 1024);
  try {
    let bytesRead;
    do {
      bytesRead = fs.readSync(descriptor, buffer, 0, buffer.length, null);
      if (bytesRead > 0) hash.update(buffer.subarray(0, bytesRead));
    } while (bytesRead > 0);
  } finally {
    fs.closeSync(descriptor);
  }
  return `sha256:${hash.digest("hex")}`;
}

export function verifySpatialEvidenceFiles(proof, proofPath, evidenceRoot = process.cwd()) {
  const errors = [];
  const checked = new Set();
  const root = fs.realpathSync(path.resolve(evidenceRoot));
  for (const [pointer, evidence] of evidenceObjects(proof)) {
    const key = `${evidence.locator}\0${evidence.fingerprint}`;
    if (checked.has(key)) continue;
    checked.add(key);
    if (/^https?:\/\//i.test(evidence.locator)) {
      errors.push(`${pointer}.locator must be downloaded to a local verifiable artifact`);
      continue;
    }
    if (path.isAbsolute(evidence.locator)) {
      errors.push(`${pointer}.locator must be relative to the declared evidence root`);
      continue;
    }
    const resolved = path.resolve(root, evidence.locator);
    if (!isInside(root, resolved)) {
      errors.push(`${pointer}.locator escapes the declared evidence root`);
      continue;
    }
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
      errors.push(`${pointer}.locator does not resolve to a file: ${evidence.locator}`);
      continue;
    }
    const canonical = fs.realpathSync(resolved);
    if (!isInside(root, canonical)) {
      errors.push(`${pointer}.locator resolves outside the declared evidence root`);
      continue;
    }
    if (fs.statSync(canonical).size > MAX_EVIDENCE_BYTES) {
      errors.push(`${pointer}.locator exceeds the 100 MiB verification limit`);
      continue;
    }
    const actual = hashFile(canonical);
    if (actual !== evidence.fingerprint) {
      errors.push(`${pointer}.fingerprint does not match evidence bytes: ${evidence.locator}`);
    }
  }
  return errors;
}

function computedResult(measurement) {
  return evaluateSpatialExpectation(measurement.actual.value, measurement.expected);
}

function validateEvidenceDisposition(item, pointer, errors) {
  if (item.result === "pass" && !item.evidence) errors.push(`${pointer}.evidence is required for pass`);
  if (["fail", "blocked"].includes(item.result) && !item.reason) {
    errors.push(`${pointer}.reason is required for ${item.result}`);
  }
}

export function validateSpatialProof(proof) {
  const errors = schemaErrors(proof);
  if (errors.length > 0) return errors;

  if (!REVISION.test(proof.candidate.revision)) {
    errors.push("candidate.revision must be a full commit SHA or working-tree:sha256:<digest>");
  }
  for (const [pointer, evidence] of evidenceObjects(proof)) {
    if (!LOCATOR.test(evidence.locator)) {
      errors.push(`${pointer}.locator must be a concrete path or URL`);
    }
  }

  const environmentIds = proof.environments.map((item) => item.id);
  for (const duplicate of duplicateValues(environmentIds)) {
    errors.push(`environments contain duplicate id: ${duplicate}`);
  }
  for (const [index, environment] of proof.environments.entries()) {
    const width = environment.viewport.width;
    if (environment.viewportClass === "narrow" && width > 480) {
      errors.push(`environments[${index}] narrow viewport must be 480 CSS pixels or below`);
    }
    if (environment.viewportClass === "intermediate" && (width <= 480 || width >= 1024)) {
      errors.push(`environments[${index}] intermediate viewport must be between 480 and 1024 CSS pixels`);
    }
    if (environment.viewportClass === "desktop" && width < 1024) {
      errors.push(`environments[${index}] desktop viewport must be 1024 CSS pixels or above`);
    }
  }

  const roleTokens = proof.contract.roles.map((item) => item.token);
  const rolesByToken = new Map(proof.contract.roles.map((item) => [item.token, item]));
  const hierarchyIds = proof.contract.hierarchy.map((item) => item.id);
  const anchorIds = proof.contract.anchors.map((item) => item.id);
  const anchorsById = new Map(proof.contract.anchors.map((item) => [item.id, item]));
  const exceptionIds = proof.contract.exceptions.map((item) => item.id);
  for (const [label, values] of [
    ["role token", roleTokens],
    ["hierarchy id", hierarchyIds],
    ["anchor id", anchorIds],
    ["exception id", exceptionIds],
  ]) {
    for (const duplicate of duplicateValues(values)) errors.push(`contract contains duplicate ${label}: ${duplicate}`);
  }
  for (const [index, hierarchy] of proof.contract.hierarchy.entries()) {
    if (!roleTokens.includes(hierarchy.tighter) || !roleTokens.includes(hierarchy.looser)) {
      errors.push(`contract.hierarchy[${index}] must reference defined role tokens`);
    }
  }
  for (const [index, role] of proof.contract.roles.entries()) {
    const resolvedEnvironmentIds = role.resolvedValues.map((item) => item.environmentId);
    for (const duplicate of duplicateValues(resolvedEnvironmentIds)) {
      errors.push(`contract.roles[${index}] contains duplicate resolved environment: ${duplicate}`);
    }
    for (const resolved of role.resolvedValues) {
      if (!environmentIds.includes(resolved.environmentId)) {
        errors.push(`contract.roles[${index}] resolved value references an undefined environment: ${resolved.environmentId}`);
      }
    }
  }

  const measurementIds = proof.measurements.map((item) => item.id);
  for (const duplicate of duplicateValues(measurementIds)) {
    errors.push(`measurements contain duplicate id: ${duplicate}`);
  }
  for (const [index, measurement] of proof.measurements.entries()) {
    const pointer = `measurements[${index}]`;
    if (!environmentIds.includes(measurement.environmentId)) {
      errors.push(`${pointer}.environmentId is not defined`);
    }
    if (measurement.expected.unit !== measurement.actual.unit) {
      errors.push(`${pointer} expected and actual units must match`);
    }
    if (measurement.acceptance && measurement.expected.unit === "px" && (measurement.expected.tolerance ?? 0) > 2) {
      errors.push(`${pointer} acceptance tolerance cannot exceed 2 CSS pixels; use a range or documented exception`);
    }
    for (const error of spatialExpectationErrors(measurement.expected, measurement.actual.value)) {
      errors.push(`${pointer} ${error}`);
    }
    if (
      measurement.expected.operator === "range" &&
      (typeof measurement.expected.min !== "number" || typeof measurement.expected.max !== "number")
    ) {
      errors.push(`${pointer} range expectation requires numeric min and max`);
    }
    if (
      measurement.expected.operator !== "range" &&
      !Object.hasOwn(measurement.expected, "value")
    ) {
      errors.push(`${pointer} ${measurement.expected.operator} expectation requires value`);
    }
    if (SPATIAL_TOKEN_KINDS.has(measurement.kind)) {
      if (!measurement.expected.token && !measurement.expected.exceptionId) {
        errors.push(`${pointer} requires a semantic token or documented exception`);
      }
    }
    if (measurement.expected.token && !roleTokens.includes(measurement.expected.token)) {
      errors.push(`${pointer}.expected.token is not defined by the spatial contract`);
    }
    if (measurement.expected.token && roleTokens.includes(measurement.expected.token)) {
      const role = rolesByToken.get(measurement.expected.token);
      const resolved = role.resolvedValues.find((item) => item.environmentId === measurement.environmentId);
      if (
        !resolved ||
        measurement.expected.operator !== "eq" ||
        typeof measurement.expected.value !== "number" ||
        resolved?.unit !== measurement.expected.unit ||
        resolved?.value !== measurement.expected.value
      ) {
        errors.push(`${pointer}.expected must equal the declared semantic token value and unit for its environment`);
      }
    }
    if (measurement.expected.exceptionId && !exceptionIds.includes(measurement.expected.exceptionId)) {
      errors.push(`${pointer}.expected.exceptionId is not defined by the spatial contract`);
    }
    if (SPATIAL_ALIGNMENT_KINDS.has(measurement.kind)) {
      if (!measurement.expected.anchorId && !measurement.expected.exceptionId) {
        errors.push(`${pointer} requires an alignment anchor or documented exception`);
      }
    }
    if (measurement.expected.anchorId && !anchorIds.includes(measurement.expected.anchorId)) {
      errors.push(`${pointer}.expected.anchorId is not defined by the spatial contract`);
    }
    if (measurement.expected.anchorId && anchorIds.includes(measurement.expected.anchorId)) {
      const anchor = anchorsById.get(measurement.expected.anchorId);
      const measuredSubjects = measurement.subject.split(/\s*->\s*/).filter(Boolean);
      if (!ANCHOR_MEASUREMENT_KINDS.get(anchor.type)?.has(measurement.kind)) {
        errors.push(`${pointer}.kind does not match the declared anchor type ${anchor.type}`);
      }
      if (anchor.subjects.some((subject) => !measuredSubjects.includes(subject))) {
        errors.push(`${pointer}.subject does not cover every subject in anchor ${anchor.id}`);
      }
    }
    if (measurement.kind === "relationship") {
      if (!measurement.expected.hierarchyId || !hierarchyIds.includes(measurement.expected.hierarchyId)) {
        errors.push(`${pointer} must reference a defined hierarchy invariant`);
      }
      if (!measurement.relationshipValues) {
        errors.push(`${pointer} must record the measured tighter and looser values`);
      } else if (measurement.relationshipValues.tighter >= measurement.relationshipValues.looser) {
        errors.push(`${pointer} must prove the tighter value is smaller than the looser value`);
      } else {
        const hierarchy = proof.contract.hierarchy.find((item) => item.id === measurement.expected.hierarchyId);
        const tighterRole = rolesByToken.get(hierarchy?.tighter);
        const looserRole = rolesByToken.get(hierarchy?.looser);
        const tighterResolved = tighterRole?.resolvedValues.find((item) => item.environmentId === measurement.environmentId);
        const looserResolved = looserRole?.resolvedValues.find((item) => item.environmentId === measurement.environmentId);
        if (
          !tighterResolved ||
          !looserResolved ||
          tighterResolved?.unit !== measurement.relationshipValues.unit ||
          looserResolved?.unit !== measurement.relationshipValues.unit ||
          tighterResolved?.value !== measurement.relationshipValues.tighter ||
          looserResolved?.value !== measurement.relationshipValues.looser
        ) {
          errors.push(`${pointer} relationship values do not match the declared role tokens`);
        }
      }
    }
    if (
      proof.target.classification === "exact" &&
      measurement.acceptance &&
      measurement.expected.source === "derived"
    ) {
      errors.push(`${pointer} cannot use derived acceptance geometry for an exact target`);
    }
    validateEvidenceDisposition(measurement, pointer, errors);
    if (measurement.result !== "blocked") {
      const expectedResult = computedResult(measurement) ? "pass" : "fail";
      if (measurement.result !== expectedResult) {
        errors.push(`${pointer}.result disagrees with its expected and actual values`);
      }
    }
  }
  for (const hierarchyId of hierarchyIds) {
    if (!proof.measurements.some((item) => item.kind === "relationship" && item.expected.hierarchyId === hierarchyId)) {
      errors.push(`hierarchy invariant lacks a relationship measurement: ${hierarchyId}`);
    }
  }
  const selectedTarget = proof.target.classification !== "none";
  if (selectedTarget && proof.risk === "baseline") {
    errors.push("a selected visual target requires material or brand-critical spatial risk");
  }
  if (selectedTarget && !proof.contract.responsiveRequired) {
    errors.push("a selected visual target requires responsive spatial proof");
  }
  if (selectedTarget && proof.contract.anchors.length === 0) {
    errors.push("a selected visual target requires at least one declared alignment anchor");
  }
  if (selectedTarget && proof.contract.hierarchy.length === 0) {
    errors.push("a selected visual target requires at least one measured spacing hierarchy");
  }
  if (selectedTarget && !proof.measurements.some((item) => SPATIAL_ALIGNMENT_KINDS.has(item.kind))) {
    errors.push("a selected visual target requires at least one alignment measurement");
  }
  if (selectedTarget && !proof.contract.parentLayoutRisk) {
    errors.push("a selected visual target requires parent layout risk inspection");
  }
  if (
    (selectedTarget || proof.contract.parentLayoutRisk) &&
    !proof.measurements.some((item) => item.kind === "parent_layout")
  ) {
    errors.push("parent layout risk requires a parent_layout diagnostic measurement");
  }

  const stressIds = proof.stressCases.map((item) => item.id);
  for (const duplicate of duplicateValues(stressIds)) {
    errors.push(`stressCases contain duplicate id: ${duplicate}`);
  }
  for (const [index, stressCase] of proof.stressCases.entries()) {
    if (!environmentIds.includes(stressCase.environmentId)) {
      errors.push(`stressCases[${index}].environmentId is not defined`);
    }
    validateEvidenceDisposition(stressCase, `stressCases[${index}]`, errors);
  }

  const designRequired = ["material", "brand_critical"].includes(proof.risk);
  if (proof.designEvaluation.required !== designRequired) {
    errors.push("designEvaluation.required must match risk");
  }
  if (designRequired) {
    if (
      !proof.designEvaluation.independent ||
      !proof.designEvaluation.reviewer ||
      !proof.designEvaluation.evidence
    ) {
      errors.push("material or brand-critical spatial work requires an identified independent evaluator and evidence");
    }
    if (
      proof.designEvaluation.reviewer?.trim().toLowerCase() ===
      proof.candidate.implementedBy.trim().toLowerCase()
    ) {
      errors.push("the independent evaluator must differ from candidate.implementedBy");
    }
    const criteria = proof.designEvaluation.criteria.map((item) => item.name);
    for (const duplicate of duplicateValues(criteria)) {
      errors.push(`designEvaluation.criteria contain duplicate name: ${duplicate}`);
    }
    for (const criterion of DESIGN_CRITERIA) {
      if (!criteria.includes(criterion)) errors.push(`designEvaluation.criteria must include ${criterion}`);
    }
    if (proof.status === "pass" && (
      proof.designEvaluation.result !== "pass" ||
      proof.designEvaluation.criteria.some((item) => item.result !== "pass")
    )) {
      errors.push("required independent design evaluation must pass with all criteria");
    }
  } else if (proof.designEvaluation.required || proof.designEvaluation.result !== "not_applicable") {
    errors.push("baseline spatial work must mark design evaluation not applicable unless risk is elevated");
  }

  const defectIds = proof.defects.map((item) => item.id);
  for (const duplicate of duplicateValues(defectIds)) errors.push(`defects contain duplicate id: ${duplicate}`);
  for (const [index, defect] of proof.defects.entries()) {
    if (defect.status === "fixed") {
      if (!defect.fixedEvidence) errors.push(`defects[${index}].fixedEvidence is required for fixed status`);
      if (defect.fixedEvidence?.fingerprint === defect.observedEvidence.fingerprint) {
        errors.push(`defects[${index}] fixed evidence must differ from observed evidence`);
      }
    }
    if (defect.status === "accepted" && (defect.severity !== "P3" || !defect.acceptanceReason)) {
      errors.push(`defects[${index}] only an explained P3 may be accepted`);
    }
  }

  if (proof.repair.failedCycles === 0 && proof.repair.action !== "not_needed") {
    errors.push("zero failed repair cycles must use not_needed");
  }
  if (proof.repair.failedCycles === 1 && !["focused_repair", "reopen_contract"].includes(proof.repair.action)) {
    errors.push("one failed repair cycle must use focused_repair or reopen_contract");
  }
  if (proof.repair.failedCycles >= 2 && proof.repair.action !== "reopen_contract") {
    errors.push("two failed repair cycles require reopening the spatial contract");
  }
  if (proof.repair.action !== "not_needed" && !proof.repair.reason) {
    errors.push("repair.reason is required when repair action is needed");
  }
  if (proof.status === "pass" && proof.repair.action === "reopen_contract") {
    errors.push("a receipt that reopens the spatial contract cannot pass");
  }

  if (proof.status === "pass") {
    if (proof.proofGaps.length > 0) errors.push("pass cannot contain proof gaps");
    if (proof.measurements.some((item) => item.result !== "pass")) {
      errors.push("all spatial measurements must pass for a passing receipt");
    }
    if (proof.stressCases.some((item) => item.result !== "pass")) {
      errors.push("all spatial stress cases must pass for a passing receipt");
    }
    if (proof.defects.some((item) => item.status === "unresolved")) {
      errors.push("pass cannot contain unresolved spatial defects");
    }
    for (const environmentId of environmentIds) {
      if (!proof.measurements.some((item) => item.environmentId === environmentId)) {
        errors.push(`passing environment lacks a measurement: ${environmentId}`);
      }
      if (!proof.stressCases.some((item) => item.environmentId === environmentId)) {
        errors.push(`passing environment lacks a content stress case: ${environmentId}`);
      }
      if (selectedTarget && !proof.measurements.some((item) => item.environmentId === environmentId && SPATIAL_ALIGNMENT_KINDS.has(item.kind))) {
        errors.push(`passing selected-target environment lacks an alignment measurement: ${environmentId}`);
      }
      if (selectedTarget && !proof.measurements.some((item) => item.environmentId === environmentId && item.kind === "parent_layout")) {
        errors.push(`passing selected-target environment lacks a parent_layout diagnostic: ${environmentId}`);
      }
      for (const hierarchyId of hierarchyIds) {
        if (
          selectedTarget &&
          !proof.measurements.some((item) => item.environmentId === environmentId && item.kind === "relationship" && item.expected.hierarchyId === hierarchyId)
        ) {
          errors.push(`passing selected-target environment lacks hierarchy measurement ${hierarchyId}: ${environmentId}`);
        }
      }
      for (const anchorId of anchorIds) {
        if (
          selectedTarget &&
          !proof.measurements.some((item) => item.environmentId === environmentId && SPATIAL_ALIGNMENT_KINDS.has(item.kind) && item.expected.anchorId === anchorId)
        ) {
          errors.push(`passing selected-target environment lacks anchor measurement ${anchorId}: ${environmentId}`);
        }
      }
    }
    if (proof.contract.responsiveRequired) {
      for (const viewportClass of ["narrow", "intermediate", "desktop"]) {
        if (!proof.environments.some((item) => item.viewportClass === viewportClass)) {
          errors.push(`responsive spatial proof lacks a ${viewportClass} environment`);
        }
      }
    }
  }
  if (proof.status === "blocked" && proof.proofGaps.length === 0) {
    errors.push("blocked spatial proof requires at least one proof gap");
  }
  if (
    proof.status === "fail" &&
    !proof.measurements.some((item) => item.result === "fail") &&
    !proof.stressCases.some((item) => item.result === "fail") &&
    !proof.defects.some((item) => item.status === "unresolved") &&
    proof.designEvaluation.result !== "fail"
  ) {
    errors.push("fail must identify a failed measurement, stress case, design evaluation, or unresolved defect");
  }

  return [...new Set(errors)];
}

function exampleProof() {
  const fingerprint = (character) => `sha256:${character.repeat(64)}`;
  const evidence = (kind, locator, character) => ({ kind, locator, fingerprint: fingerprint(character) });
  const report = evidence("report", "artifacts/spatial/measurements.json", "a");
  const review = evidence("design_review", "artifacts/spatial/review.md", "b");
  const contract = evidence("report", "DESIGN.md", "c");
  const environments = [
    ["narrow", 375],
    ["intermediate", 768],
    ["desktop", 1440],
  ].map(([viewportClass, width]) => ({
    id: `chromium-${viewportClass}`,
    viewportClass,
    viewport: { width, height: 900 },
    browser: "Chromium 140",
    locale: "en_US",
    direction: "ltr",
    fontState: "document.fonts.ready",
    contentFixture: "representative long-copy fixture",
  }));
  const measurements = environments.flatMap((environment) => [
    {
      id: `card-gap-${environment.viewportClass}`,
      environmentId: environment.id,
      kind: "gap",
      subject: ".feature-grid",
      acceptance: true,
      expected: { source: "measured", operator: "eq", value: 24, unit: "px", tolerance: 1, token: "space.group" },
      actual: { value: 24, unit: "px" },
      result: "pass",
      evidence: report,
    },
    {
      id: `group-before-section-${environment.viewportClass}`,
      environmentId: environment.id,
      kind: "relationship",
      subject: ".feature-grid -> .next-section",
      acceptance: true,
      expected: { source: "measured", operator: "eq", value: true, unit: "boolean", hierarchyId: "group-section" },
      actual: { value: true, unit: "boolean" },
      relationshipValues: { tighter: 24, looser: 64, unit: "px" },
      result: "pass",
      evidence: report,
    },
    {
      id: `card-start-alignment-${environment.viewportClass}`,
      environmentId: environment.id,
      kind: "edge_alignment",
      subject: ".feature-card__title -> .feature-card",
      acceptance: true,
      expected: { source: "measured", operator: "eq", value: 0, unit: "px", tolerance: 1, anchorId: "card-start" },
      actual: { value: 0, unit: "px" },
      result: "pass",
      evidence: report,
    },
    {
      id: `card-parent-display-${environment.viewportClass}`,
      environmentId: environment.id,
      kind: "parent_layout",
      subject: ".feature-card",
      acceptance: false,
      expected: { source: "derived", operator: "eq", value: "grid", unit: "string" },
      actual: { value: "grid", unit: "string" },
      result: "pass",
      evidence: report,
    },
  ]);
  return {
    schemaVersion: 1,
    proofId: "home-spatial-proof",
    status: "pass",
    risk: "material",
    target: { classification: "exact", identity: "approved homepage frame" },
    candidate: {
      revision: "d".repeat(40),
      implementedBy: "implementation worker",
      artifact: evidence("package", "artifacts/theme.zip", "e"),
    },
    contract: {
      canonicalSource: "DESIGN.md and theme.json",
      responsiveRequired: true,
      parentLayoutRisk: true,
      density: "comfortable",
      roles: [
        { name: "group", token: "space.group", resolvedValues: environments.map((item) => ({ environmentId: item.id, value: 24, unit: "px" })) },
        { name: "section", token: "space.section", resolvedValues: environments.map((item) => ({ environmentId: item.id, value: 64, unit: "px" })) },
      ],
      hierarchy: [{ id: "group-section", tighter: "space.group", looser: "space.section" }],
      anchors: [{ id: "card-start", type: "logical_start", subjects: [".feature-card", ".feature-card__title"] }],
      exceptions: [],
      evidence: contract,
    },
    environments,
    measurements,
    stressCases: environments.map((environment) => ({
      id: `long-copy-${environment.viewportClass}`,
      environmentId: environment.id,
      case: "Long heading and CTA labels preserve hierarchy without overflow",
      result: "pass",
      evidence: report,
    })),
    designEvaluation: {
      required: true,
      independent: true,
      reviewer: "fresh product-design audit",
      result: "pass",
      criteria: [...DESIGN_CRITERIA].map((name) => ({ name, result: "pass" })),
      evidence: review,
    },
    repair: { failedCycles: 0, action: "not_needed" },
    defects: [],
    proofGaps: [],
  };
}

function selfTest() {
  const valid = exampleProof();
  const responsiveToken = structuredClone(valid);
  responsiveToken.contract.roles.find((item) => item.token === "space.group").resolvedValues
    .find((item) => item.environmentId === "chromium-narrow").value = 16;
  for (const measurement of responsiveToken.measurements.filter((item) => item.environmentId === "chromium-narrow")) {
    if (measurement.kind === "gap") {
      measurement.expected.value = 16;
      measurement.actual.value = 16;
    }
    if (measurement.kind === "relationship") measurement.relationshipValues.tighter = 16;
  }
  const cases = [
    ["valid receipt", valid, true],
    ["environment-resolved responsive token", responsiveToken, true],
    ["exact target uses derived geometry", { ...valid, measurements: valid.measurements.map((item, index) => index === 0 ? { ...item, expected: { ...item.expected, source: "derived" } } : item) }, false],
    ["exact target allows derived diagnostic", valid, true],
    ["missing intermediate", { ...valid, environments: valid.environments.filter((item) => item.viewportClass !== "intermediate"), measurements: valid.measurements.filter((item) => item.environmentId !== "chromium-intermediate"), stressCases: valid.stressCases.filter((item) => item.environmentId !== "chromium-intermediate") }, false],
    ["unowned gap", { ...valid, measurements: valid.measurements.map((item, index) => index === 0 ? { ...item, expected: { source: "measured", operator: "eq", value: 24, unit: "px", tolerance: 1 } } : item) }, false],
    ["false pass", { ...valid, measurements: valid.measurements.map((item, index) => index === 0 ? { ...item, actual: { value: 40, unit: "px" } } : item) }, false],
    ["string lte coercion", { ...valid, measurements: valid.measurements.map((item, index) => index === 0 ? { ...item, expected: { ...item.expected, operator: "lte", value: "2", token: undefined }, actual: { value: 10, unit: "px" } } : item) }, false],
    ["token value drift", { ...valid, measurements: valid.measurements.map((item, index) => index === 0 ? { ...item, expected: { ...item.expected, value: 40 }, actual: { value: 40, unit: "px" } } : item) }, false],
    ["token drift hidden by tolerance", { ...valid, measurements: valid.measurements.map((item, index) => index === 0 ? { ...item, expected: { ...item.expected, tolerance: 16 }, actual: { value: 40, unit: "px" } } : item) }, false],
    ["string role resolution", { ...valid, contract: { ...valid.contract, roles: valid.contract.roles.map((item, index) => index === 0 ? { ...item, resolvedValues: item.resolvedValues.map((resolved, resolvedIndex) => resolvedIndex === 0 ? { ...resolved, value: "24" } : resolved) } : item) } }, false],
    ["self review", { ...valid, designEvaluation: { ...valid.designEvaluation, independent: false } }, false],
    ["same reviewer and implementer", { ...valid, designEvaluation: { ...valid.designEvaluation, reviewer: valid.candidate.implementedBy } }, false],
    ["unmeasured hierarchy", { ...valid, measurements: valid.measurements.filter((item) => item.kind !== "relationship") }, false],
    ["false hierarchy", { ...valid, measurements: valid.measurements.map((item) => item.kind === "relationship" ? { ...item, relationshipValues: { tighter: 64, looser: 24, unit: "px" } } : item) }, false],
    ["missing parent diagnostic", { ...valid, measurements: valid.measurements.filter((item) => item.kind !== "parent_layout") }, false],
    ["intermediate lacks alignment", { ...valid, measurements: valid.measurements.filter((item) => !(item.environmentId === "chromium-intermediate" && SPATIAL_ALIGNMENT_KINDS.has(item.kind))) }, false],
    ["intermediate lacks parent diagnostic", { ...valid, measurements: valid.measurements.filter((item) => !(item.environmentId === "chromium-intermediate" && item.kind === "parent_layout")) }, false],
    ["intermediate lacks hierarchy", { ...valid, measurements: valid.measurements.filter((item) => !(item.environmentId === "chromium-intermediate" && item.kind === "relationship")) }, false],
    ["risk downgrade", { ...valid, risk: "baseline", designEvaluation: { required: false, independent: false, result: "not_applicable", criteria: [], reason: "Low risk" } }, false],
    ["responsive downgrade", { ...valid, contract: { ...valid.contract, responsiveRequired: false } }, false],
    ["parent risk downgrade", { ...valid, contract: { ...valid.contract, parentLayoutRisk: false } }, false],
    ["missing alignment anchor", { ...valid, contract: { ...valid.contract, anchors: [] } }, false],
    ["unmeasured declared anchor", { ...valid, contract: { ...valid.contract, anchors: [...valid.contract.anchors, { id: "card-center", type: "center_axis", subjects: [".feature-card", ".feature-card__title"] }] } }, false],
    ["anchor type mismatch", { ...valid, contract: { ...valid.contract, anchors: valid.contract.anchors.map((item) => ({ ...item, type: "text_baseline" })) } }, false],
    ["anchor subject mismatch", { ...valid, contract: { ...valid.contract, anchors: valid.contract.anchors.map((item) => ({ ...item, subjects: [".unmeasured", ".feature-card"] })) } }, false],
    ["missing hierarchy contract", { ...valid, contract: { ...valid.contract, hierarchy: [] }, measurements: valid.measurements.filter((item) => item.kind !== "relationship") }, false],
    ["second patch cycle continues", { ...valid, repair: { failedCycles: 2, action: "focused_repair", reason: "Try again" } }, false],
    ["proof gap in pass", { ...valid, proofGaps: ["WebKit not checked"] }, false],
  ];
  for (const [name, proof, expected] of cases) {
    const passed = validateSpatialProof(proof).length === 0;
    if (passed !== expected) {
      throw new Error(`spatial proof self-test failed: ${name}: ${validateSpatialProof(proof).join("; ")}`);
    }
  }
  const schemaKinds = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8")).$defs.measurement.properties.kind.enum;
  if (
    schemaKinds.length !== SPATIAL_MEASUREMENT_KINDS.length ||
    schemaKinds.some((kind) => !SPATIAL_MEASUREMENT_KINDS.includes(kind))
  ) {
    throw new Error("spatial measurement kinds drifted between schema and shared contract");
  }

  const evidenceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "spatial-proof-"));
  const hydrated = structuredClone(valid);
  const seen = new WeakSet();
  let index = 0;
  for (const [, item] of evidenceObjects(hydrated)) {
    if (seen.has(item)) continue;
    seen.add(item);
    const bytes = Buffer.from(`spatial-evidence-${index}`);
    const locator = `evidence-${index}.json`;
    fs.writeFileSync(path.join(evidenceRoot, locator), bytes);
    item.locator = locator;
    item.fingerprint = `sha256:${crypto.createHash("sha256").update(bytes).digest("hex")}`;
    index += 1;
  }
  if (verifySpatialEvidenceFiles(hydrated, path.join(evidenceRoot, "proof.json"), evidenceRoot).length > 0) {
    throw new Error("valid spatial evidence failed byte verification");
  }
  fs.writeFileSync(path.join(evidenceRoot, hydrated.measurements[0].evidence.locator), "changed");
  if (!verifySpatialEvidenceFiles(hydrated, path.join(evidenceRoot, "proof.json"), evidenceRoot).some((error) => error.includes("does not match"))) {
    throw new Error("changed spatial evidence was accepted");
  }
  fs.rmSync(evidenceRoot, { recursive: true, force: true });
  console.log("spatial proof validator self-test passed");
}

async function main() {
  const argument = process.argv[2];
  if (argument === "--self-test") return selfTest();
  if (argument === "--example") {
    process.stdout.write(`${JSON.stringify(exampleProof(), null, 2)}\n`);
    return;
  }
  if (!argument) {
    console.error("usage: validate-spatial-proof.mjs <proof.json> | --example | --self-test");
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
    ...validateSpatialProof(proof),
    ...verifySpatialEvidenceFiles(proof, argument),
  ];
  if (errors.length > 0) {
    for (const error of errors) console.error(`ERROR: ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`spatial proof valid: ${argument}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
