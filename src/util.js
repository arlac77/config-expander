const fs = require('fs');

export function readFile(path) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, (error, data) => {
			if (error) {
				reject(error);
			} else {
				resolve(data);
			}
		});
	});
}

export function createValue(value) {
	return Object.create(null, {
		value: {
			value
		}
	});
}
