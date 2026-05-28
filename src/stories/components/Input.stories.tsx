import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from '@/components/input';

const meta = {
    title: 'Components/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
            description: 'HTML input type',
        },
        placeholder: {
            control: 'text',
        },
        disabled: {
            control: 'boolean',
        },
        'aria-invalid': {
            control: 'boolean',
            description: 'Shows error styling when true',
        },
    },
    args: {
        type: 'text',
        placeholder: 'Enter text…',
        disabled: false,
    },
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPlaceholder: Story = {
    args: {
        placeholder: 'Search for a restaurant or dish…',
        type: 'search',
    },
};

export const Email: Story = {
    args: {
        type: 'email',
        placeholder: 'you@example.com',
    },
};

export const Password: Story = {
    args: {
        type: 'password',
        placeholder: 'Enter your password',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        placeholder: 'This field is disabled',
    },
};

export const WithError: Story = {
    args: {
        'aria-invalid': true,
        defaultValue: 'invalid-email',
        placeholder: 'Email address',
    },
    render: args => (
        <div className='flex flex-col gap-1.5 w-[320px]'>
            <Input {...args} />
            <p className='text-xs text-destructive'>Please enter a valid email address.</p>
        </div>
    ),
};

export const WithLabel: Story = {
    render: () => (
        <div className='flex flex-col gap-1.5 w-[320px]'>
            <label className='text-sm font-medium' htmlFor='email-field'>
                Email address
            </label>
            <Input id='email-field' type='email' placeholder='you@example.com' />
            <p className='text-xs text-muted-foreground'>We'll never share your email.</p>
        </div>
    ),
};

export const AllStates: Story = {
    render: () => (
        <div className='flex flex-col gap-4 w-[320px]'>
            <div className='flex flex-col gap-1'>
                <p className='text-xs text-muted-foreground'>Default</p>
                <Input placeholder='Default input' />
            </div>
            <div className='flex flex-col gap-1'>
                <p className='text-xs text-muted-foreground'>With value</p>
                <Input defaultValue='Filled value' />
            </div>
            <div className='flex flex-col gap-1'>
                <p className='text-xs text-muted-foreground'>Disabled</p>
                <Input disabled placeholder='Disabled input' />
            </div>
            <div className='flex flex-col gap-1'>
                <p className='text-xs text-muted-foreground'>Error</p>
                <Input aria-invalid defaultValue='bad input' />
            </div>
        </div>
    ),
};
