#!/usr/bin/env node

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
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
const EXCLUSION_PLACEHOLDER = /\b(?:todo|tbd|placeholder|unknown|not specified|trust me)\b/i;

function validateVoiceOverExclusion(value, prefix = 'voiceOverExclusion') {
	const errors = [];
	if (value === undefined) return errors;
	if (!isObject(value)) return [`${prefix} must be an object`];
	const allowed = new Set(['status', 'authority', 'reason', 'claims']);
	for (const key of Object.keys(value)) if (!allowed.has(key)) errors.push(`${prefix}.${key} is not allowed`);
	if (value.status !== 'excluded_by_owner') errors.push(`${prefix}.status must be excluded_by_owner`);
	if (typeof value.authority !== 'string' || value.authority.trim().length < 12 || EXCLUSION_PLACEHOLDER.test(value.authority)) errors.push(`${prefix}.authority must be a meaningful owner-directive pointer`);
	if (typeof value.reason !== 'string' || value.reason.trim().length < 12 || EXCLUSION_PLACEHOLDER.test(value.reason)) errors.push(`${prefix}.reason must be concrete and non-placeholder`);
	if (value.claims !== 'not_verified') errors.push(`${prefix}.claims must be not_verified`);
	return errors;
}

const KEYS = {
	top: new Set(['schemaVersion', 'mode', 'targetIdentity', 'scope', 'qualityTarget', 'assuranceProfile', 'accessibilityClaim', 'accessibilityAudit', 'voiceOverExclusion', 'domains', 'findings', 'proofGaps', 'conclusion']),
	target: new Set(['kind', 'repository', 'commitSha', 'baseCommitSha', 'artifact']),
	artifact: new Set(['path', 'sha256']),
	scope: new Set(['targets', 'exclusions']),
	domain: new Set(['disposition', 'evidence', 'validation', 'reason', 'authorizationMatrix', 'resourceBudget', 'capacityEnvelope', 'migrationPlan', 'legacyDebtPaths', 'modularityRatchets', 'webhookScope']),
	finding: new Set(['id', 'area', 'severity', 'status', 'riskFlags', 'evidence', 'impact', 'remediation', 'validation', 'performanceMeasurement', 'authorizationMatrix', 'resourceBudget', 'negativeTests', 'behaviorChecks', 'contractChecks', 'migrationPlan', 'modularityRatchet', 'manualChecks', 'aaaAdvisoryCriteria', 'independentReview', 'riskAcceptance']),
	evidence: new Set(['kind', 'pointer', 'observation', 'environment', 'identity']),
	validation: new Set(['kind', 'check', 'expected', 'observed', 'expectedState', 'observedState', 'result', 'environment', 'artifact', 'artifactSha256', 'identity', 'claim', 'browser', 'assistiveTechnology', 'performanceMeasurement', 'securityCases', 'contractCases', 'performanceChecks']),
	measurement: new Set([
		'metric',
		'statistic',
		'improvementClaim',
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
	notApplicable: new Set(['status', 'reason']),
	webhookScope: new Set(['handler', 'action', 'resource', 'deniedActor', 'effect', 'effectReason', 'workload', 'workloadReason', 'workScope']),
	capacityStorage: new Set(['currentBytes', 'projectedBytes', 'restoreSeconds', 'restoreBudgetSeconds']),
	independentReview: new Set(['kind', 'runId', 'reviewedCommitSha', 'result', 'evidence']),
	assuranceProfile: new Set(['level', 'risks']),
	migrationPlan: new Set(['strategy', 'expandCheck', 'backfillCheck', 'idempotencyCheck', 'rollbackCheck', 'contractStatus', 'cleanupIssue', 'ownerApproval']),
	modularityRatchet: new Set(['metric', 'baseline', 'after', 'budget', 'posture', 'owner', 'issue', 'rationale']),
	typedRatchet: new Set(['path', 'measurements', 'evidence']),
	ratchetMeasurements: new Set(['logicalFileLines', 'oversizedMethodCount', 'largestChangedMethod']),
	ratchetMetric: new Set(['baseline', 'after', 'budget', 'posture', 'owner', 'issue', 'rationale', 'ownerApproval', 'approvalScope']),
	ratchetApprovalScope: new Set(['owner', 'path', 'metric', 'budget']),
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

function validatePerformanceChecks(checks, prefix, errors, requiredKinds = [], mustPass = true) {
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
		if (!['pass', 'fail', 'blocked'].includes(check.result)) errors.push(`${checkPrefix}.result is invalid`);
		else if (mustPass && check.result !== 'pass') errors.push(`${checkPrefix}.result must pass`);
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
	if (receipt.claim !== undefined && !['security_negative', 'performance_comparable', 'modularity_behavior', 'accessibility_manual', 'accessibility_keyboard', 'accessibility_automated', 'contract_compatibility', 'migration_step'].includes(receipt.claim)) errors.push(`${prefix}.claim is invalid`);
	const states = ['allow', 'deny', 'reject', 'sanitize', 'preserve', 'within_budget', 'accessible', 'success', 'failure', 'blocked'];
	if (receipt.expectedState !== undefined && !states.includes(receipt.expectedState)) errors.push(`${prefix}.expectedState is invalid`);
	if (receipt.observedState !== undefined && !states.includes(receipt.observedState)) errors.push(`${prefix}.observedState is invalid`);
	if (receipt.result === 'pass' && receipt.expectedState !== undefined && receipt.expectedState !== receipt.observedState) errors.push(`${prefix} pass requires observedState to match expectedState`);
	if (receipt.claim === 'security_negative' && !['deny', 'reject', 'sanitize'].includes(receipt.expectedState)) errors.push(`${prefix}.expectedState must be deny, reject, or sanitize for security_negative proof`);
	if (receipt.claim === 'performance_comparable') {
		if (receipt.expectedState !== 'within_budget') errors.push(`${prefix}.expectedState must be within_budget for performance_comparable proof`);
		if (!['within_budget', 'failure', 'blocked'].includes(receipt.observedState)) errors.push(`${prefix}.observedState must describe the performance outcome`);
		if (receipt.performanceMeasurement === undefined) errors.push(`${prefix}.performanceMeasurement is required for performance_comparable proof`);
	}
	if (['modularity_behavior', 'contract_compatibility'].includes(receipt.claim) && receipt.expectedState !== 'preserve') errors.push(`${prefix}.expectedState must be preserve for contract proof`);
	if (['accessibility_manual', 'accessibility_keyboard', 'accessibility_automated'].includes(receipt.claim) && receipt.expectedState !== 'accessible') errors.push(`${prefix}.expectedState must be accessible for accessibility proof`);
	if (receipt.claim === 'accessibility_keyboard') {
		if (!['browser', 'manual'].includes(receipt.kind)) errors.push(`${prefix}.kind must be browser or manual for keyboard-only proof`);
		if (!meaningfulText(receipt.browser, 3, 1) || GENERIC_BROWSER.test(receipt.browser.trim())) errors.push(`${prefix}.browser must name the keyboard-test browser`);
		if (!nonEmpty(receipt.environment) || !nonEmpty(receipt.artifact) || receipt.identity === undefined) errors.push(`${prefix} keyboard proof requires environment, artifact, and candidate identity`);
		if (!['accessible', 'failure', 'blocked'].includes(receipt.observedState)) errors.push(`${prefix}.observedState must be accessible, failure, or blocked for keyboard-only proof`);
		if (receipt.result === 'pass' && receipt.observedState !== 'accessible') errors.push(`${prefix}.observedState must be accessible for passing keyboard-only proof`);
		if (receipt.assistiveTechnology !== undefined) errors.push(`${prefix} keyboard proof cannot claim assistiveTechnology`);
	}
	if (receipt.claim === 'accessibility_automated' && !SHA256.test(receipt.artifactSha256 ?? '')) errors.push(`${prefix}.artifactSha256 is required for automated accessibility proof`);
	if (receipt.browser !== undefined && (!meaningfulText(receipt.browser, 3, 1) || GENERIC_BROWSER.test(receipt.browser.trim()))) errors.push(`${prefix}.browser must name a supported browser`);
	if (receipt.assistiveTechnology !== undefined && (!meaningfulText(receipt.assistiveTechnology, 3, 1) || GENERIC_ASSISTIVE_TECHNOLOGY.test(receipt.assistiveTechnology.trim()))) errors.push(`${prefix}.assistiveTechnology must name an assistive technology`);
	if (receipt.performanceMeasurement !== undefined) validatePerformanceMeasurement(receipt.performanceMeasurement, `${prefix}.performanceMeasurement`, errors, { outcome: receipt.result === 'pass', budgetLabel: receipt.expected });
	if (receipt.securityCases !== undefined) validateSecurityCases(receipt.securityCases, `${prefix}.securityCases`, errors);
	if (receipt.contractCases !== undefined) validateContractCases(receipt.contractCases, `${prefix}.contractCases`, errors);
	if (receipt.performanceChecks !== undefined) validatePerformanceChecks(receipt.performanceChecks, `${prefix}.performanceChecks`, errors, [], receipt.result === 'pass');
	if (receipt.claim === 'security_negative') {
		validateSecurityCases(receipt.securityCases, `${prefix}.securityCases`, errors);
		for (const [index, check] of (Array.isArray(receipt.securityCases) ? receipt.securityCases : []).entries()) {
			if (check?.expected !== receipt.expectedState || check?.observed !== receipt.observedState) errors.push(`${prefix}.securityCases[${index}] outcome must match receipt boundary outcome`);
		}
	}
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

function validateCapacityEnvelope(envelope, prefix, errors, target, requireBinding = false, risks = []) {
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
		else if (['queue', 'fairness'].includes(key) && envelope[key].status === 'not_applicable') {
			checkKeys(envelope[key], KEYS.notApplicable, `${prefix}.${key}`, errors);
			if (!meaningfulText(envelope[key].reason)) errors.push(`${prefix}.${key}.reason must justify not_applicable`);
			if (risks.includes(key === 'queue' ? 'async_queue' : 'multi_tenant')) errors.push(`${prefix}.${key} cannot be not_applicable for declared ${key === 'queue' ? 'async_queue' : 'multi_tenant'} risk`);
		} else checkKeys(envelope[key], keys, `${prefix}.${key}`, errors);
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
	if (envelope.fairness?.status !== 'not_applicable') {
	if (!meaningfulText(envelope.fairness?.scope, 4, 1)) errors.push(`${prefix}.fairness.scope is required`);
	if (!Number.isFinite(envelope.fairness?.limit) || envelope.fairness.limit <= 0 || !nonEmpty(envelope.fairness?.unit)) errors.push(`${prefix}.fairness requires a positive limit and unit`);
	}
	if (envelope.queue?.status !== 'not_applicable') {
	for (const key of ['arrivalRate', 'serviceRate', 'maxBacklog', 'observedBacklog', 'drainSeconds', 'drainBudgetSeconds']) {
		if (!Number.isFinite(envelope.queue?.[key]) || envelope.queue[key] < 0) errors.push(`${prefix}.queue.${key} must be a non-negative number`);
	}
	if (Number.isFinite(envelope.queue?.arrivalRate) && Number.isFinite(envelope.queue?.serviceRate) && envelope.queue.serviceRate <= envelope.queue.arrivalRate) errors.push(`${prefix}.queue.serviceRate must exceed arrivalRate`);
	if (Number.isFinite(envelope.queue?.observedBacklog) && Number.isFinite(envelope.queue?.maxBacklog) && envelope.queue.observedBacklog > envelope.queue.maxBacklog) errors.push(`${prefix}.queue.observedBacklog exceeds maxBacklog`);
	if (Number.isFinite(envelope.queue?.drainSeconds) && Number.isFinite(envelope.queue?.drainBudgetSeconds) && envelope.queue.drainSeconds > envelope.queue.drainBudgetSeconds) errors.push(`${prefix}.queue.drainSeconds exceeds drainBudgetSeconds`);
	}
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

function validatePerformanceMeasurement(measurement, prefix, errors, { comparable = false, elevated = false, outcome = false, improvement = false, budgetLabel = '' } = {}) {
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
	const statistics = ['single', 'mean', 'median', 'p50', 'p75', 'p95', 'p99'];
	if (measurement.statistic !== undefined && !statistics.includes(measurement.statistic)) errors.push(`${prefix}.statistic is invalid`);
	if (measurement.improvementClaim !== undefined && typeof measurement.improvementClaim !== 'boolean') errors.push(`${prefix}.improvementClaim must be boolean`);
	const explicitBudgetLabel = String(budgetLabel ?? '').match(/\b(?:p\s*(?:100|\d{1,2})|(?:100|\d{1,2})(?:st|nd|rd|th)?[\s-]+percentile)\b(?:(?!\bp\s*\d+\b).){0,40}\bbudget\b|\bbudget\s+(?:for|target(?:s|ing)?|of)\s+(?:p\s*(?:100|\d{1,2})|(?:100|\d{1,2})(?:st|nd|rd|th)?[\s-]+percentile)\b/gi)?.join(' ') ?? '';
	const namedPercentiles = [measurement.metric, explicitBudgetLabel].flatMap((label) => [...String(label ?? '').matchAll(/\b(?:p\s*(100|\d{1,2})|(100|\d{1,2})(?:st|nd|rd|th)?[\s-]+percentile)\b/gi)].map((match) => `p${match[1] ?? match[2]}`));
	const statistic = measurement.statistic === 'median' ? 'p50' : measurement.statistic;
	if (namedPercentiles.some((name) => name !== statistic)) errors.push(`${prefix}.statistic must match the percentile named in metric or budget`);
	const minimumObservations = { p50: 2, p75: 4, p95: 20, p99: 100 };
	if (Object.hasOwn(minimumObservations, statistic) && (measurement.statistic !== 'median' || elevated || measurement.distribution !== undefined)) {
		if (!Number.isInteger(measurement.sampleSize) || measurement.sampleSize < minimumObservations[statistic]) errors.push(`${prefix}.sampleSize must count at least ${minimumObservations[statistic]} observations for ${measurement.statistic}`);
		if (!Number.isFinite(measurement.distribution?.[statistic]) || measurement.after !== measurement.distribution[statistic]) errors.push(`${prefix}.after must equal the candidate distribution statistic`);
		if (!Number.isFinite(measurement.variance)) errors.push(`${prefix}.variance is required for percentile evidence`);
		if (!meaningfulText(measurement.provenance, 8, 2)) errors.push(`${prefix}.provenance is required for percentile evidence`);
	}
	if (elevated && measurement.statistic === undefined) errors.push(`${prefix}.statistic is required for elevated proof`);
	if (elevated && ['mean', 'single'].includes(measurement.statistic)) errors.push(`${prefix}.statistic must identify a distribution percentile for elevated tail proof`);
	if ((outcome || improvement || measurement.improvementClaim === true) && Number.isFinite(measurement.before) && Number.isFinite(measurement.after) && Number.isFinite(measurement.budget)) {
		const lower = measurement.direction === 'lower_is_better';
		const within = lower ? measurement.after <= measurement.budget : measurement.after >= measurement.budget;
		const nonregression = lower ? measurement.after <= measurement.before : measurement.after >= measurement.before;
		const improved = lower ? measurement.after < measurement.before : measurement.after > measurement.before;
		if (!within || !nonregression) errors.push(`${prefix} must meet budget without regression`);
		if ((improvement || measurement.improvementClaim === true) && !improved) errors.push(`${prefix} must strictly improve for a fixed finding or improvement claim`);
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
		for (const [statistic, minimum] of Object.entries(minimumObservations)) {
			if (measurement.distribution?.[statistic] !== undefined && (!Number.isInteger(measurement.sampleSize) || measurement.sampleSize < minimum)) errors.push(`${prefix}.distribution.${statistic} requires at least ${minimum} observations`);
		}
		if (measurement.sampleSize === undefined) {
			errors.push(`${prefix}.distribution requires sampleSize observations`);
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
		if (!isObject(measurement.distribution) || Object.keys(measurement.distribution).length === 0) errors.push(`${prefix}.distribution is required for elevated proof`);
		if (!Number.isInteger(measurement.sampleSize) || measurement.sampleSize < 2) errors.push(`${prefix}.sampleSize must count at least 2 observations for elevated proof`);
		if (!Number.isFinite(measurement.variance)) errors.push(`${prefix}.variance is required for elevated proof`);
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
	const targetText = [report.qualityTarget, ...(Array.isArray(report.scope?.targets) ? report.scope.targets : [])].join('; ');
	// A negated scope is not a risk declaration. Do not erase "no queue limits" or a second, real queue.
	const capacityText = targetText.replace(/\b(?:no|without(?: an?)?)\s+(?:async(?:hronous)?\s+)?(?:queues?|background jobs?)\b(?=\s*(?:[.,;)]|$|\band\b))/gi, '')
		.replace(/\b(?:not\s+(?:a\s+)?|non[- ])multi[- ]tenant\b/gi, '');
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
	const declared = inferred.filter(([risk, pattern]) => pattern.test(['async_queue', 'multi_tenant'].includes(risk) ? capacityText : targetText));
	for (const [risk] of declared) {
		if (!risks.includes(risk)) errors.push(`assuranceProfile.risks must include ${risk} because scope declares it`);
	}
	if (declared.length && profile.level !== 'elevated') errors.push('assuranceProfile.level must be elevated for the stated risk profile');
	return risks;
}

function validateMigrationPlan(plan, prefix, errors, target, requireBinding, mustPass) {
	if (!isObject(plan)) {
		errors.push(`${prefix} is required for a migration finding`);
		return;
	}
	checkKeys(plan, KEYS.migrationPlan, prefix, errors);
	if (plan.strategy !== 'expand_migrate_contract') errors.push(`${prefix}.strategy must be expand_migrate_contract`);
	for (const key of ['expandCheck', 'backfillCheck', 'idempotencyCheck', 'rollbackCheck']) {
		validateValidationReceipt(plan[key], `${prefix}.${key}`, errors);
		if (plan[key]?.claim !== 'migration_step') errors.push(`${prefix}.${key}.claim must be migration_step`);
		if (mustPass && plan[key]?.result !== 'pass') errors.push(`${prefix}.${key} must pass for a passing domain or fixed finding`);
		validateCandidateBinding(plan[key], target, `${prefix}.${key}`, errors, { required: requireBinding });
	}
	if (!['deferred', 'owner_approved'].includes(plan.contractStatus)) errors.push(`${prefix}.contractStatus is invalid`);
	if (plan.contractStatus === 'deferred' && (!nonEmpty(plan.cleanupIssue) || !LOCATOR.test(plan.cleanupIssue))) errors.push(`${prefix}.cleanupIssue must locate deferred contract work`);
	if (plan.contractStatus === 'owner_approved') {
		validateEvidenceReceipt(plan.ownerApproval, `${prefix}.ownerApproval`, errors);
		if (plan.ownerApproval?.kind !== 'owner') errors.push(`${prefix}.ownerApproval.kind must be owner`);
		validateCandidateBinding(plan.ownerApproval, target, `${prefix}.ownerApproval`, errors, { required: requireBinding });
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

function isRepositoryFilePath(path) {
	if (!nonEmpty(path) || path !== path.trim() || /[\\:#?\x00-\x1f]/.test(path) || path.startsWith('/')) return false;
	const segments = path.split('/');
	return segments.every((segment) => segment !== '' && segment !== '.' && segment !== '..')
		&& !/^(?:issues|pull|pulls)\/\d+$/i.test(path);
}

function validateTypedRatchets(ratchets, prefix, errors, target, requireBinding) {
	if (!Array.isArray(ratchets) || ratchets.length === 0) {
		errors.push(`${prefix} requires at least one path-specific ratchet`);
		return;
	}
	const paths = new Set();
	for (const [index, ratchet] of ratchets.entries()) {
		const p = `${prefix}[${index}]`;
		if (!isObject(ratchet)) {
			errors.push(`${p} must be an object`);
			continue;
		}
		checkKeys(ratchet, KEYS.typedRatchet, p, errors);
		if (!isRepositoryFilePath(ratchet.path)) errors.push(`${p}.path must be a repository-relative file path`);
		if (paths.has(ratchet.path)) errors.push(`${p}.path must be unique`);
		paths.add(ratchet.path);
		validateReceiptList(ratchet.evidence, `${p}.evidence`, errors, validateEvidenceReceipt, 1);
		for (const [i, receipt] of (Array.isArray(ratchet.evidence) ? ratchet.evidence : []).entries()) {
			validateCandidateBinding(receipt, target, `${p}.evidence[${i}]`, errors, { required: requireBinding });
		}
		if (!isObject(ratchet.measurements)) {
			errors.push(`${p}.measurements is required`);
			continue;
		}
		checkKeys(ratchet.measurements, KEYS.ratchetMeasurements, `${p}.measurements`, errors);
		for (const key of KEYS.ratchetMeasurements) {
			const metric = ratchet.measurements[key];
			const mp = `${p}.measurements.${key}`;
			if (!isObject(metric)) {
				errors.push(`${mp} is required`);
				continue;
			}
			checkKeys(metric, KEYS.ratchetMetric, mp, errors);
			for (const field of ['baseline', 'after', 'budget']) {
				if (!Number.isInteger(metric[field]) || metric[field] < 0) errors.push(`${mp}.${field} must be a non-negative integer`);
			}
			if (!['reduced', 'no_growth', 'exception'].includes(metric.posture)) errors.push(`${mp}.posture is invalid`);
			if (metric.posture === 'reduced' && !(metric.after < metric.baseline && metric.after <= metric.budget)) errors.push(`${mp} reduced posture must reduce debt within budget`);
			if (metric.posture === 'no_growth' && !(metric.after <= metric.baseline && metric.after <= metric.budget)) errors.push(`${mp} no_growth posture must not increase debt or exceed budget`);
			if (metric.posture === 'exception') {
				if (!(metric.after <= metric.budget)) errors.push(`${mp} exception must remain within the approved budget`);
				if (!meaningfulText(metric.owner, 2, 1)) errors.push(`${mp}.owner is required for an exception`);
				if (!meaningfulText(metric.issue, 5, 1) || !LOCATOR.test(metric.issue)) errors.push(`${mp}.issue must locate the tracked exception`);
				if (!meaningfulText(metric.rationale, 8, 2)) errors.push(`${mp}.rationale is required for an exception`);
				validateEvidenceReceipt(metric.ownerApproval, `${mp}.ownerApproval`, errors);
				if (metric.ownerApproval?.kind !== 'owner') errors.push(`${mp}.ownerApproval.kind must be owner`);
				validateCandidateBinding(metric.ownerApproval, target, `${mp}.ownerApproval`, errors, { required: requireBinding });
				if (!isObject(metric.approvalScope)) {
					errors.push(`${mp}.approvalScope is required for an exception`);
				} else {
					checkKeys(metric.approvalScope, KEYS.ratchetApprovalScope, `${mp}.approvalScope`, errors);
					for (const [field, value] of Object.entries({ owner: metric.owner, path: ratchet.path, metric: key, budget: metric.budget })) {
						if (metric.approvalScope[field] !== value) errors.push(`${mp}.approvalScope.${field} must match the approved exception`);
					}
				}
			}
		}
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
	errors.push(...validateVoiceOverExclusion(report.voiceOverExclusion));
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
		if (area === 'performance' && domain.disposition === 'pass' && Array.isArray(domain.validation) && domain.validation.some((receipt) => receipt?.claim === 'performance_comparable' && receipt.result !== 'pass')) errors.push('passing performance domain cannot contain a failed or blocked primary performance receipt');
		if (area === 'performance' && report.conclusion === 'pass' && ['fail', 'partial'].includes(domain.disposition)) errors.push('passing report cannot contain a failed or partial performance domain');
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
		const requiredClaim = area === 'accessibility' && report.voiceOverExclusion
			? 'accessibility_keyboard' : RELEASE_VALIDATION_CLAIMS[area];
		const candidates = releasePass && Array.isArray(domain.validation)
			? domain.validation.filter((receipt) => receipt?.claim === requiredClaim && RELEASE_VALIDATION_KINDS[area]?.has(receipt.kind) && receipt.result === 'pass' && receipt.expectedState === receipt.observedState && receipt.identity?.commitSha === report.targetIdentity.commitSha && receipt.identity?.artifactSha256 === report.targetIdentity.artifact?.sha256 && nonEmpty(receipt.artifact) && LOCATOR.test(receipt.artifact)) : [];
		const performanceProofErrors = (receipt) => {
			const proofErrors = [];
			if (!receipt.performanceMeasurement) proofErrors.push('domains.performance.validation requires a comparable performanceMeasurement');
			else validatePerformanceMeasurement(receipt.performanceMeasurement, 'domains.performance.validation.performanceMeasurement', proofErrors, { comparable: true, elevated: elevatedPerformance, outcome: true, budgetLabel: receipt.expected });
			if (elevatedPerformance) validatePerformanceChecks(receipt.performanceChecks, 'domains.performance.validation.performanceChecks', proofErrors, ['tail', 'overload', 'recovery', 'cache', 'capacity']);
			return proofErrors;
		};
		const claimedProof = candidates.find((receipt) => area !== 'performance' || performanceProofErrors(receipt).length === 0);
		if (releasePass && area === 'performance' && !claimedProof && candidates.length) errors.push(...performanceProofErrors(candidates[0]));
		if (releasePass && !claimedProof) errors.push(`domains.${area}.validation requires ${requiredClaim} proof on a release-appropriate candidate-bound receipt`);
		if (releasePass && area === 'security' && claimedProof) validateSecurityCases(claimedProof.securityCases, 'domains.security.validation.securityCases', errors);
		if (releasePass && area === 'modularity' && claimedProof) validateContractCases(claimedProof.contractCases, 'domains.modularity.validation.contractCases', errors);
		if (area === 'security' && domain.authorizationMatrix !== undefined) validateAuthorizationMatrix(domain.authorizationMatrix, `domains.${area}.authorizationMatrix`, errors, releasePass, report.targetIdentity, releasePass);
		if (area === 'security' && domain.resourceBudget !== undefined) validateResourceBudget(domain.resourceBudget, `domains.${area}.resourceBudget`, errors, report.targetIdentity, releasePass);
		if (area === 'performance' && domain.capacityEnvelope !== undefined) validateCapacityEnvelope(domain.capacityEnvelope, `domains.${area}.capacityEnvelope`, errors, report.targetIdentity, releasePass, assuranceRisks);
		if (area !== 'security' && domain.authorizationMatrix !== undefined) errors.push(`domains.${area}.authorizationMatrix is only valid for security`);
		if (area !== 'security' && domain.resourceBudget !== undefined) errors.push(`domains.${area}.resourceBudget is only valid for security`);
		if (area === 'modularity' && domain.migrationPlan !== undefined) validateMigrationPlan(domain.migrationPlan, `domains.${area}.migrationPlan`, errors, report.targetIdentity, releasePass, domain.disposition === 'pass');
		if (area === 'modularity' && domain.modularityRatchets !== undefined) validateTypedRatchets(domain.modularityRatchets, `domains.${area}.modularityRatchets`, errors, report.targetIdentity, releasePass);
		if (area === 'modularity' && domain.legacyDebtPaths !== undefined) {
			const paths = domain.legacyDebtPaths;
			if (!Array.isArray(paths) || paths.length === 0 || paths.some((path) => !isRepositoryFilePath(path)) || new Set(paths).size !== paths.length) errors.push(`domains.${area}.legacyDebtPaths must list distinct affected file paths`);
		}
		if (area !== 'modularity' && (domain.migrationPlan !== undefined || domain.modularityRatchets !== undefined || domain.legacyDebtPaths !== undefined)) errors.push(`domains.${area} modularity evidence is only valid for modularity`);
		if (area !== 'performance' && domain.capacityEnvelope !== undefined) errors.push(`domains.${area}.capacityEnvelope is only valid for performance`);
		if (domain.webhookScope !== undefined) {
			if (area !== 'security' || !assuranceRisks.includes('external_webhook') || !isObject(domain.webhookScope)) errors.push('webhookScope is only valid for a declared external_webhook security scope');
			else {
				const scope = domain.webhookScope;
				checkKeys(scope, KEYS.webhookScope, 'domains.security.webhookScope', errors);
				if (!['mutating', 'privileged_read', 'read_only'].includes(scope.effect) || !meaningfulText(scope.effectReason)) errors.push('domains.security.webhookScope requires an effect and concrete effectReason');
				if (!['abuse_prone', 'bounded'].includes(scope.workload) || !meaningfulText(scope.workloadReason)) errors.push('domains.security.webhookScope requires workload applicability and concrete workloadReason');
				for (const key of ['handler', 'action', 'resource']) {
					if (!meaningfulText(scope[key], 3, 1)) errors.push(`domains.security.webhookScope.${key} must identify the webhook operation`);
				}
				const privileged = ['mutating', 'privileged_read'].includes(scope.effect);
				if (privileged && !meaningfulText(scope.deniedActor, 3, 1)) errors.push('domains.security.webhookScope.deniedActor is required for a privileged or mutating webhook');
				if (scope.effect === 'read_only' && scope.deniedActor !== undefined) errors.push('webhookScope read_only cannot declare a privileged deniedActor');
				if (scope.workload === 'abuse_prone' && !meaningfulText(scope.workScope, 8, 2)) errors.push('domains.security.webhookScope.workScope is required for an abuse-prone webhook');
				if (scope.workload === 'bounded' && scope.workScope !== undefined) errors.push('webhookScope bounded cannot declare an abuse-prone workScope');
				if (releasePass && privileged && !(Array.isArray(domain.authorizationMatrix) && domain.authorizationMatrix.some((row) => row?.actor === scope.deniedActor && row?.action === scope.action && row?.resource === scope.resource && row?.expected === 'deny' && row?.observed === 'deny'))) errors.push('domains.security.authorizationMatrix requires a matching denied actor, action and resource for the webhook');
				if (releasePass && scope.workload === 'abuse_prone' && (!isObject(domain.resourceBudget) || domain.resourceBudget.scope !== scope.workScope)) errors.push('domains.security.resourceBudget.scope must match the webhook workScope');
			}
		}
		if (releasePass && area === 'security' && assuranceRisks.includes('external_webhook') && domain.webhookScope === undefined) errors.push('domains.security.webhookScope is required for external webhook applicability');
		if (releasePass && area === 'security' && assuranceRisks.some((risk) => ['public_api', 'sensitive_data', 'multi_tenant'].includes(risk)) && domain.authorizationMatrix === undefined) errors.push('domains.security.authorizationMatrix is required for declared trust-boundary risk');
		if (releasePass && area === 'security' && assuranceRisks.some((risk) => ['public_api', 'high_traffic', 'async_queue', 'multi_tenant'].includes(risk)) && domain.resourceBudget === undefined) errors.push('domains.security.resourceBudget is required for declared abuse or scale risk');
		if (releasePass && area === 'performance' && elevatedPerformance && domain.capacityEnvelope === undefined) errors.push('domains.performance.capacityEnvelope is required for declared scale risk');
		if (releasePass && area === 'accessibility' && (
			!meaningfulText(claimedProof?.browser, 3, 1)
			|| GENERIC_BROWSER.test(claimedProof.browser.trim())
			|| (!report.voiceOverExclusion && (!meaningfulText(claimedProof?.assistiveTechnology, 3, 1)
				|| GENERIC_ASSISTIVE_TECHNOLOGY.test(claimedProof.assistiveTechnology.trim())))
		)) {
			errors.push(report.voiceOverExclusion
				? 'domains.accessibility.validation requires named browser keyboard proof'
				: 'domains.accessibility.validation requires named browser and assistiveTechnology proof');
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
		if (finding.area === 'performance' && (finding.performanceMeasurement !== undefined || finding.status === 'fixed')) validatePerformanceMeasurement(finding.performanceMeasurement, `${prefix}.performanceMeasurement`, errors, { comparable: releaseFix, elevated: releaseFix && elevatedPerformance, improvement: finding.status === 'fixed' });
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
		if (finding.riskFlags?.includes('migration')) validateMigrationPlan(finding.migrationPlan, `${prefix}.migrationPlan`, errors, report.targetIdentity, releaseFix, finding.status === 'fixed');
		if (finding.riskFlags?.includes('legacy_debt')) {
			if (Array.isArray(finding.modularityRatchet)) validateTypedRatchets(finding.modularityRatchet, `${prefix}.modularityRatchet`, errors, report.targetIdentity, releaseFix);
			else {
				validateModularityRatchet(finding.modularityRatchet, `${prefix}.modularityRatchet`, errors);
				if (releaseFix) errors.push(`${prefix}.modularityRatchet requires typed path-specific measurements for a package pass`);
			}
		}
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
	if (report.targetIdentity?.kind === 'package' && report.conclusion === 'pass' && assuranceRisks.includes('migration') && !findings.some((finding) => finding?.status === 'fixed' && finding.riskFlags?.includes('migration')) && !domains.modularity?.migrationPlan) errors.push('packaged migration pass requires modularity migrationPlan proof or a fixed migration finding');
	if (report.targetIdentity?.kind === 'package' && report.conclusion === 'pass' && assuranceRisks.includes('legacy_debt')) {
		const domain = domains.modularity;
		const paths = domain?.legacyDebtPaths;
		if (domain?.disposition !== 'pass' || !Array.isArray(paths) || paths.length === 0) {
			errors.push('packaged legacy-debt pass requires a passing modularity domain and legacyDebtPaths inventory');
		} else {
			const domainRatchets = Array.isArray(domain.modularityRatchets) ? domain.modularityRatchets : [];
			const findingRatchets = findings.filter((finding) => finding?.area === 'modularity' && finding.status === 'fixed' && finding.riskFlags?.includes('legacy_debt') && Array.isArray(finding.modularityRatchet)).flatMap((finding) => finding.modularityRatchet);
			const proofPaths = [...domainRatchets, ...findingRatchets].map((ratchet) => ratchet?.path);
			if (new Set(proofPaths).size !== proofPaths.length) errors.push('packaged legacy-debt proof must not duplicate paths across ratchets');
			if (proofPaths.length !== paths.length || paths.some((path) => !proofPaths.includes(path)) || proofPaths.some((path) => !paths.includes(path))) errors.push('packaged legacy-debt ratchets must cover exactly the legacyDebtPaths inventory');
		}
	}
	if (report.conclusion === 'pass' && unresolvedCritical) errors.push('pass cannot contain an open P0 or P1 finding');
	if (report.conclusion === 'pass' && proofGaps.length > 0) errors.push('pass cannot contain proof gaps');
	if (report.conclusion === 'pass') {
		for (const area of expectedAreas) {
			if (!['pass', 'not_applicable'].includes(domains[area]?.disposition)) errors.push(`pass requires domains.${area} to pass or be justified not_applicable`);
		}
	}
	errors.push(...validateAccessibilityAudit(report, validateValidationReceipt));
	if (isObject(report.accessibilityAudit?.checks)) {
		const formalPass = report.accessibilityClaim === 'wcag22_aa_conformance'
			&& (report.conclusion === 'pass' || domains.accessibility?.disposition === 'pass');
		for (const [id, receipt] of Object.entries(report.accessibilityAudit.checks)) {
			validateCandidateBinding(receipt, report.targetIdentity, `accessibilityAudit.checks.${id}`, errors,
				{ required: formalPass && receipt?.result === 'pass' });
		}
	}
	const keyboardReceipts = [
		...Object.values(domains).flatMap((domain) => Array.isArray(domain?.validation) ? domain.validation : []),
		...(Array.isArray(report.findings) ? report.findings.flatMap((finding) => Array.isArray(finding?.validation) ? finding.validation : []) : []),
		...(isObject(report.accessibilityAudit?.checks) ? Object.values(report.accessibilityAudit.checks) : []),
	];
	for (const receipt of keyboardReceipts.filter((item) => item?.claim === 'accessibility_keyboard')) {
		if (!report.voiceOverExclusion || report.targetIdentity?.kind !== 'package') errors.push('accessibility_keyboard proof requires a packaged report with voiceOverExclusion');
		if (!domains.accessibility?.validation?.includes(receipt)) errors.push('accessibility_keyboard proof must be a domains.accessibility.validation receipt');
	}
	if (report.voiceOverExclusion && (!report.domains?.accessibility || report.domains.accessibility.disposition === 'not_applicable')) {
		errors.push('voiceOverExclusion requires an applicable accessibility domain');
	}
	if (report.voiceOverExclusion && report.targetIdentity?.kind === 'package' && report.conclusion === 'pass') {
		const keyboardProofs = Array.isArray(report.domains?.accessibility?.validation)
			? report.domains.accessibility.validation.filter((receipt) => receipt?.claim === 'accessibility_keyboard') : [];
		if (keyboardProofs.length === 0 || keyboardProofs.some((receipt) => receipt.result !== 'pass')) errors.push('packaged scoped accessibility pass with voiceOverExclusion requires at least one passing accessibility_keyboard receipt');
	}
	return [...new Set(errors)];
}

async function main() {
	const arg = process.argv[2];
	if (arg === '--self-test') {
		const { runSelfTest } = await import('./review-report-self-test.mjs');
		return runSelfTest(validate);
	}
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
	console.log(`quality review valid: ${arg}; candidate conclusion: ${report.conclusion}${scope}`);
}

if (import.meta.main ?? (process.argv[1] && fs.existsSync(process.argv[1])
	&& fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url))) await main();
