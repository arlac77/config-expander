/* jslint node: true, esnext: true */
'use strict';

import {
	Parser
}
from 'pratt-parser';

import {
	createValue
}
from './util';

import {
	functions
}
from './functions';

class AST {
	get value() {
		return undefined;
	}
}

class ArrayAccess extends AST {
	constructor(array, index) {
		super();
		Object.defineProperty(this, 'value', {
			get: () => array.value[index.value]
		});
	}
}

class ObjectAccess extends AST {
	constructor(object, attribute) {
		super();
		Object.defineProperty(this, 'value', {
			get: () => object.value[attribute.value]
		});
	}
}

class BinOP extends AST {
	constructor(a, b, exec) {
		super();
		Object.defineProperty(this, 'value', {
			get: () => {
				if (a.value instanceof Promise) {
					if (b.value instanceof Promise) {
						return Promise.all([a.value, b.value]).then(args => exec(...args.map(v => createValue(v))));
					}
					return a.value.then(a => exec(createValue(a), b));
				} else if (b.value instanceof Promise) {
					return b.value.then(b => exec(a, createValue(b)));
				}
				return exec(a, b);
			}
		});
	}
}

class TeneryOP extends AST {
	constructor(exp, a, b) {
		super();
		Object.defineProperty(this, 'value', {
			get: () => {
				return exp.value ? a.value : b.value;
			}
		});
	}
}

class FCall extends AST {
	constructor(f, context, args) {
		super();
		Object.defineProperty(this, 'value', {
			get: () => Promise.all(args.map(a => a.value)).then(r => f.apply(context, r.map(v => createValue(v))).value)
		});
	}
}

export const grammar = new Parser({
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
							//console.log(`${f.arguments} <> ${args.map(a => a.type)}`);
							return new FCall(f, grammar.context, args);
						} else {
							grammar.error(`Unknown function: '${left.value}'`, left);
						}
					} else {
						const e = grammar.expression(0);
						grammar.advance(')');
						return e;
					}
				}
			}
		},
		infixr: {
			'&&': {
				precedence: 30,
				combine: (left, right) => new BinOP(left, right, (l, r) => l.value && r.value)
			},
			'||': {
				precedence: 30,
				combine: (left, right) => new BinOP(left, right, (l, r) => l.value || r.value)
			},
			'==': {
				precedence: 40,
				combine: (left, right) => new BinOP(left, right, (l, r) => l.value === r.value)
			},
			'!=': {
				precedence: 40,
				combine: (left, right) => new BinOP(left, right, (l, r) => l.value !== r.value)
			},
			'>=': {
				precedence: 40,
				combine: (left, right) => new BinOP(left, right, (l, r) => l.value >= r.value)
			},
			'<=': {
				precedence: 40,
				combine: (left, right) => new BinOP(left, right, (l, r) => l.value <= r.value)
			},
			'>': {
				precedence: 40,
				combine: (left, right) => new BinOP(left, right, (l, r) => l.value > r.value)
			},
			'<': {
				precedence: 40,
				combine: (left, right) => new BinOP(left, right, (l, r) => l.value < r.value)
			}
		},
		infix: {
			'?': {
				precedence: 20,
				led(grammar, left) {
					const e1 = grammar.expression(0);
					grammar.advance(':');
					const e2 = grammar.expression(0);
					return new TeneryOP(left, e1, e2);
				}
			},
			'.': {
				precedence: 1,
				combine: (left, right) => new ObjectAccess(left, right)
			},
			'[': {
				precedence: 1,
				combine: (left, right) => new ArrayAccess(left, right)
			},
			':': {},
			']': {},
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
