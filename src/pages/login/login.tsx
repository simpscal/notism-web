import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { authApi, oauthApi, OAuthProviderType } from '@/apis';
import { ROUTES } from '@/app/constants';
import { passwordSchema } from '@/app/utils/password-validation.utils';
import { Button } from '@/components/button';
import { Field, FieldError, FieldLabel } from '@/components/field';
import GithubLogo from '@/components/github-logo';
import GoogleLogo from '@/components/google-logo';
import { Input } from '@/components/input';
import { PasswordInput } from '@/components/password-input';
import { Separator } from '@/components/separator';
import { useAppDispatch } from '@/core/hooks';
import { setAuth } from '@/store/auth/auth.slice';

const loginSchema = z.object({
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Please enter a valid email address' }),
    password: passwordSchema,
});

type LoginFormValues = z.infer<typeof loginSchema>;

function Login() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: data => {
            dispatch(setAuth(data.token, data.user));
        },
    });

    const oauthRedirectMutation = useMutation({
        mutationFn: oauthApi.getOAuthRedirect,
        onSuccess: data => {
            window.location.href = data.redirectUrl;
        },
    });

    const isLoading = loginMutation.isPending || oauthRedirectMutation.isPending;

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
        loginMutation.mutate(
            {
                email: values.email,
                password: values.password,
            },
            {
                onSuccess: () => {
                    toast.success('Login successful! Welcome back.');
                    navigate(`/${ROUTES.PROFILE}`);
                },
            }
        );
    };

    const handleOAuthLogin = (provider: OAuthProviderType) => {
        oauthRedirectMutation.mutate(provider);
    };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='space-y-2 text-center'>
                <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
                <p className='text-sm text-muted-foreground'>Enter your credentials to access your account</p>
            </div>

            {/* Login Form */}
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-4'>
                {/* Email Field */}
                <Field data-invalid={!!errors.email}>
                    <FieldLabel htmlFor='email'>Email</FieldLabel>
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
                    <div className='flex items-center justify-between'>
                        <FieldLabel htmlFor='password'>Password</FieldLabel>
                        <Button variant='link' className='p-0 h-auto text-sm font-medium' asChild>
                            <Link to={`/${ROUTES.AUTH.REQUEST_RESET_PASSWORD}`}>Forgot password?</Link>
                        </Button>
                    </div>
                    <PasswordInput
                        id='password'
                        placeholder='Enter your password'
                        autoComplete='current-password'
                        disabled={isLoading}
                        {...form.register('password')}
                    />
                    {errors.password && <FieldError>{errors.password.message}</FieldError>}
                </Field>

                {/* Submit Button */}
                <Button type='submit' className='w-full' disabled={isLoading}>
                    {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
                </Button>
            </form>

            {/* Divider */}
            <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                    <Separator />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-card px-2 text-muted-foreground'>Or continue with</span>
                </div>
            </div>

            {/* Social Login Buttons */}
            <div className='grid grid-cols-2 gap-3'>
                <Button type='button' variant='outline' disabled={isLoading} onClick={() => handleOAuthLogin('google')}>
                    <GoogleLogo className='h-4 w-4' />
                    Google
                </Button>
                <Button type='button' variant='outline' disabled={isLoading} onClick={() => handleOAuthLogin('github')}>
                    <GithubLogo className='h-4 w-4' />
                    GitHub
                </Button>
            </div>

            {/* Sign Up Link */}
            <div className='text-center text-sm'>
                <span className='text-muted-foreground'>Don't have an account? </span>
                <Button variant='link' className='p-0 h-auto font-medium' asChild>
                    <Link to={`/${ROUTES.AUTH.SIGNUP}`}>Sign up</Link>
                </Button>
            </div>
        </div>
    );
}

export default memo(Login);
