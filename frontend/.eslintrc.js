module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: [
    "plugin:vue/recommended",
    "eslint:recommended",
    "prettier/vue",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
    "plugin:cypress/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
  ],
  rules: {
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
    "no-unused-vars": "warn",
    "vue/no-unused-vars": "warn",
    "vue/require-v-for-key": "warn",
    "vue/valid-v-slot": ["error", { allowModifiers: true }],
    "cypress/no-unnecessary-waiting": "off",
    "vue/no-mutating-prop": "off",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
  globals: {
    $nuxt: true,
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
};
