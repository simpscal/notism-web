import { Minus, Plus, Trash2 } from 'lucide-react';
import { memo } from 'react';

import { cn } from '@/app/utils/tailwind.utils';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader } from '@/components/card';
import { Checkbox } from '@/components/checkbox';
import { CartItemViewModel } from '@/features/cart/models';
import { FoodImage } from '@/features/food/components';

interface CartItemProps {
    item: CartItemViewModel;
    onQuantityChange: (id: string, delta: number) => void;
    onRemove: (id: string, name: string) => void;
    onSelectionChange: (id: string, selected: boolean) => void;
}

function CartItemComponent({ item, onQuantityChange, onRemove, onSelectionChange }: CartItemProps) {
    const isSelected = item.isSelected;
    const hasDiscount = item.discountPrice !== null && item.discountPrice < item.price;
    const effectivePrice = hasDiscount ? item.discountPrice! : item.price;
    const itemTotal = effectivePrice * item.quantity;
    const originalTotal = item.price * item.quantity;
    const discountAmount = hasDiscount ? originalTotal - itemTotal : 0;

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
            className={cn('cursor-pointer transition-colors', isSelected && 'border-primary border-2')}
            onClick={handleCardClick}
        >
            <CardHeader>
                <div className='flex items-start gap-4'>
                    <div onClick={handleButtonClick} onMouseDown={e => e.stopPropagation()}>
                        <Checkbox checked={isSelected} onCheckedChange={handleCheckboxChange} className='mt-1' />
                    </div>
                    <div className='relative h-24 w-24 rounded-lg overflow-hidden bg-muted'>
                        <FoodImage
                            src={item.imageUrl}
                            alt={item.name}
                            className='absolute inset-0 h-full w-full object-cover'
                        />
                    </div>
                    <div className='flex-1'>
                        <div className='mb-2 flex items-start justify-between gap-4'>
                            <div>
                                <h3 className='text-lg font-semibold'>{item.name}</h3>
                                <p className='mt-1 text-sm text-muted-foreground line-clamp-2'>{item.description}</p>
                            </div>
                            <Button
                                variant='ghost'
                                size='icon'
                                className='shrink-0'
                                onClick={e => {
                                    handleButtonClick(e);
                                    onRemove(item.id, item.name);
                                }}
                            >
                                <Trash2 className='h-4 w-4' />
                            </Button>
                        </div>
                        <div className='flex flex-wrap items-center gap-2'>
                            <Badge variant='secondary'>{item.category}</Badge>
                            <Badge variant='outline'>{item.quantityUnit}</Badge>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className='flex items-center justify-between'>
                    {/* Quantity Controls */}
                    <div className='flex items-center gap-4'>
                        <span className='text-sm font-medium text-muted-foreground'>Quantity:</span>
                        <div className='flex items-center rounded-lg border border-border bg-secondary/50'>
                            <Button
                                variant='ghost'
                                size='icon-sm'
                                className='rounded-l-lg'
                                onClick={e => {
                                    handleButtonClick(e);
                                    onQuantityChange(item.id, -1);
                                }}
                            >
                                <Minus className='h-4 w-4' />
                            </Button>
                            <span className='w-12 text-center text-sm font-semibold'>{item.quantity}</span>
                            <Button
                                variant='ghost'
                                size='icon-sm'
                                className='rounded-r-lg'
                                onClick={e => {
                                    handleButtonClick(e);
                                    onQuantityChange(item.id, 1);
                                }}
                                disabled={item.quantity >= item.stockQuantity}
                            >
                                <Plus className='h-4 w-4' />
                            </Button>
                        </div>
                    </div>

                    {/* Price */}
                    <div className='text-right'>
                        {hasDiscount && (
                            <span className='block text-sm text-muted-foreground line-through'>
                                ${originalTotal.toFixed(2)}
                            </span>
                        )}
                        <span className='text-xl font-bold'>${itemTotal.toFixed(2)}</span>
                        {hasDiscount && (
                            <span className='block text-xs text-destructive'>Save ${discountAmount.toFixed(2)}</span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default memo(CartItemComponent);
