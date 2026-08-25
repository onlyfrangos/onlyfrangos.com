import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

const ignoredPaths = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.next/**',
  '**/coverage/**',
  '**/.turbo/**',
  '**/.cache/**',
  '**/generated/**',
  '**/*.generated.*',
  'prisma/migrations/**',
];

export default tseslint.config(
  { ignores: ignoredPaths },
  eslint.configs.recommended,
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./apps/*/tsconfig.json', './tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      curly: ['error', 'all'],
      'no-duplicate-imports': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { fixStyle: 'inline-type-imports', prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { arguments: false, attributes: false } },
      ],
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['variable', 'parameter', 'method', 'function'],
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: ['typeLike'],
          format: ['PascalCase'],
        },
        {
          selector: 'variable',
          modifiers: ['const', 'global'],
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        {
          selector: ['import'],
          format: ['camelCase', 'PascalCase'],
        },
      ],
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        console: 'readonly',
        module: 'readonly',
        process: 'readonly',
        require: 'readonly',
        URL: 'readonly',
      },
    },
    rules: {
      curly: ['error', 'all'],
      'no-duplicate-imports': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['apps/api/**/*.ts'],
    rules: {
      // NestJS uses runtime imports to emit dependency-injection metadata. Converting providers
      // to `import type` makes their design:paramtypes metadata become the generic Function token.
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
  prettier,
);
