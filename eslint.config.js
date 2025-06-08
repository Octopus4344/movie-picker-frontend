/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  nextEsLintConfig,
  {
    rules: {
      "no-alert": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
];
