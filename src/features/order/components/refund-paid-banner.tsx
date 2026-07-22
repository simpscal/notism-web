import { CheckCircle2 } from 'lucide-react';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { formatVnd } from '@/app/utils';
import Banner from '@/uis/banner';

export interface RefundPaidBannerData {
    refundId: string;
    orderId: string;
    orderRef: string;
    amount: number;
    sentDate: string;
}

interface RefundPaidBannerProps {
    refund: RefundPaidBannerData;
    onOpenOrder: (orderId: string) => void;
    onDismiss: (refundId: string) => void;
}

function RefundPaidBanner({ refund, onOpenOrder, onDismiss }: RefundPaidBannerProps) {
    const { t } = useTranslation();

    const handleOpenOrder = useCallback(() => {
        onOpenOrder(refund.orderId);
    }, [onOpenOrder, refund.orderId]);

    const handleDismiss = useCallback(() => {
        onDismiss(refund.refundId);
    }, [onDismiss, refund.refundId]);

    return (
        <Banner
            variant='success'
            className='rounded-none border-x-0 border-t-0'
            icon={<CheckCircle2 className='h-5 w-5' />}
            onClose={handleDismiss}
            message={
                <button
                    type='button'
                    onClick={handleOpenOrder}
                    className='block w-full text-left focus-visible:underline focus-visible:outline-none'
                >
                    <span className='font-semibold'>{t('order.refund.paidBanner.title')}</span>{' '}
                    <span className='font-normal'>
                        {t('order.refund.paidBanner.message', {
                            amount: formatVnd(refund.amount),
                            orderRef: refund.orderRef,
                            sentDate: refund.sentDate,
                        })}
                    </span>{' '}
                    <span className='font-normal underline underline-offset-2'>
                        {t('order.refund.paidBanner.viewOrder')}
                    </span>
                </button>
            }
        />
    );
}

export default memo(RefundPaidBanner);
