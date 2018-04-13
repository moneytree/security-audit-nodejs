'use strict';

const { spawnSync } = require('child_process');

function traverse(results, path, node) {
	if (!node.dependencies) {
		// in the case of a missing dependency, there will be a root node, but no dependencies
		if (path.length > 0) {
			results.push(path);
		}
		return;
	}

	const depNames = Object.keys(node.dependencies);
	for (const depName of depNames) {
		const depNode = node.dependencies[depName];
		const newPath = path.concat(depNode.from);
		traverse(results, newPath, depNode);
	}
}


module.exports = (modName, version, cwd) => {
	const mod = `${modName}@${version}`;

	const { stdout, error } = spawnSync('npm', ['ls', '--json', 'true', mod], { encoding: 'utf8', cwd });
	if (error) {
		return;
	}

	try {
		const tree = JSON.parse(stdout);
		const results = [];

		traverse(results, [], tree);

		return results;
	} catch (error) {
		return null;
	}
};
