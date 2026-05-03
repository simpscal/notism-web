# CLAUDE.md

## Technologies

| Category      | Technology                     |
| ------------- | ------------------------------ |
| Framework     | React 19                       |
| TypeScript    | ~5.8                           |
| Build tool    | Vite 6                         |
| CSS           | Tailwind v4                    |
| UI components | shadcn/ui (Radix UI)           |
| State         | Redux Toolkit                  |
| Data fetching | TanStack Query                 |
| Routing       | React Router v7                |
| Forms         | React Hook Form + Zod          |
| i18n          | i18next                        |
| Real-time     | Microsoft SignalR              |
| Testing       | Vitest + Testing Library + MSW |

Package manager: **bun** (not npm)

## Commands

```bash
bun run build        # production build
bun run build:dev    # dev build
bun run lint         # ESLint check
bun run start        # dev server
bun run start:mock  # dev server with MSW mocking
bun run test         # Vitest run
```

## Folder Structure

```
src/
  app/              # Constants, enums, i18n, utils, styles
  apis/             # API clients + request/response DTOs
  components/       # Reusable UI components (shadcn/ui)
    [feature]/      # Feature-specific components
    ui/             # Base components (button, card, dialog, etc.)
  core/             # Hooks, contexts, route guards
  features/        # Feature business logic (ViewModels)
  layouts/          # AdminLayout, AuthLayout, ClientLayout
  pages/            # Page components + routing
  store/            # Redux slices (auth, cart, food, user)
  mocks/            # MSW handlers for API mocking
```

## Architecture

| Layer         | Responsibility                      |
| ------------- | ----------------------------------- |
| `layouts/`    | Top-level structural containers     |
| `pages/`      | Page components, route rendering    |
| `features/`   | Shared business logic between pages |
| `components/` | Reusable UI components              |
| `core/`       | Hooks, contexts, guards             |
| `store/`      | Redux state                         |
| `apis/`       | API calls                           |

Dependency rule: higher layers import from lower layers only. Never reverse.

State: Redux Toolkit (global) + TanStack Query (server state)
Forms: React Hook Form + Zod validation
Routing: React Router v7 via `app.routes.tsx`

## State Management

TanStack Query owns all server data. Redux owns auth, cart, and cross-route reference data only. Never put fetched data in Redux. Never call API functions directly in components.

## Tailwind v4 Tokens

No `tailwind.config.js`. All colors are CSS custom properties. Use semantic tokens only:
`bg-background`, `bg-primary`, `text-primary-foreground`, `text-destructive`, `text-muted-foreground`, `bg-card`, `border-border`.

Never use raw palette values (`bg-blue-500`, `text-red-600`, `bg-white`).

Conditional class merging: `cn()` from `@/app/utils/tailwind.utils`.

## Import Aliases

| Alias          | Path                 |
| -------------- | -------------------- |
| `@/components` | `src/components/`    |
| `@/constants`  | `src/app/constants/` |
| `@/hooks`      | `src/core/hooks/`    |
| `@/contexts`   | `src/core/contexts/` |
| `@/utils`      | `src/app/utils/`     |
| `@/test/utils` | `test/utils.tsx`     |
| `@/`           | `src/` (fallback)    |

## Tests

Test helper: `import { renderWithProviders } from '@/test/utils'` (wraps Redux, QueryClient, i18n, Router).
File placement: always in a `__tests__/` subdirectory co-located with the module under test. This applies to every layer — `app/utils/`, `features/`, `pages/`, `components/`, etc.

```
src/app/utils/__tests__/currency.utils.test.ts   ✅
src/app/utils/currency.utils.test.ts             ❌ (flat co-location)
```

## Document Navigation

| Topic              | Location                               |
| ------------------ | -------------------------------------- |
| Architecture       | `docs/rules/architecture.md`           |
| Best practices     | `docs/rules/best-practices.md`         |
| Naming conventions | `docs/rules/naming.md`                 |
| OAuth flow         | `docs/integration-flows/oauth-flow.md` |

## CI/CD

| Workflow        | Trigger          | Target              |
| --------------- | ---------------- | ------------------- |
| `deploy-s3.yml` | Push to dev/main | AWS S3 + CloudFront |

Branch → environment: `main` = prod, `dev` = dev
