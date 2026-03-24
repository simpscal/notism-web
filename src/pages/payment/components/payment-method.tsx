import { Banknote, CreditCard } from 'lucide-react';
import { memo } from 'react';

import { cn } from '@/app/utils/tailwind.utils';
import { Badge } from '@/components/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Label } from '@/components/label';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { PaymentMethodEnum } from '@/features/order';

interface PaymentMethodProps {
    value: PaymentMethodEnum;
    onValueChange: (value: string) => void;
}

function PaymentMethodComponent({ value, onValueChange }: PaymentMethodProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup value={value} onValueChange={onValueChange}>
                    <div
                        className={cn(
                            'flex items-center space-x-3 rounded-lg border p-4 transition-colors',
                            value === PaymentMethodEnum.CashOnDelivery
                                ? 'border-primary bg-primary/5'
                                : 'hover:border-primary/40'
                        )}
                    >
                        <RadioGroupItem
                            value={PaymentMethodEnum.CashOnDelivery}
                            id={PaymentMethodEnum.CashOnDelivery}
                        />
                        <div
                            className={cn(
                                'flex size-9 shrink-0 items-center justify-center rounded-full',
                                value === PaymentMethodEnum.CashOnDelivery
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-muted text-muted-foreground'
                            )}
                        >
                            <Banknote className='h-5 w-5' />
                        </div>
                        <Label htmlFor={PaymentMethodEnum.CashOnDelivery} className='flex-1 cursor-pointer font-normal'>
                            <div className='flex flex-col'>
                                <span className='font-semibold'>Cash on Delivery</span>
                                <span className='text-sm text-muted-foreground'>
                                    Pay with cash when your order is delivered
                                </span>
                            </div>
                        </Label>
                    </div>
                    <div className='flex items-center space-x-3 rounded-lg border p-4 opacity-50'>
                        <RadioGroupItem value={PaymentMethodEnum.Banking} id={PaymentMethodEnum.Banking} disabled />
                        <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground'>
                            <CreditCard className='h-5 w-5' />
                        </div>
                        <Label htmlFor={PaymentMethodEnum.Banking} className='flex-1 cursor-not-allowed font-normal'>
                            <div className='flex items-center gap-2'>
                                <div className='flex flex-col'>
                                    <span className='font-semibold'>Banking</span>
                                    <span className='text-sm text-muted-foreground'>Online banking transfer</span>
                                </div>
                                <Badge variant='secondary' className='ml-auto text-xs'>
                                    Coming soon
                                </Badge>
                            </div>
                        </Label>
                    </div>
                </RadioGroup>
            </CardContent>
        </Card>
    );
}

export default memo(PaymentMethodComponent);
