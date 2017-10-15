import pkg from './package.json';

export default {
  targets: [
    {
      dest: pkg.main,
      format: 'cjs'
    }
  ],
  external: ['expression-expander', 'pratt-parser']
};
