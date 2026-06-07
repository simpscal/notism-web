import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import Spinner from '@/components/spinner';

interface OrdersLoadMoreProps {
    isFetchingNextPage: boolean;
    isError: boolean;
    hasNextPage: boolean;
    onRetry: () => void;
}

function OrdersLoadMore({ isFetchingNextPage, isError, hasNextPage, onRetry }: OrdersLoadMoreProps) {
    const { t } = useTranslation();

    if (isError) {
        return (
            <div role='alert' className='mt-6 flex flex-col items-center gap-3 text-sm text-muted-foreground sm:mt-8'>
                <p className='text-destructive'>{t('orders.loadMoreFailed')}</p>
                <Button variant='outline' size='sm' onClick={onRetry}>
                    {t('orders.retry')}
                </Button>
            </div>
        );
    }

    if (isFetchingNextPage) {
        return (
            <div className='mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground sm:mt-8'>
                <Spinner size='sm' />
                <span>{t('orders.loadingMore')}</span>
            </div>
        );
    }

    if (!hasNextPage) {
        return <p className='mt-6 text-center text-sm text-muted-foreground sm:mt-8'>{t('orders.endOfList')}</p>;
    }

    return null;
}

export default memo(OrdersLoadMore);
