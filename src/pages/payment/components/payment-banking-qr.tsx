import { CreditCard, ShieldCheck } from 'lucide-react';
import { memo } from 'react';

import { formatVnd } from '@/app/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Separator } from '@/components/separator';
import Spinner from '@/components/spinner';

interface PaymentBankingQrProps {
    totalPrice: number;
    bankName?: string;
    accountNumber?: string;
    waiting?: boolean;
}

function PaymentBankingQr({ totalPrice, bankName, accountNumber, waiting }: PaymentBankingQrProps) {
    return (
        <Card>
            <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base'>
                    <CreditCard className='h-4 w-4' />
                    Bank transfer
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-5'>
                <div className='flex flex-col items-center gap-3'>
                    <div className='relative'>
                        <div
                            className='h-44 w-44 rounded-lg border-2 border-primary/40'
                            style={{
                                backgroundImage: 'repeating-conic-gradient(#0001 0% 25%, transparent 0% 50%)',
                                backgroundSize: '12px 12px',
                                backgroundColor: 'hsl(var(--muted))',
                            }}
                        />
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <span className='rounded-md bg-background/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground shadow-sm'>
                                QR placeholder
                            </span>
                        </div>
                        {waiting && (
                            <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-background/80 backdrop-blur-[2px]'>
                                <Spinner size='md' />
                            </div>
                        )}
                    </div>
                    <p className='text-xs text-muted-foreground'>Scan to pay</p>
                </div>
                <div className='space-y-2 rounded-lg border bg-muted/30 px-4 py-3 text-sm'>
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Bank</span>
                        <span className='font-medium text-foreground'>{bankName ?? 'Vietcombank'}</span>
                    </div>
                    <Separator />
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Account</span>
                        <span className='font-mono font-medium text-foreground'>{accountNumber ?? '—'}</span>
                    </div>
                    <Separator />
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Amount</span>
                        <span className='font-semibold text-primary'>{formatVnd(totalPrice)}</span>
                    </div>
                </div>
                {waiting ? (
                    <div className='flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground'>
                        <Spinner size='xs' />
                        Waiting for transfer confirmation…
                    </div>
                ) : (
                    <div className='flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground'>
                        <ShieldCheck className='h-3.5 w-3.5 shrink-0' />
                        After your transfer the payment will be confirmed automatically.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default memo(PaymentBankingQr);
