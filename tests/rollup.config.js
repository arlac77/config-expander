import istanbul from 'rollup-plugin-istanbul';

import babel from 'rollup-plugin-babel';
import multiEntry from 'rollup-plugin-multi-entry';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'tests/**/*-test.js',
  external: [
    'ava',
    'os',
    'util',
    'child_process',
    'path',
    'fs',
    'crypto',
    'expression-expander',
    'pratt-parser'
  ],
  plugins: [multiEntry(), resolve(), commonjs()],

  output: {
    file: 'build/bundle-test.js',
    format: 'cjs',
    sourcemap: true,
    interop: false
  }
};
