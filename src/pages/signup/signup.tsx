import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { signupApi } from './apis';

import { ROUTES } from '@/app/configs';
import { Icon } from '@/components/icon/icon';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAppDispatch } from '@/core/hooks';
import { authSuccess } from '@/store/auth/auth.slice';

const signupSchema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Please enter a valid email address' }),
    password: z
        .string()
        .min(1, { message: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters' }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

function Signup() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleFormSubmit = async (values: SignupFormValues) => {
        setIsLoading(true);

        signupApi
            .signup({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
            })
            .then(data => {
                dispatch(
                    authSuccess({
                        user: data.user,
                        accessToken: data.token,
                    })
                );
            })
            .then(() => {
                toast.success('Account created successfully! Welcome aboard.');
                navigate(ROUTES.about);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handlePasswordVisibilityToggle = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleGoogleSignup = () => {};

    const handleGithubSignup = () => {};

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
                    <div className='relative'>
                        <Input
                            id='password'
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder='Create a password'
                            autoComplete='new-password'
                            disabled={isLoading}
                            {...form.register('password')}
                        />
                        <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={handlePasswordVisibilityToggle}
                            className='absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground'
                            disabled={isLoading}
                        >
                            <Icon name={isPasswordVisible ? 'eyeOff' : 'eye'} size={16} />
                        </Button>
                    </div>
                    {errors.password && <FieldError>{errors.password.message}</FieldError>}
                </Field>

                {/* Submit Button */}
                <Button type='submit' className='w-full' disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Sign up'}
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
                <Button type='button' variant='outline' disabled={isLoading} onClick={handleGoogleSignup}>
                    <Icon name='google' size={16} />
                    Google
                </Button>
                <Button type='button' variant='outline' disabled={isLoading} onClick={handleGithubSignup}>
                    <Icon name='github' size={16} />
                    GitHub
                </Button>
            </div>

            {/* Back to Login Link */}
            <div className='text-center text-sm'>
                <span className='text-muted-foreground'>Already have an account? </span>
                <Button variant='link' className='p-0 h-auto font-medium' asChild>
                    <Link to={`/${ROUTES.logIn}`}>Sign in</Link>
                </Button>
            </div>
        </div>
    );
}

export default Signup;
