import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";

export default {
  input: "index.js",
  output: [
    {
      file: "dist/jsdomain-parser.cjs.js",
      format: "cjs",
    },
    {
      file: "dist/jsdomain-parser.cjs.min.js",
      format: "cjs",
      plugins: [terser()],
    },
    {
      file: "dist/jsdomain-parser.esm.js",
      format: "esm",
    },
    {
      file: "dist/jsdomain-parser.esm.min.js",
      format: "esm",
      plugins: [terser()],
    },
    {
      file: "dist/jsdomain-parser.umd.js",
      format: "umd",
      name: "jsDomainParser",
    },
    {
      file: "dist/jsdomain-parser.umd.min.js",
      format: "umd",
      name: "jsDomainParser",
      plugins: [terser()],
    },
  ],
  plugins: [resolve(), commonjs(), json()],
};
