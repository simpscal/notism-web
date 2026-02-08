import { Package } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants/routes.constant';
import { Button } from '@/components/button';

function OrdersEmpty() {
    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='mb-8 text-3xl font-bold'>My Orders</h1>
            <div className='flex flex-col items-center justify-center py-12 text-center'>
                <div className='mb-4 rounded-full bg-muted p-6'>
                    <Package className='h-12 w-12 text-muted-foreground' />
                </div>
                <h2 className='mb-2 text-2xl font-semibold'>No orders yet</h2>
                <p className='mb-6 text-muted-foreground'>Start shopping to see your orders here.</p>
                <Button asChild>
                    <Link to={`/${ROUTES.FOODS.LIST}`}>Browse Menu</Link>
                </Button>
            </div>
        </div>
    );
}

export default memo(OrdersEmpty);
