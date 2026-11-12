// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['node_modules/', 'playwright-report/', 'test-results/', 'blob-report/', '.auth/'] },

  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      // Every Playwright call returns a promise: forgetting `await` is the #1 source of flaky tests
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Playwright best-practice rules for test files and page objects
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.ts', 'src/**/*.ts'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-wait-for-timeout': 'error', // no hard sleeps
      'playwright/no-focused-test': 'error', // no forgotten test.only
      'playwright/no-page-pause': 'error',
      'playwright/prefer-web-first-assertions': 'error',
      // Assertions are often wrapped in page-object helpers like expectLoaded()
      'playwright/expect-expect': ['warn', { assertFunctionPatterns: ['^expect'] }],
    },
  },

  { files: ['**/*.mjs'], ...tseslint.configs.disableTypeChecked },

  // Must be last: turns off rules that conflict with Prettier formatting
  prettier,
);
