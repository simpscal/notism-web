import { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { ROUTES } from '@/app/configs';
import Spinner from '@/components/spinner';
import { useAppDispatch } from '@/core/hooks';
import { oauthApi, OAuthProviderType } from '@/features/oauth';
import { setAuth } from '@/store/auth/auth.slice';

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
                dispatch(setAuth(data.token, data.user));
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
