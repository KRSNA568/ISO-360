// frontend/.eslintrc.cjs
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'eslint-config-prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.jsx'],
      },
    },
  },
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'import'],
  rules: {
    // React
    'react/prop-types': 'off',                  // using JSDoc or runtime-only typing
    'react/display-name': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Imports
    'import/order': ['warn', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true },
    }],
    'import/no-unresolved': 'off',              // vite handles aliases
    'import/no-duplicates': 'error',

    // General quality
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'error',
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],

    // Accessibility
    'jsx-a11y/anchor-is-valid': 'off',          // react-router links are fine
  },
  ignorePatterns: ['dist/', 'node_modules/'],
}
