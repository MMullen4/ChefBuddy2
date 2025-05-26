// eslint.config.js
import tseslint from 'typescript-eslint';
import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default tseslint.config(
  // TypeScript & React support
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
  },

  // JavaScript files (non-TypeScript)
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
  },

  // Ignore build outputs and node_modules
  {
    ignores: ['**/dist/**', 'node_modules'],
  }
);
