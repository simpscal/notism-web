import { ArrowLeft } from 'lucide-react';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { Button } from '@/uis/button';
import ErrorState from '@/uis/error-state';

const DEFAULT_MESSAGE = 'Failed to load food details. Please try again later or go back to the foods list.';

interface FoodDetailErrorProps {
    message?: string;
}

function FoodDetailError({ message = DEFAULT_MESSAGE }: FoodDetailErrorProps) {
    return (
        <div className='container mx-auto px-4 py-8'>
            <Button variant='ghost' className='mb-8' asChild>
                <Link to={`/${ROUTES.ADMIN.FOODS}`}>
                    <ArrowLeft className='h-4 w-4' />
                    Back to Foods
                </Link>
            </Button>

            <ErrorState
                title='Failed to load food details'
                description={message}
                action={
                    <Button asChild>
                        <Link to={`/${ROUTES.ADMIN.FOODS}`}>Back to Foods</Link>
                    </Button>
                }
            />
        </div>
    );
}

export default memo(FoodDetailError);
