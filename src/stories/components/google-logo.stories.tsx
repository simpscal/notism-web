import type { Meta, StoryObj } from '@storybook/react-vite';

import GoogleLogo from '@/uis/google-logo';

const meta = {
    title: 'Components/Display/GoogleLogo',
    component: GoogleLogo,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        className: { control: 'text' },
    },
} satisfies Meta<typeof GoogleLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        className: 'h-6 w-6',
    },
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <GoogleLogo className='h-4 w-4' />
            <GoogleLogo className='h-6 w-6' />
            <GoogleLogo className='h-8 w-8' />
            <GoogleLogo className='h-12 w-12' />
        </div>
    ),
};
