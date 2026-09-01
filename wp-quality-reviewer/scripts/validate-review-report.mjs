#!/usr/bin/env node

import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { validateAccessibilityAudit } from './accessibility-audit.mjs';

const MODES = new Set(['security', 'performance', 'modularity', 'accessibility', 'multi']);
const AREAS = ['security', 'performance', 'modularity', 'accessibility'];
const AREA_SET = new Set(AREAS);
const DISPOSITIONS = new Set(['pass', 'fail', 'partial', 'not_applicable']);
const SEVERITIES = new Set(['P0', 'P1', 'P2', 'P3']);
const STATUSES = new Set(['open', 'fixed', 'accepted']);
const CONCLUSIONS = new Set(['pass', 'fail', 'partial', 'blocked']);
const RISK_FLAGS = new Set([
	'release_critical',
	'migration',
	'public_contract',
	'authorization_boundary',
	'resource_abuse',
	'legacy_debt',
]);
const ASSURANCE_RISKS = new Set(['high_traffic', 'sensitive_data', 'custom_storage', 'migration', 'public_api', 'async_queue', 'external_webhook', 'multi_tenant', 'legacy_debt']);
const EVIDENCE_KINDS = new Set(['code', 'git', 'github', 'runtime', 'test', 'browser', 'profile', 'dependency', 'document', 'package', 'public', 'owner']);
const VALIDATION_KINDS = new Set(['static', 'test', 'runtime', 'browser', 'manual', 'profile', 'package']);
const VALIDATION_RESULTS = new Set(['pass', 'fail', 'blocked']);
const ENVIRONMENT_KINDS = new Set(['runtime', 'browser', 'manual', 'profile']);
const REVISION = /^[a-f0-9]{40}$/;
const SHA256 = /^[a-f0-9]{64}$/;
const REPOSITORY = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const LOCATOR = /(?:https?:\/\/|[\/:#@]|^[a-f0-9]{40}$)/i;
const VAGUE = /^(?:all|everything|it|tests?|validation|checks?)\s+(?:good|ok|pass(?:ed)?|work(?:s|ed)?)\.?$/i;
const UNVERIFIABLE = /\b(?:trust me|assum(?:e|ed)|no evidence|looks good|seems fine|probably works)\b/i;
const PLACEHOLDER_PROOF = /\b(?:todo|placeholder|not run|not executed|pending|stub|dummy|fake)\b/i;
const INTERNAL_CONTRACT = /\b(?:internal|private|helper|implementation detail|unit test)\b/i;
const GENERIC_SECURITY_CASE = /^(?:(?:security|generic|negative|access|test|actor|input|resource|case|boundary)\s*)+$/i;
const GENERIC_BROWSER = /^(?:(?:generic|test|desktop|mobile)\s+)?(?:web\s+)?browser(?:\s+[\d.]+)?$/i;
const GENERIC_ASSISTIVE_TECHNOLOGY = /^(?:(?:generic|test)\s+)?(?:screen\s+reader|assistive\s+technology|at|reader)(?:\s+[\d.]+)?$/i;

const KEYS = {
	top: new Set(['schemaVersion', 'mode', 'targetIdentity', 'scope', 'qualityTarget', 'assuranceProfile', 'accessibilityClaim', 'accessibilityAudit', 'domains', 'findings', 'proofGaps', 'conclusion']),
	target: new Set(['kind', 'repository', 'commitSha', 'baseCommitSha', 'artifact']),
	artifact: new Set(['path', 'sha256']),
	scope: new Set(['targets', 'exclusions']),
	domain: new Set(['disposition', 'evidence', 'validation', 'reason', 'authorizationMatrix', 'resourceBudget', 'capacityEnvelope']),
	finding: new Set(['id', 'area', 'severity', 'status', 'riskFlags', 'evidence', 'impact', 'remediation', 'validation', 'performanceMeasurement', 'authorizationMatrix', 'resourceBudget', 'negativeTests', 'behaviorChecks', 'contractChecks', 'migrationPlan', 'modularityRatchet', 'manualChecks', 'aaaAdvisoryCriteria', 'independentReview', 'riskAcceptance']),
	evidence: new Set(['kind', 'pointer', 'observation', 'environment', 'identity']),
	validation: new Set(['kind', 'check', 'expected', 'observed', 'expectedState', 'observedState', 'result', 'environment', 'artifact', 'artifactSha256', 'identity', 'claim', 'browser', 'assistiveTechnology', 'performanceMeasurement', 'securityCases', 'contractCases', 'performanceChecks']),
	measurement: new Set([
		'metric',
		'unit',
		'direction',
		'before',
		'after',
		'budget',
		'conditions',
		'sampleSize',
		'distribution',
		'variance',
		'errorRate',
		'cacheState',
		'fieldOrLab',
		'runCount',
		'provenance',
		'limitations',
		'baselineConditions',
		'candidateConditions',
	]),
	conditions: new Set(['runtime', 'dataset', 'cacheState', 'concurrency']),
	distribution: new Set(['p50', 'p75', 'p95', 'p99']),
	securityCase: new Set(['actorClass', 'actor', 'input', 'resource', 'boundary', 'expected', 'observed', 'result']),
	contractCase: new Set(['surface', 'entryPoint', 'consumer', 'contract', 'before', 'after', 'result']),
	performanceCheck: new Set(['kind', 'expected', 'observed', 'result']),
	authorizationMatrix: new Set(['actor', 'action', 'resource', 'expected', 'observed', 'evidence']),
	resourceBudget: new Set(['scope', 'limits', 'failureBehavior', 'evidence']),
	resourceLimit: new Set(['name', 'value', 'unit']),
	capacityEnvelope: new Set(['workload', 'headroomPercent', 'saturation', 'fairness', 'queue', 'storage', 'failureBehavior', 'evidence']),
	capacityWorkload: new Set(['description', 'concurrency', 'dataVolume', 'durationSeconds']),
	capacitySaturation: new Set(['metric', 'observed', 'budget', 'direction']),
	capacityFairness: new Set(['scope', 'limit', 'unit']),
	capacityQueue: new Set(['arrivalRate', 'serviceRate', 'maxBacklog', 'observedBacklog', 'drainSeconds', 'drainBudgetSeconds']),
	capacityStorage: new Set(['currentBytes', 'projectedBytes', 'restoreSeconds', 'restoreBudgetSeconds']),
	independentReview: new Set(['kind', 'runId', 'reviewedCommitSha', 'result', 'evidence']),
	assuranceProfile: new Set(['level', 'risks']),
	migrationPlan: new Set(['strategy', 'expandCheck', 'backfillCheck', 'idempotencyCheck', 'rollbackCheck', 'contractStatus', 'cleanupIssue', 'ownerApproval']),
	modularityRatchet: new Set(['metric', 'baseline', 'after', 'budget', 'posture', 'owner', 'issue', 'rationale']),
};

function isObject(value) {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function nonEmpty(value) {
	return typeof value === 'string' && value.trim() !== '';
}

function meaningfulText(value, minimumLength = 12, minimumWords = 3) {
	if (!nonEmpty(value)) return false;
	const normalized = value.trim().replace(/[.!?]+$/, '');
	return normalized.length >= minimumLength
		&& normalized.split(/\s+/).length >= minimumWords
		&& !VAGUE.test(value.trim())
		&& !UNVERIFIABLE.test(value.trim());
}

function checkKeys(value, allowed, prefix, errors) {
	if (!isObject(value)) return;
	for (const key of Object.keys(value)) {
		if (!allowed.has(key)) errors.push(`${prefix}.${key} is not allowed`);
	}
}

function validateIdentityValues(value, prefix, errors) {
	if (!isObject(value) || Object.keys(value).length === 0) {
		errors.push(`${prefix} must be a non-empty object`);
		return;
	}
	checkKeys(value, new Set(['commitSha', 'artifactSha256']), prefix, errors);
	if (!REVISION.test(value.commitSha ?? '')) errors.push(`${prefix}.commitSha must be a 40-character commit SHA`);
	if (value.artifactSha256 !== undefined && !SHA256.test(value.artifactSha256)) errors.push(`${prefix}.artifactSha256 must be a 64-character digest`);
}

function validateEvidenceReceipt(receipt, prefix, errors) {
	if (!isObject(receipt)) {
		errors.push(`${prefix} must be a structured evidence receipt`);
		return;
	}
	checkKeys(receipt, KEYS.evidence, prefix, errors);
	if (!EVIDENCE_KINDS.has(receipt.kind)) errors.push(`${prefix}.kind is invalid`);
	if (!nonEmpty(receipt.pointer) || receipt.pointer.length < 5 || !LOCATOR.test(receipt.pointer)) {
		errors.push(`${prefix}.pointer must be a concrete path, URL, commit, or artifact locator`);
	}
	if (!meaningfulText(receipt.observation)) errors.push(`${prefix}.observation must state a concrete observed fact`);
	if (['runtime', 'browser', 'profile'].includes(receipt.kind) && !meaningfulText(receipt.environment, 8, 2)) {
		errors.push(`${prefix}.environment is required for ${receipt.kind} evidence`);
	}
	if (receipt.identity !== undefined) validateIdentityValues(receipt.identity, `${prefix}.identity`, errors);
	if (receipt.kind === 'package' && receipt.identity === undefined) {
		errors.push(`${prefix}.identity is required for package evidence`);
	}
}

function validateSecurityCases(cases, prefix, errors) {
	if (!Array.isArray(cases) || cases.length === 0) {
		errors.push(`${prefix} requires at least one boundary-specific negative case`);
		return;
	}
	for (const [index, check] of cases.entries()) {
		const checkPrefix = `${prefix}[${index}]`;
		if (!isObject(check)) {
			errors.push(`${checkPrefix} must be an object`);
			continue;
		}
		checkKeys(check, KEYS.securityCase, checkPrefix, errors);
		if (!['anonymous', 'low_privilege', 'wrong_object', 'external_service', 'malformed_input'].includes(check.actorClass)) errors.push(`${checkPrefix}.actorClass is invalid`);
		for (const key of ['actor', 'input', 'resource']) {
			if (!meaningfulText(check[key], 6, 2)) errors.push(`${checkPrefix}.${key} must identify the tested trust-boundary input`);
			if (GENERIC_SECURITY_CASE.test(check[key]?.trim() ?? '')) errors.push(`${checkPrefix}.${key} cannot be a generic security label`);
		}
		if (!['authentication', 'capability', 'nonce', 'ownership', 'validation', 'escaping', 'rate_limit', 'secret_boundary', 'tenant_isolation'].includes(check.boundary)) errors.push(`${checkPrefix}.boundary is invalid`);
		if (!['deny', 'reject', 'sanitize'].includes(check.expected)) errors.push(`${checkPrefix}.expected is invalid`);
		if (!['deny', 'reject', 'sanitize'].includes(check.observed)) errors.push(`${checkPrefix}.observed is invalid`);
		if (check.expected !== check.observed) errors.push(`${checkPrefix} observed result does not match expected result`);
		if (check.result !== 'pass') errors.push(`${checkPrefix}.result must pass`);
	}
}

function validateContractCases(cases, prefix, errors) {
	if (!Array.isArray(cases) || cases.length === 0) {
		errors.push(`${prefix} requires at least one externally observable contract case`);
		return;
	}
	for (const [index, check] of cases.entries()) {
		const checkPrefix = `${prefix}[${index}]`;
		if (!isObject(check)) {
			errors.push(`${checkPrefix} must be an object`);
			continue;
		}
		checkKeys(check, KEYS.contractCase, checkPrefix, errors);
		if (!['public_hook', 'rest_route', 'block_markup', 'cli_command', 'stored_data', 'user_journey'].includes(check.surface)) errors.push(`${checkPrefix}.surface must be an externally observable contract`);
		if (!nonEmpty(check.entryPoint) || !LOCATOR.test(check.entryPoint) || INTERNAL_CONTRACT.test(check.entryPoint)) errors.push(`${checkPrefix}.entryPoint must locate a public boundary`);
		const entryPointPatterns = {
			public_hook: /^(?:hook:|action:|filter:)[A-Za-z0-9_.:\/-]+$/,
			rest_route: /^(?:\/wp-json\/|rest:)[A-Za-z0-9_.:\/?=&-]+$/,
			block_markup: /^(?:block:|<!--\s*wp:)[\s\S]+$/,
			cli_command: /^wp\s+[A-Za-z0-9_.:\/-]+/,
			stored_data: /^(?:option:|meta:|table:|schema:)[A-Za-z0-9_.:\/-]+$/,
			user_journey: /^(?:https?:\/\/|\/wp-admin\/|\/wp-json\/|frontend:)[\s\S]+$/,
		};
		if (entryPointPatterns[check.surface] && !entryPointPatterns[check.surface].test(check.entryPoint ?? '')) errors.push(`${checkPrefix}.entryPoint does not match ${check.surface}`);
		if (!['visitor', 'administrator', 'editor', 'integrator', 'cli_user'].includes(check.consumer)) errors.push(`${checkPrefix}.consumer must identify an external consumer`);
		for (const key of ['contract', 'before', 'after']) {
			if (!meaningfulText(check[key], 6, 2)) errors.push(`${checkPrefix}.${key} is required`);
			if (INTERNAL_CONTRACT.test(check[key] ?? '')) errors.push(`${checkPrefix}.${key} must describe externally observable behavior`);
		}
		if (!['preserved', 'versioned'].includes(check.result)) errors.push(`${checkPrefix}.result must be preserved or versioned`);
		if (check.result === 'preserved' && check.before !== check.after) errors.push(`${checkPrefix} preserved contract must have identical before and after clauses`);
	}
}

function validatePerformanceChecks(checks, prefix, errors, requiredKinds = []) {
	if (!Array.isArray(checks) || checks.length === 0) {
		errors.push(`${prefix} requires structured performance checks`);
		return;
	}
	const seen = new Set();
	for (const [index, check] of checks.entries()) {
		const checkPrefix = `${prefix}[${index}]`;
		if (!isObject(check)) {
			errors.push(`${checkPrefix} must be an object`);
			continue;
		}
		checkKeys(check, KEYS.performanceCheck, checkPrefix, errors);
		if (!['tail', 'overload', 'recovery', 'cache', 'capacity'].includes(check.kind)) errors.push(`${checkPrefix}.kind is invalid`);
		else seen.add(check.kind);
		if (!meaningfulText(check.expected)) errors.push(`${checkPrefix}.expected is required`);
		if (!meaningfulText(check.observed)) errors.push(`${checkPrefix}.observed is required`);
		if (check.result !== 'pass') errors.push(`${checkPrefix}.result must pass`);
	}
	for (const kind of requiredKinds) {
		if (!seen.has(kind)) errors.push(`${prefix} requires a passing ${kind} check`);
	}
}

function validateValidationReceipt(receipt, prefix, errors) {
	if (!isObject(receipt)) {
		errors.push(`${prefix} must be a structured validation receipt`);
		return;
	}
	checkKeys(receipt, KEYS.validation, prefix, errors);
	if (!VALIDATION_KINDS.has(receipt.kind)) errors.push(`${prefix}.kind is invalid`);
	if (!meaningfulText(receipt.check, 8, 2)) errors.push(`${prefix}.check must identify a command or journey`);
	if (!meaningfulText(receipt.expected)) errors.push(`${prefix}.expected must state the expected result`);
	if (!meaningfulText(receipt.observed)) errors.push(`${prefix}.observed must state the observed result`);
	if (!VALIDATION_RESULTS.has(receipt.result)) errors.push(`${prefix}.result is invalid`);
	if (ENVIRONMENT_KINDS.has(receipt.kind) && !meaningfulText(receipt.environment, 8, 2)) {
		errors.push(`${prefix}.environment is required for ${receipt.kind} validation`);
	}
	if (receipt.artifact !== undefined && (!nonEmpty(receipt.artifact) || !LOCATOR.test(receipt.artifact))) {
		errors.push(`${prefix}.artifact must locate concrete proof when present`);
	}
	if (receipt.artifactSha256 !== undefined && !SHA256.test(receipt.artifactSha256)) errors.push(`${prefix}.artifactSha256 must be a 64-character digest`);
	if (receipt.result === 'pass' && [receipt.check, receipt.expected, receipt.observed, receipt.artifact].some((value) => nonEmpty(value) && PLACEHOLDER_PROOF.test(value))) errors.push(`${prefix} pass cannot rely on placeholder proof`);
	if (receipt.identity !== undefined) validateIdentityValues(receipt.identity, `${prefix}.identity`, errors);
	if (receipt.claim !== undefined && !['security_negative', 'performance_comparable', 'modularity_behavior', 'accessibility_manual', 'accessibility_automated', 'contract_compatibility', 'migration_step'].includes(receipt.claim)) errors.push(`${prefix}.claim is invalid`);
	const states = ['allow', 'deny', 'reject', 'sanitize', 'preserve', 'within_budget', 'accessible', 'success', 'failure', 'blocked'];
	if (receipt.expectedState !== undefined && !states.includes(receipt.expectedState)) errors.push(`${prefix}.expectedState is invalid`);
	if (receipt.observedState !== undefined && !states.includes(receipt.observedState)) errors.push(`${prefix}.observedState is invalid`);
	if (receipt.result === 'pass' && receipt.expectedState !== undefined && receipt.expectedState !== receipt.observedState) errors.push(`${prefix} pass requires observedState to match expectedState`);
	if (receipt.claim === 'security_negative' && !['deny', 'reject', 'sanitize'].includes(receipt.expectedState)) errors.push(`${prefix}.expectedState must be deny, reject, or sanitize for security_negative proof`);
	if (receipt.claim === 'performance_comparable' && receipt.expectedState !== 'within_budget') errors.push(`${prefix}.expectedState must be within_budget for performance_comparable proof`);
	if (['modularity_behavior', 'contract_compatibility'].includes(receipt.claim) && receipt.expectedState !== 'preserve') errors.push(`${prefix}.expectedState must be preserve for contract proof`);
	if (['accessibility_manual', 'accessibility_automated'].includes(receipt.claim) && receipt.expectedState !== 'accessible') errors.push(`${prefix}.expectedState must be accessible for accessibility proof`);
	if (receipt.claim === 'accessibility_automated' && !SHA256.test(receipt.artifactSha256 ?? '')) errors.push(`${prefix}.artifactSha256 is required for automated accessibility proof`);
	if (receipt.browser !== undefined && (!meaningfulText(receipt.browser, 3, 1) || GENERIC_BROWSER.test(receipt.browser.trim()))) errors.push(`${prefix}.browser must name a supported browser`);
	if (receipt.assistiveTechnology !== undefined && (!meaningfulText(receipt.assistiveTechnology, 3, 1) || GENERIC_ASSISTIVE_TECHNOLOGY.test(receipt.assistiveTechnology.trim()))) errors.push(`${prefix}.assistiveTechnology must name an assistive technology`);
	if (receipt.performanceMeasurement !== undefined) validatePerformanceMeasurement(receipt.performanceMeasurement, `${prefix}.performanceMeasurement`, errors);
	if (receipt.securityCases !== undefined) validateSecurityCases(receipt.securityCases, `${prefix}.securityCases`, errors);
	if (receipt.contractCases !== undefined) validateContractCases(receipt.contractCases, `${prefix}.contractCases`, errors);
	if (receipt.performanceChecks !== undefined) validatePerformanceChecks(receipt.performanceChecks, `${prefix}.performanceChecks`, errors);
	if (receipt.claim === 'security_negative') validateSecurityCases(receipt.securityCases, `${prefix}.securityCases`, errors);
	if (['modularity_behavior', 'contract_compatibility'].includes(receipt.claim)) validateContractCases(receipt.contractCases, `${prefix}.contractCases`, errors);
}

const RELEASE_VALIDATION_KINDS = {
	security: new Set(['test', 'runtime']),
	performance: new Set(['profile', 'runtime']),
	modularity: new Set(['test']),
	accessibility: new Set(['browser', 'manual']),
};
const RELEASE_VALIDATION_CLAIMS = {
	security: 'security_negative',
	performance: 'performance_comparable',
	modularity: 'modularity_behavior',
	accessibility: 'accessibility_manual',
};

function validateCandidateBinding(receipt, target, prefix, errors, { required = false } = {}) {
	if (!isObject(receipt)) return;
	if (!isObject(receipt.identity)) {
		if (required) errors.push(`${prefix}.identity is required for release-candidate proof`);
		return;
	}
	if (receipt.identity.commitSha !== target?.commitSha) errors.push(`${prefix}.identity.commitSha must match targetIdentity.commitSha`);
	if (required && target?.kind === 'package' && receipt.identity.artifactSha256 === undefined) errors.push(`${prefix}.identity.artifactSha256 is required for release-candidate proof`);
	if (receipt.identity.artifactSha256 !== undefined && receipt.identity.artifactSha256 !== target?.artifact?.sha256) {
		errors.push(`${prefix}.identity.artifactSha256 must match targetIdentity.artifact.sha256`);
	}
}

function validateReceiptList(value, prefix, errors, validator, minimum = 0, mustPass = false) {
	if (!Array.isArray(value)) {
		errors.push(`${prefix} must be an array`);
		return;
	}
	if (value.length < minimum) errors.push(`${prefix} requires at least ${minimum} item`);
	for (const [index, receipt] of value.entries()) {
		validator(receipt, `${prefix}[${index}]`, errors);
		if (mustPass && receipt?.result !== 'pass') errors.push(`${prefix}[${index}] must pass`);
	}
}

function validateDistribution(distribution, prefix, errors) {
	if (!isObject(distribution)) {
		errors.push(`${prefix} must be an object`);
		return;
	}
	checkKeys(distribution, KEYS.distribution, prefix, errors);
	const entries = Object.entries(distribution);
	if (entries.length === 0) errors.push(`${prefix} requires at least one percentile`);
	for (const [percentile, value] of entries) {
		if (!Number.isFinite(value) || value < 0) errors.push(`${prefix}.${percentile} must be a non-negative number`);
	}
	const ordered = ['p50', 'p75', 'p95', 'p99'];
	let previousName;
	let previousValue;
	for (const percentile of ordered) {
		const value = distribution[percentile];
		if (value === undefined) continue;
		if (previousName !== undefined && value < previousValue) {
			errors.push(`${prefix}.${percentile} must not be below ${previousName}`);
		}
		previousName = percentile;
		previousValue = value;
	}
}

function validateAuthorizationMatrix(matrix, prefix, errors, requireMatch = false, target, requireBinding = false) {
	if (!Array.isArray(matrix) || matrix.length === 0) {
		errors.push(`${prefix} requires at least one authorization check`);
		return;
	}
	for (const [index, check] of matrix.entries()) {
		const checkPrefix = `${prefix}[${index}]`;
		if (!isObject(check)) {
			errors.push(`${checkPrefix} must be an object`);
			continue;
		}
		checkKeys(check, KEYS.authorizationMatrix, checkPrefix, errors);
		for (const key of ['actor', 'action', 'resource']) {
			if (!meaningfulText(check[key], 3, 1)) errors.push(`${checkPrefix}.${key} is required`);
		}
		if (!['allow', 'deny'].includes(check.expected)) errors.push(`${checkPrefix}.expected is invalid`);
		if (!['allow', 'deny'].includes(check.observed)) errors.push(`${checkPrefix}.observed is invalid`);
		if (requireMatch && check.expected !== check.observed) errors.push(`${checkPrefix} observed decision does not match expected decision`);
		validateReceiptList(check.evidence, `${checkPrefix}.evidence`, errors, validateEvidenceReceipt, 1);
		for (const [evidenceIndex, receipt] of (Array.isArray(check.evidence) ? check.evidence : []).entries()) {
			validateCandidateBinding(receipt, target, `${checkPrefix}.evidence[${evidenceIndex}]`, errors, { required: requireBinding });
		}
	}
}

function validateResourceBudget(budget, prefix, errors, target, requireBinding = false) {
	if (!isObject(budget)) {
		errors.push(`${prefix} must be an object`);
		return;
	}
	checkKeys(budget, KEYS.resourceBudget, prefix, errors);
	if (!meaningfulText(budget.scope, 8, 2)) errors.push(`${prefix}.scope is required`);
	if (!meaningfulText(budget.failureBehavior, 12, 3)) errors.push(`${prefix}.failureBehavior must describe bounded failure behavior`);
	if (!Array.isArray(budget.limits) || budget.limits.length === 0) {
		errors.push(`${prefix}.limits requires at least one limit`);
	} else {
		for (const [index, limit] of budget.limits.entries()) {
			const limitPrefix = `${prefix}.limits[${index}]`;
			if (!isObject(limit)) {
				errors.push(`${limitPrefix} must be an object`);
				continue;
			}
			checkKeys(limit, KEYS.resourceLimit, limitPrefix, errors);
			if (!meaningfulText(limit.name, 3, 1)) errors.push(`${limitPrefix}.name is required`);
			if (!Number.isFinite(limit.value) || limit.value < 0) errors.push(`${limitPrefix}.value must be a non-negative number`);
			if (!nonEmpty(limit.unit)) errors.push(`${limitPrefix}.unit is required`);
		}
	}
	validateReceiptList(budget.evidence, `${prefix}.evidence`, errors, validateEvidenceReceipt, 1);
	for (const [evidenceIndex, receipt] of (Array.isArray(budget.evidence) ? budget.evidence : []).entries()) {
		validateCandidateBinding(receipt, target, `${prefix}.evidence[${evidenceIndex}]`, errors, { required: requireBinding });
	}
}

function validateCapacityEnvelope(envelope, prefix, errors, target, requireBinding = false) {
	if (!isObject(envelope)) {
		errors.push(`${prefix} is required for declared scale risk`);
		return;
	}
	checkKeys(envelope, KEYS.capacityEnvelope, prefix, errors);
	const objects = [
		['workload', KEYS.capacityWorkload],
		['saturation', KEYS.capacitySaturation],
		['fairness', KEYS.capacityFairness],
		['queue', KEYS.capacityQueue],
		['storage', KEYS.capacityStorage],
	];
	for (const [key, keys] of objects) {
		if (!isObject(envelope[key])) errors.push(`${prefix}.${key} must be an object`);
		else checkKeys(envelope[key], keys, `${prefix}.${key}`, errors);
	}
	if (!meaningfulText(envelope.workload?.description)) errors.push(`${prefix}.workload.description is required`);
	for (const key of ['concurrency', 'dataVolume', 'durationSeconds']) {
		if (!Number.isFinite(envelope.workload?.[key]) || envelope.workload[key] <= 0) errors.push(`${prefix}.workload.${key} must be positive`);
	}
	if (!Number.isFinite(envelope.headroomPercent) || envelope.headroomPercent <= 0) errors.push(`${prefix}.headroomPercent must be positive`);
	if (!meaningfulText(envelope.saturation?.metric, 4, 1)) errors.push(`${prefix}.saturation.metric is required`);
	for (const key of ['observed', 'budget']) {
		if (!Number.isFinite(envelope.saturation?.[key])) errors.push(`${prefix}.saturation.${key} must be numeric`);
	}
	if (!['lower_is_better', 'higher_is_better'].includes(envelope.saturation?.direction)) errors.push(`${prefix}.saturation.direction is invalid`);
	if (envelope.saturation?.direction === 'lower_is_better' && envelope.saturation.observed > envelope.saturation.budget) errors.push(`${prefix}.saturation exceeds its budget`);
	if (envelope.saturation?.direction === 'higher_is_better' && envelope.saturation.observed < envelope.saturation.budget) errors.push(`${prefix}.saturation misses its budget`);
	if (!meaningfulText(envelope.fairness?.scope, 4, 1)) errors.push(`${prefix}.fairness.scope is required`);
	if (!Number.isFinite(envelope.fairness?.limit) || envelope.fairness.limit <= 0 || !nonEmpty(envelope.fairness?.unit)) errors.push(`${prefix}.fairness requires a positive limit and unit`);
	for (const key of ['arrivalRate', 'serviceRate', 'maxBacklog', 'observedBacklog', 'drainSeconds', 'drainBudgetSeconds']) {
		if (!Number.isFinite(envelope.queue?.[key]) || envelope.queue[key] < 0) errors.push(`${prefix}.queue.${key} must be a non-negative number`);
	}
	if (Number.isFinite(envelope.queue?.arrivalRate) && Number.isFinite(envelope.queue?.serviceRate) && envelope.queue.serviceRate <= envelope.queue.arrivalRate) errors.push(`${prefix}.queue.serviceRate must exceed arrivalRate`);
	if (Number.isFinite(envelope.queue?.observedBacklog) && Number.isFinite(envelope.queue?.maxBacklog) && envelope.queue.observedBacklog > envelope.queue.maxBacklog) errors.push(`${prefix}.queue.observedBacklog exceeds maxBacklog`);
	if (Number.isFinite(envelope.queue?.drainSeconds) && Number.isFinite(envelope.queue?.drainBudgetSeconds) && envelope.queue.drainSeconds > envelope.queue.drainBudgetSeconds) errors.push(`${prefix}.queue.drainSeconds exceeds drainBudgetSeconds`);
	for (const key of ['currentBytes', 'projectedBytes', 'restoreSeconds', 'restoreBudgetSeconds']) {
		if (!Number.isFinite(envelope.storage?.[key]) || envelope.storage[key] < 0) errors.push(`${prefix}.storage.${key} must be a non-negative number`);
	}
	if (Number.isFinite(envelope.storage?.restoreSeconds) && Number.isFinite(envelope.storage?.restoreBudgetSeconds) && envelope.storage.restoreSeconds > envelope.storage.restoreBudgetSeconds) errors.push(`${prefix}.storage.restoreSeconds exceeds restoreBudgetSeconds`);
	if (!meaningfulText(envelope.failureBehavior)) errors.push(`${prefix}.failureBehavior must state bounded failure behavior`);
	validateReceiptList(envelope.evidence, `${prefix}.evidence`, errors, validateEvidenceReceipt, 1);
	for (const [evidenceIndex, receipt] of (Array.isArray(envelope.evidence) ? envelope.evidence : []).entries()) {
		validateCandidateBinding(receipt, target, `${prefix}.evidence[${evidenceIndex}]`, errors, { required: requireBinding });
	}
}

function validatePerformanceConditions(conditions, prefix, errors) {
	if (!isObject(conditions)) {
		errors.push(`${prefix} must be an object`);
		return;
	}
	checkKeys(conditions, KEYS.conditions, prefix, errors);
	for (const key of ['runtime', 'dataset', 'cacheState']) {
		if (!meaningfulText(conditions[key], 4, 1)) errors.push(`${prefix}.${key} is required`);
	}
	if (!Number.isInteger(conditions.concurrency) || conditions.concurrency < 1) errors.push(`${prefix}.concurrency must be a positive integer`);
}

function validatePerformanceMeasurement(measurement, prefix, errors, { comparable = false, elevated = false } = {}) {
	if (!isObject(measurement)) {
		errors.push(`${prefix} must be a structured measurement`);
		return;
	}
	checkKeys(measurement, KEYS.measurement, prefix, errors);
	if (!meaningfulText(measurement.metric, 6, 2)) errors.push(`${prefix}.metric is required`);
	if (!nonEmpty(measurement.unit)) errors.push(`${prefix}.unit is required`);
	if (!['lower_is_better', 'higher_is_better'].includes(measurement.direction)) errors.push(`${prefix}.direction is invalid`);
	for (const key of ['before', 'after', 'budget']) {
		if (!Number.isFinite(measurement[key])) errors.push(`${prefix}.${key} must be numeric`);
	}
	if (Number.isFinite(measurement.before) && Number.isFinite(measurement.after) && Number.isFinite(measurement.budget)) {
		if (measurement.direction === 'lower_is_better' && !(measurement.after < measurement.before && measurement.after <= measurement.budget)) {
			errors.push(`${prefix} must improve and meet the lower-is-better budget`);
		}
		if (measurement.direction === 'higher_is_better' && !(measurement.after > measurement.before && measurement.after >= measurement.budget)) {
			errors.push(`${prefix} must improve and meet the higher-is-better budget`);
		}
	}
	if (!meaningfulText(measurement.conditions)) errors.push(`${prefix}.conditions must identify comparable conditions`);
	if (measurement.sampleSize !== undefined && (!Number.isInteger(measurement.sampleSize) || measurement.sampleSize < 1)) {
		errors.push(`${prefix}.sampleSize must be a positive integer when present`);
	}
	if (measurement.runCount !== undefined && (!Number.isInteger(measurement.runCount) || measurement.runCount < 1)) {
		errors.push(`${prefix}.runCount must be a positive integer when present`);
	}
	if (measurement.variance !== undefined && (!Number.isFinite(measurement.variance) || measurement.variance < 0)) {
		errors.push(`${prefix}.variance must be a non-negative number when present`);
	}
	if (measurement.errorRate !== undefined && (!Number.isFinite(measurement.errorRate) || measurement.errorRate < 0 || measurement.errorRate > 1)) {
		errors.push(`${prefix}.errorRate must be a ratio from 0 to 1 when present`);
	}
	if (measurement.cacheState !== undefined && !['cold', 'warm', 'mixed', 'not_applicable'].includes(measurement.cacheState)) {
		errors.push(`${prefix}.cacheState is invalid`);
	}
	if (measurement.fieldOrLab !== undefined && !['field', 'lab', 'both'].includes(measurement.fieldOrLab)) {
		errors.push(`${prefix}.fieldOrLab is invalid`);
	}
	if (measurement.provenance !== undefined && !meaningfulText(measurement.provenance, 8, 2)) {
		errors.push(`${prefix}.provenance must identify the measurement source when present`);
	}
	if (measurement.limitations !== undefined && !meaningfulText(measurement.limitations, 8, 2)) {
		errors.push(`${prefix}.limitations must state material limitations when present`);
	}
	if (measurement.distribution !== undefined) {
		validateDistribution(measurement.distribution, `${prefix}.distribution`, errors);
		if (measurement.sampleSize === undefined && measurement.runCount === undefined) {
			errors.push(`${prefix}.distribution requires sampleSize or runCount`);
		}
	}
	if (measurement.fieldOrLab !== undefined && measurement.provenance === undefined) {
		errors.push(`${prefix}.provenance is required when fieldOrLab is present`);
	}
	if (measurement.baselineConditions !== undefined) validatePerformanceConditions(measurement.baselineConditions, `${prefix}.baselineConditions`, errors);
	if (measurement.candidateConditions !== undefined) validatePerformanceConditions(measurement.candidateConditions, `${prefix}.candidateConditions`, errors);
	if (comparable) {
		if (/\b(?:non[- ]comparable|not comparable|different (?:environment|dataset|cache|runtime)|warm\b.{0,40}\bcold|cold\b.{0,40}\bwarm)\b/i.test(measurement.conditions ?? '')) errors.push(`${prefix}.conditions contradict the comparable proof claim`);
		if (!isObject(measurement.baselineConditions) || !isObject(measurement.candidateConditions)) {
			errors.push(`${prefix} requires structured baselineConditions and candidateConditions`);
		} else if (['runtime', 'dataset', 'cacheState', 'concurrency'].some((key) => measurement.baselineConditions[key] !== measurement.candidateConditions[key])) {
			errors.push(`${prefix} baselineConditions and candidateConditions must match`);
		}
	}
	if (elevated) {
		if (!Number.isInteger(measurement.runCount) || measurement.runCount < 3) errors.push(`${prefix}.runCount must be at least 3 for elevated proof`);
		if (!isObject(measurement.distribution) || !Number.isFinite(measurement.distribution.p95) || !Number.isFinite(measurement.distribution.p99)) errors.push(`${prefix}.distribution requires p95 and p99 for elevated proof`);
		if (!Number.isFinite(measurement.errorRate)) errors.push(`${prefix}.errorRate is required for elevated proof`);
		for (const key of ['cacheState', 'fieldOrLab', 'provenance', 'limitations']) {
			if (measurement[key] === undefined) errors.push(`${prefix}.${key} is required for elevated proof`);
		}
	}
}

function validateAssuranceProfile(profile, report, errors) {
	if (!isObject(profile)) {
		errors.push('assuranceProfile is required');
		return [];
	}
	checkKeys(profile, KEYS.assuranceProfile, 'assuranceProfile', errors);
	if (!['standard', 'elevated'].includes(profile.level)) errors.push('assuranceProfile.level is invalid');
	if (!Array.isArray(profile.risks) || profile.risks.some((risk) => !ASSURANCE_RISKS.has(risk))) errors.push('assuranceProfile.risks is invalid');
	const risks = Array.isArray(profile.risks) ? profile.risks : [];
	if (risks.length > 0 && profile.level !== 'elevated') errors.push('assuranceProfile.level must be elevated when risks are declared');
	const targetText = [report.qualityTarget, ...(Array.isArray(report.scope?.targets) ? report.scope.targets : [])].join(' ');
	const inferred = [
		['high_traffic', /\b(?:high[- ]traffic|millions? of visits)\b/i],
		['multi_tenant', /\bmulti[- ]tenant\b/i],
		['async_queue', /\b(?:queue|queued|background job|import worker)\b/i],
		['external_webhook', /\bwebhooks?\b/i],
		['custom_storage', /\b(?:custom[- ]table|custom database table|custom storage)\b/i],
		['migration', /\b(?:migration|migrate|backfill)\b/i],
		['public_api', /\b(?:public\s+(?:REST|GraphQL|API)|bulk\s+(?:REST|GraphQL|API)|(?:REST|GraphQL|API)\s+(?:bulk|endpoint|route))\b/i],
		['sensitive_data', /\b(?:sensitive data|personal data|PII|credentials?|secrets?)\b/i],
		['legacy_debt', /\b(?:legacy|[1-9]\d{3,}[+-]?[- ]line)\b[^.]{0,50}\b(?:file|class|module)\b/i],
	];
	for (const [risk, pattern] of inferred) {
		if (pattern.test(targetText) && !risks.includes(risk)) errors.push(`assuranceProfile.risks must include ${risk} because scope declares it`);
	}
	if (inferred.some(([, pattern]) => pattern.test(targetText)) && profile.level !== 'elevated') errors.push('assuranceProfile.level must be elevated for the stated risk profile');
	return risks;
}

function validateMigrationPlan(plan, prefix, errors, target, requireBinding) {
	if (!isObject(plan)) {
		errors.push(`${prefix} is required for a migration finding`);
		return;
	}
	checkKeys(plan, KEYS.migrationPlan, prefix, errors);
	if (plan.strategy !== 'expand_migrate_contract') errors.push(`${prefix}.strategy must be expand_migrate_contract`);
	for (const key of ['expandCheck', 'backfillCheck', 'idempotencyCheck', 'rollbackCheck']) {
		validateValidationReceipt(plan[key], `${prefix}.${key}`, errors);
		if (plan[key]?.claim !== 'migration_step' || plan[key]?.result !== 'pass') errors.push(`${prefix}.${key} must be a passing migration_step receipt`);
		validateCandidateBinding(plan[key], target, `${prefix}.${key}`, errors, { required: requireBinding });
	}
	if (!['deferred', 'owner_approved'].includes(plan.contractStatus)) errors.push(`${prefix}.contractStatus is invalid`);
	if (plan.contractStatus === 'deferred' && (!nonEmpty(plan.cleanupIssue) || !LOCATOR.test(plan.cleanupIssue))) errors.push(`${prefix}.cleanupIssue must locate deferred contract work`);
	if (plan.contractStatus === 'owner_approved') {
		validateEvidenceReceipt(plan.ownerApproval, `${prefix}.ownerApproval`, errors);
		if (plan.ownerApproval?.kind !== 'owner') errors.push(`${prefix}.ownerApproval.kind must be owner`);
	}
}

function validateModularityRatchet(ratchet, prefix, errors) {
	if (!isObject(ratchet)) {
		errors.push(`${prefix} is required for legacy debt`);
		return;
	}
	checkKeys(ratchet, KEYS.modularityRatchet, prefix, errors);
	if (!meaningfulText(ratchet.metric, 4, 1)) errors.push(`${prefix}.metric is required`);
	for (const key of ['baseline', 'after', 'budget']) {
		if (!Number.isFinite(ratchet[key]) || ratchet[key] < 0) errors.push(`${prefix}.${key} must be a non-negative number`);
	}
	if (!['reduced', 'no_growth', 'exception'].includes(ratchet.posture)) errors.push(`${prefix}.posture is invalid`);
	if (ratchet.posture === 'reduced' && !(ratchet.after < ratchet.baseline && ratchet.after <= ratchet.budget)) errors.push(`${prefix} reduced posture must reduce debt within budget`);
	if (ratchet.posture === 'no_growth' && !(ratchet.after <= ratchet.baseline && ratchet.after <= ratchet.budget)) errors.push(`${prefix} no_growth posture must not increase debt or exceed budget`);
	if (ratchet.posture === 'exception') {
		for (const key of ['owner', 'issue', 'rationale']) {
			if (!meaningfulText(ratchet[key], key === 'issue' ? 5 : 8, key === 'issue' ? 1 : 2)) errors.push(`${prefix}.${key} is required for an exception`);
		}
		if (nonEmpty(ratchet.issue) && !LOCATOR.test(ratchet.issue)) errors.push(`${prefix}.issue must locate the tracked exception`);
	}
}

function validateIndependentReview(review, commitSha, prefix, errors) {
	if (!isObject(review)) {
		errors.push(`${prefix} requires a fresh source-aware review`);
		return;
	}
	checkKeys(review, KEYS.independentReview, prefix, errors);
	if (review.kind !== 'fresh_source_aware') errors.push(`${prefix}.kind must be fresh_source_aware`);
	if (!nonEmpty(review.runId) || review.runId.length < 5) errors.push(`${prefix}.runId is required`);
	if (review.reviewedCommitSha !== commitSha) errors.push(`${prefix}.reviewedCommitSha must match targetIdentity.commitSha`);
	if (review.result !== 'pass') errors.push(`${prefix}.result must pass`);
	validateReceiptList(review.evidence, `${prefix}.evidence`, errors, validateEvidenceReceipt, 1);
}

function validateTargetIdentity(target, errors) {
	if (!isObject(target)) {
		errors.push('targetIdentity is required');
		return;
	}
	checkKeys(target, KEYS.target, 'targetIdentity', errors);
	if (!['commit', 'package'].includes(target.kind)) errors.push('targetIdentity.kind is invalid');
	if (!REPOSITORY.test(target.repository ?? '')) errors.push('targetIdentity.repository must be owner/repository');
	if (!REVISION.test(target.commitSha ?? '')) errors.push('targetIdentity.commitSha must be a 40-character commit SHA');
	if (target.baseCommitSha !== undefined && !REVISION.test(target.baseCommitSha)) errors.push('targetIdentity.baseCommitSha must be a 40-character commit SHA');
	if (target.kind === 'package' && !isObject(target.artifact)) errors.push('targetIdentity.artifact is required for package review');
	if (target.artifact !== undefined) {
		if (!isObject(target.artifact)) {
			errors.push('targetIdentity.artifact must be an object');
		} else {
			checkKeys(target.artifact, KEYS.artifact, 'targetIdentity.artifact', errors);
			if (!nonEmpty(target.artifact.path) || !LOCATOR.test(target.artifact.path)) errors.push('targetIdentity.artifact.path must locate the package');
			if (!SHA256.test(target.artifact.sha256 ?? '')) errors.push('targetIdentity.artifact.sha256 must be a 64-character digest');
		}
	}
}

export function validate(report) {
	const errors = [];
	if (!isObject(report)) return ['report must be an object'];
	checkKeys(report, KEYS.top, 'report', errors);
	if (report.schemaVersion !== 2) errors.push('schemaVersion must be 2');
	if (!MODES.has(report.mode)) errors.push('mode is invalid');
	if (!CONCLUSIONS.has(report.conclusion)) errors.push('conclusion is invalid');
	if (!meaningfulText(report.qualityTarget, 8, 2)) errors.push('qualityTarget is required');
	validateTargetIdentity(report.targetIdentity, errors);

	if (!isObject(report.scope)) {
		errors.push('scope is required');
	} else {
		checkKeys(report.scope, KEYS.scope, 'scope', errors);
		if (!Array.isArray(report.scope.targets) || report.scope.targets.length === 0 || !report.scope.targets.every(nonEmpty)) errors.push('scope.targets requires at least one target');
		if (!Array.isArray(report.scope.exclusions) || !report.scope.exclusions.every(nonEmpty)) errors.push('scope.exclusions must be a string array');
	}
	const assuranceRisks = report.targetIdentity?.kind === 'package' && report.conclusion === 'pass'
		? validateAssuranceProfile(report.assuranceProfile, report, errors)
		: (report.assuranceProfile === undefined ? [] : validateAssuranceProfile(report.assuranceProfile, report, errors));
	const elevatedPerformance = assuranceRisks.some((risk) => ['high_traffic', 'async_queue', 'multi_tenant'].includes(risk));

	const domains = isObject(report.domains) ? report.domains : {};
	if (!isObject(report.domains)) errors.push('domains is required');
	for (const key of Object.keys(domains)) {
		if (!AREA_SET.has(key)) errors.push(`domains.${key} is not allowed`);
	}
	const expectedAreas = report.mode === 'multi' ? AREAS : (AREA_SET.has(report.mode) ? [report.mode] : []);
	for (const area of expectedAreas) {
		if (!isObject(domains[area])) errors.push(`domains.${area} is required for ${report.mode} mode`);
	}
	for (const area of Object.keys(domains)) {
		if (report.mode !== 'multi' && area !== report.mode) errors.push(`domains.${area} is outside ${report.mode} mode`);
		const domain = domains[area];
		if (!isObject(domain)) continue;
		checkKeys(domain, KEYS.domain, `domains.${area}`, errors);
		if (!DISPOSITIONS.has(domain.disposition)) errors.push(`domains.${area}.disposition is invalid`);
		if (domain.disposition === 'not_applicable') {
			if (!meaningfulText(domain.reason)) errors.push(`domains.${area}.reason is required for not_applicable`);
			if (Array.isArray(domain.evidence) && domain.evidence.length > 0) errors.push(`domains.${area}.evidence must be empty when not_applicable`);
			if (Array.isArray(domain.validation) && domain.validation.length > 0) errors.push(`domains.${area}.validation must be empty when not_applicable`);
		} else {
			validateReceiptList(domain.evidence, `domains.${area}.evidence`, errors, validateEvidenceReceipt, 1);
		}
		const releasePass = report.targetIdentity?.kind === 'package' && report.conclusion === 'pass' && domain.disposition === 'pass';
		if (report.targetIdentity?.kind === 'package' && report.conclusion === 'pass' && domain.disposition !== 'pass') {
			errors.push(`packaged release pass requires domains.${area}.disposition to be pass`);
		}
		if (domain.validation !== undefined || releasePass) {
			validateReceiptList(domain.validation, `domains.${area}.validation`, errors, validateValidationReceipt, releasePass ? 1 : 0, releasePass);
		}
		for (const [index, receipt] of (Array.isArray(domain.evidence) ? domain.evidence : []).entries()) {
			validateCandidateBinding(receipt, report.targetIdentity, `domains.${area}.evidence[${index}]`, errors, { required: releasePass });
		}
		for (const [index, receipt] of (Array.isArray(domain.validation) ? domain.validation : []).entries()) {
			validateCandidateBinding(receipt, report.targetIdentity, `domains.${area}.validation[${index}]`, errors, { required: releasePass });
		}
		if (releasePass && Array.isArray(domain.validation) && !domain.validation.some((receipt) => RELEASE_VALIDATION_KINDS[area]?.has(receipt?.kind))) {
			errors.push(`domains.${area}.validation requires release-appropriate ${[...RELEASE_VALIDATION_KINDS[area]].join(' or ')} proof`);
		}
		const claimedProof = releasePass && Array.isArray(domain.validation)
			? domain.validation.find((receipt) => receipt?.claim === RELEASE_VALIDATION_CLAIMS[area]) : null;
		if (releasePass && !claimedProof) errors.push(`domains.${area}.validation requires ${RELEASE_VALIDATION_CLAIMS[area]} proof`);
		if (releasePass && area === 'security' && claimedProof) validateSecurityCases(claimedProof.securityCases, 'domains.security.validation.securityCases', errors);
		if (releasePass && area === 'modularity' && claimedProof) validateContractCases(claimedProof.contractCases, 'domains.modularity.validation.contractCases', errors);
		if (releasePass && area === 'performance') {
			if (!claimedProof?.performanceMeasurement) errors.push('domains.performance.validation requires a comparable performanceMeasurement');
			else validatePerformanceMeasurement(claimedProof.performanceMeasurement, 'domains.performance.validation.performanceMeasurement', errors, { comparable: true, elevated: elevatedPerformance });
			if (elevatedPerformance) validatePerformanceChecks(claimedProof?.performanceChecks, 'domains.performance.validation.performanceChecks', errors, ['tail', 'overload', 'recovery', 'cache', 'capacity']);
		}
		if (area === 'security' && domain.authorizationMatrix !== undefined) validateAuthorizationMatrix(domain.authorizationMatrix, `domains.${area}.authorizationMatrix`, errors, releasePass, report.targetIdentity, releasePass);
		if (area === 'security' && domain.resourceBudget !== undefined) validateResourceBudget(domain.resourceBudget, `domains.${area}.resourceBudget`, errors, report.targetIdentity, releasePass);
		if (area === 'performance' && domain.capacityEnvelope !== undefined) validateCapacityEnvelope(domain.capacityEnvelope, `domains.${area}.capacityEnvelope`, errors, report.targetIdentity, releasePass);
		if (area !== 'security' && domain.authorizationMatrix !== undefined) errors.push(`domains.${area}.authorizationMatrix is only valid for security`);
		if (area !== 'security' && domain.resourceBudget !== undefined) errors.push(`domains.${area}.resourceBudget is only valid for security`);
		if (area !== 'performance' && domain.capacityEnvelope !== undefined) errors.push(`domains.${area}.capacityEnvelope is only valid for performance`);
		if (releasePass && area === 'security' && assuranceRisks.some((risk) => ['public_api', 'sensitive_data', 'multi_tenant'].includes(risk)) && domain.authorizationMatrix === undefined) errors.push('domains.security.authorizationMatrix is required for declared trust-boundary risk');
		if (releasePass && area === 'security' && assuranceRisks.some((risk) => ['public_api', 'high_traffic', 'async_queue', 'multi_tenant'].includes(risk)) && domain.resourceBudget === undefined) errors.push('domains.security.resourceBudget is required for declared abuse or scale risk');
		if (releasePass && area === 'performance' && elevatedPerformance && domain.capacityEnvelope === undefined) errors.push('domains.performance.capacityEnvelope is required for declared scale risk');
		if (releasePass && area === 'accessibility' && (
			!meaningfulText(claimedProof?.browser, 3, 1)
			|| GENERIC_BROWSER.test(claimedProof.browser.trim())
			|| !meaningfulText(claimedProof?.assistiveTechnology, 3, 1)
			|| GENERIC_ASSISTIVE_TECHNOLOGY.test(claimedProof.assistiveTechnology.trim())
		)) {
			errors.push('domains.accessibility.validation requires named browser and assistiveTechnology proof');
		}
		if (releasePass) {
			for (const [validationIndex, receipt] of (Array.isArray(domain.validation) ? domain.validation : []).entries()) {
				if (!nonEmpty(receipt?.artifact) || !LOCATOR.test(receipt.artifact)) errors.push(`domains.${area}.validation[${validationIndex}].artifact is required for release proof`);
				if (receipt?.expectedState === undefined || receipt?.observedState === undefined) errors.push(`domains.${area}.validation[${validationIndex}] requires expectedState and observedState for release proof`);
				else if (receipt.expectedState !== receipt.observedState) errors.push(`domains.${area}.validation[${validationIndex}] observedState must match expectedState`);
			}
			if (area === 'accessibility' && !(Array.isArray(domain.validation) && domain.validation.some((receipt) => receipt?.claim === 'accessibility_automated' && ['static', 'browser'].includes(receipt?.kind)))) errors.push('domains.accessibility.validation requires automated accessibility scan proof');
		}
	}

	const findings = Array.isArray(report.findings) ? report.findings : [];
	const proofGaps = Array.isArray(report.proofGaps) ? report.proofGaps : [];
	if (!Array.isArray(report.findings)) errors.push('findings must be an array');
	if (!Array.isArray(report.proofGaps)) errors.push('proofGaps must be an array');
	for (const [index, gap] of proofGaps.entries()) {
		if (!meaningfulText(gap)) errors.push(`proofGaps[${index}] must contain a concrete description`);
	}

	const ids = new Set();
	for (const [index, finding] of findings.entries()) {
		const prefix = `findings[${index}]`;
		if (!isObject(finding)) {
			errors.push(`${prefix} must be an object`);
			continue;
		}
		checkKeys(finding, KEYS.finding, prefix, errors);
		if (!nonEmpty(finding.id)) errors.push(`${prefix}.id is required`);
		if (ids.has(finding.id)) errors.push(`${prefix}.id is duplicated: ${finding.id}`);
		if (nonEmpty(finding.id)) ids.add(finding.id);
		if (!AREA_SET.has(finding.area)) errors.push(`${prefix}.area is invalid`);
		if (!expectedAreas.includes(finding.area)) errors.push(`${prefix}.area is outside the selected mode`);
		if (domains[finding.area]?.disposition === 'not_applicable') errors.push(`${prefix}.area cannot be not_applicable when findings exist`);
		if (!SEVERITIES.has(finding.severity)) errors.push(`${prefix}.severity is invalid`);
		if (!STATUSES.has(finding.status)) errors.push(`${prefix}.status is invalid`);
		if (finding.riskFlags !== undefined && (!Array.isArray(finding.riskFlags) || finding.riskFlags.some((flag) => !RISK_FLAGS.has(flag)))) errors.push(`${prefix}.riskFlags is invalid`);
		validateReceiptList(finding.evidence, `${prefix}.evidence`, errors, validateEvidenceReceipt, 1);
		for (const [evidenceIndex, receipt] of (Array.isArray(finding.evidence) ? finding.evidence : []).entries()) {
			validateCandidateBinding(receipt, report.targetIdentity, `${prefix}.evidence[${evidenceIndex}]`, errors);
		}
		if (!meaningfulText(finding.impact)) errors.push(`${prefix}.impact must explain concrete risk`);
		if (!meaningfulText(finding.remediation)) errors.push(`${prefix}.remediation must explain the corrective action`);
		validateReceiptList(finding.validation, `${prefix}.validation`, errors, validateValidationReceipt, finding.status === 'fixed' ? 1 : 0, finding.status === 'fixed');
		const releaseFix = report.targetIdentity?.kind === 'package' && report.conclusion === 'pass' && finding.status === 'fixed';
		for (const proofKey of ['validation', 'negativeTests', 'behaviorChecks', 'manualChecks']) {
			for (const [proofIndex, receipt] of (Array.isArray(finding[proofKey]) ? finding[proofKey] : []).entries()) {
				validateCandidateBinding(receipt, report.targetIdentity, `${prefix}.${proofKey}[${proofIndex}]`, errors, { required: releaseFix });
			}
		}

		if (finding.status === 'fixed' && finding.area === 'security') {
			validateReceiptList(finding.negativeTests, `${prefix}.negativeTests`, errors, validateValidationReceipt, 1, true);
			for (const [testIndex, receipt] of (Array.isArray(finding.negativeTests) ? finding.negativeTests : []).entries()) {
				if (receipt?.claim !== 'security_negative') errors.push(`${prefix}.negativeTests[${testIndex}].claim must be security_negative`);
				validateSecurityCases(receipt?.securityCases, `${prefix}.negativeTests[${testIndex}].securityCases`, errors);
			}
		}
		if (finding.status === 'fixed' && finding.area === 'performance') validatePerformanceMeasurement(finding.performanceMeasurement, `${prefix}.performanceMeasurement`, errors, { comparable: releaseFix, elevated: releaseFix && elevatedPerformance });
		if (finding.authorizationMatrix !== undefined) {
			if (finding.area !== 'security') errors.push(`${prefix}.authorizationMatrix is only valid for security findings`);
			validateAuthorizationMatrix(finding.authorizationMatrix, `${prefix}.authorizationMatrix`, errors, finding.status === 'fixed', report.targetIdentity, releaseFix);
		}
		if (finding.resourceBudget !== undefined) {
			if (!['security', 'performance'].includes(finding.area)) errors.push(`${prefix}.resourceBudget is only valid for security or performance findings`);
			validateResourceBudget(finding.resourceBudget, `${prefix}.resourceBudget`, errors, report.targetIdentity, releaseFix);
		}
		if (finding.status === 'fixed' && finding.area === 'security' && finding.riskFlags?.includes('authorization_boundary') && finding.authorizationMatrix === undefined) {
			errors.push(`${prefix}.authorizationMatrix is required for an authorization_boundary finding`);
		}
		if (finding.status === 'fixed' && finding.riskFlags?.includes('resource_abuse') && finding.resourceBudget === undefined) {
			errors.push(`${prefix}.resourceBudget is required for a resource_abuse finding`);
		}
		if (finding.status === 'fixed' && finding.area === 'modularity') {
			validateReceiptList(finding.behaviorChecks, `${prefix}.behaviorChecks`, errors, validateValidationReceipt, 1, true);
			for (const [checkIndex, receipt] of (Array.isArray(finding.behaviorChecks) ? finding.behaviorChecks : []).entries()) {
				if (receipt?.claim !== 'modularity_behavior') errors.push(`${prefix}.behaviorChecks[${checkIndex}].claim must be modularity_behavior`);
				validateContractCases(receipt?.contractCases, `${prefix}.behaviorChecks[${checkIndex}].contractCases`, errors);
			}
		}
		if (finding.contractChecks !== undefined) {
			validateReceiptList(finding.contractChecks, `${prefix}.contractChecks`, errors, validateValidationReceipt, 1, finding.status === 'fixed');
			for (const [checkIndex, receipt] of (Array.isArray(finding.contractChecks) ? finding.contractChecks : []).entries()) {
				if (receipt?.claim !== 'contract_compatibility') errors.push(`${prefix}.contractChecks[${checkIndex}].claim must be contract_compatibility`);
				validateCandidateBinding(receipt, report.targetIdentity, `${prefix}.contractChecks[${checkIndex}]`, errors, { required: releaseFix });
			}
		}
		if (finding.status === 'fixed' && finding.riskFlags?.includes('public_contract') && finding.contractChecks === undefined) errors.push(`${prefix}.contractChecks is required for public_contract findings`);
		if (finding.riskFlags?.includes('migration')) validateMigrationPlan(finding.migrationPlan, `${prefix}.migrationPlan`, errors, report.targetIdentity, releaseFix);
		if (finding.riskFlags?.includes('legacy_debt')) validateModularityRatchet(finding.modularityRatchet, `${prefix}.modularityRatchet`, errors);
		if (finding.status === 'fixed' && finding.area === 'accessibility') {
			validateReceiptList(finding.manualChecks, `${prefix}.manualChecks`, errors, validateValidationReceipt, 1, true);
			for (const [manualIndex, receipt] of (Array.isArray(finding.manualChecks) ? finding.manualChecks : []).entries()) {
				if (!['manual', 'browser'].includes(receipt?.kind)) errors.push(`${prefix}.manualChecks[${manualIndex}].kind must be manual or browser`);
			}
		}
		const needsIndependentReview = finding.status === 'fixed' && (
			['P0', 'P1'].includes(finding.severity)
			|| (Array.isArray(finding.riskFlags) && finding.riskFlags.some((flag) => RISK_FLAGS.has(flag)))
		);
		if (needsIndependentReview) validateIndependentReview(finding.independentReview, report.targetIdentity?.commitSha, `${prefix}.independentReview`, errors);
		for (const [reviewIndex, receipt] of (Array.isArray(finding.independentReview?.evidence) ? finding.independentReview.evidence : []).entries()) {
			validateCandidateBinding(receipt, report.targetIdentity, `${prefix}.independentReview.evidence[${reviewIndex}]`, errors, { required: releaseFix });
		}
		if (finding.status === 'accepted') {
			validateEvidenceReceipt(finding.riskAcceptance, `${prefix}.riskAcceptance`, errors);
			if (finding.riskAcceptance?.kind !== 'owner') errors.push(`${prefix}.riskAcceptance.kind must be owner`);
		}
	}

	const unresolvedCritical = findings.some((finding) => isObject(finding) && ['P0', 'P1'].includes(finding.severity) && finding.status !== 'fixed');
	for (const [flag, risk] of [['migration', 'migration'], ['legacy_debt', 'legacy_debt']]) {
		if (report.targetIdentity?.kind === 'package' && report.conclusion === 'pass' && findings.some((finding) => finding?.riskFlags?.includes(flag)) && !assuranceRisks.includes(risk)) errors.push(`assuranceProfile.risks must include ${risk} because a finding declares ${flag}`);
	}
	if (report.targetIdentity?.kind === 'package' && report.conclusion === 'pass' && assuranceRisks.includes('migration') && !findings.some((finding) => finding?.status === 'fixed' && finding.riskFlags?.includes('migration'))) errors.push('packaged migration pass requires a fixed migration finding with migrationPlan proof');
	if (report.targetIdentity?.kind === 'package' && report.conclusion === 'pass' && assuranceRisks.includes('legacy_debt') && !findings.some((finding) => finding?.status === 'fixed' && finding.riskFlags?.includes('legacy_debt'))) errors.push('packaged legacy-debt pass requires a fixed finding with modularityRatchet proof');
	if (report.conclusion === 'pass' && unresolvedCritical) errors.push('pass cannot contain an open P0 or P1 finding');
	if (report.conclusion === 'pass' && proofGaps.length > 0) errors.push('pass cannot contain proof gaps');
	if (report.conclusion === 'pass') {
		for (const area of expectedAreas) {
			if (!['pass', 'not_applicable'].includes(domains[area]?.disposition)) errors.push(`pass requires domains.${area} to pass or be justified not_applicable`);
		}
	}
	errors.push(...validateAccessibilityAudit(report, validateValidationReceipt));
	return [...new Set(errors)];
}

function runSelfTest() {
	const commitSha = 'a'.repeat(40);
	const identity = { commitSha, artifactSha256: 'b'.repeat(64) };
	const evidence = (pointer, observation, overrides = {}) => ({ kind: 'code', pointer, observation, identity, ...overrides });
	const validation = (overrides = {}) => ({
		kind: 'test',
		check: 'npm run test:integration',
		expected: 'The protected behavior completes without regression',
		observed: 'All integration assertions completed successfully',
		expectedState: 'success',
		observedState: 'success',
		result: 'pass',
		artifact: 'artifacts/quality-review.log',
		identity,
		...overrides,
	});
	const validationKind = { security: 'test', performance: 'profile', modularity: 'test', accessibility: 'manual' };
	const validationClaim = { security: 'security_negative', performance: 'performance_comparable', modularity: 'modularity_behavior', accessibility: 'accessibility_manual' };
	const validationState = { security: 'deny', performance: 'within_budget', modularity: 'preserve', accessibility: 'accessible' };
	const contractCases = [{ surface: 'user_journey', entryPoint: '/wp-admin/admin.php?page=plugin-settings', consumer: 'administrator', contract: 'Public settings save behavior', before: 'Valid settings are stored for administrators', after: 'Valid settings are stored for administrators', result: 'preserved' }];
	const comparableConditions = { runtime: 'PHP 8.3 WordPress 7.0', dataset: '10,000 report rows', cacheState: 'warm object cache', concurrency: 1 };
	const securityCases = [{ actorClass: 'wrong_object', actor: 'Authenticated subscriber account', input: 'GET request for another site report', resource: 'Site-owned private report record', boundary: 'ownership', expected: 'deny', observed: 'deny', result: 'pass' }];
	const securityNegative = (overrides = {}) => validation({ check: 'Exercise lower capability and wrong object', claim: 'security_negative', securityCases, expectedState: 'deny', observedState: 'deny', ...overrides });
	const performanceMeasurement = (overrides = {}) => ({ metric: 'request duration', unit: 'ms', direction: 'lower_is_better', before: 900, after: 320, budget: 500, conditions: 'same package fixture and warm cache', baselineConditions: comparableConditions, candidateConditions: comparableConditions, ...overrides });
	const domain = (area) => {
		const primary = validation({
			kind: validationKind[area], claim: validationClaim[area],
			expectedState: validationState[area], observedState: validationState[area],
			environment: ['profile', 'manual'].includes(validationKind[area]) ? 'Local release candidate environment' : undefined,
			browser: area === 'accessibility' ? 'Safari 26' : undefined,
			assistiveTechnology: area === 'accessibility' ? 'VoiceOver' : undefined,
			securityCases: area === 'security' ? securityCases : undefined,
			contractCases: area === 'modularity' ? contractCases : undefined,
			performanceMeasurement: area === 'performance' ? performanceMeasurement({ before: 420, after: 280, budget: 350 }) : undefined,
		});
		return {
			disposition: 'pass',
			evidence: [evidence(`artifacts/${area}-review.md`, `The ${area} review completed against the identified candidate`) ],
			validation: area === 'accessibility' ? [primary, validation({ kind: 'static', claim: 'accessibility_automated', check: 'Run axe-core on the packaged settings journey', expectedState: 'accessible', observedState: 'accessible', artifactSha256: 'd'.repeat(64) })] : [primary],
		};
	};
	const finding = {
		id: 'MOD-1', area: 'modularity', severity: 'P2', status: 'fixed',
		evidence: [evidence('src/Policy/CapabilityPolicy.php:18', 'Two entry points duplicated the same capability decision')],
		impact: 'The duplicated policy could diverge during future maintenance',
		remediation: 'Move the policy into one tested service boundary',
		validation: [validation()],
		behaviorChecks: [validation({ check: 'Exercise both public entry points', claim: 'modularity_behavior', contractCases, expectedState: 'preserve', observedState: 'preserve' })],
	};
	const base = {
		schemaVersion: 2,
		mode: 'multi',
		targetIdentity: { kind: 'package', repository: 'owner/plugin', commitSha, artifact: { path: 'dist/plugin.zip', sha256: 'b'.repeat(64) } },
		scope: { targets: ['plugin release candidate'], exclusions: [] },
		qualityTarget: 'Enterprise release quality gate',
		assuranceProfile: { level: 'standard', risks: [] },
		accessibilityClaim: 'scoped_review',
		domains: Object.fromEntries(AREAS.map((area) => [area, domain(area)])),
		findings: [finding],
		proofGaps: [],
		conclusion: 'pass',
	};
	const independentReview = {
		kind: 'fresh_source_aware', runId: 'review-run-1', reviewedCommitSha: commitSha, result: 'pass',
		evidence: [evidence('artifacts/fresh-review.md', 'A separate reviewer verified the corrected candidate')],
	};
	const authorizationMatrix = [{
		actor: 'subscriber', action: 'read report', resource: 'site-owned report', expected: 'deny', observed: 'deny',
		evidence: [evidence('tests/authz.md', 'A subscriber request was denied before the report was disclosed')],
	}];
	const resourceBudget = {
		scope: 'public report export request',
		limits: [
			{ name: 'items', value: 100, unit: 'items/request' },
			{ name: 'timeout', value: 5000, unit: 'milliseconds' },
		],
		failureBehavior: 'Requests over the limit are rejected without starting background work',
		evidence: [evidence('tests/abuse-budget.md', 'Over-limit export requests were rejected and did not grow the queue')],
	};
	const migrationStep = (check) => validation({ check, claim: 'migration_step' });
	const migrationPlan = {
		strategy: 'expand_migrate_contract',
		expandCheck: migrationStep('Verify additive schema expansion'),
		backfillCheck: migrationStep('Verify resumable data backfill'),
		idempotencyCheck: migrationStep('Rerun migration without duplicate writes'),
		rollbackCheck: migrationStep('Restore pre-migration package and data'),
		contractStatus: 'deferred',
		cleanupIssue: 'https://github.com/owner/plugin/issues/91',
	};
	const elevatedPerformanceChecks = ['tail', 'overload', 'recovery', 'cache', 'capacity'].map((kind) => ({
		kind,
		expected: `${kind} behavior remains within the declared release budget`,
		observed: `${kind} behavior remained within the declared release budget`,
		result: 'pass',
	}));
	const elevatedMeasurement = performanceMeasurement({
		runCount: 5,
		distribution: { p50: 280, p95: 440, p99: 490 },
		errorRate: 0,
		cacheState: 'warm',
		fieldOrLab: 'lab',
		provenance: 'Profile artifact at artifacts/performance-profile.json',
		limitations: 'Lab proof excludes regional network latency',
	});
	const capacityEnvelope = {
		workload: { description: 'Concurrent report requests over the projected dataset', concurrency: 25, dataVolume: 500000, durationSeconds: 300 },
		headroomPercent: 35,
		saturation: { metric: 'request latency', observed: 490, budget: 500, direction: 'lower_is_better' },
		fairness: { scope: 'per tenant requests', limit: 10, unit: 'requests/second' },
		queue: { arrivalRate: 20, serviceRate: 30, maxBacklog: 100, observedBacklog: 40, drainSeconds: 20, drainBudgetSeconds: 30 },
		storage: { currentBytes: 1000000, projectedBytes: 3000000, restoreSeconds: 45, restoreBudgetSeconds: 60 },
		failureBehavior: 'Over-budget work is rejected and retry attempts remain bounded',
		evidence: [evidence('artifacts/capacity-envelope.json', 'Measured workload remained inside declared saturation and recovery budgets')],
	};
	const cases = [
		['valid report', base, true],
		['malformed findings', { ...base, findings: {} }, false],
		['null finding', { ...base, findings: [null] }, false],
		['malformed proof gaps', { ...base, proofGaps: null }, false],
		['empty multi domains', { ...base, domains: {}, findings: [] }, false],
		['missing multi domain', { ...base, domains: { ...base.domains, accessibility: undefined } }, false],
		['mutable revision', { ...base, targetIdentity: { ...base.targetIdentity, commitSha: 'abc123' } }, false],
		['unknown top key', { ...base, fabricated: true }, false],
		['unknown finding key', { ...base, findings: [{ ...finding, fabricated: true }] }, false],
		['unknown receipt key', { ...base, findings: [{ ...finding, evidence: [{ ...finding.evidence[0], fabricated: true }] }] }, false],
		['release evidence from another commit', { ...base, domains: { ...base.domains, security: { ...base.domains.security, evidence: [{ ...base.domains.security.evidence[0], identity: { ...identity, commitSha: 'c'.repeat(40) } }] } } }, false],
		['release evidence without package digest', { ...base, domains: { ...base.domains, security: { ...base.domains.security, evidence: [{ ...base.domains.security.evidence[0], identity: { commitSha } }] } } }, false],
		['release pass without security execution proof', { ...base, domains: { ...base.domains, security: { disposition: 'pass', evidence: base.domains.security.evidence } } }, false],
		['release pass with all domains not applicable', { ...base, domains: Object.fromEntries(AREAS.map((area) => [area, { disposition: 'not_applicable', reason: `${area} was incorrectly omitted from the release audit`, evidence: [], validation: [] }])) }, false],
		['single mode wrong domain', { ...base, mode: 'security', domains: { performance: base.domains.performance }, findings: [] }, false],
		['failed modularity proof', { ...base, findings: [{ ...finding, behaviorChecks: [validation({ result: 'fail' })] }] }, false],
		['vague evidence', { ...base, domains: { ...base.domains, modularity: { disposition: 'pass', evidence: [{ kind: 'code', pointer: 'note-1', observation: 'all good' }] } } }, false],
		['accepted critical without owner receipt', { ...base, findings: [{ ...finding, severity: 'P1', status: 'accepted' }] }, false],
		['owner acceptance cannot pass an unresolved critical', { ...base, findings: [{ ...finding, severity: 'P1', status: 'accepted', riskAcceptance: { kind: 'owner', pointer: 'decisions/risk.md', observation: 'Owner accepted the unresolved release risk for later work' } }] }, false],
		['critical fix without independent review', { ...base, findings: [{ ...finding, severity: 'P1' }] }, false],
		['critical fix with independent review', { ...base, findings: [{ ...finding, severity: 'P1', independentReview }] }, true],
		['independent review wrong commit', { ...base, findings: [{ ...finding, severity: 'P1', independentReview: { ...independentReview, reviewedCommitSha: 'c'.repeat(40) } }] }, false],
		['independent review evidence wrong commit', { ...base, findings: [{ ...finding, severity: 'P1', independentReview: { ...independentReview, evidence: [{ ...independentReview.evidence[0], identity: { ...identity, commitSha: 'c'.repeat(40) } }] } }] }, false],
		['generic security validation cannot pass release', { ...base, domains: { ...base.domains, security: { ...base.domains.security, validation: [{ ...base.domains.security.validation[0], claim: undefined }] } } }, false],
		['performance validation needs comparable measurement', { ...base, domains: { ...base.domains, performance: { ...base.domains.performance, validation: [{ ...base.domains.performance.validation[0], performanceMeasurement: undefined }] } } }, false],
		['performance validation rejects different conditions', { ...base, domains: { ...base.domains, performance: { ...base.domains.performance, validation: [{ ...base.domains.performance.validation[0], performanceMeasurement: { ...base.domains.performance.validation[0].performanceMeasurement, candidateConditions: { ...comparableConditions, cacheState: 'cold cache' } } }] } } }, false],
		['performance validation rejects contradictory prose', { ...base, domains: { ...base.domains, performance: { ...base.domains.performance, validation: [{ ...base.domains.performance.validation[0], performanceMeasurement: { ...base.domains.performance.validation[0].performanceMeasurement, conditions: 'before used warm cache while after used cold cache and is non-comparable' } }] } } }, false],
		['accessibility validation names browser and AT', { ...base, domains: { ...base.domains, accessibility: { ...base.domains.accessibility, validation: [{ ...base.domains.accessibility.validation[0], browser: undefined, assistiveTechnology: undefined }] } } }, false],
		['accessibility rejects generic browser and AT', { ...base, domains: { ...base.domains, accessibility: { ...base.domains.accessibility, validation: [{ ...base.domains.accessibility.validation[0], browser: 'browser', assistiveTechnology: 'screen reader' }] } } }, false],
		['security claim needs negative cases', { ...base, domains: { ...base.domains, security: { ...base.domains.security, validation: [{ ...base.domains.security.validation[0], securityCases: undefined }] } } }, false],
		['security claim rejects generic case labels', { ...base, domains: { ...base.domains, security: { ...base.domains.security, validation: [{ ...base.domains.security.validation[0], securityCases: [{ actorClass: 'low_privilege', actor: 'Security test actor', input: 'Security negative test', resource: 'Security test resource', boundary: 'capability', expected: 'deny', observed: 'deny', result: 'pass' }] }] } } }, false],
		['modularity claim needs contract cases', { ...base, domains: { ...base.domains, modularity: { ...base.domains.modularity, validation: [{ ...base.domains.modularity.validation[0], contractCases: undefined }] } } }, false],
		['internal helper is not a public contract', { ...base, domains: { ...base.domains, modularity: { ...base.domains.modularity, validation: [{ ...base.domains.modularity.validation[0], contractCases: [{ ...contractCases[0], surface: 'internal_helper' }] }] } } }, false],
		['internal helper cannot masquerade as user journey', { ...base, domains: { ...base.domains, modularity: { ...base.domains.modularity, validation: [{ ...base.domains.modularity.validation[0], contractCases: [{ ...contractCases[0], entryPoint: 'src/InternalHelper.php:20', contract: 'Internal helper unit test behavior' }] }] } } }, false],
		['REST contract must locate a REST route', { ...base, domains: { ...base.domains, modularity: { ...base.domains.modularity, validation: [{ ...base.domains.modularity.validation[0], contractCases: [{ ...contractCases[0], surface: 'rest_route', entryPoint: 'tests/review.test.js:42' }] }] } } }, false],
		['release validation state contradiction', { ...base, domains: { ...base.domains, security: { ...base.domains.security, validation: [{ ...base.domains.security.validation[0], observedState: 'allow' }] } } }, false],
		['packaged accessibility needs automated scan', { ...base, domains: { ...base.domains, accessibility: { ...base.domains.accessibility, validation: [base.domains.accessibility.validation[0]] } } }, false],
		['packaged accessibility rejects placeholder scan', { ...base, domains: { ...base.domains, accessibility: { ...base.domains.accessibility, validation: [base.domains.accessibility.validation[0], { ...base.domains.accessibility.validation[1], artifact: 'artifacts/TODO-a11y.md', observed: 'Placeholder scan will be completed after release' }] } } }, false],
		['evidence rejects trust me assertion', { ...base, domains: { ...base.domains, security: { ...base.domains.security, evidence: [{ ...base.domains.security.evidence[0], observation: 'Trust me because this candidate has been checked carefully' }] } } }, false],
		['performance regression', { ...base, findings: [{ ...finding, area: 'performance', performanceMeasurement: performanceMeasurement({ metric: 'query duration', before: 180, after: 3200, budget: 250 }) }] }, false],
		['performance misses budget', { ...base, findings: [{ ...finding, area: 'performance', performanceMeasurement: performanceMeasurement({ metric: 'query duration', before: 3200, after: 300, budget: 250 }) }] }, false],
		['performance distribution with provenance', { ...base, findings: [{ ...finding, area: 'performance', performanceMeasurement: performanceMeasurement({ sampleSize: 20, distribution: { p50: 280, p75: 340, p95: 480 }, variance: 40, errorRate: 0, cacheState: 'warm', fieldOrLab: 'lab', provenance: 'Server-Timing benchmark artifact', limitations: 'Synthetic fixture does not represent field traffic' }) }] }, true],
		['performance distribution without sample', { ...base, findings: [{ ...finding, area: 'performance', performanceMeasurement: performanceMeasurement({ distribution: { p50: 280, p95: 480 } }) }] }, false],
		['performance distribution out of order', { ...base, findings: [{ ...finding, area: 'performance', performanceMeasurement: performanceMeasurement({ sampleSize: 20, distribution: { p50: 500, p95: 480 } }) }] }, false],
		['security authorization matrix', { ...base, findings: [{ ...finding, area: 'security', riskFlags: ['authorization_boundary'], negativeTests: [securityNegative()], authorizationMatrix, independentReview }] }, true],
		['security authorization mismatch', { ...base, findings: [{ ...finding, area: 'security', riskFlags: ['authorization_boundary'], negativeTests: [securityNegative()], authorizationMatrix: [{ ...authorizationMatrix[0], observed: 'allow' }] }] }, false],
		['open security authorization mismatch', { ...base, conclusion: 'partial', findings: [{ ...finding, area: 'security', status: 'open', riskFlags: ['authorization_boundary'], authorizationMatrix: [{ ...authorizationMatrix[0], observed: 'allow' }] }] }, true],
		['security authorization flag without matrix', { ...base, findings: [{ ...finding, area: 'security', riskFlags: ['authorization_boundary'], negativeTests: [securityNegative()] }] }, false],
		['resource abuse budget', { ...base, findings: [{ ...finding, area: 'security', riskFlags: ['resource_abuse'], negativeTests: [securityNegative({ check: 'Exercise over-limit request boundary' })], resourceBudget, independentReview }] }, true],
		['resource abuse flag without budget', { ...base, findings: [{ ...finding, area: 'performance', riskFlags: ['resource_abuse'], performanceMeasurement: performanceMeasurement() }] }, false],
		['authorization evidence from another commit', { ...base, findings: [{ ...finding, area: 'security', riskFlags: ['authorization_boundary'], negativeTests: [securityNegative()], authorizationMatrix: [{ ...authorizationMatrix[0], evidence: [{ ...authorizationMatrix[0].evidence[0], identity: { ...identity, commitSha: 'c'.repeat(40) } }] }], independentReview }] }, false],
		['resource evidence from another commit', { ...base, findings: [{ ...finding, area: 'security', riskFlags: ['resource_abuse'], negativeTests: [securityNegative()], resourceBudget: { ...resourceBudget, evidence: [{ ...resourceBudget.evidence[0], identity: { ...identity, commitSha: 'c'.repeat(40) } }] }, independentReview }] }, false],
		['high traffic release needs elevated proof', { ...base, qualityTarget: 'High-traffic release quality gate', assuranceProfile: { level: 'elevated', risks: ['high_traffic'] } }, false],
		['high traffic release with complete proof', { ...base, qualityTarget: 'High-traffic release quality gate', assuranceProfile: { level: 'elevated', risks: ['high_traffic'] }, domains: { ...base.domains, security: { ...base.domains.security, resourceBudget }, performance: { ...base.domains.performance, capacityEnvelope, validation: [{ ...base.domains.performance.validation[0], performanceMeasurement: elevatedMeasurement, performanceChecks: elevatedPerformanceChecks }] } } }, true],
		['high traffic text cannot claim standard assurance', { ...base, qualityTarget: 'High-traffic release quality gate', assuranceProfile: { level: 'standard', risks: [] } }, false],
		['public multi-tenant REST scope cannot omit risks', { ...base, scope: { targets: ['Public multi-tenant bulk REST package'], exclusions: [] }, assuranceProfile: { level: 'elevated', risks: [] } }, false],
		['public multi-tenant REST scope needs trust and capacity proof', { ...base, scope: { targets: ['Public multi-tenant bulk REST package'], exclusions: [] }, assuranceProfile: { level: 'elevated', risks: ['public_api', 'multi_tenant'] } }, false],
		['custom-table migration scope needs fixed migration proof', { ...base, scope: { targets: ['Custom-table migration release package'], exclusions: [] }, assuranceProfile: { level: 'elevated', risks: ['custom_storage', 'migration'] } }, false],
		['legacy file scope needs ratchet proof', { ...base, scope: { targets: ['9,240-line legacy plugin file package'], exclusions: [] }, assuranceProfile: { level: 'elevated', risks: ['legacy_debt'] } }, false],
		['migration finding needs migration plan', { ...base, assuranceProfile: { level: 'elevated', risks: ['migration'] }, findings: [{ ...finding, riskFlags: ['migration'], independentReview }] }, false],
		['migration finding with staged proof', { ...base, assuranceProfile: { level: 'elevated', risks: ['migration'] }, findings: [{ ...finding, riskFlags: ['migration'], migrationPlan, independentReview }] }, true],
		['legacy debt needs ratchet', { ...base, assuranceProfile: { level: 'elevated', risks: ['legacy_debt'] }, findings: [{ ...finding, riskFlags: ['legacy_debt'], independentReview }] }, false],
		['legacy debt no-growth ratchet', { ...base, assuranceProfile: { level: 'elevated', risks: ['legacy_debt'] }, findings: [{ ...finding, riskFlags: ['legacy_debt'], modularityRatchet: { metric: 'file lines', baseline: 9240, after: 9230, budget: 9240, posture: 'no_growth' }, independentReview }] }, true],
		['package empty digest', { ...base, targetIdentity: { ...base.targetIdentity, artifact: { path: 'dist/plugin.zip', sha256: '' } } }, false],
		['pass with partial domain', { ...base, domains: { ...base.domains, security: { ...base.domains.security, disposition: 'partial' } } }, false],
	];
	for (const [name, report, expected] of cases) {
		let passed = false;
		try { passed = validate(report).length === 0; } catch (error) { throw new Error(`self-test crashed: ${name}: ${error.message}`); }
		if (passed !== expected) throw new Error(`self-test failed: ${name} (${validate(report).join('; ')})`);
	}
	console.log('quality review validator self-test passed');
}

async function main() {
	const arg = process.argv[2];
	if (arg === '--self-test') return runSelfTest();
	if (!arg) {
		console.error('usage: validate-review-report.mjs <report.json> | --self-test');
		process.exitCode = 2;
		return;
	}
	let report;
	try {
		report = JSON.parse(fs.readFileSync(arg, 'utf8'));
	} catch (error) {
		console.error(`ERROR: cannot read valid JSON from ${arg}: ${error.message}`);
		process.exitCode = 1;
		return;
	}
	const errors = validate(report);
	if (errors.length > 0) {
		for (const error of errors) console.error(`ERROR: ${error}`);
		process.exitCode = 1;
		return;
	}
	const scope = report.accessibilityClaim === 'scoped_review' ? ' (scoped accessibility review, not WCAG conformance)'
		: report.accessibilityClaim === 'wcag22_aa_conformance' ? ' (formal AA evidence record; inspect artifacts before any conformance claim)' : '';
	console.log(`quality review valid: ${arg}${scope}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
