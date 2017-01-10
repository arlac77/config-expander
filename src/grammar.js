/* jslint node: true, esnext: true */
'use strict';

import {
	Parser, Tokenizer, IdentifierToken
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

class ArraySlice extends AST {
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
			get: () => {
				if (object.value instanceof Promise) {
					return object.value.then(v => v[attribute.value]);
				}
				return object.value[attribute.value];
			}
		});
	}
}

class SpreadOP extends AST {
	constructor(a, b) {
		super();
		Object.defineProperty(this, 'value', {
			get: () => createValue([a.value, b.value])
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

class ConfigTokenizer extends Tokenizer {
	makeIdentifier(chunk, offset, context, properties) {
		let i = offset;
		i += 1;
		for (;;) {
			const c = chunk[i];
			if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') ||
				(c >= '0' && c <= '9') || c === '_') {
				i += 1;
			} else {
				break;
			}
		}

		const value = chunk.substring(offset, i);

		properties.value = {
			value: value
		};
		const path = context.path;

		if (path.length >= 2) {
			const ctx = path[path.length - 2];
			if (ctx.value[value] !== undefined) {
				properties.value.value = ctx.value[value];
				return [Object.create(IdentifierToken, properties), i - offset];
			}
		}

		if (path[0].value.constants) {
			const v = path[0].value.constants[value];
			if (v !== undefined) {
				properties.value.value = v;
				return [Object.create(IdentifierToken, properties), i - offset];
			}
		}

		const c = context.constants[value];
		if (c) {
			properties.value.value = c;
		}

		return [Object.create(IdentifierToken, properties), i - offset];
	}
}

export class ConfigParser extends Parser {
	constructor() {
		super(grammar, {
			tokenizer: new ConfigTokenizer(grammar)
		});
	}
}

const grammar = {
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
		},
		'[': {
			nud(grammar, left) {
				const values = [];

				if (grammar.token.value !== ']') {
					while (true) {
						values.push(grammar.expression(0).value);

						if (grammar.token.value !== ',') {
							break;
						}
						grammar.advance(',');
					}
				}
				grammar.advance(']');
				return createValue(values);
			}
		}
	},
	infixr: {
		'..': {
			precedence: 30,
			combine: (left, right) => new SpreadOP(left, right, (l, r) => l.value && r.value)
		},
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
			combine: (left, right) => new ArraySlice(left, right)
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
};
