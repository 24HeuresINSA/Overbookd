import unusedImports from "eslint-plugin-unused-imports";
import pluginVue from "eslint-plugin-vue";
import pluginSecurity from "eslint-plugin-security";
import pulginJs from "@eslint/js";
import pluginTs from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import vueParser from "vue-eslint-parser";
import typescriptParser from "@typescript-eslint/parser";

export default pluginTs.config(
  pulginJs.configs.recommended,
  ...pluginTs.configs.recommended,
  pluginSecurity.configs["recommended"],
  eslintConfigPrettier,
  ...pluginVue.configs["flat/recommended"],
  {
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        sourceType: "module",
      },
    },
  },
  {
    rules: {
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "vue/multi-word-component-names": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "always",
            normal: "always",
            component: "always",
          },
        },
      ],
      "vue/valid-v-slot": [
        "error",
        {
          allowModifiers: true,
        },
      ],
      "vue/max-attributes-per-line": [
        "error",
        {
          singleline: {
            max: 10,
          },
          multiline: {
            max: 1,
          },
        },
      ],
    },
    files: ["**/*.vue"],
  },
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    ignores: [
      "**/build/",
      "**/dist/",
      "apps/web/.nuxt/",
      "apps/web/.output/",
      "**/*.spec.ts",
      "apps/api/src/prisma/generated/",
    ],
  },
);
