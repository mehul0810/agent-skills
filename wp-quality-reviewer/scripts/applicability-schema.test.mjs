import assert from 'node:assert/strict';
import fs from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import { runSelfTest } from './review-report-self-test.mjs';
import { validate } from './validate-review-report.mjs';

const schema = JSON.parse(fs.readFileSync(new URL('../../shared/schemas/wp-quality-review.schema.json', import.meta.url), 'utf8'));
const ajv = new Ajv2020({ strict: false });
ajv.addSchema(schema, 'review');
const check = (path, value, expected) => {
	const validate = ajv.compile({ $ref: `review#/$defs/${path}` });
	assert.equal(validate(value), expected, JSON.stringify(validate.errors));
};
check('capacityEnvelope/properties/queue', { status: 'not_applicable', reason: 'No asynchronous work is used' }, true);
check('capacityEnvelope/properties/queue', { status: 'not_applicable', reason: 'No asynchronous work is used', arrivalRate: 1 }, false);
check('capacityEnvelope/properties/queue', { arrivalRate: 1 }, false);
check('capacityEnvelope/properties/fairness', { status: 'not_applicable', reason: 'There is one single tenant' }, true);
check('capacityEnvelope/properties/fairness', { scope: 'tenant', limit: 0, unit: 'requests' }, false);
const readWebhook = { handler: 'health callback', action: 'read status', resource: 'public health status', effect: 'read_only', effectReason: 'Returns a public health status', workload: 'bounded', workloadReason: 'Returns one fixed cached value' };
const orderWebhook = { handler: 'order callback', action: 'update order', resource: 'order status', deniedActor: 'untrusted sender', effect: 'mutating', effectReason: 'The callback updates order status', workload: 'abuse_prone', workloadReason: 'Concurrent callbacks can trigger expensive work', workScope: 'order webhook processing' };
check('webhookScope', readWebhook, true);
check('webhookScope', orderWebhook, true);
check('webhookScope', { ...orderWebhook, deniedActor: undefined }, false);
check('webhookScope', { ...orderWebhook, workScope: undefined }, false);
check('webhookScope', { ...readWebhook, deniedActor: 'untrusted sender' }, false);
check('webhookScope', { ...readWebhook, workScope: 'order webhook processing' }, false);
console.log('applicability schema controls passed');

// A positive semantic fixture must also be a document the portable schema accepts.
const validateSchema = ajv.getSchema('review');
runSelfTest((record) => {
	const errors = validate(record);
	if (!validateSchema(JSON.parse(JSON.stringify(record)))) errors.push(ajv.errorsText(validateSchema.errors));
	return errors;
});
