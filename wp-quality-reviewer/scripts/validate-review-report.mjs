#!/usr/bin/env node

import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

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
]);
const EVIDENCE_KINDS = new Set(['code', 'git', 'github', 'runtime', 'test', 'browser', 'profile', 'dependency', 'document', 'package', 'public', 'owner']);
const VALIDATION_KINDS = new Set(['static', 'test', 'runtime', 'browser', 'manual', 'profile', 'package']);
const VALIDATION_RESULTS = new Set(['pass', 'fail', 'blocked']);
const ENVIRONMENT_KINDS = new Set(['runtime', 'browser', 'manual', 'profile']);
const REVISION = /^[a-f0-9]{40}$/;
const SHA256 = /^[a-f0-9]{64}$/;
const REPOSITORY = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const LOCATOR = /(?:https?:\/\/|[\/:#@]|^[a-f0-9]{40}$)/i;
const VAGUE = /^(?:all|everything|it|tests?|validation|checks?)\s+(?:good|ok|pass(?:ed)?|work(?:s|ed)?)\.?$/i;

const KEYS = {
	top: new Set(['schemaVersion', 'mode', 'targetIdentity', 'scope', 'qualityTarget', 'domains', 'findings', 'proofGaps', 'conclusion']),
	target: new Set(['kind', 'repository', 'commitSha', 'baseCommitSha', 'artifact']),
	artifact: new Set(['path', 'sha256']),
	scope: new Set(['targets', 'exclusions']),
	domain: new Set(['disposition', 'evidence', 'reason']),
	finding: new Set(['id', 'area', 'severity', 'status', 'riskFlags', 'evidence', 'impact', 'remediation', 'validation', 'performanceMeasurement', 'authorizationMatrix', 'resourceBudget', 'negativeTests', 'behaviorChecks', 'manualChecks', 'independentReview', 'riskAcceptance']),
	evidence: new Set(['kind', 'pointer', 'observation', 'environment', 'identity']),
	validation: new Set(['kind', 'check', 'expected', 'observed', 'result', 'environment', 'artifact']),
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
	]),
	distribution: new Set(['p50', 'p75', 'p95', 'p99']),
	authorizationMatrix: new Set(['actor', 'action', 'resource', 'expected', 'observed', 'evidence']),
	resourceBudget: new Set(['scope', 'limits', 'failureBehavior', 'evidence']),
	resourceLimit: new Set(['name', 'value', 'unit']),
	independentReview: new Set(['kind', 'runId', 'reviewedCommitSha', 'result', 'evidence']),
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
		&& !VAGUE.test(value.trim());
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
	for (const [key, item] of Object.entries(value)) {
		if (!nonEmpty(key) || !nonEmpty(item)) errors.push(`${prefix} contains an empty identity value`);
	}
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

function validateAuthorizationMatrix(matrix, prefix, errors, requireMatch = false) {
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
	}
}

function validateResourceBudget(budget, prefix, errors) {
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
}

