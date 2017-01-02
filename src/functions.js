/* jslint node: true, esnext: true */
'use strict';

const fs = require('fs'),
	path = require('path');

import {
	readFile, createValue
}
from './util';

const functions = {
	file: {
		arguments: ['string'],
		returns: 'blob',
		apply: (context, args) => createValue(readFile(path.resolve(context.constants.basedir, args[0].value)))
	},
	directory: {
		arguments: ['string'],
		returns: 'string',
		apply: (context, args) => createValue(path.resolve(context.constants.basedir, args[0].value))
	},
	include: {
		arguments: ['string'],
		returns: 'object',
		apply: (context, args) => createValue(JSON.parse(fs.readFileSync(path.resolve(context.constants.basedir, args[0].value))))
	},
	number: {
		arguments: ['string|number'],
		returns: 'number',
		apply: (context, args) => {
			const v = args[0].value;
			return createValue(parseFloat(v) === v ? v : parseFloat(v.replace(/[a-z]+/, '')));
		}
	},
	substring: {
		arguments: ['string', 'integer', 'integer'],
		returns: 'string',
		apply: (context, args) => createValue(args[0].value.substring(args[1].value, args[2].value))
	},
	replace: {
		arguments: ['string', 'string', 'string'],
		returns: 'string',
		apply: (context, args) => createValue(args[0].value.replace(args[1].value, args[2].value))
	},
	toUpperCase: {
		arguments: ['string'],
		returns: 'string',
		apply: (context, args) => createValue(args[0].value.toUpperCase())
	},
	toLowerCase: {
		arguments: ['string'],
		returns: 'string',
		apply: (context, args) => createValue(args[0].value.toLowerCase())
	}
};

export {
	functions
};
