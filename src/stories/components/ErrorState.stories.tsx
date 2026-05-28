import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/button';
import ErrorState from '@/components/error-state';

const meta = {
    title: 'Components/ErrorState',
    component: ErrorState,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
    argTypes: {
        iconSize: {
            control: 'select',
            options: ['sm', 'md'],
        },
        title: { control: 'text' },
        description: { control: 'text' },
    },
    args: {
        title: 'Something went wrong',
        description: 'We ran into an unexpected error. Please try again later.',
        iconSize: 'md',
    },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
    args: {
        title: 'Failed to load data',
        description: 'We could not retrieve your data. Check your connection and try again.',
        action: <Button onClick={() => alert('Retrying…')}>Retry</Button>,
    },
};

export const Small: Story = {
    args: {
        iconSize: 'sm',
        title: 'No results found',
        description: 'Try adjusting your search or filters.',
    },
};

export const SmallWithAction: Story = {
    args: {
        iconSize: 'sm',
        title: 'Could not load items',
        description: 'There was a problem fetching this list.',
        action: <Button size='sm'>Reload</Button>,
    },
};

export const NotFoundPage: Story = {
    args: {
        title: '404 — Page not found',
        description: "The page you're looking for doesn't exist or has been moved.",
        action: (
            <Button variant='outline' onClick={() => history.back()}>
                Go back
            </Button>
        ),
    },
};

export const CustomIcon: Story = {
    args: {
        title: 'Connection lost',
        description: 'You appear to be offline. Reconnect and try again.',
        icon: (
            <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-16 w-16 text-destructive'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
            >
                <line x1='1' y1='1' x2='23' y2='23' />
                <path d='M16.72 11.06A10.94 10.94 0 0 1 19 12.55' />
                <path d='M5 12.55a10.94 10.94 0 0 1 5.17-2.39' />
                <path d='M10.71 5.05A16 16 0 0 1 22.56 9' />
                <path d='M1.42 9a15.91 15.91 0 0 1 4.7-2.88' />
                <path d='M8.53 16.11a6 6 0 0 1 6.95 0' />
                <line x1='12' y1='20' x2='12.01' y2='20' />
            </svg>
        ),
    },
};
