#!/usr/bin/env node

/* eslint-disable no-console, no-process-exit */

'use strict';

const argv = require('minimist')(process.argv.slice(2));

const Warnings = require('../lib/Warnings');
const readIgnoreFile = require('../lib/readIgnoreFile');

const checks = [
	{
		name: 'Node Security Platform (NSP)',
		fn: require('../lib/checks/nsp')
	},
	{
		name: 'Retire.js',
		fn: require('../lib/checks/retire')
	},
	{
		name: 'Depcheck',
		fn: require('../lib/checks/depcheck')
	},
	{
		name: 'is-node-maintained',
		fn: require('../lib/checks/node-version')
	}
];

process.on('unhandledRejection', (error) => {
	console.error(error);
	process.exit(2);
});

process.on('uncaughtException', (error) => {
	console.error(error);
	process.exit(3);
});

const cwd = process.cwd();
const ignore = readIgnoreFile(cwd);

(async () => {
	const warnings = new Warnings({
		ignore,
		severity: argv.severity || 'low',
		cwd
	});

	const total = checks.length;
	let i = 1;

	for (const check of checks) {
		process.stderr.write(`[${i}/${total}] Checking ${check.name}\n`);

		await check.fn(cwd, warnings);

		i += 1;
	}

	warnings.print('human', {
		showIgnoreHelp: true
	});

	process.exitCode = warnings.hasVulnerabilities() ? 1 : 0;
})();
