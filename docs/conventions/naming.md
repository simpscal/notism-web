# Naming Conventions

This document defines the naming conventions used throughout the React application. Following these conventions ensures consistency, maintainability, and better developer experience.

## Table of Contents

- [File Naming](#file-naming)
- [Constants](#constants)
- [Enums](#enums)
- [Types](#types)
- [Interfaces](#interfaces)
- [Component Props Interface](#component-props-interface)
- [Event Handler](#event-handler)
- [Custom Hook](#custom-hook)
- [State Variables](#state-variables)
- [Boolean Variables](#boolean-variables)
- [Ref Variables](#ref-variables)
- [Context](#context)
- [Context Provider](#context-provider)
- [Context Hook](#context-hook)
- [Components](#components)
- [Callback Function Props](#callback-function-props)
- [Private Functions/Methods](#private-functionsmethods)
- [Utilities](#utilities)
- [API Services](#api-services)
- [Business Services](#business-services)
- [Models](#models)
- [Redux](#redux)
- [Functions](#functions)
- [Environment Variables](#environment-variables)
- [CSS/Style Related](#cssstyle-related)
- [Folders](#folders)
- [Summary](#summary)

## File Naming

### General Rules

- Use **kebab-case** for all file names
- Use descriptive, meaningful names that clearly indicate the file's purpose
- Avoid abbreviations unless they are widely understood
- Keep file names concise but descriptive

### File Extensions

- **TypeScript files**: `.ts`
- **TypeScript React components**: `.tsx`
- **Style files**: `.css`
- **Test files**: `.test.ts`, `.test.tsx`

### Layer-Specific Naming

#### Shared Layer Files

**Constants**:

- Pattern: `{domain}.constants.ts`
- Examples: `api.constants.ts`, `validation.constants.ts`, `theme.constants.ts`

**Enums**:

- Pattern: `{domain}.enums.ts`
- Examples: `user.enums.ts`, `notification.enums.ts`, `status.enums.ts`

**Models**:

- Pattern: `{entity}.model.ts` (singular) or `{entity}.models.ts` (plural)
- Examples: `user.model.ts`, `period.model.ts`, `oauth.model.ts`
- Can contain multiple model classes/interfaces in a single file

**Utils**:

- Pattern: `{purpose}.utils.ts`
- Examples: `date.utils.ts`, `validation.utils.ts`, `format.utils.ts`

#### Core Layer Files

**Hooks**:

- Pattern: `use-{purpose}.hook.ts`
- Examples: `use-auth.hook.ts`, `use-local-storage.hook.ts`, `use-api.hook.ts`

**Contexts**:

- Pattern: `{domain}.context.tsx`
- Examples: `auth.context.tsx`, `theme.context.tsx`, `notification.context.tsx`

**Guards**:

- Pattern: `{type}.guard.tsx`
- Examples: `auth.guard.tsx`, `role.guard.tsx`, `permission.guard.tsx`

**APIs**:

- Pattern: `{service}.api.ts`
- Examples: `user.api.ts`, `product.api.ts`, `auth.api.ts`

**Redux**:

- **Slices**: `{domain}.slice.ts`
- **Selectors**: `{domain}.selectors.ts` (optional)
- Examples: `auth.slice.ts`, `user.slice.ts`, `product.selectors.ts`

#### Feature Layer Files

**Components**:

- Pattern: `{component-name}.tsx`
- Examples: `user-profile.tsx`, `product-card.tsx`, `hero-section.tsx`, `selected-period-panel.tsx`

**Pages**:

- Pattern: `{page-name}.tsx`
- Examples: `home.tsx`, `timeline.tsx`, `landing.tsx`, `login.tsx`

**Layouts**:

- Pattern: `{layout-name}-layout.tsx` or `{layout-name}.tsx`
- Examples: `default-layout.tsx`, `auth-layout.tsx`, `dashboard-layout.tsx`

**Services**:

- Pattern: `{domain}.service.ts`
- Examples: `auth.service.ts`, `user.service.ts`, `notification.service.ts`

**Data/Mock Files**:

- Pattern: `mock-{entity}.data.ts` or `{entity}.data.ts`
- Examples: `mock-periods.data.ts`, `mock-users.data.ts`

### Special Files

**Index Files**:

- Always named `index.ts` for TypeScript files, `index.tsx` for React components
- Used for barrel exports in each directory
- Should re-export all public APIs from the directory

**Configuration Files**:

- Pattern: `{tool}.config.{ext}`
- Examples: `vite.config.ts`, `tailwind.config.js`, `eslint.config.js`

**Test Files**:

- Pattern: `{file-name}.test.{ext}`
- Examples: `user.api.test.ts`, `auth.guard.test.tsx`

## Constants

**Convention**:

- **UPPERCASE_SNAKE_CASE**
- Words separated by `_`
- Use descriptive names that clearly indicate the constant's purpose

**Example**:

```typescript
// page.constants.ts
const PAGE_SIZE = 5;
const DEFAULT_TIMEOUT = 3000;
const TOKEN_KEY = 'access-token';
const MAX_RETRY_ATTEMPTS = 3;
```

## Enums

**Convention**:

- **PascalCase**
- Suffixed with `Enum`
- Enum values use **PascalCase** for keys and appropriate casing for values

**Example**:

```typescript
// notification.enums.ts
enum StatusEnum {
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected',
}

enum UserRoleEnum {
    Admin = 'admin',
    User = 'user',
    Guest = 'guest',
}
```

## Types

**Convention**:

- **PascalCase**
- Can be suffixed with `Type` for clarity, but not required for simple types
- Use descriptive names that indicate the type's purpose

**Example**:

```typescript
// user.types.ts
type UserRoleType = 'admin' | 'user' | 'guest';
type Theme = 'dark' | 'light' | 'system';
type RequestInterceptor = (config: RequestConfig) => Promise<RequestConfig> | RequestConfig;
type ResponseInterceptor = (response: Response) => Promise<Response> | Response;
```

## Interfaces

**Convention**:

- **PascalCase**
- **General interfaces**: Prefixed with `I` (e.g., `IAuthState`, `IUser`)
- **Component props interfaces**: NO `I` prefix, use component name + `Props` (e.g., `UserCardProps`, `HeroSectionProps`)
- Use descriptive names that clearly indicate the interface's purpose

**Example**:

```typescript
// State/Data interfaces - use I prefix
interface IUser {
    id: string;
    name: string;
    email: string;
    role: UserRoleType;
}

interface IAuthState {
    accessToken: string | null;
}

// Component props - NO I prefix
interface UserCardProps {
    user: IUser;
    onEdit?: (user: IUser) => void;
    isLoading?: boolean;
}

interface HeroSectionProps {
    onExploreTimeline?: () => void;
    onGetStarted?: () => void;
}
```

## Component Props Interface

**Convention**:

- **PascalCase**
- Component name + `Props`
- **NO `I` prefix** for component props interfaces
- Always include `className?: string` for style customization

**Example**:

```typescript
// user-card.tsx
interface UserCardProps {
    user: IUser;
    onEdit?: (user: IUser) => void;
    onDelete?: (userId: string) => void;
    isLoading?: boolean;
    className?: string;
}

// hero-section.tsx
interface HeroSectionProps {
    onExploreTimeline?: () => void;
    onGetStarted?: () => void;
    className?: string;
}
```

## Event Handler

**Convention**:

- **camelCase**
- Prefix the name with `handle`
- Pattern: `handle + [Action] + [Target]`
- Use descriptive action verbs (Click, Submit, Change, Delete, etc.)

**Example**:

```typescript
const handleFormSubmit = (event: React.FormEvent) => {
    // Handle form submission
};

const handleUserDeleted = (userId: string) => {
    // Handle user deletion
};

const handlePeriodClick = (period: PeriodViewModel) => {
    setSelectedPeriodId(period.id);
};

const handleExploreTimelineClick = () => {
    navigate(`/${ROUTES.timeline}`);
};
```

## Custom Hook

**Convention**:

- **camelCase**
- Prefix the name with `use`
- Use descriptive names that indicate the hook's purpose
- File naming: `use-{purpose}.hook.ts`

**Example**:

```typescript
// hooks/use-auth.hook.ts
export function useAuth() {
    const context = useContext(AuthContext);
    return context;
}

// hooks/use-input.hook.ts
export function useInput(initialValue: string, options: UseInputOptions = {}) {
    const [value, setValue] = useState(initialValue);
    // ...
    return [value, bind, setValue] as const;
}

// hooks/use-theme.hook.ts (or useTheme from context)
export function useTheme() {
    const context = useContext(ThemeProviderContext);
    return context;
}
```

## State Variables

**Convention**:

- **camelCase** for state variable names
- State setter: `set` + PascalCase state name
- Boolean state prefixed with `is`, `has`, `can`, `should`, etc.
- Use descriptive names that clearly indicate the state's purpose

**Example**:

```typescript
const [user, setUser] = useState<IUser | null>(null);
const [periods, setPeriods] = useState<PeriodViewModel[]>([]);
const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [hasError, setHasError] = useState(false);
const [canSubmit, setCanSubmit] = useState(false);
```

## Boolean Variables

**Convention**:

- **camelCase**
- Prefixed with `is`, `has`, `can`, `should`, `will`, `did`, etc.
- Use descriptive names that form a question when read

**Common Prefixes**:

- **`is`** - For states or conditions (e.g., `isLoading`, `isActive`, `isVisible`)
- **`has`** - For possession or presence (e.g., `hasError`, `hasPermission`, `hasChildren`)
- **`can`** - For ability or permission (e.g., `canEdit`, `canDelete`, `canSubmit`)
- **`should`** - For conditions or recommendations (e.g., `shouldRender`, `shouldUpdate`)
- **`will`** - For future actions (e.g., `willRedirect`, `willClose`)
- **`did`** - For past actions (e.g., `didMount`, `didLoad`)

**Example**:

```javascript
// State booleans
const [isLoading, setIsLoading] = useState(false);
const [isOpen, setIsOpen] = useState(false);
const [isDisabled, setIsDisabled] = useState(false);
const [isShowPassword, setIsShowPassword] = useState(false);

// Computed booleans
const hasErrors = errors.length > 0;
const canSubmit = !isLoading && isValid;
const shouldShowMessage = isError && !isLoading;

// Props booleans
interface ButtonProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  hasIcon?: boolean;
}
```

## Ref Variables

**Convention**:

- **camelCase**
- Suffixed with `Ref`
- Use descriptive names that indicate what element the ref references

**Example**:

```typescript
const modalRef = useRef<HTMLDivElement>(null);
const inputRef = useRef<HTMLInputElement>(null);
const formRef = useRef<HTMLFormElement>(null);
const containerRef = useRef<HTMLDivElement>(null);
```

## Context

**Convention**:

- **PascalCase**
- Suffixed with `Context`
- File naming: `{domain}.context.tsx`

**Example**:

```typescript
// contexts/theme.context.tsx
const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// contexts/auth.context.tsx
const AuthContext = createContext<IAuthContext | null>(null);
```

## Context Provider

**Convention**:

- **PascalCase**
- Context name + `Provider`
- Export as a function component

**Example**:

```typescript
// contexts/theme.context.tsx
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  return (
    <ThemeProviderContext.Provider {...props} value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
```

## Context Hook

**Convention**:

- **camelCase**
- `use` + Context name (without `Context` suffix)
- Should validate context exists and throw error if used outside provider

**Example**:

```typescript
// contexts/theme.context.tsx
export function useTheme() {
    const context = useContext(ThemeProviderContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}

// contexts/auth.context.tsx
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
```

## Components

**Convention**:

- **PascalCase**
- Descriptive name without suffixes
- File name should match component name (kebab-case)
- Export as function components (preferred) or const arrow functions
- Use default export for page components, named export for reusable components

**Example**:

```typescript
// components/ui/button.tsx
export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

// pages/timeline/timeline.tsx
function Timeline() {
  // ...
}
export default Timeline;

// pages/landing/components/hero-section.tsx
export function HeroSection({ onExploreTimeline, onGetStarted }: HeroSectionProps) {
  // ...
}
```

## Callback Function Props

**Note**: callback functions are used as props.

**Convention**:

- Prefix the name with `on`
- Arrow functions in component usage

**Example**:

```javascript
interface ComponentProps {
  onSubmit?: (data: FormDataType) => void;
  onCancel?: () => void;
  onError?: (error: Error) => void;
}

// Usage
<UserForm
  onSubmit={(data) => handleFormSubmit(data)}
  onCancel={() => setShowForm(false)}
  onError={(error) => setError(error.message)}
/>
```

## Private Functions/Methods

**Convention**:

- Prefix the name with `_`

**Example**:

```javascript
const _validateForm = (data: FormDataType) => {
  ...
};

```

## Utilities

**Convention**:

- Place utilities in `utils` folder
- File naming: `{purpose}.utils.ts`
- Can be exported as:
    - **Object with methods**: `{name}Utils` (camelCase + `Utils` suffix)
    - **Functions**: `{action}Util` or descriptive function names
    - **Classes**: `{Name}Util` (PascalCase + `Util` suffix)

**Example**:

```typescript
// utils/token-manager.utils.ts
export const tokenManagerUtils = {
    getToken: () => localStorage.getItem(TOKEN_KEY),
    setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
    removeToken: () => localStorage.removeItem(TOKEN_KEY),
    clearAll: () => localStorage.removeItem(TOKEN_KEY),
    isTokenExpired: (token: string) => {
        /* ... */
    },
};

// utils/timeline.utils.ts
export function calculateTimelineGaps(periods: PeriodResponseModel[]): PeriodViewModel[] {
    // ...
}

export function normalizeYear(year: number, minYear: number, maxYear: number): number {
    // ...
}

export function formatYear(year: number): string {
    // ...
}
```

## API Services

**Convention**:

- **camelCase**
- Suffix the name with `Api`
- File naming: `{domain}.api.ts`
- Export as an object with async methods
- Methods should be descriptive and follow REST conventions (get, post, put, delete, etc.)

**Example**:

```typescript
// apis/timeline.api.ts
export const timelineApi = {
    getPeriods: async (): Promise<PeriodViewModel[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        return calculateTimelineGaps(mockPeriods);
    },
};

// apis/user.api.ts
export const userApi = {
    getUsers: async (): Promise<IUser[]> => {
        // ...
    },
    getUserById: async (id: string): Promise<IUser> => {
        // ...
    },
    createUser: async (user: CreateUserRM): Promise<IUser> => {
        // ...
    },
};
```

## Business Services

**Convention**:

- **camelCase**
- Suffix the name with `Service`
- File naming: `{domain}.service.ts`
- Contains business logic and orchestrates API calls, state management, etc.
- Export as an object with methods

**Example**:

```typescript
// services/auth.service.ts
export const authService = {
    /**
     * Handle successful authentication (login/signup)
     * Orchestrates storing token and user profile
     */
    authenticate(dispatch: AppDispatch, token: string, user: UserProfileVM) {
        dispatch(setToken(token));
        dispatch(setUser(user));
    },

    /**
     * Handle user logout
     * Orchestrates clearing all authentication and user data
     */
    logout(dispatch: AppDispatch) {
        dispatch(clearToken());
        dispatch(clearUser());
    },
} as const;
```

## Models

**Convention**:

- **PascalCase**
- Use descriptive suffixes to indicate model type:
    - `ViewModel` - For data used in UI/view layer
    - `ResponseModel` - For API response data
    - `RequestModel` - For API request data
- File naming: `{entity}.model.ts` (singular) or `{entity}.models.ts` (plural)

**Example**:

```typescript
// models/period.model.ts
export class PeriodResponseModel {
    id = '';
    name = '';
    startDate = 0;
    endDate = 0;
    description = '';
    eventRelevance = 0;

    constructor(data: Partial<PeriodResponseModel> = {}) {
        Object.assign(this, data);
    }
}

export class PeriodViewModel {
    id = '';
    name = '';
    startDate = 0;
    endDate = 0;
    description = '';
    eventRelevance = 0;
    gapBefore = 0; // UI-only field

    constructor(data: Partial<PeriodViewModel> = {}) {
        Object.assign(this, data);
    }
}

// models/user.model.ts
export interface UserProfileViewModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
}

export interface UpdateProfileRequestModel {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
}
```

## Redux

**Convention**:

- **Slices**: `{domain}.slice.ts`
- **State Interface**: `I{Domain}State` (e.g., `IAuthState`)
- **Actions**: camelCase, descriptive action names
- **Initial State**: `INITIAL_STATE` (UPPERCASE_SNAKE_CASE)
- **Selectors**: Optional, `{domain}.selectors.ts`

**Example**:

```typescript
// store/auth/auth.slice.ts
export interface IAuthState {
    accessToken: string | null;
}

const INITIAL_STATE: IAuthState = {
    accessToken: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState: INITIAL_STATE,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
            tokenManagerUtils.setToken(action.payload);
        },
        clearToken: state => {
            state.accessToken = null;
            tokenManagerUtils.clearAll();
        },
    },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
```

## Functions

**Convention**:

- **camelCase**
- Use descriptive, action-oriented names
- Use verb-noun pattern (e.g., `calculateGaps`, `formatDate`, `validateForm`)
- Private functions: prefix with `_` (e.g., `_validateForm`)

**Example**:

```typescript
// Public functions
export function calculateTimelineGaps(periods: PeriodResponseModel[]): PeriodViewModel[] {
    // ...
}

export function normalizeYear(year: number, minYear: number, maxYear: number): number {
    // ...
}

// Private functions
const _validateForm = (data: FormDataType) => {
    // ...
};

const _transformData = (raw: RawData) => {
    // ...
};
```

## Environment Variables

**Convention**:

- **UPPERCASE_SNAKE_CASE**
- Prefix with `VITE_` (for Vite projects)
- Words separated by `_`
- Use descriptive names

**Example**:

```bash
# .env
VITE_API_BASE_URL=https://api.example.com
VITE_API_KEY=your-api-key
VITE_ENVIRONMENT=development
VITE_APP_NAME=Notism
```

## CSS/Style Related

**Convention**:

- **kebab-case** for CSS class names
- Use Tailwind CSS utility classes when possible
- Custom CSS classes should be descriptive and follow BEM-like naming if needed

**Example**:

```css
/* Custom classes */
.timeline-container {
    /* ... */
}

.period-card {
    /* ... */
}

.period-card--selected {
    /* ... */
}
```

## Folders

**Convention**:

- **kebab-case** for all folder names
- Use descriptive names that indicate the folder's purpose
- Follow the layer structure: `features/`, `core/`, `shared/`, `components/`, `pages/`, `layouts/`

**Example**:

```text
src/
├── features/
│   ├── auth/
│   │   ├── apis/
│   │   ├── services/
│   ├── user/
│   │   ├── apis/
│   │   ├── models/
├── core/
│   ├── apis/
│   ├── contexts/
│   ├── guards/
│   ├── hooks/
├── pages/
│   ├── timeline/
│   │   ├── apis/
│   │   ├── components/
│   │   ├── models/
│   │   ├── utils/
│   │   ├── data/
│   ├── landing/
│   │   ├── components/
├── components/
│   ├── ui/
│   └── icon/
└── layouts/
    ├── auth/
    └── default/
```

## Summary

### Quick Reference

| Type                     | Convention                   | Example                                   |
| ------------------------ | ---------------------------- | ----------------------------------------- |
| **Files**                | kebab-case                   | `user-profile.tsx`, `auth.service.ts`     |
| **Components**           | PascalCase                   | `UserCard`, `HeroSection`                 |
| **Component Props**      | PascalCase + `Props`         | `UserCardProps`, `HeroSectionProps`       |
| **Interfaces (General)** | `I` + PascalCase             | `IAuthState`, `IUser`                     |
| **Interfaces (Props)**   | PascalCase + `Props`         | `UserCardProps` (no `I` prefix)           |
| **Types**                | PascalCase (+ `Type` suffix) | `UserRoleType`, `Theme`                   |
| **Enums**                | PascalCase + `Enum`          | `StatusEnum`                              |
| **Models**               | PascalCase + `Model` suffix  | `PeriodViewModel`, `UserProfileViewModel` |
| **Hooks**                | camelCase, `use` prefix      | `useAuth`, `useInput`                     |
| **Functions**            | camelCase                    | `calculateGaps`, `formatDate`             |
| **Event Handlers**       | camelCase, `handle` prefix   | `handleSubmit`, `handleClick`             |
| **State**                | camelCase                    | `user`, `isLoading`, `selectedPeriodId`   |
| **Setters**              | `set` + PascalCase           | `setUser`, `setIsLoading`                 |
| **APIs**                 | camelCase + `Api`            | `timelineApi`, `userApi`                  |
| **Services**             | camelCase + `Service`        | `authService`                             |
| **Utils**                | camelCase + `Utils`          | `tokenManagerUtils`                       |
| **Constants**            | UPPERCASE_SNAKE_CASE         | `PAGE_SIZE`, `TOKEN_KEY`                  |
| **Refs**                 | camelCase + `Ref`            | `modalRef`, `inputRef`                    |
| **Contexts**             | PascalCase + `Context`       | `AuthContext`, `ThemeProviderContext`     |
| **Folders**              | kebab-case                   | `user-profile/`, `auth/`                  |
