import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Separator } from '@/components/separator';

const meta = {
    title: 'Components/Layout/Separator',
    component: Separator,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        orientation: {
            control: 'select',
            options: ['horizontal', 'vertical'],
        },
    },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ width: '300px' }}>
                <div style={{ gap: '4px', display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1 }}>
                        {t('storybook.separator.radixPrimitives')}
                    </h4>
                    <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                        {t('storybook.separator.openSourceLibrary')}
                    </p>
                </div>
                <Separator className='my-4' />
                <div style={{ display: 'flex', height: '20px', alignItems: 'center', gap: '16px', fontSize: '14px' }}>
                    <div>{t('storybook.separator.blog')}</div>
                    <Separator orientation='vertical' />
                    <div>{t('storybook.separator.docs')}</div>
                    <Separator orientation='vertical' />
                    <div>{t('storybook.separator.source')}</div>
                </div>
            </div>
        );
    },
};

export const Vertical: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ display: 'flex', height: '60px', alignItems: 'center', gap: '16px', padding: '0 16px' }}>
                <span>{t('storybook.separator.itemOne')}</span>
                <Separator orientation='vertical' />
                <span>{t('storybook.separator.itemTwo')}</span>
                <Separator orientation='vertical' />
                <span>{t('storybook.separator.itemThree')}</span>
            </div>
        );
    },
};
