import { Plus } from 'lucide-react';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { FoodItemViewModel } from '../models';

import { ROUTES } from '@/app/constants';
import { formatVnd } from '@/app/utils';
import { Badge } from '@/components/badge';
import { getFoodPricing } from '@/features/food';
import { FoodImage } from '@/features/food/components';

interface FoodCardProps {
    food: FoodItemViewModel;
}

function FoodCard({ food }: FoodCardProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { effectivePrice, hasSavings } = getFoodPricing(food.price, food.discountPrice);
    const discountPercentage = hasSavings ? Math.round(((food.price - effectivePrice) / food.price) * 100) : 0;

    const handleSelect = useCallback(() => {
        navigate(`/${ROUTES.FOODS.DETAIL(food.id)}`);
    }, [navigate, food.id]);

    const action = food.isAvailable ? t('foods.card.viewDish') : t('foods.card.outOfStock');

    return (
        <button
            type='button'
            disabled={!food.isAvailable}
            onClick={handleSelect}
            aria-label={`${food.name}, ${formatVnd(effectivePrice)}, ${action}`}
            className='group bg-background focus-visible:ring-primary relative flex aspect-[4/5] w-full flex-col justify-end overflow-hidden rounded-xl border border-black/[0.06] text-left transition-shadow duration-200 ease-out hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-80'
        >
            <FoodImage
                src={food.imageUrl}
                alt={food.name}
                loading='lazy'
                className='absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100'
            />

            <div
                className='absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/35 to-transparent'
                aria-hidden
            />

            {hasSavings && food.isAvailable && (
                <Badge className='absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-bold shadow-sm'>
                    -{discountPercentage}%
                </Badge>
            )}

            {!food.isAvailable && (
                <div className='absolute inset-0 flex items-center justify-center bg-black/45'>
                    <span className='rounded-full bg-background px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm'>
                        {t('foods.card.outOfStock')}
                    </span>
                </div>
            )}

            <div className='relative z-10 flex items-end justify-between gap-3 p-4'>
                <div className='min-w-0'>
                    <span className='mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white/70'>
                        {food.category}
                    </span>
                    <h3 className='truncate text-base font-bold leading-tight text-white' title={food.name}>
                        {food.name}
                    </h3>
                    <p className='mt-1 flex items-baseline gap-2'>
                        <span className='text-lg font-bold text-primary'>{formatVnd(effectivePrice)}</span>
                        {hasSavings && (
                            <span className='text-xs text-white/50 line-through'>{formatVnd(food.price)}</span>
                        )}
                    </p>
                </div>

                {food.isAvailable && (
                    <span
                        className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background shadow-sm transition-transform duration-200 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100'
                        aria-hidden
                    >
                        <Plus className='h-5 w-5' />
                    </span>
                )}
            </div>
        </button>
    );
}

export default memo(FoodCard);
