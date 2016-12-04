/* global describe, it */
/* jslint node: true, esnext: true */

'use strict';

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should(),
  fs = require('fs'),
  path = require('path');

const expand = require('../dist/expander').expand;

describe('expander', () => {

  describe('null expansion', () => {
    it('simple', () => assert.deepEqual(expand({
      name: 'a1'
    }), {
      name: 'a1'
    }));
  });

  describe('constants', () => {
    it('external', () => assert.deepEqual(expand({
      name: '${constA}'
    }, {
      constants: {
        constA: 'constAValue'
      }
    }), {
      name: 'constAValue'
    }));

    it('internal', () => assert.deepEqual(expand({
      constants: {
        A: 1
      },
      name: '${A}'
    }), {
      constants: {
        A: 1
      },
      name: 1
    }));
  });

  describe('expression', () => {
    it('addition', () => assert.deepEqual(expand({
      name: "${1 + 2}"
    }), {
      name: 3
    }));

    it('substraction', () => assert.deepEqual(expand({
      name: "${3 - 2}"
    }), {
      name: 1
    }));

    it('multiplication', () => assert.deepEqual(expand({
      name: "${3*2)}"
    }), {
      name: 6
    }));

    it('division', () => assert.deepEqual(expand({
      name: "${8/2)}"
    }), {
      name: 4
    }));

    it('number', () => assert.deepEqual(expand({
      name: "${number('77')}"
    }), {
      name: 77
    }));
  });

  describe('functions', () => {
    it('toUpperCase', () => assert.deepEqual(expand({
      name: "${toUpperCase('lower')}"
    }), {
      name: 'LOWER'
    }));

    it('toLowerCase', () => assert.deepEqual(expand({
      name: "${toLowerCase('UPPER')}"
    }), {
      name: 'upper'
    }));

    it('substring', () => assert.deepEqual(expand({
      name: "${substring('lower',1,3)}"
    }), {
      name: 'ow'
    }));

    it('replace', () => assert.deepEqual(expand({
      name: "${replace('lower','ow','12')}"
    }), {
      name: 'l12er'
    }));
  });

  describe('files', () => {
    it('toUpperCase', () => assert.deepEqual(expand({
      name: "${file('short.txt')}"
    }, {
      constants: {
        basedir: path.join(__dirname, 'fixtures')
      }
    }), {
      name: new Buffer('line 1\n')
    }));
  });

});
