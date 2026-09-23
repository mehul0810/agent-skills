#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";
import { pathToFileURL } from "node:url";

const USAGE = `Usage: node check-shot-fidelity.mjs <input.json>\n       node check-shot-fidelity.mjs --self-test\n\nChecks source raster pixel coverage against each shot's rendered pixel footprint after crop and enlargement. Crop dimensions are available source pixels; zoom.x/y must be >= 1. For zoom-outs, enter the actual maximum rendered output footprint instead of a zoom factor below 1. This does not assess perceived or generated-video quality.`;
const VECTOR_FORMATS = new Set(["ai", "eps", "pdf", "svg"]);
const LIMITATIONS = [
  "This is a deterministic pixel-coverage check, not a visual or perceived-quality review.",
  "Vector declarations are exempt only with explicit contains_raster:false and a non-empty inspection_evidence pointer; the checker does not independently verify that evidence.",
  "Any embedded raster must be represented as a separate raster shot entry and checked against its own rendered footprint.",
  "Zoom factors represent enlargement only and must be at least 1. For zoom-outs, use the actual maximum rendered output footprint instead.",
  "It does not assess focus, motion blur, compression, interpolation artifacts, color, typography, composition, temporal consistency, or model output quality."
];

function fail(message) {
  throw new Error(message);
}

function positiveFinite(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    fail(`${label} must be a finite number greater than zero`);
  }
  return value;
}

function enlargement(value, label) {
  const factor = positiveFinite(value, label);
  if (factor < 1) fail(`${label} must be at least 1; for zoom-outs, use the actual maximum rendered output footprint`);
  return factor;
}

function identifier(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    fail(`${label} must be a non-empty string`);
  }
  return value;
}

function cropDimensions(source, crop, label) {
  if (!crop || typeof crop !== "object" || Array.isArray(crop)) {
    fail(`${label}.crop must be an object with either fractions or pixels`);
  }
  const hasFractions = Object.hasOwn(crop, "fractions");
  const hasPixels = Object.hasOwn(crop, "pixels");
  if (hasFractions === hasPixels) {
    fail(`${label}.crop must specify exactly one of fractions or pixels`);
  }
  const box = crop[hasFractions ? "fractions" : "pixels"];
  if (!box || typeof box !== "object" || Array.isArray(box)) {
    fail(`${label}.crop.${hasFractions ? "fractions" : "pixels"} must be an object`);
  }
  const width = positiveFinite(box.width, `${label}.crop width`);
  const height = positiveFinite(box.height, `${label}.crop height`);
  if (hasFractions) {
    if (width > 1 || height > 1) fail(`${label}.crop fractions width and height must not exceed 1`);
    if (box.x !== undefined && (typeof box.x !== "number" || !Number.isFinite(box.x) || box.x < 0 || box.x + width > 1)) {
      fail(`${label}.crop fraction x must be finite, non-negative, and fit within source bounds`);
    }
    if (box.y !== undefined && (typeof box.y !== "number" || !Number.isFinite(box.y) || box.y < 0 || box.y + height > 1)) {
      fail(`${label}.crop fraction y must be finite, non-negative, and fit within source bounds`);
    }
    return { width: source.width * width, height: source.height * height };
  }
  if (box.x !== undefined && (typeof box.x !== "number" || !Number.isFinite(box.x) || box.x < 0 || box.x + width > source.width)) {
    fail(`${label}.crop pixel x must be finite, non-negative, and fit within source bounds`);
  }
  if (box.y !== undefined && (typeof box.y !== "number" || !Number.isFinite(box.y) || box.y < 0 || box.y + height > source.height)) {
    fail(`${label}.crop pixel y must be finite, non-negative, and fit within source bounds`);
  }
  if (width > source.width || height > source.height) fail(`${label}.crop pixel dimensions must fit within source dimensions`);
  return { width, height };
}

