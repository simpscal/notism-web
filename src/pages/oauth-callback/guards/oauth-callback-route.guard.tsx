import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { OAuthProviderType } from '@/apis';
import { ROUTES } from '@/app/constants';

interface OAuthCallbackRouteGuardProps {
    children: React.ReactNode;
}

export const OAuthCallbackRouteGuard = ({ children }: OAuthCallbackRouteGuardProps) => {
    const { provider } = useParams<{ provider: OAuthProviderType }>();
    const [searchParams] = useSearchParams();

    if (!provider) {
        toast.error('Invalid provider', {
            description: 'OAuth provider is missing.',
        });
        return <Navigate to={`/${ROUTES.AUTH.LOGIN}`} replace />;
    }

    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        toast.error('Authentication failed', {
            description: `An error occurred during ${provider} authentication. Please try again.`,
        });
        return <Navigate to={`/${ROUTES.AUTH.LOGIN}`} replace />;
    }

    if (!code) {
        toast.error('Invalid callback', {
            description: `No authorization code received from ${provider}.`,
        });
        return <Navigate to={`/${ROUTES.AUTH.LOGIN}`} replace />;
    }

    return <>{children}</>;
};
