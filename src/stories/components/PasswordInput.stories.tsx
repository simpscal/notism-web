import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '@/components/label';
import { PasswordInput } from '@/components/password-input';

const meta = {
    title: 'Components/PasswordInput',
    component: PasswordInput,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <div className='w-[320px]'>
            <PasswordInput placeholder='Enter your password' />
        </div>
    ),
};

export const WithLabel: Story = {
    render: () => (
        <div className='w-[320px] flex flex-col gap-2'>
            <Label htmlFor='password'>Password</Label>
            <PasswordInput id='password' placeholder='Enter your password' />
        </div>
    ),
};

export const WithValue: Story = {
    render: () => (
        <div className='w-[320px] flex flex-col gap-2'>
            <Label htmlFor='password-value'>Password</Label>
            <PasswordInput id='password-value' defaultValue='mysecretpassword123' />
        </div>
    ),
};

export const ErrorState: Story = {
    render: () => (
        <div className='w-[320px] flex flex-col gap-2'>
            <Label htmlFor='password-error'>Password</Label>
            <PasswordInput
                id='password-error'
                aria-invalid='true'
                defaultValue='short'
                placeholder='Enter your password'
            />
            <p className='text-sm text-destructive'>Password must be at least 8 characters.</p>
        </div>
    ),
};

export const Disabled: Story = {
    render: () => (
        <div className='w-[320px] flex flex-col gap-2'>
            <Label htmlFor='password-disabled'>Password</Label>
            <PasswordInput id='password-disabled' disabled placeholder='Enter your password' />
        </div>
    ),
};

export const AllStates: Story = {
    render: () => (
        <div className='flex flex-col gap-6 w-[320px]'>
            <div className='flex flex-col gap-2'>
                <Label>Default</Label>
                <PasswordInput placeholder='Enter password' />
            </div>
            <div className='flex flex-col gap-2'>
                <Label>With value</Label>
                <PasswordInput defaultValue='mysecretpassword123' />
            </div>
            <div className='flex flex-col gap-2'>
                <Label>Error</Label>
                <PasswordInput aria-invalid='true' defaultValue='short' />
                <p className='text-sm text-destructive'>Password must be at least 8 characters.</p>
            </div>
            <div className='flex flex-col gap-2'>
                <Label>Disabled</Label>
                <PasswordInput disabled placeholder='Enter password' />
            </div>
        </div>
    ),
};
