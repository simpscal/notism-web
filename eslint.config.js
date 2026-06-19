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

            // No event logic inline in the template: a JSX event attribute (onClick,
            // onChange, onSubmit, onValueChange, …) may only reference a handler — a bare
            // prop pass-through (onClick={onClose}), a named handler (onClick={handleSave}),
            // or a curried factory (onClick={handleSelect(id)}). An inline arrow/function/
            // .bind that carries logic is not allowed. Non-event props (className, render)
            // and references are untouched.
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'JSXAttribute[name.name=/^on[A-Z]/] > JSXExpressionContainer > ArrowFunctionExpression',
                    message:
                        'No inline logic in JSX event attributes — extract a named handler (or curried factory) and reference it. See docs/rules/components.md.',
                },
                {
                    selector: 'JSXAttribute[name.name=/^on[A-Z]/] > JSXExpressionContainer > FunctionExpression',
                    message:
                        'No inline logic in JSX event attributes — extract a named handler (or curried factory) and reference it. See docs/rules/components.md.',
                },
                {
                    selector:
                        "JSXAttribute[name.name=/^on[A-Z]/] > JSXExpressionContainer > CallExpression[callee.property.name='bind']",
                    message:
                        'No inline .bind in JSX event attributes — extract a named handler (or curried factory) and reference it. See docs/rules/components.md.',
                },
            ],
            ...reactRefresh.configs.recommended.rules,
            ...tanstackQuery.configs.recommended.rules,

            'react-hooks/exhaustive-deps': 'off',
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
            'import/no-restricted-paths': [
                'error',
                {
                    zones: [
                        {
                            target: './src/**/*',
                            from: ['./src/apis/**/*.response.ts', './src/apis/**/*.request.ts'],
                            except: ['./src/apis'],
                            message:
                                'Do not import raw request/response wire models from a domain file. Consume the mapped *Model (or call the api function) via the @/apis barrel instead.',
                        },
                    ],
                },
            ],

            // Boundary guard: raw wire types live in src/apis/<domain>/<domain>.{response,request}.ts
            // and are internal to the apis layer. Outside src/apis/** every layer must consume the
            // mapped *Model from @/apis (or call the api function), never the raw *.response/*.request
            // files. The override below re-enables imports for src/apis/**. This catches the path-alias
            // form that import/no-restricted-paths (relative-resolution only) misses.
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: [
                                '@/apis/*/*.response',
                                '@/apis/*/*.request',
                                '**/apis/*/*.response',
                                '**/apis/*/*.request',
                            ],
                            message:
                                'Do not import raw request/response wire models outside src/apis/**. Use the mapped *Model from @/apis (or call the api function) instead.',
                        },
                    ],
                },
            ],

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
    },
    {
        // The apis layer owns the wire types — mappers and api files are allowed to
        // import from <domain>.response.ts / <domain>.request.ts. MSW mocks simulate the
        // backend wire format and must produce response-model-shaped data, so they are
        // exempt too. The boundary only forbids leakage into the app layers outside these.
        files: ['src/apis/**/*.{ts,tsx}', 'mocks/**/*.{ts,tsx}'],
        rules: {
            'no-restricted-imports': 'off',
        },
    },
    {
        // Storybook stories and test files are fixtures, not shipped UI — their
        // inline mock callbacks are not real event emissions, so the named-handler
        // rule does not apply to them.
        files: ['**/*.stories.{ts,tsx}', '**/*.test.{ts,tsx}', 'test/**/*.{ts,tsx}'],
        rules: {
            'no-restricted-syntax': 'off',
        },
    }
);
