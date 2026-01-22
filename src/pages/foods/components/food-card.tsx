import { Package, ShoppingCart, Flame } from 'lucide-react';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

import { FoodItemViewModel } from '../models';

import { ROUTES } from '@/app/constants';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardFooter, CardHeader } from '@/components/card';

interface FoodCardProps {
    food: FoodItemViewModel;
    onAddToCart?: (food: FoodItemViewModel) => void;
}

function FoodCard({ food, onAddToCart }: FoodCardProps) {
    const navigate = useNavigate();
    const hasDiscount = food.discountPrice !== null && food.discountPrice < food.price;
    const effectivePrice = hasDiscount ? food.discountPrice! : food.price;
    const discountPercentage = hasDiscount ? Math.round(((food.price - food.discountPrice!) / food.price) * 100) : 0;

    const handleCardClick = () => {
        navigate(`/${ROUTES.FOODS.DETAIL(food.id)}`);
    };

    const handleAddToCartClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddToCart?.(food);
    };

    return (
        <Card
            className='group relative flex flex-col overflow-hidden pt-0 cursor-pointer transition-shadow hover:shadow-lg'
            onClick={handleCardClick}
        >
            {/* Image Container */}
            <div className='relative aspect-[4/3] overflow-hidden'>
                <img
                    src={food.imageUrl}
                    alt={food.name}
                    className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
                />
            </div>

            {/* Content */}
            <CardHeader className='flex flex-1 flex-col pb-4'>
                <div className='mb-2 flex items-center justify-between gap-2'>
                    <h3 className='line-clamp-1 flex-1 text-lg font-bold'>{food.name}</h3>
                    <Badge variant='secondary' className='shrink-0'>
                        {food.category}
                    </Badge>
                </div>
                <p className='mb-3 min-h-[2.5rem] line-clamp-2 text-sm leading-relaxed'>{food.description}</p>

                {/* Additional Info */}
                <div className='flex min-h-[1.5rem] flex-wrap items-center gap-4 text-xs'>
                    <div className='flex items-center gap-1.5'>
                        <Package className='h-4 w-4 shrink-0' aria-hidden='true' />
                        <span>
                            <span className='sr-only'>Quantity unit: </span>
                            {food.quantityUnit}
                        </span>
                    </div>
                    {hasDiscount && (
                        <div className='flex items-center gap-1.5'>
                            <Flame className='h-4 w-4 shrink-0' aria-hidden='true' />
                            <span>
                                <span className='sr-only'>Discount: </span>
                                {discountPercentage}% OFF
                            </span>
                        </div>
                    )}
                    {!food.isAvailable && (
                        <span>
                            <span className='sr-only'>Status: </span>
                            Out of Stock
                        </span>
                    )}
                </div>
            </CardHeader>

            {/* Price & Actions */}
            <CardFooter className='mt-auto flex items-end justify-between gap-4 pt-0'>
                <div className='flex min-h-[2.5rem] flex-col justify-end'>
                    {hasDiscount && <span className='text-sm line-through opacity-60'>${food.price.toFixed(2)}</span>}
                    <span className='text-2xl font-black'>${effectivePrice.toFixed(2)}</span>
                </div>

                <div className='flex shrink-0'>
                    <Button size='sm' disabled={!food.isAvailable} onClick={handleAddToCartClick}>
                        <ShoppingCart className='mr-1.5 h-4 w-4' />
                        Add
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

export default memo(FoodCard);
