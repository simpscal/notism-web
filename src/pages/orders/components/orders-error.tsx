import { AlertCircle } from 'lucide-react';
import { memo } from 'react';

function OrdersError() {
    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='mb-8 text-3xl font-bold'>My Orders</h1>
            <div className='flex flex-col items-center justify-center py-12 text-center'>
                <div className='mb-4 rounded-full bg-destructive/10 p-6'>
                    <AlertCircle className='h-12 w-12 text-destructive' />
                </div>
                <h2 className='mb-2 text-2xl font-semibold'>Failed to load orders</h2>
                <p className='text-muted-foreground'>Please try again later.</p>
            </div>
        </div>
    );
}

export default memo(OrdersError);
