import { suite, test } from 'mocha';
import chai from 'chai';
import { getConvertedUnits, getValidationResults, validationChain } from '../middlewares/validators/convert.js';
import { convertUnits, getSanitizedInput } from '../controllers/convert.js';

const { assert } = chai;

suite('Unit Tests', () => {
	test('Should correctly read a whole number input', async () => {
		const expectedInput = 3;
		const req = {
			query: {
				input: '3kg',
			},
		};

		await getConvertedUnits(req, {}, () => {});
		const sanitizedInput = getSanitizedInput(req);

		assert.strictEqual(
			sanitizedInput.value,
			expectedInput,
			`Whole number input like ${req.query.input} should be processed as an integer`,
		);
	});

	test('Should correctly read a decimal number input', async () => {
		const expectedInput = 2.5;
		const req = {
			query: {
				input: '2.5lbs',
			},
		};

		await getConvertedUnits(req, {}, () => {});
		const sanitizedInput = getSanitizedInput(req);

		assert.strictEqual(
			sanitizedInput.value,
			expectedInput,
			`Decimal number input like ${req.query.input} should be processed as a float`,
		);
	});

	test('Should correctly read a fractional number input', async () => {
		const expectedInput = 0.2;
		const req = {
			query: {
				input: '1/5lbs',
			},
		};

		await getConvertedUnits(req, {}, () => {});
		const sanitizedInput = getSanitizedInput(req);

		assert.strictEqual(
			sanitizedInput.value,
			expectedInput,
			`Fractional number input like ${req.query.input} should be processed as a float`,
		);
	});

	test('Should correctly read a fractional input with a decimal', async () => {
		const expectedInput = 0.4;
		const req = {
			query: {
				input: '0.2/0.5kg',
			},
		};

		await getConvertedUnits(req, {}, () => {});
		const sanitizedInput = getSanitizedInput(req);

		assert.strictEqual(
			sanitizedInput.value,
			expectedInput,
			`Fractional number input with decimals like ${req.query.input} should be processed as a float`,
		);
	});

	test('Should correctly return an error on double-fraction (i.e. 3/2/3)', async () => {
		const expectedErrorMessage = 'invalid number';
		const req = {
			query: {
				input: '3/2/3kg',
			},
		};

		await validationChain(req);
		const results = getValidationResults(req).mapped();

		assert.strictEqual(
			results.input.msg,
			expectedErrorMessage,
			`Double fraction values like ${req.query.input} should return the error message '${expectedErrorMessage}'`,
		);
	});

	test('Should correctly default to a numerical input of 1 when no numerical input is provided', async () => {
		const expectedInput = 1;
		const req = {
			query: {
				input: 'mi',
			},
		};

		await getConvertedUnits(req, {}, () => {});
		const sanitizedInput = getSanitizedInput(req);

		assert.strictEqual(sanitizedInput.value, expectedInput, 'Input should default to 1 if no values are provided');
	});

	test('Should correctly default read each valid input unit', async () => {
		const units = [
			['mi', 'mi'],
			['MI', 'mi'],
			['km', 'km'],
			['KM', 'km'],
			['gal', 'gal'],
			['GAL', 'gal'],
			['l', 'L'],
			['L', 'L'],
			['lbs', 'lbs'],
			['LBS', 'lbs'],
			['kg', 'kg'],
			['KG', 'kg'],
		];

		for (const [input, expectedUnit] of units) {
			const req = {
				query: {
					input: input,
				},
			};

			// eslint-disable-next-line no-await-in-loop
			await getConvertedUnits(req, {}, () => {});
			const sanitizedInput = getSanitizedInput(req);

			assert.strictEqual(
				sanitizedInput.unit,
				expectedUnit,
				`Unit value ${input} should be normalized to ${expectedUnit}`,
			);
		}
	});

	test('Should correctly return an error for an invalid input unit', async () => {
		const expectedErrorMessage = 'invalid unit';
		const req = {
			query: {
				input: 'm',
			},
		};

		await validationChain(req);
		const results = getValidationResults(req).mapped();

		assert.strictEqual(
			results.input.msg,
			expectedErrorMessage,
			`Invalid unit values in ${req.query.input} should return the error message '${expectedErrorMessage}'`,
		);
	});

	test('Should return the correct return unit for each valid input unit', async () => {
		const units = [
			['mi', 'km'],
			['MI', 'km'],
			['km', 'mi'],
			['KM', 'mi'],
			['gal', 'L'],
			['GAL', 'L'],
			['l', 'gal'],
			['L', 'gal'],
			['lbs', 'kg'],
			['LBS', 'kg'],
			['kg', 'lbs'],
			['KG', 'lbs'],
		];

		for (const [inputUnit, expectedReturnUnit] of units) {
			const req = {
				query: {
					input: `2${inputUnit}`,
				},
			};

			// eslint-disable-next-line no-await-in-loop
			await getConvertedUnits(req, {}, () => {});
			const { value, unit } = getSanitizedInput(req);
			const returnValues = convertUnits(value, unit);

			assert.strictEqual(
				returnValues.returnUnit,
				expectedReturnUnit,
				`Unit value ${inputUnit} should be converted to ${expectedReturnUnit}`,
			);
		}
	});

	test('Should correctly return the spelled-out string unit for each valid input unit', async () => {
		const units = [
			['mi', '2 miles converts to 3.21869 kilometres'],
			['km', '2 kilometres converts to 1.24274 miles'],
			['gal', '2 gallons converts to 7.57082 litres'],
			['L', '2 litres converts to 0.52834 gallons'],
			['lbs', '2 pounds converts to 0.90718 kilograms'],
			['kg', '2 kilograms converts to 4.40925 pounds'],
		];

		for (const [inputUnit, expectedString] of units) {
			const req = {
				query: {
					input: `2${inputUnit}`,
				},
			};

			// eslint-disable-next-line no-await-in-loop
			await getConvertedUnits(req, {}, () => {});
			const { value, unit } = getSanitizedInput(req);
			const returnValues = convertUnits(value, unit);

			assert.strictEqual(
				returnValues.string,
				expectedString,
				`String value for ${inputUnit} after conversion should be ${expectedString}`,
			);
		}
	});

	test('Should correctly convert gal to L', async () => {
		const expectedOutput = {
			initNum: 1,
			initUnit: 'gal',
			returnNum: 3.78541,
			returnUnit: 'L',
			string: '1 gallon converts to 3.78541 litres',
		};
		const req = {
			query: {
				input: '1gal',
			},
		};

		await getConvertedUnits(req, {}, () => {});
		const { value, unit } = getSanitizedInput(req);
		const returnValues = convertUnits(value, unit);

		assert.deepStrictEqual(
			returnValues,
			expectedOutput,
			`Return value for converting ${req.query.input} should be ${expectedOutput}`,
		);
	});

	test('Should correctly convert L to gal', async () => {
		const expectedOutput = {
			initNum: 1,
			initUnit: 'L',
			returnNum: 0.26417,
			returnUnit: 'gal',
			string: '1 litre converts to 0.26417 gallons',
		};
		const req = {
			query: {
				input: '1L',
			},
		};

		await getConvertedUnits(req, {}, () => {});
		const { value, unit } = getSanitizedInput(req);
		const returnValues = convertUnits(value, unit);

		assert.deepStrictEqual(
			returnValues,
			expectedOutput,
			`Return value for converting ${req.query.input} should be ${expectedOutput}`,
		);
	});

	test('Should correctly convert mi to km', async () => {
		const expectedOutput = {
			initNum: 1,
			initUnit: 'mi',
			returnNum: 1.60934,
			returnUnit: 'km',
			string: '1 mile converts to 1.60934 kilometres',
		};
		const req = {
			query: {
				input: '1mi',
			},
		};

		await getConvertedUnits(req, {}, () => {});
		const { value, unit } = getSanitizedInput(req);
		const returnValues = convertUnits(value, unit);

		assert.deepStrictEqual(
			returnValues,
			expectedOutput,
			`Return value for converting ${req.query.input} should be ${expectedOutput}`,
		);
	});

	test('Should correctly convert km to mi', async () => {
		const expectedOutput = {
			initNum: 1,
			initUnit: 'km',
			returnNum: 0.62137,
			returnUnit: 'mi',
			string: '1 kilometre converts to 0.62137 miles',
		};
		const req = {
			query: {
				input: '1km',
			},
		};

		await getConvertedUnits(req, {}, () => {});
		const { value, unit } = getSanitizedInput(req);
		const returnValues = convertUnits(value, unit);

		assert.deepStrictEqual(
			returnValues,
			expectedOutput,
			`Return value for converting ${req.query.input} should be ${expectedOutput}`,
		);
	});

	test('Should correctly convert lbs to kg', async () => {
		const expectedOutput = {
			initNum: 1,
			initUnit: 'lbs',
			returnNum: 0.45359,
			returnUnit: 'kg',
			string: '1 pound converts to 0.45359 kilograms',
		};
		const req = {
			query: {
				input: '1lbs',
			},
		};

		await getConvertedUnits(req, {}, () => {});
		const { value, unit } = getSanitizedInput(req);
		const returnValues = convertUnits(value, unit);

		assert.deepStrictEqual(
			returnValues,
			expectedOutput,
			`Return value for converting ${req.query.input} should be ${expectedOutput}`,
		);
	});

	test('Should correctly convert kg to lbs', async () => {
		const expectedOutput = {
			initNum: 1,
			initUnit: 'kg',
			returnNum: 2.20462,
			returnUnit: 'lbs',
			string: '1 kilogram converts to 2.20462 pounds',
		};
		const req = {
			query: {
				input: '1kg',
			},
		};

		await getConvertedUnits(req, {}, () => {});
		const { value, unit } = getSanitizedInput(req);
		const returnValues = convertUnits(value, unit);

		assert.deepStrictEqual(
			returnValues,
			expectedOutput,
			`Return value for converting ${req.query.input} should be ${expectedOutput}`,
		);
	});
});
