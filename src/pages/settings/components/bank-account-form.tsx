import { zodResolver } from '@hookform/resolvers/zod';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Button } from '@/uis/button';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/uis/field';
import { Input } from '@/uis/input';
import Spinner from '@/uis/spinner';

export type BankAccountFormVariant = 'admin' | 'customer';

const bankAccountSchema = z.object({
    bankCode: z.string().min(1),
    accountNumber: z.string().min(1),
    accountHolderName: z.string().min(1),
});

export type BankAccountFormValues = z.infer<typeof bankAccountSchema>;

interface BankAccountFormProps {
    variant: BankAccountFormVariant;
    defaultValues: BankAccountFormValues;
    isSaving: boolean;
    onSubmit: (values: BankAccountFormValues) => void;
}

const COPY_PREFIX: Record<BankAccountFormVariant, string> = {
    admin: 'settings.payment',
    customer: 'customer.payment',
};

function BankAccountForm({ variant, defaultValues, isSaving, onSubmit }: BankAccountFormProps) {
    const { t } = useTranslation();

    const prefix = useMemo(() => COPY_PREFIX[variant], [variant]);
    const hasHints = useMemo(() => variant === 'customer', [variant]);

    const form = useForm<BankAccountFormValues>({
        resolver: zodResolver(bankAccountSchema),
        mode: 'onChange',
        defaultValues,
    });

    const {
        reset,
        formState: { errors, isDirty },
    } = form;

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    const handleCancel = useCallback(() => {
        reset(defaultValues);
    }, [reset, defaultValues]);

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col'>
            <div className='space-y-6 px-6 py-6'>
                <div className='space-y-1'>
                    <h2 className='text-lg font-semibold tracking-tight'>{t(`${prefix}.paneTitle`)}</h2>
                    <p className='text-sm text-muted-foreground'>{t(`${prefix}.subtitle`)}</p>
                </div>

                <Field data-invalid={!!errors.bankCode}>
                    <FieldLabel htmlFor='bankCode'>{t(`${prefix}.bankName`)}</FieldLabel>
                    <Input
                        id='bankCode'
                        placeholder={t(`${prefix}.bankNamePlaceholder`)}
                        disabled={isSaving}
                        aria-invalid={!!errors.bankCode}
                        {...form.register('bankCode')}
                    />
                    {errors.bankCode ? (
                        <FieldError>{t(`${prefix}.bankNameRequired`)}</FieldError>
                    ) : (
                        hasHints && <FieldDescription>{t(`${prefix}.bankNameHint`)}</FieldDescription>
                    )}
                </Field>

                <Field data-invalid={!!errors.accountNumber}>
                    <FieldLabel htmlFor='accountNumber'>{t(`${prefix}.accountNumber`)}</FieldLabel>
                    <Input
                        id='accountNumber'
                        inputMode={hasHints ? 'numeric' : undefined}
                        placeholder={t(`${prefix}.accountNumberPlaceholder`)}
                        disabled={isSaving}
                        aria-invalid={!!errors.accountNumber}
                        {...form.register('accountNumber')}
                    />
                    {errors.accountNumber ? (
                        <FieldError>{t(`${prefix}.accountNumberRequired`)}</FieldError>
                    ) : (
                        hasHints && <FieldDescription>{t(`${prefix}.accountNumberHint`)}</FieldDescription>
                    )}
                </Field>

                <Field data-invalid={!!errors.accountHolderName}>
                    <FieldLabel htmlFor='accountHolderName'>{t(`${prefix}.accountHolderName`)}</FieldLabel>
                    <Input
                        id='accountHolderName'
                        placeholder={t(`${prefix}.accountHolderNamePlaceholder`)}
                        disabled={isSaving}
                        aria-invalid={!!errors.accountHolderName}
                        {...form.register('accountHolderName')}
                    />
                    {errors.accountHolderName && <FieldError>{t(`${prefix}.accountHolderNameRequired`)}</FieldError>}
                </Field>
            </div>

            <div className='flex items-center justify-end gap-2 border-t bg-muted/20 px-6 py-4'>
                <Button type='button' variant='outline' onClick={handleCancel} disabled={!isDirty || isSaving}>
                    {t(`${prefix}.cancel`)}
                </Button>
                <Button type='submit' disabled={!isDirty || isSaving}>
                    {isSaving ? (
                        <>
                            <Spinner size='sm' />
                            {t(`${prefix}.saving`)}
                        </>
                    ) : (
                        t(`${prefix}.saveChanges`)
                    )}
                </Button>
            </div>
        </form>
    );
}

export default memo(BankAccountForm);
