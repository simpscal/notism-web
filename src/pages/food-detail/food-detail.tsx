import { ArrowLeft, Package, Flame, Minus, Plus, ShoppingCart, Star, Utensils } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { FoodDetailViewModel } from './models';

import { foodApi } from '@/apis';
import { cn } from '@/app/utils/tailwind.utils';
import { Button } from '@/components/button';
import { Skeleton } from '@/components/skeleton';

function FoodDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [food, setFood] = useState<FoodDetailViewModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (!id) return;

        setIsLoading(true);
        foodApi
            .getFoodById(id)
            .then(response => {
                setFood(response);
            })
            .catch(() => {
                toast.error('Failed to load food details');
                navigate('/foods');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [id, navigate]);

    const handleQuantityChange = useCallback((delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    }, []);

    const handleAddToCart = useCallback(() => {
        if (!food) return;
        toast.success(`${quantity}x ${food.name} added to cart!`, {
            description: `Total: $${((food.discountPrice ?? food.price) * quantity).toFixed(2)}`,
        });
    }, [food, quantity]);

    const hasDiscount =
        food?.discountPrice !== null && food?.discountPrice !== undefined && food?.discountPrice < food?.price;
    const effectivePrice = hasDiscount ? food!.discountPrice! : (food?.price ?? 0);
    const discountPercentage = hasDiscount ? Math.round(((food!.price - food!.discountPrice!) / food!.price) * 100) : 0;

    if (isLoading) {
        return (
            <div className='min-h-screen bg-background'>
                <div className='container mx-auto px-4 py-8'>
                    <Skeleton className='mb-8 h-10 w-32 bg-muted' />
                    <div className='grid gap-8 lg:grid-cols-2'>
                        <Skeleton className='aspect-square w-full rounded-3xl bg-muted' />
                        <div className='space-y-6'>
                            <Skeleton className='h-12 w-3/4 bg-muted' />
                            <Skeleton className='h-6 w-1/4 bg-muted' />
                            <Skeleton className='h-24 w-full bg-muted' />
                            <Skeleton className='h-16 w-1/2 bg-muted' />
                            <Skeleton className='h-14 w-full bg-muted' />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!food) {
        return null;
    }

    return (
        <div className='min-h-screen bg-background'>
            {/* Background decoration */}
            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl' />
                <div className='absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl' />
            </div>

            <div className='container relative mx-auto px-4 py-8'>
                {/* Back Button */}
                <Button
                    variant='ghost'
                    className='mb-8 text-muted-foreground hover:bg-secondary hover:text-foreground'
                    onClick={() => navigate('/foods')}
                >
                    <ArrowLeft className='mr-2 h-4 w-4' />
                    Back to Menu
                </Button>

                <div className='grid gap-8 lg:grid-cols-2 lg:gap-12'>
                    {/* Image Section */}
                    <div className='relative'>
                        <div className='relative aspect-square overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-secondary shadow-2xl'>
                            <img
                                src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'}
                                alt={food.name}
                                className='h-full w-full object-cover'
                            />

                            {/* Badges */}
                            {hasDiscount && (
                                <div className='absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-destructive px-3 py-1.5 shadow-lg'>
                                    <Flame className='h-4 w-4 text-foreground' />
                                    <span className='text-sm font-bold text-foreground'>{discountPercentage}% OFF</span>
                                </div>
                            )}

                            {!food.isAvailable && (
                                <div className='absolute inset-0 flex items-center justify-center bg-card/80'>
                                    <span className='rounded-full bg-muted px-6 py-3 text-lg font-semibold text-foreground'>
                                        Out of Stock
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className='flex flex-col'>
                        {/* Category */}
                        <span className='mb-3 inline-flex w-fit items-center rounded-full bg-primary/20 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-primary'>
                            {food.category}
                        </span>

                        {/* Title */}
                        <h1 className='mb-4 text-4xl font-black text-foreground lg:text-5xl'>{food.name}</h1>

                        {/* Rating (placeholder) */}
                        <div className='mb-6 flex items-center gap-2'>
                            <div className='flex items-center gap-0.5'>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn('h-5 w-5', i < 4 ? 'fill-primary text-primary' : 'text-muted')}
                                    />
                                ))}
                            </div>
                            <span className='text-sm text-muted-foreground'>(128 reviews)</span>
                        </div>

                        {/* Description */}
                        <p className='mb-8 text-lg leading-relaxed text-muted-foreground'>{food.description}</p>

                        {/* Meta info */}
                        <div className='mb-8 flex flex-wrap gap-4'>
                            <div className='flex items-center gap-2 rounded-xl bg-secondary/50 px-4 py-2'>
                                <Package className='h-5 w-5 text-primary' />
                                <span className='text-secondary-foreground'>
                                    <span className='font-semibold text-foreground'>{food.quantityUnit}</span> unit
                                </span>
                            </div>
                            <div className='flex items-center gap-2 rounded-xl bg-secondary/50 px-4 py-2'>
                                <Utensils className='h-5 w-5 text-primary' />
                                <span className='text-secondary-foreground'>
                                    <span className='font-semibold text-foreground'>{food.stockQuantity}</span>{' '}
                                    available
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className='mb-8'>
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
                        <div className='mt-auto flex flex-col gap-4 sm:flex-row sm:items-center'>
                            {/* Quantity Selector */}
                            <div className='flex items-center rounded-xl border border-border bg-secondary/50'>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-14 w-14 rounded-l-xl text-muted-foreground hover:bg-muted hover:text-foreground'
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className='h-5 w-5' />
                                </Button>
                                <span className='w-14 text-center text-xl font-bold text-foreground'>{quantity}</span>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-14 w-14 rounded-r-xl text-muted-foreground hover:bg-muted hover:text-foreground'
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
                                className='h-14 flex-1 rounded-xl text-lg font-bold'
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className='mr-2 h-5 w-5' />
                                Add to Cart - ${(effectivePrice * quantity).toFixed(2)}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(FoodDetail);
