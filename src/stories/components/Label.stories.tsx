import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from '@/components/checkbox';
import { Input } from '@/components/input';
import { Label } from '@/components/label';

const meta = {
    title: 'Components/Label',
    component: Label,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        children: { control: 'text' },
    },
    args: {
        children: 'Label text',
    },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInput: Story = {
    render: () => (
        <div className='flex flex-col gap-1.5 w-[280px]'>
            <Label htmlFor='label-input'>Email address</Label>
            <Input id='label-input' type='email' placeholder='you@example.com' />
        </div>
    ),
};

export const Required: Story = {
    render: () => (
        <div className='flex flex-col gap-1.5 w-[280px]'>
            <Label htmlFor='label-required'>
                Full name
                <span className='text-destructive ml-0.5'>*</span>
            </Label>
            <Input id='label-required' placeholder='Jane Doe' />
        </div>
    ),
};

export const WithDescription: Story = {
    render: () => (
        <div className='flex flex-col gap-1.5 w-[280px]'>
            <Label htmlFor='label-desc'>Username</Label>
            <Input id='label-desc' placeholder='@handle' />
            <p className='text-sm text-muted-foreground'>Your unique identifier on the platform.</p>
        </div>
    ),
};

export const WithCheckbox: Story = {
    render: () => (
        <div className='flex items-center gap-2'>
            <Checkbox id='label-checkbox' />
            <Label htmlFor='label-checkbox'>I agree to the terms of service</Label>
        </div>
    ),
};

export const Disabled: Story = {
    render: () => (
        <div data-disabled='true' className='group flex flex-col gap-1.5 w-[280px]'>
            <Label htmlFor='label-disabled'>Disabled field</Label>
            <Input id='label-disabled' disabled placeholder='Not editable' />
        </div>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className='flex flex-col gap-6 w-[300px]'>
            <div className='flex flex-col gap-1.5'>
                <Label htmlFor='av-1'>Standard label</Label>
                <Input id='av-1' placeholder='Enter text' />
            </div>
            <div className='flex flex-col gap-1.5'>
                <Label htmlFor='av-2'>
                    Required field <span className='text-destructive'>*</span>
                </Label>
                <Input id='av-2' placeholder='Required' />
            </div>
            <div className='flex items-center gap-2'>
                <Checkbox id='av-3' />
                <Label htmlFor='av-3'>Checkbox label</Label>
            </div>
            <div data-disabled='true' className='group flex flex-col gap-1.5 opacity-50'>
                <Label htmlFor='av-4'>Disabled label</Label>
                <Input id='av-4' disabled placeholder='Disabled' />
            </div>
        </div>
    ),
};
