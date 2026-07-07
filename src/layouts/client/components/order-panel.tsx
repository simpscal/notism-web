import { ShoppingBag, Trash2, UtensilsCrossed } from 'lucide-react';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { CartItemModel } from '@/apis';
import { formatVnd } from '@/app/utils';
import { Button } from '@/components/button';
import QuantityStepper from '@/components/quantity-stepper';
import { ScrollArea } from '@/components/scroll-area';
import { getFoodPricing } from '@/features/food';

interface OrderLineRowProps {
    item: CartItemModel;
    onIncrement: (id: string) => void;
    onDecrement: (id: string) => void;
    onRemove: (id: string) => void;
}

// A white line-item card: circular thumbnail, name + meta, crimson line price,
// the shared black-ink QuantityStepper, and a destructive Remove set apart.
function OrderLineRowComponent({ item, onIncrement, onDecrement, onRemove }: OrderLineRowProps) {
    const { t } = useTranslation();
    const { effectivePrice } = getFoodPricing(item.price, item.discountPrice);
    const lineTotal = (effectivePrice + item.totalSurcharge) * item.quantity;

    const handleIncrement = useCallback(() => onIncrement(item.id), [onIncrement, item.id]);
    const handleDecrement = useCallback(() => onDecrement(item.id), [onDecrement, item.id]);
    const handleRemove = useCallback(() => onRemove(item.id), [onRemove, item.id]);

    return (
        <div className='flex items-start gap-3 rounded-2xl border border-border bg-card p-3'>
            <span className='flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground'>
                {item.imageUrl ? (
                    <img src={item.imageUrl} alt='' className='size-full object-cover' />
                ) : (
                    <UtensilsCrossed className='size-5' aria-hidden />
                )}
            </span>
            <div className='min-w-0 flex-1'>
                <div className='flex items-start justify-between gap-2'>
                    <p className='truncate text-sm font-semibold text-foreground'>{item.name}</p>
                    <p className='shrink-0 text-sm font-semibold text-primary'>{formatVnd(lineTotal)}</p>
                </div>
                {item.category && <p className='mt-0.5 text-xs text-muted-foreground'>{item.category}</p>}
                <div className='mt-2 flex items-center justify-between'>
                    <QuantityStepper
                        value={item.quantity}
                        onIncrement={handleIncrement}
                        onDecrement={handleDecrement}
                        max={item.stockQuantity}
                        label={item.name}
                        decrementLabel={`Decrease ${item.name}`}
                        incrementLabel={`Increase ${item.name}`}
                    />
                    <button
                        type='button'
                        aria-label={t('orderSidebar.removeItem', { name: item.name })}
                        onClick={handleRemove}
                        className='rounded-full p-1.5 text-muted-foreground/70 transition-colors hover:bg-destructive/10 hover:text-destructive'
                    >
                        <Trash2 className='size-4' aria-hidden />
                    </button>
                </div>
            </div>
        </div>
    );
}

const OrderLineRow = memo(OrderLineRowComponent);

interface OrderPanelProps {
    items: CartItemModel[];
    totalItems: number;
    totalPrice: number;
    onIncrement: (id: string) => void;
    onDecrement: (id: string) => void;
    onRemove: (id: string) => void;
    onCheckout: () => void;
    onBrowseMenu: () => void;
}

// The shared Summary Panel body — rendered by both the persistent desktop
// sidebar and the mobile drawer. Header + footer stay pinned; only the line
// list scrolls. The running total is the crimson accent and the checkout is the
// single loud commit; an empty order shows one browse CTA, never a dead end.
function OrderPanelComponent({
    items,
    totalItems,
    totalPrice,
    onIncrement,
    onDecrement,
    onRemove,
    onCheckout,
    onBrowseMenu,
}: OrderPanelProps) {
    const { t } = useTranslation();

    if (items.length === 0) {
        return (
            <div className='flex h-full min-h-0 flex-col'>
                <div className='flex shrink-0 items-center justify-between'>
                    <h2 className='text-lg font-semibold tracking-tight text-foreground'>{t('orderSidebar.title')}</h2>
                </div>
                <div className='flex flex-1 flex-col items-center justify-center px-2 py-10 text-center'>
                    <span className='mb-4 flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground'>
                        <ShoppingBag className='size-7' aria-hidden />
                    </span>
                    <p className='text-base font-semibold text-foreground'>{t('orderSidebar.empty.title')}</p>
                    <p className='mt-1 max-w-[15rem] text-sm text-muted-foreground'>
                        {t('orderSidebar.empty.description')}
                    </p>
                    <Button className='mt-5 rounded-full' onClick={onBrowseMenu}>
                        {t('orderSidebar.browseMenu')}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className='flex h-full min-h-0 flex-col gap-4'>
            <div className='flex shrink-0 items-center justify-between'>
                <h2 className='text-lg font-semibold tracking-tight text-foreground'>{t('orderSidebar.title')}</h2>
                <span className='text-xs font-medium text-muted-foreground'>
                    {t('cart.itemCount', { count: totalItems })}
                </span>
            </div>

            <ScrollArea className='-mr-2 min-h-0 flex-1 pr-2'>
                <div className='flex flex-col gap-3'>
                    {items.map(item => (
                        <OrderLineRow
                            key={item.id}
                            item={item}
                            onIncrement={onIncrement}
                            onDecrement={onDecrement}
                            onRemove={onRemove}
                        />
                    ))}
                </div>
            </ScrollArea>

            <div className='shrink-0 space-y-4'>
                <div className='border-t border-dashed border-border' />
                <div className='flex items-center justify-between'>
                    <span className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground'>
                        {t('cart.total')}
                    </span>
                    <span className='text-xl font-bold tabular-nums text-primary'>{formatVnd(totalPrice)}</span>
                </div>
                <Button size='lg' className='w-full rounded-full' onClick={onCheckout}>
                    {t('orderSidebar.checkout')}
                </Button>
            </div>
        </div>
    );
}

export default memo(OrderPanelComponent);
