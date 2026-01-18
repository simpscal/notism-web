import js from '@eslint/js';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['dist', 'node_modules', 'app/assets', 'styles'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended, prettierConfig],
        files: ['**/*.{js,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            '@tanstack/query': tanstackQuery,
            import: importPlugin,
            prettier,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            ...reactRefresh.configs.recommended.rules,
            ...tanstackQuery.configs.recommended.rules,

            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

            // Import/Export rules
            'import/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],
            'import/no-unused-modules': 'warn',
            'import/no-duplicates': 'error',
            'import/default': 'error',
            'import/namespace': 'error',
            'import/no-absolute-path': 'error',
            'import/no-self-import': 'error',
            'import/no-cycle': 'warn',
            'import/newline-after-import': 'error',
            'import/no-useless-path-segments': 'error',

            // TypeScript rules
            '@typescript-eslint/no-inferrable-types': [
                'error',
                {
                    ignoreParameters: false,
                    ignoreProperties: false,
                },
            ],

            // Prettier rules
            'prettier/prettier': [
                'warn',
                {
                    printWidth: 120,
                    tabWidth: 4,
                    useTabs: false,
                    semi: true,
                    singleQuote: true,
                    jsxSingleQuote: true,
                    trailingComma: 'es5',
                    bracketSpacing: true,
                    bracketSameLine: false,
                    arrowParens: 'avoid',
                    endOfLine: 'lf',
                },
            ],
        },
    }
);
