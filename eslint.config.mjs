import babelParser from '@babel/eslint-parser';
import globals from 'globals';
import pluginHub from './eslint-plugin/index.js';
export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/tests/**',
      '.config/*',
      '**/eslint-plugin/**',
      '**/docs-docusaurus/**',
    ],
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ['@babel/preset-env'],
        },
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        ...globals.node, // Use Node.js globals
      },
    },
    plugins: {
      pluginHub
    },
    rules: {
      'pluginHub/file-kebabcase': 'error',
      'pluginHub/function-camelcase': 'error',
      'pluginHub/vars-camelcase': 'error',
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'none',
          ignoreRestSiblings: false,
        },
      ],
      'no-console': 'off', // Allow console statements in Node.js
    },
  },
];