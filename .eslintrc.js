module.exports = {
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  env: {
    node: true,
  },
  extends: ['eslint:recommended'],
  rules: {
    semi: ['warn', 'always'],
    'no-console': 'off',
    'no-unused-vars': ['warn', { ignoreRestSiblings: true }],
    'prefer-const': 'warn',
  },
};
