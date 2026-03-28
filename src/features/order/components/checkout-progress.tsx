import { Check, CheckCircle2, CreditCard, ShoppingCart } from 'lucide-react';
import { memo, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/app/utils/tailwind.utils';

type CheckoutStep = 'cart' | 'payment' | 'confirmation';

export interface CheckoutProgressProps {
    currentStep: CheckoutStep;
}

const steps: Array<{
    key: CheckoutStep;
    label: string;
    icon: ComponentType<{ className?: string }>;
}> = [
    { key: 'cart', label: 'checkout.progress.cart', icon: ShoppingCart },
    { key: 'payment', label: 'checkout.progress.payment', icon: CreditCard },
    { key: 'confirmation', label: 'checkout.progress.confirmation', icon: CheckCircle2 },
];

function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
    const { t } = useTranslation();
    const currentIndex = steps.findIndex(s => s.key === currentStep);

    return (
        <div className='rounded-xl bg-primary/5 px-4 py-4'>
            <div className='flex items-center'>
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const isLast = index === steps.length - 1;

                    return (
                        <div key={step.key} className='flex flex-1 items-center'>
                            <div className='flex items-center gap-2.5'>
                                <div
                                    className={cn(
                                        'flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                                        isCompleted
                                            ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                            : isCurrent
                                              ? 'border-primary bg-primary text-primary-foreground shadow-md'
                                              : 'border-border bg-background text-muted-foreground'
                                    )}
                                >
                                    {isCompleted ? <Check className='h-4 w-4' /> : <Icon className='h-5 w-5' />}
                                </div>
                                <div className='hidden min-w-0 sm:block'>
                                    <div
                                        className={cn(
                                            'text-sm font-semibold',
                                            isCurrent
                                                ? 'text-foreground'
                                                : isCompleted
                                                  ? 'text-foreground/80'
                                                  : 'text-muted-foreground'
                                        )}
                                    >
                                        {t(step.label)}
                                    </div>
                                    <div className='text-xs text-muted-foreground'>
                                        {isCompleted
                                            ? t('checkout.progress.completed')
                                            : isCurrent
                                              ? t('checkout.progress.currentStep')
                                              : t('checkout.progress.upcoming')}
                                    </div>
                                </div>
                            </div>

                            {!isLast && (
                                <div
                                    className={cn(
                                        'mx-3 h-px flex-1 transition-colors',
                                        isCompleted ? 'bg-primary' : 'bg-border'
                                    )}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default memo(CheckoutProgress);
