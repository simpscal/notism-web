import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2, Package, ShoppingBag, Utensils } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import {
    FoodCustomisationSection,
    FoodDetailSkeleton,
    FoodDetailError,
    FoodDetailEmpty,
    FoodDetailImageSection,
} from './components';

import { CartItemCustomisationModel, CartItemModel, FOOD_QUERY_KEYS, foodApi } from '@/apis';
import { ROUTES } from '@/app/constants';
import { formatVnd } from '@/app/utils';
import { Badge } from '@/components/badge';
import Banner from '@/components/banner';
import { Button } from '@/components/button';
import QuantityStepper from '@/components/quantity-stepper';
import { Separator } from '@/components/separator';
import { useCart } from '@/features/cart';
import { getFoodPricing } from '@/features/food';

function FoodDetail() {
    const { t } = useTranslation();
    const { addToCart } = useCart();
    const { id } = useParams<{ id: string }>();
    const [quantity, setQuantity] = useState(1);
    const [selections, setSelections] = useState<Record<string, string>>({});
    const [cartAdded, setCartAdded] = useState<{ quantity: number; displayedPrice: number } | null>(null);

    const {
        data: food,
        isLoading,
        isError,
    } = useQuery({
        queryKey: FOOD_QUERY_KEYS.detail(id ?? ''),
        queryFn: () => {
            if (!id) throw new Error('Food ID is required');
            return foodApi.getFoodById(id);
        },
        enabled: !!id,
    });

    const handleQuantityChange = useCallback((delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    }, []);

    const handleDecrement = useCallback(() => handleQuantityChange(-1), [handleQuantityChange]);
    const handleIncrement = useCallback(() => handleQuantityChange(1), [handleQuantityChange]);

    const handleSelectionChange = useCallback((groupId: string, value: string) => {
        setSelections(prev => ({ ...prev, [groupId]: value }));
    }, []);

    const handleDismissBanner = useCallback(() => setCartAdded(null), []);

    const { effectivePrice, hasSavings } = useMemo(
        () => getFoodPricing(food?.price ?? 0, food?.discountPrice ?? null),
        [food?.price, food?.discountPrice]
    );

    const selectedSurcharge = useMemo(
        () =>
            (food?.customisations ?? []).reduce((sum, group) => {
                const chosen = selections[group.id];
                if (!chosen) return sum;
                const opt = group.options.find(o => o.value === chosen);
                return sum + (opt?.surcharge ?? 0);
            }, 0),
        [food?.customisations, selections]
    );

    const displayedPrice = useMemo(() => effectivePrice + selectedSurcharge, [effectivePrice, selectedSurcharge]);

    const requiredIds = useMemo(
        () => (food?.customisations ?? []).filter(c => c.required).map(c => c.id),
        [food?.customisations]
    );

    const allRequiredMet = useMemo(() => requiredIds.every(rid => !!selections[rid]), [requiredIds, selections]);

    const hasCustomisations = useMemo(() => (food?.customisations ?? []).length > 0, [food?.customisations]);

    const handleAddToCart = useCallback(async () => {
        if (!food) return;

        const customisationsForCart: CartItemCustomisationModel[] = (food.customisations ?? [])
            .filter(g => selections[g.id])
            .map(g => {
                const opt = g.options.find(o => o.value === selections[g.id]);
                return {
                    groupId: g.id,
                    groupLabel: g.label,
                    optionId: opt?.value ?? null,
                    optionLabel: opt?.label ?? '',
                    surcharge: opt?.surcharge ?? null,
                    availableOptions: g.options.map(o => ({
                        id: o.value,
                        label: o.label,
                        surcharge: o.surcharge ?? null,
                    })),
                };
            });

        const cartItem: Omit<CartItemModel, 'quantity'> = {
            id: food.id,
            name: food.name,
            description: food.description,
            price: food.price,
            discountPrice: food.discountPrice,
            imageUrl: food.imageUrls[0] || '',
            category: food.category,
            stockQuantity: food.stockQuantity,
            quantityUnit: food.quantityUnit,
            customisations: customisationsForCart,
            totalSurcharge: customisationsForCart.reduce((sum, c) => sum + (c.surcharge ?? 0), 0),
        };

        await addToCart(cartItem, quantity);
        setCartAdded({ quantity, displayedPrice });
        setSelections({});
        setQuantity(1);
    }, [addToCart, food, quantity, displayedPrice, selections]);

    if (isError) {
        return <FoodDetailError />;
    }

    if (isLoading) {
        return <FoodDetailSkeleton />;
    }

    if (!food) {
        return <FoodDetailEmpty />;
    }

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

                {/* Success Banner — add-to-order feedback animates in 150–250ms
                    ease-out (motion-safe only → instant under reduced motion) */}
                {cartAdded && (
                    <div className='mb-6 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-1 motion-safe:duration-200 motion-safe:ease-out'>
                        <Banner
                            variant='success'
                            icon={<CheckCircle2 className='h-5 w-5' />}
                            message={
                                <span>
                                    {t('foodDetail.addedBanner', { name: food.name, qty: cartAdded.quantity })}
                                    <span className='ml-2 font-normal text-success/80'>
                                        {t('foodDetail.addedBannerTotal', {
                                            amount: formatVnd(cartAdded.displayedPrice * cartAdded.quantity),
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
                            onClose={handleDismissBanner}
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
                        {/* Category eyebrow — muted UPPERCASE (crimson is reserved for the commit CTA) */}
                        <span className='mb-3 inline-block text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground'>
                            {food.category}
                        </span>

                        {/* One display-weight title */}
                        <h1 className='text-[2rem] font-bold leading-tight tracking-tight text-foreground sm:text-[2.5rem]'>
                            {food.name}
                        </h1>

                        {/* Description */}
                        <p className='mt-4 text-base leading-relaxed text-muted-foreground'>{food.description}</p>

                        {/* Meta info */}
                        <div className='mt-5 flex flex-wrap gap-2'>
                            <Badge variant='secondary' className='gap-1.5 rounded-full px-3 py-1 text-xs font-medium'>
                                <Package className='h-3.5 w-3.5' />
                                {food.quantityUnit}
                            </Badge>
                            <Badge variant='secondary' className='gap-1.5 rounded-full px-3 py-1 text-xs font-medium'>
                                <Utensils className='h-3.5 w-3.5' />
                                {t('foodDetail.available', { qty: food.stockQuantity })}
                            </Badge>
                        </div>

                        {/* Price — bold ink; crimson is reserved for the commit CTA */}
                        <div className='mt-6'>
                            {hasSavings && (
                                <span className='mb-1 block text-base text-muted-foreground line-through'>
                                    {formatVnd(food.price)}
                                </span>
                            )}
                            {selectedSurcharge > 0 && (
                                <span className='mb-1 block text-sm text-muted-foreground'>
                                    {t('foodDetail.priceBase', {
                                        base: formatVnd(effectivePrice),
                                        surcharge: formatVnd(selectedSurcharge),
                                    })}
                                </span>
                            )}
                            <div className='flex items-baseline gap-3'>
                                <span className='text-3xl font-bold tabular-nums text-foreground'>
                                    {formatVnd(displayedPrice)}
                                </span>
                                {hasSavings && (
                                    <Badge variant='secondary' className='rounded-full text-xs font-semibold'>
                                        {t('cart.saveBadge', { amount: formatVnd(food.price - effectivePrice) })}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Customisation Section */}
                        {hasCustomisations && (
                            <>
                                <Separator className='my-7' />
                                <FoodCustomisationSection
                                    customisations={food.customisations}
                                    selections={selections}
                                    onChange={handleSelectionChange}
                                />
                            </>
                        )}

                        {/* Quantity & always-visible Add control — sticky on mobile, static on sm+ */}
                        <div className='sticky bottom-0 z-10 mt-8 border-t border-border bg-background pt-5 pb-1 sm:static sm:border-t-0 sm:pb-0'>
                            <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                                {/* Quantity — shared circular −/+ stepper */}
                                <QuantityStepper
                                    value={quantity}
                                    onDecrement={handleDecrement}
                                    onIncrement={handleIncrement}
                                    min={1}
                                    max={food.stockQuantity}
                                    label={t('foodDetail.quantityLabel')}
                                    decrementLabel={t('foodDetail.decreaseQuantity')}
                                    incrementLabel={t('foodDetail.increaseQuantity')}
                                    className='shrink-0'
                                />

                                {/* Add to order — CRIMSON split-pill (the one loudest red action): total left | divider | label right */}
                                <Button
                                    type='button'
                                    disabled={!food.isAvailable || !allRequiredMet}
                                    onClick={handleAddToCart}
                                    className='h-14 w-full gap-0 rounded-full bg-primary p-0 text-base text-primary-foreground transition-transform hover:bg-primary/90 motion-safe:duration-200 motion-safe:ease-out motion-safe:active:scale-[0.98] sm:flex-1'
                                >
                                    <span className='flex h-full items-center px-6 font-bold tabular-nums'>
                                        {formatVnd(displayedPrice * quantity)}
                                    </span>
                                    <span className='h-7 w-px shrink-0 bg-primary-foreground/25' aria-hidden />
                                    <span className='flex h-full flex-1 items-center justify-center gap-2 px-6 font-semibold'>
                                        <ShoppingBag className='h-5 w-5' />
                                        {t('foodDetail.addToOrder')}
                                    </span>
                                </Button>
                            </div>

                            {!allRequiredMet && requiredIds.length > 0 && (
                                <p className='mt-3 text-xs text-muted-foreground'>
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
