import { ArrowLeft } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants/routes.constant';
import { Button } from '@/uis/button';
import ErrorState from '@/uis/error-state';

function OrderDetailError() {
    const { t } = useTranslation();
    return (
        <div className='container mx-auto px-4 py-8'>
            <Button variant='ghost' className='mb-8' asChild>
                <Link to={`/${ROUTES.ORDERS.LIST}`}>
                    <ArrowLeft className='h-4 w-4' />
                    {t('orderDetail.backToOrders')}
                </Link>
            </Button>

            <ErrorState
                title={t('orderDetail.notFound.title')}
                description={t('orderDetail.notFound.description')}
                action={
                    <Button asChild>
                        <Link to={`/${ROUTES.ORDERS.LIST}`}>{t('orderDetail.backToOrders')}</Link>
                    </Button>
                }
            />
        </div>
    );
}

export default memo(OrderDetailError);
