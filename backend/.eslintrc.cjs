// backend/.eslintrc.cjs
module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'eslint-config-prettier',
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'commonjs',
  },
  plugins: ['node'],
  rules: {
    // Node.js
    'node/no-unsupported-features/es-syntax': 'off',   // we control node version
    'node/no-missing-require': 'off',          // workspace symlinks not resolved by this rule
    'node/no-unpublished-require': 'off',      // dotenv is fine in devDependencies
    'node/no-extraneous-require': 'error',
    'no-process-exit': 'off',                  // server startup/shutdown needs process.exit

    // General quality
    'no-console': 'off',                       // console.log is fine in Node services
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'error',
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
    'no-throw-literal': 'error',
    'handle-callback-err': 'error',

    // Async safety
    'no-return-await': 'error',
    'require-await': 'warn',
  },
  ignorePatterns: ['node_modules/', 'dist/'],
}
