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
    onCustomisationChange?: (id: string, optionId: string) => void;
}

function CartItemComponent({
    item,
    onQuantityChange,
    onRemove,
    onSelectionChange,
    onCustomisationChange,
}: CartItemProps) {
    const { t } = useTranslation();
    const isSelected = item.isSelected;
    const { effectivePrice, hasSavings } = getFoodPricing(item.price, item.discountPrice);
    const effectiveUnitPrice = effectivePrice + (item.surcharge ?? 0);
    const itemTotal = effectiveUnitPrice * item.quantity;
    const originalTotal = item.price * item.quantity;
    const discountAmount = hasSavings ? originalTotal - effectivePrice * item.quantity : 0;
    const hasSurcharge = (item.surcharge ?? 0) > 0;

    const handleCardClick = () => {
        onSelectionChange(item.id, !isSelected);
    };

    const handleCheckboxChange = (checked: boolean) => {
        onSelectionChange(item.id, checked);
    };

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
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
                onClick={e => {
                    handleButtonClick(e);
                    onRemove(item.id, item.name);
                }}
            >
                <Trash2 className='h-4 w-4' />
            </Button>

            <div className='flex items-start gap-4 pr-8'>
                {/* Checkbox */}
                <div className='pt-0.5' onClick={handleButtonClick} onMouseDown={e => e.stopPropagation()}>
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

                    {/* Customisation select */}
                    {item.customisationOptions && item.customisationOptions.length > 0 && (
                        <div
                            className='flex items-center gap-2'
                            onClick={handleButtonClick}
                            onMouseDown={e => e.stopPropagation()}
                        >
                            {item.customisationGroupLabel && (
                                <span className='text-xs text-muted-foreground'>{item.customisationGroupLabel}:</span>
                            )}
                            <Select
                                value={item.customisationOptionId ?? ''}
                                onValueChange={val => onCustomisationChange?.(item.id, val)}
                            >
                                <SelectTrigger className='h-7 w-auto min-w-[160px] text-xs'>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {item.customisationOptions.map(opt => (
                                        <SelectItem key={opt.id} value={opt.id} className='text-xs'>
                                            {opt.label}
                                            {(opt.surcharge ?? 0) > 0 && ` (+${formatVnd(opt.surcharge!)})`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {hasSurcharge && (
                                <Badge variant='secondary' className='text-xs'>
                                    +{formatVnd(item.surcharge!)}
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Quantity + Price row */}
                    <div className='flex flex-wrap items-center justify-between gap-3 pt-1'>
                        <div
                            className='flex items-center rounded-lg border'
                            onClick={handleButtonClick}
                            onMouseDown={e => e.stopPropagation()}
                        >
                            <Button
                                variant='ghost'
                                size='icon-sm'
                                onClick={e => {
                                    handleButtonClick(e);
                                    onQuantityChange(item.id, -1);
                                }}
                            >
                                <Minus className='h-3.5 w-3.5' />
                            </Button>
                            <span className='w-8 text-center text-sm font-semibold'>{item.quantity}</span>
                            <Button
                                variant='ghost'
                                size='icon-sm'
                                onClick={e => {
                                    handleButtonClick(e);
                                    onQuantityChange(item.id, 1);
                                }}
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
