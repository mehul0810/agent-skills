import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import Ajv from 'ajv/dist/2020.js';
import { WCAG22_AA_IDS } from './accessibility-audit.mjs';
import { validate } from './validate-review-report.mjs';

const schema = JSON.parse(fs.readFileSync(new URL('../../shared/schemas/wp-quality-review.schema.json', import.meta.url), 'utf8'));
const schemaValid = new Ajv({ strict: false }).compile(schema);

// Synthetic receipts exercise validation only; they are not runtime WCAG proof.
function fixture() {
	const check = {
		kind: 'manual', check: 'Exercise the synthetic fixture journey',
		expected: 'All fixture controls remain available throughout the journey',
		observed: 'The fixture assertions completed across the declared states',
		result: 'pass', environment: 'Synthetic Safari VoiceOver fixture', artifact: 'fixtures/accessibility-proof.md',
	};
	return {
		schemaVersion: 2, mode: 'accessibility',
		targetIdentity: { kind: 'commit', repository: 'fixture/accessibility', commitSha: 'a'.repeat(40) },
		scope: { targets: ['https://fixture.invalid/settings and its complete save process'], exclusions: [] },
		qualityTarget: 'WCAG 2.2 Level AA conformance',
		accessibilityClaim: 'wcag22_aa_conformance',
		domains: { accessibility: { disposition: 'pass', evidence: [{ kind: 'document', pointer: 'fixtures/audit.md', observation: 'Synthetic audit checks cover the declared full page' }] } },
		findings: [], proofGaps: [], conclusion: 'pass',
		accessibilityAudit: {
			standard: 'WCAG 2.2 AA', evaluatedOn: '2026-08-31', technologies: ['HTML', 'CSS', 'JavaScript'],
			criteria: Object.fromEntries(WCAG22_AA_IDS.map((id) => [id, { status: 'pass', rationale: `Synthetic criterion ${id} was exercised in the fixture`, checks: ['keyboard'] }])),
			checks: Object.fromEntries(['fullPages', 'completeProcesses', 'accessibilitySupport', 'nonInterference', 'keyboard', 'assistiveTechnology'].map((id) => [id, { ...check }])),
		},
	};
}

test('canonical inventory has 55 unique A/AA criteria, not obsolete/AAA', () => {
	assert.equal(WCAG22_AA_IDS.length, 55);
	assert.equal(new Set(WCAG22_AA_IDS).size, 55);
	for (const id of ['4.1.1', '2.4.12', '2.4.13', '2.5.5', '3.3.9']) assert.ok(!WCAG22_AA_IDS.includes(id));
	for (const id of ['1.2.5', '1.4.13', '2.4.11', '2.5.7', '2.5.8', '3.2.6', '3.3.7', '3.3.8']) assert.ok(WCAG22_AA_IDS.includes(id));
});
test('complete synthetic audit validates through schema and semantic gates', () => {
	assert.ok(schemaValid(fixture()), JSON.stringify(schemaValid.errors));
	assert.deepEqual(validate(fixture()), []);
});
test('ordinary scoped review stays lightweight without conformance claim', () => {
	const report = fixture(); delete report.accessibilityAudit;
	report.qualityTarget = 'Scoped keyboard review toward WCAG 2.2 AA';
	report.accessibilityClaim = 'scoped_review';
	assert.deepEqual(validate(report), []);
});
test('claim is structured, not inferred from unrelated compliance or disclaimers', () => {
	for (const target of ['Scoped keyboard review, not a WCAG conformance audit', 'SOC 2 compliance readiness and scoped keyboard review']) {
		const report = fixture(); delete report.accessibilityAudit;
		report.accessibilityClaim = 'scoped_review'; report.qualityTarget = target;
		assert.ok(schemaValid(report)); assert.deepEqual(validate(report), []);
	}
});

