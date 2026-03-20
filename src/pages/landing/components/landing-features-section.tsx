import { Search, ShieldCheck, Truck, UtensilsCrossed } from 'lucide-react';
import { memo } from 'react';

import { Card } from '@/components/card';

const FEATURES = [
    {
        icon: UtensilsCrossed,
        title: 'Curated menu',
        description: 'Discover fresh favorites with clear categories and fast search.',
    },
    {
        icon: Search,
        title: 'Smart ordering',
        description: 'Customize your selections and review your checkout summary before paying.',
    },
    {
        icon: ShieldCheck,
        title: 'Secure checkout',
        description: 'Protected payment processing with clear confirmation steps.',
    },
    {
        icon: Truck,
        title: 'Track delivery',
        description: 'See progress in real time from checkout to your doorstep.',
    },
] as const;

function LandingFeaturesSection() {
    return (
        <section className='bg-background px-4 py-12 sm:py-16'>
            <div className='mx-auto max-w-7xl'>
                <div className='text-center'>
                    <h3 className='text-2xl font-bold tracking-tight'>Everything you need to order</h3>
                    <p className='mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base'>
                        A clean flow from browsing to checkout, designed to be fast and easy to understand.
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
