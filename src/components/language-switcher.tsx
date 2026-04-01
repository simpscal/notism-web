import { useTranslation } from 'react-i18next';

import { Button } from './button';

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const currentLanguage = i18n.language;
    const toggleLanguage = () => {
        const newLanguage = currentLanguage === 'en' ? 'vi' : 'en';
        i18n.changeLanguage(newLanguage);
    };

    return (
        <Button
            variant='ghost'
            size='sm'
            onClick={toggleLanguage}
            className='text-xs font-medium'
            title={`Current language: ${currentLanguage.toUpperCase()}`}
        >
            {currentLanguage === 'en' ? '🇻🇳 VI' : '🇬🇧 EN'}
        </Button>
    );
}
