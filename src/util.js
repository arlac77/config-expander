/* jslint node: true, esnext: true */
'use strict';

const fs = require('fs');

export function readFile(path) {
	return new Promise((fullfill, reject) => {
		fs.readFile(path, (error, data) => {
			if (error) {
				reject(error);
			} else {
				fullfill(data);
			}
		});
	});
}

export function createValue(value) {
	return Object.create(null, {
		value: {
			value: value
		}
	});
}
