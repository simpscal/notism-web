import { ArrowLeft } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { Button } from '@/components/button';
import ErrorState from '@/components/error-state';

function FoodDetailError() {
    return (
        <div className='bg-background'>
            <div className='container mx-auto px-4 py-8'>
                <Button variant='ghost' className='mb-8' asChild>
                    <Link to={`/${ROUTES.FOODS.LIST}`}>
                        <ArrowLeft className='h-4 w-4' />
                        Back to Menu
                    </Link>
                </Button>

                <ErrorState
                    title='Oops! Something went wrong'
                    description="We couldn't load the food details. Please try again later or go back to the menu."
                    action={
                        <Button asChild>
                            <Link to={`/${ROUTES.FOODS.LIST}`}>Back to Menu</Link>
                        </Button>
                    }
                />
            </div>
        </div>
    );
}

export default memo(FoodDetailError);
