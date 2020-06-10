module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    ymaps: 'readonly',
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'import/no-extraneous-dependencies': 0,
  },
  overrides: [
    {
      files: "*.test.js",
      rules: {
          "no-unused-expressions": "off"
      }
    }
  ]
};
