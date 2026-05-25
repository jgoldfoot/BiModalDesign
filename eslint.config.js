const jest = require('eslint-plugin-jest');
const prettier = require('eslint-config-prettier');

module.exports = [
  {
    ignores: [
      'node_modules/',
      'coverage/',
      'dist/',
      'build/',
      '*.min.js',
      'tools/agent-simulator.js',
      'tools/bimodal-design-cli.js',
      'accessibility/compliance-audit.js',
      'tools/validators/fr1-checker.js',
      'examples/',
      '*.config.js',
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        Buffer: 'readonly',
        URL: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'prefer-const': 'warn',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-return-await': 'warn',
      'require-await': 'warn',
    },
  },
  {
    files: ['__tests__/**/*.js', '**/*.test.js', '**/*.spec.js'],
    plugins: { jest },
    languageOptions: {
      globals: {
        ...jest.environments.globals.globals,
      },
    },
    rules: {
      'no-unused-expressions': 'off',
    },
  },
  prettier,
];
