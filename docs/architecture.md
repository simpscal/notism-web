# Project Architecture

## Structure Principles

### Layer Hierarchy (Top to Bottom)

1. **app** - Application configuration and assets
2. **pages** - Complete application pages
3. **features** - Business logic and features
4. **components** - Reusable UI components
5. **core** - React-specific shared resources
6. **shared** - TypeScript utilities and types

## Project Structure

```text
📁 src/
├── 📁 app/          # Application configuration and assets
│   ├── 📁 assets/   # Images, fonts, icons
│   ├── 📁 config/   # App, API, routes configuration
│   └── 📁 styles/   # Global styles
│
├── 📁 pages/        # Complete application pages
│   ├── 📁 accounts/
│   ├── 📁 auth/
│   └── ...
│
├── 📁 features/     # Business logic and features
│   ├── 📁 accounts/
│   │   ├── 📁 account-list/
│   │   ├── 📁 account-create/
│   │   ├── 📁 apis/
│   │   ├── 📁 models/
│   │   ├── 📁 store/
│   │   └── ...
│   ├── 📁 auth/
│   └── ...
│
├── 📁 components/   # Reusable UI components
│   ├── 📁 button/
│   ├── 📁 modal/
│   ├── 📁 form/
│   └── ...
│
├── 📁 core/         # React-specific shared resources
│   ├── 📁 hooks/
│   ├── 📁 context/
│   ├── 📁 apis/
│   └── 📁 store/
│
├── 📁 shared/       # TypeScript utilities and types
│   ├── 📁 constants/
│   ├── 📁 enums/
│   ├── 📁 models/
│   └── 📁 utils/
│
├── 📄 main.tsx
└── 📄 app.tsx
```

## Import Rules

### Allowed Imports (↓ can import from ↓)

```text
pages      → features, components, core, shared, app/config
features   → components, core, shared, app/config
components → shared, core, app/assets
core       → shared, app/config
shared     → (no imports from other layers)
app        → (no imports from other layers)
```

## Folder Responsibilities

### App Folder

Contains application-wide configurations and static assets:

```typescript
// app/config/app.config.ts
export const appConfig = {
  appName: 'Admin Dashboard',
  version: '1.0.0',
  environment: import.meta.env.MODE,
  features: {
    enableNewAccountFlow: true,
    enableSubscriptions: true,
  },
};

// app/config/api.config.ts
export const apiConfig = {
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// app/config/routes.config.ts
export const routesConfig = {
  home: '/',
  accounts: {
    list: '/accounts',
    detail: '/accounts/:id',
  },
  subscriptions: {
    list: '/subscriptions',
    detail: '/subscriptions/:id',
  },
  auth: {
    login: '/login',
    register: '/register',
  },
};
```

### Components Folder

Pure UI components without business logic:

```typescript
// components/button/button.tsx
import { ButtonHTMLAttributes } from 'react';
import { classNames } from '@/shared/utils';
import styles from './button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export const Button = ({
  variant = 'primary',
  size = 'medium',
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        styles.button,
        styles[variant],
        styles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Layout Folder

Layout components that provide structural containers for pages.

#### Layout Responsibilities

- **Page Containers**: Provide consistent structural containers that accommodate multiple pages
- **Layout Consistency**: Ensure consistent spacing, positioning, and visual structure across pages
- **Responsive Structure**: Handle responsive layout behavior and breakpoints

#### Layout Examples

```typescript
// components/layout/page-layout.tsx
import { ReactNode } from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { Sidebar } from './sidebar';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  showSidebar?: boolean;
  headerActions?: ReactNode;
}

export const PageLayout = ({
  children,
  title,
  showSidebar = true,
  headerActions
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header title={title} actions={headerActions} />

      <div className="flex flex-1">
        {showSidebar && <Sidebar />}

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

// components/layout/auth-layout.tsx
export const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img src="/logo.svg" alt="Logo" className="mx-auto h-12 w-auto" />
        </div>
        {children}
      </div>
    </div>
  );
};
```

### Pages Folder

Complete page components that compose features and components:

```typescript
// pages/accounts/accounts-page.tsx
import { useState } from 'react';
import { PageLayout } from '@/components/layout';
import { Button } from '@/components/button';
import { AccountList } from '@/features/accounts/account-list';
import { CreateAccountModal } from '@/features/accounts/account-create';
import { useAuth } from '@/core/hooks';

export const AccountsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { hasPermission } = useAuth();

  return (
    <PageLayout title="Accounts">
      <div className="page-header">
        <h1>Accounts Management</h1>
        {hasPermission('accounts.create') && (
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Account
          </Button>
        )}
      </div>

      <AccountList />

      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </PageLayout>
  );
};

// pages/accounts/account-details-page.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout';
import { AccountDetails } from '@/features/accounts/account-details';
import { UpdateAccountModal } from '@/features/accounts/account-update';
import { useAccount } from '@/features/accounts/hooks';

export const AccountDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { account, isLoading, error } = useAccount(id);

  if (isLoading) return <PageLayout><div>Loading...</div></PageLayout>;
  if (error) return <PageLayout><div>Error loading account</div></PageLayout>;

  return (
    <PageLayout title={`Account: ${account?.name}`}>
      <Button onClick={() => navigate('/accounts')}>
        Back to List
      </Button>

      <AccountDetails account={account} />
    </PageLayout>
  );
};

// pages/home-page.tsx
import { PageLayout } from '@/components/layout';
import { DashboardWidget } from '@/features/dashboard/dashboard-widget';
import { RecentActivity } from '@/features/activity/recent-activity';

