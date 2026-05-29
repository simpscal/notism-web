import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckCircle, Package, Truck } from 'lucide-react';

import Timeline from '@/components/timeline';

const timelineItems = [
    {
        title: 'Order placed',
        description: 'Your order has been received',
        icon: Package,
        isCompleted: true,
        isCurrent: false,
        completedAt: '2024-01-15T10:00:00Z',
    },
    {
        title: 'Payment confirmed',
        description: 'Payment was processed successfully',
        icon: CheckCircle,
        isCompleted: true,
        isCurrent: false,
        completedAt: '2024-01-15T10:05:00Z',
    },
    {
        title: 'Shipped',
        description: 'Package is on the way',
        icon: Truck,
        isCompleted: false,
        isCurrent: true,
        completedAt: null,
    },
    {
        title: 'Delivered',
        description: 'Package delivered to your door',
        icon: CheckCircle,
        isCompleted: false,
        isCurrent: false,
        completedAt: null,
    },
];

const meta = {
    title: 'Components/Display/Timeline',
    component: Timeline,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        items: timelineItems,
    },
    render: args => (
        <div style={{ width: '360px' }}>
            <Timeline {...args} />
        </div>
    ),
};

export const AllCompleted: Story = {
    render: () => (
        <div style={{ width: '360px' }}>
            <Timeline
                items={timelineItems.map(item => ({
                    ...item,
                    isCompleted: true,
                    isCurrent: false,
                    completedAt: '2024-01-15T12:00:00Z',
                }))}
            />
        </div>
    ),
};