function validatePerformanceMeasurement(measurement, prefix, errors) {
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
		} else {
			validateReceiptList(domain.evidence, `domains.${area}.evidence`, errors, validateEvidenceReceipt, 1);
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
		if (!meaningfulText(finding.impact)) errors.push(`${prefix}.impact must explain concrete risk`);
		if (!meaningfulText(finding.remediation)) errors.push(`${prefix}.remediation must explain the corrective action`);
		validateReceiptList(finding.validation, `${prefix}.validation`, errors, validateValidationReceipt, finding.status === 'fixed' ? 1 : 0, finding.status === 'fixed');

		if (finding.status === 'fixed' && finding.area === 'security') validateReceiptList(finding.negativeTests, `${prefix}.negativeTests`, errors, validateValidationReceipt, 1, true);
		if (finding.status === 'fixed' && finding.area === 'performance') validatePerformanceMeasurement(finding.performanceMeasurement, `${prefix}.performanceMeasurement`, errors);
		if (finding.authorizationMatrix !== undefined) {
			if (finding.area !== 'security') errors.push(`${prefix}.authorizationMatrix is only valid for security findings`);
			validateAuthorizationMatrix(finding.authorizationMatrix, `${prefix}.authorizationMatrix`, errors, finding.status === 'fixed');
		}
		if (finding.resourceBudget !== undefined) {
			if (!['security', 'performance'].includes(finding.area)) errors.push(`${prefix}.resourceBudget is only valid for security or performance findings`);
			validateResourceBudget(finding.resourceBudget, `${prefix}.resourceBudget`, errors);
		}
		if (finding.status === 'fixed' && finding.area === 'security' && finding.riskFlags?.includes('authorization_boundary') && finding.authorizationMatrix === undefined) {
			errors.push(`${prefix}.authorizationMatrix is required for an authorization_boundary finding`);
		}
		if (finding.status === 'fixed' && finding.riskFlags?.includes('resource_abuse') && finding.resourceBudget === undefined) {
			errors.push(`${prefix}.resourceBudget is required for a resource_abuse finding`);
		}
		if (finding.status === 'fixed' && finding.area === 'modularity') validateReceiptList(finding.behaviorChecks, `${prefix}.behaviorChecks`, errors, validateValidationReceipt, 1, true);
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
		if (finding.status === 'accepted') {
			validateEvidenceReceipt(finding.riskAcceptance, `${prefix}.riskAcceptance`, errors);
			if (finding.riskAcceptance?.kind !== 'owner') errors.push(`${prefix}.riskAcceptance.kind must be owner`);
		}
	}

	const unresolvedCritical = findings.some((finding) => isObject(finding) && ['P0', 'P1'].includes(finding.severity) && finding.status === 'open');
	if (report.conclusion === 'pass' && unresolvedCritical) errors.push('pass cannot contain an open P0 or P1 finding');
	if (report.conclusion === 'pass' && proofGaps.length > 0) errors.push('pass cannot contain proof gaps');
	if (report.conclusion === 'pass') {
		for (const area of expectedAreas) {
			if (!['pass', 'not_applicable'].includes(domains[area]?.disposition)) errors.push(`pass requires domains.${area} to pass or be justified not_applicable`);
		}
	}
	return [...new Set(errors)];
}

