import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '@/components/label';
import { Switch } from '@/components/switch';

const meta = {
    title: 'Components/Switch',
    component: Switch,
    tags: ['autodocs'],
    argTypes: {
        checked: { control: 'boolean' },
        disabled: { control: 'boolean' },
        defaultChecked: { control: 'boolean' },
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
    args: { defaultChecked: true },
};

export const Unchecked: Story = {
    args: { defaultChecked: false },
};

export const Disabled: Story = {
    args: { disabled: true },
};

export const DisabledChecked: Story = {
    args: { disabled: true, defaultChecked: true },
};

export const WithLabel: Story = {
    render: () => (
        <div className='flex items-center gap-2'>
            <Switch id='notifications' defaultChecked />
            <Label htmlFor='notifications'>Enable notifications</Label>
        </div>
    ),
};

export const WithLabelAndDescription: Story = {
    render: () => (
        <div className='flex items-start justify-between gap-8 w-[360px]'>
            <div className='flex flex-col gap-1'>
                <Label htmlFor='email-notif' className='text-sm font-medium'>
                    Email notifications
                </Label>
                <p className='text-xs text-muted-foreground'>Receive order updates via email.</p>
            </div>
            <Switch id='email-notif' defaultChecked />
        </div>
    ),
};

export const SettingsList: Story = {
    render: () => (
        <div className='flex flex-col gap-4 w-[360px]'>
            {[
                {
                    id: 'sw1',
                    label: 'Order notifications',
                    desc: 'Get notified when a new order arrives.',
                    checked: true,
                },
                {
                    id: 'sw2',
                    label: 'Low stock alerts',
                    desc: 'Alert me when menu items run low.',
                    checked: true,
                },
                {
                    id: 'sw3',
                    label: 'Marketing emails',
                    desc: 'Receive tips and promotional content.',
                    checked: false,
                },
                {
                    id: 'sw4',
                    label: 'Weekly reports',
                    desc: 'Get a summary of weekly performance.',
                    checked: false,
                },
            ].map(item => (
                <div key={item.id} className='flex items-start justify-between gap-4'>
                    <div className='flex flex-col gap-0.5'>
                        <Label htmlFor={item.id} className='text-sm font-medium'>
                            {item.label}
                        </Label>
                        <p className='text-xs text-muted-foreground'>{item.desc}</p>
                    </div>
                    <Switch id={item.id} defaultChecked={item.checked} />
                </div>
            ))}
        </div>
    ),
};
