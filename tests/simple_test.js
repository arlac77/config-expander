/* global describe, it, xit */
/* jslint node: true, esnext: true */

'use strict';

const chai = require('chai'),
  fs = require('fs'),
  path = require('path'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

const expand = require('../dist/expander').expand;

describe('expander', () => {

  describe('null expansion', () => {
    it('simple', () => expand({
      name: 'a1'
    }).then(r => assert.deepEqual({
      name: 'a1'
    }, r)));
  });

  describe('constants', () => {
    it('external', () => expand('${constA}', {
      constants: {
        constA: 'constAValue'
      }
    }).then(r => assert.equal(r, 'constAValue')));

    it('internal', () => expand({
      constants: {
        A: 1
      },
      name: '${A}'
    }).then(r => assert.deepEqual(r, {
      constants: {
        A: 1
      },
      name: 1
    })));

    it('double def', () => expand({
      constants: {
        A: 2
      },
      name: '${A}'
    }, {
      constants: {
        A: 7
      }
    }).then(r => assert.deepEqual(r, {
      constants: {
        A: 2
      },
      name: 2
    })));
  });

  describe('os', () => {
    it('os.arch', () => expand('${os.arch}').then(r => assert.equal(r, 'x64')));
    it('os.platform', () => expand('${os.platform}').then(r => assert.include(['aix', 'darwin', 'freebsd',
      'linux', 'win32'
    ], r)));
  });

  describe('expression', () => {
    it('string concat', () => expand("${'x' + 'y'}").then(r => assert.equal(r, 'xy')));
    it('addition', () => expand("${1 + 2}").then(r => assert.equal(r, 3)));
    it('substraction', () => expand("${3 - 2}").then(r => assert.equal(r, 1)));
    it('multiplication', () => expand("${3*2)}").then(r => assert.equal(r, 6)));
    it('division', () => expand("${8/2)}").then(r => assert.equal(r, 4)));
    it('number', () => expand("${number('77')}").then(r => assert.equal(r, 77)));
  });

  describe('boolean expression', () => {
    it('greater than false', () => expand("${1 > 2}").then(r => assert.equal(r, false)));
    it('greater than true', () => expand("${2 > 1}").then(r => assert.equal(r, true)));
    it('greater equal than false', () => expand("${1 >= 2}").then(r => assert.equal(r, false)));
    it('greater equal than true', () => expand("${2 >= 1}").then(r => assert.equal(r, true)));
    it('less than false', () => expand("${2 < 1}").then(r => assert.equal(r, false)));
    it('less than true', () => expand("${1 < 2}").then(r => assert.equal(r, true)));
    it('less equal than false', () => expand("${2 <= 1}").then(r => assert.equal(r, false)));
    it('less equal than true', () => expand("${1 <= 2}").then(r => assert.equal(r, true)));
    it('equal true', () => expand("${1 == 1}").then(r => assert.equal(r, true)));
    it('equal false', () => expand("${1 == 2}").then(r => assert.equal(r, false)));
    it('not equal true', () => expand("${2 != 1}").then(r => assert.equal(r, true)));
    it('not equal false', () => expand("${2 != 2}").then(r => assert.equal(r, false)));
    it('or false', () => expand("${0 || 0}").then(r => assert.equal(r, false)));
    it('or true', () => expand("${1 || 0}").then(r => assert.equal(r, true)));

    it('and false', () => expand("${1 && 0}").then(r => assert.equal(r, false)));
    it('and true', () => expand("${1 && 1}").then(r => assert.equal(r, true)));

    describe('combined', () => {
      it('or true', () => expand("${1 > 2 || 1 > 0}").then(r => assert.equal(r, true)));
      it('or false', () => expand("${1 > 2 || 1 < 0}").then(r => assert.equal(r, false)));

      it('and false', () => expand("${1>0 && 0>1}").then(r => assert.equal(r, false)));
      it('and true', () => expand("${1>0 && 2>0}").then(r => assert.equal(r, true)));
    });
  });

  describe('tenery expression', () => {
    it('true 1st.', () => expand("${2 > 1 ? 22 : 11}").then(r => assert.equal(r, 22)));
    it('false 2nd.', () => expand("${2 < 1 ? 22 : 11}").then(r => assert.equal(r, 11)));

    describe('combined', () => {
      it('false 2nd.', () => expand("${2 < 1 ? 22+1 : 11+1}").then(r => assert.equal(r, 12)));
      it('true 2nd.', () => expand("${2*0 < 1 ? 22+1 : 11+1}").then(r => assert.equal(r, 23)));
      it('true 2nd. with function call', () => expand("${'a'=='b' ? 22+1 : substring('abc',1,2)}").then(r =>
        assert.equal(r, 'b')));

      it('true with property access', () => expand("${os.platform=='darwin' ? 1 : 0}").then(r =>
        assert.equal(r, 1)));
    });
  });

  describe('functions', () => {
    it('unknown function', () => expand("${  thisFunctionIsUnknown()}")
      .then(e => assert.equal(e, {}))
      .catch(e => assert.equal(e.message, '1,2: Unknown function "thisFunctionIsUnknown"')));
    it('toUpperCase', () => expand("${toUpperCase('lower')}").then(r => assert.equal(r, 'LOWER')));
    it('toLowerCase', () => expand("${toLowerCase('UPPER')}").then(r => assert.equal(r, 'upper')));
    it('substring', () => expand("${substring('lower',1,3)}").then(r => assert.equal(r, 'ow')));
    it('replace', () => expand("${replace('lower','ow','12')}").then(r => assert.equal(r, 'l12er')));

    it('length (string)', () => expand("${length('abc')}").then(r => assert.equal(r, 3)));
    xit('length (array)', () => expand("${length([1,2,3])}").then(r => assert.equal(r, 3)));

    it('split', () => expand("${split('1,2,3,4',',')}").then(r => assert.deepEqual(r, ['1', '2', '3', '4'])));


    it('substring with expressions', () => expand("${substring('lower',1,1+2*1)}").then(r => assert.equal(r,
      'ow')));

    it('substring with expressions', () => expand("${substring('lower',1,number('2')+1)}").then(r => assert.equal(
      r, 'ow')));

    it('encrypt/decrypt', () => expand("${decrypt('key',encrypt('key','secret'))}").then(r => assert.equal(
      r, 'secret')));
  });

  describe('promise function args', () => {
    it('one promise arg', () => expand(
      "${substring(string(document('fixtures/short.txt')),0,4)}", {
        constants: {
          basedir: __dirname
        }
      }).then(r => assert.equal(r, 'line')));
  });

  describe('promise expressions', () => {
    it('two promises binop', () => expand(
      "${document('fixtures/short.txt') + document('fixtures/short2.txt')}", {
        constants: {
          basedir: __dirname
        }
      }).then(r => assert.equal(r, new Buffer('line 1\nline 2\n'))));

    it('left only promise binop', () => expand(
      "${document('fixtures/short.txt') + 'XX'}", {
        constants: {
          basedir: __dirname
        }
      }).then(r => assert.equal(r, new Buffer('line 1\nXX'))));

    it('right only promise binop', () => expand(
      "${'XX' + document('fixtures/short.txt')}", {
        constants: {
          basedir: __dirname
        }
      }).then(r => assert.equal(r, new Buffer('XXline 1\n'))));
  });

  describe('files', () => {
    it('has file content', () => expand({
      name: "${document('short.txt')}",
      name2: "${document('short.txt')}"
    }, {
      constants: {
        basedir: path.join(__dirname, 'fixtures')
      }
    }).then(r => assert.deepEqual(r, {
      name: new Buffer('line 1\n'),
      name2: new Buffer('line 1\n')
    })));

    it('resolve file names', () => expand({
      name: "${resolve('fixtures')}"
    }, {
      constants: {
        basedir: __dirname
      }
    }).then(r => assert.deepEqual(r, {
      name: path.join(__dirname, 'fixtures')
    })));

    it('can include', () => expand("${include('fixtures/other.json')}", {
      constants: {
        basedir: __dirname
      }
    }).then(r => assert.deepEqual(r, {
      key: 'value from other'
    })));

    it('can nest includes', () => expand("${include('fixtures/first.json')}", {
      constants: {
        nameOfTheOther: 'other.json',
        basedir: __dirname
      }
    }).then(r => assert.deepEqual(r, {
      first_key: {
        key: 'value from other'
      }
    })));

    it('include missing', () => expand("${include('fixtures/missing.json')}").catch(e => assert.equal(e.message,
      'ENOENT: no such file or directory, open \'/fixtures/missing.json\'')));

    xit('optional include', () => expand("${first(include('fixtures/missing.json'))}").then(r => assert.equal(
      r,
      undefined)));
  });

  describe('arrays', () => {
    it('access', () => expand("${myArray[2-1]}", {
      constants: {
        myArray: ['a', 'b', 'c'],
      }
    }).then(r => assert.equal(r, 'b')));
  });

  describe('object paths', () => {
    it('access one level', () => expand("${myObject.att1}", {
      constants: {
        myObject: {
          att1: 'val1'
        },
      }
    }).then(r => assert.equal(r, 'val1')));

    it('access with promise', () => expand("${include('fixtures/with_sub.json').sub}", {
      constants: {
        basedir: __dirname
      }
    }).then(r => assert.deepEqual(r, {
      "key": "value in other sub"
    })));

    it('access several levels', () => expand("${myObject.level1.level2}", {
      constants: {
        myObject: {
          level1: {
            level2: 'val2'
          }
        },
      }
    }).then(r => assert.equal(r, 'val2')));
  });

  describe('combined paths', () => {
    it('access objects first than array', () => expand("${myObject.level1.level2[1]}", {
      constants: {
        myObject: {
          level1: {
            level2: [1, 'val2']
          }
        },
      }
    }).then(r => assert.equal(r, 'val2')));

    xit('access several levels', () => expand("${myObject.level1[1].level2}", {
      constants: {
        myObject: {
          level1: [{}, {
            level2: 'val2'
          }]
        },
      }
    }).then(r => assert.equal(r, 'val2')));
  });

  describe('array literals', () => {
    xit('simple', () => expand("${[1,2,3]}").then(r => assert.deepEqual(r, [1, 2, 3])));
  });
});
