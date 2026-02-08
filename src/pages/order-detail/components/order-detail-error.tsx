import { AlertCircle, ArrowLeft } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants/routes.constant';
import { Button } from '@/components/button';

function OrderDetailError() {
    return (
        <div className='container mx-auto px-4 py-8'>
            {/* Back Button */}
            <Button variant='ghost' className='mb-8' asChild>
                <Link to={`/${ROUTES.ORDERS.LIST}`}>
                    <ArrowLeft className='mr-2 h-4 w-4' />
                    Back to Orders
                </Link>
            </Button>

            {/* Error Content */}
            <div className='flex flex-col items-center justify-center py-20 text-center'>
                <div className='mb-6 rounded-full bg-destructive/10 p-6'>
                    <AlertCircle className='h-16 w-16 text-destructive' />
                </div>
                <h1 className='mb-4 text-4xl font-black text-foreground'>Order Not Found</h1>
                <p className='mb-8 max-w-md text-lg leading-relaxed text-muted-foreground'>
                    The order you're looking for doesn't exist or has been removed. Please check your order ID or go
                    back to view all your orders.
                </p>
                <Button asChild>
                    <Link to={`/${ROUTES.ORDERS.LIST}`}>Back to Orders</Link>
                </Button>
            </div>
        </div>
    );
}

export default memo(OrderDetailError);
