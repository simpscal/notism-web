import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { authApi } from '@/apis';
import { ROUTES } from '@/app/configs';
import { Button } from '@/components/button';
import { Field, FieldError, FieldLabel } from '@/components/field';
import { PasswordInput } from '@/components/password-input';

const resetPasswordSchema = z
    .object({
        newPassword: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token')!;

    const { mutate: resetPassword, isPending } = useMutation({
        mutationFn: authApi.resetPassword,
    });

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onChange',
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    });

    const {
        formState: { errors, isValid },
    } = form;

    const handleFormSubmit = (data: ResetPasswordFormData) => {
        resetPassword(
            {
                token,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword,
            },
            {
                onSuccess: () => {
                    toast.success('Success', {
                        description: 'Your password has been reset successfully',
                    });

                    setTimeout(() => {
                        navigate(`/${ROUTES.logIn}`);
                    }, 1500);
                },
            }
        );
    };

    return (
        <div className='space-y-6'>
            <div className='space-y-2 text-center'>
                <h1 className='text-3xl font-bold'>Reset Your Password</h1>
                <p className='text-muted-foreground'>Enter your new password below</p>
            </div>

            <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-4'>
                {/* New Password Field */}
                <Field data-invalid={!!errors.newPassword}>
                    <FieldLabel htmlFor='newPassword'>New Password</FieldLabel>
                    <PasswordInput
                        id='newPassword'
                        placeholder='Enter new password'
                        autoComplete='new-password'
                        disabled={isPending}
                        {...form.register('newPassword')}
                    />
                    {errors.newPassword && <FieldError>{errors.newPassword.message}</FieldError>}
                </Field>

                {/* Confirm Password Field */}
                <Field data-invalid={!!errors.confirmPassword}>
                    <FieldLabel htmlFor='confirmPassword'>Confirm Password</FieldLabel>
                    <PasswordInput
                        id='confirmPassword'
                        placeholder='Confirm new password'
                        autoComplete='new-password'
                        disabled={isPending}
                        {...form.register('confirmPassword')}
                    />
                    {errors.confirmPassword && <FieldError>{errors.confirmPassword.message}</FieldError>}
                </Field>

                <Button type='submit' className='w-full' disabled={!isValid || isPending}>
                    {isPending ? 'Resetting...' : 'Reset Password'}
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

export default memo(ResetPassword);
