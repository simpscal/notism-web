import { RotateCcw } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { RefundStatusType } from '@/features/order';
import { Button } from '@/uis/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/uis/card';
import Spinner from '@/uis/spinner';

interface RefundActionPanelProps {
    status: string;
    isBusy: boolean;
    onApprove: () => void;
    onRetry: () => void;
}

function RefundActionPanel({ status, isBusy, onApprove, onRetry }: RefundActionPanelProps) {
    const { t } = useTranslation();

    if (status === RefundStatusType.Pending) {
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

    if (status === RefundStatusType.Processing) {
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

    if (status === RefundStatusType.Failed) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t('admin.refundDetail.retryTitle')}</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                    <p className='text-sm text-muted-foreground'>{t('admin.refundDetail.retryDescription')}</p>
                    <Button size='lg' className='w-full' onClick={onRetry} disabled={isBusy}>
                        {isBusy ? (
                            <>
                                <Spinner size='sm' />
                                {t('admin.refundDetail.retrying')}
                            </>
                        ) : (
                            <>
                                <RotateCcw className='h-4 w-4' />
                                {t('admin.refundDetail.retryAction')}
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return null;
}

export default memo(RefundActionPanel);
