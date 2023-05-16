import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  // browser-friendly UMD build
  {
    input: "src/index.ts",
    output: {
      name: "typescriptNpmPackage",
      file: pkg.browser,
      format: "umd",
      sourcemap: true,
    },
    external: ['axios', 'events'],
    plugins: [
      resolve(), //
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      nodeResolve({ browser: true })
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: "src/index.ts",
    output: [
      { file: pkg.main, format: "cjs", sourcemap: true },
      { file: pkg.module, format: "es", sourcemap: true },
    ],
    external: ['axios', 'events'],
    plugins: [
      typescript({ tsconfig: "./tsconfig.json" }),
      nodeResolve({ browser: false })
    ],
  },
];
