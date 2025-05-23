const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  {
    ignores: [
      'node_modules',
      'dist',
      '.vercel',
      'eslint.config.js'
    ],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
      }
    },
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'prettier/prettier': 'error' // Force ESLint to error on Prettier violations
    }
  }
];