export function checkDocument(document) {
  if (!document || typeof document !== "object" || Array.isArray(document)) fail("input must be a JSON object");
  if (!Array.isArray(document.shots) || document.shots.length === 0) fail("shots must be a non-empty array");

  const seenShots = new Set();
  const results = document.shots.map((shot, index) => {
    const label = `shots[${index}]`;
    if (!shot || typeof shot !== "object" || Array.isArray(shot)) fail(`${label} must be an object`);
    const shotId = identifier(shot.shot_id, `${label}.shot_id`);
    const assetId = identifier(shot.asset_id, `${label}.asset_id`);
    if (seenShots.has(shotId)) fail(`duplicate shot_id: ${shotId}`);
    seenShots.add(shotId);
    const output = shot.output_footprint;
    if (!output || typeof output !== "object" || Array.isArray(output)) fail(`${label}.output_footprint must be an object`);
    const outputWidth = positiveFinite(output.width_px, `${label}.output_footprint.width_px`);
    const outputHeight = positiveFinite(output.height_px, `${label}.output_footprint.height_px`);
    const zoom = shot.zoom;
    if (!zoom || typeof zoom !== "object" || Array.isArray(zoom)) fail(`${label}.zoom must be an object`);
    const zoomX = enlargement(zoom.x, `${label}.zoom.x`);
    const zoomY = zoom.y === undefined ? zoomX : enlargement(zoom.y, `${label}.zoom.y`);

    const source = shot.source;
    if (!source || typeof source !== "object" || Array.isArray(source)) fail(`${label}.source must be an object`);
    if (source.type === "vector") {
      if (typeof source.format !== "string" || !VECTOR_FORMATS.has(source.format.toLowerCase())) {
        fail(`${label}.source.format must be one of ${[...VECTOR_FORMATS].join(", ")} for a vector declaration`);
      }
      if (shot.crop !== undefined) fail(`${label}.crop is not accepted for vector sources`);
      const inspected = source.contains_raster === false &&
        typeof source.inspection_evidence === "string" && source.inspection_evidence.trim() !== "";
      return {
        shot_id: shotId,
        asset_id: assetId,
        source_type: "vector",
        source_format: source.format.toLowerCase(),
        contains_raster: source.contains_raster ?? null,
        inspection_evidence: source.inspection_evidence ?? null,
        output_footprint_px: { width: outputWidth, height: outputHeight },
        zoom: { x: zoomX, y: zoomY },
        result: inspected ? "exempt_vector_attested" : "needs_source_inspection",
        metric: "not_applicable"
      };
    }
    if (source.type !== "raster") fail(`${label}.source.type must be raster or vector`);
    const sourceWidth = positiveFinite(source.width_px, `${label}.source.width_px`);
    const sourceHeight = positiveFinite(source.height_px, `${label}.source.height_px`);
    const crop = cropDimensions({ width: sourceWidth, height: sourceHeight }, shot.crop, label);
    const effectiveWidth = crop.width / zoomX;
    const effectiveHeight = crop.height / zoomY;
    positiveFinite(effectiveWidth, `${label}.effective_source_footprint_px.width`);
    positiveFinite(effectiveHeight, `${label}.effective_source_footprint_px.height`);
    const passes = effectiveWidth >= outputWidth && effectiveHeight >= outputHeight;
    return {
      shot_id: shotId,
      asset_id: assetId,
      source_type: "raster",
      source_dimensions_px: { width: sourceWidth, height: sourceHeight },
      crop_dimensions_px: { width: crop.width, height: crop.height },
      output_footprint_px: { width: outputWidth, height: outputHeight },
      zoom: { x: zoomX, y: zoomY },
      effective_source_footprint_px: { width: effectiveWidth, height: effectiveHeight },
      result: passes ? "coverage_pass" : "coverage_fail",
      metric: "source_pixel_coverage_only"
    };
  });

  return {
    schema_version: 1,
    check: "raster_source_pixel_coverage",
    overall_result: results.some((item) => item.result === "coverage_fail")
      ? "coverage_fail"
      : results.some((item) => item.result === "needs_source_inspection")
        ? "needs_source_inspection"
        : "coverage_pass_or_vector_exempt",
    shots: results,
    limitations: LIMITATIONS
  };
}

function expectThrows(callback, fragment) {
  let error;
  try { callback(); } catch (caught) { error = caught; }
  if (!error || !error.message.includes(fragment)) fail(`self-test expected error containing: ${fragment}`);
}

