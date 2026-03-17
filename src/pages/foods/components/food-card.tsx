import { Package, ShoppingCart } from 'lucide-react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { FoodItemViewModel } from '../models';

import { ROUTES } from '@/app/constants';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardFooter, CardHeader } from '@/components/card';
import { getFoodPricing } from '@/features/food';
import { FoodImage } from '@/features/food/components';

interface FoodCardProps {
    food: FoodItemViewModel;
    onAddToCart?: (food: FoodItemViewModel) => void;
}

function FoodCard({ food, onAddToCart }: FoodCardProps) {
    const navigate = useNavigate();
    const { effectivePrice, hasSavings } = getFoodPricing(food.price, food.discountPrice);
    const discountPercentage = hasSavings ? Math.round(((food.price - effectivePrice) / food.price) * 100) : 0;

    const handleCardClick = () => {
        navigate(`/${ROUTES.FOODS.DETAIL(food.id)}`);
    };

    const handleAddToCartClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddToCart?.(food);
    };

    return (
        <Card
            className='group relative flex flex-col overflow-hidden border-2 pt-0 transition-all hover:border-primary/50 sm:border lg:border'
            onClick={handleCardClick}
        >
            {/* Image Container */}
            <div className='relative aspect-[4/3] overflow-hidden bg-muted'>
                <FoodImage
                    src={food.imageUrl}
                    alt={food.name}
                    className='absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
                />
                {hasSavings && (
                    <div className='absolute top-2 right-2 rounded-md bg-destructive px-2 py-0.5 text-xs font-semibold text-white sm:top-2.5 sm:right-2.5'>
                        -{discountPercentage}%
                    </div>
                )}
            </div>

            {/* Content */}
            <CardHeader className='flex flex-1 flex-col gap-2 pb-3 sm:pb-4'>
                <div className='flex items-start justify-between gap-2'>
                    <h3 className='line-clamp-2 flex-1 text-sm font-semibold leading-tight sm:text-base'>
                        {food.name}
                    </h3>
                    <Badge variant='secondary' className='shrink-0 text-xs'>
                        {food.category}
                    </Badge>
                </div>
                <p className='line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-muted-foreground'>
                    {food.description}
                </p>

                {/* Additional Info */}
                <div className='flex min-h-[1.25rem] flex-wrap items-center gap-3 text-xs'>
                    <div className='flex items-center gap-1.5'>
                        <Package
                            className='h-3.5 w-3.5 shrink-0 text-muted-foreground sm:h-4 sm:w-4'
                            aria-hidden='true'
                        />
                        <span className='text-muted-foreground'>
                            <span className='sr-only'>Quantity unit: </span>
                            {food.quantityUnit}
                        </span>
                    </div>
                    {!food.isAvailable && (
                        <span className='text-destructive'>
                            <span className='sr-only'>Status: </span>
                            Out of Stock
                        </span>
                    )}
                </div>
            </CardHeader>

            {/* Price & Actions */}
            <CardFooter className='mt-auto flex items-center justify-between gap-3 border-t pt-3 sm:gap-4 sm:pt-4'>
                <div className='flex min-h-[2rem] flex-col justify-center'>
                    {hasSavings && <span className='text-xs line-through opacity-60'>${food.price.toFixed(2)}</span>}
                    <span className='text-lg font-bold sm:text-xl'>${effectivePrice.toFixed(2)}</span>
                </div>

                <div className='flex shrink-0'>
                    <Button
                        size='sm'
                        className='h-8 px-3 text-xs sm:h-9 sm:px-4'
                        disabled={!food.isAvailable}
                        onClick={handleAddToCartClick}
                    >
                        <ShoppingCart className='mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4' />
                        Add
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

export default memo(FoodCard);
