import { ShoppingBag } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants/routes.constant';
import { Button } from '@/components/button';

function PaymentEmpty() {
    return (
        <div className='container mx-auto px-4 py-12'>
            <div className='flex flex-col items-center justify-center py-20 text-center'>
                <div className='mb-4 rounded-full bg-muted p-6'>
                    <ShoppingBag className='h-12 w-12 text-muted-foreground' />
                </div>
                <h2 className='mb-2 text-2xl font-semibold'>Your cart is empty</h2>
                <p className='mb-6 text-muted-foreground'>Add items to your cart before proceeding to payment.</p>
                <Button asChild>
                    <Link to={`/${ROUTES.FOODS.LIST}`}>Browse Foods</Link>
                </Button>
            </div>
        </div>
    );
}

export default memo(PaymentEmpty);
