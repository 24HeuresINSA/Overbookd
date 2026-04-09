import pulginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginSecurity from "eslint-plugin-security";
import unusedImports from "eslint-plugin-unused-imports";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import pluginTs from "typescript-eslint";
import vueParser from "vue-eslint-parser";

export default defineConfig([
  pulginJs.configs.recommended,
  ...pluginTs.configs.recommended,
  pluginSecurity.configs["recommended"],
  eslintConfigPrettier,
  ...pluginVue.configs["flat/recommended"],
  {
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: pluginTs.parser,
        sourceType: "module",
      },
    },
  },
  {
    files: ["**/*.vue"],
    rules: {
      "no-undef": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "no-useless-assignment": "off",
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
      "apps/api/src/generated/",
    ],
  },
]);
