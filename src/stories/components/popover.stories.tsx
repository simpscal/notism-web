import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Button } from '@/uis/button';
import { Input } from '@/uis/input';
import { Label } from '@/uis/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/uis/popover';

const meta = {
    title: 'Components/Utilities/Popover',
    component: Popover,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant='outline'>{t('storybook.popover.openPopover')}</Button>
                </PopoverTrigger>
                <PopoverContent className='w-80'>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div style={{ gap: '8px', display: 'flex', flexDirection: 'column' }}>
                            <h4 style={{ fontWeight: 500, lineHeight: 1 }}>{t('storybook.popover.dimensions')}</h4>
                            <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                                {t('storybook.popover.dimensionsDescription')}
                            </p>
                        </div>
                        <div style={{ display: 'grid', gap: '8px' }}>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 2fr',
                                    gap: '16px',
                                    alignItems: 'center',
                                }}
                            >
                                <Label htmlFor='width'>{t('storybook.popover.width')}</Label>
                                <Input id='width' defaultValue='100%' />
                            </div>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 2fr',
                                    gap: '16px',
                                    alignItems: 'center',
                                }}
                            >
                                <Label htmlFor='height'>{t('storybook.popover.height')}</Label>
                                <Input id='height' defaultValue='25px' />
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        );
    },
};
