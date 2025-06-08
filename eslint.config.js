import nextEsLintConfig from "eslint-config-next";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  nextEsLintConfig,
  // Tutaj możesz dodać własne reguły lub nadpisać domyślne.
  // Na przykład, jeśli chcesz globalnie zezwolić na użycie `alert`:
  {
    rules: {
      "no-alert": "off",
    },
  },
];
