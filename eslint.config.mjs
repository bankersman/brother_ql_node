import js from "@eslint/js";
import globals from "globals";
import parser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "**/dist/**",
      "coverage/**",
      "node_modules/**",
      "docs/.vitepress/dist/**",
      "docs/.vitepress/cache/**",
      "scripts/**/*.mjs"
    ]
  },
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser,
      globals: {
        ...globals.node
      },
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    rules: {
      ...tsPlugin.configs["recommended-type-checked"].rules
    }
  },
  eslintConfigPrettier
];
