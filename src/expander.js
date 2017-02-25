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

import {
	functions
}
from './functions';

import {
	createValue
}
from './util';

/**
 * Expands expressions in a configuration object
 * @param {object} config
 * @param {object} [options]
 *    constants object holding additional constants
 *    functions object holding additional function
 * @returns {Promise} expanded configuration
 */
export function expand(config, options = {}) {
	try {
		const context = {
			constants: Object.assign({
				basedir: process.cwd(),
				os: os
			}, options.constants),
			functions: Object.assign( {}, functions, options.functions)
		};

		const parser = new ConfigParser();

		const ee = createContext({
			evaluate: (expression, _unusedContext, path) => {
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

export { createValue };
