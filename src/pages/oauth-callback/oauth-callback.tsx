import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { ROUTES } from '@/app/configs';
import Spinner from '@/components/ui/spinner';
import { useAppDispatch } from '@/core/hooks';
import { authService } from '@/features/auth/services';
import { oauthApi, OAuthProviderType } from '@/features/oauth';

function OAuthCallback() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const params = useParams<{ provider: OAuthProviderType }>();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const provider = params.provider!;
        const code = searchParams.get('code')!;
        const state = searchParams.get('state');

        oauthApi
            .handleOAuthCallback(provider, { code, state: state || undefined })
            .then(data => {
                authService.authenticate(dispatch, data.token, data.user);
            })
            .then(() => {
                toast.success('Login successful! Welcome back.');
                navigate(`/${ROUTES.profile}`);
            });
    }, [params.provider, searchParams, navigate, dispatch]);

    return (
        <div className='flex flex-col items-center justify-center gap-4 h-36'>
            <Spinner size='lg' />
            <p className='text-sm text-muted-foreground'>Completing authentication...</p>
        </div>
    );
}

export default OAuthCallback;
