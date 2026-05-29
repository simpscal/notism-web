import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/badge';

const meta = {
    title: 'Components/Display/Badge',
    component: Badge,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'secondary', 'destructive', 'outline', 'success'],
        },
    },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        variant: 'default',
    },
    render: function Render(args) {
        const { t } = useTranslation();
        return <Badge {...args}>{t('storybook.badge.badge')}</Badge>;
    },
};

export const Variants: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Badge variant='default'>{t('storybook.badge.default')}</Badge>
                <Badge variant='secondary'>{t('storybook.badge.secondary')}</Badge>
                <Badge variant='destructive'>{t('storybook.badge.destructive')}</Badge>
                <Badge variant='outline'>{t('storybook.badge.outline')}</Badge>
                <Badge variant='success'>{t('storybook.badge.success')}</Badge>
            </div>
        );
    },
};
