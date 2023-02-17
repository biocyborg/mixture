import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

import commonjs from "@rollup/plugin-commonjs";

import dts from "rollup-plugin-dts";

import { defineConfig } from "rollup";

export default defineConfig([
  {
    input: {
      mixture: "./src/mixture.ts",
    },
    plugins: [
      commonjs(),
      resolve(),
      babel({
        babelHelpers: "bundled",
        extensions: [".ts"],
      }),
    ],
    output: {
      // format: "es",
      // file: "lib/mixture.js",
      dir: "lib",
      format: "es",
    },
  },
  /* 单独生成声明文件 */
  {
    input: "./src/mixture.ts",
    plugins: [dts()],
    output: {
      format: "es",
      file: "index.d.ts",
    },
  },
]);
