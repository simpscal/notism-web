import { ShoppingCart } from 'lucide-react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { FoodItemViewModel } from '../models';

import { ROUTES } from '@/app/constants';
import { Button } from '@/components/button';
import { Card, CardFooter } from '@/components/card';
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

    const handleAddToCartClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddToCart?.(food);
    };

    const handleViewDetails = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/${ROUTES.FOODS.DETAIL(food.id)}`);
    };

    return (
        <Card className='group relative flex flex-col overflow-hidden border pt-0 transition-all hover:border-primary/40 hover:shadow-lg'>
            {/* Image Container */}
            <div className='relative aspect-square cursor-pointer overflow-hidden bg-muted' onClick={handleViewDetails}>
                <FoodImage
                    src={food.imageUrl}
                    alt={food.name}
                    className='absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                />

                {/* Discount badge */}
                {hasSavings && (
                    <div className='absolute top-2 left-2 rounded-full bg-destructive px-2.5 py-0.5 text-xs font-bold text-white shadow-sm'>
                        -{discountPercentage}%
                    </div>
                )}

                {/* Category badge */}
                <div className='absolute bottom-2 left-2 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm'>
                    {food.category}
                </div>

                {/* Out of stock overlay */}
                {!food.isAvailable && (
                    <div className='absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]'>
                        <span className='rounded-full bg-background px-3 py-1 text-xs font-semibold text-destructive shadow-sm'>
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <CardFooter className='flex flex-1 flex-col gap-3 p-3 sm:p-4'>
                <div className='flex-1'>
                    <h3
                        className='mb-1 cursor-pointer truncate text-sm font-semibold leading-tight hover:text-primary sm:text-base'
                        onClick={handleViewDetails}
                        title={food.name}
                    >
                        {food.name}
                    </h3>
                    <p className='line-clamp-2 text-xs leading-relaxed text-muted-foreground'>{food.description}</p>
                </div>

                <div className='flex items-center justify-between gap-2'>
                    <div className='flex flex-col'>
                        {hasSavings && (
                            <span className='text-xs line-through text-muted-foreground'>${food.price.toFixed(2)}</span>
                        )}
                        <span className='text-base font-bold sm:text-lg'>${effectivePrice.toFixed(2)}</span>
                    </div>

                    <Button
                        variant='default'
                        size='sm'
                        className='shrink-0'
                        disabled={!food.isAvailable}
                        onClick={handleAddToCartClick}
                    >
                        <ShoppingCart className='mr-1.5 h-3.5 w-3.5' />
                        Add
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

export default memo(FoodCard);
