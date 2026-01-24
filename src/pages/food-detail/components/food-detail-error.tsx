import { AlertCircle, ArrowLeft } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { Button } from '@/components/button';

function FoodDetailError() {
    return (
        <div className='bg-background'>
            <div className='container mx-auto px-4 py-8'>
                {/* Back Button */}
                <Button variant='ghost' className='mb-8' asChild>
                    <Link to={`/${ROUTES.FOODS.LIST}`}>
                        <ArrowLeft className='mr-2 h-4 w-4' />
                        Back to Menu
                    </Link>
                </Button>

                {/* Error Content */}
                <div className='flex flex-col items-center justify-center py-20 text-center'>
                    <div className='mb-6 rounded-full bg-destructive/10 p-6'>
                        <AlertCircle className='h-16 w-16 text-destructive' />
                    </div>
                    <h1 className='mb-4 text-4xl font-black text-foreground'>Oops! Something went wrong</h1>
                    <p className='mb-8 max-w-md text-lg leading-relaxed text-muted-foreground'>
                        We couldn't load the food details. Please try again later or go back to the menu.
                    </p>
                    <Button asChild>
                        <Link to={`/${ROUTES.FOODS.LIST}`}>Back to Menu</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default memo(FoodDetailError);
