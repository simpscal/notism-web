import { Banknote, MapPin, Pencil } from 'lucide-react';
import { ChangeEvent, memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { formatVnd } from '@/app/utils';
import { Button } from '@/uis/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/uis/card';
import { Input } from '@/uis/input';
import { Label } from '@/uis/label';
import { Textarea } from '@/uis/textarea';

interface PaymentDeliveryFormProps {
    savedAddress: string | null | undefined;
    totalPrice: number;
    disabled?: boolean;
    showPlaceOrderButton?: boolean;
    onPlaceOrder: (address: string, notes: string) => void;
}

function PaymentDeliveryForm({
    savedAddress,
    totalPrice,
    disabled,
    showPlaceOrderButton = true,
    onPlaceOrder,
}: PaymentDeliveryFormProps) {
    const { t } = useTranslation();
    const [address, setAddress] = useState(savedAddress ?? '');
    const [notes, setNotes] = useState('');
    const [isEditing, setIsEditing] = useState(!savedAddress);

    const hasSavedAddress = Boolean(savedAddress);

    const handleEditClick = useCallback(() => {
        setIsEditing(true);
    }, []);

    const handleAddressChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    }, []);

    const handleNotesChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
    }, []);

    const handlePlaceOrder = useCallback(() => {
        const deliveryAddress = hasSavedAddress && !isEditing ? savedAddress! : address;
        onPlaceOrder(deliveryAddress, notes);
    }, [hasSavedAddress, isEditing, savedAddress, address, notes, onPlaceOrder]);

    return (
        <Card>
            <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base'>
                    <MapPin className='h-4 w-4' />
                    {t('payment.delivery.title')}
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                {hasSavedAddress && !isEditing ? (
                    <div className='flex items-start justify-between gap-3 rounded-lg border bg-muted/30 px-4 py-3'>
                        <div className='space-y-0.5'>
                            <p className='text-xs font-medium uppercase tracking-widest text-muted-foreground'>
                                {t('payment.delivery.deliveringTo')}
                            </p>
                            <p className='text-sm font-medium text-foreground'>{savedAddress}</p>
                        </div>
                        <button
                            className='mt-0.5 flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline'
                            type='button'
                            onClick={handleEditClick}
                        >
                            <Pencil className='h-3 w-3' />
                            {t('payment.delivery.edit')}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className='space-y-1.5'>
                            <Label htmlFor='delivery-address'>{t('payment.delivery.addressLabel')}</Label>
                            <Input
                                id='delivery-address'
                                value={address}
                                onChange={handleAddressChange}
                                disabled={disabled}
                                placeholder={t('payment.delivery.addressPlaceholder')}
                            />
                        </div>
                        <div className='space-y-1.5'>
                            <Label htmlFor='delivery-notes'>
                                {t('payment.delivery.notesLabel')}{' '}
                                <span className='text-xs text-muted-foreground'>
                                    {t('payment.delivery.notesOptional')}
                                </span>
                            </Label>
                            <Textarea
                                id='delivery-notes'
                                value={notes}
                                onChange={handleNotesChange}
                                disabled={disabled}
                                placeholder={t('payment.delivery.notesPlaceholder')}
                                rows={3}
                            />
                        </div>
                    </>
                )}
                {showPlaceOrderButton && (
                    <div className='flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground'>
                        <Banknote className='h-3.5 w-3.5 shrink-0' />
                        {t('payment.delivery.cashReminder', { amount: formatVnd(totalPrice) })}
                    </div>
                )}
            </CardContent>
            {showPlaceOrderButton && (
                <CardFooter>
                    <Button className='w-full gap-2' size='lg' disabled={disabled} onClick={handlePlaceOrder}>
                        {t('payment.delivery.placeOrderWithTotal', { amount: formatVnd(totalPrice) })}
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}

export default memo(PaymentDeliveryForm);
