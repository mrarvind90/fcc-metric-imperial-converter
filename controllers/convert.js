import { all, create } from 'mathjs';

import { mapping } from '../constants/units.js';

const math = create(all, {});

export const getSanitizedInput = (req) => {
	const { value, unit } = req.query.input;

	return { value, unit };
};

export const convertUnits = (value, unit) => {
	const { singular: initSingular, plural: initPlural, convertTo } = mapping[unit.toLowerCase()];
	const { singular: returnSingular, plural: returnPlural } = mapping[convertTo.toLowerCase()];

	value = math.round(value, 5);

	const unconvertedUnits = math.unit(value, unit);
	const returnNum = math.round(math.number(unconvertedUnits, convertTo), 5);
	const string = `${value} ${value === 1 ? initSingular : initPlural} converts to ${math.round(returnNum, 5)} ${
		returnNum === 1 ? returnSingular : returnPlural
	}`;

	return { initNum: value, initUnit: unit, returnNum, returnUnit: convertTo, string };
};

export const getConvertedUnits = (req, res) => {
	const { value, unit } = getSanitizedInput(req);

	return res.status(200).json(convertUnits(value, unit));
};
