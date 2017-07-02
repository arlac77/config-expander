import test from 'ava';
import { expand, createValue } from '../src/expander';

const fs = require('fs');
const path = require('path');

test('null expansion', async t => {
  t.deepEqual(
    await expand({
      name: 'a1'
    }),
    {
      name: 'a1'
    }
  );
});

test('os', async t => {
  t.is(await expand('${os.arch}'), 'x64');
  t.truthy(
    ['aix', 'darwin', 'freebsd', 'linux', 'win32'].includes(
      await expand('${os.platform}')
    )
  );
});

test('string concat', async t => t.is(await expand("${'x' + 'y'}"), 'xy'));
test('addition', async t => t.is(await expand('${1 + 2}'), 3));
test('substraction', async t => t.is(await expand('${3 - 2}'), 1));
test('multiplication', async t => t.is(await expand('${3 * 2}'), 6));
test('division', async t => t.is(await expand('${8/2}'), 4));
test('number', async t => t.is(await expand("${number('77')}"), 77));

test('greater than false', async t => t.falsy(await expand('${1 > 2}')));
test('greater than true', async t => t.truthy(await expand('${2 > 1}')));
test('greater equal false', async t => t.falsy(await expand('${1 >= 2}')));
test('greater equal true', async t => t.truthy(await expand('${2 >= 1}')));
test('less than false', async t => t.falsy(await expand('${2 < 1}')));
test('less than true', async t => t.truthy(await expand('${1 < 2}')));

test('less equal than false', async t => t.falsy(await expand('${2 <= 1}')));
test('less equal than true', async t => t.truthy(await expand('${1 <= 2}')));

test('equal true', async t => t.truthy(await expand('${1 == 1}')));
test('equal false', async t => t.falsy(await expand('${1 == 2}')));

test('not equal true', async t => t.truthy(await expand('${2 != 1}')));
test('not equal false', async t => t.falsy(await expand('${2 != 2}')));

test('or false', async t => t.falsy(await expand('${0 || 0}')));
test('or true', async t => t.truthy(await expand('${1 || 0}')));

test('and false', async t => t.falsy(await expand('${1 && 0}')));
test('and true', async t => t.truthy(await expand('${1 && 1}')));

test('or true cobined', async t => t.truthy(await expand('${1 > 2 || 1 > 0}')));
test('or false cobined', async t => t.falsy(await expand('${1 > 2 || 1 < 0}')));

test('and false cobined', async t => t.falsy(await expand('${1>0 && 0>1}')));
test('and true cobined', async t => t.truthy(await expand('${1>0 && 2>0}')));

test('tenery true 1st.', async t =>
  t.is(await expand('${2 > 1 ? 22 : 11}'), 22));
test('tenery false 2nd.', async t =>
  t.is(await expand('${2 < 1 ? 22 : 11}'), 11));
test('tenery combined false 2nd.', async t =>
  t.is(await expand('${2 < 1 ? 22+1 : 11+1}'), 12));
test('tenery combined true 2nd.', async t =>
  t.is(await expand('${2*0 < 1 ? 22+1 : 11+1}'), 23));
test('tenery combined true 2nd. with function call', async t =>
  t.is(await expand("${'a'=='b' ? 22+1 : substring('abc',1,2)}"), 'b'));
test('tenery combined true with property access', async t =>
  t.is(
    await expand("${os.platform=='darwin' || os.platform=='linux' ? 1 : 0}"),
    1
  ));

test('toUpperCase', async t =>
  t.is(await expand("${toUpperCase('lower')}"), 'LOWER'));
test('toLowerCase', async t =>
  t.is(await expand("${toLowerCase('UPPER')}"), 'upper'));
test('substring', async t =>
  t.is(await expand("${substring('lower',1,3)}"), 'ow'));
test('replace', async t =>
  t.is(await expand("${replace('lower','ow','12')}"), 'l12er'));

test('unknown function', async t => {
  const error = await t.throws(expand('${  thisFunctionIsUnknown()}'));
  t.is(error.message, '1,2: Unknown function "thisFunctionIsUnknown"');
});

test('missing argument', async t => {
  const error = await t.throws(expand('${toUpperCase()}'));
  t.is(error.message, '1,0: Missing argument "toUpperCase"');
});

test('wrong argument type', async t => {
  const error = await t.throws(expand('${toUpperCase(2)}'));
  t.is(
    error.message,
    '1,0: Wrong argument type string != number "toUpperCase"'
  );
});

test('length (string)', async t => t.is(await expand("${length('abc')}"), 3));
test('length (array)', async t => t.is(await expand('${length([1,2,3])}'), 3));

test('first', async t => t.is(await expand('${first(1,2,3)}'), 1));

test('split', async t =>
  t.deepEqual(await expand("${split('1,2,3,4',',')}"), ['1', '2', '3', '4']));

