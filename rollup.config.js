import { eslint } from "rollup-plugin-eslint";
import filesize from "rollup-plugin-filesize";
import typescript from "rollup-plugin-typescript";
import pkg from "./package.json";

const formats = ["umd", "esm"];
const globals = {
  "@nestjs/common": "nestjsCommon",
  "@nestjs/common/constants": "nestjsCommonConstants",
  "prom-client": "promClient",
};

export default {
  input: "src/index.ts",
  output: formats.map((format) => ({
    file: `dist/nestjs-prometheus.${format}.js`,
    format,
    name: "NestJSPrometheus",
    sourcemap: true,
    globals,
    banner: `
      /**
       *
       * ${pkg.name}@${pkg.version}
       * ${pkg.license}
       *
       */`,
  })),
  external: Object.keys(globals),
  plugins: [
    eslint({
      throwOnWarning: true,
      throwOnError: true,
    }),
    typescript({
      tsconfig: "./tsconfig.build.json",
    }),
    filesize(),
  ],
};
