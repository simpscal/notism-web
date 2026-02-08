import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';

import { useAppSelector } from '../hooks';

import NotFoundPage from '@/pages/not-found';

interface AuthRouteGuardProps {
    mode?: 'authenticated' | 'anonymous';
}

export function AuthRouteGuard({ mode = 'anonymous' }: AuthRouteGuardProps = {}) {
    const user = useAppSelector(state => state.user.user);

    // Use snapshot to get current state synchronously, avoiding subscription-based re-renders
    const userSnapshot = useMemo(() => user, []);

    if (mode === 'anonymous') {
        if (userSnapshot) {
            return <NotFoundPage />;
        }

        return <Outlet />;
    }

    if (!userSnapshot) {
        return <NotFoundPage />;
    }

    return <Outlet />;
}
