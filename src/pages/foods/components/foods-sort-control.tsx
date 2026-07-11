import { ArrowUpDown } from 'lucide-react';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { FoodSortOption } from '../enums';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';

interface FoodsSortControlProps {
    sortBy: FoodSortOption;
    onSortChange: (sort: FoodSortOption) => void;
}

function FoodsSortControl({ sortBy, onSortChange }: FoodsSortControlProps) {
    const { t } = useTranslation();

    const handleValueChange = useCallback(
        (value: string) => {
            onSortChange(value as FoodSortOption);
        },
        [onSortChange]
    );

    return (
        <Select value={sortBy} onValueChange={handleValueChange}>
            <SelectTrigger size='sm' aria-label={t('foods.sidebar.sortBy')} className='h-9 gap-2 rounded-full'>
                <ArrowUpDown className='h-3.5 w-3.5 text-muted-foreground' />
                <span className='hidden sm:inline'>
                    <SelectValue placeholder={t('foods.sidebar.sortBy')} />
                </span>
            </SelectTrigger>
            <SelectContent align='end'>
                <SelectItem value='default'>{t('foods.sidebar.default')}</SelectItem>
                <SelectItem value='price-asc'>{t('foods.sidebar.priceLowHigh')}</SelectItem>
                <SelectItem value='price-desc'>{t('foods.sidebar.priceHighLow')}</SelectItem>
                <SelectItem value='name-asc'>{t('foods.sidebar.nameAZ')}</SelectItem>
            </SelectContent>
        </Select>
    );
}

export default memo(FoodsSortControl);
