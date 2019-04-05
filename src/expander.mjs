import { createContext } from "expression-expander";
import { ConfigParser } from "./grammar";
import { functions } from "./functions";
import { createValue, merge } from "./util";
export { createValue };

import os from "os";

/**
 * Predefined constants
 * @typedef {Object} defaultConstants
 * @property {Object} env environment variables from process.env
 * @property {Object} os os module
 * @property {string} basedir filesystem configuration start point
 */

/**
 * Expands expressions in a configuration object
 * @param {Object} config config source
 * @param {Object} options the options
 * @param {Object} options.constants additional constants
 * @param {Object} options.default default configuration
 * @param {Object} options.functions additional functions
 * @returns {Promise} resolves to the expanded configuration
 */
export async function expand(config, options = {}) {
  const context = {
    constants: Object.assign(
      {
        basedir: process.cwd(),
        env: process.env,
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

  return options.default !== undefined
    ? merge(await ee.expand(options.default), await ee.expand(config))
    : ee.expand(config);
}
