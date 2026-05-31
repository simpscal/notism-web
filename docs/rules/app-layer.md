# App Layer

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
