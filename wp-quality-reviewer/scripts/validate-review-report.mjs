#!/usr/bin/env node

import fs from 'node:fs';

const MODES = new Set(['security', 'performance', 'modularity', 'accessibility', 'multi']);
const AREAS = new Set(['security', 'performance', 'modularity', 'accessibility']);
const SEVERITIES = new Set(['P0', 'P1', 'P2', 'P3']);
const STATUSES = new Set(['open', 'fixed', 'accepted', 'not_applicable']);
const CONCLUSIONS = new Set(['pass', 'fail', 'partial', 'blocked']);

function nonEmpty(value) {
	return typeof value === 'string' && value.trim() !== '';
}

function stringList(value, min = 0) {
	return Array.isArray(value) && value.length >= min && value.every(nonEmpty);
}

export function validate(report) {
	const errors = [];

	if (!report || typeof report !== 'object' || Array.isArray(report)) {
		return ['report must be an object'];
	}

	if (report.schemaVersion !== 1) errors.push('schemaVersion must be 1');
	if (!MODES.has(report.mode)) errors.push('mode is invalid');
	if (!nonEmpty(report.target)) errors.push('target is required');
	if (!CONCLUSIONS.has(report.conclusion)) errors.push('conclusion is invalid');
	if (!Array.isArray(report.findings)) errors.push('findings must be an array');
	if (!stringList(report.proofGaps)) errors.push('proofGaps must be a string array');

	if (!report.scope || typeof report.scope !== 'object') {
		errors.push('scope is required');
	} else {
		if (!nonEmpty(report.scope.revision)) errors.push('scope.revision is required');
		if (!stringList(report.scope.targets, 1)) errors.push('scope.targets requires at least one target');
		if (!stringList(report.scope.exclusions)) errors.push('scope.exclusions must be a string array');
	}

	const ids = new Set();
	for (const [index, finding] of (report.findings || []).entries()) {
		const prefix = `findings[${index}]`;
		if (!nonEmpty(finding.id)) errors.push(`${prefix}.id is required`);
		if (ids.has(finding.id)) errors.push(`${prefix}.id is duplicated: ${finding.id}`);
		ids.add(finding.id);
		if (!AREAS.has(finding.area)) errors.push(`${prefix}.area is invalid`);
		if (!SEVERITIES.has(finding.severity)) errors.push(`${prefix}.severity is invalid`);
		if (!STATUSES.has(finding.status)) errors.push(`${prefix}.status is invalid`);
		if (!stringList(finding.evidence, 1)) errors.push(`${prefix}.evidence requires at least one item`);
		if (!nonEmpty(finding.impact)) errors.push(`${prefix}.impact is required`);
		if (!nonEmpty(finding.remediation)) errors.push(`${prefix}.remediation is required`);
		if (!stringList(finding.validation)) errors.push(`${prefix}.validation must be a string array`);

		if (finding.status === 'fixed' && finding.validation.length === 0) {
			errors.push(`${prefix} fixed finding requires validation`);
		}
		if (finding.status === 'fixed' && finding.area === 'security' && !stringList(finding.negativeTests, 1)) {
			errors.push(`${prefix} fixed security finding requires negativeTests`);
		}
		if (finding.status === 'fixed' && finding.area === 'performance' && (!nonEmpty(finding.before) || !nonEmpty(finding.after))) {
			errors.push(`${prefix} fixed performance finding requires before and after evidence`);
		}
		if (finding.status === 'fixed' && finding.area === 'modularity' && !stringList(finding.behaviorChecks, 1)) {
			errors.push(`${prefix} fixed modularity finding requires behaviorChecks`);
		}
		if (finding.status === 'fixed' && finding.area === 'accessibility' && !stringList(finding.manualChecks, 1)) {
			errors.push(`${prefix} fixed accessibility finding requires manualChecks`);
		}
	}

	const unresolvedCritical = (report.findings || []).some(
		(finding) => ['P0', 'P1'].includes(finding.severity) && finding.status === 'open',
	);
	if (report.conclusion === 'pass' && unresolvedCritical) {
		errors.push('pass cannot contain an open P0 or P1 finding');
	}
	if (report.conclusion === 'pass' && report.proofGaps.length > 0) {
		errors.push('pass cannot contain proof gaps');
	}

	return errors;
}

function runSelfTest() {
	const base = {
		schemaVersion: 1,
		mode: 'multi',
		scope: { revision: 'abc123', targets: ['plugin release candidate'], exclusions: [] },
		target: 'enterprise quality gate',
		findings: [
			{
				id: 'SEC-1',
				area: 'security',
				severity: 'P1',
				status: 'fixed',
				evidence: ['REST mutation lacked an object capability check'],
				impact: 'A lower-privilege user could change another object',
				remediation: 'Enforce the object capability at the mutation boundary',
				validation: ['integration test passed'],
				negativeTests: ['wrong-object mutation returns 403'],
			},
			{
				id: 'PERF-1',
				area: 'performance',
				severity: 'P2',
				status: 'fixed',
				evidence: ['unbounded query on the report screen'],
				impact: 'request cost grew with all records',
				remediation: 'paginate and use an indexed predicate',
				validation: ['same dataset benchmark passed'],
				before: '3200 ms p95',
				after: '180 ms p95',
			},
			{
				id: 'MOD-1',
				area: 'modularity',
				severity: 'P2',
				status: 'fixed',
				evidence: ['capability policy duplicated in REST and cron paths'],
				impact: 'security fixes could diverge',
				remediation: 'move policy to one service',
				validation: ['unit and integration tests passed'],
				behaviorChecks: ['REST and cron retain expected behavior'],
			},
			{
				id: 'A11Y-1',
				area: 'accessibility',
				severity: 'P1',
				status: 'fixed',
				evidence: ['modal trapped keyboard focus after close'],
				impact: 'keyboard users could not continue the workflow',
				remediation: 'restore focus to the invoking button',
				validation: ['browser test passed'],
				manualChecks: ['keyboard-only journey and VoiceOver/Safari smoke passed'],
			},
		],
		proofGaps: [],
		conclusion: 'pass',
	};

	const cases = [
		['valid report', base, true],
		['open critical pass', { ...base, findings: [{ ...base.findings[0], status: 'open' }] }, false],
		['performance without delta', { ...base, findings: [{ ...base.findings[1], before: undefined }] }, false],
		['accessibility without manual proof', { ...base, findings: [{ ...base.findings[3], manualChecks: [] }] }, false],
	];

	for (const [name, report, expected] of cases) {
		const passed = validate(report).length === 0;
		if (passed !== expected) throw new Error(`self-test failed: ${name}`);
	}

	console.log('quality review validator self-test passed');
}

const arg = process.argv[2];
if (arg === '--self-test') {
	runSelfTest();
} else if (!arg) {
	console.error('usage: validate-review-report.mjs <report.json> | --self-test');
	process.exit(2);
} else {
	const report = JSON.parse(fs.readFileSync(arg, 'utf8'));
	const errors = validate(report);
	if (errors.length > 0) {
		for (const error of errors) console.error(`ERROR: ${error}`);
		process.exit(1);
	}
	console.log(`quality review valid: ${arg}`);
}
