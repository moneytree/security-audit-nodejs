'use strict';

const assert = require('assert');
const Warning = require('./Warning');
const { isSeverity } = require('./severities');
const findModule = require('./findModule');

const byTitle = Symbol();


module.exports = class Warnings {
	constructor(options = {}) {
		this.options = {
			ignore: options.ignore || {},
			severity: options.severity || 'low',
			cwd: options.cwd || process.cwd()
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

		const warning = this.getOrAddWarning(title);
		warning.registerModuleLocations(findModule(modName, version, this.options.cwd));

		return warning;
	}

	print(format, options) {
		assert(/^[a-zA-Z0-9]+$/.test(format));

		require(`./formatters/${format}`)(this.warnings, this.options.ignore, options);
	}
};
