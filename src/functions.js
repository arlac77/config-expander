/* jslint node: true, esnext: true */
'use strict';

/**
 * @module config-expander
 */

const fs = require('fs'),
	path = require('path'),
	crypto = require('crypto');

import {
	readFile, createValue
}
from './util';

import {
	expand
}
from './expander';

export const functions = {
	document: {
		arguments: ['string'],
		returns: 'blob',
		apply: (context, args) => createValue(readFile(path.resolve(context.constants.basedir, args[0].value)))
	},
	resolve: {
		arguments: ['string'],
		returns: 'string',
		apply: (context, args) => createValue(path.resolve(context.constants.basedir, args[0].value))
	},
	include: {
		arguments: ['string'],
		returns: 'object',
		apply: (context, args) => {
			const file = path.resolve(context.constants.basedir, args[
				0].value);

			return createValue(readFile(file).then(data =>
				expand(JSON.parse(data), Object.assign({}, context, {
					constants: Object.assign({}, context.constants, {
						basedir: path.dirname(file)
					})
				}))
			));
		}
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
		arguments: ['string', 'string'],
		returns: 'string',
		/**
		 * Encrypt a plaintext value
		 * @param {String} key
		 * @param {String} plaintext
		 * @return {String} encrypted value
		 */
		apply: (context, args) => {
			const [key, plaintext] = args.map(a => a.value);
			const encipher = crypto.createCipher('aes-256-cbc', key);
			let encryptdata = encipher.update(plaintext, 'utf8', 'binary');
			encryptdata += encipher.final('binary');
			const encode_encryptdata = new Buffer(encryptdata, 'binary').toString('base64');
			return createValue(new Buffer(encryptdata, 'binary').toString('base64'));
		}
	},

	decrypt: {
		arguments: ['string', 'string'],
		returns: 'string',
		/**
		 * Decrypt a string
		 * @param {String} key
		 * @param {String} encrypted
		 * @return {String} plaintext
		 */
		apply: (context, args) => {
			let [key, encryptdata] = args.map(a => a.value);
			encryptdata = new Buffer(encryptdata, 'base64').toString('binary');
			const decipher = crypto.createDecipher('aes-256-cbc', key);
			let decoded = decipher.update(encryptdata, 'binary', 'utf8');
			decoded += decipher.final('utf8');
			return createValue(decoded);
		}
	}
};
