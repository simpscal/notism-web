# React Naming Conventions

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
- `[on + Action + Target]` or `[on + Target + Action]`

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
- Boolean state prefixed with `is`, `has`, `should`, or `can`

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
- Suffix the name with `Util` or descriptive name

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
- Prefix with `REACT_APP_` (for Create React App) or `VITE_` (for Vite)
- Words separated by `_`

**Example**:

```bash
# .env
REACT_APP_API_BASE_URL=https://api.example.com
REACT_APP_ENVIRONMENT=development

# Vite
VITE_API_KEY=your-api-key
VITE_ENVIRONMENT=development
```

## CSS/Style Related

**Convention**:

- **kebab-case** for CSS classes
- **camelCase** for CSS-in-JS or styled-components
- **BEM methodology** for complex components

## Folder

**Convention**:

- **kebab-case**
