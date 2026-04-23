import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { authApi, oauthApi } from '@/apis';
import { ROUTES } from '@/app/constants';
import { createPasswordSchema } from '@/app/utils/password-validation.utils';
import { Button } from '@/components/button';
import { Field, FieldError, FieldLabel } from '@/components/field';
import GoogleLogo from '@/components/google-logo';
import { Input } from '@/components/input';
import { PasswordInput } from '@/components/password-input';
import { Separator } from '@/components/separator';
import { useAppDispatch } from '@/core/hooks';
import { setAuth } from '@/store/auth';

type SignupFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

function Signup() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const signupSchema = z.object({
        firstName: z.string().min(1, { message: t('auth.validation.firstNameRequired') }),
        lastName: z.string().min(1, { message: t('auth.validation.lastNameRequired') }),
        email: z
            .string()
            .min(1, { message: t('auth.validation.emailRequired') })
            .email({ message: t('auth.validation.emailInvalid') }),
        password: createPasswordSchema(),
    });

    const signupMutation = useMutation({
        mutationFn: authApi.signup,
        onSuccess: data => {
            dispatch(setAuth({ token: data.token, user: data.user })).unwrap();
            toast.success(t('auth.signupSuccess'));
            navigate(`/${ROUTES.SETTINGS.PROFILE}`);
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
        signupMutation.mutate({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
        });
    };

    const handleOAuthSignup = (provider: string) => {
        oauthRedirectMutation.mutate(provider);
    };

    return (
        <div className='space-y-4 sm:space-y-6'>
            {/* Header */}
            <div className='space-y-1 sm:space-y-2 text-center'>
                <h1 className='text-xl sm:text-2xl font-semibold tracking-tight'>{t('auth.createAccount')}</h1>
                <p className='text-xs sm:text-sm text-muted-foreground'>{t('auth.enterCredentials')}</p>
            </div>

            {/* Signup Form */}
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-4'>
                {/* Name Fields */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {/* First Name Field */}
                    <Field data-invalid={!!errors.firstName}>
                        <FieldLabel htmlFor='firstName'>{t('auth.firstName')}</FieldLabel>
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
                        <FieldLabel htmlFor='lastName'>{t('auth.lastName')}</FieldLabel>
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
                    <FieldLabel htmlFor='password'>{t('auth.password')}</FieldLabel>
                    <PasswordInput
                        id='password'
                        placeholder={t('auth.createPassword')}
                        autoComplete='new-password'
                        disabled={isLoading}
                        {...form.register('password')}
                    />
                    {errors.password && <FieldError>{errors.password.message}</FieldError>}
                </Field>

                {/* Submit Button */}
                <Button type='submit' className='w-full' disabled={isLoading}>
                    {signupMutation.isPending ? t('auth.creatingAccount') : t('auth.signUp')}
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

            {/* Social Signup Buttons */}
            <div className='grid grid-cols-1 gap-2 sm:gap-3'>
                <Button
                    type='button'
                    variant='outline'
                    disabled={isLoading}
                    onClick={() => handleOAuthSignup('google')}
                    className='w-full gap-2'
                >
                    <GoogleLogo className='h-4 w-4' />
                    <span>Google</span>
                </Button>
            </div>

            {/* Back to Login Link */}
            <div className='text-center text-xs sm:text-sm'>
                <span className='text-muted-foreground'>{t('auth.alreadyHaveAccount')} </span>
                <Button variant='link' className='p-0 h-auto font-medium' asChild>
                    <Link to={`/${ROUTES.AUTH.LOGIN}`}>{t('auth.signIn')}</Link>
                </Button>
            </div>
        </div>
    );
}

export default memo(Signup);
