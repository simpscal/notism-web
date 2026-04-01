import { useTranslation } from 'react-i18next';

function NotFoundPage() {
    const { t } = useTranslation();
    return (
        <div className='flex h-screen w-full items-center justify-center'>
            <div className='text-center'>
                <h1 className='text-4xl font-bold'>404</h1>
                <p className='mt-4 text-lg'>{t('notFound.message')}</p>
            </div>
        </div>
    );
}

export default NotFoundPage;