export const HomePage = () => {
  return (
    <PageLayout title="Dashboard">
      <div className="dashboard-grid">
        <DashboardWidget />
        <RecentActivity />
      </div>
    </PageLayout>
  );
};
```

#### Page Responsibilities

- **Composition**: Pages compose features and components together
- **Routing**: Handle route parameters and navigation
- **Authorization**: Check permissions and access control at page level
- **Data Orchestration**: Coordinate multiple features on the same page
- **Error Boundaries**: Handle page-level errors and loading states

#### Page Best Practices

```typescript
// ✅ Good: Page only orchestrates
export const AccountsPage = () => {
  return (
    <PageLayout>
      <AccountList />
      <CreateAccountButton />
    </PageLayout>
  );
};

// ❌ Bad: Business logic in pages
export const AccountsPage = () => {
  // Don't put business logic here
  const accounts = useQuery(['accounts'], fetchAccounts);

  const handleCreate = async (data) => {
    // This should be in a feature
    await api.post('/accounts', data);
  };

  return (/*...*/);
};
```

### Features Folder

Business logic and feature-specific components:

```typescript
// features/accounts/account-create/create-account-modal.tsx
import { useState } from 'react';
import { Modal } from '@/components/modal';
import { useCreateAccount } from './use-create-account';
import { CreateAccountForm } from './create-account-form';

export const CreateAccountModal = ({ isOpen, onClose }) => {
  const { create, isLoading } = useCreateAccount();

  const handleSubmit = async (data) => {
    await create(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Account">
      <CreateAccountForm onSubmit={handleSubmit} isLoading={isLoading} />
    </Modal>
  );
};

// features/accounts/account-create/use-create-account.ts
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { apiClient } from '@/core/apis';
import { API_ENDPOINTS } from '@/shared/constants';
import { addAccount } from '../store';

export const useCreateAccount = () => {
  const dispatch = useDispatch();

  const mutation = useMutation(
    (data) => apiClient.post(API_ENDPOINTS.accounts.create, data),
    {
      onSuccess: (account) => {
        dispatch(addAccount(account));
      }
    }
  );

  return {
    create: mutation.mutate,
    isLoading: mutation.isLoading,
    error: mutation.error
  };
};
```

### Shared Folder

TypeScript types, utilities, and constants:

```typescript
// shared/models/api.model.ts
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// shared/utils/formatters.utils.ts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// shared/enums/account-status.enums.ts
export enum AccountStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}
```

#### Shared Layer Dependencies

**Allowed Dependencies (Higher can depend on Lower):**

```text
utils     → models, enums, constants
models    → enums, constants
enums     → constants
constants → (no internal dependencies)
```

**Examples:**

```typescript
// shared/constants/app.constants.ts
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const API_TIMEOUT = 30000;

// shared/enums/status.enums.ts
import { API_TIMEOUT } from '../constants';

export enum StatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// shared/models/user.model.ts
import { StatusEnum } from '../enums';

export interface IUser {
  id: string;
  name: string;
  status: StatusEnum;
}

// shared/utils/user.utils.ts
import { IUser } from '../models';
import { StatusEnum } from '../enums';
import { MAX_FILE_SIZE } from '../constants';

export const isActiveUser = (user: IUser): boolean => {
  return user.status === StatusEnum.ACTIVE;
};
```

### Core Folder

React-specific shared resources for hooks, contexts, guards, and APIs:

```typescript
// core/hooks/use-auth.ts
import { useState, useEffect } from 'react';
import { apiClient } from '../apis';
import { IUser } from '@/shared/models';

export const useAuth = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    setUser(response.data.user);
  };

  return { user, login, loading };
};

// core/contexts/auth-context.tsx
import { createContext, ReactNode } from 'react';
import { useAuth } from '../hooks';
import { IUser } from '@/shared/models';

interface IAuthContext {
  user: IUser | null;
  login: (credentials: LoginCredentials) => Promise<void>;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// core/guards/auth-guard.tsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts';
import { ROUTES } from '@/app/config';

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const auth = useContext(AuthContext);

  if (!auth?.user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

// core/apis/client.api.ts
import { tokenManagerUtils } from '@/shared/utils';

export interface IApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

export class ApiClient {
  private getAuthHeaders() {
    const token = tokenManagerUtils.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
```

#### Core Layer Dependencies

**Allowed Dependencies (Higher can depend on Lower):**

```text
guards   → hooks, contexts, apis, shared, app/config
contexts → hooks, apis, shared, app/config
hooks    → apis, shared, app/config
apis     → shared, app/config
```

**Examples:**

```typescript
// core/apis/client.api.ts
import { tokenManagerUtils } from '@/shared/utils';

export interface IApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

export class ApiClient {
  private getAuthHeaders() {
    const token = tokenManagerUtils.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// core/hooks/use-auth.ts
import { apiClient } from '../apis';
import { IUser } from '@/shared/models';

export const useAuth = () => {
  const [user, setUser] = useState<IUser | null>(null);

  const login = async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    setUser(response.data.user);
  };

  return { user, login };
};

// core/contexts/auth-context.tsx
import { useAuth } from '../hooks';
import { IUser } from '@/shared/models';

interface IAuthContext {
  user: IUser | null;
  login: (credentials: LoginCredentials) => Promise<void>;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// core/guards/auth-guard.tsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts';
import { ROUTES } from '@/app/config';

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const auth = useContext(AuthContext);

  if (!auth?.user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};
```
