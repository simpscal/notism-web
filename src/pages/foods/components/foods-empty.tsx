import { UtensilsCrossed } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';

interface FoodsEmptyProps {
    onClearFilters: () => void;
}

function FoodsEmpty({ onClearFilters }: FoodsEmptyProps) {
    const { t } = useTranslation();
    return (
        <div className='flex flex-col items-center justify-center py-20 text-center'>
            <div className='mb-4 rounded-full p-6'>
                <UtensilsCrossed className='h-12 w-12' />
            </div>
            <h3 className='mb-2 text-xl font-semibold'>{t('foods.empty.title')}</h3>
            <p className='mb-6'>{t('foods.empty.description')}</p>

            <Button variant='outline' onClick={onClearFilters}>
                {t('foods.empty.clearFilters')}
            </Button>
        </div>
    );
}

export default memo(FoodsEmpty);
