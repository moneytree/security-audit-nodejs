'use strict';

const assert = require('assert');
const { isSeverity } = require('./severities');
const Warning = require('./Warning');

const byTitle = Symbol();

module.exports = class Warnings {
	constructor(options = {}) {
		this.options = {
			ignore: options.ignore || {},
			severity: options.severity || 'low'
		};

		assert(isSeverity(this.options.severity));

		this.warnings = [];
		this[byTitle] = {};
	}

	hasVulnerabilities() {
		for (const warning of this.warnings) {
			if (warning.vulnerabilities.length > 0) {
				return true;
			}
		}

		return false;
	}

	getOrAddWarning(title) {
		let warning = this[byTitle][title];
		if (!warning) {
			warning = this[byTitle][title] = new Warning(title, this.options);
			this.warnings.push(warning);
		}

		return warning;
	}

	getOrAddModWarning(modName, version) {
		const title = `Module: ${modName}@${version}`;

		// TODO: spawnSync and parse: npm ls --json true modName@version
		// TODO: if npm cannot run because its binary does not exist in PATH, ignore silently

		return this.getOrAddWarning(title);
	}

	print(format, options) {
		assert(/^[a-zA-Z0-9]+$/.test(format));

		require(`./formatters/${format}`)(this.warnings, this.options.ignore, options);
	}
};
