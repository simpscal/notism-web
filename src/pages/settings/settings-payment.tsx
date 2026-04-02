import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { paymentApi } from '@/apis';
import { Card, CardContent } from '@/components/card';
import ErrorState from '@/components/error-state';
import Spinner from '@/components/spinner';
import { BankAccountForm, BankAccountFormValues, BankAccountViewModel } from '@/features/payment';

const BANK_ACCOUNT_QUERY_KEY = ['bank-account'];

function SettingsPayment() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: BANK_ACCOUNT_QUERY_KEY,
        queryFn: () => paymentApi.getBankAccount(),
    });

    const { mutate: saveBankAccount, isPending } = useMutation({
        mutationFn: (payload: BankAccountFormValues) => paymentApi.saveBankAccount(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BANK_ACCOUNT_QUERY_KEY });
            toast.success(t('settings.payment.saveSuccess'));
        },
    });

    const initialData: BankAccountViewModel | null = data
        ? { bankCode: data.bankCode, accountNumber: data.accountNumber, accountHolderName: data.accountHolderName }
        : null;

    const handleCancel = () => {
        queryClient.invalidateQueries({ queryKey: BANK_ACCOUNT_QUERY_KEY });
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className='flex items-center justify-center py-16'>
                    <Spinner size='lg' />
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card>
                <CardContent>
                    <ErrorState
                        title={t('settings.payment.loadErrorTitle')}
                        description={t('settings.payment.loadErrorDescription')}
                        iconSize='sm'
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <BankAccountForm
            initialData={initialData}
            isPending={isPending}
            isDisabled={false}
            onSubmit={saveBankAccount}
            onCancel={handleCancel}
        />
    );
}

export default memo(SettingsPayment);
