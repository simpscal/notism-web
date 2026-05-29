import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '@/components/label';
import { Switch } from '@/components/switch';

const meta = {
    title: 'Components/Inputs/Switch',
    component: Switch,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' },
        defaultChecked: { control: 'boolean' },
    },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Switch id='airplane-mode' />
            <Label htmlFor='airplane-mode'>Airplane Mode</Label>
        </div>
    ),
};

export const Checked: Story = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Switch id='notifications' defaultChecked />
            <Label htmlFor='notifications'>Enable notifications</Label>
        </div>
    ),
};

export const Disabled: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Switch id='disabled-off' disabled />
                <Label htmlFor='disabled-off'>Disabled off</Label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Switch id='disabled-on' disabled defaultChecked />
                <Label htmlFor='disabled-on'>Disabled on</Label>
            </div>
        </div>
    ),
};
