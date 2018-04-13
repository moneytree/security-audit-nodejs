'use strict';

const depcheck = require('depcheck');
const pathJoin = require('path').join;
const severityTypes = require('../severities').types;

module.exports = (cwd, warnings) => {
	return new Promise((resolve/* , reject */) => {
		const options = {};

		const pkg = require(pathJoin(cwd, 'package.json'));

		depcheck(cwd, options, (unused) => {
			function handleDeps(depNames, pkgDeps, saveOption) {
				if (!depNames) {
					return;
				}

				for (const depName of depNames) {
					const version = pkgDeps[depName];

					const warning = warnings.getOrAddModWarning(depName, version);

					warning.addVulnerability(
						'depcheck',
						`depcheck:${depName}@${version}`,
						severityTypes.LOW,
						`Unused dependency "${depName}"`,
						null,
						`npm uninstall ${saveOption} "${depName}"`
					);
				}
			}

			handleDeps(unused.dependencies, pkg.dependencies, '--save');
			handleDeps(unused.devDependencies, pkg.devDependencies, '--save-dev');

			resolve();
		});
	});
};
