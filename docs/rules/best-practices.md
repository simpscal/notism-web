# Best Practices

This document contains code examples and best practices for implementing the architecture defined in [architecture.md](./architecture.md).

## Table of Contents

- [Component Conventions](#component-conventions)
    - [Component Order](#component-order)
    - [Component Memoization](#component-memoization)
    - [Component Responsibilities](#component-responsibilities)
    - [State Management Responsibilities](#state-management-responsibilities)
    - [Component Scope and Communication](#component-scope-and-communication)
    - [UI Component Responsibilities](#ui-component-responsibilities)
    - [Component Architecture Patterns](#component-architecture-patterns)
    - [Component Responsibilities Checklist](#component-responsibilities-checklist)
- [TanStack Query Patterns](#tanstack-query-patterns)
    - [Query Keys](#query-keys)
    - [useQuery Patterns](#usequery-patterns)
    - [useMutation Patterns](#usemutation-patterns)
    - [Error Handling](#error-handling)
    - [Loading States](#loading-states)
    - [Cache Invalidation](#cache-invalidation)
    - [Optimistic Updates](#optimistic-updates)
    - [Pagination and Infinite Queries](#pagination-and-infinite-queries)
- [API and Hook Patterns](#api-and-hook-patterns)
    - [When to Use Hooks vs Direct API Calls](#when-to-use-hooks-vs-direct-api-calls)
    - [API Layer Examples](#api-layer-examples)
    - [Hook with Business Logic Examples](#hook-with-business-logic-examples)
    - [Direct API Call Examples](#direct-api-call-examples)
- [Component Examples](#component-examples)
    - [Pure UI Components](#pure-ui-components)
    - [Layout Components](#layout-components)
- [Page Examples](#page-examples)
    - [Page with Route Handling](#page-with-route-handling)
    - [Page Orchestrating Features](#page-orchestrating-features)
    - [Page Store Examples](#page-store-examples)
- [Feature Examples](#feature-examples)
    - [Feature Modal Component](#feature-modal-component)
    - [Reusable Business Logic Hook](#reusable-business-logic-hook)
- [Store Examples](#store-examples)
    - [Store Configuration](#store-configuration)
    - [Slice Definition](#slice-definition)
    - [Cross-Slice Actions](#cross-slice-actions)
- [Core Layer Examples](#core-layer-examples)
    - [API Client](#api-client)
    - [Auth Hook](#auth-hook)
    - [Auth Context](#auth-context)
    - [Auth Guard](#auth-guard)
- [App Layer Examples](#app-layer-examples)
    - [Configuration Files](#configuration-files)
    - [Constants](#constants)
    - [Enums](#enums)
    - [Utility Functions](#utility-functions)

---

## Component Conventions

### Component Order

#### Quick Reference Checklist

1. **Imports** (including `memo` from 'react')
2. **Types/Interfaces**
3. **Component Definition**
4. **Hooks**
5. **Event handlers**
6. **Early returns**
7. **Main render** (always last)
8. **Export** (wrapped with `memo`)

#### Example

```typescript
// 1. IMPORTS
import { memo, useState } from 'react';
import { useCustomHook } from '@/hooks/useCustomHook';

// 2. TYPES/INTERFACES
interface MyComponentProps {
    title: string;
    onAction?: () => void;
}

// 3. COMPONENT DEFINITION
function MyComponent({ title, onAction }: MyComponentProps) {
    // 4. HOOKS
    const [loading, setLoading] = useState(false);
    const { data, error } = useCustomHook();

    // 5. EVENT HANDLERS
    const handleSubmit = () => {
        setLoading(true);
        onAction?.();
    };

    // 6. EARLY RETURNS
    if (error) return <div>Error occurred</div>;
    if (loading) return <div>Loading...</div>;

    // 7. MAIN RENDER
    return (
        <div>
            <h1>{title}</h1>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}

// 8. EXPORT (wrapped with memo)
export default memo(MyComponent);
```

### Component Memoization

All components should be wrapped with React's `memo` to optimize re-renders. This prevents unnecessary re-renders when parent components update but the component's props haven't changed.

**Convention:**

- **Always wrap components with `memo`** when exporting
- Import `memo` from 'react'
- Use default export: `export default memo(ComponentName)`

#### Example

```typescript
import { memo } from 'react';

interface UserCardProps {
    user: IUser;
    onEdit?: (user: IUser) => void;
    isLoading?: boolean;
}

function UserCard({ user, onEdit, isLoading }: UserCardProps) {
    return (
        <div>
            <h2>{user.name}</h2>
            <button onClick={() => onEdit?.(user)}>Edit</button>
        </div>
    );
}

export default memo(UserCard);
```

#### Custom Comparison

By default, `memo` does a shallow comparison of props. If you need custom comparison logic, provide a comparison function as the second argument:

```typescript
// Custom comparison function (rarely needed)
export default memo(UserCard, (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    // Return false if props are different (re-render)
    return prevProps.user.id === nextProps.user.id && prevProps.isLoading === nextProps.isLoading;
});
```

#### Best Practices

- ✅ **Always use `memo`** for exported components
- ✅ Use default export with `memo` wrapper
- ✅ Ensure props are stable (use `useCallback` and `useMemo` in parent components)
- ❌ Don't use `memo` for components that receive frequently changing props
- ❌ Don't use `memo` if it adds unnecessary complexity

#### Notes

- `memo` only prevents re-renders when props are unchanged
- Parent component re-renders will still cause child re-renders if props change
- Use `useCallback` and `useMemo` in parent components to stabilize props passed to memoized children

### Component Responsibilities

Well-designed components follow clear responsibility boundaries that promote **cohesion** (related functionality grouped together) and **loose coupling** (minimal dependencies between components).

#### Core Principles

1. **Single Responsibility Principle**: Each component should have one clear purpose and do it well.
2. **Encapsulation**: Components should manage their own concerns without exposing internal implementation details.
3. **Predictable Data Flow**: Data should flow down through props, and events should bubble up through callbacks.

### State Management Responsibilities

#### ✅ What Components Should Do

##### Own Their Internal State

```javascript
function UserProfile({ user }) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div>
            {isEditing ? <EditForm /> : <DisplayInfo />}
            <button onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel' : 'Edit'}</button>
        </div>
    );
}
```

##### Use Global State (Read-Only)

```javascript
function Header() {
    const { user, theme } = useGlobalState();
    return <header className={`header ${theme}`}>Welcome, {user.name}</header>;
}
```

##### Request State Changes via Callbacks

```javascript
function TaskItem({ task, onStatusChange, onDelete }) {
    return (
        <div>
            <span>{task.title}</span>
            <button onClick={() => onStatusChange(task.id, !task.completed)}>
                {task.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
    );
}
```

#### ❌ What Components Should Avoid

##### Don't Mutate Props

```javascript
// ❌ Bad: Mutating props
function BadComponent({ items }) {
    items.push(newItem); // Don't do this!
    return <div>{items.length}</div>;
}

// ✅ Good: Use callbacks
function GoodComponent({ items, onAddItem }) {
    return (
        <div>
            {items.length}
            <button onClick={() => onAddItem(newItem)}>Add Item</button>
        </div>
    );
}
```

##### Don't Directly Modify Other Components' State

```javascript
// ❌ Bad: Direct component manipulation
function BadSidebar({ mainContentRef }) {
    const handleToggle = () => {
        mainContentRef.current.setState({ collapsed: true }); // Don't do this!
    };
}

// ✅ Good: Use callbacks
function GoodSidebar({ onToggle }) {
    return <button onClick={onToggle}>Toggle Main Content</button>;
}
```

##### Don't Promote Local State Unnecessarily

```javascript
// ❌ Bad: Unnecessary global state
const globalState = {
    isModalOpen: false, // Should be local
    selectedTab: 0, // Should be local
};

// ✅ Good: Keep state local
function Modal() {
    const [isOpen, setIsOpen] = useState(false);
    return isOpen ? <div>Modal Content</div> : null;
}
```

### Component Scope and Communication

#### ✅ Proper Scope Management

##### Direct Child Communication

```javascript
function Dashboard() {
    const [selectedTab, setSelectedTab] = useState('overview');

    return (
        <div>
            <TabNavigation activeTab={selectedTab} onTabChange={setSelectedTab} />
            <TabContent tab={selectedTab} />
        </div>
    );
}
```

##### Event-Based Parent Communication

```javascript
function TodoList({ onListChange }) {
    const [todos, setTodos] = useState([]);

    const handleAddTodo = newTodo => {
        const updatedTodos = [...todos, newTodo];
        setTodos(updatedTodos);
        onListChange(updatedTodos);
    };

    return (
        <div>
            <AddTodoForm onAdd={handleAddTodo} />
            {todos.map(todo => (
                <TodoItem key={todo.id} todo={todo} />
            ))}
        </div>
    );
}
```

#### ❌ Scope Violations to Avoid

##### Deep Child Manipulation

```javascript
// ❌ Bad: Deep component manipulation
function BadGrandparent() {
    const grandchildRef = useRef();

    const handleAction = () => {
        grandchildRef.current.someMethod(); // Don't do this!
    };

    return (
        <Parent>
            <Child>
                <Grandchild ref={grandchildRef} />
            </Child>
        </Parent>
    );
}

// ✅ Good: Use props
function GoodGrandparent() {
    const [keyword, setKeyword] = useState('');

    return (
        <Parent>
            <Child>
                <Grandchild keyword={keyword} onUpdate={setKeyword} />
            </Child>
        </Parent>
    );
}
```

### UI Component Responsibilities

#### ✅ Pure UI Components

##### Focus on Presentation

```javascript
// ✅ Pure UI component
function Button({ variant = 'primary', disabled, children, onClick }) {
    return (
        <button className={`btn btn-${variant}`} disabled={disabled} onClick={onClick}>
            {children}
        </button>
    );
}

// Usage with business logic in parent
function OrderForm() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        await submitOrder();
        setLoading(false);
    };

    return (
        <form>
            <Button variant='primary' disabled={loading} onClick={handleSubmit}>
                {loading ? 'Processing...' : 'Submit Order'}
            </Button>
        </form>
    );
}
```

#### ❌ UI Components to Avoid

##### Business Logic in UI

```javascript
// ❌ Bad: UI component with business logic
function BadProductCard({ product }) {
    const handleAddToCart = async () => {
        // Business logic doesn't belong in UI components
        const user = await getCurrentUser();
        await addToCart(product.id);
        await updateInventory(product.id, -1);
    };

    return (
        <div className='product-card'>
            <h3>{product.name}</h3>
            <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
    );
}
```

### Component Architecture Patterns

#### Composition Over Inheritance

```javascript
// ✅ Good: Composition pattern
function Card({ children, variant = 'default' }) {
    return <div className={`card card-${variant}`}>{children}</div>;
}

function CardHeader({ children }) {
    return <div className='card-header'>{children}</div>;
}

function CardBody({ children }) {
    return <div className='card-body'>{children}</div>;
}

// Usage
function ProfileCard({ user }) {
    return (
        <Card variant='profile'>
            <CardHeader>
                <h2>{user.name}</h2>
            </CardHeader>
            <CardBody>
                <img src={user.avatar} alt={user.name} />
                <p>{user.bio}</p>
                <button>Edit Profile</button>
            </CardBody>
        </Card>
    );
}
```

### Component Responsibilities Checklist

#### ✅ Good Component Responsibilities

- [ ] Has a single, clear purpose
- [ ] Manages only its own internal state
- [ ] Communicates with parent via callbacks
- [ ] Controls only immediate children
- [ ] Makes API calls relevant to its purpose
- [ ] Avoids side effects that affect other components
- [ ] UI components focus only on presentation
- [ ] Wrapped with `memo` for performance optimization

#### ❌ Avoid These Anti-Patterns

- [ ] Mutating props or external state
- [ ] Reaching deep into component tree when a props approach can be used instead
- [ ] Making API calls with global side effects
- [ ] Mixing business logic with UI components
- [ ] Promoting local state unnecessarily
- [ ] Tight coupling between unrelated components
- [ ] Forgetting to wrap components with `memo`

---

## TanStack Query Patterns

All API calls **MUST** use TanStack Query hooks (`useQuery` or `useMutation`). Never make direct API calls in components or pages.

### Query Keys

Query keys are hierarchical arrays that uniquely identify cached data. Always use `as const` for type safety.

#### Conventions

```typescript
// Single entity
const QUERY_KEY = ['user', 'profile'] as const;

// List/collection
const QUERY_KEY_LIST = ['accounts', 'list'] as const;

// Detail with parameter
const QUERY_KEY_DETAIL = (id: string) => ['account', 'detail', id] as const;

// With filters
const QUERY_KEY_FILTERED = (filters: AccountFilters) => ['accounts', 'list', filters] as const;
```

#### Best Practices

- ✅ Use hierarchical structure: `['entity', 'action', ...params]`
- ✅ Always use `as const` for type safety
- ✅ Keep query keys in a centralized location or near the API
- ✅ Use functions for dynamic keys with parameters
- ❌ Don't use random or non-deterministic values in keys
- ❌ Don't include unnecessary data in keys

### useQuery Patterns

Use `useQuery` for GET requests (fetching data).

#### Basic Query

```typescript
// In component or page - direct usage without hook wrapper
const AccountsPage = () => {
    const { data: accounts, isLoading, error } = useQuery({
        queryKey: ['accounts', 'list'],
        queryFn: () => accountApi.list(),
    });

    if (isLoading) return <Spinner />;
    if (error) return <ErrorMessage error={error} />;

    return <AccountList accounts={accounts} />;
};
```

#### Query with Parameters

```typescript
const AccountDetailPage = () => {
    const { id } = useParams<{ id: string }>();

    const { data: account, isLoading } = useQuery({
        queryKey: ['account', 'detail', id],
        queryFn: () => accountApi.getById(id!),
        enabled: !!id, // Only fetch when id exists
    });

    return (/*...*/);
};
```

#### Conditional Query

```typescript
const UserProfile = () => {
    const token = useAppSelector(state => state.auth.accessToken);

    const { data: user } = useQuery({
        queryKey: ['user', 'profile'],
        queryFn: () => userApi.getProfile(),
        enabled: !!token, // Only fetch when authenticated
        retry: false, // Don't retry on auth errors
        staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
    });

    return (/*...*/);
};
```

#### Query with Select (Data Transformation)

```typescript
const { data: accountNames } = useQuery({
    queryKey: ['accounts', 'list'],
    queryFn: () => accountApi.list(),
    select: data => data.map(account => account.name), // Transform data
});
```

### useMutation Patterns

Use `useMutation` for POST, PUT, PATCH, DELETE requests (modifying data).

#### Basic Mutation

```typescript
const CreateAccountForm = () => {
    const createAccount = useMutation({
        mutationFn: (data: CreateAccountRM) => accountApi.create(data),
    });

    const handleSubmit = (values: CreateAccountRM) => {
        createAccount.mutate(values, {
            onSuccess: () => {
                toast.success('Account created!');
            },
            onError: (error) => {
                toast.error('Failed to create account');
            },
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* form fields */}
            <Button type="submit" disabled={createAccount.isPending}>
                {createAccount.isPending ? 'Creating...' : 'Create'}
            </Button>
        </form>
    );
};
```

#### Mutation with Cache Invalidation

```typescript
const DeleteAccountButton = ({ accountId }: { accountId: string }) => {
    const queryClient = useQueryClient();

    const deleteAccount = useMutation({
        mutationFn: () => accountApi.delete(accountId),
        onSuccess: () => {
            // Invalidate accounts list to refetch
            queryClient.invalidateQueries({ queryKey: ['accounts', 'list'] });
            toast.success('Account deleted!');
        },
    });

    return (
        <Button
            variant="danger"
            onClick={() => deleteAccount.mutate()}
            disabled={deleteAccount.isPending}
        >
            Delete
        </Button>
    );
};
```

#### Mutation Hook with Business Logic

When mutations have additional business logic, wrap them in a custom hook:

```typescript
// features/accounts/hooks/use-create-account.hook.ts
export function useCreateAccount() {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: CreateAccountRM) => accountApi.create(data),
        onSuccess: account => {
            // Business logic: Update Redux store
            dispatch(addAccount(account));
            // Business logic: Invalidate cache
            queryClient.invalidateQueries({ queryKey: ['accounts', 'list'] });
        },
    });

    return {
        create: mutation.mutate,
        createAsync: mutation.mutateAsync,
        isPending: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
}

// Usage in component
const CreateAccountModal = () => {
    const { create, isPending } = useCreateAccount();

    const handleSubmit = (values: CreateAccountRM) => {
        create(values, {
            onSuccess: () => {
                toast.success('Account created!');
                onClose();
            },
        });
    };
};
```

### Error Handling

#### Global Error Handler

```typescript
// main.tsx or app.tsx
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
        mutations: {
            onError: error => {
                // Global error handling
                if (error instanceof ApiError && error.status === 401) {
                    // Handle unauthorized
                    authService.logout();
                }
            },
        },
    },
});
```

#### Component-Level Error Handling

```typescript
const AccountsPage = () => {
    const { data, error, isError, refetch } = useQuery({
        queryKey: ['accounts', 'list'],
        queryFn: () => accountApi.list(),
    });

    if (isError) {
        return (
            <ErrorState
                message={error.message}
                onRetry={() => refetch()}
            />
        );
    }

    return (/*...*/);
};
```

#### Mutation Error Handling

```typescript
const updateAccount = useMutation({
    mutationFn: (data: UpdateAccountRM) => accountApi.update(data),
    onError: (error, variables, context) => {
        // Handle specific error types
        if (error instanceof ValidationError) {
            setFormErrors(error.fieldErrors);
        } else {
            toast.error('Failed to update account');
        }
    },
});
```

### Loading States

#### Query Loading States

```typescript
const AccountsPage = () => {
    const { data, isLoading, isFetching, isRefetching } = useQuery({
        queryKey: ['accounts', 'list'],
        queryFn: () => accountApi.list(),
    });

    // Initial loading (no cached data)
    if (isLoading) {
        return <AccountListSkeleton />;
    }

    return (
        <div>
            {/* Show subtle indicator when refetching in background */}
            {isFetching && <RefetchIndicator />}
            <AccountList accounts={data} />
        </div>
    );
};
```

#### Mutation Loading States

```typescript
const SaveButton = () => {
    const { mutate, isPending } = useMutation({
        mutationFn: (data) => accountApi.update(data),
    });

    return (
        <Button disabled={isPending} onClick={() => mutate(formData)}>
            {isPending ? (
                <>
                    <Spinner size="sm" />
                    Saving...
                </>
            ) : (
                'Save'
            )}
        </Button>
    );
};
```

### Cache Invalidation

#### Invalidate Single Query

```typescript
queryClient.invalidateQueries({ queryKey: ['account', 'detail', accountId] });
```

#### Invalidate Multiple Queries

```typescript
// Invalidate all account-related queries
queryClient.invalidateQueries({ queryKey: ['accounts'] });

// Invalidate specific queries
queryClient.invalidateQueries({
    predicate: query => query.queryKey[0] === 'accounts' || query.queryKey[0] === 'dashboard',
});
```

#### Update Cache Directly

```typescript
const updateAccount = useMutation({
    mutationFn: (data: UpdateAccountRM) => accountApi.update(data),
    onSuccess: updatedAccount => {
        // Update the detail cache directly
        queryClient.setQueryData(['account', 'detail', updatedAccount.id], updatedAccount);

        // Update the list cache
        queryClient.setQueryData(['accounts', 'list'], (oldData: Account[] | undefined) => {
            if (!oldData) return oldData;
            return oldData.map(account => (account.id === updatedAccount.id ? updatedAccount : account));
        });
    },
});
```

### Optimistic Updates

```typescript
const toggleFavorite = useMutation({
    mutationFn: (accountId: string) => accountApi.toggleFavorite(accountId),

    // Optimistically update before the mutation
    onMutate: async accountId => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: ['accounts', 'list'] });

        // Snapshot previous value
        const previousAccounts = queryClient.getQueryData(['accounts', 'list']);

        // Optimistically update
        queryClient.setQueryData(['accounts', 'list'], (old: Account[] | undefined) => {
            if (!old) return old;
            return old.map(account =>
                account.id === accountId ? { ...account, isFavorite: !account.isFavorite } : account
            );
        });

        // Return context with snapshot
        return { previousAccounts };
    },

    // Rollback on error
    onError: (err, accountId, context) => {
        queryClient.setQueryData(['accounts', 'list'], context?.previousAccounts);
        toast.error('Failed to update favorite');
    },

    // Refetch after success or error
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['accounts', 'list'] });
    },
});
```

### Pagination and Infinite Queries

#### Basic Pagination

```typescript
const AccountsPage = () => {
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['accounts', 'list', { page, pageSize }],
        queryFn: () => accountApi.list({ page, pageSize }),
        placeholderData: keepPreviousData, // Keep showing old data while fetching new page
    });

    return (
        <div>
            <AccountList accounts={data?.items} />
            <Pagination
                currentPage={page}
                totalPages={data?.totalPages}
                onPageChange={setPage}
                isLoading={isFetching}
            />
        </div>
    );
};
```

#### Infinite Scroll

```typescript
const AccountsInfiniteList = () => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['accounts', 'infinite'],
        queryFn: ({ pageParam = 1 }) => accountApi.list({ page: pageParam, pageSize: 20 }),
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });

    const accounts = data?.pages.flatMap(page => page.items) ?? [];

    return (
        <div>
            <AccountList accounts={accounts} />
            {hasNextPage && (
                <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                >
                    {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                </Button>
            )}
        </div>
    );
};
```

### TanStack Query Best Practices Summary

| Practice       | ✅ Do                                               | ❌ Don't                               |
| -------------- | --------------------------------------------------- | -------------------------------------- |
| Query Keys     | Use hierarchical arrays with `as const`             | Use random or non-deterministic values |
| Data Fetching  | Use `useQuery` for GET requests                     | Make direct API calls in components    |
| Data Mutation  | Use `useMutation` for POST/PUT/DELETE               | Use `useQuery` for mutations           |
| Loading States | Show appropriate loading indicators                 | Block UI without feedback              |
| Error Handling | Handle errors gracefully with retry options         | Ignore errors or crash silently        |
| Cache          | Invalidate related queries after mutations          | Forget to update stale data            |
| Hooks          | Create custom hooks only when business logic exists | Wrap every API call in a hook          |

---

## API and Hook Patterns

### When to Use Hooks vs Direct API Calls

| Scenario                                    | Use Hook?                           |
| ------------------------------------------- | ----------------------------------- |
| API call + Redux dispatch                   | ✅ Yes                              |
| API call + cache invalidation               | ✅ Yes                              |
| API call + data transformation              | ✅ Yes                              |
| API call + side effects (toast, navigation) | ✅ Yes                              |
| API call + complex error handling           | ✅ Yes                              |
| Simple API call only                        | ❌ No - use TanStack Query directly |

### API Layer Examples

```typescript
// features/accounts/apis/account.api.ts
export const accountApi = {
    create: async (data: CreateAccountRequestModel) => {
        const response = await apiClient.post('/accounts', data);
        return response.data;
    },
    list: async () => {
        const response = await apiClient.get('/accounts');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await apiClient.get(`/accounts/${id}`);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await apiClient.delete(`/accounts/${id}`);
        return response.data;
    },
};
```

### Hook with Business Logic Examples

```typescript
// ✅ Good: Hook WITH additional business logic (Redux dispatch + cache invalidation)
// features/accounts/hooks/use-create-account.hook.ts
export const useCreateAccount = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateAccountRequestModel) => accountApi.create(data),
        onSuccess: account => {
            dispatch(addAccount(account)); // Business logic: Redux dispatch
            queryClient.invalidateQueries({ queryKey: ['accounts', 'list'] }); // Business logic: Cache invalidation
        },
    });
};
```

### Direct API Call Examples

```typescript
// ✅ Good: Direct API call WITHOUT hook (no additional business logic)
// In component or page
const AccountsPage = () => {
    // Simple query without extra business logic - no hook needed
    const { data: accounts, isLoading } = useQuery({
        queryKey: ['accounts', 'list'],
        queryFn: () => accountApi.list(),
    });

    // Simple mutation without extra business logic - no hook needed
    const deleteAccount = useMutation({
        mutationFn: (id: string) => accountApi.delete(id),
    });

    return (/*...*/);
};

// ❌ Bad: Unnecessary hook wrapper for simple API call
// features/accounts/hooks/use-list-accounts.hook.ts
export const useListAccounts = () => {
    // This hook adds no value - it just wraps the API call
    return useQuery({
        queryKey: ['accounts', 'list'],
        queryFn: () => accountApi.list(),
    });
};
```

---

## Component Examples

### Pure UI Components

```typescript
// components/button/button.tsx
import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/app/utils/tailwind.utils';
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
            className={cn(styles.button, styles[variant], styles[size], className)}
            {...props}
        >
            {children}
        </button>
    );
};
```

### Layout Components

```typescript
// layouts/page-layout.tsx
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
    headerActions,
}: PageLayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header title={title} actions={headerActions} />

            <div className="flex flex-1">
                {showSidebar && <Sidebar />}

                <main className="flex-1 p-6">{children}</main>
            </div>

            <Footer />
        </div>
    );
};

// layouts/auth-layout.tsx
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

---

## Page Examples

### Page with Route Handling

```typescript
// ✅ Good: Page with page-specific business logic
// pages/timeline/timeline-page.tsx
export const TimelinePage = () => {
    // Page-specific state management
    const [selectedPeriodId, setSelectedPeriodId] = useState(null);

    // Page-specific route handling
    const { periodId } = useParams();
    useEffect(() => {
        if (periodId) {
            setSelectedPeriodId(periodId);
        }
    }, [periodId]);

    // Page-specific logic for URL synchronization
    const handlePeriodChange = (id: string) => {
        setSelectedPeriodId(id);
        navigate(`/timeline/${id}`);
    };

    return (
        <PageLayout>
            <TimelinePeriodList
                selectedPeriodId={selectedPeriodId}
                onPeriodChange={handlePeriodChange}
            />
        </PageLayout>
    );
};
```

### Page Orchestrating Features

```typescript
// ✅ Good: Page that orchestrates features
// pages/accounts/accounts-page.tsx
export const AccountsPage = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { hasPermission } = useAuth();

    return (
        <PageLayout title="Accounts">
            <div className="page-header">
                <h1>Accounts Management</h1>
                {hasPermission('accounts.create') && (
                    <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
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

// ❌ Bad: Reusable business logic in pages (should be in features)
export const AccountsPage = () => {
    // This reusable logic should be in features/accounts/
    const handleCreateAccount = async data => {
        await api.post('/accounts', data);
        // Reusable logic that other pages might need
    };

    return (/*...*/);
};
```

### Page Store Examples

```typescript
// pages/timeline/store/timeline.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ITimelineState {
    selectedPeriodId: string | null;
    filters: {
        dateRange: { start: string; end: string } | null;
        category: string | null;
    };
}

const timelineSlice = createSlice({
    name: 'timeline',
    initialState: {
        selectedPeriodId: null,
        filters: { dateRange: null, category: null },
    } as ITimelineState,
    reducers: {
        setSelectedPeriod: (state, action: PayloadAction<string>) => {
            state.selectedPeriodId = action.payload;
        },
        setFilters: (state, action: PayloadAction<ITimelineState['filters']>) => {
            state.filters = action.payload;
        },
    },
});

export const { setSelectedPeriod, setFilters } = timelineSlice.actions;
export default timelineSlice.reducer;
```

---

## Feature Examples

### Feature Modal Component

```typescript
// features/accounts/account-create/create-account-modal.tsx
import { useState } from 'react';
import { Modal } from '@/components/modal';
import { useCreateAccount } from './use-create-account';
import { CreateAccountForm } from './create-account-form';

export const CreateAccountModal = ({ isOpen, onClose }) => {
    const { create, isLoading } = useCreateAccount();

    const handleSubmit = async data => {
        await create(data);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Account">
            <CreateAccountForm onSubmit={handleSubmit} isLoading={isLoading} />
        </Modal>
    );
};
```

### Reusable Business Logic Hook

```typescript
// features/accounts/account-create/use-create-account.ts
// Reusable business logic that can be used across multiple pages
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { accountApi } from '../apis';
import { addAccount } from '@/store/accounts';

export const useCreateAccount = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: data => accountApi.create(data),
        onSuccess: account => {
            dispatch(addAccount(account));
            queryClient.invalidateQueries({ queryKey: ['accounts', 'list'] });
        },
    });

    return {
        create: mutation.mutate,
        isLoading: mutation.isPending,
        error: mutation.error,
    };
};
```

---

## Store Examples

### Store Configuration

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/auth.slice';
import userReducer from './user/user.slice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Slice Definition

```typescript
// ✅ Good: Pure reducer with no side effects
// store/auth/auth.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IAuthState {
    accessToken: string | null;
}

const authSlice = createSlice({
    name: 'auth',
    initialState: { accessToken: null } as IAuthState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        clearToken: state => {
            state.accessToken = null;
        },
    },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;

// ❌ Bad: API calls in store
reducers: {
    fetchUser: (state) => {
        api.get('/user').then(/*...*/); // ❌ No API calls in store
    },
}

// ❌ Bad: Direct state mutation (without Immer)
reducers: {
    updateUser: (state, action) => {
        state.user.name = action.payload.name; // ❌ Be careful with nested updates
    },
}
```

### Cross-Slice Actions

```typescript
// ✅ Good: Unidirectional cross-slice dispatch
// store/auth/auth.slice.ts
import { clearUser } from '../user/user.slice';

export const logout = () => {
    return (dispatch: AppDispatch) => {
        dispatch(clearToken());
        dispatch(clearUser()); // ✅ Can dispatch to other slice
    };
};

// ✅ Good: Using typed hooks
import { useAppSelector } from '@/core/hooks';
import { RootState } from '@/store';

const user = useAppSelector((state: RootState) => state.user.user);
```

---

## Core Layer Examples

### API Client

```typescript
// core/apis/client.api.ts
import { tokenManagerUtils } from '@/app/utils';

export interface IApiResponse<T = unknown> {
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

### Auth Hook

```typescript
// core/hooks/use-auth.ts
import { useState, useEffect } from 'react';
import { apiClient } from '../apis';
import { IUser } from '@/features/user/models';

export const useAuth = () => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);

    const login = async (credentials: LoginCredentials) => {
        const response = await apiClient.post('/auth/login', credentials);
        setUser(response.data.user);
    };

    return { user, login, loading };
};
```

### Auth Context

```typescript
// core/contexts/auth-context.tsx
import { createContext, ReactNode } from 'react';
import { useAuth } from '../hooks';
import { IUser } from '@/features/user/models';

interface IAuthContext {
    user: IUser | null;
    login: (credentials: LoginCredentials) => Promise<void>;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const auth = useAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
```

### Auth Guard

```typescript
// core/guards/auth-guard.tsx
import { useContext, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts';
import { ROUTES } from '@/app/configs';

export const AuthGuard = ({ children }: { children: ReactNode }) => {
    const auth = useContext(AuthContext);

    if (!auth?.user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <>{children}</>;
};
```

---

## App Layer Examples

### Configuration Files

```typescript
// app/configs/app.config.ts
export const appConfig = {
    appName: 'Admin Dashboard',
    version: '1.0.0',
    environment: import.meta.env.MODE,
    features: {
        enableNewAccountFlow: true,
        enableSubscriptions: true,
    },
};

// app/configs/api.config.ts
export const apiConfig = {
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
};

// app/configs/routes.config.ts
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

### Constants

```typescript
// app/constants/api-endpoints.constant.ts
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
    },
    ACCOUNTS: {
        LIST: '/accounts',
        CREATE: '/accounts',
    },
} as const;
```

### Enums

```typescript
// app/enums/account-status.enum.ts
export enum AccountStatusEnum {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
}
```

### Utility Functions

```typescript
// app/utils/tailwind.utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// app/utils/navigation.utils.ts
import type { NavigateFunction } from 'react-router-dom';

class NavigationUtils {
    private navigateFn!: NavigateFunction;

    initialize(navigate: NavigateFunction) {
        this.navigateFn = navigate;
    }

    navigate(to: string, options?: { replace?: boolean; state?: unknown }) {
        this.navigateFn(to, options);
    }
}

export const navigationUtils = new NavigationUtils();
```
