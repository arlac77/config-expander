/**
 * @module config-expander
 */

import { createContext } from 'expression-expander';
import { ConfigParser } from './grammar';
import { functions } from './functions';
import { createValue } from './util';
export { createValue };

const os = require('os');

/**
 * Expands expressions in a configuration object
 * Predefined constants:
 * - os
 * - basedir
 * @param config {Object} config source
 * @param [options] {Object} - the options
 * @param [options.constants] {Object} - additional constants
 * @param [options.functions] {Object} - additional functions
 * @returns {Promise}
 * @fulfil {Object} - expanded configuration
 */
export async function expand(config, options = {}) {
  const context = {
    constants: Object.assign(
      {
        basedir: process.cwd(),
        os
      },
      options.constants
    ),
    functions: Object.assign({}, functions, options.functions)
  };

  const parser = new ConfigParser();

  const ee = createContext({
    evaluate: (expression, _unusedContext, path) => {
      context.path = path;
      const ast = parser.parse(expression, context);
      return ast.value;
    }
  });

  return ee.expand(config);
}
