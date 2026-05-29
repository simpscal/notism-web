import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import { Checkbox } from '@/components/checkbox';
import { Label } from '@/components/label';

const meta = {
    title: 'Components/Inputs/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' },
    },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Checkbox id='default-cb' />
            <Label htmlFor='default-cb'>Accept terms and conditions</Label>
        </div>
    ),
};

export const Checked: Story = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Checkbox id='checked-cb' defaultChecked />
            <Label htmlFor='checked-cb'>Checked by default</Label>
        </div>
    ),
};

export const Disabled: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Checkbox id='disabled-cb' disabled />
                <Label htmlFor='disabled-cb'>Disabled unchecked</Label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Checkbox id='disabled-checked-cb' disabled defaultChecked />
                <Label htmlFor='disabled-checked-cb'>Disabled checked</Label>
            </div>
        </div>
    ),
};
