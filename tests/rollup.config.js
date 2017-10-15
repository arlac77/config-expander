import multiEntry from 'rollup-plugin-multi-entry';

export default {
  entry: 'tests/**/*-test.js',
  external: ['ava', 'expression-expander', 'pratt-parser'],
  plugins: [multiEntry()],
  format: 'cjs',
  dest: 'build/test-bundle.js',
  sourceMap: true
};
