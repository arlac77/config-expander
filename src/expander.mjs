import os from "node:os";
import { readFile } from "node:fs/promises";
import {
  createCipheriv,
  createDecipheriv,
  scryptSync,
  randomBytes
} from "node:crypto";
import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";
import { createContext } from "expression-expander";
import { ConfigParser } from "./grammar.mjs";
import { createValue, merge } from "./util.mjs";
export { createValue };

const IV = randomBytes(16);

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
 * @returns {Promise<Object>} resolves to the expanded configuration
 */
export async function expand(config, options) {
  const context = {
    constants: {
      basedir: process.cwd(),
      env: process.env,
      os,
      ...options?.constants
    },
    functions: { ...functions, ...options?.functions }
  };

  const parser = new ConfigParser();

  const ee = createContext({
    evaluate: (expression, _unusedContext, path) => {
      context.path = path;
      const ast = parser.parse(expression, context);
      return ast.value;
    },
    ...options
  });

  return options?.default !== undefined
    ? merge(await ee.expand(options.default), await ee.expand(config))
    : ee.expand(config);
}

/**
 * @typedef {Object} Context
 * @property {Object} constants
 * @property {string} constants.basedir
 * @property {Object} constants.env
 * @property {string} constants.os
 * @property {Object} functions
 */

/**
 * @typedef {Object} Value
 * @property {string} type
 * @property {Object} value
 */

/**
 * @callback Apply
 * @param {Context} context
 * @param {Value[]} args
 */

/**
 * @typedef {Object} ConfigFunction
 * @property {string[]} arguments
 * @property {string} returns
 * @property {Apply} apply
 *
 */

/**
 * knwon functions
 */
const functions = {
  document: {
    arguments: ["string"],
    returns: "buffer",
    apply: (context, args) =>
      createValue(readFile(resolve(context.constants.basedir, args[0].value)))
  },
  resolve: {
    arguments: ["string"],
    returns: "string",
    apply: (context, args) =>
      createValue(resolve(context.constants.basedir, args[0].value))
  },

  /**
   * Include definition form a file.
   * @param {string} file file name to be included
   * @return {string} content of the file
   */
  include: {
    arguments: ["string"],
    returns: "object",
    apply: (context, args) => {
      const file = resolve(context.constants.basedir, args[0].value);

      return createValue(
        readFile(file, "utf8").then(data => {
          const json = JSON.parse(data);
          return expand(
            json,
            Object.assign({}, context, {
              constants: Object.assign(
                {},
                context.constants,
                {
                  basedir: dirname(file)
                },
                json.constants
              )
            })
          );
        })
      );
    }
  },
  number: {
    arguments: ["string|number"],
    returns: "number",
    apply: (context, args) => {
      const v = args[0].value;
      return createValue(
        parseFloat(v) === v ? v : parseFloat(v.replace(/[a-z]+/, ""))
      );
    }
  },
  string: {
    arguments: ["string|buffer"],
    returns: "string",
    apply: (context, args) => {
      const v = args[0].value;
      return createValue(v instanceof Buffer ? v.toString() : v);
    }
  },
  length: {
    arguments: ["string|object"],
    returns: "integer",
    apply: (context, args) => createValue(args[0].value.length)
  },

  substring: {
    arguments: ["string", "integer", "integer"],
    returns: "string",
    apply: (context, args) =>
      createValue(args[0].value.slice(args[1].value, args[2].value))
  },

  /**
   * Replace string.
   * @param {string} source input value
   * @return {string} replaced content
   */
  replace: {
    arguments: ["string", "string", "string"],
    returns: "string",
    apply: (context, args) =>
      createValue(args[0].value.replace(args[1].value, args[2].value))
  },

  /**
   * Convert string into upper case.
   * @param {string} source input value
   * @return {string} uppercase result
   */
  toUpperCase: {
    arguments: ["string"],
    returns: "string",
    apply: (context, args) => createValue(args[0].value.toUpperCase())
  },

  /**
   * Convert string into lower case.
   * @param {string} source input value
   * @return {string} lowercase result
   */
  toLowerCase: {
    arguments: ["string"],
    returns: "string",
    apply: (context, args) => createValue(args[0].value.toLowerCase())
  },

  /**
   * Split source string on pattern boundaries.
   * @param {string} source
   * @param {string} pattern
   * @return {string[]} separated source
   */
  split: {
    arguments: ["string", "string"],
    returns: "string[]",
    apply: (context, args) => createValue(args[0].value.split(args[1].value))
  },

  first: {
    arguments: ["string|object|number|undefined"],
    returns: "object?",
    apply: (context, args) => {
      args = args.filter(e => e !== undefined && e.value !== undefined);

      /*
						const promises = args.filter(e => e.value instanceof Promise);

						if(promises.length > 0) {
							console.log(`has promises`);
							return Promise.all(promises)
								.then(all => all[0])
								.catch(error => undefined);
						}
			*/

      return args.length === 0 ? createValue(undefined) : args[0];
    }
  },

  /**
   * Encrypt a plaintext value.
   * @param {string} key
   * @param {string} plaintext input value
   * @return {string} encrypted value
   */
  encrypt: {
    arguments: ["string", "string"],
    returns: "string",
    apply: (context, args) => {
      const [key, plaintext] = args.map(a => a.value);
      const encipher = createCipheriv(
        "aes-256-cbc",
        scryptSync(key, "config-expander", 32),
        IV
      );
      let encryptdata = encipher.update(plaintext, "utf8", "binary");
      encryptdata += encipher.final("binary");
      return createValue(Buffer.from(encryptdata, "binary").toString("base64"));
    }
  },

  /**
   * Decrypt a former encrypted string.
   * @param {string} key
   * @param {string} encrypted
   * @return {string} plaintext
   */
  decrypt: {
    arguments: ["string", "string"],
    returns: "string",
    apply: (context, args) => {
      let [key, encryptdata] = args.map(a => a.value);
      encryptdata = Buffer.from(encryptdata, "base64").toString("binary");
      const decipher = createDecipheriv(
        "aes-256-cbc",
        scryptSync(key, "config-expander", 32),
        IV
      );
      let decoded = decipher.update(encryptdata, "binary", "utf8");
      decoded += decipher.final("utf8");
      return createValue(decoded);
    }
  },

  /**
   * Call executable.
   * @param {string} executable path
   * @param {string[]} arguments
   * @param {Object} [options]
   * @return {string} stdout
   */
  spawn: {
    arguments: ["string", "object" /*, 'object?'*/],
    returns: "string",
    apply: (context, args) => {
      let [exec, params, options] = args.map(a => a.value);

      return createValue(
        new Promise((resolve, reject) => {
          const s = spawn(exec, params, options);
          let stdout = "";
          s.stdout.on("data", data => (stdout += data));
          s.on("close", code => resolve(stdout));
        })
      );
    }
  }
};
