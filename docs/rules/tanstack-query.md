# TanStack Query

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

#### Use the Mutation Object Directly

**Rule: Do not destructure the mutation return value into extra variables.** Use the mutation object directly (e.g. `mutation.mutate`, `mutation.isPending`) so that call sites and dependency arrays stay clear and you avoid referential-stability issues.

```typescript
// ❌ Bad: Extracting mutation into separate variables
const deleteFoodMutation = useMutation({ ... });
const { mutate: deleteFood, isPending: isDeleting } = deleteFoodMutation;
// ...
deleteFood(id);
disabled={isDeleting}

// ✅ Good: Use the mutation object directly
const deleteFoodMutation = useMutation({ ... });
// ...
deleteFoodMutation.mutate(id);
disabled={deleteFoodMutation.isPending}
```

**What to avoid:**

- ❌ `const { mutate: someAction, isPending: isDoing } = someMutation;`
- ❌ Passing the whole mutation object into `useCallback`/`useEffect` dependency arrays (use destructured stable values only when a dependency is required)

**What to do instead:**

- ✅ Call `someMutation.mutate(...)` and use `someMutation.isPending` (and other properties) directly in JSX and handlers.

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

When mutations have additional business logic that needs to be reused, wrap them in a custom hook:

```typescript
// core/hooks/use-create-account.hook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountApi, CreateAccountRequestModel } from '@/apis';
import { useAppDispatch } from './use-redux.hook';
import { addAccount } from '@/store/accounts/accounts.slice';

export function useCreateAccount() {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: CreateAccountRequestModel) => accountApi.create(data),
        onSuccess: account => {
            dispatch(addAccount(account));
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

    const handleSubmit = (values: CreateAccountRequestModel) => {
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

API errors are automatically handled by the global error interceptor in the API client (`apis/client.ts`). The interceptor shows error toasts for all API errors (except 401 Unauthorized which is handled separately for authentication flows).

**Rule: Do NOT show error toasts in components for API errors.**

Since API errors are handled globally, components should not duplicate error toast notifications in `onError` handlers. The global handler will automatically display appropriate error messages based on the HTTP status code.

```typescript
// ✅ Good: Global error handler in apis/client.ts
// Automatically shows error toasts for API errors
apiClient.addResponseInterceptor(async (response: Response) => {
    if (!response.ok) {
        // Shows toast.error with appropriate message based on status code
        toast.error(errorTitle, { description: errorDescription });
    }
    return response;
});
```

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

When a query fails (`isError` from `useQuery`), show a dedicated error UI instead of rendering broken or empty content. Use the **ErrorState** component from `@/components/error-state` and follow the patterns in [Showing Error State UI](#showing-error-state-ui) (Component Conventions).

#### Mutation Error Handling

**Rule: Do NOT show error toasts in mutation `onError` handlers for API errors.**

API errors are automatically handled by the global error interceptor. Only use `onError` for:

- Component-specific error handling (e.g., setting form errors)
- Business logic that needs to run on error (e.g., resetting form state)
- Non-API errors (e.g., validation errors before API call)

```typescript
// ❌ Bad: Showing error toast for API errors (duplicates global handler)
const updateAccount = useMutation({
    mutationFn: (data: UpdateAccountRM) => accountApi.update(data),
    onError: () => {
        toast.error('Failed to update account'); // ❌ Don't do this!
    },
});

// ✅ Good: Only handle component-specific errors
const updateAccount = useMutation({
    mutationFn: (data: UpdateAccountRM) => accountApi.update(data),
    onError: (error, variables, context) => {
        // Handle specific error types for component logic
        if (error instanceof ValidationError) {
            setFormErrors(error.fieldErrors); // ✅ Component-specific handling
        }
        // No toast.error here - global handler will show it
    },
});

// ✅ Good: No onError needed if only success handling is required
const deleteAccount = useMutation({
    mutationFn: (id: string) => accountApi.delete(id),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['accounts', 'list'] });
        toast.success('Account deleted successfully');
    },
    // No onError - global handler will show error toast automatically
});
```

**When to Use `onError` in Mutations:**

- ✅ Setting form validation errors
- ✅ Resetting component state on error
- ✅ Handling business logic specific to the component
- ✅ Handling non-API errors (client-side validation, etc.)

**When NOT to Use `onError` in Mutations:**

- ❌ Showing error toasts (handled globally)
- ❌ Logging errors (can be done globally)
- ❌ Generic error handling (handled globally)

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
