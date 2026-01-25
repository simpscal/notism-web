import { UtensilsCrossed } from 'lucide-react';
import { memo } from 'react';

import { Button } from '@/components/button';

interface FoodsEmptyProps {
    onClearFilters: () => void;
}

function FoodsEmpty({ onClearFilters }: FoodsEmptyProps) {
    return (
        <div className='flex flex-col items-center justify-center py-20 text-center'>
            <div className='mb-4 rounded-full p-6'>
                <UtensilsCrossed className='h-12 w-12' />
            </div>
            <h3 className='mb-2 text-xl font-semibold'>No dishes found</h3>
            <p className='mb-6'>We couldn't find any dishes matching your criteria. Try adjusting your filters.</p>

            <Button variant='outline' onClick={onClearFilters}>
                Clear all filters
            </Button>
        </div>
    );
}

export default memo(FoodsEmpty);
