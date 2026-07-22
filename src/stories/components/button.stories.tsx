import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loader2, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/uis/button';

const meta = {
    title: 'Components/Inputs/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        },
        size: {
            control: 'select',
            options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
        },
        disabled: { control: 'boolean' },
        children: { control: 'text' },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        variant: 'default',
        size: 'default',
    },
    render: function Render(args) {
        const { t } = useTranslation();
        return <Button {...args}>{t('storybook.button.button')}</Button>;
    },
};

export const Variants: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Button variant='default'>{t('storybook.button.default')}</Button>
                <Button variant='destructive'>{t('storybook.button.destructive')}</Button>
                <Button variant='outline'>{t('storybook.button.outline')}</Button>
                <Button variant='secondary'>{t('storybook.button.secondary')}</Button>
                <Button variant='ghost'>{t('storybook.button.ghost')}</Button>
                <Button variant='link'>{t('storybook.button.link')}</Button>
            </div>
        );
    },
};

export const Sizes: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Button size='xs'>{t('storybook.button.extraSmall')}</Button>
                <Button size='sm'>{t('storybook.button.small')}</Button>
                <Button size='default'>{t('storybook.button.default')}</Button>
                <Button size='lg'>{t('storybook.button.large')}</Button>
            </div>
        );
    },
};

export const WithIcon: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ display: 'flex', gap: '8px' }}>
                <Button>
                    <Mail />
                    {t('storybook.button.loginWithEmail')}
                </Button>
            </div>
        );
    },
};

export const Loading: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <Button disabled>
                <Loader2 className='animate-spin' />
                {t('storybook.button.pleaseWait')}
            </Button>
        );
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
    render: function Render(args) {
        const { t } = useTranslation();
        return <Button {...args}>{t('storybook.button.disabled')}</Button>;
    },
};
