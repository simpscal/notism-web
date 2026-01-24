import { PackageX, ArrowLeft } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { Button } from '@/components/button';

function FoodDetailEmpty() {
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

                {/* Empty Content */}
                <div className='flex flex-col items-center justify-center py-20 text-center'>
                    <div className='mb-6 rounded-full bg-muted p-6'>
                        <PackageX className='h-16 w-16 text-muted-foreground' />
                    </div>
                    <h1 className='mb-4 text-4xl font-black text-foreground'>Food Not Found</h1>
                    <p className='mb-8 max-w-md text-lg leading-relaxed text-muted-foreground'>
                        The food item you're looking for doesn't exist or has been removed. Check out our menu for other
                        delicious options!
                    </p>
                    <Button asChild>
                        <Link to={`/${ROUTES.FOODS.LIST}`}>Browse Menu</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default memo(FoodDetailEmpty);
