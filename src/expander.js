/**
 * @module config-expander
 */

import { createContext } from 'expression-expander';
import { ConfigParser } from './grammar';
import { functions } from './functions';
import { createValue } from './util';

const os = require('os');

/**
 * Expands expressions in a configuration object
 * @param config {object} config source
 * @param [options] {object} - the options
 * @param [options.constants] {object} - additional constants
 * @param [options.functions] {object} - additional functions
 * @returns {Promise}
 * @fulfil {object} - expanded configuration
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

export { createValue };
