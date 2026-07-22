import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckCircle, Package, Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Timeline from '@/uis/timeline';

const timelineItems = [
    {
        titleKey: 'storybook.timeline.orderPlaced',
        descriptionKey: 'storybook.timeline.orderPlacedDescription',
        icon: Package,
        isCompleted: true,
        isCurrent: false,
        completedAt: '2024-01-15T10:00:00Z',
    },
    {
        titleKey: 'storybook.timeline.paymentConfirmed',
        descriptionKey: 'storybook.timeline.paymentConfirmedDescription',
        icon: CheckCircle,
        isCompleted: true,
        isCurrent: false,
        completedAt: '2024-01-15T10:05:00Z',
    },
    {
        titleKey: 'storybook.timeline.shipped',
        descriptionKey: 'storybook.timeline.shippedDescription',
        icon: Truck,
        isCompleted: false,
        isCurrent: true,
        completedAt: null,
    },
    {
        titleKey: 'storybook.timeline.delivered',
        descriptionKey: 'storybook.timeline.deliveredDescription',
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
    args: { items: [] },
    render: function Render() {
        const { t } = useTranslation();
        const items = timelineItems.map(({ titleKey, descriptionKey, ...rest }) => ({
            ...rest,
            title: t(titleKey),
            description: t(descriptionKey),
        }));
        return (
            <div style={{ width: '360px' }}>
                <Timeline items={items} />
            </div>
        );
    },
};

export const AllCompleted: Story = {
    args: { items: [] },
    render: function Render() {
        const { t } = useTranslation();
        const items = timelineItems.map(({ titleKey, descriptionKey, ...rest }) => ({
            ...rest,
            title: t(titleKey),
            description: t(descriptionKey),
            isCompleted: true,
            isCurrent: false,
            completedAt: '2024-01-15T12:00:00Z',
        }));
        return (
            <div style={{ width: '360px' }}>
                <Timeline items={items} />
            </div>
        );
    },
};
