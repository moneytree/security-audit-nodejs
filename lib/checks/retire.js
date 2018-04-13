'use strict';

const resolveBin = require('resolve-bin').sync;
const { spawnSync } = require('child_process');
const severityTypes = require('../severities').types;

const retirePath = resolveBin('retire');

const severityMap = {
	low: severityTypes.LOW,
	medium: severityTypes.MEDIUM,
	high: severityTypes.HIGH,
	critical: severityTypes.CRITICAL
};

module.exports = (cwd, warnings) => {
	const { stderr, error } = spawnSync(retirePath, ['--outputformat', 'json'], { encoding: 'utf8', cwd });
	if (error) {
		throw error;
	}

	for (const { results } of JSON.parse(stderr)) {
		for (const { component, version, vulnerabilities } of results) {
			const warning = warnings.getOrAddModWarning(component, version);

			for (const { severity, identifiers, info } of vulnerabilities) {
				const desc = identifiers.summary || identifiers.advisory;
				const url = info[0];
				const id = `retire:${url}`;

				warning.addVulnerability(
					'Retire.js',
					id,
					severityMap[severity],
					desc,
					url,
					`Locate module with: npm ls "${component}@${version}"`
				);
			}
		}
	}
};