const invalid = [
	['code-only conformance', (r) => { delete r.accessibilityAudit; }],
	['compliance wording without matrix', (r) => { delete r.accessibilityAudit; r.qualityTarget = 'Accessibility compliance certification'; }],
	['implicit claim in free text', (r) => { delete r.accessibilityAudit; delete r.accessibilityClaim; r.qualityTarget = 'Meets all WCAG 2.2 Level AA success criteria'; }],
	['formal audit wording without explicit claim', (r) => { delete r.accessibilityClaim; r.qualityTarget = 'WCAG 2.2 AA audit'; }],
	['scoped claim with formal matrix', (r) => { r.accessibilityClaim = 'scoped_review'; }],
	['blank technology', (r) => { r.accessibilityAudit.technologies = ['  ']; }],
	['blank criterion rationale', (r) => { r.accessibilityAudit.criteria['1.2.5'].rationale = '            '; }],
	['generic NA rationale', (r) => { r.accessibilityAudit.criteria['1.2.5'].rationale = 'not applicable'; }],
	['invalid calendar date', (r) => { r.accessibilityAudit.evaluatedOn = '2026-02-31'; }],
	['AA failure called AAA advisory', (r) => { r.findings = [{ ...openFinding(), severity: 'P3', aaaAdvisoryCriteria: ['2.4.11'] }]; }],
	['unknown AAA advisory', (r) => { r.findings = [{ ...openFinding(), severity: 'P3', aaaAdvisoryCriteria: ['9.9.9'] }]; }],
	['missing criterion', (r) => { delete r.accessibilityAudit.criteria['1.2.5']; }],
	['AAA substituted for AA', (r) => { r.accessibilityAudit.criteria['2.4.13'] = r.accessibilityAudit.criteria['2.4.11']; delete r.accessibilityAudit.criteria['2.4.11']; }],
	['missing keyboard proof', (r) => { delete r.accessibilityAudit.checks.keyboard; }],
	['missing AT proof', (r) => { delete r.accessibilityAudit.checks.assistiveTechnology; }],
	['scanner as AT proof', (r) => { r.accessibilityAudit.checks.assistiveTechnology.kind = 'static'; }],
	['AT environment absent', (r) => { delete r.accessibilityAudit.checks.assistiveTechnology.environment; }],
	['missing complete process proof', (r) => { delete r.accessibilityAudit.checks.completeProcesses; }],
	['missing support technology inventory', (r) => { r.accessibilityAudit.technologies = []; }],
	['criterion dangling check', (r) => { r.accessibilityAudit.criteria['1.2.5'].checks = ['missing']; }],
	['criterion prototype check', (r) => { r.accessibilityAudit.criteria['1.2.5'].checks = ['constructor']; }],
	['failed criterion as pass', (r) => { r.accessibilityAudit.criteria['1.2.5'].status = 'fail'; }],
	['blocked evidence as pass', (r) => { r.accessibilityAudit.checks.keyboard.result = 'blocked'; }],
	['not tested as NA', (r) => { r.accessibilityAudit.criteria['2.1.1'].status = 'not_applicable'; r.accessibilityAudit.checks.keyboard.result = 'blocked'; }],
	['all criteria NA', (r) => { Object.values(r.accessibilityAudit.criteria).forEach((c) => { c.status = 'not_applicable'; }); }],
	['NA without reason', (r) => { r.accessibilityAudit.criteria['1.2.5'] = { status: 'not_applicable', checks: ['keyboard'] }; }],
	['failed embedded third party excluded', (r) => { r.scope.exclusions = ['Payment iframe inside claimed checkout']; }],
	['missing check artifact', (r) => { delete r.accessibilityAudit.checks.keyboard.artifact; }],
	['vague check receipt', (r) => { r.accessibilityAudit.checks.keyboard.observed = 'Everything passed'; }],
	['open P2 despite conformance pass', (r) => { r.findings = [openFinding()]; }],
	['owner waiver despite conformance pass', (r) => { r.findings = [{ ...openFinding(), status: 'accepted', riskAcceptance: { kind: 'owner', pointer: 'fixtures/owner.md', observation: 'Owner accepted this residual business risk for release' } }]; }],
	['domain pass despite partial report', (r) => { r.conclusion = 'partial'; r.accessibilityAudit.checks.keyboard.result = 'fail'; }],
	['audit null', (r) => { r.accessibilityAudit = null; }],
	['audit malformed criteria', (r) => { r.accessibilityAudit.criteria = []; }],
	['findings malformed with formal audit', (r) => { r.findings = {}; }],
	['unrelated review with formal audit', (r) => { r.mode = 'security'; r.domains = { security: r.domains.accessibility }; }],
];
function openFinding() {
	return { id: 'A11Y-1', area: 'accessibility', severity: 'P2', status: 'open', evidence: [{ kind: 'code', pointer: 'src/form.js:10', observation: 'The save control has a conflicting accessible name' }], impact: 'Voice input cannot activate the visibly named control', remediation: 'Include the visible label in the accessible name', validation: [] };
}
for (const [name, mutate] of invalid) test(`rejects ${name}`, () => {
	const report = fixture(); mutate(report);
	assert.ok(validate(report).length > 0, name);
});
test('optional AAA focus appearance advice does not fail an AA audit', () => {
	const report = fixture();
	report.findings = [{ ...openFinding(), severity: 'P3', aaaAdvisoryCriteria: ['2.4.13'], impact: 'Optional AAA indicator area exceeds the adopted AA target', remediation: 'Consider increasing the indicator area as optional AAA polish' }];
	assert.ok(schemaValid(report)); assert.deepEqual(validate(report), []);
});
test('incomplete audit may truthfully report blocked, not conformant', () => {
	const report = fixture();
	report.conclusion = 'blocked'; report.domains.accessibility.disposition = 'partial';
	report.accessibilityAudit.criteria['2.1.1'].status = 'blocked';
	report.accessibilityAudit.criteria['2.1.1'].checks = ['unavailable'];
	report.accessibilityAudit.checks.unavailable = { ...report.accessibilityAudit.checks.keyboard, result: 'blocked', observed: 'The required test environment was unavailable during review' };
	report.proofGaps = ['Keyboard journey remains untested on the required environment'];
	assert.deepEqual(validate(report), []);
});
