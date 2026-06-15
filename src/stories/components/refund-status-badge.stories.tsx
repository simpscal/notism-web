import type { Meta, StoryObj } from '@storybook/react-vite';

import { RefundStatusBadge, RefundStatusEnum } from '@/features/order';

const meta = {
    title: 'Components/Display/Refund Status Badge',
    component: RefundStatusBadge,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        status: {
            control: 'select',
            options: Object.values(RefundStatusEnum),
        },
    },
} satisfies Meta<typeof RefundStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {
    args: {
        status: RefundStatusEnum.Pending,
    },
};

export const Processing: Story = {
    args: {
        status: RefundStatusEnum.Processing,
    },
};

export const Paid: Story = {
    args: {
        status: RefundStatusEnum.Paid,
    },
};

export const Failed: Story = {
    args: {
        status: RefundStatusEnum.Failed,
    },
};

export const AllStatuses: Story = {
    args: {
        status: RefundStatusEnum.Pending,
    },
    render: () => (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <RefundStatusBadge status={RefundStatusEnum.Pending} />
            <RefundStatusBadge status={RefundStatusEnum.Processing} />
            <RefundStatusBadge status={RefundStatusEnum.Paid} />
            <RefundStatusBadge status={RefundStatusEnum.Failed} />
        </div>
    ),
};
