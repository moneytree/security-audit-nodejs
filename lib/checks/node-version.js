'use strict';

const wantedNodeVersion = require('wanted-node-version');
const isNodeMaintained = require('is-node-maintained');
const severityTypes = require('../severities').types;

module.exports = (cwd, warnings) => {
	const { sources, conflict } = wantedNodeVersion(cwd);

	const title = 'Node.js version issues';

	if (conflict) {
		warnings.getOrAddWarning(title).addVulnerability(
			'wanted-node-version',
			'wnv:conflict',
			severityTypes.MEDIUM,
			`Node.js version conflicts between ${Object.keys(sources).join(', ')}`
		);
	}

	// check all mentioned versions for unmaintained Node.js

	for (const source in sources) {
		if (sources.hasOwnProperty(source)) {
			if (!isNodeMaintained(sources[source])) {
				warnings.getOrAddWarning(title).addVulnerability(
					'is-node-maintained',
					`inm:${source}`,
					severityTypes.HIGH,
					`Unmaintained Node.js versions in ${source} version range: ${sources[source]}`,
					'https://github.com/nodejs/Release#release-schedule'
				);
			}
		}
	}
};
