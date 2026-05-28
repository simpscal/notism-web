import type { Meta, StoryObj } from '@storybook/react-vite';

import Timeline from '@/components/timeline';

// Inline SVG icon components to avoid importing icon libraries
const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <circle cx='12' cy='12' r='10' />
        <path d='m9 12 2 2 4-4' />
    </svg>
);

const ShoppingBagIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <path d='M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z' />
        <line x1='3' x2='21' y1='6' y2='6' />
        <path d='M16 10a4 4 0 0 1-8 0' />
    </svg>
);

const CookingPotIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <path d='M2 12h20' />
        <path d='M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8' />
        <path d='m4 8 16-4' />
        <path d='m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8' />
    </svg>
);

const PackageIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <path d='m7.5 4.27 9 5.15' />
        <path d='M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z' />
        <path d='m3.3 7 8.7 5 8.7-5' />
        <path d='M12 22V12' />
    </svg>
);

const TruckIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
    >
        <path d='M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3' />
        <rect width='7' height='7' x='14' y='10' rx='1' />
        <circle cx='17.5' cy='17.5' r='2.5' />
        <circle cx='7.5' cy='17.5' r='2.5' />
    </svg>
);

const meta = {
    title: 'Components/Timeline',
    component: Timeline,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Delivered: Story = {
    render: () => (
        <div className='w-[320px]'>
            <Timeline
                items={[
                    {
                        title: 'Order placed',
                        description: 'Your order has been received.',
                        icon: ShoppingBagIcon,
                        isCompleted: true,
                        isCurrent: false,
                        completedAt: '2024-05-26T10:05:00Z',
                    },
                    {
                        title: 'Preparing',
                        description: 'The kitchen is preparing your meal.',
                        icon: CookingPotIcon,
                        isCompleted: true,
                        isCurrent: false,
                        completedAt: '2024-05-26T10:20:00Z',
                    },
                    {
                        title: 'Ready for pickup',
                        description: 'Your order is ready at the counter.',
                        icon: PackageIcon,
                        isCompleted: true,
                        isCurrent: false,
                        completedAt: '2024-05-26T10:35:00Z',
                    },
                    {
                        title: 'Delivered',
                        description: 'Order delivered successfully.',
                        icon: CheckCircleIcon,
                        isCompleted: true,
                        isCurrent: false,
                        completedAt: '2024-05-26T10:50:00Z',
                    },
                ]}
            />
        </div>
    ),
};

export const InProgress: Story = {
    render: () => (
        <div className='w-[320px]'>
            <Timeline
                items={[
                    {
                        title: 'Order placed',
                        icon: ShoppingBagIcon,
                        isCompleted: true,
                        isCurrent: false,
                        completedAt: '2024-05-26T10:05:00Z',
                    },
                    {
                        title: 'Preparing',
                        icon: CookingPotIcon,
                        isCompleted: false,
                        isCurrent: true,
                        completedAt: null,
                    },
                    {
                        title: 'Ready for pickup',
                        icon: PackageIcon,
                        isCompleted: false,
                        isCurrent: false,
                        completedAt: null,
                    },
                    {
                        title: 'Out for delivery',
                        icon: TruckIcon,
                        isCompleted: false,
                        isCurrent: false,
                        completedAt: null,
                    },
                    {
                        title: 'Delivered',
                        icon: CheckCircleIcon,
                        isCompleted: false,
                        isCurrent: false,
                        completedAt: null,
                    },
                ]}
            />
        </div>
    ),
};

export const Pending: Story = {
    render: () => (
        <div className='w-[320px]'>
            <Timeline
                items={[
                    {
                        title: 'Order placed',
                        icon: ShoppingBagIcon,
                        isCompleted: false,
                        isCurrent: true,
                        completedAt: null,
                    },
                    {
                        title: 'Preparing',
                        icon: CookingPotIcon,
                        isCompleted: false,
                        isCurrent: false,
                        completedAt: null,
                    },
                    {
                        title: 'Ready for pickup',
                        icon: PackageIcon,
                        isCompleted: false,
                        isCurrent: false,
                        completedAt: null,
                    },
                    {
                        title: 'Delivered',
                        icon: CheckCircleIcon,
                        isCompleted: false,
                        isCurrent: false,
                        completedAt: null,
                    },
                ]}
            />
        </div>
    ),
};
