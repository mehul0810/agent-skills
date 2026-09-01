#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";
import { pathToFileURL } from "node:url";
import {
  evaluateSpatialExpectation,
  SPATIAL_MEASUREMENT_KINDS,
  SPATIAL_OPERATORS,
  spatialExpectationErrors,
} from "./spatial-proof-contract.mjs";

const OPERATORS = new Set(SPATIAL_OPERATORS);
const KINDS = new Set(SPATIAL_MEASUREMENT_KINDS);

export function evaluateExpected(actual, expected) {
  return evaluateSpatialExpectation(actual, expected);
}

function validateConfig(config) {
  const errors = [];
  if (!config || typeof config !== "object") return ["config must be an object"];
  try {
    const url = new URL(config.url);
    if (!["http:", "https:"].includes(url.protocol)) errors.push("url must be an HTTP(S) URL");
    if (url.username || url.password) errors.push("url must not contain embedded credentials");
  } catch {
    errors.push("url must be an HTTP(S) URL");
  }
  if (!Array.isArray(config.viewports) || config.viewports.length === 0) {
    errors.push("viewports must be a non-empty array");
  }
  if (!Array.isArray(config.checks) || config.checks.length === 0) {
    errors.push("checks must be a non-empty array");
  }
  const viewportIds = new Set();
  for (const [index, viewport] of (config.viewports ?? []).entries()) {
    if (!viewport.id || viewportIds.has(viewport.id)) errors.push(`viewports[${index}].id must be unique`);
    viewportIds.add(viewport.id);
    if (!Number.isInteger(viewport.width) || !Number.isInteger(viewport.height)) {
      errors.push(`viewports[${index}] width and height must be integers`);
    }
  }
  const checkIds = new Set();
  for (const [index, check] of (config.checks ?? []).entries()) {
    if (!check.id || checkIds.has(check.id)) errors.push(`checks[${index}].id must be unique`);
    checkIds.add(check.id);
    if (!KINDS.has(check.kind)) errors.push(`checks[${index}].kind is unsupported`);
    if (!check.selector) errors.push(`checks[${index}].selector is required`);
    if (["edge_alignment", "baseline_alignment", "center_alignment", "relationship"].includes(check.kind) && !check.referenceSelector) {
      errors.push(`checks[${index}].referenceSelector is required for ${check.kind}`);
    }
    if (["edge_alignment", "baseline_alignment", "center_alignment"].includes(check.kind) && !check.expected?.alignmentMode) {
      errors.push(`checks[${index}].expected.alignmentMode is required for ${check.kind}`);
    }
    if (check.kind === "edge_alignment" && !check.expected?.edge) {
      errors.push(`checks[${index}].expected.edge is required for edge_alignment`);
    }
    if (["computed_style", "gap", "inset", "parent_layout", "relationship"].includes(check.kind) && !check.property) {
      errors.push(`checks[${index}].property is required for ${check.kind}`);
    }
    if (!OPERATORS.has(check.expected?.operator)) errors.push(`checks[${index}].expected.operator is invalid`);
    for (const error of spatialExpectationErrors(check.expected)) errors.push(`checks[${index}] ${error}`);
  }
  return errors;
}

