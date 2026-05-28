import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import { Checkbox } from '@/components/checkbox';
import { Label } from '@/components/label';

const meta = {
    title: 'Components/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <Checkbox id='default' />,
};

export const Checked: Story = {
    render: () => <Checkbox id='checked' defaultChecked />,
};

export const Disabled: Story = {
    render: () => <Checkbox id='disabled' disabled />,
};

export const DisabledChecked: Story = {
    render: () => <Checkbox id='disabled-checked' disabled defaultChecked />,
};

export const WithLabel: Story = {
    render: () => (
        <div className='flex items-center gap-2'>
            <Checkbox id='with-label' />
            <Label htmlFor='with-label'>Accept terms and conditions</Label>
        </div>
    ),
};

export const WithDescription: Story = {
    render: () => (
        <div className='flex items-start gap-2'>
            <Checkbox id='with-desc' className='mt-0.5' />
            <div className='flex flex-col gap-1'>
                <Label htmlFor='with-desc'>Marketing emails</Label>
                <p className='text-sm text-muted-foreground'>
                    Receive emails about new products, features, and promotions.
                </p>
            </div>
        </div>
    ),
};

function CheckboxGroupDemo() {
    const [selected, setSelected] = React.useState<string[]>(['email']);
    const toggle = (id: string) =>
        setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

    const options = [
        { id: 'email', label: 'Email notifications' },
        { id: 'sms', label: 'SMS notifications' },
        { id: 'push', label: 'Push notifications' },
    ];

    return (
        <div className='flex flex-col gap-3'>
            {options.map(opt => (
                <div key={opt.id} className='flex items-center gap-2'>
                    <Checkbox id={opt.id} checked={selected.includes(opt.id)} onCheckedChange={() => toggle(opt.id)} />
                    <Label htmlFor={opt.id}>{opt.label}</Label>
                </div>
            ))}
        </div>
    );
}

export const CheckboxGroup: Story = {
    render: () => <CheckboxGroupDemo />,
};

export const Invalid: Story = {
    render: () => (
        <div className='flex items-center gap-2'>
            <Checkbox id='invalid' aria-invalid='true' />
            <Label htmlFor='invalid' className='text-destructive'>
                You must agree to continue
            </Label>
        </div>
    ),
};
