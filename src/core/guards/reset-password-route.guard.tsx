import { Navigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { ROUTES } from '@/app/configs';

interface ResetPasswordRouteGuardProps {
    children: React.ReactNode;
}

export const ResetPasswordRouteGuard = ({ children }: ResetPasswordRouteGuardProps) => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    if (!token) {
        toast.error('Invalid Link', {
            description: 'The reset password link is invalid or missing token.',
        });

        return <Navigate to={`/${ROUTES.logIn}`} replace />;
    }

    return <>{children}</>;
};
