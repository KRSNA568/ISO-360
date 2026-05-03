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
  overrides: [
    {
      files: ['e2e/**/*.js', 'e2e/**/*.spec.js'],
      env: { node: true, commonjs: true },
      rules: {
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'import/order': 'off',
        'no-console': 'off',
      },
    },
    {
      // Vite config runs in Node; __dirname and plugin defaults are valid
      files: ['vite.config.js'],
      env: { node: true },
      rules: {
        'no-undef': 'off',
        'import/default': 'off',
        'import/no-named-as-default': 'off',
      },
    },
    {
      // Admin portal is internal-only; strict a11y for public pages is sufficient
      files: ['src/pages/admin/**/*.jsx', 'src/components/layout/**/*.jsx'],
      rules: {
        'jsx-a11y/label-has-associated-control': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
      },
    },
  ],
}
