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
    "plugin:prettier/recommended",
    "plugin:cypress/recommended",
  ],
  rules: {
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
    "no-unused-vars": "warn",
    "vue/no-unused-vars": "warn",
    "vue/require-v-for-key": "warn",
    "cypress/no-unnecessary-waiting": "off",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
  globals: {
    $nuxt: true,
  },
  parserOptions: {
    parser: "babel-eslint",
  },
};
