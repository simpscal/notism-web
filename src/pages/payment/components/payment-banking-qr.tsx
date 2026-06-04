import { CreditCard, ShieldCheck } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { formatVnd } from '@/app/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Separator } from '@/components/separator';
import Spinner from '@/components/spinner';

const VIETQR_BASE_URL = 'https://img.vietqr.io/image';

function buildQrUrl(
    bankCode: string,
    accountNumber: string,
    accountHolderName: string,
    amount: number,
    orderReference: string
): string {
    const params = new URLSearchParams({
        amount: String(amount),
        addInfo: orderReference,
        accountName: accountHolderName,
    });
    return `${VIETQR_BASE_URL}/${bankCode}-${accountNumber}-compact2.jpg?${params.toString()}`;
}

interface PaymentBankingQrProps {
    bankCode: string;
    accountNumber: string;
    accountHolderName: string;
    amount: number;
    orderReference: string;
    waiting?: boolean;
}

function PaymentBankingQr({
    bankCode,
    accountNumber,
    accountHolderName,
    amount,
    orderReference,
    waiting,
}: PaymentBankingQrProps) {
    const { t } = useTranslation();
    const [imgError, setImgError] = useState(false);
    const qrUrl = buildQrUrl(bankCode, accountNumber, accountHolderName, amount, orderReference);

    return (
        <Card>
            <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base'>
                    <CreditCard className='h-4 w-4' />
                    {t('payment.bankTransfer.title')}
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-5'>
                <div className='flex flex-col items-center gap-3'>
                    <div className='relative'>
                        {imgError ? (
                            <div className='flex h-44 w-44 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30'>
                                <span className='text-xs text-muted-foreground'>
                                    {t('payment.bankTransfer.qrUnavailable')}
                                </span>
                            </div>
                        ) : (
                            <img
                                src={qrUrl}
                                alt='VietQR payment code'
                                className='h-44 w-44 rounded-lg border-2 border-primary/40 object-cover'
                                onError={() => setImgError(true)}
                            />
                        )}
                        {waiting && (
                            <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-background/80 backdrop-blur-[2px]'>
                                <Spinner size='md' />
                            </div>
                        )}
                    </div>
                    <p className='text-xs text-muted-foreground'>{t('payment.bankTransfer.scanToPay')}</p>
                </div>

                <div className='space-y-2 rounded-lg border bg-muted/30 px-4 py-3 text-sm'>
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground'>{t('payment.bankTransfer.bank')}</span>
                        <span className='font-medium text-foreground'>{bankCode}</span>
                    </div>
                    <Separator />
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground'>{t('payment.bankTransfer.account')}</span>
                        <span className='font-mono font-medium text-foreground'>{accountNumber}</span>
                    </div>
                    <Separator />
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground'>{t('payment.bankTransfer.amount')}</span>
                        <span className='font-semibold text-primary'>{formatVnd(amount)}</span>
                    </div>
                </div>

                <div className='flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground'>
                    <ShieldCheck className='h-3.5 w-3.5 shrink-0' />
                    {t('payment.bankTransfer.autoConfirm')}
                </div>
            </CardContent>
        </Card>
    );
}

export default memo(PaymentBankingQr);
