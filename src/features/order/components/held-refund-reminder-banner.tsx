import { ChevronRight, Landmark } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { HeldRefundViewModel } from '../models';

import { formatVnd } from '@/app/utils';
import Banner from '@/components/banner';

interface HeldRefundReminderBannerProps {
    held: HeldRefundViewModel[];
    onAddBankDetails: () => void;
}

function HeldRefundReminderBanner({ held, onAddBankDetails }: HeldRefundReminderBannerProps) {
    const { t } = useTranslation();

    const isSingle = held.length === 1;
    const totalAmount = useMemo(() => held.reduce((sum, refund) => sum + refund.amount, 0), [held]);

    const title = isSingle
        ? t('order.refund.heldReminderBanner.titleSingle')
        : t('order.refund.heldReminderBanner.titleMultiple');

    const message = isSingle
        ? t('order.refund.heldReminderBanner.messageSingle', {
              amount: formatVnd(held[0].amount),
              orderRef: held[0].orderRef,
          })
        : t('order.refund.heldReminderBanner.messageMultiple', {
              count: held.length,
              amount: formatVnd(totalAmount),
          });

    return (
        <Banner
            variant='info'
            className='rounded-none border-x-0 border-t-0 border-warning/30 bg-warning/10 text-warning'
            icon={<Landmark className='h-5 w-5' />}
            message={
                <button
                    type='button'
                    onClick={onAddBankDetails}
                    className='flex w-full items-center justify-between gap-3 text-left focus-visible:underline focus-visible:outline-none'
                >
                    <span className='min-w-0'>
                        <span className='font-semibold'>{title}</span> <span className='font-normal'>{message}</span>
                    </span>
                    <span className='flex shrink-0 items-center gap-1 font-semibold underline underline-offset-2'>
                        {t('order.refund.heldReminderBanner.cta')}
                        <ChevronRight className='h-4 w-4' />
                    </span>
                </button>
            }
        />
    );
}

export default memo(HeldRefundReminderBanner);
