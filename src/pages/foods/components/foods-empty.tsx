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
            <div className='mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-muted'>
                <UtensilsCrossed className='h-9 w-9 text-muted-foreground' aria-hidden />
            </div>
            <h3 className='mb-2 text-xl font-semibold text-foreground'>{t('foods.empty.title')}</h3>
            <p className='mb-6 max-w-sm text-sm text-muted-foreground'>{t('foods.empty.description')}</p>

            <Button onClick={onClearFilters}>{t('foods.empty.showAll')}</Button>
        </div>
    );
}

export default memo(FoodsEmpty);
