import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2, Minus, Package, Plus, ShoppingCart, Utensils } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import {
    CustomisationSection,
    FoodDetailSkeleton,
    FoodDetailError,
    FoodDetailEmpty,
    FoodDetailImageSection,
} from './components';

import { foodApi } from '@/apis';
import { ROUTES } from '@/app/constants';
import { formatVnd } from '@/app/utils';
import Banner from '@/components/banner';
import { Button } from '@/components/button';
import { CartItemViewModel, useCart } from '@/features/cart';
import { getFoodPricing } from '@/features/food';

function FoodDetail() {
    const { t } = useTranslation();
    const { addToCart } = useCart();
    const { id } = useParams<{ id: string }>();
    const [quantity, setQuantity] = useState(1);
    const [selections, setSelections] = useState<Record<string, string>>({});
    const [cartAdded, setCartAdded] = useState<{ quantity: number } | null>(null);

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

    const handleSelectionChange = useCallback((groupId: string, value: string) => {
        setSelections(prev => ({ ...prev, [groupId]: value }));
    }, []);

    const handleAddToCart = useCallback(async () => {
        if (!food) return;
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

        try {
            await addToCart(cartItem, quantity);
            setCartAdded({ quantity });
            setSelections({});
            setQuantity(1);
        } catch {
            toast.error(t('foodDetail.error.title'), {
                description: t('foodDetail.error.description'),
            });
        }
    }, [addToCart, food, quantity, t]);

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

    const requiredIds = (food.customisations ?? []).filter(c => c.required).map(c => c.id);
    const allRequiredMet = requiredIds.every(id => !!selections[id]);
    const hasCustomisations = (food.customisations ?? []).length > 0;

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

                {/* Success Banner */}
                {cartAdded && (
                    <div className='mb-6'>
                        <Banner
                            variant='success'
                            icon={<CheckCircle2 className='h-5 w-5' />}
                            message={
                                <span>
                                    {t('foodDetail.addedBanner', { name: food.name, qty: cartAdded.quantity })}
                                    <span className='ml-2 font-normal text-success/80'>
                                        {t('foodDetail.addedBannerTotal', {
                                            amount: formatVnd(effectivePrice * cartAdded.quantity),
                                        })}
                                    </span>
                                </span>
                            }
                            action={
                                <Button
                                    variant='outline'
                                    size='sm'
                                    asChild
                                    className='border-success/40 text-success hover:bg-success/10'
                                >
                                    <Link to={`/${ROUTES.CART}`}>{t('foodDetail.viewCart')}</Link>
                                </Button>
                            }
                            onClose={() => setCartAdded(null)}
                        />
                    </div>
                )}

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

                        {/* Customisation Section */}
                        {hasCustomisations && (
                            <div className='mb-8'>
                                <CustomisationSection
                                    customisations={food.customisations}
                                    selections={selections}
                                    onChange={handleSelectionChange}
                                />
                            </div>
                        )}

                        {/* Quantity & Add to Cart — sticky on mobile, static on sm+ */}
                        <div className='sticky bottom-0 z-10 border-t bg-background py-4 sm:static sm:border-t-0 sm:py-0'>
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
                                    <span className='w-10 text-center text-sm font-bold text-foreground'>
                                        {quantity}
                                    </span>
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
                                    disabled={!food.isAvailable || !allRequiredMet}
                                    className='w-full rounded-full sm:flex-1'
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCart className='h-5 w-5 shrink-0' />
                                    <span className='truncate'>
                                        {t('foodDetail.addToCart', { price: formatVnd(effectivePrice * quantity) })}
                                    </span>
                                </Button>
                            </div>

                            {!allRequiredMet && requiredIds.length > 0 && (
                                <p className='mt-2 text-xs text-muted-foreground'>
                                    {t('foodDetail.selectAllRequired')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(FoodDetail);
