import { AlertTriangle } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';

interface RefundFailureCardProps {
    reason: string;
}

function RefundFailureCard({ reason }: RefundFailureCardProps) {
    const { t } = useTranslation();

    return (
        <Card className='border-destructive/30'>
            <CardHeader>
                <CardTitle className='flex items-center gap-2 text-destructive'>
                    <AlertTriangle className='h-4 w-4' />
                    {t('admin.refundDetail.failureTitle')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='rounded-lg bg-destructive/10 p-3 text-sm text-destructive'>{reason}</div>
            </CardContent>
        </Card>
    );
}

export default memo(RefundFailureCard);
