import { Minus, Plus, Trash2 } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { formatVnd } from '@/app/utils';
import { cn } from '@/app/utils/tailwind.utils';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Checkbox } from '@/components/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { CartItemViewModel } from '@/features/cart/models';
import { getFoodPricing } from '@/features/food';
import { FoodImage } from '@/features/food/components';

interface CartItemProps {
    item: CartItemViewModel;
    onQuantityChange: (id: string, delta: number) => void;
    onRemove: (id: string, name: string) => void;
    onSelectionChange: (id: string, selected: boolean) => void;
    onCustomisationsChange?: (id: string, customisations: { groupId: string; optionId: string }[]) => void;
}

function CartItemComponent({
    item,
    onQuantityChange,
    onRemove,
    onSelectionChange,
    onCustomisationsChange,
}: CartItemProps) {
    const { t } = useTranslation();
    const isSelected = item.isSelected;
    const { effectivePrice, hasSavings } = getFoodPricing(item.price, item.discountPrice);
    const effectiveUnitPrice = effectivePrice + item.totalSurcharge;
    const itemTotal = effectiveUnitPrice * item.quantity;
    const originalTotal = item.price * item.quantity;
    const discountAmount = hasSavings ? originalTotal - effectivePrice * item.quantity : 0;
    const hasSurcharge = item.totalSurcharge > 0;

    const handleCardClick = () => {
        onSelectionChange(item.id, !isSelected);
    };

    const handleCheckboxChange = (checked: boolean) => {
        onSelectionChange(item.id, checked);
    };

    const handleStopPropagation = (e: React.MouseEvent | React.SyntheticEvent) => {
        e.stopPropagation();
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove(item.id, item.name);
    };

    const handleCustomisationChange = (groupId: string | null, optionId: string) => {
        const updated = item.customisations.map(existing =>
            existing.groupId === groupId ? { ...existing, optionId } : existing
        );
        onCustomisationsChange?.(
            item.id,
            updated.filter(x => x.optionId).map(x => ({ groupId: x.groupId!, optionId: x.optionId! }))
        );
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        onQuantityChange(item.id, -1);
    };

    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        onQuantityChange(item.id, 1);
    };

    return (
        <Card
            className={cn(
                'relative cursor-pointer p-4 transition-all hover:shadow-md',
                isSelected ? 'border-2 border-primary bg-primary/5' : 'border hover:border-primary/40'
            )}
            onClick={handleCardClick}
        >
            {/* Delete button */}
            <Button
                variant='ghost'
                size='icon-sm'
                className='absolute top-3 right-3 text-muted-foreground hover:text-destructive'
                onClick={handleRemove}
            >
                <Trash2 className='h-4 w-4' />
            </Button>

            <div className='flex items-start gap-4 pr-8'>
                {/* Checkbox */}
                <div className='pt-0.5' onClick={handleStopPropagation} onMouseDown={handleStopPropagation}>
                    <Checkbox checked={isSelected} onCheckedChange={handleCheckboxChange} />
                </div>

                {/* Image */}
                <div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted'>
                    <FoodImage
                        src={item.imageUrl}
                        alt={item.name}
                        className='absolute inset-0 h-full w-full object-cover'
                    />
                </div>

                {/* Info */}
                <div className='flex min-w-0 flex-1 flex-col gap-2'>
                    <div>
                        <h3 className='truncate text-base font-semibold leading-tight'>{item.name}</h3>
                        <p className='mt-0.5 line-clamp-1 text-xs text-muted-foreground'>{item.description}</p>
                    </div>
                    <div className='flex flex-wrap items-center gap-1.5'>
                        <Badge variant='secondary' className='text-xs'>
                            {item.category}
                        </Badge>
                        <Badge variant='outline' className='text-xs'>
                            {item.quantityUnit}
                        </Badge>
                    </div>

                    {/* Customisation selects */}
                    {item.customisations && item.customisations.length > 0 && (
                        <div
                            className='flex flex-col gap-1.5'
                            onClick={handleStopPropagation}
                            onMouseDown={handleStopPropagation}
                        >
                            {item.customisations.map(c => (
                                <div key={c.groupId ?? c.groupLabel} className='flex items-center gap-2'>
                                    <span className='text-xs text-muted-foreground'>{c.groupLabel}:</span>
                                    <Select
                                        value={c.optionId ?? ''}
                                        onValueChange={val => handleCustomisationChange(c.groupId, val)}
                                    >
                                        <SelectTrigger className='h-7 w-auto min-w-[160px] text-xs'>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {c.availableOptions.map(opt => (
                                                <SelectItem key={opt.id} value={opt.id} className='text-xs'>
                                                    {opt.label}
                                                    {(opt.surcharge ?? 0) > 0 && ` (+${formatVnd(opt.surcharge!)})`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                            {hasSurcharge && (
                                <Badge variant='secondary' className='text-xs'>
                                    +{formatVnd(item.totalSurcharge)}
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Quantity + Price row */}
                    <div className='flex flex-wrap items-center justify-between gap-3 pt-1'>
                        <div
                            className='flex items-center rounded-lg border'
                            onClick={handleStopPropagation}
                            onMouseDown={handleStopPropagation}
                        >
                            <Button variant='ghost' size='icon-sm' onClick={handleDecrement}>
                                <Minus className='h-3.5 w-3.5' />
                            </Button>
                            <span className='w-8 text-center text-sm font-semibold'>{item.quantity}</span>
                            <Button
                                variant='ghost'
                                size='icon-sm'
                                onClick={handleIncrement}
                                disabled={item.quantity >= item.stockQuantity}
                            >
                                <Plus className='h-3.5 w-3.5' />
                            </Button>
                        </div>

                        <div className='text-right'>
                            {hasSavings && (
                                <span className='block text-xs text-muted-foreground line-through'>
                                    {formatVnd(originalTotal)}
                                </span>
                            )}
                            <span className='text-xl font-bold'>{formatVnd(itemTotal)}</span>
                            {hasSavings && (
                                <span className='block text-xs text-destructive'>
                                    {t('cart.saveBadge', { amount: formatVnd(discountAmount) })}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default memo(CartItemComponent);
