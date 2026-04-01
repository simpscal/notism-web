import { Search, ShieldCheck, Sparkles, Truck, UtensilsCrossed } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';

function LandingHeroSection() {
    const { t } = useTranslation();

    return (
        <section className='relative border-b bg-gradient-to-b from-primary/15 to-background px-4 py-10 sm:py-14 md:py-16'>
            <div className='mx-auto max-w-7xl'>
                <div className='grid items-center gap-10 lg:grid-cols-2'>
                    <div className='space-y-6'>
                        <div className='flex flex-col items-start gap-3 sm:flex-row sm:items-center'>
                            <Badge variant='secondary' className='gap-2'>
                                <Sparkles className='h-4 w-4 text-primary' />
                                <span>{t('landing.hero.badge')}</span>
                            </Badge>
                        </div>

                        <h2 className='text-primary text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl'>
                            {t('landing.hero.title')}
                        </h2>

                        <p className='max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg'>
                            {t('landing.hero.subtitle')}
                        </p>

                        <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                            <Button size='lg' asChild>
                                <Link to={`/${ROUTES.AUTH.SIGNUP}`}>{t('landing.hero.startOrdering')}</Link>
                            </Button>

                            <Button size='lg' variant='outline' asChild>
                                <Link to={`/${ROUTES.FOODS.LIST}`}>{t('landing.hero.exploreFoods')}</Link>
                            </Button>
                        </div>

                        <div className='flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground sm:text-sm'>
                            <div className='flex items-center gap-2'>
                                <ShieldCheck className='h-4 w-4 text-primary' />
                                <span className='font-semibold text-foreground'>
                                    {t('landing.hero.secureCheckout')}
                                </span>
                            </div>

                            <div className='flex items-center gap-2'>
                                <Truck className='h-4 w-4 text-primary' />
                                <span className='font-semibold text-foreground'>{t('landing.hero.fastDelivery')}</span>
                            </div>
                        </div>
                    </div>

                    <div className='relative overflow-hidden'>
                        <div className='absolute inset-0 -z-10 rounded-full bg-primary/10 blur-2xl scale-110' />

                        <div className='mx-auto w-full max-w-sm rounded-3xl border bg-card p-4 shadow-sm'>
                            <div className='flex items-center justify-between rounded-2xl bg-secondary px-3 py-2'>
                                <div className='flex items-center gap-2'>
                                    <span className='size-2 rounded-full bg-primary' />
                                    <span className='text-xs font-medium'>Live menu</span>
                                </div>
                                <span className='text-xs text-muted-foreground'>Now</span>
                            </div>

                            <div className='mt-4 space-y-3'>
                                <div className='rounded-2xl border bg-background p-3'>
                                    <div className='flex items-start justify-between gap-3'>
                                        <div className='min-w-0'>
                                            <div className='truncate text-sm font-semibold'>Chicken Bowl</div>
                                            <div className='mt-1 text-xs text-muted-foreground'>
                                                2x spice • extra sauce
                                            </div>
                                        </div>
                                        <div className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
                                            <UtensilsCrossed className='h-4 w-4' />
                                        </div>
                                    </div>
                                </div>

                                <div className='rounded-2xl border bg-background p-3'>
                                    <div className='flex items-start justify-between gap-3'>
                                        <div className='min-w-0'>
                                            <div className='truncate text-sm font-semibold'>Veggie Wrap</div>
                                            <div className='mt-1 text-xs text-muted-foreground'>
                                                no onions • add avocado
                                            </div>
                                        </div>
                                        <div className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground'>
                                            <Search className='h-4 w-4' />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-4 rounded-2xl border bg-background p-3'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-2'>
                                        <ShieldCheck className='h-4 w-4 text-primary' />
                                        <span className='text-xs font-medium'>{t('landing.hero.secureCheckout')}</span>
                                    </div>
                                    <span className='text-xs text-muted-foreground'>Protected</span>
                                </div>
                                <div className='mt-3 space-y-2'>
                                    <div className='h-2 w-full rounded-full bg-secondary' />
                                    <div className='h-2 w-3/4 rounded-full bg-secondary' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default memo(LandingHeroSection);
