import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import Spinner from '@/components/spinner';
import { RefundStatusEnum } from '@/features/order';

interface RefundActionPanelProps {
    status: string;
    isBusy: boolean;
    onApprove: () => void;
}

function RefundActionPanel({ status, isBusy, onApprove }: RefundActionPanelProps) {
    const { t } = useTranslation();

    if (status === RefundStatusEnum.Pending) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t('admin.refundDetail.approveTitle')}</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                    <p className='text-sm text-muted-foreground'>{t('admin.refundDetail.approveDescription')}</p>
                    <Button size='lg' className='w-full' onClick={onApprove} disabled={isBusy}>
                        {isBusy ? (
                            <>
                                <Spinner size='sm' />
                                {t('admin.refundDetail.approving')}
                            </>
                        ) : (
                            t('admin.refundDetail.approveAction')
                        )}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (status === RefundStatusEnum.Processing) {
        return (
            <Card>
                <CardContent className='flex items-center gap-3 py-6' role='status' aria-live='polite'>
                    <Spinner size='md' className='flex-shrink-0' />
                    <div>
                        <div className='font-medium'>{t('admin.refundDetail.processingTitle')}</div>
                        <p className='text-sm text-muted-foreground'>{t('admin.refundDetail.processingDescription')}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return null;
}

export default memo(RefundActionPanel);
