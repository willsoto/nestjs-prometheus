module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.lint.json",
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  env: {
    node: true,
  },
  globals: {
    Reflect: true,
  },
  rules: {
    "new-cap": "off",
  },
  overrides: [
    {
      files: ["test/**/*.ts"],
      env: {
        mocha: true,
      },
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
        "no-unused-expressions": "off",
        "no-magic-numbers": "off",
        "@typescript-eslint/unbound-method": "off",
      },
    },
  ],
};
