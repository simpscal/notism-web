# Core Layer

## Core Layer Examples

### API Client

The API client is located in `apis/client.ts` (centralized with all APIs).

```typescript
// apis/client.ts
import { tokenManagerUtils } from '@/app/utils';

interface RequestConfig extends RequestInit {
    params?: Record<string, string>;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async get<T = any>(endpoint: string, options: RequestConfig = {}): Promise<T> {
        return this._request<T>(endpoint, { ...options, method: 'GET' });
    }

    async post<T = any, D = any>(endpoint: string, data?: D, options: RequestConfig = {}): Promise<T> {
        return this._request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T = any, D = any>(endpoint: string, data?: D, options: RequestConfig = {}): Promise<T> {
        return this._request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T = any>(endpoint: string, options: RequestConfig = {}): Promise<T> {
        return this._request<T>(endpoint, { ...options, method: 'DELETE' });
    }

    private async _request<T = any>(endpoint: string, options: RequestConfig): Promise<T> {
        const headers = {
            'Content-Type': 'application/json',
            ...this._getAuthHeaders(),
            ...options.headers,
        };

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    private _getAuthHeaders(): Record<string, string> {
        const token = tokenManagerUtils.getAccessToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
}

export const apiClient = new ApiClient(import.meta.env.VITE_API_URL);
```

### Hook-Adjacent Utility

```typescript
// core/hooks/lazy-with-preload.hook.ts
// Not a hook — a React.lazy wrapper consumed by use-idle-preload.hook.ts. Lives in hooks/
// alongside the hook it backs, keeping the .hook.ts suffix without the use- prefix.
export function lazyWithPreload<T extends ComponentType<unknown>>(
    factory: () => Promise<{ default: T }>
): PreloadableComponent<T> { ... }
```

### Auth Hook

```typescript
// core/hooks/use-reload-user.hook.ts
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { authApi } from '@/apis';
import { useAppDispatch, useAppSelector } from './use-redux.hook';
import { setUser } from '@/store/user/user.slice';
import { tokenManagerUtils } from '@/app/utils';

const QUERY_KEY = ['user', 'reload'] as const;

export function useReloadUser() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.user);
    const hasValidToken = tokenManagerUtils.hasValidToken();

    const query = useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => authApi.reload(),
        enabled: Boolean(hasValidToken && !user),
        retry: false,
    });

    useEffect(() => {
        if (query.data) {
            dispatch(setUser(query.data));
        }
    }, [query.data, dispatch]);

    return {
        user,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
}
```

### Auth Context

```typescript
// core/contexts/auth-context.tsx
import { createContext, ReactNode, useMemo } from 'react';
import { UserProfile } from '@/features/user/models/user.model';
import { useAppSelector } from '../hooks';

interface IAuthContext {
    user: UserProfile | null;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const user = useAppSelector(state => state.user.user);

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: !!user,
        }),
        [user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
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
