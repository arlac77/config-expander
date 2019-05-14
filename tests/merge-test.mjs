import test from "ava";
import { expand } from "../src/expander.mjs";
import { equal } from "../src/util.mjs";

test("merge", async t =>
  t.deepEqual(
    await expand(
      { a: { b: "${1 - 1}", b1: 2, b3: 3 }, a1: ["a"], a2: { b1: 7 } },
      { default: { a: { b1: 1, b2: "${1 + 2}", b3: null } } }
    ),
    {
      a: { b: 0, b1: 2, b2: 3, b3: 3 },
      a1: ["a"],
      a2: { b1: 7 }
    }
  ));

test("merge complex array", async t =>
  t.deepEqual(
    await expand([{ a: 1 }, { b: 2 }], {
      default: [{ a: 1 }, { b: 2 }]
    }),
    [{ a: 1 }, { b: 2 }]
  ));

test("merge array", async t =>
  t.deepEqual(
    await expand(
      { analyse: { skip: ["!test", "!tests"] } },
      {
        default: {
          analyse: { skip: ["!test", "!tests"] },
          queues: {
            process: {
              active: true
            }
          }
        }
      }
    ),
    {
      analyse: {
        skip: ["!test", "!tests"]
      },
      queues: {
        process: {
          active: true
        }
      }
    }
  ));


test("eq1",t =>{
  t.true(equal(1,1));
  t.true(equal([1],[1]));
  t.true(equal([{a:1}],[{a:1}]));
  t.false(equal([{a:1}],[{b:1}]));
});
