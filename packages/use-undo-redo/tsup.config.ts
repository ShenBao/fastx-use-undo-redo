import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: false,
  clean: true,
  bundle: false,
  outExtension: (ctx) => ({
    js: ctx.format === "esm" ? ".mjs" : ".js",
  }),
});
