import { Banknote, CreditCard } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { PaymentMethodEnum } from '@/features/order';
import { RadioGroup, RadioGroupItem } from '@/uis/radio-group';

interface PaymentMethodProps {
    value: PaymentMethodEnum;
    onValueChange: (value: string) => void;
}

function PaymentMethodComponent({ value, onValueChange }: PaymentMethodProps) {
    const { t } = useTranslation();
    return (
        <div className='space-y-2'>
            <p className='text-sm font-semibold text-foreground'>{t('payment.paymentMethod')}</p>
            <RadioGroup value={value} onValueChange={onValueChange} className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                <label
                    htmlFor={PaymentMethodEnum.CashOnDelivery}
                    className='flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-4 transition-colors hover:bg-muted/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5'
                >
                    <RadioGroupItem value={PaymentMethodEnum.CashOnDelivery} id={PaymentMethodEnum.CashOnDelivery} />
                    <span className='flex flex-col gap-0.5'>
                        <span className='flex items-center gap-2 text-sm font-semibold'>
                            <Banknote className='h-4 w-4 text-primary' />
                            {t('payment.cashOnDelivery')}
                        </span>
                        <span className='text-xs text-muted-foreground'>{t('payment.payWithCash')}</span>
                    </span>
                </label>
                <label
                    htmlFor={PaymentMethodEnum.Banking}
                    className='flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-4 transition-colors hover:bg-muted/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5'
                >
                    <RadioGroupItem value={PaymentMethodEnum.Banking} id={PaymentMethodEnum.Banking} />
                    <span className='flex flex-col gap-0.5'>
                        <span className='flex items-center gap-2 text-sm font-semibold'>
                            <CreditCard className='h-4 w-4 text-primary' />
                            {t('payment.banking')}
                        </span>
                        <span className='text-xs text-muted-foreground'>{t('payment.onlineBanking')}</span>
                    </span>
                </label>
            </RadioGroup>
        </div>
    );
}

export default memo(PaymentMethodComponent);
