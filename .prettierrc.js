module.exports = {
  arrowParens: "always",
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  plugins: [
    require.resolve("prettier-plugin-organize-imports"),
    require.resolve("prettier-plugin-packagejson"),
  ],
};
