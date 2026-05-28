import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Label } from '@/components/label';
import { Textarea } from '@/components/textarea';

const meta = {
    title: 'Components/Textarea',
    component: Textarea,
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' },
        placeholder: { control: 'text' },
    },
    args: {
        className: 'w-[320px]',
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: 'Type your message here…',
    },
};

export const WithLabel: Story = {
    render: () => (
        <div className='flex flex-col gap-2 w-[320px]'>
            <Label htmlFor='description'>Description</Label>
            <Textarea id='description' placeholder='Describe the menu item…' />
        </div>
    ),
};

export const WithValue: Story = {
    args: {
        defaultValue:
            'A classic Neapolitan pizza with San Marzano tomato sauce, fresh mozzarella, and basil. Baked in a wood-fired oven at 900°F for 90 seconds.',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        defaultValue: 'This field is read-only.',
    },
};

export const ErrorState: Story = {
    render: () => (
        <div className='flex flex-col gap-2 w-[320px]'>
            <Label htmlFor='notes-error'>Order notes</Label>
            <Textarea id='notes-error' aria-invalid='true' defaultValue='x' />
            <p className='text-sm text-destructive'>Notes must be at least 10 characters.</p>
        </div>
    ),
};

function WithCharacterCountDemo() {
    const maxLength = 200;
    const [value, setValue] = useState('');
    return (
        <div className='flex flex-col gap-1 w-[320px]'>
            <Label htmlFor='with-count'>Special instructions</Label>
            <Textarea
                id='with-count'
                placeholder='Any special requests for your order…'
                maxLength={maxLength}
                value={value}
                onChange={e => setValue(e.target.value)}
            />
            <p className='text-xs text-muted-foreground text-right'>
                {value.length} / {maxLength}
            </p>
        </div>
    );
}

export const WithCharacterCount: Story = {
    render: () => <WithCharacterCountDemo />,
};

export const AllStates: Story = {
    render: () => (
        <div className='flex flex-col gap-6 w-[320px]'>
            <div className='flex flex-col gap-2'>
                <Label>Default</Label>
                <Textarea placeholder='Type here…' />
            </div>
            <div className='flex flex-col gap-2'>
                <Label>With value</Label>
                <Textarea defaultValue='Some existing content.' />
            </div>
            <div className='flex flex-col gap-2'>
                <Label>Error</Label>
                <Textarea aria-invalid='true' defaultValue='Too short' />
                <p className='text-sm text-destructive'>Minimum 20 characters required.</p>
            </div>
            <div className='flex flex-col gap-2'>
                <Label>Disabled</Label>
                <Textarea disabled defaultValue='Cannot edit this.' />
            </div>
        </div>
    ),
};
