import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { paymentApi } from '@/apis';
import { Button } from '@/components/button';
import ErrorState from '@/components/error-state';
import { Field, FieldError, FieldLabel } from '@/components/field';
import { Input } from '@/components/input';
import { Skeleton } from '@/components/skeleton';

const BANK_ACCOUNT_QUERY_KEY = ['bank-account'];

const bankAccountSchema = z.object({
    bankCode: z.string().min(1),
    accountNumber: z.string().min(1),
    accountHolderName: z.string().min(1),
});

type BankAccountFormValues = z.infer<typeof bankAccountSchema>;

function PaymentLoadingState() {
    return (
        <div className='flex flex-col'>
            <div className='space-y-6 px-6 py-6'>
                <div className='space-y-1'>
                    <Skeleton className='h-6 w-28' />
                    <Skeleton className='h-4 w-72' />
                </div>

                {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className='space-y-2'>
                        <Skeleton className='h-4 w-32' />
                        <Skeleton className='h-9 w-full' />
                    </div>
                ))}
            </div>

            <div className='flex items-center justify-end gap-2 border-t bg-muted/20 px-6 py-4'>
                <Skeleton className='h-9 w-24' />
                <Skeleton className='h-9 w-32' />
            </div>
        </div>
    );
}

function SettingsPaymentSection() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: BANK_ACCOUNT_QUERY_KEY,
        queryFn: () => paymentApi.getBankAccount(),
    });

    const form = useForm<BankAccountFormValues>({
        resolver: zodResolver(bankAccountSchema),
        mode: 'onChange',
        defaultValues: {
            bankCode: '',
            accountNumber: '',
            accountHolderName: '',
        },
    });

    const {
        reset,
        formState: { errors, isDirty },
    } = form;

    useEffect(() => {
        if (data) {
            reset({
                bankCode: data.bankCode ?? '',
                accountNumber: data.accountNumber ?? '',
                accountHolderName: data.accountHolderName ?? '',
            });
        }
    }, [data, reset]);

    const { mutate: saveBankAccount, isPending } = useMutation({
        mutationFn: (payload: BankAccountFormValues) => paymentApi.saveBankAccount(payload),
        onSuccess: (_result, payload) => {
            queryClient.invalidateQueries({ queryKey: BANK_ACCOUNT_QUERY_KEY });
            reset(payload);
            toast.success(t('settings.payment.saveSuccess'));
        },
    });

    const handleCancel = () => {
        reset({
            bankCode: data?.bankCode ?? '',
            accountNumber: data?.accountNumber ?? '',
            accountHolderName: data?.accountHolderName ?? '',
        });
    };

    if (isLoading) {
        return <PaymentLoadingState />;
    }

    if (isError) {
        return (
            <div className='px-6 py-10'>
                <ErrorState
                    title={t('settings.payment.loadErrorTitle')}
                    description={t('settings.payment.loadErrorDescription')}
                    iconSize='sm'
                    action={
                        <Button variant='outline' onClick={() => refetch()}>
                            <RefreshCw className='h-4 w-4' />
                            {t('settings.payment.retry')}
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <form onSubmit={form.handleSubmit(values => saveBankAccount(values))} className='flex flex-col'>
            <div className='space-y-6 px-6 py-6'>
                {/* Pane heading */}
                <div className='space-y-1'>
                    <h2 className='text-lg font-semibold tracking-tight'>{t('settings.payment.paneTitle')}</h2>
                    <p className='text-sm text-muted-foreground'>{t('settings.payment.subtitle')}</p>
                </div>

                <Field data-invalid={!!errors.bankCode}>
                    <FieldLabel htmlFor='bankCode'>{t('settings.payment.bankName')}</FieldLabel>
                    <Input
                        id='bankCode'
                        placeholder={t('settings.payment.bankNamePlaceholder')}
                        disabled={isPending}
                        aria-invalid={!!errors.bankCode}
                        {...form.register('bankCode')}
                    />
                    {errors.bankCode && <FieldError>{t('settings.payment.bankNameRequired')}</FieldError>}
                </Field>

                <Field data-invalid={!!errors.accountNumber}>
                    <FieldLabel htmlFor='accountNumber'>{t('settings.payment.accountNumber')}</FieldLabel>
                    <Input
                        id='accountNumber'
                        placeholder={t('settings.payment.accountNumberPlaceholder')}
                        disabled={isPending}
                        aria-invalid={!!errors.accountNumber}
                        {...form.register('accountNumber')}
                    />
                    {errors.accountNumber && <FieldError>{t('settings.payment.accountNumberRequired')}</FieldError>}
                </Field>

                <Field data-invalid={!!errors.accountHolderName}>
                    <FieldLabel htmlFor='accountHolderName'>{t('settings.payment.accountHolderName')}</FieldLabel>
                    <Input
                        id='accountHolderName'
                        placeholder={t('settings.payment.accountHolderNamePlaceholder')}
                        disabled={isPending}
                        aria-invalid={!!errors.accountHolderName}
                        {...form.register('accountHolderName')}
                    />
                    {errors.accountHolderName && (
                        <FieldError>{t('settings.payment.accountHolderNameRequired')}</FieldError>
                    )}
                </Field>
            </div>

            {/* Pane footer */}
            <div className='flex items-center justify-end gap-2 border-t bg-muted/20 px-6 py-4'>
                <Button type='button' variant='outline' onClick={handleCancel} disabled={!isDirty || isPending}>
                    {t('settings.payment.cancel')}
                </Button>
                <Button type='submit' disabled={!isDirty || isPending}>
                    {isPending ? t('settings.payment.saving') : t('settings.payment.saveChanges')}
                </Button>
            </div>
        </form>
    );
}

export default memo(SettingsPaymentSection);
