import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Package, Minus, Plus, ShoppingCart, Utensils } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { FoodDetailSkeleton, FoodDetailError, FoodDetailEmpty, FoodDetailImageSection } from './components';

import { foodApi } from '@/apis';
import { ROUTES } from '@/app/constants';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { CartItemViewModel, useCart } from '@/features/cart';

function FoodDetail() {
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
        const effectivePrice = food.discountPrice ?? food.price;
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
        toast.success(`${quantity}x ${food.name} added to cart!`, {
            description: `Total: $${(effectivePrice * quantity).toFixed(2)}`,
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

    const hasDiscount = food.discountPrice !== null && food.discountPrice < food.price;
    const effectivePrice = hasDiscount ? food.discountPrice! : food.price;

    return (
        <div className='bg-background'>
            <div className='container mx-auto px-4 py-8'>
                {/* Back Button */}
                <Button variant='ghost' className='mb-8' asChild>
                    <Link to={`/${ROUTES.FOODS.LIST}`}>
                        <ArrowLeft className='mr-2 h-4 w-4' />
                        Back to Menu
                    </Link>
                </Button>

                <div className='grid gap-8 lg:grid-cols-2 lg:gap-12'>
                    {/* Image Section */}
                    <FoodDetailImageSection
                        imageUrls={food.imageUrls}
                        foodName={food.name}
                        isAvailable={food.isAvailable}
                    />

                    {/* Details Section */}
                    <div className='flex flex-col'>
                        {/* Category */}
                        <span className='mb-3 inline-flex w-fit items-center rounded-full bg-primary/20 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-primary'>
                            {food.category}
                        </span>

                        {/* Title */}
                        <h1 className='mb-4 text-4xl font-black text-foreground lg:text-5xl'>{food.name}</h1>

                        {/* Description */}
                        <p className='mb-8 text-lg leading-relaxed text-muted-foreground'>{food.description}</p>

                        {/* Meta info */}
                        <div className='mb-8 flex flex-wrap gap-4'>
                            <Badge variant='secondary' className='flex items-center gap-2'>
                                <Package className='h-5 w-5' />
                                <span className='font-semibold'>{food.quantityUnit}</span>
                            </Badge>
                            <Badge variant='secondary' className='flex items-center gap-2'>
                                <Utensils className='h-5 w-5' />
                                <span className='font-semibold'>{food.stockQuantity} available</span>
                            </Badge>
                        </div>

                        {/* Price */}
                        <div className='mb-6'>
                            {hasDiscount && (
                                <span className='mb-1 block text-xl text-muted-foreground line-through'>
                                    ${food.price.toFixed(2)}
                                </span>
                            )}
                            <div className='flex items-baseline gap-2'>
                                <span className='text-5xl font-black text-primary'>${effectivePrice.toFixed(2)}</span>
                                {hasDiscount && (
                                    <span className='rounded-full bg-destructive/20 px-2 py-0.5 text-sm font-semibold text-destructive'>
                                        Save ${(food.price - effectivePrice).toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className='flex flex-col gap-4 sm:flex-row sm:items-start'>
                            {/* Quantity Selector */}
                            <div className='flex items-center justify-between rounded-xl border border-border bg-secondary/50 shrink-0 h-10'>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='rounded-l-xl sm:w-10'
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className='h-5 w-5' />
                                </Button>
                                <span className='w-14 text-center text-xl font-bold text-foreground flex items-center justify-center'>
                                    {quantity}
                                </span>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='rounded-r-xl sm:w-10'
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= food.stockQuantity}
                                >
                                    <Plus className='h-5 w-5' />
                                </Button>
                            </div>

                            {/* Add to Cart Button */}
                            <Button
                                size='lg'
                                disabled={!food.isAvailable}
                                className='shrink-0'
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className='mr-2 h-5 w-5 shrink-0' />
                                <span className='truncate'>
                                    <span className='hidden sm:inline'>Add to Cart - </span>$
                                    {(effectivePrice * quantity).toFixed(2)}
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
