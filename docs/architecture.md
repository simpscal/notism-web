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

```
📁 src/
├── 📁 app/
│   ├── 📁 assets/
│   │   ├── 📁 images/
│   │   │   └── 📄 logo.svg
│   │   ├── 📁 fonts/
│   │   │   └── 📄 inter.woff2
│   │   └── 📁 icons/
│   │       └── 📄 sprite.svg
│   ├── 📁 config/
│   │   ├── 📄 app.config.ts
│   │   ├── 📄 api.config.ts
│   │   ├── 📄 routes.config.ts
│   │   └── 📄 index.ts
│   ├── 📁 styles/
│   │   ├── 📄 globals.css
│   │   ├── 📄 variables.css
│   │   └── 📄 index.css
│   └── 📄 index.ts
│
├── 📁 components/
│   ├── 📁 accordion/
│   │   ├── 📄 accordion.tsx
│   │   ├── 📄 accordion-item.tsx
│   │   ├── 📄 accordion.module.css
│   │   └── 📄 index.ts
│   ├── 📁 tabs/
│   │   ├── 📄 tabs.tsx
│   │   ├── 📄 tab-panel.tsx
│   │   ├── 📄 tabs.module.css
│   │   └── 📄 index.ts
│   ├── 📁 button/
│   │   ├── 📄 button.tsx
│   │   ├── 📄 button.module.css
│   │   └── 📄 index.ts
│   ├── 📁 modal/
│   │   ├── 📄 modal.tsx
│   │   ├── 📄 modal-header.tsx
│   │   ├── 📄 modal-body.tsx
│   │   ├── 📄 modal.module.css
│   │   └── 📄 index.ts
│   ├── 📁 form/
│   │   ├── 📄 input.tsx
│   │   ├── 📄 select.tsx
│   │   ├── 📄 checkbox.tsx
│   │   ├── 📄 form-field.tsx
│   │   └── 📄 index.ts
│   ├── 📁 layout/
│   │   ├── 📄 page-layout.tsx
│   │   ├── 📄 sidebar.tsx
│   │   ├── 📄 header.tsx
│   │   └── 📄 index.ts
│   ├── 📁 table/
│   │   ├── 📄 table.tsx
│   │   ├── 📄 table-row.tsx
│   │   ├── 📄 table-cell.tsx
│   │   └── 📄 index.ts
│   └── 📄 index.ts
│
├── 📁 core/
│   ├── 📁 hooks/
│   │   ├── 📄 use-auth.ts
│   │   ├── 📄 use-permissions.ts
│   │   ├── 📄 use-api.ts
│   │   └── 📄 index.ts
│   ├── 📁 context/
│   │   ├── 📄 auth-context.tsx
│   │   ├── 📄 theme-context.tsx
│   │   └── 📄 index.ts
│   ├── 📁 apis/
│   │   ├── 📄 api-client.api.ts
│   │   ├── 📄 auth.api.ts
│   │   └── 📄 index.ts
│   └── 📁 store/
│       ├── 📄 root-reducer.ts
│       ├── 📄 store.ts
│       ├── 📄 middleware.ts
│       └── 📄 index.ts
│
├── 📁 features/
│   ├── 📁 accounts/
│   │   ├── 📁 account-list/
│   │   │   ├── 📄 account-list.tsx
│   │   │   ├── 📄 account-list-item.tsx
│   │   │   ├── 📄 account-list-filters.tsx
│   │   │   ├── 📄 use-account-list.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 account-create/
│   │   │   ├── 📄 create-account-modal.tsx
│   │   │   ├── 📄 create-account-form.tsx
│   │   │   ├── 📄 use-create-account.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 account-update/
│   │   │   ├── 📄 update-account-modal.tsx
│   │   │   ├── 📄 update-account-form.tsx
│   │   │   ├── 📄 use-update-account.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 account-delete/
│   │   │   ├── 📄 delete-account-dialog.tsx
│   │   │   ├── 📄 use-delete-account.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 apis/
│   │   │   ├── 📄 account.api.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 models/
│   │   │   ├── 📄 account.types.ts
│   │   │   ├── 📄 account.schema.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 constants/
│   │   │   ├── 📄 account-constants.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 store/
│   │   │   ├── 📄 account-slice.ts
│   │   │   ├── 📄 account-selectors.ts
│   │   │   └── 📄 index.ts
│   │   └── 📄 index.ts
│   │
│   ├── 📁 subscriptions/
│   │   ├── 📁 subscription-list/
│   │   │   ├── 📄 subscription-list.tsx
│   │   │   ├── 📄 subscription-card.tsx
│   │   │   ├── 📄 use-subscription-list.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 subscription-update/
│   │   │   ├── 📄 update-subscription-modal.tsx
│   │   │   ├── 📄 update-subscription-form.tsx
│   │   │   ├── 📄 use-update-subscription.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 apis/
│   │   │   ├── 📄 subscription.api.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 models/
│   │   │   ├── 📄 subscription.types.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 store/
│   │   │   ├── 📄 subscription-slice.ts
│   │   │   └── 📄 index.ts
│   │   └── 📄 index.ts
│   │
│   ├── 📁 auth/
│   │   ├── 📁 login/
│   │   │   ├── 📄 login-form.tsx
│   │   │   ├── 📄 use-login.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 logout/
│   │   │   ├── 📄 logout-button.tsx
│   │   │   ├── 📄 use-logout.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 register/
│   │   │   ├── 📄 register-form.tsx
│   │   │   ├── 📄 use-register.ts
│   │   │   └── 📄 index.ts
│   │   └── 📄 index.ts
│   │
│   ├── 📁 user-profile/
│   │   ├── 📄 user-avatar.tsx
│   │   ├── 📄 user-menu.tsx
│   │   ├── 📄 use-user-profile.ts
│   │   └── 📄 index.ts
│   │
│   └── 📄 index.ts
│
├── 📁 pages/
│   ├── 📁 accounts/
│   │   ├── 📄 accounts-page.tsx
│   │   ├── 📄 account-details-page.tsx
│   │   └── 📄 index.ts
│   ├── 📁 subscriptions/
│   │   ├── 📄 subscriptions-page.tsx
│   │   ├── 📄 subscription-details-page.tsx
│   │   └── 📄 index.ts
│   ├── 📁 auth/
│   │   ├── 📄 login-page.tsx
│   │   ├── 📄 register-page.tsx
│   │   └── 📄 index.ts
│   ├── 📄 access-denied-page.tsx
│   ├── 📄 no-access-page.tsx
│   ├── 📄 home-page.tsx
│   └── 📄 index.ts
│
├── 📁 shared/
│   ├── 📁 constants/
│   │   ├── 📄 api-endpoints.ts
│   │   ├── 📄 messages.ts
│   │   ├── 📄 regex.ts
│   │   └── 📄 index.ts
│   ├── 📁 enums/
│   │   ├── 📄 http-status.enum.ts
│   │   ├── 📄 user-role.enum.ts
│   │   ├── 📄 account-status.enum.ts
│   │   └── 📄 index.ts
│   ├── 📁 models/
│   │   ├── 📄 common.types.ts
│   │   ├── 📄 api.types.ts
│   │   ├── 📄 pagination.types.ts
│   │   └── 📄 index.ts
│   ├── 📁 utils/
│   │   ├── 📄 date-helpers.ts
│   │   ├── 📄 formatters.ts
│   │   ├── 📄 validators.ts
│   │   ├── 📄 storage.ts
│   │   └── 📄 index.ts
│   └── 📄 index.ts
│
├── 📄 main.tsx
├── 📄 router.tsx
└── 📄 vite-env.d.ts
```

