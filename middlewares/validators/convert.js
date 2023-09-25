import { divide, fraction, number } from 'mathjs';
import { checkSchema, validationResult } from 'express-validator';

import { mapping } from '../../constants/units.js';
import logger from '../../config/logger.js';

export const validationChain = (req) => {
	return checkSchema(
		{
			input: {
				exists: {
					bail: true,
					options: {
						values: 'falsy',
					},
					errorMessage: 'invalid unit',
				},
				splitInputString: {
					customSanitizer: (input) => {
						const regex = new RegExp('^(.*?)(mi|gal|lbs|km|l|kg)?$', 'gi');

						const [matched] = [...input.matchAll(regex)];
						const value = matched[1] || '1';
						const unit = matched[2] || '';

						return { value, unit };
					},
				},
				isValid: {
					bail: true,
					custom: (input, { req } = []) => {
						let { value, unit } = input;
						unit = unit.toLowerCase();
						req.query.input.errors = [];

						if (value.split('/').length > 2) req.query.input.errors.push('number');

						if (!Object.keys(mapping).includes(unit)) req.query.input.errors.push('unit');

						return req.query.input.errors.length <= 0;
					},
					errorMessage: (_, { req }) => `invalid ${req.query.input.errors.join(' and ')}`,
				},
				convertToUnits: {
					customSanitizer: (input) => {
						const { value, unit } = input;
						const splitString = value.split('/');

						const frac1 = fraction(splitString[0]);
						const frac2 = splitString[1] ? fraction(`${splitString[1]}`) : fraction('1');

						return { value: number(divide(frac1, frac2)), unit: mapping[unit.toLowerCase()].sanitized };
					},
				},
			},
		},
		['query'],
	).run(req);
};

export const getValidationResults = (req) => {
	return validationResult(req);
};

export const formatValidationErrorMsg = (req, result) => {
	const statusCode = 422;
	const errors = result.mapped();

	logger.error(
		`${statusCode} ${req.method} ${req.path}${' ' + JSON.stringify(req.body) || ''} - ${JSON.stringify(errors)}`,
	);

	return { statusCode, string: errors.input.msg };
};

export const getConvertedUnits = async (req, res, next) => {
	await validationChain(req);

	const result = getValidationResults(req);

	if (!result.isEmpty()) {
		const payload = formatValidationErrorMsg(req, result);

		return res.status(payload.statusCode).json({ string: payload.string });
	}

	return next();
};
