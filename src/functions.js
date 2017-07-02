/**
 * @module config-expander
 */

import { readFile, createValue } from './util';
import { expand } from './expander';

const path = require('path'),
  crypto = require('crypto');

export const functions = {
  document: {
    arguments: ['string'],
    returns: 'buffer',
    apply: (context, args) =>
      createValue(
        readFile(path.resolve(context.constants.basedir, args[0].value))
      )
  },
  resolve: {
    arguments: ['string'],
    returns: 'string',
    apply: (context, args) =>
      createValue(path.resolve(context.constants.basedir, args[0].value))
  },
  include: {
    arguments: ['string'],
    returns: 'object',
    apply: (context, args) => {
      const file = path.resolve(context.constants.basedir, args[0].value);

      return createValue(
        readFile(file).then(data =>
          expand(
            JSON.parse(data),
            Object.assign({}, context, {
              constants: Object.assign({}, context.constants, {
                basedir: path.dirname(file)
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
  replace: {
    arguments: ['string', 'string', 'string'],
    returns: 'string',
    apply: (context, args) =>
      createValue(args[0].value.replace(args[1].value, args[2].value))
  },

  /**
	 * convert string into upper case
	 * @param {string} source
	 * @return {string} uppercase result
	 */
  toUpperCase: {
    arguments: ['string'],
    returns: 'string',
    apply: (context, args) => createValue(args[0].value.toUpperCase())
  },

  /**
	 * convert string into lower case
	 * @param {string} source
	 * @return {string} lowercase result
	 */
  toLowerCase: {
    arguments: ['string'],
    returns: 'string',
    apply: (context, args) => createValue(args[0].value.toLowerCase())
  },

  split: {
    arguments: ['string', 'string'],
    returns: 'string[]',
    /**
		 * split source string on pattern boundaries
		 * @param {string} source
		 * @param {string} pattern
		 * @return {string[]} separated source
		 */
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

  encrypt: {
    arguments: ['string', 'string'],
    returns: 'string',
    /**
		 * Encrypt a plaintext value
		 * @param {string} key
		 * @param {string} plaintext
		 * @return {string} encrypted value
		 */
    apply: (context, args) => {
      const [key, plaintext] = args.map(a => a.value);
      const encipher = crypto.createCipher('aes-256-cbc', key);
      let encryptdata = encipher.update(plaintext, 'utf8', 'binary');
      encryptdata += encipher.final('binary');
      return createValue(Buffer.from(encryptdata, 'binary').toString('base64'));
    }
  },

  decrypt: {
    arguments: ['string', 'string'],
    returns: 'string',
    /**
		 * Decrypt a former encrypted string
		 * @param {string} key
		 * @param {string} encrypted
		 * @return {string} plaintext
		 */
    apply: (context, args) => {
      let [key, encryptdata] = args.map(a => a.value);
      encryptdata = Buffer.from(encryptdata, 'base64').toString('binary');
      const decipher = crypto.createDecipher('aes-256-cbc', key);
      let decoded = decipher.update(encryptdata, 'binary', 'utf8');
      decoded += decipher.final('utf8');
      return createValue(decoded);
    }
  }
};
