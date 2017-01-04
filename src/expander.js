/* jslint node: true, esnext: true */
'use strict';

/**
 * @module config-expander
 */

import {
	createContext
}
from 'expression-expander';

import {
	grammar
}
from './grammar';

/**
 * Expands expressions in a configuration object
 * @param {Object} config
 * @param {Object} options
 * @returns {Promise} expanded configuration
 */
export function expand(config, options = {}) {
	try {
		const context = {
			constants: options.constants || {
				basedir: '/'
			}
		};

		const ee = createContext({
			evaluate: (expression, _context, path) => {
				context.path = path;
				const ast = grammar.parse(expression, context);
				return ast.value;
			}
		});

		const r = ee.expand(config);
		return r instanceof Promise ? r : Promise.resolve(r);
	} catch (e) {
		return Promise.reject(e);
	}
}
