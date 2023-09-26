import fs from 'fs';
import path from 'path';

import { EventEmitter } from 'events';
import Mocha from 'mocha';

import { assertionAnalyser } from '../config/assertion-analyzer.js';

const mocha = new Mocha();
const testDir = path.join(process.cwd(), 'tests');

// Add each .js file to the mocha instance
fs.readdirSync(testDir)
	.filter(function (file) {
		// Only keep the .js files
		return file.endsWith('.js');
	})
	.forEach(function (file) {
		mocha.addFile(path.join(testDir, file));
	});

const emitter = new EventEmitter();
emitter.run = function () {
	const tests = [];
	let context = '';
	const separator = ' -> ';
	// Run the tests.
	mocha
		.loadFilesAsync()
		.then(() =>
			mocha
				.ui('tdd')
				.run()
				.on('test end', function (test) {
					// remove comments
					let body = test.body.replace(/\/\/.*\n|\/\*.*\*\//g, '');
					// collapse spaces
					body = body.replace(/\s+/g, ' ');
					const obj = {
						title: test.title,
						context: context.slice(0, -separator.length),
						state: test.state,
						// body: body,
						assertions: assertionAnalyser(body),
					};
					tests.push(obj);
				})
				.on('end', function () {
					emitter.report = tests;
					emitter.emit('done', tests);
				})
				.on('suite', function (s) {
					context += s.title + separator;
				})
				.on('suite end', function (s) {
					context = context.slice(0, -(s.title.length + separator.length));
				}),
		)
		.catch(() => (process.exitCode = 1));
};

export default emitter;
