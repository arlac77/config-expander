import test from "ava";
import { expand } from "../src/expander.mjs";

test("merge", async t =>
  t.deepEqual(
    await expand(
      { a: { b: "${1 - 1}", b1: 2,  b3: 3}, a1: ["a"], a2: { b1: 7 } },
      { default: { a: { b1: 1, b2: "${1 + 2}", b3: null } } }
    ),
    {
      a: { b: 0, b1: 2, b2: 3, b3: 3 },
      a1: ["a"],
      a2: { b1: 7 }
    }
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
