#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import {
  collectProofEvidence,
  isProofCliEntrypoint,
  verifyProofEvidenceFiles,
} from "./proof-evidence-files.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.resolve(
  SCRIPT_DIR,
  "../../shared/schemas/wordpress-asset-production.schema.json",
);
const LOCATOR = /(?:https?:\/\/|\/|\\|\.(?:png|webp|jpe?g|json|md|txt|svg)$)/i;
let compiledSchema;

function schemaValidator() {
  if (!compiledSchema) {
    const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8"));
    compiledSchema = new Ajv2020({ allErrors: true, strict: true, formats: { "date-time": true } }).compile(schema);
  }
  return compiledSchema;
}

function schemaErrors(receipt) {
  const validate = schemaValidator();
  if (validate(receipt)) return [];
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

export function verifyAssetEvidenceFiles(receipt, receiptPath, evidenceRoot = process.cwd()) {
  return verifyProofEvidenceFiles(receipt, { evidenceRoot, pointer: "receipt" });
}

export function validateAssetProduction(receipt) {
  const errors = schemaErrors(receipt);
  if (errors.length > 0) return errors;

  for (const [pointer, evidence] of collectProofEvidence(receipt, "receipt")) {
    if (!LOCATOR.test(evidence.locator)) {
      errors.push(`${pointer}.locator must be a concrete path or URL`);
    }
  }

  if (receipt.source.kind === "generated" && (!receipt.source.tool || !receipt.source.version)) {
    errors.push("generated assets require source.tool and source.version");
  }
  if (receipt.source.kind === "licensed" && !receipt.source.licenseEvidence) {
    errors.push("licensed assets require source.licenseEvidence");
  }
  if (receipt.brief.textPolicy === "intentional_verified" && !receipt.brief.textEvidence) {
    errors.push("intentional embedded text requires brief.textEvidence");
  }

  const cropIds = receipt.brief.cropTargets.map((crop) => crop.id);
  for (const duplicate of duplicateValues(cropIds)) {
    errors.push(`brief.cropTargets contain duplicate id: ${duplicate}`);
  }
  const candidateIds = receipt.candidates.map((candidate) => candidate.id);
  for (const duplicate of duplicateValues(candidateIds)) {
    errors.push(`candidates contain duplicate id: ${duplicate}`);
  }
  const selected = receipt.candidates.filter((candidate) => candidate.result === "selected");
  if (selected.length !== 1 || selected[0]?.id !== receipt.selectedCandidateId) {
    errors.push("selectedCandidateId must identify the one selected candidate");
  }
  for (const [index, candidate] of receipt.candidates.entries()) {
    if (candidate.result === "rejected" && !candidate.reason) {
      errors.push(`candidates[${index}].reason is required for rejected candidate`);
    }
  }
  if (receipt.source.kind === "generated" && receipt.candidates.length < 2) {
    errors.push("generated assets require at least two scored candidates");
  }
  if (
    receipt.status === "pass" &&
    selected[0] &&
    Object.values(selected[0].scores).some((score) => score < 4)
  ) {
    errors.push("selected candidate must score at least 4 in every rubric dimension for pass");
  }

  const deliverableIds = receipt.deliverables.map((deliverable) => deliverable.id);
  for (const duplicate of duplicateValues(deliverableIds)) {
    errors.push(`deliverables contain duplicate id: ${duplicate}`);
  }
  for (const [index, deliverable] of receipt.deliverables.entries()) {
    const crop = receipt.brief.cropTargets.find((target) => target.id === deliverable.cropTargetId);
    if (!crop) {
      errors.push(`deliverables[${index}].cropTargetId is not defined`);
      continue;
    }
    if (deliverable.width < crop.minWidth || deliverable.height < crop.minHeight) {
      errors.push(`deliverables[${index}] does not meet crop target dimensions`);
    }
    const [ratioWidth, ratioHeight] = crop.aspectRatio.split(":").map(Number);
    const expectedRatio = ratioWidth / ratioHeight;
    const actualRatio = deliverable.width / deliverable.height;
    if (Math.abs(actualRatio - expectedRatio) / expectedRatio > 0.01) {
      errors.push(`deliverables[${index}] does not match crop target aspect ratio`);
    }
    if (deliverable.fingerprint !== deliverable.evidence.fingerprint) {
      errors.push(`deliverables[${index}] fingerprint must match its evidence artifact`);
    }
    if (deliverable.result === "pass" && deliverable.issues.length > 0) {
      errors.push(`deliverables[${index}] pass cannot contain issues`);
    }
  }

  if (receipt.optimization.metadataPolicy === "preserved_with_reason" && !receipt.optimization.metadataReason) {
    errors.push("preserved metadata requires optimization.metadataReason");
  }
  if (!Number.isFinite(Date.parse(receipt.provenance.createdAt))) {
    errors.push("provenance.createdAt must be a valid date-time");
  }

  if (receipt.status === "pass") {
    if (receipt.proofGaps.length > 0) errors.push("pass cannot contain proof gaps");
    if (receipt.approval.status !== "approved" || !receipt.approval.reviewer || !receipt.approval.evidence) {
      errors.push("pass requires identified approval evidence");
    }
    if (!receipt.optimization.responsiveVariants) {
      errors.push("pass requires responsive asset variants");
    }
    for (const crop of receipt.brief.cropTargets) {
      const matching = receipt.deliverables.filter((deliverable) => deliverable.cropTargetId === crop.id);
      if (matching.length !== 1 || matching[0].result !== "pass") {
        errors.push(`crop target ${crop.id} requires exactly one passing deliverable`);
      }
    }
    if (receipt.deliverables.some((deliverable) => deliverable.result !== "pass")) {
      errors.push("pass cannot contain failed or blocked deliverables");
    }
  }
  if (receipt.status === "blocked" && receipt.proofGaps.length === 0) {
    errors.push("blocked receipt requires at least one proof gap");
  }

  return [...new Set(errors)];
}

function exampleReceipt() {
  const fingerprint = (character) => `sha256:${character.repeat(64)}`;
  const evidence = (kind, locator, character) => ({ kind, locator, fingerprint: fingerprint(character) });
  const imageEvidence = evidence("image", "artifacts/assets/hero-selected.webp", "a");
  const wideEvidence = evidence("image", "artifacts/assets/hero-wide.webp", "f");
  const squareEvidence = evidence("image", "artifacts/assets/hero-square.webp", "1");
  const reportEvidence = evidence("report", "artifacts/assets/hero-report.json", "b");
  return {
    schemaVersion: 1,
    assetId: "hero-artwork",
    status: "pass",
    purpose: "Homepage hero artwork",
    brief: {
      subject: "Abstract governed publishing workflow",
      artDirection: "Restrained editorial geometry with operational clarity",
      palette: ["ink", "paper", "brand-green"],
      composition: "Subject weighted right with safe text space on the left",
      negativeConstraints: ["no fake UI", "no embedded text", "no logo reconstruction"],
      textPolicy: "text_free",
      cropTargets: [
        { id: "wide", aspectRatio: "16:9", minWidth: 1600, minHeight: 900, focalSafety: "Keep subject inside right 55 percent" },
        { id: "square", aspectRatio: "1:1", minWidth: 1000, minHeight: 1000, focalSafety: "Keep complete subject in center 70 percent" },
      ],
      evidence: evidence("brief", "artifacts/assets/hero-brief.md", "c"),
    },
    source: {
      kind: "generated",
      tool: "imagegen",
      version: "runtime-2026-08",
      evidence: evidence("manifest", "artifacts/assets/hero-generation.json", "d"),
    },
    candidates: [
      {
        id: "candidate-a",
        evidence: imageEvidence,
        scores: { subjectAccuracy: 5, brandFit: 5, composition: 5, artifactQuality: 5, accessibility: 4, familyConsistency: 5 },
        result: "selected",
      },
      {
        id: "candidate-b",
        evidence: evidence("image", "artifacts/assets/hero-rejected.webp", "e"),
        scores: { subjectAccuracy: 3, brandFit: 3, composition: 2, artifactQuality: 4, accessibility: 3, familyConsistency: 3 },
        result: "rejected",
        reason: "Insufficient safe text space and inconsistent visual language.",
      },
    ],
    selectedCandidateId: "candidate-a",
    deliverables: [
      { id: "hero-wide", cropTargetId: "wide", format: "webp", width: 1600, height: 900, fingerprint: fingerprint("f"), evidence: wideEvidence, result: "pass", issues: [] },
      { id: "hero-square", cropTargetId: "square", format: "webp", width: 1000, height: 1000, fingerprint: fingerprint("1"), evidence: squareEvidence, result: "pass", issues: [] },
    ],
    provenance: {
      createdBy: "Codex image generation workflow",
      createdAt: "2026-08-10T00:00:00.000Z",
      rights: "Generated for the project; owner approval recorded separately.",
      evidence: evidence("manifest", "artifacts/assets/hero-provenance.json", "2"),
    },
    approval: {
      status: "approved",
      reviewer: "accountable design reviewer",
      evidence: evidence("approval", "artifacts/assets/hero-approval.md", "3"),
    },
    optimization: {
      responsiveVariants: true,
      metadataPolicy: "stripped",
      performanceEvidence: reportEvidence,
    },
    proofGaps: [],
  };
}

function selfTest() {
  const valid = exampleReceipt();
  const cases = [
    ["valid receipt", valid, true],
    ["vague evidence", { ...valid, approval: { ...valid.approval, evidence: { ...valid.approval.evidence, locator: "approved" } } }, false],
    ["pending approval", { ...valid, approval: { status: "pending" } }, false],
    ["missing generated tool", { ...valid, source: { kind: "generated", evidence: valid.source.evidence } }, false],
    ["wrong selected id", { ...valid, selectedCandidateId: "candidate-b" }, false],
    ["generated without alternatives", { ...valid, candidates: valid.candidates.slice(0, 1) }, false],
    ["weak selected candidate", { ...valid, candidates: valid.candidates.map((candidate) => candidate.id === "candidate-a" ? { ...candidate, scores: { ...candidate.scores, composition: 3 } } : candidate) }, false],
    ["rejected without reason", { ...valid, candidates: valid.candidates.map((candidate) => candidate.id === "candidate-b" ? { ...candidate, reason: undefined } : candidate) }, false],
    ["missing crop deliverable", { ...valid, deliverables: valid.deliverables.slice(0, 1) }, false],
    ["undersized crop", { ...valid, deliverables: [{ ...valid.deliverables[0], width: 800 }, valid.deliverables[1]] }, false],
    ["wrong crop ratio", { ...valid, deliverables: [{ ...valid.deliverables[0], width: 1600, height: 1000 }, valid.deliverables[1]] }, false],
    ["deliverable fingerprint mismatch", { ...valid, deliverables: [{ ...valid.deliverables[0], fingerprint: `sha256:${"9".repeat(64)}` }, valid.deliverables[1]] }, false],
    ["failed deliverable", { ...valid, deliverables: [{ ...valid.deliverables[0], result: "fail", issues: ["artifact"] }, valid.deliverables[1]] }, false],
    ["intentional text without proof", { ...valid, brief: { ...valid.brief, textPolicy: "intentional_verified" } }, false],
    ["licensed without license proof", { ...valid, source: { kind: "licensed", evidence: valid.source.evidence } }, false],
    ["blocked without gap", { ...valid, status: "blocked" }, false],
  ];
  for (const [name, receipt, expected] of cases) {
    const normalized = JSON.parse(JSON.stringify(receipt));
    const passed = validateAssetProduction(normalized).length === 0;
    if (passed !== expected) {
      throw new Error(`asset production self-test failed: ${name}: ${validateAssetProduction(normalized).join("; ")}`);
    }
  }

  const evidenceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "asset-proof-"));
  const hydrated = structuredClone(valid);
  const seen = new WeakSet();
  let index = 0;
  for (const [, evidence] of collectProofEvidence(hydrated, "receipt")) {
    if (seen.has(evidence)) continue;
    seen.add(evidence);
    const bytes = Buffer.from(`asset-evidence-${index}`);
    const locator = `evidence-${index}.json`;
    fs.writeFileSync(path.join(evidenceRoot, locator), bytes);
    evidence.locator = locator;
    evidence.fingerprint = `sha256:${crypto.createHash("sha256").update(bytes).digest("hex")}`;
    index += 1;
  }
  for (const deliverable of hydrated.deliverables) {
    deliverable.fingerprint = deliverable.evidence.fingerprint;
  }
  if (verifyAssetEvidenceFiles(hydrated, path.join(evidenceRoot, "receipt.json"), evidenceRoot).length > 0) {
    throw new Error("valid local asset evidence failed byte verification");
  }
  fs.writeFileSync(path.join(evidenceRoot, hydrated.deliverables[0].evidence.locator), "changed");
  if (!verifyAssetEvidenceFiles(hydrated, path.join(evidenceRoot, "receipt.json"), evidenceRoot).some((error) => error.includes("does not match"))) {
    throw new Error("changed local asset evidence was accepted");
  }
  fs.rmSync(evidenceRoot, { recursive: true, force: true });
  console.log("asset production validator self-test passed");
}

async function main() {
  const argument = process.argv[2];
  if (argument === "--self-test") return selfTest();
  if (argument === "--example") {
    process.stdout.write(`${JSON.stringify(exampleReceipt(), null, 2)}\n`);
    return;
  }
  if (!argument) {
    console.error("usage: validate-asset-production.mjs <receipt.json> | --example | --self-test");
    process.exitCode = 2;
    return;
  }
  let receipt;
  try {
    receipt = JSON.parse(fs.readFileSync(argument, "utf8"));
  } catch (error) {
    console.error(`ERROR: cannot read valid JSON from ${argument}: ${error.message}`);
    process.exitCode = 1;
    return;
  }
  const errors = [
    ...validateAssetProduction(receipt),
    ...verifyAssetEvidenceFiles(receipt, argument),
  ];
  if (errors.length > 0) {
    for (const error of errors) console.error(`ERROR: ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`asset production receipt valid: ${argument}`);
}

if (isProofCliEntrypoint(import.meta.url)) await main();
