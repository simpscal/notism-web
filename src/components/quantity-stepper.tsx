import { Minus, Plus } from 'lucide-react';
import { memo } from 'react';

import { cn } from '@/app/utils/tailwind.utils';
import { Button } from '@/components/button';

interface QuantityStepperProps {
    /** Current quantity, rendered as the numeral between the two controls. */
    value: number;
    /** Requested increment — the parent owns the resulting value. */
    onIncrement: () => void;
    /** Requested decrement — the parent owns the resulting value. */
    onDecrement: () => void;
    /** Lower bound; the − button disables once `value` reaches it. Defaults to 1. */
    min?: number;
    /** Upper bound; the + button disables once `value` reaches it. Omit for no cap. */
    max?: number;
    /** Disables both controls regardless of bounds. */
    disabled?: boolean;
    /** Accessible name for the stepper group. */
    label?: string;
    /** Accessible name for the − button. */
    decrementLabel?: string;
    /** Accessible name for the + button. */
    incrementLabel?: string;
    className?: string;
}

function QuantityStepper({
    value,
    onIncrement,
    onDecrement,
    min = 1,
    max,
    disabled = false,
    label = 'Quantity',
    decrementLabel = 'Decrease quantity',
    incrementLabel = 'Increase quantity',
    className,
}: QuantityStepperProps) {
    const atMin = value <= min;
    const atMax = max !== undefined && value >= max;

    return (
        <div
            role='group'
            aria-label={label}
            className={cn('inline-flex items-center gap-1 rounded-full bg-muted p-1', className)}
        >
            <Button
                type='button'
                variant='outline'
                size='icon-sm'
                aria-label={decrementLabel}
                disabled={disabled || atMin}
                onClick={onDecrement}
            >
                <Minus className='h-4 w-4' />
            </Button>
            <span aria-live='polite' className='w-8 text-center text-sm font-bold tabular-nums text-foreground'>
                {value}
            </span>
            <Button
                type='button'
                variant='outline'
                size='icon-sm'
                aria-label={incrementLabel}
                disabled={disabled || atMax}
                onClick={onIncrement}
            >
                <Plus className='h-4 w-4' />
            </Button>
        </div>
    );
}

export default memo(QuantityStepper);
