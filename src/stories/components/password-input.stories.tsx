import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Label } from '@/components/label';
import { PasswordInput } from '@/components/password-input';

const meta = {
    title: 'Components/Inputs/PasswordInput',
    component: PasswordInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
    },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '280px' }}>
                <Label htmlFor='password'>{t('auth.password')}</Label>
                <PasswordInput id='password' placeholder={t('auth.enterPassword')} />
            </div>
        );
    },
};

export const Disabled: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ width: '280px' }}>
                <PasswordInput placeholder={t('storybook.button.disabled')} disabled />
            </div>
        );
    },
};
