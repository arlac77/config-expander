import test from "ava";
import { expand } from "../src/expander";

test("merge", async t =>
  t.deepEqual(
    await expand(
      { a: { b: "${1 - 1}", b1: 2 }, a1: ["a"] },
      { default: { a: { b1: 1, b2: "${1 + 2}" } } }
    ),
    {
      a: { b: 0, b1: 2, b2: 3 },
      a1: ["a"]
    }
  ));
