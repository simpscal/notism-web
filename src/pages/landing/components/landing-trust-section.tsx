import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent } from '@/components/card';
import { Separator } from '@/components/separator';
import { OrderCheckoutTrustBar } from '@/features/order/components';

function LandingTrustSection() {
    const { t } = useTranslation();

    return (
        <section className='px-4 py-10 sm:py-12 md:py-14'>
            <div className='mx-auto max-w-7xl'>
                <Card className='p-0'>
                    <CardContent className='p-6 sm:p-8'>
                        <div className='grid gap-8 lg:grid-cols-2 lg:items-start'>
                            <div className='space-y-3'>
                                <h3 className='text-2xl font-bold tracking-tight'>{t('landing.trust.title')}</h3>
                                <p className='max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:max-w-none'>
                                    {t('landing.trust.subtitle')}
                                </p>
                                <Separator />
                                <p className='text-xs text-muted-foreground'>{t('landing.trust.tip')}</p>
                            </div>

                            <OrderCheckoutTrustBar className='w-full' />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

export default memo(LandingTrustSection);
