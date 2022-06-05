const { readGitignoreFiles } = require('eslint-gitignore')

module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['**.{test,spec}.js'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      rules: { 'jest/prefer-expect-assertions': 'off' },
      env: {
        'jest/globals': true
      }
    }
  ],
  ignorePatterns: readGitignoreFiles({ cwd: __dirname }),
  rules: {
    'accessor-pairs': 'warn',
    'block-scoped-var': 'error',
    'block-spacing': ['warn', 'always'],
    'brace-style': ['warn', '1tbs', { allowSingleLine: true }],
    'camelcase': ['warn', { properties: 'always', ignoreImports: true, ignoreGlobals: true }],
    'comma-dangle': ['warn', 'only-multiline'],
    'comma-spacing': ['warn', { before: false, after: true }],
    'comma-style': ['warn', 'last'],
    'complexity': ['warn', 15],
    'dot-location': ['warn', 'property'],
    'dot-notation': 'warn',
    'eqeqeq': 'warn',
    'indent': ['warn', 2, { VariableDeclarator: 1, MemberExpression: 1, SwitchCase: 1 }],
    'key-spacing': ['warn', { 'afterColon': true }],
    'linebreak-style': ['warn', 'unix'],
    'max-depth': ['warn', 5],
    'max-len': ['warn', 140, 2, { ignoreStrings: true, ignoreTemplateLiterals: true, ignoreRegExpLiterals: true, ignoreComments: true }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-constant-condition': 'warn',
    'no-debugger': 'warn',
    'no-lonely-if': 'warn',
    'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
    'no-trailing-spaces': 'warn',
    'no-undef': 'error',
    'no-unneeded-ternary': 'warn',
    'no-unreachable': 'warn',
    'no-unused-vars': 'warn',
    'no-var': 'warn',
    'quotes': ['warn', 'single'],
    'semi': ['warn', 'never'],
    'space-before-blocks': 'warn',
    'space-infix-ops': 'warn',
  },
}
