import { Palette } from 'lucide-react';
import { memo } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Field, FieldLabel } from '@/components/field';
import { Label } from '@/components/label';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { useTheme } from '@/core/contexts/theme.context';

function SettingsAppearanceSection() {
    const { theme, setTheme } = useTheme();

    return (
        <div className='space-y-6'>
            <div>
                <h2 className='text-2xl font-semibold tracking-tight'>Appearance</h2>
                <p className='text-muted-foreground mt-1'>Customize the appearance of the application</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Palette className='h-5 w-5' />
                        Theme
                    </CardTitle>
                    <CardDescription>Choose your preferred theme for the application</CardDescription>
                </CardHeader>
                <CardContent>
                    <Field>
                        <FieldLabel>Theme Preference</FieldLabel>
                        <RadioGroup
                            value={theme}
                            onValueChange={value => setTheme(value as 'light' | 'dark' | 'system')}
                            className='mt-2'
                        >
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='light' id='light' />
                                <Label htmlFor='light' className='font-normal cursor-pointer'>
                                    Light
                                </Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='dark' id='dark' />
                                <Label htmlFor='dark' className='font-normal cursor-pointer'>
                                    Dark
                                </Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='system' id='system' />
                                <Label htmlFor='system' className='font-normal cursor-pointer'>
                                    System
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
