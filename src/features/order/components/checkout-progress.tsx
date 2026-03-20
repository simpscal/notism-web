import { CheckCircle2, CreditCard, ShoppingCart } from 'lucide-react';
import { memo, type ComponentType } from 'react';

import { Card } from '@/components/card';

type CheckoutStep = 'cart' | 'payment' | 'confirmation';

export interface CheckoutProgressProps {
    currentStep: CheckoutStep;
}

const steps: Array<{
    key: CheckoutStep;
    label: string;
    icon: ComponentType<{ className?: string }>;
}> = [
    { key: 'cart', label: 'Cart', icon: ShoppingCart },
    { key: 'payment', label: 'Payment', icon: CreditCard },
    { key: 'confirmation', label: 'Confirmation', icon: CheckCircle2 },
];

function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
    const currentIndex = steps.findIndex(s => s.key === currentStep);

    return (
        <Card className='px-4 py-4'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <div key={step.key} className='flex items-center gap-3'>
                            <div
                                className={[
                                    'flex size-10 items-center justify-center rounded-full border',
                                    isCompleted || isCurrent
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border bg-background text-muted-foreground',
                                ].join(' ')}
                            >
                                <Icon className='h-5 w-5' />
                            </div>

                            <div className='min-w-0'>
                                <div
                                    className={
                                        isCurrent ? 'text-foreground font-semibold' : 'text-foreground/90 font-semibold'
                                    }
                                >
                                    {step.label}
                                </div>
                                <div className='text-xs text-muted-foreground'>
                                    {isCompleted ? 'Completed' : isCurrent ? 'Current step' : 'Next'}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

export default memo(CheckoutProgress);
