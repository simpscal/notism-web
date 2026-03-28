import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { authApi } from '@/apis';
import { ROUTES } from '@/app/constants';
import { Button } from '@/components/button';
import { Field, FieldError, FieldLabel } from '@/components/field';
import { PasswordInput } from '@/components/password-input';

function ResetPassword() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token')!;

    const resetPasswordSchema = z
        .object({
            newPassword: z
                .string()
                .min(1, t('auth.validation.passwordRequired'))
                .min(8, t('auth.validation.passwordMinLength')),
            confirmPassword: z.string().min(1, 'Please confirm your password'),
        })
        .refine(data => data.newPassword === data.confirmPassword, {
            message: t('auth.validation.passwordsDoNotMatch'),
            path: ['confirmPassword'],
        });

    type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

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
                    toast.success(t('common.success'), {
                        description: t('auth.passwordResetSuccessDescription'),
                    });

                    setTimeout(() => {
                        navigate(`/${ROUTES.AUTH.LOGIN}`);
                    }, 1500);
                },
            }
        );
    };

    return (
        <div className='space-y-6'>
            <div className='space-y-2 text-center'>
                <h1 className='text-3xl font-bold'>{t('auth.resetPassword')}</h1>
                <p className='text-muted-foreground'>{t('auth.enterNewPassword')}</p>
            </div>

            <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-4'>
                {/* New Password Field */}
                <Field data-invalid={!!errors.newPassword}>
                    <FieldLabel htmlFor='newPassword'>{t('auth.newPassword')}</FieldLabel>
                    <PasswordInput
                        id='newPassword'
                        placeholder={t('auth.newPassword')}
                        autoComplete='new-password'
                        disabled={isPending}
                        {...form.register('newPassword')}
                    />
                    {errors.newPassword && <FieldError>{errors.newPassword.message}</FieldError>}
                </Field>

                {/* Confirm Password Field */}
                <Field data-invalid={!!errors.confirmPassword}>
                    <FieldLabel htmlFor='confirmPassword'>{t('auth.confirmNewPassword')}</FieldLabel>
                    <PasswordInput
                        id='confirmPassword'
                        placeholder={t('auth.confirmNewPassword')}
                        autoComplete='new-password'
                        disabled={isPending}
                        {...form.register('confirmPassword')}
                    />
                    {errors.confirmPassword && <FieldError>{errors.confirmPassword.message}</FieldError>}
                </Field>

                <Button type='submit' className='w-full' disabled={!isValid || isPending}>
                    {isPending ? t('auth.resettingPassword') : t('auth.resetPassword')}
                </Button>
            </form>

            <div className='text-center text-sm'>
                <Button variant='link' className='p-0 h-auto font-medium' asChild>
                    <Link to={`/${ROUTES.AUTH.LOGIN}`}>{t('auth.backToLogin')}</Link>
                </Button>
            </div>
        </div>
    );
}

export default memo(ResetPassword);