export function selfTest() {
  const base = {
    shots: [{
      shot_id: "shot-clean",
      asset_id: "asset-master",
      source: { type: "raster", width_px: 7680, height_px: 4320 },
      crop: { fractions: { x: 0.25, y: 0.25, width: 0.5, height: 0.5 } },
      output_footprint: { width_px: 1920, height_px: 1080 },
      zoom: { x: 2 }
    }]
  };
  const clean = checkDocument(base);
  if (clean.shots[0].result !== "coverage_pass") fail("self-test clean control should pass at the exact boundary");
  const failing = structuredClone(base);
  failing.shots[0].zoom.x = 2.01;
  if (checkDocument(failing).shots[0].result !== "coverage_fail") fail("self-test zoomed crop should fail coverage");
  expectThrows(() => checkDocument({ shots: [{ ...base.shots[0], source: { type: "raster", width_px: Infinity, height_px: 4320 } }] }), "finite number");
  expectThrows(() => checkDocument({ shots: [{ ...base.shots[0], crop: { fractions: { width: 1.1, height: 0.5 } } }] }), "must not exceed 1");
  const vectorShot = { shot_id: "shot-vector", asset_id: "asset-logo", source: { type: "vector", format: "svg", contains_raster: false, inspection_evidence: "review://asset-logo/source-inspection" }, output_footprint: { width_px: 3840, height_px: 2160 }, zoom: { x: 5 } };
  const vector = checkDocument({ shots: [vectorShot] });
  if (vector.shots[0].result !== "exempt_vector_attested") fail("self-test declared vector should be explicitly exempt");
  const uninspectedVector = checkDocument({ shots: [{ ...vectorShot, source: { type: "vector", format: "svg" } }] });
  if (uninspectedVector.overall_result !== "needs_source_inspection") fail("self-test unverified vector must require source inspection");
  const rasterBearingVector = checkDocument({ shots: [{ ...vectorShot, source: { ...vectorShot.source, contains_raster: true } }] });
  if (rasterBearingVector.overall_result !== "needs_source_inspection") fail("self-test raster-bearing vector must not be exempt");
  expectThrows(() => checkDocument({ shots: [{ shot_id: "bad-vector", asset_id: "asset-logo", source: { type: "vector", format: "png" }, output_footprint: { width_px: 1, height_px: 1 }, zoom: { x: 1 } }] }), "source.format");
  expectThrows(() => checkDocument({ shots: [{ ...base.shots[0], crop: undefined }] }), "crop must be an object");
  expectThrows(() => checkDocument({ shots: [{ ...base.shots[0], source: undefined }] }), "source must be an object");
  expectThrows(() => checkDocument({ shots: [base.shots[0], { ...base.shots[0], asset_id: "asset-duplicate" }] }), "duplicate shot_id");
  expectThrows(() => checkDocument({ shots: [{ ...base.shots[0], source: { type: "raster", width_px: Number.MIN_VALUE, height_px: 4320 }, crop: { fractions: { width: 1, height: 1 } }, zoom: { x: Number.MAX_VALUE, y: Number.MAX_VALUE } }] }), "effective_source_footprint_px.width");
  expectThrows(() => checkDocument({ shots: [{ shot_id: "shot-zoom-out", asset_id: "asset-small-crop", source: { type: "raster", width_px: 100, height_px: 100 }, crop: { pixels: { width: 10, height: 10 } }, output_footprint: { width_px: 100, height_px: 100 }, zoom: { x: 0.1 } }] }), "zoom.x must be at least 1");
  return "self-test passed (coverage boundary, zoom/crop failure, invalid/derived values, duplicate IDs, vector inspection gate)";
}

function main(argv) {
  if (argv.length === 1 && argv[0] === "--self-test") {
    process.stdout.write(`${selfTest()}\n`);
    return;
  }
  if (argv.length !== 1 || argv[0].startsWith("-")) fail(USAGE);
  let input;
  try { input = JSON.parse(fs.readFileSync(argv[0], "utf8")); }
  catch (error) { fail(`cannot read/parse JSON input: ${error.message}`); }
  const result = checkDocument(input);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.overall_result !== "coverage_pass_or_vector_exempt") process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { main(process.argv.slice(2)); }
  catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 2;
  }
}