test('substring with expressions', async t =>
  t.is(await expand("${substring('lower',1,1+2*1)}"), 'ow'));

test('encrypt/decrypt', async t =>
  t.is(await expand("${decrypt('key',encrypt('key','secret'))}"), 'secret'));

test('user defined functions', async t =>
  t.is(
    await expand('${myFunction()}', {
      functions: {
        myFunction: {
          arguments: [],
          apply: (context, args) => {
            return createValue(77);
          }
        }
      }
    }),
    77
  ));

test('function promise arg', async t =>
  t.is(
    await expand(
      "${substring(string(document('../tests/fixtures/short.txt')),0,4)}",
      {
        constants: {
          basedir: __dirname
        }
      }
    ),
    'line'
  ));

test('two promises binop', async t =>
  t.is(
    (await expand(
      "${document('../tests/fixtures/short.txt') + document('../tests/fixtures/short2.txt')}",
      {
        constants: {
          basedir: __dirname
        }
      }
    )).toString(),
    new Buffer('line 1\nline 2\n').toString()
  ));

test('left only promise binop', async t =>
  t.is(
    (await expand("${document('../tests/fixtures/short.txt') + 'XX'}", {
      constants: {
        basedir: __dirname
      }
    })).toString(),
    new Buffer('line 1\nXX').toString()
  ));

test('array access', async t =>
  t.is(
    await expand('${myArray[2-1]}', {
      constants: {
        myArray: ['a', 'b', 'c']
      }
    }),
    'b'
  ));

test('array access cascade', async t =>
  t.is(
    await expand('${myArray[1][2]}', {
      constants: {
        myArray: ['a', [0, 0, 4711], 'c']
      }
    }),
    4711
  ));

test('object paths one level', async t =>
  t.is(
    await expand('${myObject.att1}', {
      constants: {
        myObject: {
          att1: 'val1'
        }
      }
    }),
    'val1'
  ));

test('object paths with promise', async t =>
  t.deepEqual(
    await expand("${include('../tests/fixtures/with_sub.json').sub}", {
      constants: {
        basedir: __dirname
      }
    }),
    {
      key: 'value in other sub'
    }
  ));

test('object paths several levels', async t =>
  t.deepEqual(
    await expand('${myObject.level1.level2}', {
      constants: {
        myObject: {
          level1: {
            level2: 'val2'
          }
        }
      }
    }),
    'val2'
  ));

test('array literals', async t =>
  t.deepEqual(await expand('${[1,2,3]}'), [1, 2, 3]));
test('array literals nested', async t =>
  t.deepEqual(await expand("${[1,['a'],3]}"), [1, ['a'], 3]));

/*
  describe('files', () => {
    it('has file content', () =>
      expand(
        {
          name: "${document('short.txt')}",
          name2: "${document('short.txt')}"
        },
        {
          constants: {
            basedir: path.join(__dirname, 'fixtures')
          }
        }
      ).then(r =>
        assert.deepEqual(r, {
          name: new Buffer('line 1\n'),
          name2: new Buffer('line 1\n')
        })
      ));

    it('resolve file names', () =>
      expand(
        {
          name: "${resolve('fixtures')}"
        },
        {
          constants: {
            basedir: __dirname
          }
        }
      ).then(r =>
        assert.deepEqual(r, {
          name: path.join(__dirname, 'fixtures')
        })
      ));

    it('can include', () =>
      expand("${include('fixtures/other.json')}", {
        constants: {
          basedir: __dirname
        }
      }).then(r =>
        assert.deepEqual(r, {
          key: 'value from other'
        })
      ));

    it('can nest includes', () =>
      expand("${include('fixtures/first.json')}", {
        constants: {
          nameOfTheOther: 'other.json',
          basedir: __dirname
        }
      }).then(r =>
        assert.deepEqual(r, {
          first_key: {
            key: 'value from other'
          }
        })
      ));

    it('include missing', () =>
      expand("${include('fixtures/missing.json')}").catch(e =>
        assert.include(e.message, "ENOENT: no such file or directory, open '")
      ));

    xit('optional include', () =>
      expand("${first(include('fixtures/missing.json'))}").then(r =>
        assert.equal(r, undefined)
      )
    );
  });


  describe('combined paths', () => {
    it('access objects first than array', () =>
      expand('${myObject.level1.level2[1]}', {
        constants: {
          myObject: {
            level1: {
              level2: [1, 'val2']
            }
          }
        }
      }).then(r => assert.equal(r, 'val2')));

    it('access several levels', () =>
      expand('${myObject.level1[1].level2}', {
        constants: {
          myObject: {
            level1: [
              {},
              {
                level2: 'val2'
              }
            ]
          }
        }
      }).then(r => assert.equal(r, 'val2')));
  });
*/
