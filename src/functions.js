/* jslint node: true, esnext: true */
'use strict';

const fs = require('fs'),
	path = require('path'),
	crypto = require('crypto');

import {
	readFile, createValue
}
from './util';

export const functions = {
	document: {
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
	},
	encrypt: {
		arguments: ['string', 'string', 'string'],
		returns: 'string',
		apply: (context, args) => {
			const [cryptkey, iv, cleardata] = args.map(a => a.value);
			const encipher = crypto.createCipheriv('aes-256-cbc', cryptkey, iv);
			let encryptdata = encipher.update(cleardata, 'utf8', 'binary');
			encryptdata += encipher.final('binary');
			const encode_encryptdata = new Buffer(encryptdata, 'binary').toString('base64');
			return createValue(new Buffer(encryptdata, 'binary').toString('base64'));
		}
	},
	decrypt: {
		arguments: ['string', 'string', 'string'],
		returns: 'string',
		apply: (context, args) => {
			let [cryptkey, iv, encryptdata] = args.map(a => a.value);

			encryptdata = new Buffer(encryptdata, 'base64').toString('binary');

			const decipher = crypto.createDecipheriv('aes-256-cbc', cryptkey, iv);
			let decoded = decipher.update(encryptdata, 'binary', 'utf8');
			decoded += decipher.final('utf8');
			return createValue(decoded);
		}
	}
};

// BACKward compatibility only
functions.file = functions.document;
