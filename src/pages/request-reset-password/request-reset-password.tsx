import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import { authApi } from '@/apis';
import { ROUTES } from '@/app/constants';
import { Button } from '@/uis/button';
import { Field, FieldError, FieldLabel } from '@/uis/field';
import { Input } from '@/uis/input';

function RequestResetPassword() {
    const { t } = useTranslation();

    const requestResetPasswordSchema = z.object({
        email: z.string().min(1, t('auth.validation.emailRequired')).email(t('auth.validation.emailInvalid')),
    });

    type RequestResetPasswordFormData = z.infer<typeof requestResetPasswordSchema>;

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
                <h1 className='text-3xl font-bold'>{t('auth.checkEmail')}</h1>
                <p className='text-muted-foreground'>{t('auth.checkEmailDescription')}</p>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <div className='space-y-2 text-center'>
                <h1 className='text-3xl font-bold'>{t('auth.resetPassword')}</h1>
                <p className='text-muted-foreground'>{t('auth.enterEmail')}</p>
            </div>

            <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-4'>
                <Field data-invalid={!!errors.email}>
                    <FieldLabel htmlFor='email'>{t('auth.email')}</FieldLabel>
                    <Input
                        id='email'
                        type='email'
                        placeholder={t('auth.email')}
                        autoComplete='email'
                        disabled={isPending}
                        {...form.register('email')}
                    />
                    {errors.email && <FieldError>{errors.email.message}</FieldError>}
                </Field>

                <Button type='submit' className='w-full' disabled={!isValid || isPending}>
                    {isPending ? t('auth.sendingResetLink') : t('auth.sendResetLink')}
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

export default memo(RequestResetPassword);
