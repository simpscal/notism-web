# API and Hooks

## API and Hook Patterns

APIs are centralized in `src/apis/` and should be called directly using TanStack Query (`useQuery`/`useMutation`) in components and pages. Only create custom hooks when there's additional business logic that needs to be reused.

### When to Use Hooks vs Direct API Calls

| Scenario                                     | Use Hook?                           | Location                             |
| -------------------------------------------- | ----------------------------------- | ------------------------------------ |
| API call + Redux dispatch                    | ✅ Yes                              | `core/hooks/` or `features/*/hooks/` |
| API call + cache invalidation (reusable)     | ✅ Yes                              | `core/hooks/` or `features/*/hooks/` |
| API call + data transformation (reusable)    | ✅ Yes                              | `core/hooks/` or `features/*/hooks/` |
| API call + complex error handling (reusable) | ✅ Yes                              | `core/hooks/` or `features/*/hooks/` |
| Simple API call only                         | ❌ No - use TanStack Query directly | Component/Page                       |
| API call with component-specific callbacks   | ❌ No - use TanStack Query directly | Component/Page                       |

### API Layer Examples

All APIs are centralized in `src/apis/` folder with models in `src/apis/models/`.

```typescript
// apis/account.api.ts
import { apiClient } from './client';
import { CreateAccountRequestModel, AccountResponseModel } from './models';

export const accountApi = {
    create: (data: CreateAccountRequestModel): Promise<AccountResponseModel> => apiClient.post('/accounts', data),

    list: (): Promise<AccountResponseModel[]> => apiClient.get('/accounts'),

    getById: (id: string): Promise<AccountResponseModel> => apiClient.get(`/accounts/${id}`),

    delete: (id: string): Promise<void> => apiClient.delete(`/accounts/${id}`),
};

// apis/models/account.model.ts
export interface AccountResponseModel {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

export interface CreateAccountRequestModel {
    name: string;
    email: string;
}
```

### Model Organization

Models are split between API layer and Feature layer:

| Model Type    | Location             | Naming Pattern          | Purpose                     |
| ------------- | -------------------- | ----------------------- | --------------------------- |
| ResponseModel | `apis/models/`       | `{Entity}ResponseModel` | API response data structure |
| RequestModel  | `apis/models/`       | `{Entity}RequestModel`  | API request data structure  |
| UI Model      | `features/*/models/` | `{Entity}` (no suffix)  | UI-specific data structure  |

```typescript
// ✅ Good: ResponseModel in apis/models/ (with suffix)
// apis/models/user.model.ts
export interface UserProfileResponseModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
}

// ✅ Good: UI Model in features/ (no suffix)
// features/user/models/user.model.ts
export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
}

// Alternative: Type alias if identical to ResponseModel
// import { UserProfileResponseModel } from '@/apis';
// export type UserProfile = UserProfileResponseModel;
```

### Hook with Business Logic Examples

When a mutation requires additional business logic (Redux dispatch, cache invalidation, data transformation), create a custom hook in `core/hooks/` or `features/{domain}/hooks/`.

```typescript
// ✅ Good: Hook WITH additional business logic (Redux dispatch + cache invalidation)
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
            dispatch(addAccount(account)); // Business logic: Redux dispatch
            queryClient.invalidateQueries({ queryKey: ['accounts', 'list'] }); // Business logic: Cache invalidation
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
```

### Direct API Call Examples

When there's no additional business logic, use TanStack Query directly in the component/page without creating a custom hook wrapper.

```typescript
// ✅ Good: Direct API call WITHOUT hook (no additional business logic)
// pages/accounts/accounts.tsx
import { useQuery, useMutation } from '@tanstack/react-query';
import { accountApi } from '@/apis';

const AccountsPage = () => {
    // Simple query without extra business logic - no hook needed
    const { data: accounts, isLoading } = useQuery({
        queryKey: ['accounts', 'list'],
        queryFn: () => accountApi.list(),
    });

    // Simple mutation without extra business logic - no hook needed; use mutation object directly
    const deleteAccountMutation = useMutation({
        mutationFn: (id: string) => accountApi.delete(id),
        onSuccess: () => {
            toast.success('Account deleted!');
        },
    });

    // Use deleteAccountMutation.mutate(...) and deleteAccountMutation.isPending in JSX/handlers
    return (/*...*/);
};

// ❌ Bad: Unnecessary hook wrapper for simple API call
// This hook adds no value - it just wraps the API call
export const useListAccounts = () => {
    return useQuery({
        queryKey: ['accounts', 'list'],
        queryFn: () => accountApi.list(),
    });
};
```

---
