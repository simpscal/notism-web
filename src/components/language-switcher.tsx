import { Button } from './button';

import { useLanguageToggle } from '@/app/i18n/use-language-toggle';

export function LanguageSwitcher() {
    const { currentLanguage, toggleLanguage } = useLanguageToggle();

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
