import { Palette } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Field, FieldLabel } from '@/components/field';
import { Label } from '@/components/label';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { useTheme } from '@/core/contexts/theme.context';

function SettingsAppearanceSection() {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();

    return (
        <div className='space-y-6'>
            <div>
                <h2 className='text-2xl font-semibold tracking-tight'>{t('settings.appearance.title')}</h2>
                <p className='text-muted-foreground mt-1'>{t('settings.appearance.subtitle')}</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Palette className='h-5 w-5' />
                        {t('settings.appearance.sectionTitle')}
                    </CardTitle>
                    <CardDescription>{t('settings.appearance.themeDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Field>
                        <FieldLabel>{t('settings.appearance.themePreference')}</FieldLabel>
                        <RadioGroup
                            value={theme}
                            onValueChange={value => setTheme(value as 'light' | 'dark' | 'system')}
                            className='mt-2'
                        >
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='light' id='light' />
                                <Label htmlFor='light' className='font-normal cursor-pointer'>
                                    {t('settings.appearance.light')}
                                </Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='dark' id='dark' />
                                <Label htmlFor='dark' className='font-normal cursor-pointer'>
                                    {t('settings.appearance.dark')}
                                </Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='system' id='system' />
                                <Label htmlFor='system' className='font-normal cursor-pointer'>
                                    {t('settings.appearance.system')}
                                </Label>
                            </div>
                        </RadioGroup>
                    </Field>
                </CardContent>
            </Card>
        </div>
    );
}

export default memo(SettingsAppearanceSection);
