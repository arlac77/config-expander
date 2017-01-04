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
    it('external', () => expand({
      name: '${constA}'
    }, {
      constants: {
        constA: 'constAValue'
      }
    }).then(r => assert.deepEqual(r, {
      name: 'constAValue'
    })));

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

  describe('expression', () => {
    it('str concat', () => expand({
      name: "${'x' + 'y'}"
    }).then(r => assert.deepEqual(r, {
      name: 'xy'
    })));

    it('addition', () => expand({
      name: "${1 + 2}"
    }).then(r => assert.deepEqual(r, {
      name: 3
    })));

    it('substraction', () => expand({
      name: "${3 - 2}"
    }).then(r => assert.deepEqual(r, {
      name: 1
    })));

    it('multiplication', () => expand({
      name: "${3*2)}"
    }).then(r => assert.deepEqual(r, {
      name: 6
    })));

    it('division', () => expand({
      name: "${8/2)}"
    }).then(r => assert.deepEqual(r, {
      name: 4
    })));

    it('number', () => expand({
      name: "${number('77')}"
    }).then(r => assert.deepEqual(r, {
      name: 77
    })));
  });

  describe('functions', () => {
    it('unknown function', () => expand(
        "${thisFunctionIsUnknown()}"
      ).then(e => assert.deepEqual(e, {}))
      .catch(e => assert.deepEqual(e, "unknown function thisFunctionIsUnknown")));
    it('toUpperCase', () => expand("${toUpperCase('lower')}").then(r => assert.equal(r, 'LOWER')));
    it('toLowerCase', () => expand("${toLowerCase('UPPER')}").then(r => assert.equal(r, 'upper')));
    it('substring', () => expand("${substring('lower',1,3)}").then(r => assert.equal(r, 'ow')));
    it('replace', () => expand("${replace('lower','ow','12')}").then(r => assert.equal(r, 'l12er')));
    it('substring with expressions', () => expand("${substring('lower',1,1+2*1)}").then(r => assert.equal(r,
      'ow')));

    it('substring with expressions', () => expand("${substring('lower',1,number('2')+1)}").then(r => assert.equal(
      r, 'ow')));

    it('encrypt/decrypt', () => expand("${decrypt('key',encrypt('key','secret'))}").then(r => assert.equal(
      r, 'secret')));
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

    it('has directory', () => expand({
      name: "${directory('fixtures')}"
    }, {
      constants: {
        basedir: __dirname
      }
    }).then(r => assert.deepEqual(r, {
      name: path.join(__dirname, 'fixtures')
    })));

    it('can include', () => expand({
      name: "${include('fixtures/other.json')}"
    }, {
      constants: {
        basedir: __dirname
      }
    }).then(r => assert.deepEqual(r, {
      name: {
        key: 'value from other'
      }
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
  });
});
