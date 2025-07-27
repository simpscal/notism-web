# Naming Conventions

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

- Pattern: `{entity}.models.ts`
- Examples: `user.models.ts`, `product.models.ts`, `order.models.ts`

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
- Examples: `user-profile.tsx`, `product-card.tsx`

**Pages**:

- Pattern: `{page-name}.tsx`
- Examples: `home.tsx`, `user-profile.tsx`, `product-detail.tsx`

**Layouts**:

- Pattern: `{layout-name}.tsx`
- Examples: `main.tsx`, `auth.tsx`, `dashboard.tsx`

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

### Examples

```text
✅ Good file names:
user.models.ts
use-auth.hook.ts
product-card.component.tsx
user-profile.page.tsx
api.constants.ts
date.utils.ts
auth.context.tsx

❌ Bad file names:
User.ts (PascalCase)
userModels.ts (camelCase)
user_models.ts (snake_case)
UserAPI.ts (mixed case)
utils.ts (too generic)
helper.ts (unclear purpose)
```

## Constant

**Convention**:

- **UPPERCASE**
- Words separated by `_`

**Example**:

```javascript
// page.constants.ts
const PAGE_SIZE = 5;
const DEFAULT_TIMEOUT = 3000;
```

## Enum

**Convention**:

- **PascalCase**
- Suffixed with `Enum`

**Example**:

```javascript
// notification.enums.ts
enum StatusEnum {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected'
}
```

## Type

**Convention**:

- **PascalCase**
- Suffixed with `Type`

**Example**:

```javascript
// user.types.ts
type UserRoleType = 'admin' | 'user' | 'guest';
```

## Interface

**Convention**:

- **PascalCase**
- Prefixed with `I`

**Example**:

```javascript
interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRoleType;
}
```

## Component Props Interface

**Convention**:

- **PascalCase**
- Component name + `Props`

**Example**:

```javascript
// user-card.tsx
interface UserCardProps {
  user: IUser;
  onEdit?: (user: IUser) => void;
  onDelete?: (userId: string) => void;
  isLoading?: boolean;
  className?: string;
}
```

## Event Handler

**Convention**:

- **camelCase**
- Prefix the name with `on`
- `[on + Action + Target]`

**Example**:

```javascript
const onSubmitForm = (event: React.FormEvent) => {
  ...
};

const onUserDeleted = (userId: string) => {
  ...
};
```

## Custom Hook

**Convention**:

- **camelCase**
- Prefix the name with `use`

**Example**:

```javascript
// hooks/use-auth.ts
const useAuth = () => {
  ...
};
```

## State Variables

**Convention**:

- **camelCase**
- State setter prefixed with `set` + PascalCase state name
- Boolean state prefixed with `is`

**Example**:

```javascript
const [user, setUser] = (useState < IUser) | (null > null);
const [isLoading, setIsLoading] = useState(false);
const [hasError, setHasError] = useState(false);
const [canSubmit, setCanSubmit] = useState(false);
```

## Ref Variables

**Convention**:

- **camelCase**
- Suffixed with `Ref`

**Example**:

```javascript
const modalRef = useRef < HTMLDivElement > null;
const inputRef = useRef < HTMLInputElement > null;
```

## Context

**Convention**:

- **PascalCase**
- Suffixed with `Context`

**Example**:

```javascript
// contexts/auth-context.tsx
const AuthContext = (createContext < IAuthContext) | (null > null);
```

## Context Provider

**Convention**:

- **PascalCase**
- Context name + `Provider`

**Example**:

```javascript
// contexts/auth-context.tsx
export function AuthProvider({ children }: { children: ReactNode }) {
  ...

  return (
    <AuthContext.Provider value={...}>
      {children}
    </AuthContext.Provider>
  );
}
```

## Context Hook

**Convention**:

- **camelCase**
- `use` + Context name (without Context suffix)

**Example**:

```javascript
// contexts/auth-context.tsx
export const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};
```

## Component

**Convention**:

- **PascalCase**
- Descriptive name without suffixes
- File name should match component name

**Example**:

```javascript
// components/user-card.tsx
export function UserCard({ user, onEdit, onDelete, isLoading }: UserCardProps) {
  return (
    ...
  );
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

- Place utilities in utils folder
- Suffix the name with `Util`

**Example**:

```javascript
// utils/date-time.utils.ts
export class DateTimeUtil {
  ...
}
```

## API Services

**Convention**:

- **camelCase**
- Suffix the name with `Api`

**Example**:

```javascript
// services/user.api.ts
export const userApi = {
  getUsers: () => {
    ...
  }
};
```

## Environment Variables

**Convention**:

- **UPPERCASE**
- Prefix with `VITE_`
- Words separated by `_`

**Example**:

```bash
# .env
VITE_API_BASE_URL=https://api.example.com
VITE_API_KEY=your-api-key
VITE_ENVIRONMENT=development
```

## CSS/Style Related

**Convention**:

- **kebab-case**

## Folder

**Convention**:

- **kebab-case**
