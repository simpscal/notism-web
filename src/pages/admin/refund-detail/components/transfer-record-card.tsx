import { Copy } from 'lucide-react';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/uis/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/uis/card';
import { Separator } from '@/uis/separator';

interface TransferRecordCardProps {
    paidDate: string;
    transferReference: string;
}

function TransferRecordCard({ paidDate, transferReference }: TransferRecordCardProps) {
    const { t } = useTranslation();

    const handleCopyReference = useCallback(() => {
        void navigator.clipboard?.writeText(transferReference);
    }, [transferReference]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('admin.refundDetail.transferRecordTitle')}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
                <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>{t('admin.refundDetail.paidOn')}</span>
                    <span className='font-medium'>{paidDate}</span>
                </div>
                <Separator />
                <div>
                    <div className='mb-1 text-xs text-muted-foreground'>
                        {t('admin.refundDetail.transferReference')}
                    </div>
                    <div className='flex items-center gap-2'>
                        <code className='flex-1 truncate rounded bg-muted px-2 py-1 font-mono text-xs'>
                            {transferReference}
                        </code>
                        <Button
                            variant='ghost'
                            size='icon-sm'
                            aria-label={t('admin.refundDetail.copyReference')}
                            onClick={handleCopyReference}
                        >
                            <Copy className='h-3.5 w-3.5' />
                        </Button>
                    </div>
                </div>
                <p className='text-xs text-muted-foreground'>{t('admin.refundDetail.transferRecordNote')}</p>
            </CardContent>
        </Card>
    );
}

export default memo(TransferRecordCard);
