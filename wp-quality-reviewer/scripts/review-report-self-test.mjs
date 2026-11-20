export function runSelfTest(validate) {
	const AREAS = ['security', 'performance', 'modularity', 'accessibility'];
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
	const webhookMatrix = [{ actor: 'untrusted sender', action: 'update order', resource: 'order status', expected: 'deny', observed: 'deny', evidence: [evidence('tests/webhook-auth.md', 'An untrusted sender was denied an order status update')] }];
	const webhookBudget = { ...resourceBudget, scope: 'order webhook processing', evidence: [evidence('tests/webhook-budget.md', 'Order callback work was rejected above the request limit')] };
	const readWebhook = { handler: 'health callback', action: 'read status', resource: 'public health status', effect: 'read_only', effectReason: 'The callback returns public health status', workload: 'bounded', workloadReason: 'The response uses a fixed cached value' };
	const orderWebhook = { handler: 'order callback', action: 'update order', resource: 'order status', deniedActor: 'untrusted sender', effect: 'mutating', effectReason: 'The callback changes order status', workload: 'abuse_prone', workloadReason: 'Concurrent callbacks can trigger expensive work', workScope: 'order webhook processing' };
	const webhookReport = (scope, matrix = webhookMatrix, budget = webhookBudget) => ({ ...base, assuranceProfile: { level: 'elevated', risks: ['external_webhook'] }, domains: { ...base.domains, security: { ...base.domains.security, webhookScope: scope, ...(matrix === undefined ? {} : { authorizationMatrix: matrix }), ...(budget === undefined ? {} : { resourceBudget: budget }) } } });
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
	const metric = (baseline, after) => ({ baseline, after, budget: baseline, posture: 'no_growth' });
	const ratchet = [{ path: 'src/Legacy.php', measurements: { logicalFileLines: metric(9240, 9230), oversizedMethodCount: metric(4, 4), largestChangedMethod: metric(150, 150) }, evidence: [evidence('artifacts/legacy-metrics.json', 'Measured file and changed method metrics before and after')] }];
	const exception = { baseline: 150, after: 151, budget: 151, posture: 'exception', owner: '@jane', issue: 'issues/123', rationale: 'Approved temporary growth', ownerApproval: { ...evidence('approvals/123.md', 'The owner approved a temporary method exception'), kind: 'owner' }, approvalScope: { owner: '@jane', path: 'src/Legacy.php', metric: 'largestChangedMethod', budget: 151 } };
	const withException = (overrides = {}) => [{ ...ratchet[0], measurements: { ...ratchet[0].measurements, largestChangedMethod: { ...exception, ...overrides } } }];
	const cleanRisk = (extra) => ({ ...base, findings: [], assuranceProfile: { level: 'elevated', risks: ['legacy_debt', 'migration'] }, domains: { ...base.domains, modularity: { ...base.domains.modularity, migrationPlan, legacyDebtPaths: ['src/Legacy.php'], modularityRatchets: ratchet, ...extra } } });
	const elevatedPerformanceChecks = ['tail', 'overload', 'recovery', 'cache', 'capacity'].map((kind) => ({
		kind,
		expected: `${kind} behavior remains within the declared release budget`,
		observed: `${kind} behavior remained within the declared release budget`,
		result: 'pass',
	}));
	const elevatedMeasurement = performanceMeasurement({
		runCount: 5, sampleSize: 100, statistic: 'p95', after: 440, variance: 40,
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
		['security static claim plus unrelated test', { ...base, domains: { ...base.domains, security: { ...base.domains.security, validation: [{ ...base.domains.security.validation[0], kind: 'static' }, validation()] } } }, false],
		['security receipt order with eligible second proof', { ...base, domains: { ...base.domains, security: { ...base.domains.security, validation: [{ ...base.domains.security.validation[0], kind: 'static' }, base.domains.security.validation[0]] } } }, true],
		['performance receipt order with eligible second proof', { ...base, domains: { ...base.domains, performance: { ...base.domains.performance, validation: [{ ...base.domains.performance.validation[0], kind: 'static' }, base.domains.performance.validation[0]] } } }, true],
		['modularity static claim plus unrelated test', { ...base, domains: { ...base.domains, modularity: { ...base.domains.modularity, validation: [{ ...base.domains.modularity.validation[0], kind: 'static' }, validation()] } } }, false],
		['accessibility static claim plus unrelated manual', { ...base, domains: { ...base.domains, accessibility: { ...base.domains.accessibility, validation: [{ ...base.domains.accessibility.validation[0], kind: 'static' }, base.domains.accessibility.validation[1], validation({ kind: 'manual', environment: 'Local release candidate environment' })] } } }, false],
		['performance incomplete then complete', { ...base, domains: { ...base.domains, performance: { ...base.domains.performance, validation: [{ ...base.domains.performance.validation[0], performanceMeasurement: performanceMeasurement({ baselineConditions: undefined, candidateConditions: undefined }) }, base.domains.performance.validation[0]] } } }, true],
		['performance complete then incomplete', { ...base, domains: { ...base.domains, performance: { ...base.domains.performance, validation: [base.domains.performance.validation[0], { ...base.domains.performance.validation[0], performanceMeasurement: performanceMeasurement({ baselineConditions: undefined, candidateConditions: undefined }) }] } } }, true],
		['security receipt contradicts case outcome', { ...base, domains: { ...base.domains, security: { ...base.domains.security, validation: [{ ...base.domains.security.validation[0], expectedState: 'reject', observedState: 'reject' }] } } }, false],
		['security missing claim artifact', { ...base, domains: { ...base.domains, security: { ...base.domains.security, validation: [{ ...base.domains.security.validation[0], artifact: undefined }] } } }, false],
		['read only payment status and separate bulk path', { ...webhookReport(readWebhook, null, null), scope: { targets: ['Read-only payment status webhook', 'Separate bulk export module'], exclusions: [] }, domains: { ...base.domains, security: { ...base.domains.security, webhookScope: readWebhook } } }, true],
		['low scope performance failing supplied check', { ...base, domains: { ...base.domains, performance: { ...base.domains.performance, validation: [{ ...base.domains.performance.validation[0], performanceChecks: [{ ...elevatedPerformanceChecks[0], result: 'fail' }] }] } } }, false],
		['external webhook needs explicit applicability', { ...base, assuranceProfile: { level: 'elevated', risks: ['external_webhook'] } }, false],
		['mutating webhook needs matrix', { ...webhookReport(orderWebhook), domains: { ...base.domains, security: { ...base.domains.security, webhookScope: { ...orderWebhook, workload: 'bounded', workloadReason: 'Only one fixed status is updated', workScope: undefined } } } }, false],
		['mutating abuse prone webhook has candidate proof', webhookReport(orderWebhook), true],
		['webhook unrelated authorization row rejected', webhookReport(orderWebhook, authorizationMatrix, webhookBudget), false],
		['webhook unrelated budget rejected', webhookReport(orderWebhook, webhookMatrix, resourceBudget), false],
		['webhook allow row does not prove denial', webhookReport(orderWebhook, [{ ...webhookMatrix[0], expected: 'allow', observed: 'allow' }], webhookBudget), false],
		['webhook wrong candidate auth matrix', webhookReport(orderWebhook, [{ ...webhookMatrix[0], evidence: [{ ...webhookMatrix[0].evidence[0], identity: { ...identity, commitSha: 'c'.repeat(40) } }] }], webhookBudget), false],
		['webhook wrong candidate budget', webhookReport(orderWebhook, webhookMatrix, { ...webhookBudget, evidence: [{ ...webhookBudget.evidence[0], identity: { ...identity, commitSha: 'c'.repeat(40) } }] }), false],
		['webhook harmless control', { ...base, assuranceProfile: { level: 'elevated', risks: ['external_webhook'] }, domains: { ...base.domains, security: { ...base.domains.security, webhookScope: readWebhook } } }, true],
		['webhook contradictory read-only scope', webhookReport({ ...readWebhook, deniedActor: 'untrusted sender' }), false],
		['webhook contradictory bounded scope', webhookReport({ ...orderWebhook, workload: 'bounded' }), false],
		['synchronous single tenant capacity', { ...base, scope: { targets: ['High-traffic synchronous service, no queue; not multi-tenant.'], exclusions: [] }, assuranceProfile: { level: 'elevated', risks: ['high_traffic'] }, domains: { ...base.domains, security: { ...base.domains.security, resourceBudget }, performance: { ...base.domains.performance, capacityEnvelope: { ...capacityEnvelope, queue: { status: 'not_applicable', reason: 'Requests complete synchronously without background work' }, fairness: { status: 'not_applicable', reason: 'The service has a single shared owner' } }, validation: [{ ...base.domains.performance.validation[0], performanceMeasurement: elevatedMeasurement, performanceChecks: elevatedPerformanceChecks }] } } }, true],
		['scope with no queue limits still declares queue', { ...base, scope: { targets: ['High-traffic service with no queue limits'], exclusions: [] }, assuranceProfile: { level: 'elevated', risks: ['high_traffic'] } }, false],
		['async queue cannot opt out', { ...base, assuranceProfile: { level: 'elevated', risks: ['async_queue'] }, domains: { ...base.domains, security: { ...base.domains.security, resourceBudget }, performance: { ...base.domains.performance, capacityEnvelope: { ...capacityEnvelope, queue: { status: 'not_applicable', reason: 'Requests complete synchronously without background work' } }, validation: [{ ...base.domains.performance.validation[0], performanceMeasurement: elevatedMeasurement, performanceChecks: elevatedPerformanceChecks }] } } }, false],
		['multi tenant cannot opt out of fairness', { ...base, assuranceProfile: { level: 'elevated', risks: ['multi_tenant'] }, domains: { ...base.domains, security: { ...base.domains.security, authorizationMatrix, resourceBudget }, performance: { ...base.domains.performance, capacityEnvelope: { ...capacityEnvelope, fairness: { status: 'not_applicable', reason: 'The service has a single shared owner' } }, validation: [{ ...base.domains.performance.validation[0], performanceMeasurement: elevatedMeasurement, performanceChecks: elevatedPerformanceChecks }] } } }, false],
		['real queue retains numeric validation', { ...base, assuranceProfile: { level: 'elevated', risks: ['async_queue'] }, domains: { ...base.domains, security: { ...base.domains.security, resourceBudget }, performance: { ...base.domains.performance, capacityEnvelope: { ...capacityEnvelope, queue: { ...capacityEnvelope.queue, serviceRate: 10 } }, validation: [{ ...base.domains.performance.validation[0], performanceMeasurement: elevatedMeasurement, performanceChecks: elevatedPerformanceChecks }] } } }, false],
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
		['elevated median must match p50', { ...base, qualityTarget: 'High-traffic release quality gate', assuranceProfile: { level: 'elevated', risks: ['high_traffic'] }, domains: { ...base.domains, security: { ...base.domains.security, resourceBudget }, performance: { ...base.domains.performance, capacityEnvelope, validation: [{ ...base.domains.performance.validation[0], performanceMeasurement: { ...elevatedMeasurement, statistic: 'median', after: 280 }, performanceChecks: elevatedPerformanceChecks }] } } }, true],
		['elevated median mismatch rejected', { ...base, qualityTarget: 'High-traffic release quality gate', assuranceProfile: { level: 'elevated', risks: ['high_traffic'] }, domains: { ...base.domains, security: { ...base.domains.security, resourceBudget }, performance: { ...base.domains.performance, capacityEnvelope, validation: [{ ...base.domains.performance.validation[0], performanceMeasurement: { ...elevatedMeasurement, statistic: 'median', after: 320 }, performanceChecks: elevatedPerformanceChecks }] } } }, false],
		['elevated mean cannot impersonate tail', { ...base, qualityTarget: 'High-traffic release quality gate', assuranceProfile: { level: 'elevated', risks: ['high_traffic'] }, domains: { ...base.domains, security: { ...base.domains.security, resourceBudget }, performance: { ...base.domains.performance, capacityEnvelope, validation: [{ ...base.domains.performance.validation[0], performanceMeasurement: { ...elevatedMeasurement, statistic: 'mean' }, performanceChecks: elevatedPerformanceChecks }] } } }, false],
		['high traffic text cannot claim standard assurance', { ...base, qualityTarget: 'High-traffic release quality gate', assuranceProfile: { level: 'standard', risks: [] } }, false],
		['public multi-tenant REST scope cannot omit risks', { ...base, scope: { targets: ['Public multi-tenant bulk REST package'], exclusions: [] }, assuranceProfile: { level: 'elevated', risks: [] } }, false],
		['public multi-tenant REST scope needs trust and capacity proof', { ...base, scope: { targets: ['Public multi-tenant bulk REST package'], exclusions: [] }, assuranceProfile: { level: 'elevated', risks: ['public_api', 'multi_tenant'] } }, false],
		['custom-table migration scope needs fixed migration proof', { ...base, scope: { targets: ['Custom-table migration release package'], exclusions: [] }, assuranceProfile: { level: 'elevated', risks: ['custom_storage', 'migration'] } }, false],
		['legacy file scope needs ratchet proof', { ...base, scope: { targets: ['9,240-line legacy plugin file package'], exclusions: [] }, assuranceProfile: { level: 'elevated', risks: ['legacy_debt'] } }, false],
		['failed domain migration rollback is reportable', { ...base, conclusion: 'fail', findings: [], assuranceProfile: { level: 'elevated', risks: ['migration'] }, domains: { ...base.domains, modularity: { ...base.domains.modularity, disposition: 'fail', migrationPlan: { ...migrationPlan, rollbackCheck: { ...migrationPlan.rollbackCheck, result: 'fail', observedState: 'failure', observed: 'Rollback failed and left the migration incomplete' } } } } }, true],
		['blocked domain migration rollback is reportable', { ...base, conclusion: 'blocked', findings: [], assuranceProfile: { level: 'elevated', risks: ['migration'] }, domains: { ...base.domains, modularity: { ...base.domains.modularity, disposition: 'partial', migrationPlan: { ...migrationPlan, rollbackCheck: { ...migrationPlan.rollbackCheck, result: 'blocked', observedState: 'blocked', observed: 'Rollback could not run without a restore snapshot' } } } } }, true],
		['failed rollback without identity is reportable', { ...base, conclusion: 'fail', findings: [], assuranceProfile: { level: 'elevated', risks: ['migration'] }, domains: { ...base.domains, modularity: { ...base.domains.modularity, disposition: 'fail', migrationPlan: { ...migrationPlan, rollbackCheck: { ...migrationPlan.rollbackCheck, result: 'fail', observedState: 'failure', observed: 'Rollback failed and left the migration incomplete', identity: undefined } } } } }, true],
		['failed migration must retain its receipt claim', { ...base, conclusion: 'fail', findings: [], assuranceProfile: { level: 'elevated', risks: ['migration'] }, domains: { ...base.domains, modularity: { ...base.domains.modularity, disposition: 'fail', migrationPlan: { ...migrationPlan, rollbackCheck: { ...migrationPlan.rollbackCheck, result: 'fail', observedState: 'failure', observed: 'Rollback failed and left the migration incomplete', claim: undefined } } } } }, false],
		['passing domain rejects failed migration rollback', { ...base, conclusion: 'partial', findings: [], assuranceProfile: { level: 'elevated', risks: ['migration'] }, domains: { ...base.domains, modularity: { ...base.domains.modularity, migrationPlan: { ...migrationPlan, rollbackCheck: { ...migrationPlan.rollbackCheck, result: 'fail', observedState: 'failure', observed: 'Rollback failed and left the migration incomplete' } } } } }, false],
		['failed migration receipt mismatched identity', { ...base, conclusion: 'fail', findings: [], assuranceProfile: { level: 'elevated', risks: ['migration'] }, domains: { ...base.domains, modularity: { ...base.domains.modularity, disposition: 'fail', migrationPlan: { ...migrationPlan, rollbackCheck: { ...migrationPlan.rollbackCheck, result: 'fail', observedState: 'failure', observed: 'Rollback failed and left the migration incomplete', identity: { ...identity, commitSha: 'c'.repeat(40) } } } } } }, false],
		['fixed migration rejects failed rollback', { ...base, conclusion: 'partial', assuranceProfile: { level: 'elevated', risks: ['migration'] }, findings: [{ ...finding, riskFlags: ['migration'], migrationPlan: { ...migrationPlan, rollbackCheck: { ...migrationPlan.rollbackCheck, result: 'fail', observedState: 'failure', observed: 'Rollback failed and left the migration incomplete' } }, independentReview }] }, false],
		['migration finding needs migration plan', { ...base, assuranceProfile: { level: 'elevated', risks: ['migration'] }, findings: [{ ...finding, riskFlags: ['migration'], independentReview }] }, false],
		['migration finding with staged proof', { ...base, assuranceProfile: { level: 'elevated', risks: ['migration'] }, findings: [{ ...finding, riskFlags: ['migration'], migrationPlan, independentReview }] }, true],
		['legacy debt needs ratchet', { ...base, assuranceProfile: { level: 'elevated', risks: ['legacy_debt'] }, findings: [{ ...finding, riskFlags: ['legacy_debt'], independentReview }] }, false],
		['legacy scalar is insufficient for package', { ...base, assuranceProfile: { level: 'elevated', risks: ['legacy_debt'] }, findings: [{ ...finding, riskFlags: ['legacy_debt'], modularityRatchet: { metric: 'file lines', baseline: 9240, after: 9230, budget: 9240, posture: 'no_growth' }, independentReview }] }, false],
		['fixed legacy debt with typed ratchet', { ...base, domains: { ...base.domains, modularity: { ...base.domains.modularity, legacyDebtPaths: ['src/Legacy.php'] } }, assuranceProfile: { level: 'elevated', risks: ['legacy_debt'] }, findings: [{ ...finding, riskFlags: ['legacy_debt'], modularityRatchet: ratchet, independentReview }] }, true],
		['fixed finding missing inventory', { ...base, assuranceProfile: { level: 'elevated', risks: ['legacy_debt'] }, findings: [{ ...finding, riskFlags: ['legacy_debt'], modularityRatchet: ratchet, independentReview }] }, false],
		['fixed finding misses inventoried file', { ...base, domains: { ...base.domains, modularity: { ...base.domains.modularity, legacyDebtPaths: ['src/Legacy.php', 'src/Other.php'] } }, assuranceProfile: { level: 'elevated', risks: ['legacy_debt'] }, findings: [{ ...finding, riskFlags: ['legacy_debt'], modularityRatchet: ratchet, independentReview }] }, false],
		['mixed domain and finding coverage', { ...base, domains: { ...base.domains, modularity: { ...base.domains.modularity, legacyDebtPaths: ['src/Legacy.php', 'src/Other.php'], modularityRatchets: [{ ...ratchet[0], path: 'src/Other.php' }] } }, assuranceProfile: { level: 'elevated', risks: ['legacy_debt'] }, findings: [{ ...finding, riskFlags: ['legacy_debt'], modularityRatchet: ratchet, independentReview }] }, true],
		['mixed proof rejects unbound finding receipt', { ...base, domains: { ...base.domains, modularity: { ...base.domains.modularity, legacyDebtPaths: ['src/Legacy.php', 'src/Other.php'], modularityRatchets: [{ ...ratchet[0], path: 'src/Other.php' }] } }, assuranceProfile: { level: 'elevated', risks: ['legacy_debt'] }, findings: [{ ...finding, riskFlags: ['legacy_debt'], modularityRatchet: [{ ...ratchet[0], evidence: [{ ...ratchet[0].evidence[0], identity: undefined }] }], independentReview }] }, false],
		['duplicate domain and finding path', { ...base, domains: { ...base.domains, modularity: { ...base.domains.modularity, legacyDebtPaths: ['src/Legacy.php'], modularityRatchets: ratchet } }, assuranceProfile: { level: 'elevated', risks: ['legacy_debt'] }, findings: [{ ...finding, riskFlags: ['legacy_debt'], modularityRatchet: ratchet, independentReview }] }, false],
		['unrelated finding cannot cover a legacy path', { ...base, domains: { ...base.domains, modularity: { ...base.domains.modularity, legacyDebtPaths: ['src/Legacy.php'] } }, assuranceProfile: { level: 'elevated', risks: ['legacy_debt'] }, findings: [{ ...finding, riskFlags: [], modularityRatchet: ratchet }] }, false],
		['clean migration and legacy debt domain proof', cleanRisk({}), true],
		['URL is not a file path', cleanRisk({ legacyDebtPaths: ['https://example.com/file.php'], modularityRatchets: [{ ...ratchet[0], path: 'https://example.com/file.php' }] }), false],
		['issue is not a file path', cleanRisk({ legacyDebtPaths: ['issues/123'], modularityRatchets: [{ ...ratchet[0], path: 'issues/123' }] }), false],
		['traversal is not a file path', cleanRisk({ legacyDebtPaths: ['../src/Legacy.php'], modularityRatchets: [{ ...ratchet[0], path: '../src/Legacy.php' }] }), false],
		['valid handle and scoped exception', cleanRisk({ modularityRatchets: withException() }), true],
		['wrong exception approved path', cleanRisk({ modularityRatchets: withException({ approvalScope: { ...exception.approvalScope, path: 'src/Other.php' } }) }), false],
		['wrong exception approved metric', cleanRisk({ modularityRatchets: withException({ approvalScope: { ...exception.approvalScope, metric: 'logicalFileLines' } }) }), false],
		['wrong exception approved budget', cleanRisk({ modularityRatchets: withException({ approvalScope: { ...exception.approvalScope, budget: 150 } }) }), false],
		['wrong exception approved owner', cleanRisk({ modularityRatchets: withException({ approvalScope: { ...exception.approvalScope, owner: '@other' } }) }), false],
		['uncovered legacy path', cleanRisk({ legacyDebtPaths: ['src/Legacy.php', 'src/Other.php'] }), false],
		['missing oversized method count', cleanRisk({ modularityRatchets: [{ ...ratchet[0], measurements: { ...ratchet[0].measurements, oversizedMethodCount: undefined } }] }), false],
		['missing largest changed method', cleanRisk({ modularityRatchets: [{ ...ratchet[0], measurements: { ...ratchet[0].measurements, largestChangedMethod: undefined } }] }), false],
		['missing file lines', cleanRisk({ modularityRatchets: [{ ...ratchet[0], measurements: { ...ratchet[0].measurements, logicalFileLines: undefined } }] }), false],
		['shrinking file with growing method', cleanRisk({ modularityRatchets: [{ ...ratchet[0], measurements: { ...ratchet[0].measurements, largestChangedMethod: metric(150, 151) } }] }), false],
		['growing oversized method count', cleanRisk({ modularityRatchets: [{ ...ratchet[0], measurements: { ...ratchet[0].measurements, oversizedMethodCount: metric(4, 5) } }] }), false],
		['valid scoped exception', cleanRisk({ modularityRatchets: [{ ...ratchet[0], measurements: { ...ratchet[0].measurements, largestChangedMethod: { baseline: 150, after: 151, budget: 151, posture: 'exception', owner: 'Jane Owner', issue: 'issues/123', rationale: 'Approved temporary growth', ownerApproval: { ...evidence('approvals/123.md', 'Jane Owner approved temporary method growth'), kind: 'owner' }, approvalScope: { owner: 'Jane Owner', path: 'src/Legacy.php', metric: 'largestChangedMethod', budget: 151 } } } }] }), true],
		['invalid exception lacks owner approval', cleanRisk({ modularityRatchets: [{ ...ratchet[0], measurements: { ...ratchet[0].measurements, largestChangedMethod: { ...metric(150, 151), posture: 'exception', owner: 'Jane Owner', issue: 'issues/123', rationale: 'Approved temporary growth' } } }] }), false],
		['malformed exception approval observation', cleanRisk({ modularityRatchets: [{ ...ratchet[0], measurements: { ...ratchet[0].measurements, largestChangedMethod: { baseline: 150, after: 151, budget: 151, posture: 'exception', owner: 'Jane Owner', issue: 'issues/123', rationale: 'Approved temporary growth', ownerApproval: { ...evidence('approvals/123.md', 'Jane Owner approved temporary method growth'), kind: 'owner', observation: 123 } } } }] }), false],
		['ratchet candidate mismatch', cleanRisk({ modularityRatchets: [{ ...ratchet[0], evidence: [{ ...ratchet[0].evidence[0], identity: { ...identity, artifactSha256: 'c'.repeat(64) } }] }] }), false],
		['migration candidate mismatch', cleanRisk({ migrationPlan: { ...migrationPlan, rollbackCheck: { ...migrationPlan.rollbackCheck, identity: { ...identity, commitSha: 'c'.repeat(40) } } } }), false],
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
