module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect'
    },
  },
  env: {
    'react-native/react-native': true,
  },
  plugins: ['react', 'react-native'],
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
  ],
  ignorePatterns: ['.eslintrc.js', 'babel.config.js'],
  rules: {
    'react-native/no-color-literals': 0
  }
};
