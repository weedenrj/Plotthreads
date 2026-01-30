import eslint from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import sonarjs from 'eslint-plugin-sonarjs';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'dev-dist/**', 'node_modules/**', 'eslint.config.js', 'vite.config.ts', 'tailwind.config.ts', '*.config.js', '*.config.ts']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      sonarjs,
      react,
      'react-hooks': reactHooks,
    },
    linterOptions: {
      noInlineConfig: true
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-restricted-types': ['error', {
        types: {
          unknown: { message: 'Use a specific type instead of unknown.' },
        },
      }],
      '@typescript-eslint/ban-ts-comment': ['error', {
        'ts-expect-error': true,
        'ts-ignore': true,
        'ts-nocheck': true,
        'ts-check': true,
      }],
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/dot-notation': 'error',
      '@typescript-eslint/prefer-destructuring': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-invalid-this': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-useless-constructor': 'error',

      // React rules
      'react/react-in-jsx-scope': 'off', // Not needed with React 19 JSX runtime
      'react/jsx-uses-react': 'off', // Not needed with React 19 JSX runtime
      'react/jsx-uses-vars': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-key': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger-with-children': 'error',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-unescaped-entities': 'error',
      'react/no-unknown-property': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // SonarJS rules
      'sonarjs/no-redundant-boolean': 'error',

      // General JavaScript rules
      'no-await-in-loop': 'error',
      'no-else-return': 'error',
      'no-constructor-return': 'error',
      'no-duplicate-imports': 'error',
      'no-self-compare': 'error',
      'no-template-curly-in-string': 'error',
      'no-empty': ['error', { 'allowEmptyCatch': false }],
      'no-useless-assignment': 'error',
      'require-atomic-updates': 'error',
      'block-scoped-var': 'error',
      'camelcase': ['error', { properties: 'never' }],
      'complexity': ['error', 10],
      'max-depth': ['error', 2],
      'default-case': 'error',
      'default-case-last': 'error',
      'eqeqeq': 'error',
      'no-eval': 'error',
      'no-param-reassign': 'error',
      'no-proto': 'error',
      'no-return-assign': 'error',
      'no-useless-return': 'error',
      'prefer-named-capture-group': 'error',
      'prefer-object-has-own': 'error',
      'prefer-template': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportNamedDeclaration[source]',
          message: 'Re-exports are banned. Import from source files directly.',
        },
        {
          selector: 'ExportAllDeclaration',
          message: 'Barrel exports (export *) are banned. Import from source files directly.',
        },
      ],
    },
  }
)
