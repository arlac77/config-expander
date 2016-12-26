/* jslint node: true, esnext: true */
'use strict';

const fs = require('fs'),
	path = require('path');

import {
	createContext
}
from 'expression-expander';
import {
	create
}
from 'pratt-parser';

function createValue(value) {
	return Object.create(null, {
		value: {
			value: value
		}
	});
}

class AST {
	get value() {
		return undefined;
	}
}

class BinOP extends AST {
	constructor(a, b, exec) {
		super();
		Object.defineProperty(this, 'value', {
			get: () => exec(a, b)
		});
	}
}

class FCall extends AST {
	constructor(f, args) {
		super();
		Object.defineProperty(this, 'value', {
			get: () => f.value.apply(args).value
		});
	}
}

/**
 * Expands expressions in a configuration object
 * @param {Object} config
 * @param {Object} options
 * @returns {Promise} expanded configuration
 */
function expand(config, options = {}) {
	const constants = options.constants || {
		basedir: '/'
	};

	const functions = {
		file: {
			arguments: ['string'],
			returns: 'blob',
			apply: args => createValue(fs.readFileSync(path.resolve(constants.basedir, args[0].value)))
		},
		directory: {
			arguments: ['string'],
			returns: 'string',
			apply: args => createValue(path.resolve(constants.basedir, args[0].value))
		},
		include: {
			apply: args => createValue(JSON.parse(fs.readFileSync(path.resolve(constants.basedir, args[0].value))))
		},
		number: {
			arguments: ['string|number'],
			returns: 'number',
			apply: args => {
				const v = args[0].value;
				return createValue(parseFloat(v) === v ? v : parseFloat(v.replace(/[a-z]+/, '')));
			}
		},
		substring: {
			arguments: ['string', 'integer', 'integer'],
			returns: 'string',
			apply: args => createValue(args[0].value.substring(args[1].value, args[2].value))
		},
		replace: {
			arguments: ['string', 'string', 'string'],
			returns: 'string',
			apply: args => createValue(args[0].value.replace(args[1].value, args[2].value))
		},
		toUpperCase: {
			arguments: ['string'],
			returns: 'string',
			apply: args => createValue(args[0].value.toUpperCase())
		},
		toLowerCase: {
			arguments: ['string'],
			returns: 'string',
			apply: args => createValue(args[0].value.toLowerCase())
		}
	};

	const grammar = create({
		identifier(value, properties, context) {
				const f = functions[value];
				if (f) {
					properties.type.value = 'function';
					properties.value.value = f;
				} else {
					if (context.length >= 2) {
						const ctx = context[context.length - 2];

						if (ctx.value[value] !== undefined) {
							properties.value.value = ctx.value[value];
							return;
						}
					}
					if (context[0].value.constants) {
						const v = context[0].value.constants[value];
						if (v !== undefined) {
							properties.value.value = v;
							return;
						}
					}

					const c = constants[value];
					if (c) {
						properties.value.value = c;
					}
				}
			},
			prefix: {
				'(': {
					precedence: 80,
					led(grammar, left) {
						if (left.type === 'function') {
							const args = [];

							if (grammar.token.value !== ')') {
								while (true) {
									args.push(grammar.expression(0));

									if (grammar.token.value !== ',') {
										break;
									}
									grammar.advance(',');
								}
							}

							grammar.advance(')');
							return new FCall(left, args);
						} else {
							const e = grammar.expression(0);
							grammar.advance(')');
							return e;
						}
					}
				}
			},
			infix: {
				',': {},
				')': {},
				'+': {
					precedence: 50,
					combine: (left, right) => new BinOP(left, right, (l, r) => l.value + r.value)
				},
				'-': {
					precedence: 50,
					combine: (left, right) => new BinOP(left, right, (l, r) => l.value - r.value)
				},
				'*': {
					precedence: 60,
					combine: (left, right) => new BinOP(left, right, (l, r) => l.value * r.value)
				},
				'/': {
					precedence: 60,
					combine: (left, right) => new BinOP(left, right, (l, r) => l.value / r.value)
				}
			}
	});

	const ctx = createContext({
		evaluate: (expression, context, path) => {
			const ast = grammar.parse(expression, path);
			return ast.value;
		}
	});

	return Promise.resolve(ctx.expand(config));
}

export {
	expand
};
