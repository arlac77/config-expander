/* jslint node: true, esnext: true */
'use strict';

const fs = require('fs'),
	path = require('path'),
	ee = require('expression-expander'),
	createGrammar = require('pratt-parser').create;

function createValue(value) {
	return Object.create(null, {
		value: {
			value: value
		}
	});
}

function expand(config, options = {}) {
	const constants = options.constants || {
		basedir: '/'
	};

	const functions = {
		file: args => createValue(fs.readFileSync(path.resolve(constants.basedir, args[0].value))),
		directory: args => createValue(path.resolve(constants.basedir, args[0].value)),
		include: args => {
			const v = createValue(JSON.parse(fs.readFileSync(path.resolve(constants.basedir, args[0].value))));
			return v;
		},
		// string functions
		number: args => {
			const v = args[0].value;
			return createValue(parseFloat(v) === v ? v : parseFloat(v.replace(/[a-z]+/, '')));
		},
		substring: args => createValue(args[0].value.substring(args[1].value, args[2].value)),
		replace: args => createValue(args[0].value.replace(args[1].value, args[2].value)),
		toUpperCase: args => createValue(args[0].value.toUpperCase()),
		toLowerCase: args => createValue(args[0].value.toLowerCase())
	};

	const g = createGrammar({
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
					if (context[0].value.properties) {
						const v = context[0].value.properties[value];
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

							return left.value(args);
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
					combine: (left, right) => {
						if (parseFloat(left.value) === left.value) {
							return createValue(left.value + parseFloat(right.value));
						}

						return createValue(left.value + right.value);
					}
				},
				'-': {
					precedence: 50,
					combine: (left, right) => createValue(left.value - right.value)
				},
				'*': {
					precedence: 60,
					combine: (left, right) => createValue(left.value * right.value)
				},
				'/': {
					precedence: 60,
					combine: (left, right) => createValue(left.value / right.value)
				}
			}
	});

	const ctx = ee.createContext({
		evaluate: (expression, context, path) => {
			return g.parse(expression, path).value;
		}
	});

	return ctx.expand(config);
}

export {
	expand
};
