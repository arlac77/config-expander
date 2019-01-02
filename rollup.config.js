import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import executable from "rollup-plugin-executable";
import cleanup from "rollup-plugin-cleanup";
import pkg from "./package.json";

export default {
  output: {
    file: pkg.main,
    format: "cjs",
    interop: false
  },
  plugins: [resolve(), commonjs(), cleanup()],
  external: [
    "os",
    "util",
    "child_process",
    "path",
    "fs",
    "crypto",
    "pratt-parser"
  ],
  input: pkg.module
};
