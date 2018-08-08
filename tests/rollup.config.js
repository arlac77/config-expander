import multiEntry from 'rollup-plugin-multi-entry';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import istanbul from 'rollup-plugin-istanbul';

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
  plugins: [
    multiEntry(),
    resolve(),
    commonjs(),
    istanbul({
      exclude: ['tests/**/*-test.js', 'node_modules/**/*']
    })
  ],
  output: {
    file: 'build/bundle-test.js',
    format: 'cjs',
    sourcemap: true,
    interop: false
  }
};
