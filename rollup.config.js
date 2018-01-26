import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';

export default {
  output: {
    file: pkg.main,
    format: 'cjs'
  },
  plugins: [resolve()],
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
