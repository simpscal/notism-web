import { ArrowLeft } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { Button } from '@/uis/button';
import ErrorState from '@/uis/error-state';

function FoodDetailError() {
    const { t } = useTranslation();
    return (
        <div className='bg-background'>
            <div className='container mx-auto px-4 py-8'>
                <Button variant='ghost' className='mb-8' asChild>
                    <Link to={`/${ROUTES.FOODS.LIST}`}>
                        <ArrowLeft className='h-4 w-4' />
                        {t('foodDetail.backToMenu')}
                    </Link>
                </Button>

                <ErrorState
                    title={t('foodDetail.error.title')}
                    description={t('foodDetail.error.description')}
                    action={
                        <Button asChild>
                            <Link to={`/${ROUTES.FOODS.LIST}`}>{t('foodDetail.backToMenu')}</Link>
                        </Button>
                    }
                />
            </div>
        </div>
    );
}

export default memo(FoodDetailError);
