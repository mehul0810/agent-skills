import fs from 'node:fs';
import Ajv from 'ajv/dist/2020.js';

const schema = JSON.parse(fs.readFileSync(new URL('../../shared/schemas/wp-quality-review.schema.json', import.meta.url), 'utf8'));
const validateShape = new Ajv({ allErrors: true, strict: false }).compile({
	$defs: schema.$defs,
	$ref: '#/$defs/accessibilityAudit',
});
export const WCAG22_AA_IDS = Object.freeze(schema.$defs.accessibilityAudit.properties.criteria.propertyNames.enum);
const AAA_IDS = new Set(schema.$defs.aaaAdvisoryCriteria.items.enum);

// A valid receipt is an auditable record, not proof that the claimed test happened.
export function validateAccessibilityAudit(report, validateReceipt) {
	const errors = [];
	const audit = report.accessibilityAudit;
	const domain = report.domains?.accessibility;
	const claim = report.accessibilityClaim;
	const findings = Array.isArray(report.findings) ? report.findings : [];
	const isAdvisory = (finding) => finding?.area === 'accessibility' && finding.severity === 'P3'
		&& Array.isArray(finding.aaaAdvisoryCriteria) && finding.aaaAdvisoryCriteria.length > 0
		&& new Set(finding.aaaAdvisoryCriteria).size === finding.aaaAdvisoryCriteria.length
		&& Array.from(finding.aaaAdvisoryCriteria).every((id) => AAA_IDS.has(id));
	for (const finding of findings) {
		if (finding?.aaaAdvisoryCriteria !== undefined && !isAdvisory(finding)) errors.push('AAA-only advisory criteria require a P3 accessibility finding and valid unique AAA IDs');
	}
	if (domain && domain.disposition !== 'not_applicable' && !['scoped_review', 'wcag22_aa_conformance'].includes(claim)) {
		errors.push('applicable accessibility reviews require explicit accessibilityClaim: scoped_review or wcag22_aa_conformance');
	}
	if (claim !== undefined && (!domain || domain.disposition === 'not_applicable')) errors.push('accessibilityClaim requires an applicable accessibility domain');
	if (audit === undefined) {
		if (claim === 'wcag22_aa_conformance') errors.push('formal accessibility claims require accessibilityAudit');
		return errors;
	}
	if (claim !== 'wcag22_aa_conformance') errors.push('accessibilityAudit is only valid for wcag22_aa_conformance claims');
	if (!domain || domain.disposition === 'not_applicable') errors.push('accessibilityAudit requires an applicable accessibility domain');
	if (!validateShape(audit)) {
		return [...errors, ...validateShape.errors.map((error) => `accessibilityAudit${error.instancePath} ${error.message}`)];
	}
	const date = new Date(`${audit.evaluatedOn}T00:00:00Z`);
	if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== audit.evaluatedOn) errors.push('accessibilityAudit.evaluatedOn must be a real calendar date');
	for (const [id, check] of Object.entries(audit.checks)) {
		validateReceipt(check, `accessibilityAudit.checks.${id}`, errors);
		if (check.result !== 'blocked' && !check.artifact) errors.push(`accessibilityAudit.checks.${id} requires an evidence artifact`);
	}
	for (const [id, criterion] of Object.entries(audit.criteria)) {
		if (criterion.rationale.trim().length < 12 || criterion.rationale.trim().split(/\s+/).length < 3) errors.push(`${id} requires a concrete applicability/result rationale`);
		const receipts = criterion.checks.map((key) => Object.hasOwn(audit.checks, key) ? audit.checks[key] : undefined);
		if (receipts.some((check) => !check)) errors.push(`${id} references an unknown check`);
		if (['pass', 'not_applicable'].includes(criterion.status) && receipts.some((check) => check?.result !== 'pass')) {
			errors.push(`${id} cannot pass or be not_applicable with failed/blocked/missing evidence`);
		}
		if (['fail', 'blocked'].includes(criterion.status) && !receipts.some((check) => check?.result === criterion.status)) {
			errors.push(`${id} requires matching ${criterion.status} evidence`);
		}
	}
	const passing = report.conclusion === 'pass' || domain?.disposition === 'pass';
	if (passing) {
		const atCheck = audit.checks.assistiveTechnology;
		if (!atCheck.browser || !atCheck.assistiveTechnology) errors.push('formal AA pass requires named browser and assistiveTechnology fields');
		if (audit.checks.automatedScan?.kind !== 'static' || audit.checks.automatedScan?.result !== 'pass') errors.push('formal AA pass requires a passing automatedScan artifact alongside manual proof');
		if (!/^[a-f0-9]{64}$/.test(audit.checks.automatedScan?.artifactSha256 ?? '')) errors.push('formal AA automatedScan requires an artifactSha256 digest');
		if (!Object.values(audit.criteria).some((criterion) => criterion.status === 'pass')) errors.push('formal AA cannot mark every criterion not_applicable');
		if (Object.values(audit.criteria).some((criterion) => ['fail', 'blocked'].includes(criterion.status))) errors.push('formal AA pass cannot contain failed or blocked criteria');
		if (Object.values(audit.checks).some((check) => check.result !== 'pass')) errors.push('formal AA pass requires all recorded checks to pass');
		if (report.scope?.exclusions?.length) errors.push('formal AA pass cannot exclude fragments or process steps; narrow scope.targets to proved full pages/processes');
		if (report.proofGaps?.length) errors.push('formal AA pass cannot contain proof gaps');
		if (findings.some((finding) => finding?.area === 'accessibility' && finding.status !== 'fixed' && !isAdvisory(finding))) errors.push('owner acceptance or severity cannot waive an unresolved A/AA accessibility finding for conformance');
	}
	return errors;
}
