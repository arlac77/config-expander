import test from "ava";
import { removeSensibleValues } from "../src/util.mjs";

test("removeSensibleValues", t => {
  t.deepEqual(
    removeSensibleValues({
      a: { value: 7 },
      key: "secure",
      password: "secure",
      secret: "secure"
    }),
    { a: { value: 7 }, key: "...", password: "...", secret: "..." }
  );
});
