# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
bun run start          # Dev server on localhost:4200
bun run start:mock     # Dev server with MSW mocking enabled
bun run build          # TypeScript check + Vite build (default mode)
bun run build:dev      # Build for development
bun run build:prod     # Build for production
bun run lint           # ESLint (flat config, eslint.config.js)
```

Tests: `bun run test` (Vitest, jsdom). Pre-commit hooks run `eslint --fix` and `prettier --write` via husky + lint-staged.

## Tech Stack

React 19 + TypeScript + Vite. State: Redux Toolkit (global) + TanStack React Query (server). Routing: react-router-dom v7. Styling: Tailwind CSS v4 (via `@tailwindcss/vite`). UI primitives: Radix UI + shadcn/ui components. Forms: react-hook-form + zod. i18n: i18next (en/vi). API mocking: MSW. Animations: motion (Framer Motion).

## Architecture

Layered architecture with strict unidirectional imports — higher layers import from lower layers only.

```
src/
├── layouts/        # Page shells (admin, auth, client) — wraps pages with nav/sidebar
├── pages/          # Route-level components — one folder per route
├── features/       # Domain logic modules (food, cart, order, user) — hooks, components, utils
├── components/     # Shared UI components (shadcn/ui-based, Radix primitives)
├── core/           # Cross-cutting: hooks (useRedux, useReloadUser), guards, contexts (theme)
├── store/          # Redux slices (auth, user, cart, food) — no API calls here
├── apis/           # API layer: ApiClient (custom fetch wrapper), endpoint modules, response models
├── app/            # Pure TS only — constants, enums, i18n, models, utils, assets
├── app.tsx         # Root component — initializes cart, categories, navigation
├── app.routes.tsx  # All route definitions
└── main.tsx        # Entry — providers (Redux, React Query, Router, Theme, MSW)
```

### Import Rules

```
layouts    → pages, features, components, core, store, apis, app
pages      → layouts(store only), features, components, core, store, apis, app
features   → components, core, store, apis, app
components → core, app
core       → apis, app
store      → features(models only), app
apis       → app
app        → (no imports from other layers)
```

ESLint enforces: no importing directly from `@/apis/models/` — use viewmodels from features instead.

### Key Patterns

- **API client** (`src/apis/client.ts`): Custom fetch wrapper with request/response interceptors, automatic token refresh on 401, XSRF token handling. All API modules use the shared `apiClient` instance.
- **Path aliases**: `@/` maps to `src/`. Additional shortcuts: `@/components`, `@/utils`, `@/enums`, `@/constants`, `@/hooks`, `@/contexts`.
- **MSW mocking**: Enabled via `VITE_ENABLE_MOCK=true` env var. Mock handlers in `mocks/` directory.
- **Guards**: Route guards in `src/core/guards/` handle auth, admin, and reset-password access control.
- **i18n** (`src/app/i18n/`): i18next with `react-i18next`. Supports English (`en`) and Vietnamese (`vi`). Language is detected from `localStorage` then browser, with `en` as fallback. Use `useTranslation` hook and `t()` in components — never hardcode user-facing strings. Locale files: `src/app/i18n/locales/{en,vi}.json`.

## Code Conventions

Follow the detailed rules in `docs/rules/`. Key points:

### Naming

| Type          | Convention                     | Example                     |
| ------------- | ------------------------------ | --------------------------- |
| Files/Folders | kebab-case                     | `user-profile.tsx`, `auth/` |
| Components    | PascalCase                     | `UserCard`                  |
| Props         | PascalCase + `Props`           | `UserCardProps`             |
| Types         | PascalCase (+ `Type` optional) | `UserRoleType`              |
| Enums         | PascalCase + `Enum`            | `StatusEnum`                |
| Models        | PascalCase + `Model`           | `UserViewModel`             |
| Hooks         | `use` prefix                   | `useAuth`                   |
| APIs          | camelCase + `Api`              | `userApi`                   |
| Utils         | camelCase + `Utils`            | `dateUtils`                 |
| Constants     | UPPERCASE_SNAKE_CASE           | `PAGE_SIZE`                 |

### Component Structure Order

1. Imports → 2. Types → 3. Component definition → 4. Hooks → 5. useEffect → 6. Helpers → 7. Event handlers (useCallback) → 8. Early returns → 9. Render → 10. Export (wrapped with `memo`)

### Formatting (Prettier)

120 char line width, 4-space indent, single quotes, JSX single quotes, trailing commas (es5), arrow parens: avoid.

### Key Principles

- **No React in `app` layer** — pure TypeScript only; exception: `src/app/i18n/i18n.ts` uses `initReactI18next` as a bootstrap adapter only
- **No API calls in store** — use features/hooks for side effects
- **No business logic in components** — use features/hooks
- **Import order enforced**: builtin → external → internal → parent → sibling → index (alphabetized, with blank lines between groups)

## Full Documentation

- **Architecture & Layer Rules**: `docs/rules/architecture.md`
- **Naming Conventions**: `docs/rules/naming.md`
- **Best Practices & Patterns**: `docs/rules/best-practices.md`
