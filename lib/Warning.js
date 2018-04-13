'use strict';

const assert = require('assert');
const Vulnerability = require('./Vulnerability');
const severities = require('./severities');

const hasDescSymbol = Symbol();
const optionsSymbol = Symbol();

module.exports = class Warning {
	constructor(title, options = {}) {
		this[optionsSymbol] = options;
		this[hasDescSymbol] = {};

		assert(title);

		this.title = title;
		this.ignored = [];
		this.vulnerabilities = [];
		this.locations = undefined;
	}

	registerModuleLocations(locations) {
		if (!locations || locations.length === 0) {
			return;
		}

		const result = [];
		for (const location of locations) {
			result.push(location.join(' > '));
		}

		this.locations = result;
	}

	addVulnerability(source, id, severity, desc, url = null, howToFix = null) {
		if (this[hasDescSymbol][desc]) {
			// not reporting the same issue twice
			return;
		}

		this[hasDescSymbol][desc] = true;

		if (!severities.isAtLeast(severity, this[optionsSymbol].severity)) {
			// severity too low, ignore silently
			return;
		}

		const vulnerability = new Vulnerability(source, id, severity, desc, url, howToFix);

		if (this[optionsSymbol].ignore.hasOwnProperty(id)) {
			this.ignored.push(vulnerability);
		} else {
			this.vulnerabilities.push(vulnerability);
		}
	}
};