async function inspectCheck(page, check) {
  return page.evaluate((input) => {
    const element = document.querySelector(input.selector);
    if (!element) return { error: `selector not found: ${input.selector}` };
    const reference = input.referenceSelector ? document.querySelector(input.referenceSelector) : null;
    if (input.referenceSelector && !reference) {
      return { error: `reference selector not found: ${input.referenceSelector}` };
    }

    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const numericOrText = (value) => {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) && /^-?\d+(?:\.\d+)?(?:px)?$/.test(value.trim()) ? parsed : value;
    };
    const lineCount = () => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const tops = new Set(
        [...range.getClientRects()]
          .filter((item) => item.width > 0 && item.height > 0)
          .map((item) => Math.round(item.top * 10) / 10),
      );
      return tops.size;
    };
    const edgeValue = (box, edge, direction) => {
      if (edge === "logical_start") return direction === "rtl" ? box.right : box.left;
      if (edge === "logical_end") return direction === "rtl" ? box.left : box.right;
      return box[edge];
    };
    const baselineValue = (node) => {
      const probe = document.createElement("span");
      probe.setAttribute("aria-hidden", "true");
      probe.style.cssText = "display:inline-block;width:0;height:0;margin:0;padding:0;border:0;vertical-align:baseline;pointer-events:none";
      node.prepend(probe);
      const baseline = probe.getBoundingClientRect().top;
      probe.remove();
      return baseline;
    };

    if (["computed_style", "gap", "inset"].includes(input.kind)) {
      const unit = ["gap", "inset"].includes(input.kind) ? "px" : "string";
      return { value: numericOrText(style.getPropertyValue(input.property)), unit: input.unit ?? unit };
    }
    if (input.kind === "parent_layout") {
      const parent = element.parentElement;
      if (!parent) return { error: `parent not found for: ${input.selector}` };
      return {
        value: numericOrText(getComputedStyle(parent).getPropertyValue(input.property)),
        unit: input.unit ?? "string",
      };
    }
    if (input.kind === "edge_alignment") {
      const referenceRect = reference.getBoundingClientRect();
      const direction = style.direction || document.dir || "ltr";
      const edge = input.expected.edge;
      return {
        value: Math.abs(edgeValue(rect, edge, direction) - edgeValue(referenceRect, edge, direction)),
        unit: "px",
      };
    }
    if (input.kind === "center_alignment") {
      const referenceRect = reference.getBoundingClientRect();
      const axis = input.axis ?? "x";
      const value = axis === "y"
        ? Math.abs((rect.top + rect.height / 2) - (referenceRect.top + referenceRect.height / 2))
        : Math.abs((rect.left + rect.width / 2) - (referenceRect.left + referenceRect.width / 2));
      return { value, unit: "px" };
    }
    if (input.kind === "baseline_alignment") {
      return {
        value: Math.abs(baselineValue(element) - baselineValue(reference)),
        unit: "px",
        captureMethod: "inline_zero_size_baseline_probe",
      };
    }
    if (input.kind === "relationship") {
      const tighter = numericOrText(style.getPropertyValue(input.property));
      const looser = numericOrText(getComputedStyle(reference).getPropertyValue(input.referenceProperty ?? input.property));
      if (typeof tighter !== "number" || typeof looser !== "number") {
        return { error: `relationship properties must resolve to numeric geometry: ${input.property}` };
      }
      return {
        value: tighter < looser,
        unit: "boolean",
        relationshipValues: { tighter, looser, unit: input.relationshipUnit ?? "px" },
      };
    }
    if (input.kind === "size") {
      return { value: input.axis === "height" ? rect.height : rect.width, unit: "px" };
    }
    if (input.kind === "line_count") return { value: lineCount(), unit: "count" };
    if (input.kind === "wrap") return { value: lineCount() > 1, unit: "boolean" };
    if (input.kind === "overflow") {
      const horizontal = element.scrollWidth > element.clientWidth + 1;
      const vertical = element.scrollHeight > element.clientHeight + 1;
      const value = input.axis === "x" ? horizontal : input.axis === "y" ? vertical : horizontal || vertical;
      return { value, unit: "boolean" };
    }
    return { error: `unsupported check kind: ${input.kind}` };
  }, check);
}

