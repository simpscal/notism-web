import { ShoppingBag } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { Button } from '@/components/button';

function CartEmpty() {
    const { t } = useTranslation();
    return (
        <div className='bg-background'>
            <div className='relative overflow-hidden border-b bg-gradient-to-br from-primary/20 via-primary/5 to-background px-4 py-8 sm:py-10'>
                <div className='pointer-events-none absolute inset-0 overflow-hidden' aria-hidden='true'>
                    <div className='absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl' />
                </div>
                <div className='relative container mx-auto max-w-7xl'>
                    <h1 className='text-3xl font-black tracking-tight sm:text-4xl'>{t('cart.title')}</h1>
                </div>
            </div>

            <div className='flex flex-col items-center justify-center py-24 text-center'>
                <div className='mb-4 rounded-full bg-muted p-8'>
                    <ShoppingBag className='h-12 w-12 text-muted-foreground' />
                </div>
                <h2 className='mb-2 text-2xl font-bold'>{t('cart.empty.title')}</h2>
                <p className='mb-6 text-muted-foreground'>{t('cart.empty.description')}</p>
                <Button variant='default' size='lg' asChild>
                    <Link to={`/${ROUTES.FOODS.LIST}`}>{t('common.browseMenu')}</Link>
                </Button>
            </div>
        </div>
    );
}

export default memo(CartEmpty);
