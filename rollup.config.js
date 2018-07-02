import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
export default {
  output: {
    file: pkg.main,
    format: 'cjs',
    interop: false
  },
  plugins: [resolve(), commonjs()],
  external: [
    'os',
    'util',
    'child_process',
    'path',
    'fs',
    'crypto',
    'expression-expander',
    'pratt-parser'
  ],
  input: pkg.module
};
