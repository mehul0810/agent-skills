import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv/dist/2020.js';
import { validate } from './validate-review-report.mjs';

const schema = JSON.parse(fs.readFileSync(new URL('../../shared/schemas/wp-quality-review.schema.json', import.meta.url), 'utf8'));
const schemaValid = new Ajv({ strict: false }).compile(schema);

// Synthetic records exercise the schema and semantic gate, not the underlying artifacts.
const measurement = (extra = {}) => ({
	metric: 'request duration', unit: 'ms', direction: 'lower_is_better',
	before: 180, after: 180, budget: 250, conditions: 'same warm fixture and dataset', ...extra,
});
const receipt = (performanceMeasurement, extra = {}) => ({
	kind: 'profile', check: 'Measure request duration', expected: 'Duration remains within budget',
	observed: 'Duration measured in fixture', result: 'pass', environment: 'Local test environment',
	claim: 'performance_comparable', expectedState: 'within_budget', observedState: 'within_budget',
	performanceMeasurement, ...extra,
});
const report = (validation) => ({
	schemaVersion: 2, mode: 'performance',
	targetIdentity: { kind: 'commit', repository: 'fixture/plugin', commitSha: 'a'.repeat(40) },
	scope: { targets: ['request duration fixture'], exclusions: [] },
	qualityTarget: 'Performance review of request duration', assuranceProfile: { level: 'standard', risks: [] },
	domains: { performance: {
		disposition: 'pass',
		evidence: [{ kind: 'profile', environment: 'Local test environment', pointer: 'artifacts/profile.json', observation: 'Measured the synthetic request duration in the fixture' }],
		validation: [validation],
	} },
	findings: [], proofGaps: [], conclusion: 'pass',
});
function valid(value) {
	assert.ok(schemaValid(value), JSON.stringify(schemaValid.errors));
	assert.deepEqual(validate(value), []);
}
function invalid(value) {
	assert.notDeepEqual(validate(value), []);
}
function nonPassing(value, conclusion = 'fail') {
	value.conclusion = conclusion;
	value.domains.performance.disposition = conclusion;
	return value;
}

test('CLI distinguishes document validity from the candidate conclusion', (t) => {
	const dir = fs.mkdtempSync(join(tmpdir(), 'quality-outcome-'));
	t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
	const file = join(dir, 'fixture.json');
	const cli = fileURLToPath(new URL('./validate-review-report.mjs', import.meta.url));
	const check = (record) => {
		fs.writeFileSync(file, JSON.stringify(record));
		return spawnSync(process.execPath, [cli, file], { encoding: 'utf8' });
	};
	const bad = report(receipt(measurement({ after: 300 }), { result: 'fail', observedState: 'failure' }));
	const invalid = check(bad);
	assert.equal(invalid.status, 1);
	assert.doesNotMatch(invalid.stdout, /quality review valid/);
	const failed = check(nonPassing(bad));
	assert.equal(failed.status, 0, failed.stderr);
	assert.match(failed.stdout, /candidate conclusion: fail/);
	const stable = check(report(receipt(measurement())));
	assert.equal(stable.status, 0, stable.stderr);
	assert.match(stable.stdout, /candidate conclusion: pass/);
});

test('stable pass, truthful failure and direction-aware decisions', () => {
	valid(report(receipt(measurement())));
	const failed = report(receipt(measurement({ after: 300 }), { result: 'fail', observedState: 'failure' }));
	invalid(failed);
	assert.equal(schemaValid(failed), false);
	valid(nonPassing(failed));
	invalid(nonPassing(report(receipt(measurement({ after: 300, unit: '' }), { result: 'fail', observedState: 'failure' }))));
	invalid(report(receipt(measurement({ after: 200 }))));
	const throughput = { metric: 'request throughput', unit: 'requests/s', direction: 'higher_is_better', before: 180, after: 180, budget: 150 };
	valid(report(receipt(measurement(throughput))));
	invalid(report(receipt(measurement({ ...throughput, after: 170 }))));
	invalid(report(receipt(measurement({ improvementClaim: true }))));
	valid(report(receipt(measurement({ after: 150, improvementClaim: true }))));
});

