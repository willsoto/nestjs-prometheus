/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import typescript from "@rollup/plugin-typescript";
import slugify from "@sindresorhus/slugify";
import filesize from "rollup-plugin-filesize";
import pkg from "./package.json";

const formats = ["cjs"];
const globals = Object.keys(pkg.peerDependencies || {}).reduce(
  (obj, dependency) => {
    obj[dependency] = slugify(dependency);

    return obj;
  },
  {},
);
const [, pkgName] = pkg.name.split("/");

export default {
  input: "src/index.ts",
  output: formats.map((format) => ({
    file: `dist/${format}.js`,
    format,
    name: pkgName,
    sourcemap: true,
    globals,
  })),
  external: Object.keys(globals),
  plugins: [
    typescript({
      tsconfig: "./tsconfig.build.json",
    }),
    filesize(),
  ],
};
