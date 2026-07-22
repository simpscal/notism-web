import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Input } from '@/uis/input';
import { Label } from '@/uis/label';

const meta = {
    title: 'Components/Inputs/Input',
    component: Input,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
        },
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
    },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        type: 'text',
    },
    render: function Render(args) {
        const { t } = useTranslation();
        return (
            <div style={{ width: '280px' }}>
                <Input placeholder={t('storybook.input.placeholders.text')} {...args} />
            </div>
        );
    },
};

export const WithLabel: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '280px' }}>
                <Label htmlFor='email'>{t('storybook.input.email')}</Label>
                <Input type='email' id='email' placeholder={t('storybook.input.placeholders.email')} />
            </div>
        );
    },
};

export const Disabled: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ width: '280px' }}>
                <Input type='text' placeholder={t('storybook.input.placeholders.disabled')} disabled />
            </div>
        );
    },
};

export const Invalid: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ width: '280px' }}>
                <Input type='email' placeholder={t('storybook.input.placeholders.invalid')} aria-invalid />
            </div>
        );
    },
};

export const Types: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '280px' }}>
                <Input type='text' placeholder={t('storybook.input.placeholders.textInput')} />
                <Input type='email' placeholder={t('storybook.input.placeholders.emailInput')} />
                <Input type='password' placeholder={t('storybook.input.placeholders.passwordInput')} />
                <Input type='number' placeholder={t('storybook.input.placeholders.numberInput')} />
                <Input type='search' placeholder={t('storybook.input.placeholders.searchInput')} />
            </div>
        );
    },
};
