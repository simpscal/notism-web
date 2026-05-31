# Pages and Features

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

Features contain shared business logic, components, and ViewModels that are reused across pages.

### Feature Component with Direct API Usage

```typescript
// features/accounts/components/create-account-modal.tsx
import { memo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '@/components/modal';
import { accountApi, CreateAccountRequestModel } from '@/apis';
import { CreateAccountForm } from './create-account-form';

interface CreateAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function CreateAccountModal({ isOpen, onClose }: CreateAccountModalProps) {
    const queryClient = useQueryClient();

    const { mutate: create, isPending } = useMutation({
        mutationFn: (data: CreateAccountRequestModel) => accountApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts', 'list'] });
            onClose();
        },
    });

    const handleSubmit = (data: CreateAccountRequestModel) => {
        create(data);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Account">
            <CreateAccountForm onSubmit={handleSubmit} isLoading={isPending} />
        </Modal>
    );
}

export default memo(CreateAccountModal);
```

### Feature UI Models

UI models represent data structures used in UI components, potentially transformed from API response models. They do not use a suffix.

```typescript
// features/user/models/user.model.ts
// UI model - can be identical to ResponseModel or transformed
export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
}

// If identical to ResponseModel, can also be a type alias:
// import { UserProfileResponseModel } from '@/apis';
// export type UserProfile = UserProfileResponseModel;
```

### Reusable Business Logic Hook

When business logic needs to be shared across multiple pages, create a hook in the feature folder:

```typescript
// features/accounts/hooks/use-create-account.hook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountApi, CreateAccountRequestModel } from '@/apis';
import { useAppDispatch } from '@/core/hooks';
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
        error: mutation.error,
    };
}
```

---
