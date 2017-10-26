import pkg from './package.json';

export default {
  output: {
    file: pkg.main,
    format: 'cjs'
  },

  external: ['expression-expander', 'pratt-parser'],
  input: pkg.module
};
