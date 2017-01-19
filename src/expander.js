/* jslint node: true, esnext: true */
'use strict';

/**
 * @module config-expander
 */

const os = require('os');

import {
	createContext
}
from 'expression-expander';

import {
	ConfigParser
}
from './grammar';

/**
 * Expands expressions in a configuration object
 * @param {object} config
 * @param {object} [options]
 *    constants object holding additional constants
 * @returns {Promise} expanded configuration
 */
export function expand(config, options = {}) {
	try {
		const context = {
			constants: Object.assign({
				basedir: '/',
				os: os
			}, options.constants)
		};

		const parser = new ConfigParser();

		const ee = createContext({
			evaluate: (expression, _context, path) => {
				context.path = path;
				const ast = parser.parse(expression, context);
				return ast.value;
			}
		});

		return Promise.resolve(ee.expand(config));
	} catch (e) {
		return Promise.reject(e);
	}
}
