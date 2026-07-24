import { Copy } from 'lucide-react';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { RefundStatusType } from '../types';
import { toCustomerRefundStatus } from '../utils';

import RefundStatusBadge from './refund-status-badge';

import { formatVnd } from '@/app/utils';
import { Button } from '@/uis/button';
import { Separator } from '@/uis/separator';

interface RefundStatusPanelProps {
    status: string;
    amount: number;
    sentDate: string | null;
    transferReference: string | null;
}

function RefundStatusPanel({ status, amount, sentDate, transferReference }: RefundStatusPanelProps) {
    const { t } = useTranslation();
    const customerStatus = toCustomerRefundStatus(status);
    const isPaid = customerStatus === RefundStatusType.Paid;

    const handleCopyReference = useCallback(() => {
        if (!transferReference) return;
        void navigator.clipboard?.writeText(transferReference);
    }, [transferReference]);

    return (
        <div className='rounded-lg border bg-muted/30 p-4' role='status' aria-live='polite'>
            <div className='mb-3 flex items-center justify-between'>
                <span className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
                    {t('orderDetail.refund.label')}
                </span>
                <RefundStatusBadge status={customerStatus} />
            </div>

            <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                    <span className='text-muted-foreground'>{t('orderDetail.refund.amount')}</span>
                    <span className='font-semibold'>{formatVnd(amount)}</span>
                </div>

                {isPaid ? (
                    <>
                        {sentDate && (
                            <div className='flex justify-between'>
                                <span className='text-muted-foreground'>{t('orderDetail.refund.sentOn')}</span>
                                <span className='font-medium'>{sentDate}</span>
                            </div>
                        )}
                        {transferReference && (
                            <>
                                <Separator />
                                <div>
                                    <div className='mb-1 text-xs text-muted-foreground'>
                                        {t('orderDetail.refund.transferReference')}
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <code className='flex-1 truncate rounded bg-muted px-2 py-1 font-mono text-xs'>
                                            {transferReference}
                                        </code>
                                        <Button
                                            variant='ghost'
                                            size='icon-sm'
                                            aria-label={t('orderDetail.refund.copyReference')}
                                            onClick={handleCopyReference}
                                        >
                                            <Copy className='h-3.5 w-3.5' />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <p className='text-xs text-muted-foreground'>{t('orderDetail.refund.pendingMessage')}</p>
                )}
            </div>
        </div>
    );
}

export default memo(RefundStatusPanel);
