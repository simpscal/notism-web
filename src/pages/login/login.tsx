import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { loginApi } from './apis';

import { ROUTES } from '@/app/configs';
import { Icon } from '@/components/icon/icon';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Separator } from '@/components/ui/separator';
import { useAppDispatch } from '@/core/hooks';
import { authService } from '@/features/auth/services';

const loginSchema = z.object({
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Please enter a valid email address' }),
    password: z
        .string()
        .min(1, { message: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function Login() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);

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

    const handleFormSubmit = async (values: LoginFormValues) => {
        setIsLoading(true);

        loginApi
            .login({
                email: values.email,
                password: values.password,
            })
            .then(data => {
                authService.authenticate(dispatch, data.token, data.user);
            })
            .then(() => {
                toast.success('Login successful! Welcome back.');
                navigate(`/${ROUTES.about}`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleGoogleLogin = () => {};

    const handleGithubLogin = () => {};

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
                            <Link to={`/${ROUTES.requestResetPassword}`}>Forgot password?</Link>
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
                    {isLoading ? 'Signing in...' : 'Sign in'}
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
                <Button type='button' variant='outline' disabled={isLoading} onClick={handleGoogleLogin}>
                    <Icon name='google' size={16} />
                    Google
                </Button>
                <Button type='button' variant='outline' disabled={isLoading} onClick={handleGithubLogin}>
                    <Icon name='github' size={16} />
                    GitHub
                </Button>
            </div>

            {/* Sign Up Link */}
            <div className='text-center text-sm'>
                <span className='text-muted-foreground'>Don't have an account? </span>
                <Button variant='link' className='p-0 h-auto font-medium' asChild>
                    <Link to={`/${ROUTES.signUp}`}>Sign up</Link>
                </Button>
            </div>
        </div>
    );
}

export default Login;
