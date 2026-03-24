# Code Rules & Conventions

Follow the detailed rules in `docs/rules/`. This file contains the most critical rules for quick reference.

## Layer Import Rules

**Golden Rule**: Higher layers can import from lower layers only. No circular dependencies.

```
layouts    → pages, features, components, core, store, apis, app
pages      → layouts(store only), features, components, core, store, apis, app
features   → components, core, store, apis, app
components → core, app
core       → apis, app
store      → features(models only), app
apis       → app
app        → (no imports)
```

## Naming Quick Reference

| Type                | Convention                            | Example                               |
| ------------------- | ------------------------------------- | ------------------------------------- |
| **Files**           | kebab-case                            | `user-profile.tsx`, `auth.service.ts` |
| **Components**      | PascalCase                            | `UserCard`, `HeroSection`             |
| **Component Props** | PascalCase + `Props`                  | `UserCardProps`                       |
| **Types**           | PascalCase (+ `Type` suffix optional) | `UserRoleType`, `Theme`               |
| **Enums**           | PascalCase + `Enum`                   | `StatusEnum`                          |
| **Models**          | PascalCase + `Model` suffix           | `UserViewModel`, `UserResponseModel`  |
| **Hooks**           | camelCase, `use` prefix               | `useAuth`, `useInput`                 |
| **Functions**       | camelCase, verb-noun pattern          | `calculateGaps`, `formatDate`         |
| **Event Handlers**  | camelCase, `handle` prefix            | `handleSubmit`, `handleClick`         |
| **State**           | camelCase                             | `user`, `isLoading`, `selectedId`     |
| **State Setters**   | `set` + PascalCase                    | `setUser`, `setIsLoading`             |
| **APIs**            | camelCase + `Api`                     | `userApi`, `authApi`                  |
| **Utils**           | camelCase + `Utils`                   | `dateUtils`, `tokenManagerUtils`      |
| **Constants**       | UPPERCASE_SNAKE_CASE                  | `PAGE_SIZE`, `TOKEN_KEY`              |
| **Refs**            | camelCase + `Ref`                     | `modalRef`, `inputRef`                |
| **Contexts**        | PascalCase + `Context`                | `AuthContext`, `ThemeContext`         |
| **Folders**         | kebab-case                            | `user-profile/`, `auth/`              |

## Component Structure

See `docs/rules/best-practices.md` for detailed component order and patterns.

**Quick checklist**:

1. Imports
2. Types/Interfaces
3. Component definition
4. Hooks (useState, useRef, etc.)
5. useEffect
6. Utilities/helpers
7. Event handlers (useCallback)
8. Early returns
9. Main render
10. Export (wrapped with memo)

## Full Documentation

- **Architecture & Layer Rules**: `docs/rules/architecture.md`
- **Naming Conventions**: `docs/rules/naming.md`
- **Best Practices & Patterns**: `docs/rules/best-practices.md`

## Key Principles

- **No React in `app` layer**: Pure TypeScript only
- **No API calls in store**: Use features/hooks for side effects
- **No business logic in components**: Use features/hooks
- **No circular dependencies**: Maintain strict layer hierarchy
- **Import from lower layers only**: Never import upward
