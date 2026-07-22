import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import BankAccountForm, { BankAccountFormValues, BankAccountFormVariant } from './bank-account-form';

import { ORDER_QUERY_KEYS, userApi, USER_QUERY_KEYS } from '@/apis';
import { Button } from '@/uis/button';
import ErrorState from '@/uis/error-state';
import { Skeleton } from '@/uis/skeleton';

const COPY_PREFIX: Record<BankAccountFormVariant, string> = {
    admin: 'settings.payment',
    customer: 'customer.payment',
};

const EMPTY_VALUES: BankAccountFormValues = {
    bankCode: '',
    accountNumber: '',
    accountHolderName: '',
};

interface SettingsPaymentSectionProps {
    variant?: BankAccountFormVariant;
}

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

function SettingsPaymentSection({ variant = 'admin' }: SettingsPaymentSectionProps) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const prefix = useMemo(() => COPY_PREFIX[variant], [variant]);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: USER_QUERY_KEYS.bankAccount(),
        queryFn: () => userApi.getBankAccount(),
    });

    const defaultValues = useMemo<BankAccountFormValues>(
        () =>
            data
                ? {
                      bankCode: data.bankCode ?? '',
                      accountNumber: data.accountNumber ?? '',
                      accountHolderName: data.accountHolderName ?? '',
                  }
                : EMPTY_VALUES,
        [data]
    );

    const { mutate: saveBankAccount, isPending } = useMutation({
        mutationFn: (payload: BankAccountFormValues) => userApi.saveBankAccount(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.bankAccount() });
            queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.heldRefunds() });
            toast.success(t(`${prefix}.saveSuccess`));
        },
    });

    const handleRetry = useCallback(() => {
        refetch();
    }, [refetch]);

    const handleSubmit = useCallback(
        (values: BankAccountFormValues) => {
            saveBankAccount(values);
        },
        [saveBankAccount]
    );

    if (isLoading) {
        return <PaymentLoadingState />;
    }

    if (isError) {
        return (
            <div className='px-6 py-10'>
                <ErrorState
                    title={t(`${prefix}.loadErrorTitle`)}
                    description={t(`${prefix}.loadErrorDescription`)}
                    iconSize='sm'
                    action={
                        <Button variant='outline' onClick={handleRetry}>
                            <RefreshCw className='h-4 w-4' />
                            {t(`${prefix}.retry`)}
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <BankAccountForm variant={variant} defaultValues={defaultValues} isSaving={isPending} onSubmit={handleSubmit} />
    );
}

export default memo(SettingsPaymentSection);
