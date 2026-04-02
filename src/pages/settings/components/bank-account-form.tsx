import { zodResolver } from '@hookform/resolvers/zod';
import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Field, FieldError, FieldLabel } from '@/components/field';
import { Input } from '@/components/input';
import Spinner from '@/components/spinner';

export interface BankAccountViewModel {
    bankCode: string | null;
    accountNumber: string | null;
    accountHolderName: string | null;
}

interface BankAccountFormProps {
    initialData: BankAccountViewModel | null;
    isPending: boolean;
    isDisabled: boolean;
    onSubmit: (values: BankAccountFormValues) => void;
    onCancel: () => void;
}

const bankAccountSchema = z.object({
    bankCode: z.string().min(1),
    accountNumber: z.string().min(1),
    accountHolderName: z.string().min(1),
});

export type BankAccountFormValues = z.infer<typeof bankAccountSchema>;

function BankAccountForm({ initialData, isPending, isDisabled, onSubmit, onCancel }: BankAccountFormProps) {
    const { t } = useTranslation();

    const form = useForm<BankAccountFormValues>({
        resolver: zodResolver(bankAccountSchema),
        mode: 'onChange',
        defaultValues: {
            bankCode: initialData?.bankCode ?? '',
            accountNumber: initialData?.accountNumber ?? '',
            accountHolderName: initialData?.accountHolderName ?? '',
        },
    });

    const {
        formState: { errors, isDirty },
    } = form;

    const cardDescription =
        initialData === null ? t('settings.payment.noAccount') : t('settings.payment.bankAccountDescription');

    return (
        <div className='space-y-6'>
            <div>
                <h2 className='text-2xl font-semibold tracking-tight'>{t('settings.payment.title')}</h2>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('settings.payment.bankAccount')}</CardTitle>
                        <CardDescription>{cardDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        <Field data-invalid={!!errors.bankCode}>
                            <FieldLabel htmlFor='bankCode'>{t('settings.payment.bankName')}</FieldLabel>
                            <Input
                                id='bankCode'
                                placeholder={t('settings.payment.bankNamePlaceholder')}
                                disabled={isPending || isDisabled}
                                {...form.register('bankCode')}
                            />
                            {errors.bankCode && <FieldError>{t('settings.payment.bankNameRequired')}</FieldError>}
                        </Field>

                        <Field data-invalid={!!errors.accountNumber}>
                            <FieldLabel htmlFor='accountNumber'>{t('settings.payment.accountNumber')}</FieldLabel>
                            <Input
                                id='accountNumber'
                                placeholder={t('settings.payment.accountNumberPlaceholder')}
                                disabled={isPending || isDisabled}
                                {...form.register('accountNumber')}
                            />
                            {errors.accountNumber && (
                                <FieldError>{t('settings.payment.accountNumberRequired')}</FieldError>
                            )}
                        </Field>

                        <Field data-invalid={!!errors.accountHolderName}>
                            <FieldLabel htmlFor='accountHolderName'>
                                {t('settings.payment.accountHolderName')}
                            </FieldLabel>
                            <Input
                                id='accountHolderName'
                                placeholder={t('settings.payment.accountHolderNamePlaceholder')}
                                disabled={isPending || isDisabled}
                                {...form.register('accountHolderName')}
                            />
                            {errors.accountHolderName && (
                                <FieldError>{t('settings.payment.accountHolderNameRequired')}</FieldError>
                            )}
                        </Field>
                    </CardContent>
                </Card>

                <div className='flex justify-end gap-3 pt-4 border-t'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={onCancel}
                        disabled={!isDirty || isPending || isDisabled}
                    >
                        {t('settings.payment.cancel')}
                    </Button>
                    <Button type='submit' disabled={!isDirty || isPending || isDisabled}>
                        {isPending ? (
                            <>
                                <Spinner size='sm' aria-hidden='true' />
                                {t('settings.payment.saving')}
                            </>
                        ) : (
                            t('settings.payment.saveChanges')
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default memo(BankAccountForm);
