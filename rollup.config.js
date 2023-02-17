import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

import typescript from "@rollup/plugin-typescript";

import commonjs from "@rollup/plugin-commonjs";

import dts from "rollup-plugin-dts";

import { defineConfig } from "rollup";

export default defineConfig([
  {
    input: "./src/index.ts",
    plugins: [
      commonjs(),
      resolve(),
      babel({
        babelHelpers: "bundled",
        extensions: [".ts"],
      }),
    ],
    output: [
      {
        format: "cjs",
        file: "dist/mixture.js",
      },
      {
        format: "module",
        file: "dist/mixture.esm.js",
      },
      {
        format: "umd",
        file: "dist/mixture.min.js",
        name: "PackageName",
      },
    ],
  },
  /* 单独生成声明文件 */
  {
    input: "./src/index.ts",
    plugins: [dts()],
    output: {
      format: "es",
      file: "dist/index.d.ts",
    },
  },
]);

// export default {
//   input: "./src/index.ts",
//   output: {
//     file: "mixture.js",
//     format: "es",
//   },

//   plugins: [
//     commonjs(),
//     resolve(),
//     babel({
//       babelHelpers: "bundled",
//       extensions: [".ts"],
//     }),
//   ],
// };
