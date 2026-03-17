import { ArrowLeft } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants/routes.constant';
import { Button } from '@/components/button';
import ErrorState from '@/components/error-state';

function OrderDetailError() {
    return (
        <div className='container mx-auto px-4 py-8'>
            <Button variant='ghost' className='mb-8' asChild>
                <Link to={`/${ROUTES.ORDERS.LIST}`}>
                    <ArrowLeft className='h-4 w-4' />
                    Back to Orders
                </Link>
            </Button>

            <ErrorState
                title='Order Not Found'
                description="The order you're looking for doesn't exist or has been removed. Please check your order ID or go back to view all your orders."
                action={
                    <Button asChild>
                        <Link to={`/${ROUTES.ORDERS.LIST}`}>Back to Orders</Link>
                    </Button>
                }
            />
        </div>
    );
}

export default memo(OrderDetailError);
