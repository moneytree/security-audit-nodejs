'use strict';

const chalk = require('chalk');
const severityTypes = require('../severities').types;

function print(str) {
	process.stderr.write(`${str}\n`);
}

function printWarning(warning, summary, options) {
	print('');
	print(chalk.red.bold(warning.title));
	print('-------------------------------------------------------');

	if (warning.locations) {
		for (const location of warning.locations) {
			print(`At: > ${location}`);
		}
		print('-------------------------------------------------------');
	}

	for (const { id, desc, severity, url, howToFix } of warning.vulnerabilities) {
		summary[severity] += 1;

		print(`[severity: ${chalk.bold(severity)}] ${desc}`);

		if (url) {
			print(`More info: ${url}`);
		}

		if (howToFix) {
			print(chalk.green(`How to fix: ${howToFix}`));
		}

		if (options.showIgnoreHelp) {
			print(chalk.dim(`How to ignore: add "${id}" to .security-audit-nodejs-ignore`));
		}

		print('');
	}
}

function printIgnoredWarning(warning, ignore) {
	for (const { desc, id } of warning.ignored) {
		const reason = ignore[id] || desc;

		print(chalk.dim(`Ignored: ${warning.title} - ${reason} (ID: ${id})`));
	}
}

function printTotal(summary, severity) {
	const found = summary[severity];

	if (found > 0) {
		print(chalk.bold(`Found ${found} ${severity}-level vulnerabilities`));
	}
}


module.exports = (warnings, ignore, options) => {
	const summary = {
		[severityTypes.LOW]: 0,
		[severityTypes.MEDIUM]: 0,
		[severityTypes.HIGH]: 0,
		[severityTypes.CRITICAL]: 0
	};

	// list everything we ignore

	for (const warning of warnings) {
		if (warning.ignored.length > 0) {
			printIgnoredWarning(warning, ignore);
		}
	}

	// list vulnerabilities

	for (const warning of warnings) {
		if (warning.vulnerabilities.length > 0) {
			printWarning(warning, summary, options);
		}
	}

	// summary

	printTotal(summary, severityTypes.LOW);
	printTotal(summary, severityTypes.MEDIUM);
	printTotal(summary, severityTypes.HIGH);
	printTotal(summary, severityTypes.CRITICAL);
	print('');
};
