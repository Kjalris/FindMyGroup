module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect'
    },
  },
  root: true,
  env: {
    'react-native/react-native': true,
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'react', 'react-native'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['.eslintrc.js', 'babel.config.js'],
  rules: {
    'react-native/no-color-literals': 0,
    'react-native/no-inline-styles': 0,
    '@typescript-eslint/no-explicit-any': 0,
  }
};
