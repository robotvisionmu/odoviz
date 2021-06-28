module.exports = {
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  env: {
    es6: true,
    browser: true,
  },
  extends: ['eslint:recommended', 'react-app', 'plugin:import/errors', 'plugin:import/warnings'],
  plugins: ['import'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
  rules: {
    semi: ['warn', 'always'],
    'no-console': 'off',
    'no-unused-vars': ['warn', { ignoreRestSiblings: true }],
    'prefer-const': 'warn',
    'import/first': 'warn',
    'import/newline-after-import': 'warn',
    'import/no-duplicates': 'warn',
    'import/order': [
      'warn',
      {
        warnOnUnassignedImports: true,
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling']],
        pathGroups: [
          {
            pattern: '+(react|react-redux)',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '*.scss',
            group: 'index',
            patternOptions: { matchBase: true },
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin', 'react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
};
