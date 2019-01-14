import test from "ava";
import { expand } from "../src/expander";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const here = dirname(fileURLToPath(import.meta.url));

test("has file content", async t =>
  t.deepEqual(
    Object.values(
      await expand(
        {
          name: "${document('short.txt')}",
          name2: "${document('short.txt')}"
        },
        {
          constants: {
            basedir: join(here, "..", "tests", "fixtures")
          }
        }
      )
    ).map(v => v.toString()),
    ["line 1\n", "line 1\n"]
  ));

test("has file content #2", async t =>
  t.is(
    await expand("${resolve('fixtures')}", {
      constants: {
        basedir: join(here, "..", "tests")
      }
    }),
    join(here, "..", "tests", "fixtures")
  ));

test("can include", async t =>
  t.deepEqual(
    await expand("${include('../tests/fixtures/other.json')}", {
      constants: {
        basedir: here,
        c1: "x"
      }
    }),
    {
      key: "value from other x"
    }
  ));

test("can nest includes", async t =>
  t.deepEqual(
    (await expand("${include('../tests/fixtures/first.json')}", {
      constants: {
        nameOfTheOther: "other.json",
        basedir: here
      }
    })).first_key,
    {
      key: "value from other v1"
    }
  ));

test("include missing", async t => {
  const error = await t.throwsAsync(
    async () => expand("${include('../tests/fixtures/missing.json')}"),
    {
      message: `ENOENT: no such file or directory, open '${join(
        here,
        "..",
        "../tests/fixtures/missing.json"
      )}'`
    }
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
