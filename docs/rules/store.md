# Store

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
