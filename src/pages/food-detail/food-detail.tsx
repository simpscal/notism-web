import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Package, Minus, Plus, ShoppingCart, Utensils } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { FoodDetailSkeleton, FoodDetailError, FoodDetailEmpty, FoodDetailImageSection } from './components';

import { foodApi } from '@/apis';
import { ROUTES } from '@/app/constants';
import { formatVnd } from '@/app/utils';
import { Button } from '@/components/button';
import { CartItemViewModel, useCart } from '@/features/cart';
import { getFoodPricing } from '@/features/food';

function FoodDetail() {
    const { t } = useTranslation();
    const { addToCart } = useCart();
    const { id } = useParams<{ id: string }>();
    const [quantity, setQuantity] = useState(1);

    const {
        data: food,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['foods', 'detail', id] as const,
        queryFn: () => {
            if (!id) throw new Error('Food ID is required');
            return foodApi.getFoodById(id);
        },
        enabled: !!id,
    });

    const handleQuantityChange = useCallback((delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    }, []);

    const handleAddToCart = useCallback(async () => {
        if (!food) return;
        const { effectivePrice } = getFoodPricing(food.price, food.discountPrice);
        const cartItem: Omit<CartItemViewModel, 'quantity'> = {
            id: food.id,
            name: food.name,
            description: food.description,
            price: food.price,
            discountPrice: food.discountPrice,
            imageUrl: food.imageUrls[0] || '',
            category: food.category,
            stockQuantity: food.stockQuantity,
            quantityUnit: food.quantityUnit,
        };

        await addToCart(cartItem, quantity);
        toast.success(t('foodDetail.addedToCart', { qty: quantity, name: food.name }), {
            description: t('foodDetail.total', { amount: formatVnd(effectivePrice * quantity) }),
        });
    }, [addToCart, food, quantity]);

    if (isError) {
        return <FoodDetailError />;
    }

    if (isLoading) {
        return <FoodDetailSkeleton />;
    }

    if (!food) {
        return <FoodDetailEmpty />;
    }

    const { effectivePrice, hasSavings } = getFoodPricing(food.price, food.discountPrice);

    return (
        <div className='bg-background'>
            <div className='container mx-auto px-4 py-8'>
                {/* Back Button */}
                <Link
                    to={`/${ROUTES.FOODS.LIST}`}
                    className='mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
                >
                    <ArrowLeft className='h-4 w-4' />
                    {t('foodDetail.backToMenu')}
                </Link>

                <div className='grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16'>
                    {/* Image Section */}
                    <FoodDetailImageSection
                        imageUrls={food.imageUrls}
                        foodName={food.name}
                        isAvailable={food.isAvailable}
                    />

                    {/* Details Section */}
                    <div className='flex flex-col'>
                        {/* Category */}
                        <span className='mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary'>
                            {food.category}
                        </span>

                        {/* Title */}
                        <h1 className='mb-2 text-4xl font-bold leading-tight text-foreground lg:text-5xl xl:text-6xl'>
                            {food.name}
                        </h1>

                        <hr className='border-border my-6' />

                        {/* Description */}
                        <p className='mb-6 text-base leading-relaxed text-muted-foreground'>{food.description}</p>

                        {/* Meta info */}
                        <div className='mb-6 flex flex-wrap gap-3'>
                            <div className='flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium'>
                                <Package className='h-4 w-4' />
                                <span>{food.quantityUnit}</span>
                            </div>
                            <div className='flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium'>
                                <Utensils className='h-4 w-4' />
                                <span>{t('foodDetail.available', { qty: food.stockQuantity })}</span>
                            </div>
                        </div>

                        {/* Price */}
                        <hr className='border-border mb-6' />
                        <div className='mb-8'>
                            {hasSavings && (
                                <span className='mb-2 block text-base text-muted-foreground line-through'>
                                    {formatVnd(food.price)}
                                </span>
                            )}
                            <div className='flex items-baseline gap-3'>
                                <span className='font-sans text-6xl font-bold text-primary tabular-nums'>
                                    {formatVnd(effectivePrice)}
                                </span>
                                {hasSavings && (
                                    <span className='rounded-full bg-destructive/20 px-3 py-1 text-sm font-semibold text-destructive'>
                                        {t('cart.saveBadge', { amount: formatVnd(food.price - effectivePrice) })}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                            {/* Quantity Selector */}
                            <div className='flex items-center justify-between rounded-full bg-muted px-1 py-1 shrink-0 h-10'>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8 rounded-full'
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className='h-4 w-4' />
                                </Button>
                                <span className='w-10 text-center text-sm font-bold text-foreground'>{quantity}</span>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8 rounded-full'
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= food.stockQuantity}
                                >
                                    <Plus className='h-4 w-4' />
                                </Button>
                            </div>

                            {/* Add to Cart Button */}
                            <Button
                                variant='default'
                                size='lg'
                                disabled={!food.isAvailable}
                                className='flex-1 rounded-full'
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className='h-5 w-5 shrink-0' />
                                <span className='truncate'>
                                    {t('foodDetail.addToCart', { price: formatVnd(effectivePrice * quantity) })}
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(FoodDetail);
