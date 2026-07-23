import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { memo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { authApi, oauthApi, OAuthProviderType } from '@/apis';
import { ROUTES } from '@/app/constants';
import { UserRoleEnum } from '@/app/enums';
import { createPasswordSchema } from '@/app/utils/password-validation.utils';
import { useAppDispatch } from '@/core/hooks';
import { syncCartAfterAuth } from '@/features/cart';
import { setAuth, setOauthReturnUrl } from '@/store/auth';
import { Button } from '@/uis/button';
import { Field, FieldError, FieldLabel } from '@/uis/field';
import GoogleLogo from '@/uis/google-logo';
import { Input } from '@/uis/input';
import { PasswordInput } from '@/uis/password-input';
import { Separator } from '@/uis/separator';

type LoginFormValues = {
    email: string;
    password: string;
};

function Login() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();

    const loginSchema = z.object({
        email: z
            .string()
            .min(1, { message: t('auth.validation.emailRequired') })
            .email({ message: t('auth.validation.emailInvalid') }),
        password: createPasswordSchema(),
    });

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: async data => {
            await dispatch(setAuth({ token: data.token, user: data.user })).unwrap();
            await dispatch(syncCartAfterAuth()).unwrap();

            toast.success(t('auth.loginSuccess'));
            const returnUrl = searchParams.get('returnUrl');
            if (returnUrl) {
                navigate(decodeURIComponent(returnUrl), { replace: true });
            } else if (data.user.role === UserRoleEnum.Admin) {
                navigate(`/${ROUTES.ADMIN.DASHBOARD}`);
            } else {
                navigate(`/${ROUTES.SETTINGS.PROFILE}`);
            }
        },
    });

    const { mutate: redirectToOAuth, isPending: isOAuthRedirectPending } = useMutation({
        mutationFn: oauthApi.getOAuthRedirect,
        onSuccess: data => {
            window.location.href = data.redirectUrl;
        },
    });

    const isLoading = loginMutation.isPending || isOAuthRedirectPending;

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const {
        formState: { errors },
    } = form;

    const handleFormSubmit = (values: LoginFormValues) => {
        loginMutation.mutate({
            email: values.email,
            password: values.password,
        });
    };

    const handleOAuthLogin = useCallback(
        (provider: OAuthProviderType) => {
            const returnUrl = searchParams.get('returnUrl');
            dispatch(setOauthReturnUrl(returnUrl ?? null));
            redirectToOAuth(provider);
        },
        [searchParams, dispatch, redirectToOAuth]
    );

    const handleGoogleLoginClick = useCallback(() => {
        handleOAuthLogin('google');
    }, [handleOAuthLogin]);

    return (
        <div className='space-y-4 sm:space-y-6'>
            {/* Back Link */}
            <Link
                to={ROUTES.HOME}
                className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors sm:hidden'
            >
                <ArrowLeft className='h-4 w-4' />
                {t('common.back')}
            </Link>

            {/* Header */}
            <div className='space-y-1 sm:space-y-2 text-center'>
                <h1 className='text-xl sm:text-2xl font-semibold tracking-tight'>{t('auth.welcomeBack')}</h1>
                <p className='text-xs sm:text-sm text-muted-foreground'>{t('auth.enterCredentials')}</p>
            </div>

            {/* Login Form */}
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-4'>
                {/* Email Field */}
                <Field data-invalid={!!errors.email}>
                    <FieldLabel htmlFor='email'>{t('auth.email')}</FieldLabel>
                    <Input
                        id='email'
                        type='email'
                        placeholder='name@example.com'
                        autoComplete='email'
                        disabled={isLoading}
                        {...form.register('email')}
                    />
                    {errors.email && <FieldError>{errors.email.message}</FieldError>}
                </Field>

                {/* Password Field */}
                <Field data-invalid={!!errors.password}>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0'>
                        <FieldLabel htmlFor='password'>{t('auth.password')}</FieldLabel>
                        <Button
                            variant='link'
                            className='p-0 h-auto text-xs sm:text-sm font-medium self-start sm:self-auto'
                            asChild
                        >
                            <Link to={`/${ROUTES.AUTH.REQUEST_RESET_PASSWORD}`}>{t('auth.forgotPassword')}</Link>
                        </Button>
                    </div>
                    <PasswordInput
                        id='password'
                        placeholder={t('auth.enterPassword')}
                        autoComplete='current-password'
                        disabled={isLoading}
                        {...form.register('password')}
                    />
                    {errors.password && <FieldError>{errors.password.message}</FieldError>}
                </Field>

                {/* Submit Button */}
                <Button type='submit' className='w-full' disabled={isLoading}>
                    {loginMutation.isPending ? t('auth.signingIn') : t('auth.signIn')}
                </Button>
            </form>

            {/* Divider */}
            <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                    <Separator />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-card px-2 text-muted-foreground'>{t('auth.orContinueWith')}</span>
                </div>
            </div>

            {/* Social Login Buttons */}
            <div className='grid grid-cols-1 gap-2 sm:gap-3'>
                <Button
                    type='button'
                    variant='outline'
                    disabled={isLoading}
                    onClick={handleGoogleLoginClick}
                    className='w-full gap-2'
                >
                    <GoogleLogo className='h-4 w-4' />
                    <span>Google</span>
                </Button>
            </div>

            {/* Sign Up Link */}
            <div className='text-center text-xs sm:text-sm'>
                <span className='text-muted-foreground'>{t('auth.dontHaveAccount')} </span>
                <Button variant='link' className='p-0 h-auto font-medium' asChild>
                    <Link to={`/${ROUTES.AUTH.SIGNUP}`}>{t('auth.signUp')}</Link>
                </Button>
            </div>
        </div>
    );
}

export default memo(Login);
