/* global describe, it */
/* jslint node: true, esnext: true */

'use strict';

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

const expand = require('../dist/expander').expand;

describe('expander', () => {

  describe('null expansion', () => {
    it('simple', () => assert.deepEqual(expand({
      name: 'a1'
    }), {
      name: 'a1'
    }));
  });
});
