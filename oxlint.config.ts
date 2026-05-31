import { defineConfig } from 'oxlint'

export default defineConfig({
  categories: {
    correctness: 'error',
    suspicious: 'warn',
    pedantic: 'warn',
  },
  rules: {
    // Restrictions
    'no-alert': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',

    // Allow
    'no-plusplus': 'off',

    // TypeScript
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/consistent-type-imports': 'error',

    // Import
    'import/no-duplicates': 'error',
    'import/no-cycle': 'error',

    // Unicorn
    'unicorn/no-null': 'off',
    'unicorn/prefer-node-protocol': 'error',
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.spec.ts'],
      rules: {
        'max-lines': 'off',
        'max-lines-per-function': 'off',
        'require-await': 'off',
      },
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
})
