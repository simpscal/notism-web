import { QrCode } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { formatVnd } from '@/app/utils';
import { toNFormatGuid, buildSepayQrUrl } from '@/features/order';
import { Card, CardContent, CardHeader, CardTitle } from '@/uis/card';
import ErrorState from '@/uis/error-state';
import { Separator } from '@/uis/separator';
import Spinner from '@/uis/spinner';

interface RefundVietQrCardProps {
    refundId: string;
    amount: number;
    bankCode: string | null;
    accountNumber: string | null;
    accountHolderName: string | null;
}

interface QrFieldRowProps {
    label: string;
    children: React.ReactNode;
}

function QrFieldRow({ label, children }: QrFieldRowProps) {
    return (
        <div className='flex items-start justify-between gap-3 text-sm'>
            <span className='shrink-0 text-muted-foreground'>{label}</span>
            <span className='text-right font-medium'>{children}</span>
        </div>
    );
}

function RefundVietQrCard({ refundId, amount, bankCode, accountNumber, accountHolderName }: RefundVietQrCardProps) {
    const { t } = useTranslation();

    const hasPayoutDetails = Boolean(bankCode && accountNumber);

    const contentToken = useMemo(() => toNFormatGuid(refundId), [refundId]);

    const qrUrl = useMemo(() => {
        if (!hasPayoutDetails) return '';
        return buildSepayQrUrl({ bank: bankCode!, acc: accountNumber!, amount, des: contentToken });
    }, [hasPayoutDetails, bankCode, accountNumber, amount, contentToken]);

    return (
        <Card className='border-primary/30'>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <QrCode className='h-4 w-4 text-primary' />
                    {t('admin.refundDetail.qrTitle')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {hasPayoutDetails ? (
                    <div className='grid gap-6 md:grid-cols-[auto_1fr] md:items-start'>
                        <div className='flex flex-col items-center gap-3'>
                            <img
                                src={qrUrl}
                                alt={t('admin.refundDetail.qrImageAlt', { refundId })}
                                className='h-64 w-64 max-w-full rounded-xl border border-border bg-white'
                            />
                            <span className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
                                <Spinner size='sm' className='shrink-0' />
                                {t('admin.refundDetail.qrWaiting')}
                            </span>
                        </div>

                        <div className='space-y-4'>
                            <p className='text-sm text-muted-foreground'>{t('admin.refundDetail.qrDescription')}</p>

                            <div className='space-y-2 rounded-lg border bg-muted/30 p-4'>
                                <QrFieldRow label={t('admin.refundDetail.qrBank')}>{bankCode}</QrFieldRow>
                                <QrFieldRow label={t('admin.refundDetail.qrAccount')}>
                                    <code className='font-mono text-xs'>{accountNumber}</code>
                                </QrFieldRow>
                                <QrFieldRow label={t('admin.refundDetail.qrHolder')}>{accountHolderName}</QrFieldRow>
                                <Separator />
                                <QrFieldRow label={t('admin.refundDetail.qrAmount')}>
                                    <span className='font-semibold'>{formatVnd(amount)}</span>
                                </QrFieldRow>
                                <QrFieldRow label={t('admin.refundDetail.qrContent')}>
                                    <code className='break-all text-right font-mono text-xs text-primary'>
                                        {contentToken}
                                    </code>
                                </QrFieldRow>
                            </div>

                            <p className='text-xs text-muted-foreground'>
                                {t('admin.refundDetail.qrContentHint')}{' '}
                                <code className='break-all font-mono'>{contentToken}</code>{' '}
                                {t('admin.refundDetail.qrContentHintSuffix')}
                            </p>
                        </div>
                    </div>
                ) : (
                    <ErrorState
                        iconSize='sm'
                        title={t('admin.refundDetail.qrMissingTitle')}
                        description={t('admin.refundDetail.qrMissingDescription')}
                    />
                )}
            </CardContent>
        </Card>
    );
}

export default memo(RefundVietQrCard);
