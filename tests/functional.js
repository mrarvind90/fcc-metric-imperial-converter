import chai from 'chai';
import chai_http from 'chai-http';
import { suite, test } from 'mocha';
import server from '../server.js';

chai.use(chai_http);
const { assert } = chai;

suite('Functional Tests', () => {
	test('GET /api/convert?input=10L', (done) => {
		const expectedOutput = {
			initNum: 10,
			initUnit: 'L',
			returnNum: 2.64172,
			returnUnit: 'gal',
			string: '10 litres converts to 2.64172 gallons',
		};

		chai.request(server)
			.get('/api/convert?input=10L')
			.end((req, res) => {
				assert.equal(res.status, 200);
				assert.deepStrictEqual(res.body, expectedOutput);
				done();
			});
	});

	test('GET /api/convert?input=32g', (done) => {
		const expectedOutput = {
			string: 'invalid unit',
		};

		chai.request(server)
			.get('/api/convert?input=32g')
			.end((req, res) => {
				assert.equal(res.status, 422);
				assert.deepStrictEqual(res.body, expectedOutput);
				done();
			});
	});

	test('GET /api/convert?input=3/7.2/4kg', (done) => {
		const expectedOutput = {
			string: 'invalid number',
		};

		chai.request(server)
			.get('/api/convert?input=3/7.2/4kg')
			.end((req, res) => {
				assert.equal(res.status, 422);
				assert.deepStrictEqual(res.body, expectedOutput);
				done();
			});
	});

	test('GET /api/convert?input=3/7.2/4kilomegagram', (done) => {
		const expectedOutput = {
			string: 'invalid number and unit',
		};

		chai.request(server)
			.get('/api/convert?input=3/7.2/4kilomegagram')
			.end((req, res) => {
				assert.equal(res.status, 422);
				assert.deepStrictEqual(res.body, expectedOutput);
				done();
			});
	});

	test('GET /api/convert?input=kg', (done) => {
		const expectedOutput = {
			initNum: 1,
			initUnit: 'kg',
			returnNum: 2.20462,
			returnUnit: 'lbs',
			string: '1 kilogram converts to 2.20462 pounds',
		};

		chai.request(server)
			.get('/api/convert?input=kg')
			.end((req, res) => {
				assert.equal(res.status, 200);
				assert.deepStrictEqual(res.body, expectedOutput);
				done();
			});
	});
});
