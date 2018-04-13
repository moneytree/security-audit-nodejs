'use strict';

const resolveBin = require('resolve-bin').sync;
const { spawnSync } = require('child_process');
const severityTypes = require('../severities').types;

const nspPath = resolveBin('nsp');

function calcSeverity(cvssScore) {
	// See: https://www.first.org/cvss/specification-document#5-Qualitative-Severity-Rating-Scale

	if (cvssScore < 4) {
		return severityTypes.LOW;
	}

	if (cvssScore < 7) {
		return severityTypes.MEDIUM;
	}

	if (cvssScore < 9) {
		return severityTypes.HIGH;
	}

	return severityTypes.CRITICAL;
}

module.exports = (cwd, warnings) => {
	const { stdout, error } = spawnSync(nspPath, ['check', '.', '--reporter', 'json'], { encoding: 'utf8', cwd });
	if (error) {
		throw error;
	}

	// eslint-disable-next-line camelcase
	for (const { id, module, version, title, advisory, cvss_score } of JSON.parse(stdout)) {
		const warning = warnings.getOrAddModWarning(module, version);

		warning.addVulnerability(
			'Node Security Platform (NSP)',
			`nsp:${id}`,
			calcSeverity(cvss_score),
			title,
			advisory
		);
	}
};