function runSelfTest() {
	const commitSha = 'a'.repeat(40);
	const evidence = (pointer, observation, overrides = {}) => ({ kind: 'code', pointer, observation, ...overrides });
	const validation = (overrides = {}) => ({
		kind: 'test',
		check: 'npm run test:integration',
		expected: 'The protected behavior completes without regression',
		observed: 'All integration assertions completed successfully',
		result: 'pass',
		artifact: 'artifacts/quality-review.log',
		...overrides,
	});
	const domain = (area) => ({
		disposition: 'pass',
		evidence: [evidence(`artifacts/${area}-review.md`, `The ${area} review completed against the identified candidate`) ],
	});
	const finding = {
		id: 'MOD-1', area: 'modularity', severity: 'P2', status: 'fixed',
		evidence: [evidence('src/Policy/CapabilityPolicy.php:18', 'Two entry points duplicated the same capability decision')],
		impact: 'The duplicated policy could diverge during future maintenance',
		remediation: 'Move the policy into one tested service boundary',
		validation: [validation()],
		behaviorChecks: [validation({ check: 'Exercise both public entry points' })],
	};
	const base = {
		schemaVersion: 2,
		mode: 'multi',
		targetIdentity: { kind: 'package', repository: 'owner/plugin', commitSha, artifact: { path: 'dist/plugin.zip', sha256: 'b'.repeat(64) } },
		scope: { targets: ['plugin release candidate'], exclusions: [] },
		qualityTarget: 'Enterprise release quality gate',
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
		['single mode wrong domain', { ...base, mode: 'security', domains: { performance: base.domains.performance }, findings: [] }, false],
		['failed modularity proof', { ...base, findings: [{ ...finding, behaviorChecks: [validation({ result: 'fail' })] }] }, false],
		['vague evidence', { ...base, domains: { ...base.domains, modularity: { disposition: 'pass', evidence: [{ kind: 'code', pointer: 'note-1', observation: 'all good' }] } } }, false],
		['accepted critical without owner receipt', { ...base, findings: [{ ...finding, severity: 'P1', status: 'accepted' }] }, false],
		['critical fix without independent review', { ...base, findings: [{ ...finding, severity: 'P1' }] }, false],
		['critical fix with independent review', { ...base, findings: [{ ...finding, severity: 'P1', independentReview }] }, true],
		['independent review wrong commit', { ...base, findings: [{ ...finding, severity: 'P1', independentReview: { ...independentReview, reviewedCommitSha: 'c'.repeat(40) } }] }, false],
		['performance regression', { ...base, findings: [{ ...finding, area: 'performance', performanceMeasurement: { metric: 'query duration', unit: 'ms', direction: 'lower_is_better', before: 180, after: 3200, budget: 250, conditions: 'same fixture and cache state' } }] }, false],
		['performance misses budget', { ...base, findings: [{ ...finding, area: 'performance', performanceMeasurement: { metric: 'query duration', unit: 'ms', direction: 'lower_is_better', before: 3200, after: 300, budget: 250, conditions: 'same fixture and cache state' } }] }, false],
		['performance distribution with provenance', { ...base, findings: [{ ...finding, area: 'performance', performanceMeasurement: { metric: 'request duration', unit: 'ms', direction: 'lower_is_better', before: 900, after: 320, budget: 500, conditions: 'same fixture and warm cache', sampleSize: 20, distribution: { p50: 280, p75: 340, p95: 480 }, variance: 40, errorRate: 0, cacheState: 'warm', fieldOrLab: 'lab', provenance: 'Server-Timing benchmark artifact', limitations: 'Synthetic fixture does not represent field traffic' } }] }, true],
		['performance distribution without sample', { ...base, findings: [{ ...finding, area: 'performance', performanceMeasurement: { metric: 'request duration', unit: 'ms', direction: 'lower_is_better', before: 900, after: 320, budget: 500, conditions: 'same fixture and warm cache', distribution: { p50: 280, p95: 480 } } }] }, false],
		['performance distribution out of order', { ...base, findings: [{ ...finding, area: 'performance', performanceMeasurement: { metric: 'request duration', unit: 'ms', direction: 'lower_is_better', before: 900, after: 320, budget: 500, conditions: 'same fixture and warm cache', sampleSize: 20, distribution: { p50: 500, p95: 480 } } }] }, false],
		['security authorization matrix', { ...base, findings: [{ ...finding, area: 'security', riskFlags: ['authorization_boundary'], negativeTests: [validation({ check: 'Exercise lower capability and wrong object' })], authorizationMatrix, independentReview }] }, true],
		['security authorization mismatch', { ...base, findings: [{ ...finding, area: 'security', riskFlags: ['authorization_boundary'], negativeTests: [validation({ check: 'Exercise lower capability and wrong object' })], authorizationMatrix: [{ ...authorizationMatrix[0], observed: 'allow' }] }] }, false],
		['open security authorization mismatch', { ...base, conclusion: 'partial', findings: [{ ...finding, area: 'security', status: 'open', riskFlags: ['authorization_boundary'], authorizationMatrix: [{ ...authorizationMatrix[0], observed: 'allow' }] }] }, true],
		['security authorization flag without matrix', { ...base, findings: [{ ...finding, area: 'security', riskFlags: ['authorization_boundary'], negativeTests: [validation({ check: 'Exercise lower capability and wrong object' })] }] }, false],
		['resource abuse budget', { ...base, findings: [{ ...finding, area: 'security', riskFlags: ['resource_abuse'], negativeTests: [validation({ check: 'Exercise over-limit request' })], resourceBudget, independentReview }] }, true],
		['resource abuse flag without budget', { ...base, findings: [{ ...finding, area: 'performance', riskFlags: ['resource_abuse'], performanceMeasurement: { metric: 'request duration', unit: 'ms', direction: 'lower_is_better', before: 900, after: 320, budget: 500, conditions: 'same fixture and warm cache' } }] }, false],
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
	console.log(`quality review valid: ${arg}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
