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

const signupSchema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Please enter a valid email address' }),
    password: passwordSchema,
});

type SignupFormValues = z.infer<typeof signupSchema>;

function Signup() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const signupMutation = useMutation({
        mutationFn: authApi.signup,
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

    const isLoading = signupMutation.isPending || oauthRedirectMutation.isPending;

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        },
    });

    const {
        formState: { errors },
    } = form;

    const handleFormSubmit = (values: SignupFormValues) => {
        signupMutation.mutate(
            {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
            },
            {
                onSuccess: () => {
                    toast.success('Account created successfully! Welcome aboard.');
                    navigate(`/${ROUTES.PROFILE}`);
                },
            }
        );
    };

    const handleOAuthSignup = (provider: OAuthProviderType) => {
        oauthRedirectMutation.mutate(provider);
    };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='space-y-2 text-center'>
                <h1 className='text-2xl font-semibold tracking-tight'>Create an account</h1>
                <p className='text-sm text-muted-foreground'>Enter your details to get started</p>
            </div>

            {/* Signup Form */}
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-4'>
                {/* Name Fields */}
                <div className='grid grid-cols-2 gap-4'>
                    {/* First Name Field */}
                    <Field data-invalid={!!errors.firstName}>
                        <FieldLabel htmlFor='firstName'>First Name</FieldLabel>
                        <Input
                            id='firstName'
                            type='text'
                            placeholder='John'
                            autoComplete='given-name'
                            disabled={isLoading}
                            {...form.register('firstName')}
                        />
                        {errors.firstName && <FieldError>{errors.firstName.message}</FieldError>}
                    </Field>

                    {/* Last Name Field */}
                    <Field data-invalid={!!errors.lastName}>
                        <FieldLabel htmlFor='lastName'>Last Name</FieldLabel>
                        <Input
                            id='lastName'
                            type='text'
                            placeholder='Doe'
                            autoComplete='family-name'
                            disabled={isLoading}
                            {...form.register('lastName')}
                        />
                        {errors.lastName && <FieldError>{errors.lastName.message}</FieldError>}
                    </Field>
                </div>

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
                    <FieldLabel htmlFor='password'>Password</FieldLabel>
                    <PasswordInput
                        id='password'
                        placeholder='Create a password'
                        autoComplete='new-password'
                        disabled={isLoading}
                        {...form.register('password')}
                    />
                    {errors.password && <FieldError>{errors.password.message}</FieldError>}
                </Field>

                {/* Submit Button */}
                <Button type='submit' className='w-full' disabled={isLoading}>
                    {signupMutation.isPending ? 'Creating account...' : 'Sign up'}
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

            {/* Social Signup Buttons */}
            <div className='grid grid-cols-2 gap-3'>
                <Button
                    type='button'
                    variant='outline'
                    disabled={isLoading}
                    onClick={() => handleOAuthSignup('google')}
                >
                    <GoogleLogo className='h-4 w-4' />
                    Google
                </Button>
                <Button
                    type='button'
                    variant='outline'
                    disabled={isLoading}
                    onClick={() => handleOAuthSignup('github')}
                >
                    <GithubLogo className='h-4 w-4' />
                    GitHub
                </Button>
            </div>

            {/* Back to Login Link */}
            <div className='text-center text-sm'>
                <span className='text-muted-foreground'>Already have an account? </span>
                <Button variant='link' className='p-0 h-auto font-medium' asChild>
                    <Link to={`/${ROUTES.AUTH.LOGIN}`}>Sign in</Link>
                </Button>
            </div>
        </div>
    );
}

export default memo(Signup);
