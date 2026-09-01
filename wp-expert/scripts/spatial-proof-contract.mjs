export const SPATIAL_OPERATORS = Object.freeze(["eq", "lte", "gte", "range"]);

export const SPATIAL_MEASUREMENT_KINDS = Object.freeze([
  "computed_style",
  "gap",
  "inset",
  "edge_alignment",
  "baseline_alignment",
  "center_alignment",
  "size",
  "line_count",
  "overflow",
  "wrap",
  "relationship",
  "parent_layout",
]);

export const SPATIAL_TOKEN_KINDS = new Set(["gap", "inset", "size"]);
export const SPATIAL_ALIGNMENT_KINDS = new Set([
  "edge_alignment",
  "baseline_alignment",
  "center_alignment",
]);

function finiteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

export function spatialExpectationErrors(expected, actual) {
  const errors = [];
  if (!expected || typeof expected !== "object") return ["expectation must be an object"];
  if (!SPATIAL_OPERATORS.includes(expected.operator)) return ["operator is invalid"];

  const tolerance = expected.tolerance ?? 0;
  if (!finiteNumber(tolerance) || tolerance < 0) errors.push("tolerance must be a non-negative finite number");

  if (expected.operator === "range") {
    if (!finiteNumber(expected.min) || !finiteNumber(expected.max)) {
      errors.push("range requires numeric min and max");
    } else if (expected.min > expected.max) {
      errors.push("range min must not exceed max");
    }
    if (actual !== undefined && !finiteNumber(actual)) errors.push("range requires a numeric actual value");
    return errors;
  }

  if (!Object.hasOwn(expected, "value")) return [...errors, `${expected.operator} requires value`];
  if (["lte", "gte"].includes(expected.operator)) {
    if (!finiteNumber(expected.value)) errors.push(`${expected.operator} requires a numeric expected value`);
    if (actual !== undefined && !finiteNumber(actual)) errors.push(`${expected.operator} requires a numeric actual value`);
    return errors;
  }

  if (typeof expected.value === "number" && !finiteNumber(expected.value)) {
    errors.push("numeric equality requires a finite expected value");
  }
  if (tolerance > 0 && !finiteNumber(expected.value)) {
    errors.push("tolerance is valid only for numeric equality");
  }
  if (actual !== undefined) {
    if (typeof actual !== typeof expected.value) errors.push("equality requires matching expected and actual types");
    if (typeof actual === "number" && !finiteNumber(actual)) errors.push("numeric equality requires a finite actual value");
  }
  return errors;
}

export function evaluateSpatialExpectation(actual, expected) {
  if (spatialExpectationErrors(expected, actual).length > 0) return false;
  const tolerance = expected.tolerance ?? 0;
  if (expected.operator === "eq") {
    return typeof actual === "number"
      ? Math.abs(actual - expected.value) <= tolerance
      : actual === expected.value;
  }
  if (expected.operator === "lte") return actual <= expected.value + tolerance;
  if (expected.operator === "gte") return actual >= expected.value - tolerance;
  return actual >= expected.min - tolerance && actual <= expected.max + tolerance;
}
