import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.esm.js",
      format: "es",
      sourcemap: true,
    },
    {
      file: "dist/index.esm.min.js",
      format: "es",
      sourcemap: true,
      plugins: [terser()],
    },
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      exports: "default",
      sourcemap: true,
    },
    {
      file: "dist/index.cjs.min.js",
      format: "cjs",
      exports: "default",
      sourcemap: true,
      plugins: [terser()],
    },
    {
      file: "dist/index.umd.js",
      format: "umd",
      name: "cloneElement",
      sourcemap: true,
    },
    {
      file: "dist/index.umd.min.js",
      format: "umd",
      name: "cloneElement",
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true,
    }),
  ],
};
