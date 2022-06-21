module.exports = {
  extends: [
    '../common/.eslintrc.cjs',
    'plugin:react/recommended',
  ],
  env: {
    node: false,
    browser: true,
  },
  plugins: [
    'html',
    'react'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
    },
  }
}
