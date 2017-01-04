/* jslint node: true, esnext: true */
'use strict';

import {
	create
}
from 'pratt-parser';

import {
	functions
}
from './functions';

class AST {
	get value() {
		return undefined;
	}
}

function Error(error) {
	return {
		value: Promise.reject(error)
	};
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
	constructor(f, context, args) {
		super();
		Object.defineProperty(this, 'value', {
			get: () => f.apply(context, args).value
		});
	}
}

export const grammar = create({
	identifier(value, properties, context) {
			const path = context.path;

			if (path.length >= 2) {
				const ctx = path[path.length - 2];

				if (ctx.value[value] !== undefined) {
					properties.value.value = ctx.value[value];
					return;
				}
			}
			if (path[0].value.constants) {
				const v = path[0].value.constants[value];
				if (v !== undefined) {
					properties.value.value = v;
					return;
				}
			}

			const c = context.constants[value];
			if (c) {
				properties.value.value = c;
			} else {
				properties.type.value = 'identifier';
				properties.value.value = value;
			}
		},
		prefix: {
			'(': {
				precedence: 80,
				led(grammar, left) {
					if (left.type === 'identifier') {
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

						const f = functions[left.value];
						if (f) {
							return new FCall(f, grammar.context, args);
						} else {
							return Error(`Unknown function: '${left.value}'`);
						}
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
