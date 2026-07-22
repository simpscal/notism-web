import { CheckCircle2 } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { formatVnd } from '@/app/utils';
import { Badge } from '@/uis/badge';

interface BankingPaymentConfirmedPanelProps {
    totalAmount: number;
    slugId: string;
}

function BankingPaymentConfirmedPanel({ totalAmount, slugId }: BankingPaymentConfirmedPanelProps) {
    const { t } = useTranslation();

    return (
        <div
            role='status'
            aria-live='polite'
            className='flex flex-col items-center rounded-2xl bg-primary/5 px-6 py-10 text-center'
        >
            <CheckCircle2 className='mb-4 h-14 w-14 text-primary' aria-hidden='true' />
            <h2 className='mb-1 text-2xl font-bold text-foreground'>{t('payment.confirmedPanel.title')}</h2>
            <p className='mb-3 text-sm text-muted-foreground'>
                {t('payment.confirmedPanel.descriptionStart')}{' '}
                <span className='font-semibold text-foreground'>{formatVnd(totalAmount)}</span>{' '}
                {t('payment.confirmedPanel.descriptionEnd')}
            </p>
            <Badge variant='outline' className='font-mono text-sm'>
                {slugId}
            </Badge>
        </div>
    );
}

export default memo(BankingPaymentConfirmedPanel);
