import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip';

const meta = {
    title: 'Components/Tooltip',
    component: Tooltip,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant='outline'>Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>This is a tooltip</p>
            </TooltipContent>
        </Tooltip>
    ),
};

export const OnTop: Story = {
    render: () => (
        <div className='pt-12'>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant='outline'>Tooltip on top</Button>
                </TooltipTrigger>
                <TooltipContent side='top'>
                    <p>Appears above the trigger</p>
                </TooltipContent>
            </Tooltip>
        </div>
    ),
};

export const OnBottom: Story = {
    render: () => (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant='outline'>Tooltip on bottom</Button>
            </TooltipTrigger>
            <TooltipContent side='bottom'>
                <p>Appears below the trigger</p>
            </TooltipContent>
        </Tooltip>
    ),
};

export const OnLeft: Story = {
    render: () => (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant='outline'>Tooltip on left</Button>
            </TooltipTrigger>
            <TooltipContent side='left'>
                <p>Appears to the left</p>
            </TooltipContent>
        </Tooltip>
    ),
};

export const OnRight: Story = {
    render: () => (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant='outline'>Tooltip on right</Button>
            </TooltipTrigger>
            <TooltipContent side='right'>
                <p>Appears to the right</p>
            </TooltipContent>
        </Tooltip>
    ),
};

export const OnIconButton: Story = {
    render: () => (
        <div className='flex items-center gap-2'>
            {[
                { label: 'Edit', icon: '✎' },
                { label: 'Duplicate', icon: '⊕' },
                { label: 'Delete', icon: '✕' },
            ].map(action => (
                <Tooltip key={action.label}>
                    <TooltipTrigger asChild>
                        <Button variant='ghost' size='icon' aria-label={action.label}>
                            {action.icon}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{action.label}</p>
                    </TooltipContent>
                </Tooltip>
            ))}
        </div>
    ),
};

export const WithKeyboardShortcut: Story = {
    render: () => (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button>Save</Button>
            </TooltipTrigger>
            <TooltipContent className='shadow-elevated'>
                <p>
                    Save changes{' '}
                    <kbd className='ml-1 rounded border bg-muted px-1 py-0.5 font-mono text-[10px]'>⌘S</kbd>
                </p>
            </TooltipContent>
        </Tooltip>
    ),
};
