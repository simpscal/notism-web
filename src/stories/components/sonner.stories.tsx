import type { Meta, StoryObj } from '@storybook/react-vite';
import { toast } from 'sonner';

import { Button } from '@/components/button';
import { Toaster } from '@/components/sonner';

function SonnerDemo() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <Button
                variant='outline'
                onClick={() => toast('Event has been created', { description: 'Monday, January 3rd at 6:00pm' })}
            >
                Show Default Toast
            </Button>
            <Button variant='outline' onClick={() => toast.success('Profile updated successfully!')}>
                Show Success Toast
            </Button>
            <Button variant='outline' onClick={() => toast.error('Something went wrong.')}>
                Show Error Toast
            </Button>
            <Button variant='outline' onClick={() => toast.warning('You are running low on storage.')}>
                Show Warning Toast
            </Button>
            <Button variant='outline' onClick={() => toast.info('A new update is available.')}>
                Show Info Toast
            </Button>
            <Toaster />
        </div>
    );
}

const meta = {
    title: 'Components/Utilities/Sonner',
    component: SonnerDemo,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof SonnerDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
