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

## Conventions — load before editing

| When you…                                                                                  | Read                                   |
| ------------------------------------------------------------------------------------------ | -------------------------------------- |
| Add/move a file between `src/` layers, or import across layer boundaries                   | `docs/rules/architecture.md`           |
| Create any new file (component, hook, util, model, slice, test, context, guard, api)       | `docs/rules/naming.md`                 |
| Create/edit any `.tsx` component; add Tailwind classes; handle JSX events                  | `docs/rules/components.md`             |
| Add `useQuery`/`useMutation`/`useInfiniteQuery`; fetch data in `features/**` or `pages/**` | `docs/rules/tanstack-query.md`         |
| Add/edit a file under `src/pages/**` or `src/features/**`                                  | `docs/rules/pages-and-features.md`     |
| Create/edit a Redux slice under `src/store/**`; use `useAppSelector`/`useAppDispatch`      | `docs/rules/store.md`                  |
| Create/edit a file under `src/core/hooks\|contexts\|guards/**`                             | `docs/rules/core.md`                   |
| Build a form; use `useForm`/`zodResolver`/`Controller`/`<Field>`/Zod schema                | `docs/rules/forms.md`                  |
| Add a user-visible string; edit `src/app/i18n/locales/*.json`; use `useTranslation`/`t()`  | `docs/rules/i18n.md`                   |
| Implement or change the OAuth login flow                                                   | `docs/integration-flows/oauth-flow.md` |

## CI/CD

| Workflow        | Trigger          | Target              |
| --------------- | ---------------- | ------------------- |
| `deploy-s3.yml` | Push to dev/main | AWS S3 + CloudFront |

Branch → environment: `main` = prod, `dev` = dev