test('failed subordinate checks are allowed only on non-passing receipts', () => {
	const check = { kind: 'tail', expected: 'Tail latency remains within budget', observed: 'Tail latency exceeded the budget', result: 'fail' };
	const failing = receipt(measurement({ after: 300 }), { result: 'fail', observedState: 'failure', performanceChecks: [check] });
	valid(nonPassing(report(failing)));
	valid(nonPassing(report({ ...failing, result: 'blocked', observedState: 'blocked' }), 'partial'));
	const inconsistent = report(receipt(measurement(), { performanceChecks: [check] }));
	assert.equal(schemaValid(inconsistent), false);
	invalid(inconsistent);
	const falsePass = report(failing);
	assert.equal(schemaValid(falsePass), false);
	invalid(falsePass);
});

test('percentile target binds candidate value and observation support', () => {
	const tail = measurement({
		metric: 'p95 request duration', statistic: 'p95', before: 600, after: 490, budget: 500,
		sampleSize: 20, runCount: 5, variance: 10, provenance: 'artifacts/profile.json benchmark',
		distribution: { p50: 300, p95: 490 },
	});
	valid(report(receipt(tail, { observed: 'Observed p95 490 ms and p50 300 ms in the fixture', expected: 'The p50 diagnostic is recorded and the p95 stays within budget' })));
	const misleadingPass = report(receipt(tail, { observedState: 'failure' }));
	assert.equal(schemaValid(misleadingPass), false);
	invalid(misleadingPass);
	invalid(report(receipt({ ...tail, distribution: { p50: 300, p95: 1200 } })));
	invalid(report(receipt({ ...tail, statistic: 'p50' })));
	invalid(report(receipt({ ...tail, statistic: undefined })));
	invalid(report(receipt({ ...tail, sampleSize: 5 })));
	invalid(report(receipt({ ...tail, sampleSize: undefined })));
	invalid(report(receipt({ ...tail, variance: undefined })));
	invalid(report(receipt({ ...tail, provenance: undefined })));
	invalid(report(receipt({ ...tail, distribution: { ...tail.distribution, p99: 500 } })));
	invalid(report(receipt(tail, { expected: 'The p99 request duration remains within budget' })));
	const failedTail = { ...tail, after: 1200, distribution: { p50: 300, p95: 1200 } };
	valid(nonPassing(report(receipt(failedTail, { result: 'fail', observedState: 'failure' }))));
});

test('median binds to p50 when paired with distribution', () => {
	const median = measurement({ statistic: 'median', after: 180, sampleSize: 20, variance: 5, provenance: 'artifacts/profile.json benchmark', distribution: { p50: 180, p95: 220 } });
	valid(report(receipt(median)));
	invalid(report(receipt({ ...median, after: 179 })));
	valid(report(receipt(measurement({ statistic: 'median' }))));
});

test('schema rejects malformed fields and admits honest failed receipt', () => {
	const failed = nonPassing(report(receipt(measurement({ after: 300 }), { result: 'fail', observedState: 'failure' })));
	assert.ok(schemaValid(failed), JSON.stringify(schemaValid.errors));
	for (const extra of [{ statistic: 'p90' }, { improvementClaim: 'yes' }, { sampleSize: 0 }]) {
		assert.equal(schemaValid(report(receipt(measurement(extra)))), false);
	}
});

test('fixed findings require improvement and open findings validate measurement shape', () => {
	const value = report(receipt(measurement()));
	const base = {
		id: 'PERF-1', area: 'performance', severity: 'P2', status: 'fixed',
		evidence: [{ kind: 'code', pointer: 'src/query.php:10', observation: 'The request executes an expensive repeated query' }],
		impact: 'The repeated request work increases latency', remediation: 'Remove the repeated query for the same result',
		validation: [receipt(measurement({ after: 150 }))], performanceMeasurement: measurement({ after: 150 }),
	};
	value.findings = [base];
	valid(value);
	value.findings = [{ ...base, performanceMeasurement: measurement() }];
	invalid(value);
	value.findings = [{ ...base, status: 'open', performanceMeasurement: measurement({ unit: '' }) }];
	invalid(value);
});
