import type { Meta, StoryObj } from '@storybook/react-vite';

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
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '280px' }}>
            <Label htmlFor='password'>Password</Label>
            <PasswordInput id='password' placeholder='Enter your password' />
        </div>
    ),
};

export const Disabled: Story = {
    render: () => (
        <div style={{ width: '280px' }}>
            <PasswordInput placeholder='Disabled' disabled />
        </div>
    ),
};
