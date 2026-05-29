import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/button';
import ErrorState from '@/components/error-state';

const meta = {
    title: 'Components/Display/ErrorState',
    component: ErrorState,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        iconSize: {
            control: 'select',
            options: ['sm', 'md'],
        },
        title: { control: 'text' },
        description: { control: 'text' },
    },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: 'Something went wrong',
        description: 'An unexpected error occurred. Please try again later.',
        iconSize: 'md',
    },
};

export const Small: Story = {
    args: {
        title: 'Error loading data',
        description: 'Could not fetch the requested resource.',
        iconSize: 'sm',
    },
};

export const WithAction: Story = {
    args: {
        title: 'No data found',
        description: 'The item you are looking for does not exist.',
        action: <Button>Go back</Button>,
    },
};
