module.exports = {
  env: {
    node: true,
    es2021: true
  },
  extends: [
    'eslint:recommended'
  ],
  plugins: [
    'import'
  ],
  overrides: [
    {
      files: ['tests/**/*.js'],
      env: {
        mocha: true,
      },
    },
  ],
  rules: {
    'import/no-unresolved': 'error'
  }
};
