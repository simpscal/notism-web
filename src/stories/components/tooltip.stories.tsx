import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/tooltip';

const meta = {
    title: 'Components/Utilities/Tooltip',
    component: Tooltip,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant='outline'>Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Add to library</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
};

export const Positions: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '32px', padding: '32px' }}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant='outline' size='sm'>
                            Top
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side='top'>
                        <p>Tooltip on top</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant='outline' size='sm'>
                            Right
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side='right'>
                        <p>Tooltip on right</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant='outline' size='sm'>
                            Bottom
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side='bottom'>
                        <p>Tooltip on bottom</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant='outline' size='sm'>
                            Left
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side='left'>
                        <p>Tooltip on left</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    ),
};
