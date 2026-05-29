import type { Meta, StoryObj } from '@storybook/react-vite';

import { Separator } from '@/components/separator';

const meta = {
    title: 'Components/Layout/Separator',
    component: Separator,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        orientation: {
            control: 'select',
            options: ['horizontal', 'vertical'],
        },
    },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
    render: () => (
        <div style={{ width: '300px' }}>
            <div style={{ gap: '4px', display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1 }}>Radix Primitives</h4>
                <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>An open-source UI library.</p>
            </div>
            <Separator className='my-4' />
            <div style={{ display: 'flex', height: '20px', alignItems: 'center', gap: '16px', fontSize: '14px' }}>
                <div>Blog</div>
                <Separator orientation='vertical' />
                <div>Docs</div>
                <Separator orientation='vertical' />
                <div>Source</div>
            </div>
        </div>
    ),
};

export const Vertical: Story = {
    render: () => (
        <div style={{ display: 'flex', height: '60px', alignItems: 'center', gap: '16px', padding: '0 16px' }}>
            <span>Item One</span>
            <Separator orientation='vertical' />
            <span>Item Two</span>
            <Separator orientation='vertical' />
            <span>Item Three</span>
        </div>
    ),
};
