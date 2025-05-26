
import eslintPlugin from '@eslint/js';

export default [
  {
    ...eslintPlugin.configs.recommended, // ✅ Correct way to extend base ESLint rules
    files: ['server/src/**/*.{js,ts,tsx}'],
  },
];