## Import Rules

### Allowed Imports (↓ can import from ↓)

```
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

Layout components that compose pages

#### Layout Responsibilities

- **Routing**: Handle routing for pages
- ***

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

#### Page Responsibilities:

- **Composition**: Pages compose features and components together
- **Routing**: Handle route parameters and navigation
- **Layout**: Apply page-specific layouts and structure
- **Authorization**: Check permissions and access control at page level
- **Data Orchestration**: Coordinate multiple features on the same page
- **Error Boundaries**: Handle page-level errors and loading states

#### Page Best Practices:

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

## Common Patterns

### Component Composition

```typescript
// pages/accounts/accounts-page.tsx
import { useState } from 'react';
import { PageLayout } from '@/components/layout';
import { Button } from '@/components/button';
import { AccountList } from '@/features/accounts/account-list';
import { CreateAccountModal } from '@/features/accounts/account-create';

export const AccountsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <PageLayout title="Accounts">
      <Button
        variant="primary"
        onClick={() => setIsCreateModalOpen(true)}
      >
        Create Account
      </Button>

      <AccountList />

      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </PageLayout>
  );
};
```

### Cross-Feature Components

For features that are shared across multiple pages (like user-profile), place them directly under the features folder:

```typescript
// features/user-profile/user-menu.tsx
import { Dropdown } from '@/components/dropdown';
import { useAuth } from '@/core/hooks';
import { useLogout } from '@/features/auth/logout';

export const UserMenu = () => {
  const { user } = useAuth();
  const { logout } = useLogout();

  return (
    <Dropdown>
      <Dropdown.Item>{user.name}</Dropdown.Item>
      <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
    </Dropdown>
  );
};
```
