import { CheckCircle2 } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PaymentStatusEnum } from '../enums';
import { PaymentQrViewModel } from '../models';

import { formatVnd } from '@/app/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import ErrorState from '@/components/error-state';
import { Separator } from '@/components/separator';
import { ORDER_SLUG_PREFIX, PaymentMethodEnum } from '@/features/order';

const VIETQR_BASE_URL = 'https://img.vietqr.io/image';

function buildVietQrUrl(paymentQr: PaymentQrViewModel): string {
    const { bankCode, accountNumber, amount, orderReference, accountHolderName } = paymentQr;
    const params = new URLSearchParams({
        amount: String(amount),
        addInfo: orderReference.replace(ORDER_SLUG_PREFIX, ''),
        accountName: accountHolderName,
    });
    return `${VIETQR_BASE_URL}/${bankCode}-${accountNumber}-compact2.jpg?${params.toString()}`;
}

interface PaymentQrProps {
    paymentMethod: string;
    paymentStatus: string;
    paymentQr: PaymentQrViewModel | null;
    slugId: string;
    paidAt: string | null;
}

function PaymentQr({ paymentMethod, paymentStatus, paymentQr, slugId, paidAt }: PaymentQrProps) {
    const { t } = useTranslation();
    const [imgError, setImgError] = useState(false);

    const handleImageError = useCallback(() => {
        setImgError(true);
    }, []);

    if (paymentMethod.toLowerCase() !== PaymentMethodEnum.Banking) {
        return null;
    }

    if (paymentStatus === PaymentStatusEnum.Paid) {
        const formattedPaidAt = paidAt ? new Date(paidAt).toLocaleString() : '';

        return (
            <Card className='border-success/30 bg-success/5' role='status'>
                <CardContent className='flex flex-col items-center text-center gap-3 py-6'>
                    <CheckCircle2 className='text-success h-8 w-8' aria-hidden='true' />
                    <CardTitle>{t('payment.qr.confirmed')}</CardTitle>
                    {formattedPaidAt && <p className='text-muted-foreground text-sm'>{formattedPaidAt}</p>}
                </CardContent>
            </Card>
        );
    }

    if (paymentQr === null) {
        return (
            <Card>
                <CardContent>
                    <ErrorState
                        iconSize='sm'
                        title={t('payment.qr.unavailableTitle')}
                        description={t('payment.qr.unavailableDescription')}
                    />
                </CardContent>
            </Card>
        );
    }

    const displaySlugId = slugId.replace(ORDER_SLUG_PREFIX, '');
    const qrUrl = buildVietQrUrl(paymentQr);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('payment.qr.completePayment')}</CardTitle>
                <CardDescription>{t('payment.qr.scanDescription')}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='flex justify-center'>
                    {imgError ? (
                        <div className='w-full'>
                            <ErrorState iconSize='sm' title={t('payment.qr.qrUnavailable')} />
                            <p className='text-center text-sm text-muted-foreground'>
                                <span className='font-medium text-foreground'>{paymentQr.bankCode}</span>
                                {' — '}
                                <span className='font-medium text-foreground'>{paymentQr.accountNumber}</span>
                            </p>
                        </div>
                    ) : (
                        <img
                            src={qrUrl}
                            alt={`VietQR payment code for order ${displaySlugId}`}
                            className='w-48 h-48 max-w-full mx-auto border-border rounded-lg'
                            onError={handleImageError}
                        />
                    )}
                </div>

                <Separator />

                <div className='space-y-1'>
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground text-sm'>{t('payment.qr.bank')}</span>
                        <span className='text-foreground font-medium'>{paymentQr.bankCode}</span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground text-sm'>{t('payment.qr.accountNumber')}</span>
                        <span className='text-foreground font-medium'>{paymentQr.accountNumber}</span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground text-sm'>{t('payment.qr.accountHolder')}</span>
                        <span className='text-foreground font-medium'>{paymentQr.accountHolderName}</span>
                    </div>
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground text-sm'>{t('payment.qr.totalAmount')}</span>
                        <span className='text-foreground font-bold'>{formatVnd(paymentQr.amount)}</span>
                    </div>
                </div>

                <p className='text-muted-foreground text-xs'>
                    {t('payment.qr.includeReference')} <span className='font-medium'>{displaySlugId}</span>{' '}
                    {t('payment.qr.inTransferDescription')}
                </p>
            </CardContent>
        </Card>
    );
}

export default memo(PaymentQr);
