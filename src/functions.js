import { createValue } from './util';
import { expand } from './expander';
import { promisify } from 'util';
import { spawn } from 'child_process';

import { dirname, resolve } from 'path';
import { readFile } from 'fs';
import { createCipher, createDecipher } from 'crypto';

const pReadFile = promisify(readFile);

/**
 * @typedef {Object} Value
 * @property {string} type
 * @property {Object} value
 */

/**
 * @callback Apply
 * @param {Context} Context
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
export const functions = {
  document: {
    arguments: ['string'],
    returns: 'buffer',
    apply: (context, args) =>
      createValue(pReadFile(resolve(context.constants.basedir, args[0].value)))
  },
  resolve: {
    arguments: ['string'],
    returns: 'string',
    apply: (context, args) =>
      createValue(resolve(context.constants.basedir, args[0].value))
  },

  /**
   * include definition form a file
   * @param {string} file file name to be included
   * @return {string} content of the file
   */
  include: {
    arguments: ['string'],
    returns: 'object',
    apply: (context, args) => {
      const file = resolve(context.constants.basedir, args[0].value);

      return createValue(
        pReadFile(file).then(data =>
          expand(
            JSON.parse(data),
            Object.assign({}, context, {
              constants: Object.assign({}, context.constants, {
                basedir: dirname(file)
              })
            })
          )
        )
      );
    }
  },
  number: {
    arguments: ['string|number'],
    returns: 'number',
    apply: (context, args) => {
      const v = args[0].value;
      return createValue(
        parseFloat(v) === v ? v : parseFloat(v.replace(/[a-z]+/, ''))
      );
    }
  },
  string: {
    arguments: ['string|buffer'],
    returns: 'string',
    apply: (context, args) => {
      const v = args[0].value;
      return createValue(v instanceof Buffer ? v.toString() : v);
    }
  },
  length: {
    arguments: ['string|object'],
    returns: 'integer',
    apply: (context, args) => createValue(args[0].value.length)
  },

  substring: {
    arguments: ['string', 'integer', 'integer'],
    returns: 'string',
    apply: (context, args) =>
      createValue(args[0].value.substring(args[1].value, args[2].value))
  },

  /**
   * Replace strang
   * @param {string} source input value
   * @return {string} replaced content
   */
  replace: {
    arguments: ['string', 'string', 'string'],
    returns: 'string',
    apply: (context, args) =>
      createValue(args[0].value.replace(args[1].value, args[2].value))
  },

  /**
   * convert string into upper case
   * @param {string} source input value
   * @return {string} uppercase result
   */
  toUpperCase: {
    arguments: ['string'],
    returns: 'string',
    apply: (context, args) => createValue(args[0].value.toUpperCase())
  },

  /**
   * convert string into lower case
   * @param {string} source input value
   * @return {string} lowercase result
   */
  toLowerCase: {
    arguments: ['string'],
    returns: 'string',
    apply: (context, args) => createValue(args[0].value.toLowerCase())
  },

  /**
   * split source string on pattern boundaries
   * @param {string} source
   * @param {string} pattern
   * @return {string[]} separated source
   */
  split: {
    arguments: ['string', 'string'],
    returns: 'string[]',
    apply: (context, args) => createValue(args[0].value.split(args[1].value))
  },

  first: {
    arguments: ['object|number'],
    returns: 'object?',
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
   * Encrypt a plaintext value
   * @param {string} key
   * @param {string} plaintext input value
   * @return {string} encrypted value
   */
  encrypt: {
    arguments: ['string', 'string'],
    returns: 'string',
    apply: (context, args) => {
      const [key, plaintext] = args.map(a => a.value);
      const encipher = createCipher('aes-256-cbc', key);
      let encryptdata = encipher.update(plaintext, 'utf8', 'binary');
      encryptdata += encipher.final('binary');
      return createValue(Buffer.from(encryptdata, 'binary').toString('base64'));
    }
  },

  /**
   * Decrypt a former encrypted string
   * @param {string} key
   * @param {string} encrypted
   * @return {string} plaintext
   */
  decrypt: {
    arguments: ['string', 'string'],
    returns: 'string',
    apply: (context, args) => {
      let [key, encryptdata] = args.map(a => a.value);
      encryptdata = Buffer.from(encryptdata, 'base64').toString('binary');
      const decipher = createDecipher('aes-256-cbc', key);
      let decoded = decipher.update(encryptdata, 'binary', 'utf8');
      decoded += decipher.final('utf8');
      return createValue(decoded);
    }
  },
  /**
   * Call programm
   * @param {string} executable path
   * @param {string[]} arguments
   * @param {Object} [options]
   * @return {string} stdout
   */
  spawn: {
    arguments: ['string', 'object' /*, 'object?'*/],
    returns: 'string',
    apply: (context, args) => {
      let [exec, params, options] = args.map(a => a.value);

      return createValue(
        new Promise((resolve, reject) => {
          const s = spawn(exec, params, options);
          let stdout = '';
          s.stdout.on('data', data => (stdout += data));
          s.on('close', code => resolve(stdout));
        })
      );
    }
  }
};
