'use strict';

const LOW = 'low';
const MEDIUM = 'medium';
const HIGH = 'high';
const CRITICAL = 'critical';

exports.types = { LOW, MEDIUM, HIGH, CRITICAL };

exports.isSeverity = (value) => {
	return (value === LOW || value === MEDIUM || value === HIGH || value === CRITICAL);
};

exports.isAtLeast = (severity, minimum) => {
	if (!exports.isSeverity(severity)) {
		throw new Error(`"${severity}" is not a valid severity level`);
	}

	if (minimum === LOW) {
		return (severity === LOW || severity === MEDIUM || severity === HIGH || severity === CRITICAL);
	}

	if (minimum === MEDIUM) {
		return (severity === MEDIUM || severity === HIGH || severity === CRITICAL);
	}

	if (minimum === HIGH) {
		return (severity === HIGH || severity === CRITICAL);
	}

	if (minimum === CRITICAL) {
		return (severity === CRITICAL);
	}

	throw new Error(`"${minimum}" is not a valid severity level`);
};
