import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';

import { Button } from '@/components/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/dropdown-menu';

const meta = {
    title: 'Components/DropdownMenu',
    component: DropdownMenu,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline'>Open menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-48'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <span>★</span> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span>⚙</span> Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <span>🔔</span> Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant='destructive'>
                    <span>→</span> Sign out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};

export const WithShortcuts: Story = {
    render: () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline'>Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-52'>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        New tab
                        <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        New window
                        <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                        New private window
                        <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        Save page
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Print
                        <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};

export const WithSubMenu: Story = {
    render: () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline'>Open</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-52'>
                <DropdownMenuItem>Back</DropdownMenuItem>
                <DropdownMenuItem>Forward</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>More tools</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuItem>Save page</DropdownMenuItem>
                        <DropdownMenuItem>Create shortcut</DropdownMenuItem>
                        <DropdownMenuItem>Developer tools</DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};

function WithCheckboxItemsDemo() {
    const [showStatus, setShowStatus] = React.useState(true);
    const [showTimestamps, setShowTimestamps] = React.useState(false);
    const [showIcons, setShowIcons] = React.useState(true);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline'>View options</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-52'>
                <DropdownMenuLabel>Display</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>
                    Show status
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={showTimestamps} onCheckedChange={setShowTimestamps}>
                    Show timestamps
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={showIcons} onCheckedChange={setShowIcons}>
                    Show icons
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export const WithCheckboxItems: Story = {
    render: () => <WithCheckboxItemsDemo />,
};

function WithRadioItemsDemo() {
    const [view, setView] = React.useState('grid');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline'>Layout: {view}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-44'>
                <DropdownMenuLabel>View as</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={view} onValueChange={setView}>
                    <DropdownMenuRadioItem value='grid'>Grid</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='list'>List</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='table'>Table</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export const WithRadioItems: Story = {
    render: () => <WithRadioItemsDemo />,
};

export const ElevatedDropdown: Story = {
    name: 'Elevated Shadow Tier',
    render: () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline'>Elevated menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-52 shadow-elevated'>
                <DropdownMenuLabel className='tracking-caps text-muted-foreground'>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        New order
                        <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        View analytics
                        <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Export report
                        <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant='destructive'>
                    Clear data
                    <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
};
