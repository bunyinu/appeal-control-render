module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-prettier',
  ],
  plugins: ['import'],
  settings: {
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.json'],
      },
    },
  },
  rules: {
    'react/no-children-prop': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off', // Turned off to reduce noise
    '@typescript-eslint/ban-types': 'off',
    'react-hooks/exhaustive-deps': 'off', // Turned off to reduce noise
    'import/named': 'error',
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'error',
  },
};
