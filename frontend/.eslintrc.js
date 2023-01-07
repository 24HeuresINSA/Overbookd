module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  plugins: ["unused-imports", "@typescript-eslint"],
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
    "@typescript-eslint/no-unused-vars": "warn",
    "vue/no-unused-vars": "warn",
    "no-unused-vars": "warn",
    "vue/require-v-for-key": "warn",
    "vue/valid-v-slot": ["error", { allowModifiers: true }],
    "cypress/no-unnecessary-waiting": "off",
    "vue/no-mutating-prop": "off",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "unused-imports/no-unused-imports": "error",
    "vue/no-unused-components": "error",
  },
  globals: {
    $nuxt: true,
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
};
