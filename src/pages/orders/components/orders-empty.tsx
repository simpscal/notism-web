import { Package } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants/routes.constant';
import { Button } from '@/components/button';

function OrdersEmpty() {
    return (
        <div className='bg-background'>
            <div className='relative overflow-hidden border-b bg-gradient-to-br from-primary/20 via-primary/5 to-background px-4 py-8 sm:py-10'>
                <div className='pointer-events-none absolute inset-0 overflow-hidden' aria-hidden='true'>
                    <div className='absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl' />
                </div>
                <div className='relative container mx-auto max-w-7xl'>
                    <h1 className='text-3xl font-black tracking-tight sm:text-4xl'>My Orders</h1>
                    <p className='mt-2 text-sm text-muted-foreground'>View and track all your orders</p>
                </div>
            </div>

            <div className='flex flex-col items-center justify-center py-24 text-center'>
                <div className='mb-4 rounded-full bg-muted p-8'>
                    <Package className='h-12 w-12 text-muted-foreground' />
                </div>
                <h2 className='mb-2 text-2xl font-bold'>No orders yet</h2>
                <p className='mb-6 text-muted-foreground'>Start shopping to see your orders here.</p>
                <Button size='lg' asChild>
                    <Link to={`/${ROUTES.FOODS.LIST}`}>Browse Menu</Link>
                </Button>
            </div>
        </div>
    );
}

export default memo(OrdersEmpty);
