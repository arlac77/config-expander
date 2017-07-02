import test from 'ava';
import { expand } from '../src/expander';

test('external constants', async t => {
  t.is(
    await expand('${constA}', {
      constants: {
        constA: 'constAValue'
      }
    }),
    'constAValue'
  );
});

test('internal constants', async t => {
  t.deepEqual(
    await expand({
      constants: {
        A: 1
      },
      name: '${A}'
    }),
    {
      constants: {
        A: 1
      },
      name: 1
    }
  );
});

test('external eval constants', async t => {
  t.is(
    await expand('${constA}', {
      constants: {
        constA: '${2 + 2}'
      }
    }),
    4
  );
});

test('double def constants', async t => {
  t.deepEqual(
    await expand(
      {
        constants: {
          A: 2
        },
        name: '${A}'
      },
      {
        constants: {
          A: 7
        }
      }
    ),
    {
      constants: {
        A: 2
      },
      name: 2
    }
  );
});
