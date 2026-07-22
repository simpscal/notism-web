import { Search, ShieldCheck, Truck, UtensilsCrossed } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Card } from '@/uis/card';

function LandingFeaturesSection() {
    const { t } = useTranslation();

    const FEATURES = [
        {
            icon: UtensilsCrossed,
            title: t('landing.features.items.0.title'),
            description: t('landing.features.items.0.description'),
        },
        {
            icon: Search,
            title: t('landing.features.items.1.title'),
            description: t('landing.features.items.1.description'),
        },
        {
            icon: ShieldCheck,
            title: t('landing.features.items.2.title'),
            description: t('landing.features.items.2.description'),
        },
        {
            icon: Truck,
            title: t('landing.features.items.3.title'),
            description: t('landing.features.items.3.description'),
        },
    ] as const;

    return (
        <section id='features' className='bg-background px-4 py-12 sm:py-16'>
            <div className='mx-auto max-w-7xl'>
                <div className='text-center'>
                    <h3 className='text-2xl font-bold tracking-tight'>{t('landing.features.title')}</h3>
                    <p className='mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base'>
                        {t('landing.features.subtitle')}
                    </p>
                </div>

                <div className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    {FEATURES.map(feature => {
                        const Icon = feature.icon;

                        return (
                            <Card key={feature.title} className='px-6'>
                                <div className='flex items-center gap-3'>
                                    <div className='flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground'>
                                        <Icon className='h-5 w-5' />
                                    </div>
                                    <div className='min-w-0'>
                                        <div className='truncate text-sm font-semibold'>{feature.title}</div>
                                        <div className='mt-1 text-xs text-muted-foreground'>{feature.description}</div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default memo(LandingFeaturesSection);
