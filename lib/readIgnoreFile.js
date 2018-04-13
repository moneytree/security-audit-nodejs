'use strict';

const fs = require('fs');
const pathJoin = require('path').join;

const FILENAME = '.security-audit-nodejs-ignore';

// format:
// - one entry per line
// - vulnerability ID + any amount of white space + optional comment starting with "#"

module.exports = function (cwd) {
	let data;

	try {
		data = fs.readFileSync(pathJoin(cwd, FILENAME), { encoding: 'utf8' });
	} catch (error) {
		if (error.code === 'ENOENT') {
			return undefined;
		}

		throw error;
	}

	const result = {};

	const lines = data.split('\n');
	for (let line of lines) {
		line = line.trim();

		// any amount of white space + optional comment starting with "#"
		if (line === '' || line[0] === '#') {
			continue;
		}

		// - vulnerability ID + any amount of white space + optional comment starting with "#"
		const m = line.match(/^(\S+)(\s+#\s*(.+))?$/);
		if (!m) {
			throw new Error(`Could not parse line from ${FILENAME}: ${line}`);
		}

		const id = m[1];
		const comment = m[3];

		result[id] = comment;
	}

	return result;
};
