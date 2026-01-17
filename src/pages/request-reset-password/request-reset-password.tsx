import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import { authApi } from '@/apis';
import { ROUTES } from '@/app/configs';
import { Button } from '@/components/button';
import { Field, FieldError, FieldLabel } from '@/components/field';
import { Input } from '@/components/input';

const requestResetPasswordSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
});

type RequestResetPasswordFormData = z.infer<typeof requestResetPasswordSchema>;

function RequestResetPassword() {
    const {
        mutate: requestResetPassword,
        isPending,
        isSuccess,
    } = useMutation({
        mutationFn: authApi.requestResetPassword,
    });

    const form = useForm<RequestResetPasswordFormData>({
        resolver: zodResolver(requestResetPasswordSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
        },
    });

    const {
        formState: { errors, isValid },
    } = form;

    const handleFormSubmit = (data: RequestResetPasswordFormData) => {
        requestResetPassword(data);
    };

    if (isSuccess) {
        return (
            <div className='space-y-2 text-center'>
                <h1 className='text-3xl font-bold'>Check Your Email</h1>
                <p className='text-muted-foreground'>
                    We've sent a password reset link to your email address. Please check your inbox and follow the
                    instructions.
                </p>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <div className='space-y-2 text-center'>
                <h1 className='text-3xl font-bold'>Reset Password</h1>
                <p className='text-muted-foreground'>
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-4'>
                <Field data-invalid={!!errors.email}>
                    <FieldLabel htmlFor='email'>Email</FieldLabel>
                    <Input
                        id='email'
                        type='email'
                        placeholder='Enter your email'
                        autoComplete='email'
                        disabled={isPending}
                        {...form.register('email')}
                    />
                    {errors.email && <FieldError>{errors.email.message}</FieldError>}
                </Field>

                <Button type='submit' className='w-full' disabled={!isValid || isPending}>
                    {isPending ? 'Sending...' : 'Send Reset Link'}
                </Button>
            </form>

            <div className='text-center text-sm'>
                <Button variant='link' className='p-0 h-auto font-medium' asChild>
                    <Link to={`/${ROUTES.logIn}`}>Back to Login</Link>
                </Button>
            </div>
        </div>
    );
}

export default memo(RequestResetPassword);
