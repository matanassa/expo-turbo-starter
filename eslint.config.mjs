import { defineConfig, globalIgnores } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import eslintConfigPrettier from 'eslint-config-prettier';
import turboPlugin from 'eslint-plugin-turbo';
import globals from 'globals';

export default defineConfig([
  globalIgnores([
    '**/.expo/**',
    '**/.turbo/**',
    '**/build/**',
    '**/coverage/**',
    '**/dist/**',
    '**/node_modules/**',
  ]),
  expoConfig,
  {
    plugins: {
      turbo: turboPlugin,
    },
    settings: {
      react: {
        version: '19.2',
      },
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'error',
    },
  },
  {
    files: ['**/*.config.{js,cjs,mjs,ts}', 'scripts/**/*.{js,mjs}'],
    languageOptions: {
      globals: globals.node,
    },
  },
  eslintConfigPrettier,
]);
