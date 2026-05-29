import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from '@/components/checkbox';
import { Label } from '@/components/label';

const meta = {
    title: 'Components/Inputs/Label',
    component: Label,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        children: { control: 'text' },
    },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: 'Email address',
        htmlFor: 'email',
    },
};

export const WithCheckbox: Story = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Checkbox id='cb-label' />
            <Label htmlFor='cb-label'>Accept terms and conditions</Label>
        </div>
    ),
};
