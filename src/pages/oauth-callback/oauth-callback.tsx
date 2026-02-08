import { useMutation } from '@tanstack/react-query';
import { memo, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { oauthApi, OAuthProviderType } from '@/apis';
import { ROUTES } from '@/app/constants';
import { TOKEN_KEYS } from '@/app/constants/token-keys.constant';
import Spinner from '@/components/spinner';
import { useAppDispatch } from '@/core/hooks';
import { setAuth } from '@/store/auth';

function OAuthCallback() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const params = useParams<{ provider: OAuthProviderType }>();
    const [searchParams] = useSearchParams();

    const oauthCallbackMutation = useMutation({
        mutationFn: ({ provider, data }: { provider: OAuthProviderType; data: { code: string; state?: string } }) =>
            oauthApi.handleOAuthCallback(provider, data),
        onSuccess: data => {
            dispatch(setAuth({ token: data.token, user: data.user })).unwrap();
        },
    });

    useEffect(() => {
        const provider = params.provider!;
        const code = searchParams.get('code')!;
        const state = searchParams.get('state');

        oauthCallbackMutation.mutate({
            provider,
            data: { code, state: state || undefined },
        });
    }, [params.provider, searchParams]);

    useEffect(() => {
        if (oauthCallbackMutation.isSuccess) {
            toast.success('Login successful! Welcome back.');
            const returnUrl = localStorage.getItem(TOKEN_KEYS.OAUTH_RETURN_URL);
            if (returnUrl) {
                localStorage.removeItem(TOKEN_KEYS.OAUTH_RETURN_URL);
                navigate(decodeURIComponent(returnUrl), { replace: true });
            } else {
                navigate(`/${ROUTES.SETTINGS.PROFILE}`);
            }
        }
    }, [oauthCallbackMutation.isSuccess, navigate]);

    return (
        <div className='flex flex-col items-center justify-center gap-4 h-36'>
            <Spinner size='lg' />
            <p className='text-sm text-muted-foreground'>Completing authentication...</p>
        </div>
    );
}

export default memo(OAuthCallback);