async function capture(config) {
  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    throw new Error("Playwright is unavailable. Run this adapter inside a product project that already provides Playwright, or use its existing browser harness.");
  }
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const viewport of config.viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        ignoreHTTPSErrors: Boolean(config.ignoreHTTPSErrors),
        locale: viewport.locale ?? config.locale ?? "en-US",
        colorScheme: viewport.colorScheme ?? config.colorScheme ?? "light",
      });
      const page = await context.newPage();
      const timeout = config.timeoutMs ?? 15000;
      page.setDefaultTimeout(timeout);
      await page.goto(config.url, { waitUntil: config.waitUntil ?? "networkidle", timeout });
      if (config.readySelector) await page.locator(config.readySelector).waitFor();
      await page.evaluate(() => document.fonts?.ready ?? Promise.resolve());
      for (const check of config.checks) {
        const inspected = await inspectCheck(page, check);
        if (inspected.error) {
          results.push({
            id: `${check.id}-${viewport.id}`,
            checkId: check.id,
            environmentId: viewport.id,
            kind: check.kind,
            result: "blocked",
            reason: inspected.error,
          });
          continue;
        }
        const { relationshipValues, captureMethod, ...actual } = inspected;
        const passed = evaluateExpected(actual.value, check.expected);
        const hasReference = ["edge_alignment", "baseline_alignment", "center_alignment", "relationship"].includes(check.kind);
        results.push({
          id: `${check.id}-${viewport.id}`,
          checkId: check.id,
          environmentId: viewport.id,
          kind: check.kind,
          subject: hasReference ? `${check.selector} -> ${check.referenceSelector}` : check.selector,
          acceptance: check.acceptance !== false,
          expected: check.expected,
          actual,
          ...(relationshipValues ? { relationshipValues } : {}),
          ...(captureMethod ? { captureMethod } : {}),
          result: passed ? "pass" : "fail",
          ...(passed ? {} : { reason: "Measured geometry did not meet the declared expectation." }),
        });
      }
      await context.close();
    }
    return {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      url: config.url,
      browser: await browser.version(),
      status: results.every((item) => item.result === "pass") ? "pass" : "fail",
      results,
    };
  } finally {
    await browser.close();
  }
}

function selfTest() {
  const cases = [
    ["numeric equality within tolerance", 24.5, { operator: "eq", value: 24, tolerance: 1 }, true],
    ["numeric equality outside tolerance", 26, { operator: "eq", value: 24, tolerance: 1 }, false],
    ["range", 48, { operator: "range", min: 44, max: 52 }, true],
    ["maximum", 2, { operator: "lte", value: 2 }, true],
    ["string maximum is invalid", 10, { operator: "lte", value: "2" }, false],
    ["boolean", false, { operator: "eq", value: false }, true],
    ["string", "grid", { operator: "eq", value: "grid" }, true],
  ];
  for (const [name, actual, expected, result] of cases) {
    if (evaluateExpected(actual, expected) !== result) throw new Error(`capture self-test failed: ${name}`);
  }
  const invalid = validateConfig({ url: "not-a-url", viewports: [], checks: [] });
  if (invalid.length !== 3) throw new Error("capture config self-test did not reject invalid input");
  const credentialed = validateConfig({
    url: "https://user:secret@example.com",
    viewports: [{ id: "desktop", width: 1200, height: 800 }],
    checks: [{ id: "layout", kind: "computed_style", selector: "main", property: "display", expected: { operator: "eq", value: "block" } }],
  });
  if (!credentialed.some((error) => error.includes("credentials"))) {
    throw new Error("capture config self-test accepted credentials in URL");
  }
  console.log("spatial measurement capture self-test passed");
}

async function main() {
  if (process.argv[2] === "--self-test") return selfTest();
  const [configPath, outputPath] = process.argv.slice(2);
  if (!configPath || !outputPath) {
    console.error("usage: capture-spatial-measurements.mjs <config.json> <report.json> | --self-test");
    process.exitCode = 2;
    return;
  }
  let config;
  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (error) {
    console.error(`ERROR: cannot read valid JSON from ${configPath}: ${error.message}`);
    process.exitCode = 1;
    return;
  }
  const errors = validateConfig(config);
  if (errors.length > 0) {
    for (const error of errors) console.error(`ERROR: ${error}`);
    process.exitCode = 1;
    return;
  }
  try {
    const report = await capture(config);
    fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log(`spatial measurements written: ${outputPath}`);
    if (report.status !== "pass") process.exitCode = 1;
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
