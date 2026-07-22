import { useMutation } from '@tanstack/react-query';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { oauthApi, OAuthProviderType } from '@/apis';
import { ROUTES } from '@/app/constants';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { setAuth, setOauthReturnUrl } from '@/store/auth';
import Spinner from '@/uis/spinner';

function OAuthCallback() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const oauthReturnUrl = useAppSelector(state => state.auth.oauthReturnUrl);
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
            toast.success(t('auth.loginSuccess'));
            if (oauthReturnUrl) {
                dispatch(setOauthReturnUrl(null));
                navigate(decodeURIComponent(oauthReturnUrl), { replace: true });
            } else {
                navigate(`/${ROUTES.SETTINGS.PROFILE}`);
            }
        }
    }, [oauthCallbackMutation.isSuccess, oauthReturnUrl, dispatch, navigate]);

    return (
        <div className='flex flex-col items-center justify-center gap-4 h-36'>
            <Spinner size='lg' />
            <p className='text-sm text-muted-foreground'>{t('auth.completingAuthentication')}</p>
        </div>
    );
}

export default memo(OAuthCallback);
