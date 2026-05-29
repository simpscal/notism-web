import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import ErrorState from '@/components/error-state';

const meta = {
    title: 'Components/Display/ErrorState',
    component: ErrorState,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        iconSize: {
            control: 'select',
            options: ['sm', 'md'],
        },
        title: { control: 'text' },
        description: { control: 'text' },
    },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <ErrorState
                iconSize='md'
                title={t('storybook.errorState.defaultTitle')}
                description={t('storybook.errorState.defaultDescription')}
            />
        );
    },
};

export const Small: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <ErrorState
                iconSize='sm'
                title={t('storybook.errorState.smallTitle')}
                description={t('storybook.errorState.smallDescription')}
            />
        );
    },
};

export const WithAction: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <ErrorState
                title={t('storybook.errorState.noDataTitle')}
                description={t('storybook.errorState.noDataDescription')}
                action={<Button>{t('storybook.errorState.goBack')}</Button>}
            />
        );
    },
};
