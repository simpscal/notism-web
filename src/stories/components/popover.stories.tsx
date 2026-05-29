import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover';

const meta = {
    title: 'Components/Utilities/Popover',
    component: Popover,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant='outline'>Open popover</Button>
            </PopoverTrigger>
            <PopoverContent className='w-80'>
                <div style={{ display: 'grid', gap: '16px' }}>
                    <div style={{ gap: '8px', display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ fontWeight: 500, lineHeight: 1 }}>Dimensions</h4>
                        <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                            Set the dimensions for the layer.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gap: '8px' }}>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 2fr',
                                gap: '16px',
                                alignItems: 'center',
                            }}
                        >
                            <Label htmlFor='width'>Width</Label>
                            <Input id='width' defaultValue='100%' />
                        </div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 2fr',
                                gap: '16px',
                                alignItems: 'center',
                            }}
                        >
                            <Label htmlFor='height'>Height</Label>
                            <Input id='height' defaultValue='25px' />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    ),
};
