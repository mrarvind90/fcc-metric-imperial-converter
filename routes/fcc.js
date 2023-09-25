import fs from 'fs';
import cors from 'cors';

import runner from '../tests/runner.js';

export const fcc = (app) => {
	app.route('/_api/server.js').get((req, res, next) => {
		console.log('requested');
		fs.readFile(__dirname + '/server.js', (err, data) => {
			if (err) return next(err);
			return res.send(data.toString());
		});
	});
	app.route('/_api/routes/convert.js').get((req, res, next) => {
		console.log('requested');
		fs.readFile(__dirname + '/routes/convert.js', (err, data) => {
			if (err) return next(err);
			return res.type('txt').send(data.toString());
		});
	});
	app.route('/_api/controllers/convert.js').get((req, res, next) => {
		console.log('requested');
		fs.readFile(__dirname + '/controllers/convert.js', (err, data) => {
			if (err) return next(err);
			return res.type('txt').send(data.toString());
		});
	});

	app.get(
		'/_api/get-tests',
		cors(),
		(req, res, next) => {
			console.log('requested');
			if (process.env.NODE_ENV === 'test') return next();
			return res.json({ status: 'unavailable' });
		},
		(req, res, next) => {
			if (!runner.report) return next();
			return res.json(testFilter(runner.report, req.query.type, req.query.n));
		},
		(req, res) => {
			runner.on('done', (report) => {
				process.nextTick(() => res.json(testFilter(runner.report, req.query.type, req.query.n)));
			});
		},
	);
	app.get('/_api/app-info', (req, res) => {
		const hs = Object.keys(res._headers).filter((h) => !h.match(/^access-control-\w+/));
		const hObj = {};
		hs.forEach((h) => {
			hObj[h] = res._headers[h];
		});
		delete res._headers['strict-transport-security'];
		res.json({ headers: hObj });
	});
};

const testFilter = (tests, type, n) => {
	let out;
	switch (type) {
		case 'unit':
			out = tests.filter((t) => t.context.match('Unit Tests'));
			break;
		case 'functional':
			out = tests.filter((t) => t.context.match('Functional Tests') && !t.title.match('#example'));
			break;
		default:
			out = tests;
	}
	if (n !== undefined) {
		return out[n] || out;
	}
	return out;
};
