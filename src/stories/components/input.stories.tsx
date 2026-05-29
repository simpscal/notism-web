import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/input';
import { Label } from '@/components/label';

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
        placeholder: 'Enter text...',
    },
    render: args => (
        <div style={{ width: '280px' }}>
            <Input {...args} />
        </div>
    ),
};

export const WithLabel: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '280px' }}>
                <Label htmlFor='email'>{t('storybook.input.email')}</Label>
                <Input type='email' id='email' placeholder='you@example.com' />
            </div>
        );
    },
};

export const Disabled: Story = {
    render: () => (
        <div style={{ width: '280px' }}>
            <Input type='text' placeholder='Disabled input' disabled />
        </div>
    ),
};

export const Invalid: Story = {
    render: () => (
        <div style={{ width: '280px' }}>
            <Input type='email' placeholder='Invalid email' aria-invalid />
        </div>
    ),
};

export const Types: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '280px' }}>
            <Input type='text' placeholder='Text input' />
            <Input type='email' placeholder='Email input' />
            <Input type='password' placeholder='Password input' />
            <Input type='number' placeholder='Number input' />
            <Input type='search' placeholder='Search input' />
        </div>
    ),
};
