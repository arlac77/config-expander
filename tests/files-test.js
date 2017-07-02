import test from 'ava';
import { expand } from '../src/expander';

const path = require('path');

test('has file content', async t =>
  t.deepEqual(
    Object.values(
      await expand(
        {
          name: "${document('short.txt')}",
          name2: "${document('short.txt')}"
        },
        {
          constants: {
            basedir: path.join(__dirname, '..', 'tests', 'fixtures')
          }
        }
      )
    ).map(v => v.toString()),
    ['line 1\n', 'line 1\n']
  ));

test('has file content', async t =>
  t.is(
    await expand("${resolve('fixtures')}", {
      constants: {
        basedir: path.join(__dirname, '..', 'tests')
      }
    }),
    path.join(__dirname, '..', 'tests', 'fixtures')
  ));

test('can include', async t =>
  t.deepEqual(
    await expand("${include('../tests/fixtures/other.json')}", {
      constants: {
        basedir: __dirname
      }
    }),
    {
      key: 'value from other'
    }
  ));

test('can nest includes', async t =>
  t.deepEqual(
    await expand("${include('../tests/fixtures/first.json')}", {
      constants: {
        nameOfTheOther: 'other.json',
        basedir: __dirname
      }
    }),
    {
      first_key: {
        key: 'value from other'
      }
    }
  ));

test('include missing', async t => {
  const error = await t.throws(
    expand("${include('../tests/fixtures/missing.json')}")
  );
  t.is(
    error.message,
    `ENOENT: no such file or directory, open '${path.join(
      __dirname,
      '..',
      '../tests/fixtures/missing.json'
    )}'`
  );
});

/*
    xit('optional include', () =>
      expand("${first(include('fixtures/missing.json'))}").then(r =>
        assert.equal(r, undefined)
      )
    );
  });
*/
